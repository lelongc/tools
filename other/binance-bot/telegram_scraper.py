import sys
import re
import html
import requests
from datetime import datetime

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

class TelegramScraper:
    # Danh sách các kênh Telegram tin tức crypto nóng hàng đầu thế giới và VN
    DEFAULT_CHANNELS = [
        "binance_announcements",  # Thông báo niêm yết, sự kiện Binance
        "cointelegraph",          # Tin tức crypto nhanh nhất
        "WatcherGuru",            # Tin tức tài chính, whale, breaking news
        "tier10k",                # Walter Bloomberg Crypto (Tin nóng tài chính)
        "tradinginsight_channel"  # Kênh phân tích & tín hiệu cộng đồng VN
    ]

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    @classmethod
    def clean_html(cls, text: str) -> str:
        if not text:
            return ""
        text = re.sub(r'<[^>]+>', ' ', text)
        text = html.unescape(text)
        return re.sub(r'\s+', ' ', text).strip()

    @classmethod
    def fetch_channel_messages(cls, channel_name: str, limit: int = 3) -> list[dict]:
        """
        Cào trực tiếp tin nhắn mới nhất từ Telegram Web Preview (https://t.me/s/...)
        Hoàn toàn miễn phí, không cần đăng nhập, không cần số điện thoại hay API ID!
        """
        clean_name = channel_name.replace("@", "").strip()
        url = f"https://t.me/s/{clean_name}"
        messages = []

        try:
            resp = requests.get(url, headers=cls.HEADERS, timeout=6)
            if resp.status_code == 200:
                # Tìm các khối tin nhắn trong html
                raw_msgs = re.findall(
                    r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>',
                    resp.text,
                    re.DOTALL
                )
                for raw in raw_msgs[-limit:]: # Lấy các tin mới nhất ở cuối
                    clean_msg = cls.clean_html(raw)
                    if len(clean_msg) > 20: # Lọc bỏ các tin quá ngắn
                        messages.append({
                            "channel": f"@{clean_name}",
                            "text": clean_msg[:250]
                        })
        except Exception:
            pass

        return messages

    @classmethod
    def fetch_all_telegram_news(cls, custom_channels: list[str] = None, limit_per_channel: int = 2) -> list[dict]:
        """
        Quét toàn bộ danh sách kênh Telegram để lấy tin nóng tổng hợp
        """
        channels = custom_channels or cls.DEFAULT_CHANNELS
        all_news = []
        for ch in channels:
            msgs = cls.fetch_channel_messages(ch, limit=limit_per_channel)
            all_news.extend(msgs)
        return all_news

if __name__ == "__main__":
    print("Testing Telegram Scraper...")
    news = TelegramScraper.fetch_all_telegram_news()
    print(f"Lấy được {len(news)} tin tức nóng từ Telegram:")
    for n in news[:5]:
        print(f"[{n['channel']}]: {n['text'][:100]}...\n")
