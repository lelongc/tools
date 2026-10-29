import requests
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BSC_RPC = "https://bsc-dataseed.binance.org/"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"
NFT_CONTRACT = "0x1EA0373CC4CE3775ca0C0e189Cf49D676894Da4f"
AGENT_ID_CONTRACT = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F"

def rpc_call(to, data):
    p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": to, "data": data}, "latest"]}
    r = requests.post(BSC_RPC, json=p, timeout=8).json()
    return r.get("result", "")

addr_param = WALLET.lower().replace("0x", "").zfill(64)

# 1. Check Agent ID balance
res_agent = rpc_call(AGENT_ID_CONTRACT, "0x70a08231" + addr_param)
bal_agent = int(res_agent, 16) if res_agent and res_agent != "0x" else 0
print(f"1. SPACE ID Agent ID Balance: {bal_agent}")

# 2. mintOpen() 0x24bbd049
res_open = rpc_call(NFT_CONTRACT, "0x24bbd049")
is_open = int(res_open, 16) == 1 if res_open and res_open != "0x" else False
print(f"2. mintOpen(): {is_open}")

# 3. isEligible(WALLET) 0x66e305fd
res_elig = rpc_call(NFT_CONTRACT, "0x66e305fd" + addr_param)
is_elig = int(res_elig, 16) == 1 if res_elig and res_elig != "0x" else False
print(f"3. isEligible(WALLET): {is_elig}")

# 4. freeRemaining(WALLET) 0x3178e67d
res_free = rpc_call(NFT_CONTRACT, "0x3178e67d" + addr_param)
free_rem = int(res_free, 16) if res_free and res_free != "0x" else 0
print(f"4. freeRemaining(WALLET): {free_rem}")

# 5. mintedBy(WALLET) 0x3cef28d2
res_minted = rpc_call(NFT_CONTRACT, "0x3cef28d2" + addr_param)
minted_count = int(res_minted, 16) if res_minted and res_minted != "0x" else 0
print(f"5. mintedBy(WALLET): {minted_count}")

# 6. totalSupply() 0x18160ddd
res_ts = rpc_call(NFT_CONTRACT, "0x18160ddd")
total_supply = int(res_ts, 16) if res_ts and res_ts != "0x" else 0
print(f"6. Total Supply Minted: {total_supply} / 4444 (Còn lại: {4444 - total_supply})")

# 7. quote(WALLET, 2) 0x8f79306e
# quote(address,uint256) -> param 1: address, param 2: uint256(2)
qty_param = hex(2)[2:].zfill(64)
res_quote = rpc_call(NFT_CONTRACT, "0x8f79306e" + addr_param + qty_param)
quote_ptah = int(res_quote, 16) if res_quote and res_quote != "0x" else -1
print(f"7. quote(WALLET, qty=2): {quote_ptah} wei PTAH (0 = Hoàn toàn Free!)")

# 8. Simulate mint(2) call via eth_estimateGas
# mint(uint256) -> selector 0xa0712d68 + uint256(2)
mint_calldata = "0xa0712d68" + hex(2)[2:].zfill(64)
p_sim = {
    "jsonrpc": "2.0",
    "id": 2,
    "method": "eth_estimateGas",
    "params": [{
        "from": WALLET,
        "to": NFT_CONTRACT,
        "value": "0x0",
        "data": mint_calldata
    }]
}
r_sim = requests.post(BSC_RPC, json=p_sim, timeout=8).json()
print("8. Simulate mint(2) Gas Estimate:", r_sim)
