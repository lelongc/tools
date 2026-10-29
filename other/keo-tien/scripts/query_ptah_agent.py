import requests
import json
import uuid

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://ptah.trade",
    "Referer": "https://ptah.trade/poa"
}

# 1. Check agent 21023
print("=== Checking Agent 21023 ===")
url_agent = f"https://ptah.trade/api/poa/agents/21023?fresh={int(uuid.uuid4().time_low)}"
r = requests.get(url_agent, headers=HEADERS, timeout=10)
print(f"Status: {r.status_code}")
print(r.text)

# 2. Check agents of wallet
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
print("\n=== Checking Agents of Wallet ===")
url_owner = f"https://ptah.trade/api/poa/agents?owner={WALLET.lower()}"
r2 = requests.get(url_owner, headers=HEADERS, timeout=10)
print(f"Status: {r2.status_code}")
print(r2.text)

# 3. Check current periods
print("\n=== Checking Periods ===")
url_periods = "https://ptah.trade/api/poa/periods"
r3 = requests.get(url_periods, headers=HEADERS, timeout=10)
print(f"Status: {r3.status_code}")
print(r3.text[:500])
