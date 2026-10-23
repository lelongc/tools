@echo off
chcp 65001 >nul
title Binance Gemini AI Scalping Bot
cd /d "%~dp0"

echo =======================================================
echo          BINANCE GEMINI AI AUTO TRADING BOT
echo =======================================================
echo.

if not exist .env (
    echo [THÔNG BÁO] Chưa tìm thấy file .env!
    echo Đang tạo file .env từ mẫu .env.example...
    copy .env.example .env
    echo [XONG] Hãy mở file .env và điền BINANCE_API_KEY, BINANCE_API_SECRET và GEMINI_API_KEY nhé!
    notepad .env
    pause
    exit /b
)

echo Đang khởi động bot...
python main.py

pause
