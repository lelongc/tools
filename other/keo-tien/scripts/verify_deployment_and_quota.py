import requests
import json
import sys
from Crypto.Hash import keccak

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def get_sel(sig):
    k = keccak.new(digest_bits=256)
    k.update(sig.encode('utf-8'))
    return "0x" + k.hexdigest()[:8]

def eth_call(rpc, to, data):
    p = {"jsonrpc": "2.0", "id": 1, "method": "eth_call", "params": [{"to": to, "data": data}, "latest"]}
    r = requests.post(rpc, json=p, timeout=10).json()
    return r.get("result", "")

def get_code(rpc, addr):
    p = {"jsonrpc": "2.0", "id": 1, "method": "eth_getCode", "params": [addr, "latest"]}
    r = requests.post(rpc, json=p, timeout=10).json()
    return r.get("result", "")

BSC_RPC = "https://bsc-dataseed1.defibit.io"
WALLET = "0x988fECF5030C36351272aBB39293fb8A9043ED8b"

print("--- 1. Fetching /api/mint-prompt ---")
r_prompt = requests.get("https://nonceprotocol.xyz/api/mint-prompt", timeout=10).json()
contracts = r_prompt["context"]["contracts"]
print("Prompt contracts:", json.dumps(contracts, indent=2))

PROMPT_FREEMINT = "0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e"
PROMPT_NFT = "0x053259A3D30E63d9447E3d90813C6a494bcB398a"
PROMPT_AGENTGATE = "0xc8D8EebAd7Fdd590edA6d23164B1eC014913Ce8f"
PROMPT_REGISTRY = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F"

assert contracts["freeMint"].lower() == PROMPT_FREEMINT.lower(), "FreeMint address mismatch!"
assert contracts["nft"].lower() == PROMPT_NFT.lower(), "NFT address mismatch!"
assert contracts["agentGate"].lower() == PROMPT_AGENTGATE.lower(), "AgentGate address mismatch!"
assert contracts["agentRegistry"].lower() == PROMPT_REGISTRY.lower(), "AgentRegistry address mismatch!"
print("✅ Addresses match prompt snapshot!")

def call_mcp_with_retry(headers, payload, max_tries=10):
    for i in range(max_tries):
        r = requests.post("https://mcp.nonceprotocol.xyz/mcp", headers=headers, json=payload, timeout=10)
        if r.status_code == 200:
            res = r.json()
            if "result" in res:
                return res
        import time; time.sleep(5)
    raise RuntimeError("Failed to call MCP tool after retries")

print("\n--- 2. Checking protocol_info ---")
headers = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
r_pinfo = call_mcp_with_retry(headers, {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"protocol_info","arguments":{}}})
pinfo = json.loads(r_pinfo["result"]["content"][0]["text"])
print("protocol_info:", json.dumps(pinfo, indent=2))

assert pinfo["admission"] == "open", f"Admission is {pinfo['admission']}, not open!"
assert str(pinfo["mintPrice"]) == "0", "mintPrice is not 0!"
assert str(pinfo["failureFee"]) == "0", "failureFee is not 0!"
assert pinfo["maxMintsPerWallet"] == 2, "maxMintsPerWallet is not 2!"
assert pinfo["supplyCap"] == 7777, "supplyCap is not 7777!"
protocol_signer = pinfo.get("signer", "").lower()
print("✅ protocol_info requirements satisfied! Signer:", protocol_signer)

print("\n--- 3. Verifying Onchain Contracts Code & Links ---")
for name, addr in [("FreeMint", PROMPT_FREEMINT), ("NFT", PROMPT_NFT), ("AgentGate", PROMPT_AGENTGATE), ("Registry", PROMPT_REGISTRY)]:
    code = get_code(BSC_RPC, addr)
    assert len(code) > 10, f"{name} ({addr}) has empty code!"
    print(f"  {name} code length: {len(code)} bytes")

# FreeMint.nft() selector: nft() -> 0x47ccca02
freemint_nft = "0x" + eth_call(BSC_RPC, PROMPT_FREEMINT, get_sel("nft()"))[-40:]
print("FreeMint.nft():", freemint_nft)
assert freemint_nft.lower() == PROMPT_NFT.lower(), "FreeMint.nft() != NFT"

# NFT.minter() selector: minter() -> 0x07546172
nft_minter = "0x" + eth_call(BSC_RPC, PROMPT_NFT, get_sel("minter()"))[-40:]
print("NFT.minter():", nft_minter)
assert nft_minter.lower() == PROMPT_FREEMINT.lower(), "NFT.minter() != FreeMint"

# FreeMint.agentGate() selector: agentGate() -> 0x1ad3c14a
freemint_gate = "0x" + eth_call(BSC_RPC, PROMPT_FREEMINT, get_sel("agentGate()"))[-40:]
print("FreeMint.agentGate():", freemint_gate)
assert freemint_gate.lower() == PROMPT_AGENTGATE.lower(), "FreeMint.agentGate() != AgentGate"

# FreeMint.signer() selector: signer() -> 0x23abab29
freemint_signer = "0x" + eth_call(BSC_RPC, PROMPT_FREEMINT, get_sel("signer()"))[-40:]
print("FreeMint.signer():", freemint_signer)
if protocol_signer:
    assert freemint_signer.lower() == protocol_signer, "FreeMint.signer() != protocol_info.signer"

