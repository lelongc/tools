import urllib.request, re

url = 'https://squeekchain.com/assets/client-DY_rW4kl.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

print('client JS len:', len(content))
# Find string literals
endpoints = re.findall(r'["\'](/[^"\']+)["\']', content)
print('Endpoints:', set([e for e in endpoints if len(e) < 50]))
print('Preview:', content[:1000])

