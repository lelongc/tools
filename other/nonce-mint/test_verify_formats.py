import subprocess
import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wallet = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

# 1. Lấy challenge mới
res = requests.post("https://mcp.nonceprotocol.xyz/auth/challenge", json={"wallet": wallet}, timeout=10)
data = res.json()
challenge = data.get("challenge")
wallet_req = data.get("walletRequest")

cmd_preview = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
    "--binanceChainId", "56",
    "--signType", "EIP712",
    "--message", json.dumps(wallet_req),
    "--json"
]

p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
p_json = json.loads(p_proc.stdout)
req_id = p_json.get("data", {}).get("requestId")

cmd_exec = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
    "--requestId", req_id,
    "--json"
]
e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
e_json = json.loads(e_proc.stdout)
sig_raw = e_json.get("data", {}).get("signature")
rec_raw = e_json.get("data", {}).get("signatureRecovery", "00") # "01" or "00"

print(f"sig_raw len: {len(sig_raw)}")
print(f"recovery: {rec_raw}")

# Test multiple candidate formats:
# Format 1: 0x-prefixed 65-byte (r + s + v)
# recovery "01" -> v = 28 (0x1c), recovery "00" -> v = 27 (0x1b)
v_hex = "1c" if rec_raw == "01" else "1b"
sig_65 = "0x" + sig_raw + v_hex

candidates = [
    {"desc": "sig_65 (0x + r + s + v)", "payload": {"wallet": wallet, "challenge": challenge, "signature": sig_65}},
    {"desc": "0x + r + s with signatureRecovery", "payload": {"wallet": wallet, "challenge": challenge, "signature": "0x" + sig_raw, "signatureRecovery": rec_raw}},
    {"desc": "raw r + s with signatureRecovery", "payload": {"wallet": wallet, "challenge": challenge, "signature": sig_raw, "signatureRecovery": rec_raw}},
    {"desc": "0x + r + s + 01", "payload": {"wallet": wallet, "challenge": challenge, "signature": "0x" + sig_raw + rec_raw}},
    {"desc": "sig_65 with v=1b", "payload": {"wallet": wallet, "challenge": challenge, "signature": "0x" + sig_raw + "1b"}}
]

for c in candidates:
    print(f"\n--- Testing {c['desc']} ---")
    r = requests.post("https://mcp.nonceprotocol.xyz/auth/verify", json=c["payload"], timeout=10)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")
    if r.status_code == 200:
        print("🎉 SUCCESS with candidate:", c["desc"])
        break
