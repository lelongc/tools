@echo off
title Studio Xao Nau Tin Tuc - Google Flow AI
color 0E
chcp 65001 >nul

echo ========================================================
echo   STUDIO XAO NAU TIN TUC - PROMPT GOOGLE FLOW AI
echo ========================================================
echo.
echo [1/2] Dang khoi dong may chu tai http://127.0.0.1:8000/news ...
echo.

start "" http://127.0.0.1:8000/news

python app.py

pause
