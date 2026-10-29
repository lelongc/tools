import os
import sys
import time
import json
import uuid
import random
import requests
import subprocess
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
import functools
print = functools.partial(print, flush=True)

env_paths = [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parents[1] / ".env",
    Path(__file__).resolve().parents[2] / "nonce-mint" / ".env"
]
for ep in env_paths:
    if ep.exists():
        load_dotenv(ep)
        break

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
AGENT_ID = "31945225528577037061839722470168799697582568106216021014290393903276758886237"
MCP_URL = "https://mcp.nonceprotocol.xyz/mcp"
AUTH_CHALLENGE_URL = "https://mcp.nonceprotocol.xyz/auth/challenge"
AUTH_VERIFY_URL = "https://mcp.nonceprotocol.xyz/auth/verify"
TOKEN_CACHE_FILE = Path(__file__).resolve().parent / "nonce_token.tmp"

SESSION = requests.Session()

def get_auth_token():
    if TOKEN_CACHE_FILE.exists():
        token = TOKEN_CACHE_FILE.read_text().strip()
        if len(token) > 20:
            return token
    print("Getting new token...")
    r = SESSION.post(AUTH_CHALLENGE_URL, json={"wallet": WALLET}, timeout=15)
    data = r.json()
    challenge = data.get("challenge")
    wallet_req = data.get("walletRequest")
    cmd_preview = ["npx", "-y", "@binance/agentic-wallet", "sign-message", "preview", "--binanceChainId", "56", "--signType", "EIP712", "--message", json.dumps(wallet_req), "--json"]
    p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
    req_id = json.loads(p_proc.stdout)["data"]["requestId"]
    cmd_exec = ["npx", "-y", "@binance/agentic-wallet", "sign-message", "execute", "--requestId", req_id, "--json"]
    e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
    e_json = json.loads(e_proc.stdout)
    sig_raw = e_json["data"]["signature"]
    rec_raw = e_json["data"].get("signatureRecovery", "00")
    sig_65 = "0x" + sig_raw + ("1c" if rec_raw == "01" else "1b")
    v_res = SESSION.post(AUTH_VERIFY_URL, json={"wallet": WALLET, "challenge": challenge, "signature": sig_65}, timeout=15)
    token = v_res.json().get("token")
    TOKEN_CACHE_FILE.write_text(token)
    return token

token = get_auth_token()
print("Token:", token[:15] + "...")

# Step 1: Prepare Attempt
idemp_key = f"diag_{uuid.uuid4().hex[:20]}"
print(f"Preparing attempt with {idemp_key}...")

attempt_id = None
wallet_req = None

for i in range(30):
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/json, text/event-stream", "Content-Type": "application/json"}
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "prepare_attempt", "arguments": {"wallet": WALLET, "beneficiary": WALLET, "agentId": AGENT_ID, "idempotencyKey": idemp_key}}}
    r = SESSION.post(MCP_URL, headers=headers, json=payload, timeout=20)
    print(f"[{i}] prepare status: {r.status_code}")
    if r.status_code == 200:
        res = r.json()
        txt = res.get("result", {}).get("content", [{}])[0].get("text", "")
        print("  200 text:", txt[:200])
        try:
            d = json.loads(txt)
            if "attemptId" in d:
                attempt_id = d["attemptId"]
                wallet_req = d["startWalletRequest"]
                break
        except Exception as e:
            print("  json error:", e)
    elif r.status_code == 429:
        ra = float(r.headers.get("retry-after", 5))
        time.sleep(ra + random.uniform(0.5, 1.5))
    else:
        print("  Body:", r.text[:100])
        time.sleep(3)

if not attempt_id:
    print("Could not get attempt. Exit.")
    sys.exit(1)

print(f"Got Attempt ID: {attempt_id}")

# Step 2: Sign startAuthorization
cmd_preview = ["npx", "-y", "@binance/agentic-wallet", "sign-message", "preview", "--binanceChainId", "56", "--signType", "EIP712", "--message", json.dumps(wallet_req), "--json"]
p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
req_id = json.loads(p_proc.stdout)["data"]["requestId"]
cmd_exec = ["npx", "-y", "@binance/agentic-wallet", "sign-message", "execute", "--requestId", req_id, "--json"]
e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
e_json = json.loads(e_proc.stdout)
sig_raw = e_json["data"]["signature"]
rec_raw = e_json["data"].get("signatureRecovery", "00")
sig_65 = "0x" + sig_raw + ("1c" if rec_raw == "01" else "1b")
print("Signed startAuthorization:", sig_65[:20] + "...")

# Step 3: start_attempt
start_data = None
for i in range(10):
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "start_attempt", "arguments": {"attemptId": attempt_id, "signature": sig_65}}}
    r = SESSION.post(MCP_URL, headers=headers, json=payload, timeout=20)
    print(f"[{i}] start status: {r.status_code}")
    if r.status_code == 200:
        txt = r.json().get("result", {}).get("content", [{}])[0].get("text", "")
        print("  start text:", txt[:200])
        try:
            start_data = json.loads(txt)
            break
        except Exception:
            pass
    time.sleep(3)

if not start_data:
    print("start_attempt failed.")
    sys.exit(1)

cap = start_data.get("capability")
frag_count = start_data.get("fragmentCount", 32)
print(f"Capability: {cap} | Fragments: {frag_count}")

# Step 4: Test inspect_fragment for fragment 0!
print("Testing inspect_fragment 0...")
for i in range(20):
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "inspect_fragment", "arguments": {"attemptId": attempt_id, "capability": cap, "fragmentId": 0}}}
    r = SESSION.post(MCP_URL, headers=headers, json=payload, timeout=20)
    print(f"[{i}] inspect_fragment status: {r.status_code}")
    if r.status_code == 200:
        txt = r.json().get("result", {}).get("content", [{}])[0].get("text", "")
        print("  SUCCESS 200! Text length:", len(txt), "Sample:", txt[:150])
        break
    elif r.status_code == 429:
        ra = float(r.headers.get("retry-after", 5))
        wait_t = ra + random.uniform(0.5, 1.5)
        print(f"  429 retry-after: {ra} -> sleeping {wait_t:.1f}s")
        time.sleep(wait_t)
    else:
        print("  Other code:", r.text[:100])
        time.sleep(3)
