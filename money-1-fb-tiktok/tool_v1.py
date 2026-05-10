import feedparser
import os
import google.generativeai as genai
from datetime import datetime

# ==========================================
# CẤU HÌNH THÔNG TIN (HÃY ĐIỀN VÀO ĐÂY)
# ==========================================
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"  # Thay bằng API Key của bạn
RSS_FEEDS = [
    "https://vnexpress.net/rss/tin-moi-nhat.rss",
    "https://genk.vn/rss/mobile.rss",
    "https://tinhte.vn/rss",
    "https://kenh14.vn/rss/xa-hoi.rss"
]

# Cấu hình AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def rewrite_content(title, summary):
    """Sử dụng Gemini để viết lại nội dung theo phong cách hài hước/shock"""
    prompt = f"""
    Bạn là một chuyên gia sáng tạo nội dung viral trên Facebook. 
    Hãy viết lại tin tức sau đây theo phong cách: Hài hước, giật gân (shock), ngôn ngữ đời thường/Gen Z nhưng vẫn dễ hiểu.
    Mục tiêu: Khiến người đọc phải dừng lại, bình luận hoặc chia sẻ.
    
    Tin gốc:
    Tiêu đề: {title}
    Tóm tắt: {summary}
    
    Yêu cầu đầu ra:
    1. Một tiêu đề mới cực kỳ "click-bait" và hài hước.
    2. Nội dung bài viết ngắn gọn (khoảng 3-5 câu), có sử dụng các emoji phù hợp.
    3. Kết luận bằng một câu hỏi để tương tác.
    4. Thêm 3-5 hashtag liên quan.
    
    Hãy viết bằng tiếng Việt.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Lỗi AI: {str(e)}"

def main():
    print("--- ĐANG LẤY TIN MỚI NHẤT ---")
    
    # Tạo thư mục output nếu chưa có
    output_dir = "output_news"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for url in RSS_FEEDS:
        print(f"Đang quét nguồn: {url}")
        feed = feedparser.parse(url)
        
        # Lấy 3 tin mới nhất từ mỗi nguồn để tránh quá tải
        for entry in feed.entries[:3]:
            title = entry.title
            summary = entry.summary if 'summary' in entry else ""
            link = entry.link
            
            print(f"-> Đang xử lý: {title[:50]}...")
            
            # AI Viết lại
            new_content = rewrite_content(title, summary)
            
            # Lưu file
            filename = f"tin_{datetime.now().strftime('%H%M%S')}_{os.urandom(2).hex()}.txt"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"NGUỒN GỐC: {link}\n")
                f.write("="*30 + "\n")
                f.write(new_content)
            
            print(f"   [OK] Đã lưu vào: {filepath}")

if __name__ == "__main__":
    if GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("LỖI: Bạn chưa điền GEMINI_API_KEY vào file code!")
    else:
        main()
        print("\n--- HOÀN THÀNH! Kiểm tra thư mục 'output_news' ---")
