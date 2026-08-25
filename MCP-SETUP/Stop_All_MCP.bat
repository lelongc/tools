@echo off
chcp 65001 >nul
echo [DANG TAT TOAN BO TIEN TRINH MCP VA NGROK...]

taskkill /f /im ngrok.exe >nul 2>&1

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8787') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [DA TAT SACH TAT CA TIEN TRINH TRONG HE THONG!]
