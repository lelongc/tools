import os
import sys
import time
import json
import uuid
import requests
import subprocess
from datetime import datetime
from pysat.solvers import Glucose4

sys.stdout.reconfigure(encoding='utf-8')

# Cấu hình ví & hợp đồng
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
AGENT_ID = "31945225528577037061839722470168799697582568106216021014290393903276758886237"
MCP_URL = "https://mcp.nonceprotocol.xyz/mcp"
AUTH_CHALLENGE_URL = "https://mcp.nonceprotocol.xyz/auth/challenge"
AUTH_VERIFY_URL = "https://mcp.nonceprotocol.xyz/auth/verify"

from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).resolve().parent / ".env")

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

CURRENT_TOKEN = None

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

def get_auth_token():
    global CURRENT_TOKEN
    log("🔑 Đang lấy Bearer Token xác thực MCP Nonce Protocol...")
    
    r = requests.post(AUTH_CHALLENGE_URL, json={"wallet": WALLET}, timeout=10)
    if r.status_code != 200:
        log(f"Lỗi lấy challenge: {r.status_code}")
        return None
        
    data = r.json()
    challenge = data.get("challenge")
    wallet_req = data.get("walletRequest")
    
    # Ký EIP-712 bằng baw CLI
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
        "--binanceChainId", "56",
        "--signType", "EIP712",
        "--message", json.dumps(wallet_req),
        "--json"
    ]
    p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    p_json = json.loads(p_proc.stdout)
    req_id = p_json.get("data", {}).get("requestId")
    
    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
        "--requestId", req_id,
        "--json"
    ]
    e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    e_json = json.loads(e_proc.stdout)
    sig_raw = e_json.get("data", {}).get("signature")
    rec_raw = e_json.get("data", {}).get("signatureRecovery", "00")
    
    v_hex = "1c" if rec_raw == "01" else "1b"
    sig_65 = "0x" + sig_raw + v_hex
    
    v_res = requests.post(AUTH_VERIFY_URL, json={"wallet": WALLET, "challenge": challenge, "signature": sig_65}, timeout=10)
    if v_res.status_code == 200:
        CURRENT_TOKEN = v_res.json().get("token")
        log("✅ Xác thực MCP thành công! Đã có Token.")
        return CURRENT_TOKEN
    else:
        log(f"❌ Xác thực thất bại: {v_res.text}")
        return None

def call_mcp_tool(name, args):
    global CURRENT_TOKEN
    if not CURRENT_TOKEN:
        CURRENT_TOKEN = get_auth_token()
        
    headers = {
        "Authorization": f"Bearer {CURRENT_TOKEN}",
        "Accept": "application/json, text/event-stream",
        "Content-Type": "application/json"
    }
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": args}
    }
    r = requests.post(MCP_URL, headers=headers, json=payload, timeout=15)
    if r.status_code == 401: # Token hết hạn
        log("🔄 Token MCP hết hạn, đang làm mới...")
        CURRENT_TOKEN = get_auth_token()
        headers["Authorization"] = f"Bearer {CURRENT_TOKEN}"
        r = requests.post(MCP_URL, headers=headers, json=payload, timeout=15)
        
    try:
        return r.json().get("result", {})
    except Exception:
        return None

def check_onchain_status():
    """Kiểm tra trực tiếp trên BSC RPC xem đã unpause và mở admission chưa"""
    rpcs = [
        "https://bsc-dataseed1.binance.org/",
        "https://bsc.publicnode.com",
        "https://binance.llamarpc.com"
    ]
    freemint_contract = "0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e"
    nft_contract = "0x053259A3D30E63d9447E3d90813C6a494bcB398a"
    
    is_paused = True
    supply = 0
    
    for rpc in rpcs:
        try:
            # 1. paused() 0x5c975abb
            p_req = {"jsonrpc":"2.0","method":"eth_call","params":[{"to": freemint_contract, "data": "0x5c975abb"}, "latest"],"id":1}
            r = requests.post(rpc, json=p_req, timeout=4)
            res = r.json().get("result")
            if res and res != "0x":
                is_paused = (int(res, 16) == 1)
                
            # 2. totalSupply() 0x18160ddd
            s_req = {"jsonrpc":"2.0","method":"eth_call","params":[{"to": nft_contract, "data": "0x18160ddd"}, "latest"],"id":2}
            r2 = requests.post(rpc, json=s_req, timeout=4)
            res2 = r2.json().get("result")
            if res2 and res2 != "0x":
                supply = int(res2, 16)
            return is_paused, supply
        except Exception:
            continue
            
    return is_paused, supply

