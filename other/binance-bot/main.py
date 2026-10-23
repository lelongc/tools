import sys
import time
import msvcrt
from datetime import datetime
from colorama import init, Fore, Style

import dns_resolver # Tự động chống chặn DNS nhà mạng VN
from config import Config
from news_engine import NewsEngine
from telegram_scraper import TelegramScraper
from volatility_scanner import VolatilityScanner
from gemini_advisor import GeminiAdvisor
from binance_engine import BinanceEngine

init(autoreset=True)

# Trạng thái vị thế hiện tại: {"active": False, "symbol": "", "mode": "SAFE" | "SURF", "target": 0.5, "stop": 0.8}
CURRENT_TRADE = {
    "active": False,
    "symbol": "",
    "mode": "SAFE",
    "target": Config.PROFIT_TARGET_USDT,
    "stop": Config.STOP_LOSS_USDT
}

def print_banner():
    print(Fore.CYAN + Style.BRIGHT + """
╔══════════════════════════════════════════════════════════════════════╗
║               🤖 BINANCE DUAL-ENGINE AI TRADING BOT 🤖               ║
║  1. KÈO AN TOÀN (Tự động): SOL / BNB / BTC (Ký quỹ 5$, x3-x5, TP 0.5$)║
║  2. KÈO LƯỚT SÓNG (Chỉ chơi khi BẠN CHO PHÉP): Vốn 0.5$ x10, Lời x1   ║
║  📡 Nguồn: Realtime Telegram + Web News + Radar Bùng Nổ Volume       ║
╚══════════════════════════════════════════════════════════════════════╝
    """)

def check_env_setup():
    if not Config.BINANCE_API_KEY or Config.BINANCE_API_KEY == "your_binance_api_key_here":
        print(Fore.RED + "❌ LỖI: Bạn chưa cài đặt BINANCE_API_KEY trong file .env!")
        print(Fore.YELLOW + "👉 Hãy mở file .env và điền BINANCE_API_KEY & BINANCE_API_SECRET.")
        return False
        
    if not Config.GEMINI_API_KEY or Config.GEMINI_API_KEY == "your_gemini_api_key_here":
        print(Fore.RED + "❌ LỖI: Bạn chưa cài đặt GEMINI_API_KEY trong file .env!")
        print(Fore.YELLOW + "👉 Lấy key miễn phí tại https://aistudio.google.com/ và điền vào .env.")
        return False
        
    return True

def countdown(seconds: int, message: str = "Nghỉ ngơi cooldown"):
    while seconds > 0:
        mins, secs = divmod(seconds, 60)
        time_str = f"{mins:02d}:{secs:02d}"
        sys.stdout.write(f"\r{Fore.YELLOW}⏳ [{message}] Tiếp tục sau: {time_str}...{Style.RESET_ALL} ")
        sys.stdout.flush()
        time.sleep(1)
        seconds -= 1
    print("\n")

def ask_user_permission_with_timeout(surf_info: dict, timeout_seconds: int = 30) -> bool:
    """
    Hỏi xin phép người dùng trước khi lướt sóng mạo hiểm vốn nhỏ 0.5$.
    Có đếm ngược timeout. Nếu hết thời gian hoặc gõ N -> Tự động từ chối.
    """
    symbol = surf_info.get("symbol")
    action = surf_info.get("action")
    reason = surf_info.get("reason")
    confidence = surf_info.get("confidence")

    print(Fore.YELLOW + Style.BRIGHT + "\n" + "="*70)
    print(Fore.RED + Style.BRIGHT + f"🚨 [PHÁT HIỆN KÈO LƯỚT SÓNG 0.5$]: {symbol} ({action})")
    print(Fore.WHITE + f"   • Độ tin cậy AI: {confidence}/100")
    print(Fore.WHITE + f"   • Lý do: {reason}")
    print(Fore.CYAN + f"   • Chiến lược: Ký quỹ 0.5$ đòn bẩy x10 (Min Notional 5$)")
    print(Fore.GREEN + f"   • Mục tiêu X1 VỐN: Lời +0.50$ chốt | Rủi ro tối đa: Mất 0.50$")
    print(Fore.YELLOW + f"❓ [XIN PHÉP BẠN]: Gõ 'Y' để DUYỆT chơi | Gõ 'N' hoặc để trống để BỎ QUA")
    print("="*70)

    start_time = time.time()
    user_input = ""

    while time.time() - start_time < timeout_seconds:
        remaining = int(timeout_seconds - (time.time() - start_time))
        sys.stdout.write(f"\r{Fore.MAGENTA}⏳ Đang chờ bạn quyết định ({remaining}s còn lại)... [Gõ Y/N]: {Style.RESET_ALL}{user_input}")
        sys.stdout.flush()

        if msvcrt.kbhit():
            ch = msvcrt.getwche()
            if ch in ('\r', '\n'): # Nhấn Enter
                break
            elif ch == '\b': # Backspace
                user_input = user_input[:-1]
            else:
                user_input += ch

        time.sleep(0.1)

    print()
    if user_input.strip().upper() == "Y":
        print(Fore.GREEN + Style.BRIGHT + "👉 BẠN ĐÃ ĐỒNG Ý! TIẾN HÀNH GIẢI NGÂN 0.5$ LƯỚT SÓNG...")
        return True
    else:
        print(Fore.YELLOW + "👉 BẠN ĐÃ TỪ CHỐI (hoặc hết giờ). Bỏ qua lướt sóng, giữ an toàn tuyệt đối!")
        return False

