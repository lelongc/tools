import subprocess
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')
qr_id = sys.argv[1] if len(sys.argv) > 1 else ""
if not qr_id:
    print("Vui lòng truyền qrCodeId (ví dụ: python auto_verify.py <qr_code_id>)")
    sys.exit(1)
print(f"Đang chờ người dùng quét mã xác nhận {qr_id}...")

for attempt in range(30):
    cmd = ["npx", "-y", "@binance/agentic-wallet", "auth", "verify", "--qrCodeId", qr_id, "--json"]
    proc = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    try:
        data = json.loads(proc.stdout)
        status = data.get("data", {}).get("status")
        if status == "SUCCESS":
            print("🎉 XÁC THỰC THÀNH CÔNG (SUCCESS)!")
            sys.exit(0)
        elif not data.get("success"):
            err = data.get("error", {}).get("message", "")
            if "expired" in err.lower():
                print(f"Mã đã hết hạn: {err}")
                sys.exit(1)
    except Exception:
        pass
    time.sleep(4)

print("Hết thời gian chờ.")
sys.exit(2)
