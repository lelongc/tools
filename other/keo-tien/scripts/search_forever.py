import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

url = 'https://api.dexscreener.com/latest/dex/search?q=FOREVER'
r = requests.get(url, timeout=10).json()
pairs = r.get('pairs', [])
bsc_pairs = [p for p in pairs if p.get('chainId') == 'bsc']
print(f"Found {len(bsc_pairs)} BSC pairs for FOREVER:")
for p in bsc_pairs[:8]:
    base = p.get('baseToken', {})
    price = p.get('priceUsd')
    fdv = p.get('fdv')
    vol = p.get('volume', {}).get('h24')
    pair_addr = p.get('pairAddress')
    created = p.get('pairCreatedAt')
    txns = p.get('txns', {}).get('h24', {})
    print(f"• Name: {base.get('name')} | Symbol: {base.get('symbol')} | CA: {base.get('address')}")
    print(f"  Price: ${price} | FDV: ${fdv} | 24h Vol: ${vol} | Buys: {txns.get('buys')} | Sells: {txns.get('sells')}")
    print(f"  Pair: {pair_addr} | Created: {created}\n")

