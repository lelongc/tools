import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

RPC_URL = "https://bsc-dataseed.binance.org"
MORI = "0x5eB9936F910b1cFaA9994fbC7Ae98A279A3d0F89"

p = {'jsonrpc': '2.0', 'id': 1, 'method': 'eth_blockNumber', 'params': []}
latest = int(requests.post(RPC_URL, json=p).json()['result'], 16)

p2 = {'jsonrpc': '2.0', 'id': 2, 'method': 'eth_getLogs', 'params': [{'fromBlock': hex(latest - 80), 'toBlock': 'latest', 'address': MORI}]}
logs = requests.post(RPC_URL, json=p2).json().get('result', [])
print(f"Total transfer logs in last 80 blocks: {len(logs)}")

tx_hashes = list(set([l['transactionHash'] for l in logs[:15]]))
for th in tx_hashes:
    ptx = {'jsonrpc': '2.0', 'id': 3, 'method': 'eth_getTransactionByHash', 'params': [th]}
    tx = requests.post(RPC_URL, json=ptx).json().get('result', {})
    val = int(tx.get('value', '0x0'), 16) / 10**18
    from_addr = tx.get('from', '')
    inp = tx.get('input', '')[:10]
    print(f"Tx: {th[:16]}... | From: {from_addr[:12]}... | Value: {val} BNB | Selector: {inp}")

