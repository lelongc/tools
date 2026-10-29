import urllib.request
import re
import json

url = 'https://moribundus.xyz/whitelist'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Search for config
for m in re.finditer(r'<script[^>]*>(.*?)</script>', html, re.DOTALL):
    text = m.group(1)
    if 'MORIBUNDUS_CONFIG' in text:
        print("FOUND MORIBUNDUS_CONFIG IN SCRIPT:")
        print(text[:2000])

for src in re.findall(r'<script[^>]*src=[\'"]([^\'"]+)[\'"]', html):
    print("Script src:", src)
    if not src.startswith('http'):
        src_url = 'https://moribundus.xyz/' + src.lstrip('/')
    else:
        src_url = src
    try:
        r2 = urllib.request.urlopen(urllib.request.Request(src_url, headers={'User-Agent': 'Mozilla/5.0'}))
        c = r2.read().decode('utf-8')
        if 'MORIBUNDUS_CONFIG' in c or 'whitelist' in c:
            print(f"--- from {src} ---")
            print(c[:2000])
    except Exception as e:
        print(f"Error fetching {src}: {e}")

