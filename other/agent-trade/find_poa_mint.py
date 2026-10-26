import requests
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Search for poa_mint in the chunk
url = "https://ptah.trade/_next/static/immutable/chunks/09r8n4gv06le8.js"
text = requests.get(url, timeout=10).text

idx = text.find("poa_mint")
print("Found poa_mint at:", idx)
if idx != -1:
    print("--- SNIPPET ---")
    print(text[max(0, idx - 400):min(len(text), idx + 800)])
else:
    print("poa_mint not in 09r8n4gv06le8.js")
    # let's find any mentions of mint in 09r8n4gv06le8.js
    for m in re.finditer(r'mint[a-zA-Z0-9_]*', text, re.IGNORECASE):
        start = max(0, m.start() - 50)
        end = min(len(text), m.end() + 50)
        print("Match:", text[start:end])
        break
