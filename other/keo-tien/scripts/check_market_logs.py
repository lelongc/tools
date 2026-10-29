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

def get_topic(sig):
    k = keccak.new(digest_bits=256)
    k.update(sig.encode('utf-8'))
    return "0x" + k.hexdigest()

BSC_RPC = "https://bsc-dataseed.binance.org/"
MARKET = "0xb67517EEC4B51517b4428a8556c06D7419C1c92E"
NFT = "0x1EA0373CC4CE3775ca0C0e189Cf49D676894Da4f"

print("list(uint256,uint256) selector:", get_sel("list(uint256,uint256)"))
print("buy(uint256) selector:", get_sel("buy(uint256)"))
print("cancel(uint256) selector:", get_sel("cancel(uint256)"))
print("listedCount() selector:", get_sel("listedCount()"))

r_block = requests.post(BSC_RPC, json={"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}).json()
curr_block = int(r_block["result"], 16)

# Query logs of MARKET in last 20k blocks
p_logs = {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "eth_getLogs",
    "params": [{
        "address": MARKET,
        "fromBlock": hex(curr_block - 25000),
        "toBlock": "latest"
    }]
}
r_logs = requests.post(BSC_RPC, json=p_logs, timeout=12).json()
logs = r_logs.get("result", [])
print(f"Total Market events in last 25,000 blocks (~21 hours): {len(logs)}")

# Count topics
topic_counts = {}
for l in logs:
    top = l.get("topics", [""])[0]
    topic_counts[top] = topic_counts.get(top, 0) + 1

for top, count in topic_counts.items():
    print(f"Topic {top[:16]}... : {count} events")
