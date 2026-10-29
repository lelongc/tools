import requests
import re

url = "https://ptah.trade/_next/static/immutable/chunks/2yyn88cvjri7b.js"
js = requests.get(url, timeout=15).text

# Find where /submissions or submissions is defined
idx = js.find('/submissions')
if idx != -1:
    print("Found /submissions at", idx)
    print("Code around /submissions:")
    print(js[max(0, idx - 1000): min(len(js), idx + 1000)])
else:
    print("Not found /submissions directly, looking for 'submissions'")
    idx = js.find('submissions')
    print(js[max(0, idx - 1000): min(len(js), idx + 1000)])
