#!/bin/bash
# Quick start script to launch the bridge server

echo "🚀 TurboFlow Local Bridge - Quick Start"
echo "======================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+"
    exit 1
fi

echo "✅ Python found"
python3 --version

# Check if in correct directory
if [ ! -f "bridge_local.py" ]; then
    echo "❌ bridge_local.py not found in current directory"
    echo "   Please run this from: /path/to/tools/short/"
    exit 1
fi

echo "✅ bridge_local.py found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -q -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Some dependencies failed, but continuing..."
fi

echo ""
echo "🌐 Starting Bridge Server..."
echo "======================================"
echo ""
echo "Bridge will listen on: http://127.0.0.1:8787"
echo "Watching Downloads folder: $HOME/Downloads"
echo ""
echo "ℹ️  For Colab (different machine):"
echo "    Find your local IP: ipconfig (Windows) or ifconfig (Mac/Linux)"
echo "    Use that IP in Colab notebook instead of 127.0.0.1"
echo ""
echo "To stop: Press Ctrl+C"
echo "======================================"
echo ""

python3 bridge_local.py

