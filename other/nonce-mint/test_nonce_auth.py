import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wallet = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
url = "https://mcp.nonceprotocol.xyz/auth/challenge"
headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json"
}

r = requests.post(url, headers=headers, json={"wallet": wallet}, timeout=10)
print("Challenge status:", r.status_code)
print("Challenge response:", json.dumps(r.json(), indent=2))
