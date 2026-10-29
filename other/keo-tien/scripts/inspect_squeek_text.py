import urllib.request, re

url = 'https://squeekchain.com/assets/genesis-page-ByeIlchz.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

strings = re.findall(r'"([^"\\]{15,120})"', content) + re.findall(r"'([^'\\]{15,120})'", content)
print(f"Total strings found: {len(strings)}")
for s in strings:
    if any(k in s.lower() for k in ['genesis', 'invite', 'mint', 'wallet', 'free', 'cost', 'fee', 'reward', 'rank', 'pool', 'claim', 'sqk', 'chain', 'stage', 'phase']):
        print(' *', s)
