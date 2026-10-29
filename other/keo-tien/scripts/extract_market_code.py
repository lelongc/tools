import requests
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

r = requests.get("https://compuz.netlify.app/", timeout=10)
html = r.text

# Extract market functions
for fn in ["list", "buy", "cancel", "getListings", "listedCount"]:
    pattern = rf'(function\s+{fn}\b[^{{]+\{{(?:[^{{}}]|(?:\{{[^{{}}]*\}}))*\}})'
    m = re.search(pattern, html)
    if m:
        print(f"=== Function {fn} ===")
        print(m.group(1))
    else:
        # Fallback simple search
        idx = html.find(f"function {fn}")
        if idx != -1:
            print(f"=== Function {fn} (raw) ===")
            print(html[idx:idx+800])
