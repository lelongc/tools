import subprocess
import json
import time
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

QR_ID = "e295d21c-1914-4190-84d5-3f6947ad76e7"
print(f"⏳ Đang chờ người dùng quét mã xác nhận {QR_ID} trên Binance App...")

logged_in = False
for attempt in range(60): # 4 phút chờ
    cmd = ["npx", "-y", "@binance/agentic-wallet", "auth", "verify", "--qrCodeId", QR_ID, "--json"]
    proc = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    try:
        data = json.loads(proc.stdout)
        status = data.get("data", {}).get("status")
        if status == "SUCCESS":
            print("\n🎉 XÁC THỰC THÀNH CÔNG (SUCCESS)! VÍ ĐÃ ĐĂNG NHẬP!")
            logged_in = True
            break
        elif not data.get("success"):
            err = data.get("error", {}).get("message", "")
            if "expired" in err.lower():
                print(f"Mã đã hết hạn: {err}")
                sys.exit(1)
    except Exception:
        pass
    sys.stdout.write(".")
    sys.stdout.flush()
    time.sleep(3)

if not logged_in:
    print("\nHết thời gian chờ quét mã.")
    sys.exit(2)

# Sau khi login thành công, bật lại devMode nếu cần và chạy sniper
print("\n🚀 Bật chế độ DevMode $50,000/ngày...")
subprocess.run(["npx", "-y", "@binance/agentic-wallet", "wallet", "settings", "--dailyLimit", "50000", "--devMode", "true", "--json"], shell=True)

print("\n🎯 KHỞI ĐỘNG BẮN TỈA NONCE PROTOCOL NGAY LẬP TỨC...")
from nonce_sniper import run_single_attempt, send_telegram

send_telegram("🚨 <b>ĐÃ KẾT NỐI VÍ THÀNH CÔNG! ĐANG TỰ ĐỘNG BẮN TỈA 2 SLOT NONCE GENESIS...</b>")

success = 0
for i in range(2):
    print(f"\n--- Tiến hành Mint con số {i+1}/2 ---")
    if run_single_attempt():
        success += 1
        time.sleep(2)
    else:
        print("Lỗi trong lượt mint.")

print(f"\n🏁 HOÀN TẤT! Đã mint thành công: {success}/2 NFTs!")
send_telegram(f"🏁 <b>HOÀN TẤT ĐỢT SĂN!</b>\nĐã mint thành công {success}/2 NFTs về ví!")
