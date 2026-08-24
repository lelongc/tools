@echo off
chcp 65001 >nul 2>&1
title Blender MCP Server
cd /d "%~dp0"
python blender_mcp_bridge.py
pause
