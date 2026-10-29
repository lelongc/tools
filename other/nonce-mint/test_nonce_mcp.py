import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

mcp_url = "https://mcp.nonceprotocol.xyz/mcp"
headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream"
}

# Test 1: MCP initialize
init_payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {
            "name": "antigravity-agent",
            "version": "1.0.0"
        }
    }
}

try:
    r = requests.post(mcp_url, headers=headers, json=init_payload, timeout=10)
    print("Initialize status:", r.status_code)
    print("Initialize response:", r.text[:500])
except Exception as e:
    print("Initialize error:", e)

# Test 2: Try calling protocol_info or tools/list
tools_payload = {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list",
    "params": {}
}

try:
    r = requests.post(mcp_url, headers=headers, json=tools_payload, timeout=10)
    print("\ntools/list status:", r.status_code)
    print("tools/list response:", r.text[:800])
except Exception as e:
    print("tools/list error:", e)
