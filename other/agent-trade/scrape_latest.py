import sys
import re
import html
import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

url = "https://t.me/s/azcoinvestx"
print("Đang cào các bài đăng mới nhất từ https://t.me/s/azcoinvestx...")

r = requests.get(url, headers=headers, timeout=15)
if r.status_code == 200:
    # Extract message blocks with message IDs and timestamps if possible
    blocks = re.findall(r'<div class="tgme_widget_message_wrap[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>', r.text, re.DOTALL)
    
    posts = []
    # If blocks parsing is tricky, parse text directly
    raw_texts = re.findall(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', r.text, re.DOTALL)
    times = re.findall(r'<time datetime="([^"]+)"', r.text)
    
    print(f"Tìm thấy {len(raw_texts)} bài đăng trên trang mới nhất.")
    
    for idx, t in enumerate(raw_texts):
        clean = re.sub(r'<[^>]+>', ' ', t)
        clean = html.unescape(clean)
        clean = re.sub(r'\s+', ' ', clean).strip()
        time_str = times[idx] if idx < len(times) else "N/A"
        if clean:
            posts.append({
                "time": time_str,
                "text": clean
            })
            
    with open("d:/folder/tools/other/agent-trade/latest_posts.txt", "w", encoding="utf-8") as f:
        for idx, p in enumerate(posts, 1):
            f.write(f"=== BÀI MỚI {idx} | Thời gian: {p['time']} ===\n{p['text']}\n\n")
            
    print(f"Đã lưu {len(posts)} bài mới vào d:/folder/tools/other/agent-trade/latest_posts.txt")
else:
    print(f"Lỗi tải trang: HTTP {r.status_code}")
