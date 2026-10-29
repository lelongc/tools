import requests
import json
import sys
from Crypto.Hash import keccak

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def get_sel(sig):
    k = keccak.new(digest_bits=256)
    k.update(sig.encode('utf-8'))
    return "0x" + k.hexdigest()[:8]

BSC_RPC = "https://bsc-dataseed.binance.org/"
MARKET = "0xb67517EEC4B51517b4428a8556c06D7419C1c92E"

sel = get_sel("getListings(uint256,uint256)")
# offset = 0, limit = 10
param = hex(0)[2:].zfill(64) + hex(10)[2:].zfill(64)
calldata = sel + param

p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": MARKET, "data": calldata}, "latest"]}
r = requests.post(BSC_RPC, json=p, timeout=8).json()
res = r.get("result", "")
print("getListings result length:", len(res))

# Let's decode result using web3 / eth_abi or manual parse
if len(res) > 130:
    print("Raw head:", res[:200])
