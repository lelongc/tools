import sys
import os
import subprocess
import struct

with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
    f.write(f"host.py started. sys.executable: {sys.executable}\n")

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
script_path = os.path.join(os.path.dirname(__file__), "server.py")
err_log = open("d:\\folder\\tools\\live-dub-local\\server_error.log", "a", encoding="utf-8")
out_log = open("d:\\folder\\tools\\live-dub-local\\server_output.log", "a", encoding="utf-8")

try:
    proc = subprocess.Popen(
        [sys.executable, "-u", script_path], 
        stdin=subprocess.DEVNULL,
        stdout=out_log, 
        stderr=err_log,
        cwd=os.path.dirname(__file__),
        creationflags=subprocess.CREATE_NO_WINDOW
    )
    with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
        f.write(f"Server process started with PID: {proc.pid}\n")
except Exception as e:
    with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
        f.write(f"Failed to start server process: {e}\n")

try:
    while True:
        msg = read_message()
        if msg is None:
            with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
                f.write("Chrome closed stdin (msg is None)\n")
            break
except Exception as e:
    with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
        f.write(f"Exception in read loop: {e}\n")

proc.terminate()
with open("d:\\folder\\tools\\live-dub-local\\host_debug.log", "a", encoding="utf-8") as f:
    f.write("host.py exiting normally\n")
sys.exit(0)