def solve_sat_problem(clauses, var_count):
    """Giải bài toán SAT bằng solver Glucose4 siêu tốc"""
    log(f"🧠 Đang giải {len(clauses)} mệnh đề logic trên {var_count} biến...")
    start_t = time.time()
    g = Glucose4()
    for c in clauses:
        g.add_clause(c)
        
    if g.solve():
        model = g.get_model()
        model_set = set(model)
        assignment_chars = []
        for i in range(1, var_count + 1):
            if i in model_set:
                assignment_chars.append("1")
            else:
                assignment_chars.append("0")
        assignment_str = "".join(assignment_chars)
        cost_t = time.time() - start_t
        log(f"🎉 GIẢI THÀNH CÔNG trong {cost_t:.2f} giây! Chiều dài kết quả: {len(assignment_str)}")
        return assignment_str
    else:
        log("❌ Không tìm thấy nghiệm thỏa mãn (UNSAT)!")
        return None

def run_single_attempt():
    """Thực hiện trọn vẹn 1 lượt thi và mint 1 NFT"""
    idemp_key = str(uuid.uuid4())
    log(f"🚀 Bắt đầu Attempt mới (Idempotency: {idemp_key})...")
    
    # 1. Prepare Attempt
    prep_res = call_mcp_tool("prepare_attempt", {
        "wallet": WALLET,
        "beneficiary": WALLET,
        "agentId": AGENT_ID,
        "idempotencyKey": idemp_key
    })
    
    if not prep_res:
        log("Lỗi prepare_attempt")
        return False
        
    content_text = prep_res.get("content", [{}])[0].get("text", "{}")
    prep_data = json.loads(content_text)
    attempt_id = prep_data.get("attemptId")
    wallet_req = prep_data.get("startWalletRequest")
    
    if not attempt_id or not wallet_req:
        log(f"Không nhận được attemptId: {content_text}")
        return False
        
    log(f"Đã nhận attemptId: {attempt_id}. Đang ký startAuthorization...")
    
    # 2. Ký startAuthorization
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
        "--binanceChainId", "56",
        "--signType", "EIP712",
        "--message", json.dumps(wallet_req),
        "--json"
    ]
    p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    p_json = json.loads(p_proc.stdout)
    req_id = p_json.get("data", {}).get("requestId")
    
    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
        "--requestId", req_id,
        "--json"
    ]
    e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    e_json = json.loads(e_proc.stdout)
    sig_raw = e_json.get("data", {}).get("signature")
    rec_raw = e_json.get("data", {}).get("signatureRecovery", "00")
    v_hex = "1c" if rec_raw == "01" else "1b"
    sig_65 = "0x" + sig_raw + v_hex
    
    # 3. Start Attempt
    start_res = call_mcp_tool("start_attempt", {
        "attemptId": attempt_id,
        "signature": sig_65
    })
    start_text = start_res.get("content", [{}])[0].get("text", "{}")
    start_data = json.loads(start_text)
    capability = start_data.get("capability")
    fragment_count = start_data.get("fragmentCount", 32)
    var_count = start_data.get("variables", 1536)
    
    log(f"Đã kích hoạt Challenge! Capability: {capability[:10]}... Thu thập {fragment_count} mảnh ghép...")
    
    # 4. Thu thập các mảnh đề bài
    all_clauses = []
    for f_idx in range(fragment_count):
        f_res = call_mcp_tool("inspect_fragment", {
            "attemptId": attempt_id,
            "capability": capability,
            "fragmentId": f_idx
        })
        f_text = f_res.get("content", [{}])[0].get("text", "{}")
        f_data = json.loads(f_text)
        clauses = f_data.get("clauses", [])
        all_clauses.extend(clauses)
        
    log(f"Đã thu thập đủ {len(all_clauses)} mệnh đề! Bắt đầu giải toán...")
    assignment = solve_sat_problem(all_clauses, var_count)
    if not assignment:
        return False
        
    # 5. Nộp bài
    log("Đang nộp bài giải lên MCP...")
    sub_res = call_mcp_tool("submit_artifact", {
        "attemptId": attempt_id,
        "capability": capability,
        "artifact": {"assignment": assignment},
        "nonce": "0"
    })
    sub_text = sub_res.get("content", [{}])[0].get("text", "{}")
    sub_data = json.loads(sub_text)
    status = sub_data.get("status")
    log(f"Kết quả nộp bài: {status}")
    
    if status != "VERIFIED_WIN":
        log(f"Không đạt VERIFIED_WIN: {sub_text}")
        return False
        
    # 6. Lấy giao dịch mint on-chain
    log("🎉 ĐÃ THẮNG CHALLENGE (VERIFIED_WIN)! Đang lấy giao dịch Mint...")
    m_res = call_mcp_tool("mint_transaction", {"attemptId": attempt_id})
    m_text = m_res.get("content", [{}])[0].get("text", "{}")
    m_data = json.loads(m_text)
    tx_calldata = m_data.get("calldata") or m_data.get("inputData")
    to_addr = m_data.get("to", "0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e")
    
    # 7. Gửi lệnh mint on-chain bằng Binance Agentic Wallet
    log("⚡ Đang gửi giao dịch Mint lên BNB Chain...")
    cmd_mint_prev = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "preview",
        "--binanceChainId", "56",
        "--from", WALLET,
        "--to", to_addr,
        "--value", "0",
        "--inputData", tx_calldata,
        "--json"
    ]
    mp_proc = subprocess.run(cmd_mint_prev, capture_output=True, text=True, shell=True)
    mp_json = json.loads(mp_proc.stdout)
    mint_req_id = mp_json.get("data", {}).get("requestId")
    
    cmd_mint_exec = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "execute",
        "--requestId", mint_req_id,
        "--json"
    ]
    me_proc = subprocess.run(cmd_mint_exec, capture_output=True, text=True, shell=True)
    log(f"Kết quả Mint Onchain: {me_proc.stdout}")
    send_telegram(f"🎉 <b>MINT THÀNH CÔNG 1 NONCE NFT!</b>\nKiểm tra ví của bạn trên BNB Chain ngay!")
    return True

