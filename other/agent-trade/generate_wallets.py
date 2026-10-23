import json
import csv
import os
import sys
from eth_account import Account

# Fix Windows console UTF-8 encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def generate_20_wallets():
    Account.enable_unaudited_hdwallet_features()
    
    # Generate 1 fresh master mnemonic (12 words)
    acct, mnemonic = Account.create_with_mnemonic()
    
    wallets = []
    public_rows = []
    
    print("\n" + "="*60)
    print("💎 ĐANG SINH 20 VÍ METAMASK (CHUẨN BIP-44 / METAMASK)")
    print("="*60)
    
    for i in range(20):
        # Standard MetaMask derivation path
        path = f"m/44'/60'/0'/0/{i}"
        wallet = Account.from_mnemonic(mnemonic, account_path=path)
        
        wallets.append({
            "index": i + 1,
            "address": wallet.address,
            "private_key": wallet.key.hex(),
            "derivation_path": path
        })
        
        public_rows.append({
            "STT": i + 1,
            "Dia_Chi_Vi_Metamask": wallet.address,
            "Dia_Chi_Nap_Bitget": "",  # Người dùng điền sau
            "Ghi_Chu": f"Vi Clone #{i+1}"
        })
        print(f"Ví #{i+1:02d}: {wallet.address}")

    # 1. Lưu file Master (Gốc - Bảo mật trên máy tính)
    master_file = os.path.join(os.path.dirname(__file__), "wallets_master.json")
    with open(master_file, "w", encoding="utf-8") as f:
        json.dump({
            "mnemonic": mnemonic,
            "total_wallets": len(wallets),
            "wallets": wallets
        }, f, indent=2)

    # 2. Lưu file Public CSV (An toàn để up lên Google Sheets / Excel Cloud)
    csv_file = os.path.join(os.path.dirname(__file__), "wallets_public.csv")
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["STT", "Dia_Chi_Vi_Metamask", "Dia_Chi_Nap_Bitget", "Ghi_Chu"])
        writer.writeheader()
        writer.writerows(public_rows)

    print("\n" + "="*60)
    print("🔑 CỤM 12 TỪ KHÓA BÍ MẬT (SEED PHRASE) - LƯU VÀO GIẤY:")
    print("="*60)
    print(f"\n   >>>  {mnemonic}  <<<\n")
    print("="*60)
    print(f"✅ Đã lưu file bảo mật (Private Key): {master_file}")
    print(f"✅ Đã lưu file công khai (Dùng cho Excel Cloud): {csv_file}")
    print("="*60 + "\n")

if __name__ == "__main__":
    generate_20_wallets()
