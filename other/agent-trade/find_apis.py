import requests
import re

url = "https://ptah.trade/_next/static/immutable/chunks/09r8n4gv06le8.js"
t = requests.get(url).text

# Search for "poaMint" or "poa_mint" mapping to contract call
for m in re.finditer(r'poa_mint', t):
    start = max(0, m.start() - 200)
    end = min(len(t), m.end() + 300)
    print("--- MATCH ---")
    print(t[start:end])
