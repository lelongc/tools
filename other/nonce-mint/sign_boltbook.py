import requests
import json
import subprocess
import sys

WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

print("1. Requesting challenge from Boltbook...")
r = requests.post("https://boltbook.fun/api/v1/agents/challenge", json={"wallet": WALLET}, timeout=10)
data = r.json()
nonce = data["nonce"]
typed_data = data["typed_data"]

wallet_msg = {
    "method": "eth_signTypedData_v4",
    "params": [WALLET, json.dumps(typed_data)]
}

print(f"Nonce: {nonce}")
print("2. Calling baw sign-message preview...")
cmd_preview = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
    "--binanceChainId", "56",
    "--signType", "EIP712",
    "--message", json.dumps(wallet_msg),
    "--json"
]

proc = subprocess.run(cmd_preview, capture_output=True, text=True, check=True, shell=True)
res_preview = json.loads(proc.stdout)
request_id = res_preview["data"]["requestId"]
print(f"Got requestId: {request_id}")

print("3. Calling baw sign-message execute...")
cmd_exec = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
    "--requestId", request_id,
    "--json"
]
proc_exec = subprocess.run(cmd_exec, capture_output=True, text=True, check=True, shell=True)
res_exec = json.loads(proc_exec.stdout)
order_id = res_exec["data"]["orderId"]
status = res_exec["data"].get("status")

sig = res_exec["data"].get("signature")
rec = res_exec["data"].get("signatureRecovery")

if not sig:
    print(f"Status is {status}, fetching result for orderId: {order_id}...")
    cmd_res = [
        "npx", "-y", "@binance/agentic-wallet", "sign-message", "result",
        "--order-id", order_id,
        "--json"
    ]
    proc_res = subprocess.run(cmd_res, capture_output=True, text=True, check=True, shell=True)
    res_data = json.loads(proc_res.stdout)
    sig = res_data["data"]["signature"]
    rec = res_data["data"]["signatureRecovery"]

print(f"Signature: {sig[:20]}... (recovery: {rec})")

print("4. Registering on Boltbook...")
reg_payload = {
    "wallet": WALLET,
    "nonce": nonce,
    "signature": sig,
    "signatureRecovery": rec,
    "description": "SmartFlow.ai — autonomous Web3 agent exploring alpha and free mints on BNB Chain"
}

reg_r = requests.post("https://boltbook.fun/api/v1/agents/register", json=reg_payload, timeout=10)
print("Register Status:", reg_r.status_code)
print("Register Response:", json.dumps(reg_r.json(), indent=2))

if reg_r.json().get("success"):
    api_key = reg_r.json()["agent"]["api_key"]
    name = reg_r.json()["agent"]["name"]
    print(f"\n🎉 SUCCESS! Logged in as: {name}")
    print(f"API KEY: {api_key}")
    with open("boltbook_creds.json", "w") as f:
        json.dump({"name": name, "api_key": api_key, "wallet": WALLET}, f, indent=2)
