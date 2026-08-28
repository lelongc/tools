@echo off
title Antigravity Remote Internet Tunnel (Truy Cap Ngoai Quan Cafe / 4G)
echo =================================================================
echo        ANTIGRAVITY REMOTE INTERNET TUNNEL (TRUY CAP TU XA)
echo =================================================================
echo.
echo Cong cu nay cho phep ban truy cap toan bo IDE tu QUAN CAFE,
echo tren dien thoai 4G/5G hoac bat ky mang Wi-Fi nao khac tren the gioi!
echo.
echo [!] Huong dan lan dau chay:
echo     1. Cua so se hien 1 duong link va ma code xac thuc GitHub/Microsoft.
echo     2. Ban mo link tren trinh duyet va nhap ma xac nhan (chi can lam 1 lan).
echo     3. Sau do he thong se cap link: https://vscode.dev/tunnel/...
echo     4. Ban luu link do vao dien thoai de truy cap moi luc moi noi.
echo =================================================================
echo.
echo Dang khoi dong Tunnel ket noi Internet...
echo (Nhan Ctrl+C de dung tunnel khi khong dung nua)
echo.

"C:\Users\Acer\AppData\Local\Programs\Microsoft VS Code\bin\code-tunnel.exe" tunnel --accept-server-license-terms
pause
