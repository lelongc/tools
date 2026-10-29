import requests
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

r = requests.get("https://snack.is-a.si/", timeout=10)
html = r.text

# Find trade.msg
m = re.search(r'"trade\.msg":\s*"(.*?)"', html, re.DOTALL)
if m:
    print("=== TRADE INSTRUCTIONS FOR AGENT ===")
    print(m.group(1).replace("\\n", "\n"))

# Find all occurrences of list / create
for line in html.split(";"):
    if any(k in line.lower() for k in ["listing", "buy", "cancel", "createlisting", "list("]):
        if len(line.strip()) < 200:
            print("Line:", line.strip())
