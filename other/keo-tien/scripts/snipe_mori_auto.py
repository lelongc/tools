import subprocess
import json
import time
import datetime
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
CONTRACT = "0x5eB9936F910b1cFaA9994fbC7Ae98A279A3d0F89"
WEI = "4400000000000000" # 0.0044 BNB
INPUT_DATA = "0x1249c58b"
CHAIN_ID = "56"
TARGET_TS = 1793361600 # 2026-10-30 12:00:00 UTC = 19:00:00 VN

def run_cmd(cmd):
    proc = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    try:
        return json.loads(proc.stdout)
    except Exception:
        return {"raw": proc.stdout, "err": proc.stderr}

def main():
    print("=" * 65)
    print("☠️ MORIBUNDUS SOUL NFT AUTO-SNIPER (19:00:00 VN)")
    print(f"Ví thụ hưởng: {WALLET}")
    print(f"Hợp đồng đích: {CONTRACT}")
    print(f"Giá Mint: 0.0044 BNB ({WEI} wei)")
    print(f"Thời gian kích hoạt: 19:00:00 VN (Timestamp: {TARGET_TS})")
    print("=" * 65)

    while True:
        now_ts = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        rem = TARGET_TS - now_ts
        if rem > 3:
            mins = rem // 60
            secs = rem % 60
            sys.stdout.write(f"\r⏳ Còn {mins} phút {secs:02d} giây trước khi mở cổng Mint 19:00:00...")
            sys.stdout.flush()
            sleep_time = min(rem - 3, 2)
            time.sleep(sleep_time)
        else:
            print(f"\n🚀 ĐÃ ĐẾN GIỜ MỞ MINT! Bắt đầu gửi lệnh preview...")
            break

    # Start polling preview until it succeeds
    req_id = None
    attempts = 0
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "preview",
        "--binanceChainId", CHAIN_ID,
        "--from", WALLET,
        "--to", CONTRACT,
        "--value", WEI,
        "--inputData", INPUT_DATA,
        "--json"
    ]

    while attempts < 30:
        attempts += 1
        print(f"[{attempts}/30] Thử preview giao dịch mint...")
        res_p = run_cmd(cmd_preview)
        if res_p.get("success"):
            req_id = res_p.get("data", {}).get("requestId")
            print(f"🎉 PREVIEW THÀNH CÔNG! RequestId: {req_id}")
            break
        else:
            err_msg = res_p.get("error", {}).get("message", str(res_p))
            print(f"  - Chưa mở hoặc lỗi ({err_msg}). Đợi 1.5s thử lại...")
            time.sleep(1.5)

    if not req_id:
        print("❌ Không thể tạo preview giao dịch sau 30 lần thử!")
        return False

    # Execute
    print("\n⚡ Đang thực thi lệnh đúc NFT Moribundus ngay lập tức...")
    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "execute",
        "--requestId", req_id,
        "--json"
    ]
    res_e = run_cmd(cmd_exec)
    if not res_e.get("success"):
        print("❌ Lỗi execute:", res_e)
        return False

    tx_hash = res_e.get("data", {}).get("txHash")
    print("\n" + "=" * 65)
    print(f"🎉🎉🎉 ĐÚC NFT MORIBUNDUS THÀNH CÔNG RỰC RỠ!")
    print(f"• Transaction Hash: {tx_hash}")
    print(f"• Link BscScan: https://bscscan.com/tx/{tx_hash}")
    print(f"• NFT sẽ tự đào 4,444 $SOUL trong 16 tiếng tới!")
    print("=" * 65)
    return True

if __name__ == "__main__":
    main()

