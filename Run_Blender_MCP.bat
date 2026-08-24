@echo off
chcp 65001 >nul 2>&1
title MCP Server (Godot + Blender)
cd /d "%~dp0MCP-SETUP"
python godot_mcp_bridge.py
pause
