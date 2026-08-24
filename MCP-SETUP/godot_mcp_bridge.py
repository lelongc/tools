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

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# === Doc .env ===
def load_env(path):
    env = {}
    if os.path.exists(path):
        with open(path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    env[key.strip()] = val.strip()
    return env

config = load_env(os.path.join(SCRIPT_DIR, '.env'))
PORT = int(config.get('GODOT_PORT', '8080'))
GODOT_PATH = config.get('GODOT_PATH', r'D:\app\godot\Godot_v4.7.1-stable_win64.exe')
MCP_SCRIPT = config.get('GODOT_MCP_SCRIPT', r'C:/Users/Acer/.gemini/antigravity-ide/mcp/godot-mcp/build/index.js')
SSE_SERVER = os.path.join(SCRIPT_DIR, 'mcp_sse_server.js')
NGROK_EXE = os.path.join(SCRIPT_DIR, 'ngrok.exe')
NGROK_AUTHTOKEN = config.get('NGROK_AUTHTOKEN', '')
NGROK_DOMAIN = config.get('NGROK_DOMAIN', '')

# === 1. Giai phong ngrok cu va port 8080 ===
try:
    if sys.platform == "win32":
        subprocess.run("taskkill /F /IM ngrok.exe /T", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        out = subprocess.check_output(
            f'powershell -Command "Get-NetTCPConnection -LocalPort {PORT} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"',
            shell=True
        ).decode().strip()
        for pid in out.splitlines():
            pid = pid.strip()
            if pid and pid.isdigit():
                subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
except Exception:
    pass

# === 2. Chuan bi environment ===
env = os.environ.copy()
env["GODOT_PATH"] = GODOT_PATH
env["DEBUG"] = "true"
env["PORT"] = str(PORT)

print("=" * 75, flush=True)
print("  GODOT MCP SERVER + NGROK (LINK CO DINH VINH VIEN)", flush=True)
print("=" * 75, flush=True)

# === 3. Khoi dong MCP SSE Server ===
gateway_cmd = ["node", SSE_SERVER, "node", MCP_SCRIPT]
gateway_proc = subprocess.Popen(
    gateway_cmd, env=env,
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    text=True, bufsize=1
)

def stream_mcp_logs():
    try:
        for line in gateway_proc.stdout:
            print(f"[SERVER] {line.strip()}", flush=True)
    except Exception:
        pass

threading.Thread(target=stream_mcp_logs, daemon=True).start()
time.sleep(1.5)

# === 4. Cau hinh ngrok authtoken ===
if NGROK_AUTHTOKEN:
    subprocess.run(
        [NGROK_EXE, "config", "add-authtoken", NGROK_AUTHTOKEN],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )

# === 5. Khoi dong ngrok voi domain co dinh ===
ngrok_cmd = [NGROK_EXE, "http", str(PORT)]
if NGROK_DOMAIN:
    ngrok_cmd += ["--url", NGROK_DOMAIN]

tunnel_proc = subprocess.Popen(
    ngrok_cmd,
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    text=True, bufsize=1
)

time.sleep(3)

if NGROK_DOMAIN:
    public_url = f"https://{NGROK_DOMAIN}"
    print(f"\n{'=' * 75}", flush=True)
    print("  KET NOI THANH CONG! LINK CO DINH VINH VIEN:", flush=True)
    print(f"  {'-' * 71}", flush=True)
    print(f"  LINK DAN VAO AI SPARK:", flush=True)
    print(f"  {public_url}/mcp", flush=True)
    print(f"{'=' * 75}", flush=True)
    print("  Link nay KHONG BAO GIO THAY DOI. Tat bat bao nhieu lan cung duoc!", flush=True)
    print(f"{'=' * 75}\n", flush=True)
else:
    print("[!] Khong co NGROK_DOMAIN trong .env. Dang dung link ngau nhien.", flush=True)

def stream_ngrok_logs():
    try:
        for line in tunnel_proc.stdout:
            stripped = line.strip()
            if stripped:
                print(f"[NGROK] {stripped}", flush=True)
    except Exception:
        pass

threading.Thread(target=stream_ngrok_logs, daemon=True).start()

# === 6. Xu ly thoat ===
def cleanup(sig=None, frame=None):
    print("\n  Dang dong tat ca cac tien trinh...", flush=True)
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
            print(f"[CANH BAO] Server da dung (ma thoat: {gateway_proc.poll()})", flush=True)
            break
        if tunnel_proc.poll() is not None:
            print(f"[CANH BAO] Ngrok da dung (ma thoat: {tunnel_proc.poll()})", flush=True)
            break
except KeyboardInterrupt:
    cleanup()
