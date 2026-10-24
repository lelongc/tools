import os
import sys
import re
import json
import requests
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Load Gemini API Key from binance-bot/.env
load_dotenv(dotenv_path="d:/folder/tools/other/binance-bot/.env")
api_key = os.getenv("GEMINI_API_KEY")

with open("d:/folder/tools/other/agent-trade/raw_posts.txt", "r", encoding="utf-8") as f:
    content = f.read()

posts = content.split("=== POST ")
parsed_posts = []

keywords = [
    "#nft", "#airdrop", "#retroactive", "#testnet", "#lowcap", "#gem", 
    "mint", "airdrop", "retroactive", "testnet", "check-in", "faucet", 
    "free", "claim", "keo", "kèo", "kèo free", "bước", "hướng dẫn", "tham gia"
]

for p in posts[1:]:
    lines = p.strip().split("\n", 1)
    if len(lines) < 2:
        continue
    post_id = lines[0].strip()
    post_body = lines[1].strip()
    
    p_lower = post_body.lower()
    # Check if contains any keywords
    matched_kw = [kw for kw in keywords if kw in p_lower]
    if matched_kw and len(post_body) > 40:
        parsed_posts.append({
            "id": post_id,
            "matched": matched_kw,
            "text": post_body
        })

print(f"Tổng số bài tìm thấy liên quan đến Kèo / Airdrop / NFT: {len(parsed_posts)}")

# Chuẩn bị prompt gửi Gemini phân tích chuyên sâu
prompt = f"""
Bạn là chuyên gia thẩm định và săn kèo Web3 / Airdrop / Retroactive hàng đầu.
Dưới đây là {len(parsed_posts[:15])} bài đăng gần nhất được lọc từ kênh Telegram Azcoinvest (chuyên mục Airdrop, Retroactive, NFT, Gem).

Hãy phân tích và lọc ra CÁC KÈO TỐT NHẤT thỏa mãn tiêu chí của người dùng:
1. Chi phí: MIỄN PHÍ (0 đồng / Testnet) HOẶC CHI PHÍ CỰC RẺ (<= 5$ tiền gas).
2. Phù hợp cho cày nhiều ví (20 ví MetaMask) hoặc thao tác tự động/bán tự động.
3. Không phải kèo cờ bạc/scam/meme vớ vẩn.

Với mỗi kèo tìm được, hãy trình bày ngắn gọn:
- Tên kèo / Dự án
- Loại kèo (Testnet 0đ, Free-mint NFT, Check-in on-chain, hay Claim token)
- Chi phí ước tính (0đ hay tốn bao nhiêu gas)
- Đánh giá tiềm năng (Ngon hay không, độ uy tín)
- Hướng dẫn các bước làm (Rõ ràng, dễ hiểu)
- Tôi (Bot) có tự động hóa được bằng 20 ví MetaMask không?

Dữ liệu các bài đăng:
"""

for p in parsed_posts[:15]:
    prompt += f"\n--- BÀI {p['id']} (Tags: {', '.join(p['matched'][:4])}) ---\n{p['text']}\n"

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
headers = {"Content-Type": "application/json"}
payload = {
    "contents": [{"parts": [{"text": prompt}]}],
    "generationConfig": {"temperature": 0.2}
}

try:
    res = requests.post(url, headers=headers, json=payload, timeout=30)
    if res.status_code == 200:
        data = res.json()
        analysis = data["candidates"][0]["content"]["parts"][0]["text"]
        print("\n" + "="*70)
        print("📊 KẾT QUẢ PHÂN TÍCH KÈO TỪ KÊNH TELEGRAM AZCOINVEST:")
        print("="*70 + "\n")
        print(analysis)
        with open("d:/folder/tools/other/agent-trade/keo_analysis.md", "w", encoding="utf-8") as out:
            out.write(analysis)
        print("\n" + "="*70)
        print("✅ Đã lưu báo cáo chi tiết vào: d:/folder/tools/other/agent-trade/keo_analysis.md")
        print("="*70)
    else:
        print(f"Lỗi API Gemini ({res.status_code}): {res.text}")
except Exception as e:
    print(f"Lỗi kết nối Gemini: {e}")
