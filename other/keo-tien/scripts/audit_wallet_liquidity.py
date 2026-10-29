import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BSC_RPC = "https://bsc-dataseed.binance.org/"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

# PancakeSwap V2 Factory
PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

def get_pair(token_a, token_b):
    # getPair(address,address) selector: 0xe6a43905
    p_a = token_a.lower().replace("0x", "").zfill(64)
    p_b = token_b.lower().replace("0x", "").zfill(64)
    data = "0xe6a43905" + p_a + p_b
    p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": PANCAKE_FACTORY, "data": data}, "latest"]}
    r = requests.post(BSC_RPC, json=p, timeout=5).json()
    res = r.get("result", "")
    pair = "0x" + res[-40:] if res and len(res) >= 40 and int(res, 16) != 0 else None
    return pair

# 1. AISNACK
AISNACK = "0x4903Ce0f68f763B8EdBB80A6E9E836373d3190C8"
pair_aisnack = get_pair(AISNACK, WBNB)
print(f"1. AISNACK/WBNB PancakeSwap Pair: {pair_aisnack}")
if pair_aisnack:
    # Check BNB balance in pair
    p_bal = {"jsonrpc": "2.0", "id": 2, "method": "eth_getBalance", "params": [pair_aisnack, "latest"]}
    r_bal = requests.post(BSC_RPC, json=p_bal, timeout=5).json()
    bnb_liq = int(r_bal.get("result", "0x0"), 16) / 10**18
    print(f"   Liquidity in pair: {bnb_liq:.4f} BNB")

# 2. Check AISNACK P2P Market Contract 0xD18d117B11e1c3c84f46d1e9ecdC6FD4c8c847A2
AISNACK_MARKET = "0xD18d117B11e1c3c84f46d1e9ecdC6FD4c8c847A2"
try:
    r_snack = requests.get("https://snack.is-a.si/api/orders", timeout=5)
    print("   AISNACK P2P API status:", r_snack.status_code)
    if r_snack.status_code == 200:
        print("   AISNACK Orders:", r_snack.json())
except Exception as e:
    print("   AISNACK web error:", e)

# 3. BOLT
BOLT = "0xBbDd8C7720d1EEB1d63738eaABB584a4b72C7777"
pair_bolt = get_pair(BOLT, WBNB)
print(f"2. BOLT/WBNB PancakeSwap Pair: {pair_bolt}")
if pair_bolt:
    p_bal = {"jsonrpc": "2.0", "id": 3, "method": "eth_getBalance", "params": [pair_bolt, "latest"]}
    r_bal = requests.post(BSC_RPC, json=p_bal, timeout=5).json()
    bnb_liq = int(r_bal.get("result", "0x0"), 16) / 10**18
    print(f"   Liquidity in pair: {bnb_liq:.4f} BNB")

# 4. Check Pancake Router quote for selling BOLT
PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
# getAmountsOut(uint amountIn, address[] path) selector: 0xd06ca61f
# Let's test quote for 3487 BOLT
