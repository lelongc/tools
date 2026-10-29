import urllib.request, re

url = 'https://squeekchain.com/assets/client-DY_rW4kl.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# find baseUrl or fetch or api
for m in re.finditer(r'baseURL|api_base|apiUrl|apiHost|VITE_API|/v1/', content, re.IGNORECASE):
    idx = m.start()
    print('Snippet around', m.group(0), ':', content[max(0, idx-50):min(len(content), idx+150)])

