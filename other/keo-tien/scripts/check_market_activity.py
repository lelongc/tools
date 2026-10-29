import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BSC_RPC = "https://bsc-dataseed.binance.org/"
MARKET = "0xb67517EEC4B51517b4428a8556c06D7419C1c92E"
NFT = "0x1EA0373CC4CE3775ca0C0e189Cf49D676894Da4f"

# Check BscScan public API or RPC logs for purchases
# Event: Purchase / Sold / List
# Let's inspect BscScan transaction list for MARKET
url = f"https://api.bscscan.com/api?module=account&action=txlist&address={MARKET}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc"
r = requests.get(url, timeout=10).json()

print("Status from BscScan:", r.get("status"), r.get("message"))
txs = r.get("result", [])
if isinstance(txs, list) and txs:
    print(f"Total recent transactions found: {len(txs)}")
    for t in txs[:10]:
        method = t.get("functionName", t.get("methodId", ""))
        val_bnb = int(t.get("value", 0)) / 10**18
        timestamp = t.get("timeStamp")
        print(f"Tx: {t.get('hash')[:16]}... | Method: {method[:35]} | Value: {val_bnb:.5f} BNB | IsError: {t.get('isError')}")
else:
    print("No tx list from free api key, checking via web or RPC...")
