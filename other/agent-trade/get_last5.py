import requests
import re
import html
import sys

sys.stdout.reconfigure(encoding='utf-8')

r = requests.get("https://t.me/s/azcoinvestx", headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
matches = re.findall(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', r.text, re.DOTALL)
print(f"Total raw text blocks: {len(matches)}")
for idx, m in enumerate(matches[-5:], 1):
    clean = re.sub(r'<[^>]+>', ' ', m)
    clean = html.unescape(clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    print(f"--- POST {idx} ---")
    print(clean)
    print()
