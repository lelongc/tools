@echo off
chcp 65001 >nul 2>&1
title Stop MCP Servers
echo ===========================================================================
echo   ĐANG DỌN DẸP VÀ ĐÓNG TOÀN BỘ TIẾN TRÌNH MCP (GODOT + BLENDER + NGROK)...
echo ===========================================================================

taskkill /F /IM ngrok.exe /T >nul 2>&1
powershell -Command "Get-NetTCPConnection -LocalPort 8080,8081 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo ✅ ĐÃ TẮT VÀ GIẢI PHÓNG TOÀN BỘ TIẾN TRÌNH AN TOÀN 100%!
echo.
timeout /t 2 >nul
