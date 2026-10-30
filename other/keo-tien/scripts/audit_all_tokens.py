import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

tokens = {
    "BOLT (Old)": "0xBbDd8C7720d1EEB1d63738eaABB584a4b72C7777",
    "BOLT (New)": "0x378afee1ce6c88f0fdc568518140b9a0ab794da5",
    "AISNACK": "0x4903Ce0f68f763B8EdBB80A6E9E836373d3190C8",
    "PTAH": "0x999980FB8Dff1799C7E9D7F71bCA899e43D39999",
    "SOUL": "0x7D2ced0184E8eB11d53B2C32d70718f1EdF90eB8",
}

print("=" * 65)
print("🔍 KIỂM TRA THANH KHOẢN VÀ KHẢ NĂNG BÁN CỦA TẤT CẢ CÁC TOKEN")
print("=" * 65)

for name, ca in tokens.items():
    try:
        url = f"https://api.dexscreener.com/latest/dex/tokens/{ca}"
        r = requests.get(url, timeout=8).json()
        pairs = r.get("pairs") or []
        print(f"\n🪙 {name} ({ca}):")
        if not pairs:
            print("  ❌ Chưa có cặp thanh khoản nào trên sàn DEX.")
        else:
            print(f"  ✅ Tìm thấy {len(pairs)} cặp giao dịch:")
            for p in pairs[:2]:
                dex = p.get('dexId', 'DEX')
                price = p.get('priceUsd', '0')
                liq = p.get('liquidity', {}).get('usd', 0)
                vol = p.get('volume', {}).get('h24', 0)
                fdv = p.get('fdv', 0)
                pair_addr = p.get('pairAddress')
                print(f"    • Sàn: {dex} | Giá: ${price} | Thanh khoản (Liq): ${liq:,.2f} | 24h Vol: ${vol:,.2f} | FDV: ${fdv:,.2f}")
                print(f"      Pair: https://dexscreener.com/bsc/{pair_addr}")
    except Exception as e:
        print(f"  ⚠️ Lỗi khi tra cứu: {e}")

