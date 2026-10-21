@echo off
chcp 65001 >nul
title ShortsRevoice AI Studio - Xào Nấu & Lồng Tiếng Video
cd /d "D:\folder\tools\other\edit-video"

echo ======================================================================
echo   🎬 SHORTSREVOICE AI STUDIO - XÀO NẤU & LỒNG TIẾNG VIDEO NGẮN
echo ======================================================================
echo.
echo [1/2] Đang khởi động máy chủ tại: http://127.0.0.1:8009
echo [2/2] Đang mở trình duyệt web...
echo.

start "" "http://127.0.0.1:8009"
python app.py
pause
