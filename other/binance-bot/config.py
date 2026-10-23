import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Đảm bảo terminal Windows hiển thị tiếng Việt UTF-8 không bị lỗi charmap
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Chỉ nạp file .env nội bộ trong thư mục binance-bot
CURRENT_DIR = Path(__file__).resolve().parent
ENV_PATH = CURRENT_DIR / ".env"
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH, override=True)

class Config:
    # Binance API Keys
    BINANCE_API_KEY = os.getenv("BINANCE_API_KEY", "").strip()
    BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET", "").strip()
    
    # Testnet: Đặt là True nếu muốn test thử trên mạng ảo Binance Testnet trước
    USE_TESTNET = os.getenv("USE_TESTNET", "False").lower() in ("true", "1", "yes")
    
    # Gemini API Key (Miễn phí từ Google AI Studio)
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
    # Model Gemini tối ưu: gemini-1.5-flash hoặc gemini-2.0-flash
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash").strip()
    
    # Cấu hình giao dịch
    # SOL/USDT là đồng số 1 về biên độ biến động nhanh 2-3% trong vài giờ, thanh khoản top 5
    SYMBOL = os.getenv("SYMBOL", "SOL/USDT").strip()
    
    # Đòn bẩy (3x đến 5x theo yêu cầu người dùng)
    LEVERAGE = int(os.getenv("LEVERAGE", "5"))
    
    # Số tiền ký quỹ mỗi lệnh (USDT) - Ví dụ 5$ (giữ lại 3$ trong ví an toàn)
    MARGIN_USDT = float(os.getenv("MARGIN_USDT", "5.0"))
    
    # Mục tiêu chốt lời ròng (0.5$ theo yêu cầu)
    PROFIT_TARGET_USDT = float(os.getenv("PROFIT_TARGET_USDT", "0.50"))
    
    # Ngưỡng cắt lỗ an toàn (bảo hiểm tài khoản, không bao giờ để cháy hết $8)
    STOP_LOSS_USDT = float(os.getenv("STOP_LOSS_USDT", "0.80"))
    
    # Thời gian nghỉ sau khi chốt lệnh (15 phút)
    COOLDOWN_MINUTES = int(os.getenv("COOLDOWN_MINUTES", "15"))
    
    # Điểm tin cậy tối thiểu của Gemini để kích hoạt lệnh (0 - 100)
    MIN_CONFIDENCE = int(os.getenv("MIN_CONFIDENCE", "70"))
