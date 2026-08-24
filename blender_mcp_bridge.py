import os
import sys
import subprocess
import time
import re
import signal
import threading

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8081
CLOUDFLARED = r"d:\folder\tools\short\longv1\cloudflared.exe"
SSE_SERVER = r"d:\folder\tools\mcp_sse_server.js"

# 1. Tu dong giai phong cong 8081 neu bi chiem dung
try:
    if sys.platform == "win32":
        out = subprocess.check_output(f'powershell -Command "Get-NetTCPConnection -LocalPort {PORT} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"', shell=True).decode().strip()
        for pid in out.splitlines():
            pid = pid.strip()
            if pid and pid.isdigit():
                subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
except Exception:
    pass

env = os.environ.copy()
env["PORT"] = str(PORT)

print("="*75, flush=True)
print("🚀 DANG KHOI DONG BLENDER MCP SERVER & CLOUDFLARE TUNNEL (CHUAN HOA 100%)...", flush=True)
print("[!] LUU Y: HAY MO PHAN MEM BLENDER VA BAT 'START MCP SERVER' TRONG MENU!", flush=True)
print("="*75, flush=True)

# Khoi dong MCP SSE Server noi bo (khong loi da ket noi)
gateway_cmd = ["node", SSE_SERVER, "cmd", "/c", "uvx", "blender-mcp"]

gateway_proc = subprocess.Popen(
    gateway_cmd,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

def stream_mcp_logs():
    try:
        for line in gateway_proc.stdout:
            print(line.strip(), flush=True)
    except Exception:
        pass

threading.Thread(target=stream_mcp_logs, daemon=True).start()

time.sleep(1.5)

# Khoi dong cloudflared tunnel
tunnel_cmd = [CLOUDFLARED, "tunnel", "--url", f"http://127.0.0.1:{PORT}"]
tunnel_proc = subprocess.Popen(
    tunnel_cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

tunnel_url = None
url_event = threading.Event()

def stream_tunnel_logs():
    global tunnel_url
    try:
        for line in tunnel_proc.stdout:
            match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
            if match and not tunnel_url:
                tunnel_url = match.group(0)
                url_event.set()
            if "ERR" in line:
                print(f"[TUNNEL ERR] {line.strip()}", flush=True)
    except Exception:
        pass

threading.Thread(target=stream_tunnel_logs, daemon=True).start()

url_event.wait(timeout=10)

if tunnel_url:
    print("\n" + "="*75, flush=True)
    print("🎉 KET NOI CLOUDFLARE TUNNEL THANH CONG CHO BLENDER MCP!", flush=True)
    print("-"*(75), flush=True)
    print(f"👉 LINK DAN VAO AI SPARK (Dung format /mcp):", flush=True)
    print(f"   {tunnel_url}/mcp", flush=True)
    print("="*75)
    print("💡 Giu cua so nay mo va theo doi log thoi gian thuc ben duoi:\n", flush=True)
else:
    print("[!] Chua nhan duoc link tunnel tu dong. Vui long kiem tra lai.", flush=True)

def cleanup(sig=None, frame=None):
    print("\n🛑 Dang dong tat ca cac tien trinh...", flush=True)
    try:
        tunnel_proc.terminate()
        gateway_proc.terminate()
    except Exception:
        pass
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

try:
    while True:
        time.sleep(1)
        if gateway_proc.poll() is not None:
            print(f"[CANH BAO] Server da dung voi ma thoat: {gateway_proc.poll()}", flush=True)
            break
        if tunnel_proc.poll() is not None:
            print(f"[CANH BAO] Tunnel da dung voi ma thoat: {tunnel_proc.poll()}", flush=True)
            break
except KeyboardInterrupt:
    cleanup()
