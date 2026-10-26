import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Resolve IP via Google DoH
def resolve_doh(domain):
    try:
        r = requests.get(f"https://dns.google/resolve?name={domain}&type=A", timeout=5)
        data = r.json()
        for ans in data.get("Answer", []):
            if ans.get("type") == 1:
                return ans.get("data")
    except Exception as e:
        print(f"DoH error for {domain}: {e}")
    return None

ip = resolve_doh("bsc-dataseed1.binance.org")
print("Resolved IP for bsc-dataseed1.binance.org:", ip)

if ip:
    # Query RPC with Host header
    url = f"https://{ip}/"
    headers = {"Host": "bsc-dataseed1.binance.org", "Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "method": "eth_getCode",
        "params": ["0xD87ADb2E47979d6cb323896B1A9320E0dd132213", "latest"],
        "id": 1
    }
    try:
        r = requests.post(url, headers=headers, json=payload, verify=False, timeout=10)
        print("eth_getCode status:", r.status_code)
        res = r.json().get("result")
        print("Code length:", len(res) if res else 0)
    except Exception as e:
        print("RPC error:", e)
