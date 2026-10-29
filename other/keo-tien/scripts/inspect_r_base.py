import requests

url = "https://ptah.trade/_next/static/immutable/chunks/2yyn88cvjri7b.js"
js = requests.get(url, timeout=15).text

idx = js.find('/submissions')
print("--- PRECEDING 1500 BYTES ---")
print(js[max(0, idx - 1500): idx])
