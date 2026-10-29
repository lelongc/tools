import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

mcp_url = "https://mcp.nonceprotocol.xyz/mcp"
headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json"
}

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": "protocol_info",
        "arguments": {}
    }
}

r = requests.post(mcp_url, headers=headers, json=payload, timeout=10)
print("protocol_info status:", r.status_code)
res = r.json().get("result", {})
print("Result:", json.dumps(res, indent=2))
