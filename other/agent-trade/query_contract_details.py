import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ip = "52.223.34.155"
contract = "0xD87ADb2E47979d6cb323896B1A9320E0dd132213"
user = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

def call(data):
    url = f"https://{ip}/"
    headers = {"Host": "bsc-dataseed1.binance.org", "Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{"to": contract, "data": data}, "latest"],
        "id": 1
    }
    r = requests.post(url, headers=headers, json=payload, verify=False, timeout=10)
    return r.json().get("result")

def decode_str(hex_val):
    if not hex_val or hex_val == "0x":
        return None
    raw = bytes.fromhex(hex_val[2:])
    # string layout: offset (32), length (32), chars
    if len(raw) >= 64:
        length = int.from_bytes(raw[32:64], "big")
        chars = raw[64:64+length]
        return chars.decode('utf-8', errors='ignore')
    return None

name_raw = call("0x06fdde03")
print("name:", decode_str(name_raw))

sym_raw = call("0x95d89b41")
print("symbol:", decode_str(sym_raw))

# balanceOf(user)
padded_user = user.lower().replace("0x", "").zfill(64)
bal_raw = call("0x70a08231" + padded_user)
if bal_raw:
    print("balanceOf user:", int(bal_raw, 16))
else:
    print("balanceOf user:", bal_raw)

# totalSupply 0x18160ddd
supply_raw = call("0x18160ddd")
if supply_raw:
    print("totalSupply:", int(supply_raw, 16))
