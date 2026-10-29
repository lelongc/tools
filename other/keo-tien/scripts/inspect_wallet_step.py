import urllib.request, re

url = 'https://squeekchain.com/assets/genesis-step-wallet-CvU-YXUD.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

strings = re.findall(r'"([^"\\]{10,120})"', content) + re.findall(r"'([^'\\]{10,120})'", content)
print(f"Total strings found: {len(strings)}")
for s in strings:
    print(' *', s)