def main_sniper_loop():
    log("🎯 BẮT ĐẦU CHẾ ĐỘ AUTO-SNIPER CANH ME 22:00 TỐI NAY...")
    send_telegram("🎯 <b>CHẾ ĐỘ CANH ME NONCE NFT 22:00 ĐÃ BẬT!</b>\nTool sẽ tự động giải đề và hốt 2 NFT ngay khi mở hợp đồng.")
    
    while True:
        try:
            is_paused, supply = check_onchain_status()
            now_str = datetime.now().strftime("%H:%M:%S")
            sys.stdout.write(f"\r[{now_str}] Đã mint: {supply}/7777 | Paused: {is_paused} | Đang canh... ")
            sys.stdout.flush()
            
            if not is_paused:
                print("\n🚨🚨🚨 PHÁT HIỆN HỢP ĐỒNG ĐÃ MỞ (UNPAUSED)! BẮT ĐẦU GIẬT ĐỀ VÀ MINT NGAY!")
                send_telegram("🚨 <b>HỢP ĐỒNG ĐÃ MỞ KHÓA! ĐANG TỰ ĐỘNG GIẢI ĐỀ VÀ MINT...</b>")
                
                # Thực hiện mint 2 lần (tối đa 2 con)
                success_count = 0
                for i in range(2):
                    log(f"\n--- Tiến hành Mint con số {i+1}/2 ---")
                    if run_single_attempt():
                        success_count += 1
                        time.sleep(3)
                    else:
                        break
                        
                log(f"🏁 Hoàn thành đợt săn! Đã mint thành công {success_count} NFTs!")
                send_telegram(f"🏁 <b>HOÀN TẤT ĐỢT SĂN!</b>\nĐã mint: {success_count}/2 NFTs. Lên chợ bán lấy 8 USDT ngay thôi!")
                break
                
            time.sleep(3)
        except KeyboardInterrupt:
            print("\nDừng tool.")
            break
        except Exception as e:
            log(f"Lỗi: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main_sniper_loop()
