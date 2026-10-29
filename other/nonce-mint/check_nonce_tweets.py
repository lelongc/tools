import requests
import re
import html
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://syndication.twitter.com/srv/timeline-profile/screen-name/nonceprotocol'
try:
    r = requests.get(url, headers=headers, timeout=10)
    print("Status:", r.status_code)
    if r.status_code == 200:
        matches = re.findall(r'<p class="[^"]*timeline-Tweet-text[^"]*"[^>]*>(.*?)</p>', r.text)
        print(f"Total tweets found: {len(matches)}")
        for m in matches[:5]:
            clean = re.sub(r'<[^>]+>', ' ', m)
            clean = html.unescape(clean)
            clean = re.sub(r'\s+', ' ', clean).strip()
            print("=>", clean)
except Exception as e:
    print("Error:", e)
