import json
import re
import requests
from config import Config

class GeminiAdvisor:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or Config.GEMINI_API_KEY
        self.model = model or Config.GEMINI_MODEL
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

    def evaluate_all(self, safe_market_data: dict, breakout_coins: list[dict], web_news: list[dict], tele_news: list[dict]) -> dict:
        """
        Gemini phân tích đồng thời:
        1. Kèo an toàn (SOL/USDT hoặc BNB/BTC): Ký quỹ 5$ x5, chốt lời +0.5$
        2. Kèo lướt sóng biến động (0.5$ x10): Chỉ đề xuất khi có dòng tiền + tin tức Telegram/Báo chí cực mạnh
        """
        if not self.api_key:
            return {
                "safe_trade": {"decision": "WAIT", "confidence": 0, "reason": "Chưa có GEMINI_API_KEY"},
                "surf_opportunity": None
            }

        # Định dạng tin tức tổng hợp từ Web và Telegram
        news_summary = "=== TIN TỨC WEB (CryptoPanic/Cointelegraph) ===\n"
        for i, item in enumerate(web_news[:6], 1):
            news_summary += f"{i}. [{item.get('source')}] {item.get('title')}\n"

        news_summary += "\n=== TIN TỨC REALTIME TỪ CÁC KÊNH TELEGRAM NÓNG ===\n"
        for i, item in enumerate(tele_news[:6], 1):
            news_summary += f"{i}. [{item.get('channel')}] {item.get('text')}\n"

        # Định dạng danh sách coin đang có sóng mạnh
        breakout_summary = ""
        for c in breakout_coins[:4]:
            breakout_summary += f"- {c['symbol']}: Giá {c['price']}$, Tăng 24h: +{c['change_24h']}%, Volume: {c['volume_usdt_m']}M$\n"

        prompt = f"""
Bạn là AI chuyên gia quản lý vốn định lượng và săn sóng crypto trên Binance Futures.
QUY TẮC CỐT LÕI CỦA NGƯỜI DÙNG:
1. KÈO AN TOÀN ({safe_market_data.get('symbol', 'SOL/USDT')}): Đòn bẩy x3 - x5, ký quỹ 5$, mục tiêu +0.50$ (chỉ cần giá chạy 1.5% - 2%). Nếu thị trường sideway thì chọn "WAIT".
2. KÈO LƯỚT SÓNG MẠO HIỂM VỐN NHỎ (0.5$): Ký quỹ đúng 0.5$ với đòn bẩy x10 (tổng vị thế 5$). Mục tiêu X1 VỐN (+0.50$ lãi). Chỉ đề xuất nếu thấy coin nào trong danh sách Breakout có tin tức hỗ trợ mạnh trên Telegram/Web. Nếu không có coin nào thực sự tiềm năng, trả về surf_opportunity = null.

DỮ LIỆU KÈO AN TOÀN HIỆN TẠI ({safe_market_data.get('symbol')}):
- Giá: {safe_market_data.get('price')}$ | RSI(14): {safe_market_data.get('rsi')} | {safe_market_data.get('ema_trend')} | Funding: {safe_market_data.get('funding_rate')}%

DANH SÁCH COIN ĐANG BÙNG NỔ VOLUME TRÊN SÀN (CÓ THỂ LƯỚT):
{breakout_summary}

TIN TỨC WEB & TELEGRAM REALTIME MỚI NHẤT:
{news_summary}

HÃY TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON (Không kèm markdown codeblock):
{{
  "safe_trade": {{
    "decision": "LONG" | "SHORT" | "WAIT",
    "confidence": 0-100,
    "reason": "Giải thích ngắn gọn 1 câu"
  }},
  "surf_opportunity": null hoặc {{
    "symbol": "TÊN_COIN_USDT",
    "action": "LONG" | "SHORT",
    "confidence": 0-100,
    "reason": "Lý do lướt 0.5$ ăn x1",
    "leverage": 10,
    "margin_usdt": 0.5,
    "target_profit_usdt": 0.5
  }}
}}
"""

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.2, "maxOutputTokens": 500}
        }
        headers = {"Content-Type": "application/json"}

        try:
            resp = requests.post(self.endpoint, headers=headers, json=payload, timeout=20)
            if resp.status_code == 200:
                text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                match = re.search(r'\{.*\}', text, re.DOTALL)
                if match:
                    return json.loads(match.group(0))
            return {
                "safe_trade": {"decision": "WAIT", "confidence": 0, "reason": "Không phân tích được phản hồi Gemini"},
                "surf_opportunity": None
            }
        except Exception as e:
            return {
                "safe_trade": {"decision": "WAIT", "confidence": 0, "reason": f"Lỗi Gemini: {e}"},
                "surf_opportunity": None
            }
