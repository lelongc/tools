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

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
all_posts = []
url = "https://t.me/s/azcoinvestx"

print("Đang cào dữ liệu lịch sử các bài đăng từ Azcoinvest...")
for page in range(4): # Lấy 4 trang lịch sử liên tiếp
    try:
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 200:
            matches = re.findall(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', r.text, re.DOTALL)
            count = 0
            for m in matches:
                clean = re.sub(r'<[^>]+>', ' ', m)
                clean = html.unescape(clean)
                clean = re.sub(r'\s+', ' ', clean).strip()
                if clean and clean not in all_posts:
                    all_posts.append(clean)
                    count += 1
            print(f"Trang {page + 1}: Lấy được {count} bài.")
            prev = re.findall(r'href="/s/azcoinvestx\?before=(\d+)"', r.text)
            if prev:
                url = f"https://t.me/s/azcoinvestx?before={prev[0]}"
            else:
                break
    except Exception as e:
        print(f"Lỗi tải trang: {e}")
        break

print(f"Tổng cộng lấy được {len(all_posts)} bài đăng.")

with open("d:/folder/tools/other/agent-trade/raw_posts.txt", "w", encoding="utf-8") as f:
    for idx, p in enumerate(all_posts, 1):
        f.write(f"=== POST {idx} ===\n{p}\n\n")

print("Đã lưu vào d:/folder/tools/other/agent-trade/raw_posts.txt")
