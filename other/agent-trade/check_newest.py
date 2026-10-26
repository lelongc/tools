import requests
import re
import html
import sys

sys.stdout.reconfigure(encoding='utf-8')

r = requests.get("https://t.me/s/azcoinvestx", headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
# find all messages with tgme_widget_message
messages = re.findall(r'<div class="tgme_widget_message_wrap[^"]*"[^>]*data-post="azcoinvestx/(\d+)".*?<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', r.text, re.DOTALL)
print(f"Total matched messages: {len(messages)}")

for post_id, text in messages[-6:]:
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = html.unescape(clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    print(f"=== POST ID: {post_id} ===")
    print(clean)
    print()
