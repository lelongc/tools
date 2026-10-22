@echo off
setlocal
cd /d "D:\folder\tools\other\edit-video"

echo ======================================================================
echo   SHORTSREVOICE AI STUDIO - XAO NAU VA LONG TIENG VIDEO NGAN
echo ======================================================================
echo.
echo [1/2] Dang khoi dong may chu tai: http://127.0.0.1:8009 ...
echo [2/2] Dang mo trinh duyet web ...
echo.

start "" "http://127.0.0.1:8009"
python "D:\folder\tools\other\edit-video\app.py"

if %ERRORLEVEL% neq 0 (
    echo.
    echo [LOI] Khong the khoi dong may chu Python!
)
pause
