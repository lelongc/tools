import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

token = os.getenv("NONCE_ACCESS_TOKEN", "").strip()
wallet = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

mcp_url = "https://mcp.nonceprotocol.xyz/mcp"
headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json, text/event-stream",
    "Content-Type": "application/json"
}

def call_tool(name, args):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": name,
            "arguments": args
        }
    }
    r = requests.post(mcp_url, headers=headers, json=payload, timeout=10)
    print(f"Tool {name} status: {r.status_code}")
    try:
        data = r.json()
        print(f"Tool {name} response:", json.dumps(data, indent=2))
        return data
    except Exception:
        print(f"Tool {name} text:", r.text)
        return None

print("--- 1. Checking wallet_status ---")
call_tool("wallet_status", {"wallet": wallet})

print("\n--- 2. Checking agent_identity ---")
ident = call_tool("agent_identity", {"wallet": wallet})

