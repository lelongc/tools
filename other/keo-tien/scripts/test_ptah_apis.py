import requests
import json

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

endpoints = [
    "https://ptah.trade/api/poa",
    "https://ptah.trade/api/poa/live",
    "https://ptah.trade/api/read/indexer",
    "https://ptah.trade/api/read/poa-day-pool",
    "https://ptah.trade/api/read/token-price",
    "https://ptah.trade/api/submissions"
]

for ep in endpoints:
    try:
        r = requests.get(ep, headers=headers, timeout=5)
        print(f"GET {ep} -> {r.status_code}")
        if r.status_code == 200:
            try:
                data = r.json()
                print("  Data preview:", json.dumps(data)[:300])
            except:
                print("  Text preview:", r.text[:200])
    except Exception as e:
        print(f"GET {ep} -> Error: {e}")
