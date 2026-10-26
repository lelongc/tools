import requests
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

html = requests.get('https://ptah.trade/poa', headers={'User-Agent': 'Mozilla/5.0'}).text
scripts = re.findall(r'src="([^"]+\.js)"', html)
print(f"Total scripts found on ptah.trade/poa: {len(scripts)}")

addr = "0xd87adb2e47979d6cb323896b1a9320e0dd132213"
for s in scripts:
    url = s if s.startswith('http') else 'https://ptah.trade' + s
    try:
        t = requests.get(url, timeout=10).text
        if addr in t.lower():
            print(f"FOUND in {url}")
            idx = t.lower().find(addr)
            print(t[max(0, idx - 400):min(len(t), idx + 600)])
    except Exception as e:
        print(f"Error fetching {url}: {e}")
