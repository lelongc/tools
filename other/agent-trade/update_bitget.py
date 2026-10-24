import json
import csv
import os

bitget_addrs = [
    "0x96c350934dfd00842c2c51fd4f7812d2b707ae31",  # 1
    "0xbdf8ed2ed26a31b8d032ea17925035eea45917d5",  # 2
    "0x6494e1ea31772f09a8ae6492cd4ee49813d6ef89",  # 3
    "0x62362f30b678d4bcad8c1f5fa7b130279cc4639b",  # 4
    "0x2dfe171b08df26efffd6eb9cf9dbffd41b35930e",  # 5
    "0x54b82df1659cb2064122a940bf6e05ab22496ae0",  # 6
    "0x9469834e356ef6ab6c705b7b50953d9fd70d67cf",  # 7
    "0xc3d80137a9eb91af9c322d903f4636fbe8188bec",  # 8
    "0xe31479f728a2a31a17de4ad2c9a10ec9f34e2636",  # 9
    "0x6355d469df5b1150f78401167e656393e8b119ef",  # 10
    "0x56e65fef63f8bcbd060e84550a6c5527dfc90b1",  # 11
    "0x063dae4874ca3af3ba2db06af331052a6b20dc18",  # 12
    "0xc7f12e831c77bfd6d4dee249c8ac07a6de5904c7",  # 13
    "0x89e572e68a7fe05f340a3437040a0a2af38dad72",  # 14
    "0xcce0a9586354d85e196cd74f49140cf6cc593b82",  # 15
    "0xe789831af778703840e5073dc4b69bad0daa8ecd",  # 16
    "0xaee7290d4e2aaca3d67ae643da445ba35d41c52c",  # 17
    "0x0dce49825a848db4728b5318fc07f05c73bcab5f",  # 18
    "0x2dd46133e1507a4cebff64dd63184f89897b1f8e",  # 19
    "0x3b7c1b529498d1aed850515d6b2525c6bc117da9"   # 20
]

base_dir = os.path.dirname(__file__)
master_path = os.path.join(base_dir, "wallets_master.json")
csv_path = os.path.join(base_dir, "wallets_public.csv")

# 1. Update wallets_master.json
with open(master_path, "r", encoding="utf-8") as f:
    master_data = json.load(f)

for i, w in enumerate(master_data["wallets"]):
    w["bitget_deposit_address"] = bitget_addrs[i]

with open(master_path, "w", encoding="utf-8") as f:
    json.dump(master_data, f, indent=2)

# 2. Update wallets_public.csv
rows = []
for i, w in enumerate(master_data["wallets"]):
    rows.append({
        "STT": w["index"],
        "Dia_Chi_Vi_Metamask": w["address"],
        "Dia_Chi_Nap_Bitget": bitget_addrs[i],
        "Ghi_Chu": f"Vi Clone #{w['index']} -> Bitget Deposit #{i+1}"
    })

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["STT", "Dia_Chi_Vi_Metamask", "Dia_Chi_Nap_Bitget", "Ghi_Chu"])
    writer.writeheader()
    writer.writerows(rows)

print("SUCCESS: 20 Bitget deposit addresses mapped 1-to-1 to 20 MetaMask wallets!")
