import xml.etree.ElementTree as ET
import html
import re
import requests
from datetime import datetime

class NewsEngine:
    FEEDS = [
        {"name": "CryptoPanic", "url": "https://cryptopanic.com/news/rss/"},
        {"name": "Cointelegraph", "url": "https://cointelegraph.com/rss"},
        {"name": "Decrypt", "url": "https://decrypt.co/feed"}
    ]
    
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    @classmethod
    def clean_text(cls, text: str) -> str:
        if not text:
            return ""
        # Bỏ thẻ html
        text = re.sub(r'<[^>]+>', ' ', text)
        # Decode ký tự html
        text = html.unescape(text)
        # Gộp khoảng trắng thừa
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    @classmethod
    def fetch_latest_news(cls, limit: int = 10) -> list[dict]:
        """
        Lấy các tin tức crypto nóng và mới nhất từ nhiều nguồn uy tín hàng đầu.
        Trả về danh sách các tin: [{'source': ..., 'title': ..., 'summary': ...}]
        """
        all_news = []
        
        for feed in cls.FEEDS:
            try:
                resp = requests.get(feed["url"], headers=cls.HEADERS, timeout=8)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.content)
                    # Duyệt qua các item trong RSS
                    items = root.findall(".//item")
                    for item in items[:5]: # Lấy 5 tin mới nhất mỗi nguồn
                        title_elem = item.find("title")
                        desc_elem = item.find("description")
                        
                        title = cls.clean_text(title_elem.text if title_elem is not None else "")
                        desc = cls.clean_text(desc_elem.text if desc_elem is not None else "")
                        
                        if title:
                            all_news.append({
                                "source": feed["name"],
                                "title": title,
                                "summary": desc[:200]
                            })
            except Exception as e:
                # Bỏ qua nguồn lỗi để không chặn các nguồn khác
                continue
                
        # Giới hạn số lượng tin trả về cho AI phân tích
        return all_news[:limit]

if __name__ == "__main__":
    print("Testing News Engine...")
    news = NewsEngine.fetch_latest_news(limit=5)
    print(f"Fetched {len(news)} news items:")
    for idx, item in enumerate(news, 1):
        print(f"{idx}. [{item['source']}] {item['title']}")
