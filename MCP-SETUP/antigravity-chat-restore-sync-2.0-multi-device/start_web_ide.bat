@echo off
title Antigravity Remote Web IDE Server
echo =================================================================
echo        ANTIGRAVITY REMOTE WEB IDE SERVER (DIEN THOAI / LAPTOP)
echo =================================================================
echo.
echo [1] Dam bao Dien thoai/Thiet bi khac ket noi cung mang Wi-Fi voi may tinh.
echo.
echo [2] Mo trinh duyet (Chrome/Safari) tren Dien thoai va truy cap:
echo.
echo       http://10.10.37.134:8080
echo.
echo    (Hoac truy cap: http://localhost:8080 neu dung tren may nay)
echo =================================================================
echo.
echo Dang khoi dong Web Server tren cong 8080...
echo (Nhan Ctrl+C de dung server khi khong dung nua)
echo.

"C:\Users\Acer\AppData\Local\Programs\Microsoft VS Code\bin\code-tunnel.exe" serve-web --host 0.0.0.0 --port 8080 --without-connection-token --accept-server-license-terms --default-folder "D:\folder\tools"
pause
