import requests
import re
import json

html = requests.get('https://ptah.trade/poa', headers={'User-Agent': 'Mozilla/5.0'}).text
scripts = re.findall(r'src="([^"]+\.js)"', html)
print(f"Scripts count: {len(scripts)}")

apis = set()
for s in scripts:
    url = s if s.startswith('http') else 'https://ptah.trade' + s
    try:
        t = requests.get(url, timeout=6).text
        for match in re.findall(r'["\'](/api/[^"\']+)["\']', t):
            apis.add(match)
        # also search for submitPost or similar functions
        for match in re.findall(r'[a-zA-Z0-9_]+submit[a-zA-Z0-9_]*', t, re.IGNORECASE):
            if len(match) < 30:
                apis.add("fn:" + match)
    except Exception as e:
        pass

print("Discovered APIs/functions:")
for a in sorted(list(apis)):
    print(" ", a)
