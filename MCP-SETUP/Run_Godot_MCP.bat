@echo off
chcp 65001 >nul 2>&1
title Godot MCP Server (Link Co Dinh)
cd /d "%~dp0"
python godot_mcp_bridge.py
pause
