import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BSC_RPC = "https://bsc-dataseed.binance.org/"

# Let's inspect Nemotron trade site
try:
    r_nemo = requests.get("https://nemotron.trade/", timeout=5)
    print("Nemotron site status:", r_nemo.status_code)
    # Check if there is a market or trade tab
    if "market" in r_nemo.text.lower():
        print("Nemotron has market keyword in HTML!")
except Exception as e:
    print("Nemotron error:", e)

# Check Element Market API for BSC collections
# Element API: https://api.element.market/openapi/v1/contract?chain=bsc&contract_address=...
for name, addr in [
    ("Pixel Shiba", "0xFdD6C5fF6dAbFF40cb27B39D72E5C9517Af27Fdc"),
    ("Nemotron", "0xDd8BdfC91cbD572935B09863A742d8296fed0ACf"),
    ("Repsol", "0x0cdbc22056631a399d1c8caa3f5a70e65935e26f")
]:
    url = f"https://api.element.market/openapi/v1/contract?chain=bsc&contract_address={addr}"
    try:
        r = requests.get(url, timeout=5).json()
        data = r.get("data", {})
        floor = data.get("floorPrice")
        vol = data.get("volume24h")
        listed = data.get("onSaleCount")
        print(f"[{name}] Floor: {floor} | Listed: {listed} | 24h Vol: {vol}")
    except Exception as e:
        print(f"[{name}] Element API error:", e)
