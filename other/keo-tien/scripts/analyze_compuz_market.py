import requests
import re
import json

r = requests.get("https://compuz.netlify.app/", timeout=10)
html = r.text

print("HTML size:", len(html))

# Look for market ABI or functions in html
for m in re.finditer(r'function\s+([a-zA-Z0-9_]+)\s*\(', html):
    fname = m.group(1)
    if any(k in fname.lower() for k in ["list", "buy", "sell", "cancel", "market", "order"]):
        print("Found function:", fname)

# Look for contracts or ABIs
matches = re.findall(r'0x[a-fA-F0-9]{40}', html)
print("Addresses in HTML:", set(matches))

# Look for ABI fragments
if "list" in html.lower():
    idx = html.lower().find("list")
    print("Context around list:", html[max(0, idx-100):min(len(html), idx+300)])
