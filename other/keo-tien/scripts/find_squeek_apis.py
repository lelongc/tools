import re

with open('d:/folder/tools/other/keo-tien/scripts/inspect_squeek.py') as f:
    pass

import urllib.request
req = urllib.request.Request('https://squeekchain.com/assets/index-FEO1DWVF.js', headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# find occurrences of api.squeekchain.com or /api/ or genesis routes
matches = re.findall(r'api\.squeekchain\.com[a-zA-Z0-9_\-/\?=&]+', content)
print('api.squeekchain.com endpoints:', set(matches))

# find genesis routes
gen_routes = re.findall(r'/genesis/[a-zA-Z0-9_\-/\?=&]+', content)
print('genesis routes:', set(gen_routes))

# find vite / env / rpc
rpcs = re.findall(r'https?://[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,4}[a-zA-Z0-9_\-/\?=&]*', content)
print('All URLs with squeek:', set([u for u in rpcs if 'squeek' in u]))

