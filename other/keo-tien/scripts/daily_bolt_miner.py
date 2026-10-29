import os
import sys
import re
import time
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Search for .env in local dir or nonce-mint
env_paths = [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parents[1] / ".env",
    Path(__file__).resolve().parents[2] / "nonce-mint" / ".env"
]
for ep in env_paths:
    if ep.exists():
        load_dotenv(ep)
        break

API_KEY = os.getenv("BOLTBOOK_API_KEY", "").strip()
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def solve_challenge(challenge_text):
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', challenge_text).lower()
    clean = re.sub(r'\s+', ' ', clean)
    w2n = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
        'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
        'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
        'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
        'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30,
        'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
        'eighty': 80, 'ninety': 90, 'hundred': 100
    }
    tokens = clean.split()
    numbers = []
    i = 0
    while i < len(tokens):
        w = tokens[i]
        if w.isdigit():
            numbers.append(float(w))
        elif w in w2n:
            val = w2n[w]
            if i + 1 < len(tokens) and tokens[i+1] in w2n:
                val += w2n[tokens[i+1]]
                i += 1
            numbers.append(float(val))
        i += 1
        
    if len(numbers) < 2:
        return "0.00"
    if any(k in clean for k in ['each', 'times', 'multiplied', 'multiply', 'product']):
        ans = numbers[0] * numbers[1]
    elif any(k in clean for k in ['divide', 'divided', 'split', 'shares equally']):
        ans = numbers[0] / numbers[1]
    elif any(k in clean for k in ['minus', 'subtract', 'subtracted', 'less', 'take away', 'difference', 'remains', 'left', 'sells', 'gives', 'lost', 'loses', 'spends']):
        ans = numbers[0] - numbers[1]
    else:
        ans = numbers[0] + numbers[1]
    return f"{ans:.2f}"

def run_daily_routine():
    print("=" * 60)
    print("⚡ BẮT ĐẦU CHẠY KHAI THÁC HÀNG NGÀY TRÊN BOLTBOOK")
    print("=" * 60)

    if not API_KEY:
        print("Lỗi: Không tìm thấy BOLTBOOK_API_KEY trong .env")
        return

    # 1. Lấy danh sách bài viết mới
    posts_res = requests.get("https://boltbook.fun/api/v1/posts?sort=new&limit=10", headers=HEADERS).json()
    posts = posts_res.get("posts", [])
    print(f"• Đã lấy {len(posts)} bài viết mới nhất trên Boltbook.")

    # 2. Vote 5 bài viết
    voted = 0
    for p in posts:
        pid = p.get("id")
        if p.get("your_vote") == 0:
            vr = requests.post(f"https://boltbook.fun/api/v1/posts/{pid}/vote", headers=HEADERS, json={"direction": 1}).json()
            if vr.get("success"):
                voted += 1
                print(f"  + Đã vote Up bài: {pid} ({p.get('title')[:30]}...)")
                if voted >= 5:
                    break
            time.sleep(1)

    print(f"• Hoàn tất {voted} lượt Upvote.")

    # 3. Kiểm tra số dư thưởng hiện tại
    rw = requests.get("https://boltbook.fun/api/v1/rewards/me", headers=HEADERS).json()
    print("• Thống kê phần thưởng:", json.dumps(rw, indent=2))
    print("=" * 60)

if __name__ == "__main__":
    run_daily_routine()
