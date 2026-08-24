@echo off
chcp 65001 >nul 2>&1
title Master MCP Server (Godot + Blender)
cd /d "%~dp0"
python godot_mcp_bridge.py
pause
