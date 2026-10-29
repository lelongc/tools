import os
import sys
import time
import json
import uuid
import random
import requests
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv
from pysat.solvers import Glucose4

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
import functools
print = functools.partial(print, flush=True)

# Search for .env
env_paths = [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parents[1] / ".env",
    Path(__file__).resolve().parents[2] / "nonce-mint" / ".env"
]
for ep in env_paths:
    if ep.exists():
        load_dotenv(ep)
        break

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
AGENT_ID = "31945225528577037061839722470168799697582568106216021014290393903276758886237"
MCP_URL = "https://mcp.nonceprotocol.xyz/mcp"
AUTH_CHALLENGE_URL = "https://mcp.nonceprotocol.xyz/auth/challenge"
AUTH_VERIFY_URL = "https://mcp.nonceprotocol.xyz/auth/verify"
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

TOKEN_CACHE_FILE = Path(__file__).resolve().parent / "nonce_token.tmp"

SESSION = None

def get_session(force_new=False):
    global SESSION
    if SESSION is None or force_new:
        if SESSION:
            try:
                SESSION.close()
            except Exception:
                pass
        SESSION = requests.Session()
        adapter = requests.adapters.HTTPAdapter(pool_connections=10, pool_maxsize=10, max_retries=1)
        SESSION.mount("https://", adapter)
        SESSION.mount("http://", adapter)
    return SESSION

def log(msg):
    now = datetime.now().strftime("%H:%M:%S")
    print(f"[{now}] {msg}")

def send_telegram(msg):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "HTML"}, timeout=6)
    except Exception as e:
        log(f"Lỗi gửi Telegram: {e}")

def get_auth_token(force_refresh=False):
    if not force_refresh and TOKEN_CACHE_FILE.exists():
        try:
            token = TOKEN_CACHE_FILE.read_text().strip()
            if len(token) > 20:
                return token
        except Exception:
            pass

    log("🔑 Đang lấy Bearer Token xác thực MCP Nonce Protocol...")
    s = get_session()
    r = None
    for attempt in range(5):
        try:
            r = s.post(AUTH_CHALLENGE_URL, json={"wallet": WALLET}, timeout=25)
            if r.status_code == 200:
                break
            time.sleep(2)
        except Exception as e:
            log(f"Lỗi kết nối auth: {e}, thử lại...")
            time.sleep(2)

    if not r or r.status_code != 200:
        log("Không lấy được challenge từ auth endpoint.")
        return None

    data = r.json()
    challenge = data.get("challenge")
    wallet_req = data.get("walletRequest")

    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
        "--binanceChainId", "56",
        "--signType", "EIP712",
        "--message", json.dumps(wallet_req),
        "--json"
    ]
    p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    try:
        p_json = json.loads(p_proc.stdout)
    except Exception:
        return None
    req_id = p_json.get("data", {}).get("requestId")
    if not req_id:
        return None

    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
        "--requestId", req_id,
        "--json"
    ]
    e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    try:
        e_json = json.loads(e_proc.stdout)
    except Exception:
        return None
    sig_raw = e_json["data"]["signature"]
    rec_raw = e_json["data"].get("signatureRecovery", "00")
    sig_65 = "0x" + sig_raw + ("1c" if rec_raw == "01" else "1b")

    for v_att in range(3):
        try:
            v_res = s.post(AUTH_VERIFY_URL, json={"wallet": WALLET, "challenge": challenge, "signature": sig_65}, timeout=25)
            if v_res.status_code == 200:
                token = v_res.json().get("token")
                TOKEN_CACHE_FILE.write_text(token)
                log("✅ Đã lưu token xác thực MCP!")
                return token
        except Exception:
            time.sleep(2)
    return None

def mcp_call(token, name, args, timeout=25):
    s = get_session()
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json"
    }
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": args}
    }
    try:
        r = s.post(MCP_URL, headers=headers, json=payload, timeout=timeout)
        return r
    except Exception as e:
        get_session(force_new=True)  # Reset dead session
        return None

def solve_sat(clauses, var_count):
    log(f"🧠 Đang giải {len(clauses)} mệnh đề SAT trên {var_count} biến bằng Glucose4...")
    t0 = time.time()
    g = Glucose4()
    for c in clauses:
        g.add_clause(c)
    if g.solve():
        model = set(g.get_model())
        ans = "".join(["1" if i in model else "0" for i in range(1, var_count + 1)])
        log(f"🎉 GIẢI THÀNH CÔNG trong {time.time()-t0:.3f}s! Nghiệm dài {len(ans)} ký tự.")
        return ans
    log("❌ Không tìm được nghiệm thỏa mãn (UNSAT).")
    return None

