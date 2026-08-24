@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0MCP-SETUP"
call Stop_All_MCP.bat
