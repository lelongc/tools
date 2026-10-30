import subprocess
import json
import time
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
CONTRACT = "0x5eB9936F910b1cFaA9994fbC7Ae98A279A3d0F89"
WEI = "4400000000000000" # 0.0044 BNB
INPUT_DATA = "0x1249c58b"
CHAIN_ID = "56"

def run_cmd(cmd):
    proc = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    try:
        return json.loads(proc.stdout)
    except Exception:
        return {"raw": proc.stdout, "err": proc.stderr}

def main():
    print("=" * 60)
    print("☠️ MORIBUNDUS SOUL NFT MINTER (0.0044 BNB)")
    print(f"Ví: {WALLET}")
    print(f"Hợp đồng: {CONTRACT}")
    print("=" * 60)

    # 1. Preview
    print("\n[1] Đang tạo preview giao dịch...")
    cmd_preview = [
        "npx", "-y", "@binance/agentic-wallet", "contract-call", "preview",
        "--binanceChainId", CHAIN_ID,
        "--from", WALLET,
        "--to", CONTRACT,
        "--value", WEI,
        "--inputData", INPUT_DATA,
        "--json"
    ]
    res_p = run_cmd(cmd_preview)
    if not res_p.get("success"):
        print("❌ Lỗi preview:", res_p)
        return False

    req_id = res_p.get("data", {}).get("requestId")
    print(f"✅ Preview thành công! RequestId: {req_id}")

    # 2. Execute
    print("\n[2] Đang thực thi lệnh đúc NFT...")
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
    print(f"\n🎉 ĐÚC NFT THÀNH CÔNG! TxHash: {tx_hash}")
    print(f"Link BscScan: https://bscscan.com/tx/{tx_hash}")
    return True

if __name__ == "__main__":
    main()

