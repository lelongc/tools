import requests
import json

rpc = "https://binance.llamarpc.com"
contract = "0xD87ADb2E47979d6cb323896B1A9320E0dd132213"
user_addr = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

def rpc_call(method, params):
    r = requests.post(rpc, json={"jsonrpc":"2.0","method":method,"params":params,"id":1}, timeout=10)
    return r.json().get("result")

code = rpc_call("eth_getCode", [contract, "latest"])
print(f"Contract bytecode length: {len(code) if code else 0}")

# Check name() 0x06fdde03
name_res = rpc_call("eth_call", [{"to": contract, "data": "0x06fdde03"}, "latest"])
print(f"name() raw: {name_res}")

# Check symbol() 0x95d89b41
sym_res = rpc_call("eth_call", [{"to": contract, "data": "0x95d89b41"}, "latest"])
print(f"symbol() raw: {sym_res}")

# Check balanceOf(user_addr) 0x70a08231 + user_addr (padded to 32 bytes)
user_padded = user_addr.lower().replace("0x", "").zfill(64)
bal_res = rpc_call("eth_call", [{"to": contract, "data": "0x70a08231" + user_padded}, "latest"])
print(f"balanceOf(user) raw: {bal_res}")
if bal_res:
    try:
        bal = int(bal_res, 16)
        print(f"User NFT balance: {bal}")
    except:
        pass
