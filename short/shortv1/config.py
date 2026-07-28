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

# Gemini API key
GEMINI_API_KEY = os.getenv("gemini_api", "")

# Pexels API key
PEXELS_API_KEY = os.getenv("pexel_api") or os.getenv("short_video", "")

# Groq API key — đọc từ .env hoặc hardcode từ tools/.env dòng 1
GROQ_API_KEY = os.getenv("groq_api", "")
if not GROQ_API_KEY:
    # Fallback: đọc dòng đầu tiên của tools/.env (key không có tên biến)
    try:
        with open(parent_env, "r") as f:
            first_line = f.readline().strip()
            if first_line.startswith("gsk_"):
                GROQ_API_KEY = first_line
    except Exception:
        pass

if not PEXELS_API_KEY:
    print("[!] Thieu pexel_api / short_video (Pexels API key) trong .env")
if not GROQ_API_KEY:
    print("[!] Thieu Groq API key trong .env")
