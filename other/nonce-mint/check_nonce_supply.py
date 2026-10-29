import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Using bsc-dataseed via DoH or public RPC
nft_contract = "0x053259A3D30E63d9447E3d90813C6a494bcB398a"
freemint_contract = "0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e"

# We know IP of bsc-dataseed1.binance.org is 52.223.34.155
url = "https://52.223.34.155/"
headers = {"Host": "bsc-dataseed1.binance.org", "Content-Type": "application/json"}

def call(contract, data):
    payload = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{"to": contract, "data": data}, "latest"],
        "id": 1
    }
    r = requests.post(url, headers=headers, json=payload, verify=False, timeout=10)
    return r.json().get("result")

# 1. totalSupply() 0x18160ddd
supply_hex = call(nft_contract, "0x18160ddd")
if supply_hex and supply_hex != "0x":
    print("NFT Total Supply:", int(supply_hex, 16))
else:
    print("NFT Total Supply raw:", supply_hex)

# 2. MAX_SUPPLY() 0xd5abeb01
max_supply_hex = call(nft_contract, "0xd5abeb01")
if max_supply_hex and max_supply_hex != "0x":
    print("NFT Max Supply:", int(max_supply_hex, 16))

# 3. paused() 0x5c975abb on FreeMint
paused_hex = call(freemint_contract, "0x5c975abb")
if paused_hex:
    print("FreeMint paused():", int(paused_hex, 16) == 1)

# Check protocol_info from MCP again
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
token = os.getenv("NONCE_ACCESS_TOKEN", "").strip()
mcp_url = "https://mcp.nonceprotocol.xyz/mcp"
mcp_headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json, text/event-stream",
    "Content-Type": "application/json"
}
r_p = requests.post(mcp_url, headers=mcp_headers, json={"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"protocol_info","arguments":{}}}, timeout=10)
print("\nprotocol_info result:")
print(r_p.text)
