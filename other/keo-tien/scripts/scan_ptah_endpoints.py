import requests
import re
import sys

r = requests.get('https://ptah.trade/poa', timeout=10)
chunks = re.findall(r'src="([^"]+\.js)"', r.text)
print('Chunks count:', len(chunks))
found_apis = set()
for c in chunks:
    try:
        url = c if c.startswith('http') else 'https://ptah.trade' + c
        t = requests.get(url, timeout=5).text
        for m in re.findall(r'/api/[a-zA-Z0-9_\/-]+', t):
            if m not in found_apis:
                found_apis.add(m)
                print('API:', m)
        # Search for post submission keywords
        if 'square' in t.lower() or 'mining' in t.lower() or 'social' in t.lower():
            for line in t.split(';'):
                if 'post' in line.lower() and ('submit' in line.lower() or 'verify' in line.lower() or 'entry' in line.lower()):
                    if len(line) < 300:
                        print('SNIPPET:', line[:200])
    except Exception as e:
        pass
