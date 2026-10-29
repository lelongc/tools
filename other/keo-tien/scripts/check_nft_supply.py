import requests
import re
import json

BSC_RPC = "https://bsc-dataseed.binance.org/"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

try:
    r = requests.get("https://launchpad.nonceprotocol.xyz/collection/nonce", timeout=10)
    scripts = re.findall(r'src="(/_next/static/chunks/[^"]+)"', r.text)
    all_addrs = set()
    for s in scripts:
        url = "https://launchpad.nonceprotocol.xyz" + s
        try:
            js = requests.get(url, timeout=5).text
            for a in re.findall(r'0x[a-fA-F0-9]{40}', js):
                all_addrs.add(a)
        except Exception:
            pass
    print("Found Contract Candidates:", all_addrs)
    
    for c in all_addrs:
        # Check totalSupply selector 0x18160ddd
        try:
            p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": c, "data": "0x18160ddd"}, "latest"]}
            res = requests.post(BSC_RPC, json=p, timeout=5).json()
            if "result" in res and res["result"] != "0x" and len(res["result"]) > 2:
                val = int(res["result"], 16)
                if 5000 <= val <= 7777:
                    print(f"🎯 FOUND NONCE NFT CONTRACT: {c} | Total Supply: {val}/7777")
                    # Check wallet balance
                    p2 = {"jsonrpc": "2.0", "id": 2, "method": "eth_call", "params": [{"to": c, "data": "0x70a08231" + WALLET.lower().replace("0x", "").zfill(64)}, "latest"]}
                    res2 = requests.post(BSC_RPC, json=p2, timeout=5).json()
                    bal = int(res2["result"], 16) if "result" in res2 and res2["result"] != "0x" else 0
                    print(f"💰 Wallet Balance: {bal} NFTs")
        except Exception:
            pass
except Exception as e:
    print("Error:", e)