def main():
    global CURRENT_TRADE
    print_banner()
    
    if not check_env_setup():
        print(Fore.CYAN + "\nBot tạm dừng. Vui lòng cập nhật file .env rồi chạy lại!")
        input("\nNhấn Enter để thoát...")
        sys.exit(1)

    print(Fore.GREEN + "✅ Đang kết nối tới Binance Futures, Gemini AI và Telegram...")
    binance = BinanceEngine()
    advisor = GeminiAdvisor()

    # Kiểm tra số dư ví
    balance = binance.get_usdt_balance()
    print(Fore.CYAN + f"💰 Số dư khả dụng trong ví Futures: {balance:.2f} USDT")
    print(Fore.GREEN + f"🛡️ Cặp an toàn mặc định: {Config.SYMBOL} (Ký quỹ: {Config.MARGIN_USDT}$, Đòn bẩy: x{Config.LEVERAGE})")
    print("-" * 70)

    tracked_symbol = Config.SYMBOL

    while True:
        try:
            # 1. Kiểm tra vị thế đang mở
            pos = binance.get_open_position(tracked_symbol)
            
            if pos.get("has_position"):
                CURRENT_TRADE["active"] = True
                pnl = pos["pnl"]
                side = pos["side"]
                entry = pos["entry_price"]
                mark = pos["mark_price"]
                
                target = CURRENT_TRADE["target"]
                stop = CURRENT_TRADE["stop"]
                mode_str = "LƯỚT SÓNG (0.5$)" if CURRENT_TRADE["mode"] == "SURF" else "AN TOÀN"
                pnl_color = Fore.GREEN if pnl >= 0 else Fore.RED
                
                now_str = datetime.now().strftime("%H:%M:%S")
                print(f"[{now_str}] 📈 [{mode_str}] {side} {tracked_symbol} | Vào: {entry:.4f}$ | Hiện tại: {mark:.4f}$ | "
                      f"PnL: {pnl_color}{pnl:+.4f} USDT{Style.RESET_ALL} (Mục tiêu: +{target:.2f}$)")

                # A. CHỐT LỜI KHI ĐẠT MỤC TIÊU (+0.50$ hoặc x1)
                if pnl >= target:
                    print(Fore.GREEN + Style.BRIGHT + f"\n🎉🎉🎉 ĐẠT MỤC TIÊU LÃI +{pnl:.4f}$ USDT! ĐÓNG VỊ THẾ NGAY! 🎉🎉🎉")
                    binance.close_market_position(tracked_symbol)
                    CURRENT_TRADE["active"] = False
                    tracked_symbol = Config.SYMBOL # Reset về coin an toàn
                    print(Fore.CYAN + f"💤 Nghỉ ngơi {Config.COOLDOWN_MINUTES} phút theo yêu cầu...")
                    countdown(Config.COOLDOWN_MINUTES * 60, "Chờ thị trường sau chốt lời")
                    continue

                # B. CẮT LỖ BẢO HIỂM
                if pnl <= -stop:
                    print(Fore.RED + Style.BRIGHT + f"\n🛡️ CẮT LỖ BẢO HIỂM: {pnl:.4f}$ USDT (Giữ an toàn tài khoản!)")
                    binance.close_market_position(tracked_symbol)
                    CURRENT_TRADE["active"] = False
                    tracked_symbol = Config.SYMBOL
                    print(Fore.YELLOW + f"💤 Nghỉ ngơi {Config.COOLDOWN_MINUTES} phút...")
                    countdown(Config.COOLDOWN_MINUTES * 60, "Tạm dừng sau cắt lỗ bảo hiểm")
                    continue

                time.sleep(10)
                continue
            else:
                CURRENT_TRADE["active"] = False

            # 2. Không có vị thế -> Quét dữ liệu từ mọi nguồn: Web + Telegram + Binance Breakout
            now_str = datetime.now().strftime("%H:%M:%S")
            print(f"\n[{now_str}] 🔍 Đang quét thị trường, tin tức Web và các hội nhóm Telegram...")

            # Lấy dữ liệu coin an toàn
            safe_snapshot = binance.get_market_snapshot(Config.SYMBOL)
            # Lấy top coin bùng nổ volume
            breakout_coins = VolatilityScanner.scan_breakout_coins(top_limit=4)
            # Lấy tin tức Web
            web_news = NewsEngine.fetch_latest_news(limit=6)
            # Lấy tin nhắn các kênh Telegram nóng
            tele_news = TelegramScraper.fetch_all_telegram_news(limit_per_channel=2)

            print(Fore.BLUE + f"📊 An toàn ({Config.SYMBOL}): {safe_snapshot.get('price')}$ | RSI: {safe_snapshot.get('rsi')} | {safe_snapshot.get('ema_trend')}")
            print(Fore.BLUE + f"📡 Đã cào: {len(web_news)} tin Web + {len(tele_news)} tin Telegram nóng + {len(breakout_coins)} coin bùng nổ.")
            print(Fore.MAGENTA + "🧠 Gemini AI đang phân tích dữ liệu tổng hợp...")

            # AI Gemini đánh giá
            analysis = advisor.evaluate_all(safe_snapshot, breakout_coins, web_news, tele_news)
            
            safe_plan = analysis.get("safe_trade", {})
            surf_plan = analysis.get("surf_opportunity")

            # 3. Ưu tiên kiểm tra Kèo Lướt Sóng 0.5$ (NẾU CÓ & ĐƯỢC BẠN CHO PHÉP)
            if surf_plan and surf_plan.get("confidence", 0) >= 75:
                # BẮT BUỘC HỎI XIN PHÉP NGƯỜI DÙNG
                approved = ask_user_permission_with_timeout(surf_plan, timeout_seconds=30)
                if approved:
                    surf_symbol = surf_plan["symbol"].replace("/", "")
                    surf_action = surf_plan["action"]
                    print(Fore.GREEN + f"🚀 Đang mở vị thế LƯỚT SÓNG: {surf_symbol} ({surf_action}) vốn 0.5$ x10...")
                    order = binance.open_market_order(
                        symbol=surf_symbol,
                        side=surf_action,
                        margin_usdt=0.5,
                        leverage=10
                    )
                    if order:
                        CURRENT_TRADE = {
                            "active": True,
                            "symbol": surf_symbol,
                            "mode": "SURF",
                            "target": 0.50, # Lời x1 = +0.5$
                            "stop": 0.50   # Mất tối đa 0.5$ ký quỹ
                        }
                        tracked_symbol = surf_symbol
                        time.sleep(10)
                        continue

            # 4. Nếu không lướt sóng -> Chạy chiến lược AN TOÀN với SOL/USDT (hoặc BNB/BTC)
            safe_decision = safe_plan.get("decision", "WAIT").upper()
            safe_conf = safe_plan.get("confidence", 0)
            safe_reason = safe_plan.get("reason", "")

            print(Fore.CYAN + f"🤖 Quyết định Kèo An Toàn ({Config.SYMBOL}): [{safe_decision}] (Độ tin cậy: {safe_conf}/100)")
            print(Fore.WHITE + f"💡 Lý do: {safe_reason}")

            if safe_decision in ("LONG", "SHORT") and safe_conf >= Config.MIN_CONFIDENCE:
                print(Fore.GREEN + Style.BRIGHT + f"\n⚡ VÀO LỆNH AN TOÀN {safe_decision} {Config.SYMBOL} (Ký quỹ {Config.MARGIN_USDT}$, x{Config.LEVERAGE})...")
                order = binance.open_market_order(
                    symbol=Config.SYMBOL,
                    side=safe_decision,
                    margin_usdt=Config.MARGIN_USDT,
                    leverage=Config.LEVERAGE
                )
                if order:
                    CURRENT_TRADE = {
                        "active": True,
                        "symbol": Config.SYMBOL,
                        "mode": "SAFE",
                        "target": Config.PROFIT_TARGET_USDT,
                        "stop": Config.STOP_LOSS_USDT
                    }
                    tracked_symbol = Config.SYMBOL
                    time.sleep(10)
                else:
                    print(Fore.RED + "❌ Không thể khớp lệnh. Chờ nhịp tiếp theo.")
                    time.sleep(20)
            else:
                print(Fore.YELLOW + "⏳ Thị trường đang đi ngang hoặc chưa đủ tín hiệu. Chờ 60 giây quét tiếp...")
                time.sleep(60)

        except KeyboardInterrupt:
            print(Fore.YELLOW + "\n\n👋 Bạn đã dừng bot thủ công. Hẹn gặp lại!")
            break
        except Exception as e:
            print(Fore.RED + f"\n[Lỗi ngoài ý muốn]: {e}")
            time.sleep(15)

if __name__ == "__main__":
    main()
