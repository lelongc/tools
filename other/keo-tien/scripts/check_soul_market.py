import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

RPC_URL = "https://bsc.publicnode.com"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
SOUL_TOKEN = "0x7D2ced0184E8eB11d53B2C32d70718f1EdF90eB8"
USDT = "0x55d398326f99059fF775485246999027B3197955"
WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"

def eth_call(to, data):
    p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": to, "data": data}, "latest"]}
    return requests.post(RPC_URL, json=p).json().get("result", "0x0")

def get_balance(token, wallet, decimals=18):
    padded = wallet[2:].lower().zfill(64)
    res = eth_call(token, "0x70a08231" + padded)
    return int(res, 16) / 10**decimals

def get_pair(tokenA, tokenB):
    # getPair(address,address) -> 0xe6a43905
    data = "0xe6a43905" + tokenA[2:].lower().zfill(64) + tokenB[2:].lower().zfill(64)
    res = eth_call(PANCAKE_FACTORY, data)
    pair = "0x" + res[-40:]
    return pair if pair != "0x0000000000000000000000000000000000000000" else None

def main():
    print("=" * 60)
    print("📊 THEO DÕI THANH KHOẢN $SOUL VÀ MỤC TIÊU BÁN 50%")
    print("=" * 60)

    # 1. Số dư SOUL hiện tại
    soul_bal = get_balance(SOUL_TOKEN, WALLET)
    print(f"• Số dư $SOUL trong ví: {soul_bal:,.1f} SOUL")

    # 2. Kiểm tra cặp thanh khoản USDT
    pair_usdt = get_pair(SOUL_TOKEN, USDT)
    print(f"• Cặp SOUL/USDT trên PancakeSwap: {pair_usdt or 'Chưa mở (Đang chờ Dev nạp)'}")

    # 3. Kiểm tra cặp thanh khoản WBNB
    pair_bnb = get_pair(SOUL_TOKEN, WBNB)
    print(f"• Cặp SOUL/WBNB trên PancakeSwap: {pair_bnb or 'Chưa mở (Đang chờ Dev nạp)'}")

    print("\n🎯 KẾ HOẠCH HÀNH ĐỘNG:")
    print("• Mục tiêu: Bán 50% (2,222 $SOUL) đổi sang USDT.")
    print("• Lợi nhuận mục tiêu: Lãi ròng >= 10$ USD (đã trừ vốn 3.3$).")
    print("• 50% còn lại (2,222 $SOUL): Tiếp tục hold làm moonbag.")
    print("=" * 60)

if __name__ == "__main__":
    main()

