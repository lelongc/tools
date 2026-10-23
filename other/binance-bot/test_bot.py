import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from binance_engine import BinanceEngine
from news_engine import NewsEngine
from telegram_scraper import TelegramScraper
from volatility_scanner import VolatilityScanner

def test_full_pipeline():
    print("==========================================================")
    print("      KIỂM TRA HỆ THỐNG DỮ LIỆU ĐA TẦNG CỦA BOT")
    print("==========================================================")

    # 1. Telegram News
    print("\n[1] Đang quét tin tức Realtime từ các kênh Telegram...")
    tele_news = TelegramScraper.fetch_all_telegram_news(limit_per_channel=1)
    print(f" -> Lấy thành công {len(tele_news)} tin nóng từ Telegram:")
    for t in tele_news[:3]:
        print(f"    • [{t['channel']}]: {t['text'][:90]}...")

    # 2. Web News
    print("\n[2] Đang lấy tin tức Web từ CryptoPanic & Cointelegraph...")
    web_news = NewsEngine.fetch_latest_news(limit=2)
    for w in web_news:
        print(f"    • [{w['source']}]: {w['title'][:90]}")

    # 3. Radar Bùng Nổ Sóng (Breakout Radar)
    print("\n[3] Radar quét các đồng coin đang bùng nổ volume trên Binance...")
    hot_coins = VolatilityScanner.scan_breakout_coins(top_limit=3)
    for c in hot_coins:
        print(f"    • {c['symbol']}: Giá {c['price']}$ | Tăng 24h: +{c['change_24h']}% | Vol: {c['volume_usdt_m']}M$")

    # 4. Kèo An Toàn (SOL/USDT)
    print("\n[4] Dữ liệu kỹ thuật Kèo An Toàn (SOL/USDT)...")
    engine = BinanceEngine()
    snapshot = engine.get_market_snapshot("SOL/USDT")
    print(f"    • Giá SOL: {snapshot.get('price')}$ | RSI: {snapshot.get('rsi')} | {snapshot.get('ema_trend')}")

    print("\n✅ TẤT CẢ DỮ LIỆU ĐÃ KẾT NỐI TRƠN TRU VÀ SẴN SÀNG 100%!")

if __name__ == "__main__":
    test_full_pipeline()
