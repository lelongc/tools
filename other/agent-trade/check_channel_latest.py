import requests
import re
import html
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
r = requests.get('https://t.me/s/azcoinvestx', headers=headers)
texts = re.findall(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', r.text, re.DOTALL)
for i, t in enumerate(texts[-12:], 1):
    clean = html.unescape(re.sub(r'<[^>]+>', ' ', t)).strip()
    clean = re.sub(r'\s+', ' ', clean)
    print(f"[{i}] {clean}\n---")
