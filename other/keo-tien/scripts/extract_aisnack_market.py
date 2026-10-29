import requests
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

r = requests.get("https://snack.is-a.si/", timeout=10)
html = r.text

idx = html.find("var MARKET_ABI")
if idx != -1:
    print("=== MARKET ABI ===")
    print(html[idx:idx+800])

idx_msg = html.find("trade.msg")
if idx_msg != -1:
    print("=== TRADE PROMPT FOR AI ===")
    print(html[idx_msg-100:idx_msg+1200])
