import os
import sys
import time
import json
import threading
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
import requests

# Import bot modules
from config import Config
import dns_resolver
from binance_engine import BinanceEngine
from indicators import TechnicalIndicators
from news_engine import NewsEngine
from telegram_scraper import TelegramScraper
from gemini_advisor import GeminiAdvisor

# Shared state for the Web Dashboard
BOT_STATE = {
    "status": "INITIALIZING",
    "uptime_start": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "last_scan_time": "Chưa quét",
    "symbol": Config.SYMBOL,
    "current_price": 0.0,
    "rsi": 50.0,
    "signal": "WAIT",
    "confidence": 0,
    "advisor_reason": "Đang khởi động bot...",
    "active_trade": None, # {"symbol": "SOL/USDT", "side": "BUY", "entry": 175.5, "pnl": 0.0, "pnl_usdt": 0.0}
    "total_profit_usdt": 0.0,
    "trades_count": 0,
    "latest_telegram_posts": [],
    "logs": []
}

STATE_LOCK = threading.Lock()

def add_log(msg: str):
    timestamp = datetime.now().strftime("%H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    with STATE_LOCK:
        BOT_STATE["logs"].append(formatted)
        if len(BOT_STATE["logs"]) > 50:
            BOT_STATE["logs"].pop(0)

def send_telegram_alert(message: str):
    token = Config.TELEGRAM_BOT_TOKEN
    chat_id = Config.TELEGRAM_CHAT_ID
    if not token or not chat_id:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        requests.post(url, json=payload, timeout=6)
    except Exception as e:
        add_log(f"Lỗi gửi tin Telegram: {e}")

def bot_worker_loop():
    """Vòng lặp ngầm 24/7 quét thị trường và cào tin Telegram"""
    add_log("🚀 Bắt đầu tiến trình Bot Worker 24/7...")
    send_telegram_alert(f"🚀 <b>BOT BINANCE SCALPER 24/7 ĐÃ KHỞI ĐỘNG!</b>\nTheo dõi: {Config.SYMBOL} | Mục tiêu: +{Config.PROFIT_TARGET_USDT}$ | Cắt lỗ: -{Config.STOP_LOSS_USDT}$")

    
    binance = None
    try:
        binance = BinanceEngine()
        add_log(f"✅ Kết nối Binance thành công (Testnet: {Config.USE_TESTNET})")
    except Exception as e:
        add_log(f"⚠️ Chưa kết nối Binance API: {e} (Chạy chế độ mô phỏng)")

    news_engine = NewsEngine()
    tele_scraper = TelegramScraper(channel_url="https://t.me/s/azcoinvestx")
    advisor = GeminiAdvisor()

    with STATE_LOCK:
        BOT_STATE["status"] = "RUNNING_24_7"

    last_tele_check = 0
    
    while True:
        try:
            now = time.time()
            
            # 1. Cào tin Telegram mỗi 5 phút (300 giây)
            if now - last_tele_check > 300:
                add_log("📡 Đang quét tin mới từ Telegram @azcoinvestx...")
                try:
                    tele_posts = tele_scraper.fetch_latest_posts()
                    if tele_posts:
                        with STATE_LOCK:
                            BOT_STATE["latest_telegram_posts"] = tele_posts[:5]
                        add_log(f"✅ Đã cập nhật {len(tele_posts)} tin mới từ Telegram")
                except Exception as te:
                    add_log(f"Lỗi quét Telegram: {te}")
                last_tele_check = now

            # 2. Quét giá và chỉ báo kỹ thuật của cặp coin (mỗi 30 giây)
            symbol = Config.SYMBOL
            candles = None
            if binance:
                try:
                    candles = binance.fetch_ohlcv(symbol=symbol, timeframe="15m", limit=30)
                except Exception as ce:
                    add_log(f"Lỗi lấy nến {symbol}: {ce}")

            if candles:
                prices = [c["close"] for c in candles]
                current_price = prices[-1]
                rsi = TechnicalIndicators.calculate_rsi(prices, period=14)
                bb = TechnicalIndicators.calculate_bollinger_bands(prices, period=20, num_std=2.0)
                
                with STATE_LOCK:
                    BOT_STATE["current_price"] = current_price
                    BOT_STATE["rsi"] = round(rsi, 2)
                    BOT_STATE["last_scan_time"] = datetime.now().strftime("%H:%M:%S")

                # Kiểm tra tín hiệu kỹ thuật
                is_oversold = rsi < 35
                is_overbought = rsi > 65
                
                if is_oversold or is_overbought:
                    add_log(f"⚡ Phát hiện biến động {symbol}: Giá={current_price}, RSI={rsi:.1f}. Đang hỏi Gemini...")
                    market_data = {
                        "symbol": symbol,
                        "current_price": current_price,
                        "rsi": rsi,
                        "bb_lower": bb.get("lower", 0),
                        "bb_upper": bb.get("upper", 0),
                        "bb_middle": bb.get("middle", 0)
                    }
                    recent_news = news_engine.fetch_latest_crypto_news(limit=3)
                    tele_feed = tele_scraper.get_recent_summary_for_ai()
                    
                    analysis = advisor.analyze_market(
                        market_data=market_data,
                        news_headlines=recent_news,
                        telegram_summary=tele_feed
                    )
                    
                    with STATE_LOCK:
                        BOT_STATE["signal"] = analysis.get("action", "HOLD")
                        BOT_STATE["confidence"] = analysis.get("confidence", 0)
                        BOT_STATE["advisor_reason"] = analysis.get("reasoning", "")
                    
                    action = analysis.get("action", "HOLD")
                    confidence = analysis.get("confidence", 0)
                    if action in ("BUY", "SELL") and confidence >= Config.MIN_CONFIDENCE:
                        send_telegram_alert(f"⚡ <b>TÍN HIỆU GEMINI AI!</b>\nCặp: {symbol}\nLệnh: <b>{action}</b> (Tin cậy: {confidence}%)\nGiá: ${current_price}\nLý do: {analysis.get('reasoning')[:150]}")
                    add_log(f"🤖 Gemini tư vấn: {action} (Tin cậy: {confidence}%) - {analysis.get('reasoning')[:80]}...")
            
            # Nghỉ 30 giây trước vòng quét tiếp theo
            time.sleep(30)
            
        except Exception as e:
            add_log(f"⚠️ Lỗi vòng lặp worker: {e}")
            time.sleep(10)

class DashboardHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Endpoint /health cho cron-job.org / UptimeRobot ping chống ngủ
        if self.path in ("/health", "/ping"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            with STATE_LOCK:
                resp = json.dumps({
                    "status": "healthy",
                    "bot_status": BOT_STATE["status"],
                    "symbol": BOT_STATE["symbol"],
                    "current_price": BOT_STATE["current_price"],
                    "last_scan": BOT_STATE["last_scan_time"]
                })
            self.wfile.write(resp.encode("utf-8"))
            return

        # 2. Trang chủ Dashboard giao diện web
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()

        with STATE_LOCK:
            state = dict(BOT_STATE)
            logs_html = "".join([f"<div class='log-line'>{l}</div>" for l in reversed(state["logs"][-20:])])
            tele_html = ""
            for p in state["latest_telegram_posts"][:4]:
                t = p.get("text", "")[:120] + "..." if len(p.get("text", "")) > 120 else p.get("text", "")
                tele_html += f"<div class='tele-item'><b>📢 [{p.get('time', 'Mới')[:10]}]:</b> {t}</div>"

        signal_color = "#10b981" if state["signal"] == "BUY" else ("#ef4444" if state["signal"] == "SELL" else "#64748b")

        html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Binance Gemini 24/7 Bot Dashboard</title>
    <meta http-equiv="refresh" content="15">
    <style>
        :root {{
            --bg: #090d16;
            --card-bg: rgba(18, 26, 43, 0.8);
            --border: #1e293b;
            --text: #f1f5f9;
            --accent: #f59e0b;
            --green: #10b981;
            --red: #ef4444;
            --cyan: #06b6d4;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 16px;
            display: flex;
            justify-content: center;
        }}
        .container {{
            max-width: 900px;
            width: 100%;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            margin-bottom: 16px;
        }}
        .title {{
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--accent);
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .status-badge {{
            background: rgba(16, 185, 129, 0.15);
            color: var(--green);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
        }}
        .card {{
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
        }}
        .card-label {{
            font-size: 0.8rem;
            color: #94a3b8;
            margin-bottom: 6px;
            text-transform: uppercase;
        }}
        .card-value {{
            font-size: 1.5rem;
            font-weight: 700;
        }}
        .tele-item {{
            padding: 8px 12px;
            background: rgba(30, 41, 59, 0.5);
            border-left: 3px solid var(--cyan);
            border-radius: 6px;
            margin-bottom: 8px;
            font-size: 0.85rem;
            line-height: 1.4;
        }}
        .logs-box {{
            background: #020617;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            font-family: monospace;
            font-size: 0.8rem;
            max-height: 250px;
            overflow-y: auto;
        }}
        .log-line {{
            padding: 3px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: #cbd5e1;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🤖 BINANCE SCALPER & TELEGRAM BOT</div>
            <div class="status-badge">🟢 24/7 RUNNING</div>
        </div>

        <div class="grid">
            <div class="card">
                <div class="card-label">Cặp Coin Theo Dõi</div>
                <div class="card-value" style="color: var(--cyan);">{state["symbol"]}</div>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">Giá: ${state["current_price"]} | RSI: {state["rsi"]}</div>
            </div>
            <div class="card">
                <div class="card-label">Mục Tiêu Mỗi Lệnh</div>
                <div class="card-value" style="color: var(--green);">+${Config.PROFIT_TARGET_USDT} USDT</div>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">Cắt lỗ: -${Config.STOP_LOSS_USDT}$ | Ký quỹ: {Config.MARGIN_USDT}$</div>
            </div>
            <div class="card">
                <div class="card-label">Khuyên Dùng Từ Gemini</div>
                <div class="card-value" style="color: {signal_color};">{state["signal"]} ({state["confidence"]}%)</div>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{state["advisor_reason"]}</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 16px;">
            <div class="card-label" style="display: flex; justify-content: space-between;">
                <span>📢 Kèo Mới Nhất Từ Telegram @azcoinvestx</span>
                <span style="color: #64748b;">Tự động cập nhật</span>
            </div>
            {tele_html if tele_html else "<div style='color: #64748b;'>Đang tải dữ liệu Telegram...</div>"}
        </div>

        <div class="card">
            <div class="card-label">📜 Nhật Ký Hoạt Động (Live Console)</div>
            <div class="logs-box">
                {logs_html}
            </div>
        </div>
    </div>
</body>
</html>"""
        self.wfile.write(html.encode("utf-8"))

    def log_message(self, format, *args):
        # Tắt bớt log HTTP mặc định để console sạch đẹp
        pass

def main():
    port = int(os.environ.get("PORT", 8080))
    add_log(f"🌐 Khởi động Web Server trên port {port}...")
    
    # Khởi chạy bot worker trong thread ngầm
    worker_thread = threading.Thread(target=bot_worker_loop, daemon=True)
    worker_thread.start()
    
    # Khởi chạy HTTP Server chính
    server = HTTPServer(("", port), DashboardHandler)
    add_log(f"✅ Web Server đã sẵn sàng tại http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        add_log("Dừng server...")
        server.server_close()

if __name__ == "__main__":
    main()
