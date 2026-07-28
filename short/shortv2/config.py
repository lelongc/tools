"""
Config — Đọc API keys từ file .env
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env files
local_env = Path(__file__).resolve().parent / ".env"
parent_env = Path(__file__).resolve().parent.parent / ".env"

if local_env.exists():
    load_dotenv(dotenv_path=local_env)
if parent_env.exists():
    load_dotenv(dotenv_path=parent_env, override=False)

# Gemini API key (bắt buộc — dùng cho cả script gen, TTS, và subtitle)
GEMINI_API_KEY = os.getenv("gemini_api", "").strip()

if not GEMINI_API_KEY and local_env.exists():
    try:
        content = local_env.read_text(encoding="utf-8").strip()
        for line in content.splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                if "=" in line:
                    k, v = line.split("=", 1)
                    if k.strip().lower() in ("gemini_api", "gemini_api_key", "api_key"):
                        GEMINI_API_KEY = v.strip()
                else:
                    GEMINI_API_KEY = line
                if GEMINI_API_KEY:
                    break
    except Exception:
        pass

if not GEMINI_API_KEY:
    print("[!] Thiếu gemini_api trong .env — cần cho tất cả chức năng")

