import requests
from eth_abi import decode
from Crypto.Hash import keccak
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def get_sel(sig):
    k = keccak.new(digest_bits=256)
    k.update(sig.encode('utf-8'))
    return '0x' + k.hexdigest()[:8]

BSC_RPC = 'https://bsc-dataseed.binance.org/'
MARKET = '0xb67517EEC4B51517b4428a8556c06D7419C1c92E'

# Read total listed
p_count = {'jsonrpc': '2.0', 'id': 1, 'method': 'eth_call', 'params': [{'to': MARKET, 'data': get_sel('listedCount()')}, 'latest']}
total_listed = int(requests.post(BSC_RPC, json=p_count, timeout=5).json()['result'], 16)
print(f"Total listed items: {total_listed}")

sel = get_sel('getListings(uint256,uint256)')
# Fetch all listings in chunks of 50
all_items = []
for offset in range(0, total_listed, 50):
    limit = min(50, total_listed - offset)
    param = hex(offset)[2:].zfill(64) + hex(limit)[2:].zfill(64)
    calldata = sel + param
    p = {'jsonrpc': '2.0', 'id': 1, 'method': 'eth_call', 'params': [{'to': MARKET, 'data': calldata}, 'latest']}
    res = requests.post(BSC_RPC, json=p, timeout=8).json().get('result', '')
    if res and len(res) > 130:
        tids, sellers, prices = decode(['uint256[]', 'address[]', 'uint256[]'], bytes.fromhex(res[2:]))
        for t, s, pr in zip(tids, sellers, prices):
            all_items.append({'id': t, 'seller': s, 'price_bnb': pr / 10**18, 'price_wei': pr})

all_items.sort(key=lambda x: x['price_bnb'])

print("\n--- TOP 10 RẺ NHẤT TRÊN CHỢ ---")
for it in all_items[:10]:
    usd = it['price_bnb'] * 650
    print(f"Token #{it['id']:4d} | Giá: {it['price_bnb']:.5f} BNB (~${usd:.3f}) | Seller: {it['seller'][:8]}...{it['seller'][-6:]}")

print("\n--- PHÂN BỔ MỨC GIÁ TRÊN CHỢ ---")
under_0005 = sum(1 for x in all_items if x['price_bnb'] < 0.0005)
range_0005_0015 = sum(1 for x in all_items if 0.0005 <= x['price_bnb'] <= 0.0015)
above_0015 = sum(1 for x in all_items if x['price_bnb'] > 0.0015)
print(f"Dưới 0.0005 BNB (< $0.32): {under_0005} NFTs (Sàn thấp nhất: {all_items[0]['price_bnb']:.5f} BNB = ${all_items[0]['price_bnb']*650:.3f})")
print(f"Từ 0.0005 - 0.0015 BNB ($0.32 - $1.00): {range_0005_0015} NFTs")
print(f"Trên 0.0015 BNB (> $1.00): {above_0015} NFTs")