# FreeMint.paused()
freemint_paused = int(eth_call(BSC_RPC, PROMPT_FREEMINT, get_sel("paused()")), 16) == 1
print("FreeMint.paused():", freemint_paused)
assert not freemint_paused, "FreeMint is paused!"

# NFT.MAX_PER_WALLET()
nft_max_per_wallet = int(eth_call(BSC_RPC, PROMPT_NFT, get_sel("MAX_PER_WALLET()")), 16)
print("NFT.MAX_PER_WALLET():", nft_max_per_wallet)
assert nft_max_per_wallet == 2, "NFT.MAX_PER_WALLET() != 2"

# NFT.MAX_SUPPLY()
nft_max_supply = int(eth_call(BSC_RPC, PROMPT_NFT, get_sel("MAX_SUPPLY()")), 16)
print("NFT.MAX_SUPPLY():", nft_max_supply)
assert nft_max_supply == 7777, "NFT.MAX_SUPPLY() != 7777"

# AgentGate.registry()
gate_registry = "0x" + eth_call(BSC_RPC, PROMPT_AGENTGATE, get_sel("registry()"))[-40:]
print("AgentGate.registry():", gate_registry)
assert gate_registry.lower() == PROMPT_REGISTRY.lower(), "AgentGate.registry() != Registry"

# AgentGate.identityPolicy()
gate_policy = eth_call(BSC_RPC, PROMPT_AGENTGATE, get_sel("identityPolicy()"))
k_policy = keccak.new(digest_bits=256)
k_policy.update("NONCE_BINANCE_AI_HANDLE_V1".encode("utf-8"))
expected_policy = "0x" + k_policy.hexdigest()
print("AgentGate.identityPolicy():", gate_policy)
print("Expected policy:          ", expected_policy)
assert gate_policy.lower() == expected_policy.lower(), "AgentGate.identityPolicy() mismatch!"
print("✅ All contract links, variables, and policy verified onchain!")

print("\n--- 4. Checking Agent Identity for Wallet ---")
# Call agent_identity tool
token_file = sys.path[0] + "/nonce_token.tmp"
with open(token_file) as f:
    token = f.read().strip()
headers_auth = {"Authorization": f"Bearer {token}", "Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
r_ident = call_mcp_with_retry(headers_auth, {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"agent_identity","arguments":{"wallet":WALLET}}})
ident_data = json.loads(r_ident.get("result", {}).get("content", [{}])[0].get("text", "{}"))
print("agent_identity output:", json.dumps(ident_data, indent=2))

# Onchain Registry checks:
# handleOf(wallet) -> selector
handle_data = eth_call(BSC_RPC, PROMPT_REGISTRY, get_sel("handleOf(address)") + WALLET.lower().replace("0x", "").zfill(64))
# Raw handle hash
agent_id_hex = eth_call(BSC_RPC, PROMPT_REGISTRY, get_sel("agentIdOf(address)") if "agentIdOf" in handle_data else get_sel("handleOf(address)") + WALLET.lower().replace("0x", "").zfill(64))
print("Raw handle data:", handle_data[:66])

# ownerOf(agentId)
agent_id_dec = ident_data.get("agentId")
agent_id_int = int(agent_id_dec)
agent_id_param = hex(agent_id_int)[2:].zfill(64)
owner_res = eth_call(BSC_RPC, PROMPT_REGISTRY, get_sel("ownerOf(uint256)") + agent_id_param)
owner_addr = "0x" + owner_res[-40:]
print("ownerOf(agentId):", owner_addr)
assert owner_addr.lower() == WALLET.lower(), "Wallet is not ownerOf(agentId)!"

# AgentGate.isAuthorized(agentId, wallet)
# isAuthorized(uint256,address)
auth_data = get_sel("isAuthorized(uint256,address)") + agent_id_param + WALLET.lower().replace("0x", "").zfill(64)
is_auth = int(eth_call(BSC_RPC, PROMPT_AGENTGATE, auth_data), 16) == 1
print("AgentGate.isAuthorized(agentId, wallet):", is_auth)
assert is_auth, "AgentGate.isAuthorized returned false!"

print("\n--- 5. Checking NFT Quota and Supply ---")
# mintedByWallet(wallet)
# selector mintedByWallet(address) -> 0x8b8b15d0 or get_sel
minted_res = eth_call(BSC_RPC, PROMPT_FREEMINT, get_sel("mintedByWallet(address)") + WALLET.lower().replace("0x", "").zfill(64))
minted_count = int(minted_res, 16) if minted_res and minted_res != "0x" else 0
print("mintedByWallet(wallet):", minted_count)
assert minted_count < 2, f"Wallet already minted {minted_count}/2 NFTs!"

# totalSupply()
supply_res = eth_call(BSC_RPC, PROMPT_NFT, get_sel("totalSupply()"))
total_supply = int(supply_res, 16)
print(f"NFT totalSupply(): {total_supply} / 7777 (Remaining: {7777 - total_supply})")
assert total_supply < 7777, "NFT collection is fully minted out!"

# wallet_status tool
r_wstat = call_mcp_with_retry(headers_auth, {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"wallet_status","arguments":{"wallet":WALLET}}})
wstat = json.loads(r_wstat.get("result", {}).get("content", [{}])[0].get("text", "{}"))
print("wallet_status tool output:", json.dumps(wstat, indent=2))
print("\n🎯 ALL PRE-FLIGHT VERIFICATIONS PASSED WITH 100% SUCCESS!")
