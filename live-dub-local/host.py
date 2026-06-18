import sys
import os
import subprocess
import struct

with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
    f.write("host.py started\n")

# Fix Unicode print errors on Windows
sys.stdout.reconfigure(encoding='utf-8')

# Hàm đọc message theo chuẩn Native Messaging
def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    message_length = struct.unpack('@I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return message

# Khởi chạy server.py
# Lưu ý: Cần tắt output stdout/stderr của server để không làm hỏng luồng Native Messaging của Chrome
script_path = os.path.join(os.path.dirname(__file__), "server.py")
proc = subprocess.Popen(
    [sys.executable, "-u", script_path], 
    stdout=subprocess.DEVNULL, 
    stderr=subprocess.DEVNULL
)

try:
    while True:
        msg = read_message()
        if msg is None:
            # Chrome đã đóng stdin -> Ngắt kết nối
            break
except Exception:
    pass

# Khi Chrome ngắt kết nối, giết cái server
proc.terminate()
sys.exit(0)
