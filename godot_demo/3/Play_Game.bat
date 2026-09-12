@echo off
title CLUCK ^& SPLAT 3D: MANNEQUIN COLOR BRAWL (GODOT 4.7)
echo =========================================================================
echo   🐔 CLUCK ^& SPLAT 3D: MANNEQUIN COLOR BRAWL 🎨
echo   (ĐAI CHIEN NHUOM MAU HINH NHAN 3D - PARTY CO-OP ^& TAT BAY BAN BE)
echo   ---------------------------------------------------------------------
echo   🎮 HUONG DAN DIEU KHIEN 2 NGUOI CHOI (LOCAL CO-OP / VERSUS):
echo.
echo   🔴 NGUOI CHOI 1 (DOI DO):
echo   - Di chuyen: [W], [A], [S], [D]
echo   - Ban dan son: [SPACE] (Phim cach)
echo   - TAT LON CO BAN BE / TAT HINH NHAN: [F]
echo   - Vac hinh nhan len dau / Nem vao cong: [E]
echo.
echo   🔵 NGUOI CHOI 2 (DOI XANH) (Hoac Bot AI neu choi 1 minh):
echo   - Di chuyen: [CAC PHIM MUI TEN]
echo   - Ban dan son: [ENTER]
echo   - TAT LON CO BAN BE / TAT HINH NHAN: [RIGHT CTRL]
echo   - Vac hinh nhan len dau / Nem vao cong: [L]
echo.
echo   🏆 CHE DO CHOI CO-OP ^& PARTY:
echo   - [1] HOP TAC GIAO HANG (Overcooked style): Nhuom mau dung don hang va nem vao cong!
echo   - [2] DAI CHIEN TRANH HINH NHAN (Versus Brawl): Tat ban be gianh giat hinh nhan!
echo   - BUC NHUN LO XO: Nhay len buc vang de bat tung len troi!
echo.
echo   🎨 THAY THE 3D MODEL BLENDER (.glb) ^& AM THANH:
echo   - Tha model vao: res://assets/models/
echo   - Tha am thanh vao: res://assets/audio/
echo =========================================================================
start "" "D:\app\godot\Godot_v4.7.1-stable_win64.exe" --path "d:\folder\tools\godot_demo\3" --rendering-driver opengl3
