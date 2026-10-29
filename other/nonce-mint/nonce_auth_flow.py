import subprocess
import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wallet = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
print(f"Bắt đầu quy trình xác thực Nonce Protocol cho ví: {wallet}...")

# 1. Lấy challenge từ Nonce
res = requests.post("https://mcp.nonceprotocol.xyz/auth/challenge", json={"wallet": wallet}, timeout=10)
if res.status_code != 200:
    print(f"Lỗi lấy challenge: {res.status_code} - {res.text}")
    sys.exit(1)

data = res.json()
challenge = data.get("challenge")
wallet_req = data.get("walletRequest")

print("Đã nhận challenge từ Nonce Protocol!")
print("Domain:", data.get("typedData", {}).get("domain"))
print("Message Statement:", data.get("typedData", {}).get("message", {}).get("statement"))

# Chuẩn bị message cho baw sign-message
# Tham số --message của baw sign-message: truyền chuỗi JSON của walletRequest
wallet_req_str = json.dumps(wallet_req)

cmd_preview = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "preview",
    "--binanceChainId", "56",
    "--signType", "EIP712",
    "--message", wallet_req_str,
    "--json"
]

print("\nĐang gọi baw sign-message preview...")
p_proc = subprocess.run(cmd_preview, capture_output=True, text=True, shell=True)
print("Preview exit code:", p_proc.returncode)
try:
    preview_json = json.loads(p_proc.stdout)
    print("Preview Output:", json.dumps(preview_json, indent=2))
except Exception:
    print("Preview Raw Output:", p_proc.stdout)
    print("Preview Raw Error:", p_proc.stderr)
    sys.exit(1)

if not preview_json.get("success"):
    print("Preview thất bại!")
    sys.exit(1)

request_id = preview_json.get("data", {}).get("requestId")
print(f"\n=> Đã lấy được requestId: {request_id}")

# Thực thi ký
cmd_exec = [
    "npx", "-y", "@binance/agentic-wallet", "sign-message", "execute",
    "--requestId", request_id,
    "--json"
]

print("Đang gọi baw sign-message execute...")
e_proc = subprocess.run(cmd_exec, capture_output=True, text=True, shell=True)
print("Execute exit code:", e_proc.returncode)
try:
    exec_json = json.loads(e_proc.stdout)
    print("Execute Output:", json.dumps(exec_json, indent=2))
except Exception:
    print("Execute Raw Output:", e_proc.stdout)
    print("Execute Raw Error:", e_proc.stderr)
    sys.exit(1)

if not exec_json.get("success"):
    print("Execute thất bại!")
    sys.exit(1)

sig_data = exec_json.get("data", {})
signature = sig_data.get("signature")
print(f"\n=> Ký thành công! Signature: {signature[:20]}...")

# 2. Gửi verify về Nonce
verify_payload = {
    "wallet": wallet,
    "challenge": challenge,
    "signature": signature
}
v_res = requests.post("https://mcp.nonceprotocol.xyz/auth/verify", json=verify_payload, timeout=10)
print("\nVerify status code:", v_res.status_code)
try:
    print("Verify Response:", json.dumps(v_res.json(), indent=2))
except:
    print("Verify Raw Response:", v_res.text)