def snipe_single(token):
    # Check protocol admission
    pi_r = mcp_call(token, "protocol_info", {})
    if pi_r and pi_r.status_code == 200:
        try:
            pi_text = pi_r.json().get("result", {}).get("content", [{}])[0].get("text", "{}")
            pi_data = json.loads(pi_text)
            if pi_data.get("admission") == "closed":
                log("⚠️ Protocol admission đang 'closed'. Chờ server mở lại cổng sau 10s...")
                time.sleep(10)
                return False
        except Exception:
            pass

    idemp_key = f"sf_{uuid.uuid4().hex[:20]}"
    log(f"\n🚀 Đang chen chân prepare_attempt (Key: {idemp_key})...")

    # 1. Loop prepare_attempt with proper pacing
    attempt_id = None
    wallet_req = None

    for try_count in range(80):
        r = mcp_call(token, "prepare_attempt", {
            "wallet": WALLET,
            "beneficiary": WALLET,
            "agentId": AGENT_ID,
            "idempotencyKey": idemp_key
        })

        if r is not None and r.status_code == 200:
            res_data = r.json()
            content = res_data.get("result", {}).get("content", [{}])[0].get("text", "{}")
            try:
                p_data = json.loads(content)
                if "attemptId" in p_data and "startWalletRequest" in p_data:
                    attempt_id = p_data.get("attemptId")
                    wallet_req = p_data.get("startWalletRequest")
                    log(f"🔥 CƯỚP ĐƯỢC ATTEMPT THÀNH CÔNG! AttemptId: {attempt_id}")
                    break
                else:
                    # Message inside 200 like SERVICE_UNAVAILABLE
                    msg = p_data.get("message") or p_data.get("code") or content[:60]
                    j = random.uniform(4.5, 6.0)
                    log(f"Server bận ({msg}), chờ {j:.1f}s (lần {try_count+1})...")
                    time.sleep(j)
            except Exception:
                time.sleep(4.0)
        elif r is not None and r.status_code == 401:
            log("Token hết hạn, làm mới...")
            token = get_auth_token(force_refresh=True)
            time.sleep(1)
        elif r is not None and r.status_code in [429, 503]:
            ra = float(r.headers.get("retry-after", 5))
            j = ra + random.uniform(0.5, 1.8)
            log(f"Server rate-limited (429), chờ {j:.1f}s theo nhịp server (lần {try_count+1})...")
            time.sleep(j)
        else:
            j = random.uniform(4.0, 5.5)
            log(f"Server busy (Drop/Reset), chờ {j:.1f}s (lần {try_count+1})...")
            time.sleep(j)

    if not attempt_id or not wallet_req:
        log("Không lấy được attempt sau nhiều lần thử.")
        return False

    # 2. Ký startAuthorization
    log("✍️ Đang ký startAuthorization qua Binance Agentic Wallet...")
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
        "--binanceChainId", "56",
        "--signType", "EIP712",
        "--message", json.dumps(wallet_req),
        "--json"
    ]
    p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    try:
        req_id = json.loads(p_proc.stdout)["data"]["requestId"]
    except Exception as e:
        log(f"Lỗi preview sign: {e} - stdout: {p_proc.stdout[:150]}")
        return False

    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
        "--requestId", req_id,
        "--json"
    ]
    e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    try:
        e_json = json.loads(e_proc.stdout)
        sig_raw = e_json["data"]["signature"]
        rec_raw = e_json["data"].get("signatureRecovery", "00")
        sig_65 = "0x" + sig_raw + ("1c" if rec_raw == "01" else "1b")
    except Exception as e:
        log(f"Lỗi execute sign: {e} - stdout: {e_proc.stdout[:150]}")
        return False

    # 3. start_attempt với retry
    log("🏁 Gọi start_attempt để kích hoạt đồng hồ thi...")
    start_data = None
    for s_try in range(20):
        start_r = mcp_call(token, "start_attempt", {"attemptId": attempt_id, "signature": sig_65})
        if start_r and start_r.status_code == 200:
            start_text = start_r.json().get("result", {}).get("content", [{}])[0].get("text", "{}")
            try:
                start_data = json.loads(start_text)
                if "capability" in start_data:
                    break
            except Exception:
                pass
        elif start_r and start_r.status_code == 429:
            ra = float(start_r.headers.get("retry-after", 5))
            time.sleep(ra + random.uniform(0.5, 1.5))
            continue
        time.sleep(random.uniform(3.0, 5.0))

    if not start_data or "capability" not in start_data:
        log("Lỗi start_attempt: Không kích hoạt được capability.")
        return False

    capability = start_data.get("capability")
    frag_count = start_data.get("fragmentCount", 32)
    var_count = start_data.get("variables", 1536)

    log(f"🎯 Kích hoạt thành công! Capability: {capability[:12]}... Cần thu thập {frag_count} mảnh đề bài...")

    # 4. Thu thập các mảnh đề bài với nhịp độ chuẩn xác
    all_clauses = []
    attempt_start = time.time()
    MAX_ATTEMPT_TIME = 1200  # 20 phút tối đa cho attempt

    for fid in range(frag_count):
        got_frag = False
        f_retry = 0
        while not got_frag:
            elapsed = int(time.time() - attempt_start)
            if elapsed > MAX_ATTEMPT_TIME:
                log(f"\n⏰ Đã hết 20 phút của attempt này ({elapsed}s)! Bỏ qua để săn vé mới...")
                return False

            f_retry += 1
            fr = mcp_call(token, "inspect_fragment", {
                "attemptId": attempt_id,
                "capability": capability,
                "fragmentId": fid
            })

            if fr and fr.status_code == 200:
                try:
                    f_json = fr.json()
                    f_text = f_json.get("result", {}).get("content", [{}])[0].get("text", "{}")
                    d = json.loads(f_text)
                    clauses = d.get("clauses", [])
                    if clauses:
                        all_clauses.extend(clauses)
                        got_frag = True
                        elapsed = int(time.time() - attempt_start)
                        log(f"  -> 🎉 Nhận mảnh {fid+1}/{frag_count} ({len(clauses)} mệnh đề | Thời gian: {elapsed}s)")
                        time.sleep(random.uniform(0.3, 0.7))
                        break
                    else:
                        # Server busy message inside 200
                        time.sleep(random.uniform(3.5, 5.0))
                except Exception:
                    time.sleep(random.uniform(3.0, 4.5))
            elif fr and fr.status_code == 401:
                log("Token hết hạn trong lúc tải mảnh, làm mới...")
                token = get_auth_token(force_refresh=True)
                time.sleep(1)
            elif fr and fr.status_code in [429, 503]:
                ra = float(fr.headers.get("retry-after", 5))
                wait_t = ra + random.uniform(0.5, 1.5)
                log(f"🧩 Mảnh {fid+1}/{frag_count}: Server bận (429), chờ {wait_t:.1f}s (đã qua {elapsed}s, lần {f_retry})...")
                time.sleep(wait_t)
            else:
                wait_t = random.uniform(4.0, 5.5)
                log(f"🧩 Mảnh {fid+1}/{frag_count}: Server Drop/Reset, chờ {wait_t:.1f}s (đã qua {elapsed}s, lần {f_retry})...")
                time.sleep(wait_t)

    log(f"✅ ĐÃ THU THẬP ĐỦ {frag_count} MẢNH ({len(all_clauses)} mệnh đề SAT)! Tổng thời gian tải: {int(time.time() - attempt_start)}s")

    # 5. Giải SAT siêu tốc bằng Glucose4
    assignment = solve_sat(all_clauses, var_count)
    if not assignment:
        log("Không tìm được nghiệm thỏa mãn.")
        return False

    # 6. Submit artifact
    log("📤 Đang nộp nghiệm bài giải lên Nonce Protocol MCP...")
    sub_data = None
    for sub_try in range(25):
        sub_r = mcp_call(token, "submit_artifact", {
            "attemptId": attempt_id,
            "capability": capability,
            "artifact": {"assignment": assignment},
            "nonce": "0"
        })
        if sub_r and sub_r.status_code == 200:
            try:
                sub_text = sub_r.json().get("result", {}).get("content", [{}])[0].get("text", "{}")
                sub_data = json.loads(sub_text)
                if "status" in sub_data:
                    break
            except Exception:
                pass
        elif sub_r and sub_r.status_code == 429:
            ra = float(sub_r.headers.get("retry-after", 5))
            time.sleep(ra + random.uniform(0.5, 1.5))
            continue
        time.sleep(random.uniform(2.5, 4.0))

    if not sub_data or sub_data.get("status") != "VERIFIED_WIN":
        log(f"Kết quả nộp: {sub_data.get('status') if sub_data else 'None'}")
        return False

    # 7. Lấy calldata Mint on-chain
    log("🎉 VERIFIED_WIN (CHIẾN THẮNG)! Đang lấy calldata Mint on-chain...")
    m_data = None
    for m_try in range(25):
        m_r = mcp_call(token, "mint_transaction", {"attemptId": attempt_id})
        if m_r and m_r.status_code == 200:
            try:
                m_data = json.loads(m_r.json().get("result", {}).get("content", [{}])[0].get("text", "{}"))
                if "calldata" in m_data or "inputData" in m_data:
                    break
            except Exception:
                pass
        elif m_r and m_r.status_code == 429:
            ra = float(m_r.headers.get("retry-after", 5))
            time.sleep(ra + random.uniform(0.5, 1.5))
            continue
        time.sleep(random.uniform(2.5, 4.0))

    if not m_data:
        log("Lỗi lấy mint_transaction")
        return False

    to_addr = m_data.get("to", "0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e")
    calldata = m_data.get("calldata") or m_data.get("inputData")

    log(f"⚡ Gửi giao dịch Mint lên BSC tới contract {to_addr}...")
    cmd_mint_prev = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "preview",
        "--binanceChainId", "56",
        "--from", WALLET,
        "--to", to_addr,
        "--value", "0",
        "--inputData", calldata,
        "--json"
    ]
    mp = subprocess.run(cmd_mint_prev, capture_output=True, text=True, shell=True)
    try:
        m_req_id = json.loads(mp.stdout)["data"]["requestId"]
    except Exception as e:
        log(f"Lỗi preview mint: {e} - stdout: {mp.stdout[:150]}")
        return False

    cmd_mint_exec = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "execute",
        "--requestId", m_req_id,
        "--json"
    ]
    me = subprocess.run(cmd_mint_exec, capture_output=True, text=True, shell=True)
    try:
        tx_hash = json.loads(me.stdout).get("data", {}).get("txHash")
    except Exception as e:
        log(f"Lỗi execute mint: {e} - stdout: {me.stdout[:150]}")
        return False

    log(f"🎉 MINT THÀNH CÔNG 1 NONCE NFT! TxHash: {tx_hash}")
    send_telegram(f"🎉 <b>MINT THÀNH CÔNG 1 NONCE NFT!</b>\nTx: <code>{tx_hash}</code>\nGiá chợ hiện tại ~8-10 USDT!")
    return True

