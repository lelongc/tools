import requests
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = "https://ptah.trade/_next/static/immutable/chunks/09r8n4gv06le8.js"
text = requests.get(url, timeout=10).text

for m in re.finditer(r'poa_mint', text):
    start = max(0, m.start() - 200)
    end = min(len(text), m.end() + 300)
    print(f"--- MATCH AT {m.start()} ---")
    print(text[start:end])
    print()
