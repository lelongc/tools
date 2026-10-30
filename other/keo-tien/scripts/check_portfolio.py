import sys
import requests
import json

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
RPC_URL = "https://bsc.publicnode.com"

def eth_call(to, data):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_call",
        "params": [{"to": to, "data": data}, "latest"]
    }
    r = requests.post(RPC_URL, json=payload, timeout=8).json()
    return r.get("result", "0x0")

def get_bnb_balance(wallet):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [wallet, "latest"]
    }
    r = requests.post(RPC_URL, json=payload, timeout=8).json()
    hex_val = r.get("result", "0x0")
    return int(hex_val, 16) / 10**18

def get_erc20_balance(token_contract, wallet, decimals=18):
    padded_wallet = wallet.lower().replace("0x", "").zfill(64)
    data = "0x70a08231" + padded_wallet
    res = eth_call(token_contract, data)
    return int(res, 16) / (10 ** decimals)

def get_nft_balance(nft_contract, wallet):
    padded_wallet = wallet.lower().replace("0x", "").zfill(64)
    data = "0x70a08231" + padded_wallet
    res = eth_call(nft_contract, data)
    if not res or res == "0x":
        return 0
    try:
        return int(res, 16)
    except Exception:
        return 0

def main():
    print("=" * 60)
    print(f"📊 KIỂM TRA TÀI SẢN ON-CHAIN THỜI GIAN THỰC")
    print(f"Ví: {WALLET}")
    print("=" * 60)

    # 1. BNB
    bnb = get_bnb_balance(WALLET)
    print(f"• Số dư BNB Native: {bnb:.5f} BNB (~{bnb * 735:.2f} USD)")

    # 2. $BOLT
    bolt = get_erc20_balance("0xBbDd8C7720d1EEB1d63738eaABB584a4b72C7777", WALLET, 18)
    print(f"• $BOLT Token: {bolt:,.1f} BOLT")

    # 3. $AISNACK
    aisnack = get_erc20_balance("0x4903Ce0f68f763B8EdBB80A6E9E836373d3190C8", WALLET, 18)
    print(f"• $AISNACK Token: {aisnack:,.1f} AISNACK")

    # 4. NFTs
    shiba = get_nft_balance("0xFdD6C5fF6dAbFF40cb27B39D72E5C9517Af27Fdc", WALLET)
    sigil = get_nft_balance("0xDd8BdfC91cbD572935B09863A742d8296fed0ACf", WALLET)
    repsol = get_nft_balance("0x0cdbc22056631a399d1c8caa3f5a70e65935e26f", WALLET)
    mori = get_nft_balance("0x5eB9936F910b1cFaA9994fbC7Ae98A279A3d0F89", WALLET)
    print(f"• Moribundus Soul NFT: {mori} con (Token #92 - Đang đào 4,444 $SOUL)")
    print(f"• Pixel Shiba Club NFT: {shiba} con")
    print(f"• Nemotron Sigil NFT: {sigil} con")
    print(f"• Repsol NFT (Cực hiếm): {repsol} con")

    # 5. Nonce Genesis NFT (sau 22:00)
    nonce_nft = get_nft_balance("0x053259A3D30E63d9447E3d90813C6a494bcB398a", WALLET)
    print(f"• Nonce Genesis NFT: {nonce_nft} con")
    print("=" * 60)

if __name__ == "__main__":
    main()
