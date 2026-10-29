import subprocess
import requests
import json
import time
import sys
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
TOKEN_CONTRACT = "0x4903Ce0f68f763B8EdBB80A6E9E836373d3190C8"
RPC_URL = "https://bsc.publicnode.com"

# PHASE 2: Selector = 0x01eaaec4
# Opens at: 1793145600 (07:00:00 VN Time, 28/10/2026)
PHASE2_TIMESTAMP = 1793145600

def get_bnb_balance():
    r = requests.post(RPC_URL, json={
        "jsonrpc": "2.0", "id": 1, "method": "eth_getBalance", "params": [WALLET, "latest"]
    }).json()
    return int(r.get("result", "0x0"), 16) / 10**18

def check_has_claimed2():
    padded = WALLET.lower().replace("0x", "").zfill(64)
    data = "0x8235de54" + padded
    r = requests.post(RPC_URL, json={
        "jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": TOKEN_CONTRACT, "data": data}, "latest"]
    }).json()
    res = r.get("result", "0x0")
    return int(res, 16) == 1

def check_claim2_open():
    r = requests.post(RPC_URL, json={
        "jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": TOKEN_CONTRACT, "data": "0xf43c7e70"}, "latest"]
    }).json()
    res = r.get("result", "0x0")
    return int(res, 16) == 1

def execute_claim2():
    print("=" * 60)
    print("🪙 THỰC THI CLAIM PHASE 2 CHO $AISNACK (+200 TOKEN)")
    print("=" * 60)
    
    # 1. Kiểm tra thời gian
    now_ts = int(time.time())
    print(f"• Timestamp hiện tại: {now_ts} (Thời gian mở: {PHASE2_TIMESTAMP})")
    
    # 2. Kiểm tra claim2Open
    open_status = check_claim2_open()
    print(f"• Trạng thái claim2Open(): {open_status}")
    if not open_status and now_ts < PHASE2_TIMESTAMP:
        print(f"⏳ Phase 2 chưa mở! Vui lòng quay lại lúc 07:00 sáng ngày 28/10/2026.")
        return False
        
    # 3. Kiểm tra hasClaimed2
    claimed2 = check_has_claimed2()
    print(f"• Đã claim Phase 2 chưa: {claimed2}")
    if claimed2:
        print("✅ Ví đã nhận 200 token của Phase 2 rồi.")
        return True
        
    # 4. Kiểm tra số dư BNB (Yêu cầu >= 0.1 BNB)
    bnb_bal = get_bnb_balance()
    print(f"• Số dư BNB trong ví: {bnb_bal:.5f} BNB (Yêu cầu: >= 0.1 BNB)")
    if bnb_bal < 0.1:
        print(f"⚠️ CẢNH BÁO: Số dư BNB hiện tại ({bnb_bal:.4f} BNB) chưa đủ 0.1 BNB!")
        print("💡 Hướng dẫn: Nạp tạm 0.09 BNB từ Binance vào ví, chạy lại lệnh này để nhận 200 token, xong rút lại BNB.")
        return False
        
    # 5. Gọi hợp đồng qua baw CLI
    print("\n🚀 Bắt đầu tạo giao dịch Claim Phase 2...")
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "preview",
        "--binanceChainId", "56",
        "--from", WALLET,
        "--to", TOKEN_CONTRACT,
        "--value", "0",
        "--inputData", "0x01eaaec4",
        "--json"
    ]
    proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    res_p = json.loads(proc.stdout)
    if not res_p.get("success"):
        print("Lỗi preview:", res_p)
        return False
        
    req_id = res_p["data"]["requestId"]
    print(f"• Preview thành công! RequestId: {req_id}")
    
    cmd_exec = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "execute",
        "--requestId", req_id,
        "--json"
    ]
    proc_e = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    res_e = json.loads(proc_e.stdout)
    tx_hash = res_e.get("data", {}).get("txHash")
    print(f"🎉 CLAIM THÀNH CÔNG! TxHash: {tx_hash}")
    return True

if __name__ == "__main__":
    execute_claim2()
