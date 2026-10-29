import requests
import re
import json

r = requests.get('https://ptah.trade/poa', headers={'User-Agent': 'Mozilla/5.0'})
scripts = re.findall(r'src="([^"]+\.js)"', r.text)
for s in scripts:
    url = s if s.startswith('http') else 'https://ptah.trade' + s
    try:
        res = requests.get(url, timeout=10)
        js = res.text
        if 'submissions' in js:
            print('Found in script:', url)
            matches = [m.start() for m in re.finditer('submissions', js)]
            for idx in matches:
                start = max(0, idx - 150)
                end = min(len(js), idx + 250)
                print('--- SNIPPET ---')
                print(js[start:end])
                print('---------------')
    except Exception as e:
        print(f"Error {url}: {e}")
