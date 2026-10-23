import sys
import re
import html
import requests

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

url = "https://t.me/s/azcoinvestx"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

resp = requests.get(url, headers=headers, timeout=12)
if resp.status_code == 200:
    # Trích xuất các message
    pattern = r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>'
    matches = re.findall(pattern, resp.text, re.DOTALL)
    print(f"=== ĐÃ LẤY ĐƯỢC {len(matches)} BÀI ĐĂNG GẦN NHẤT TỪ AZCOINVEST ===")
    for i, m in enumerate(matches[-8:], 1):
        clean = re.sub(r'<[^>]+>', ' ', m)
        clean = html.unescape(clean)
        clean = re.sub(r'\s+', ' ', clean).strip()
        print(f"\n--- BÀI {i} ---")
        print(clean)
else:
    print(f"Lỗi tải trang: HTTP {resp.status_code}")
