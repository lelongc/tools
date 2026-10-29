import requests
import json
import uuid

URL = "https://ptah.trade/api/poa/submissions"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Origin": "https://ptah.trade",
    "Referer": "https://ptah.trade/poa",
    "Idempotency-Key": str(uuid.uuid4())
}

# The tweet URL without tracking query parameters or with it
clean_url = "https://x.com/sadex_le/status/2115681183149563995"

payload = {
    "token_id": "21023",
    "url": clean_url
}

print(f"Submitting to {URL} with payload: {payload}")
print(f"Idempotency-Key: {HEADERS['Idempotency-Key']}")

try:
    res = requests.post(URL, headers=HEADERS, json=payload, timeout=15)
    print(f"Status Code: {res.status_code}")
    print(f"Response Headers: {res.headers}")
    print(f"Response Body: {res.text}")
except Exception as e:
    print(f"Error submitting: {e}")