def main():
    print("=" * 60)
    print("⚡ KHỞI ĐỘNG BULLETPROOF FAST SNIPER NONCE PROTOCOL GENESIS")
    print("=" * 60)
    token = get_auth_token()
    if not token:
        print("Lỗi lấy token.")
        return

    minted = 0
    attempt_round = 1
    # Chạy bền bỉ đến đúng 17:00 (5h chiều) hôm nay theo lệnh của bạn
    target_end = datetime.now().replace(hour=17, minute=0, second=0, microsecond=0)
    if datetime.now() >= target_end:
        target_end = target_end + timedelta(days=1)

    while datetime.now() < target_end and minted < 2:
        rem_hours = (target_end - datetime.now()).total_seconds() / 3600
        print(f"\n>>> VÒNG SĂN #{attempt_round} (Đã có: {minted}/2 NFTs | Chạy bền bỉ đến 17:00, còn lại: {rem_hours:.1f} tiếng) <<<")
        try:
            ok = snipe_single(token)
            if ok:
                minted += 1
                log(f"🏆 ĐÃ MINT ĐƯỢC {minted}/2 NFT!")
                if minted >= 2:
                    log("🎯 Đã đủ chỉ tiêu 2 NFTs tối đa của ví!")
                    break
                time.sleep(5)
            else:
                log("Lượt này chưa hoàn tất. Tự động thử lại lượt mới sau 2s...")
                time.sleep(2)
        except Exception as e:
            log(f"Ngoại lệ vòng săn: {e}. Thử lại sau 3s...")
            time.sleep(3)

        attempt_round += 1

    print("🏁 Kết thúc phiên săn. Hoàn tất!")

if __name__ == "__main__":
    main()
