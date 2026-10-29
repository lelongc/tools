import requests
import re
import json

TWEET_URL = "https://x.com/sadex_le/status/2115328783888900303"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
AGENT_ID = 21023

print(f"Checking tweet: {TWEET_URL}")

# 1. Fetch ptah.trade html & scripts to find all API routes
r = requests.get("https://ptah.trade/poa", headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
html = r.text

apis = set(re.findall(r'/api/[a-zA-Z0-9_/-]+', html))
scripts = re.findall(r'src="([^"]+\.js)"', html)
print(f"Scripts found: {len(scripts)}")

for s in scripts:
    url = s if s.startswith("http") else "https://ptah.trade" + s
    try:
        js = requests.get(url, timeout=5).text
        for m in re.findall(r'/api/[a-zA-Z0-9_/-]+', js):
            apis.add(m)
        # Search for post submission logic
        if "submit" in js.lower() or "square" in js.lower() or "post" in js.lower():
            for line in js.split(";"):
                if ("post" in line.lower() or "tweet" in line.lower() or "square" in line.lower()) and "submit" in line.lower():
                    if len(line) < 300:
                        print("  [JS logic]:", line[:150])
    except Exception:
        pass

print("\nAll Discovered APIs on ptah.trade:")
for a in sorted(list(apis)):
    print("  ->", a)
