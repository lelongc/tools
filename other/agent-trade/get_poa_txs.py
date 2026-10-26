import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def resolve_doh(domain):
    try:
        r = requests.get(f"https://dns.google/resolve?name={domain}&type=A", timeout=5)
        for ans in r.json().get("Answer", []):
            if ans.get("type") == 1:
                return ans.get("data")
    except Exception as e:
        print(f"DoH error: {e}")
    return None

ip = resolve_doh("api.bscscan.com")
print("BscScan IP:", ip)

if ip:
    url = f"https://{ip}/api?module=account&action=txlist&address=0xD87ADb2E47979d6cb323896B1A9320E0dd132213&startblock=0&endblock=99999999&page=1&offset=10&sort=desc"
    headers = {"Host": "api.bscscan.com"}
    try:
        r = requests.get(url, headers=headers, verify=False, timeout=10)
        data = r.json()
        print("Status:", data.get("status"), data.get("message"))
        txs = data.get("result", [])
        if isinstance(txs, list):
            print(f"Recent tx count: {len(txs)}")
            for tx in txs[:5]:
                input_data = tx.get("input", "")
                method_id = input_data[:10]
                print(f"Hash: {tx.get('hash')}, MethodID: {method_id}, Value: {tx.get('value')}, InputLen: {len(input_data)}")
    except Exception as e:
        print("Error:", e)
