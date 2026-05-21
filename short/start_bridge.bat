@echo off
REM Quick start script to launch the bridge server (Windows)

echo 🚀 TurboFlow Local Bridge - Quick Start
echo ======================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if in correct directory
if not exist "bridge_local.py" (
    echo ❌ bridge_local.py not found in current directory
    echo    Please run this from: \path\to\tools\short\
    exit /b 1
)

echo ✅ bridge_local.py found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
pip install -q -r requirements.txt
if %errorlevel% equ 0 (
    echo ✅ Dependencies installed
) else (
    echo ⚠️  Some dependencies failed, but continuing...
)

echo.
echo 🌐 Starting Bridge Server...
echo ======================================
echo.
echo Bridge will listen on: http://127.0.0.1:8787
echo Watching Downloads folder: %USERPROFILE%\Downloads
echo.
echo ℹ️  For Colab (different machine):
echo    Find your local IP: ipconfig ^| findstr /R "IPv4"
echo    Use that IP in Colab notebook instead of 127.0.0.1
echo.
echo To stop: Press Ctrl+C
echo ======================================
echo.

python bridge_local.py

pause
