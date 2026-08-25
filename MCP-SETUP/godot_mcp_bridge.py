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
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    env[key.strip()] = val.strip()
    return env

config = load_env(os.path.join(SCRIPT_DIR, '.env'))
PORT = int(config.get('PORT', '8080'))
GODOT_PATH = config.get('GODOT_PATH', r'D:\app\godot\Godot_v4.7.1-stable_win64.exe')
GODOT_MCP_SCRIPT = config.get('GODOT_MCP_SCRIPT', r'C:/Users/Acer/.gemini/antigravity-ide/mcp/godot-mcp/build/index.js')
BLENDER_MCP_CMD = config.get('BLENDER_MCP_CMD', 'uvx blender-mcp')
BLENDER_HOST = config.get('BLENDER_HOST', '127.0.0.1')
BLENDER_PORT = config.get('BLENDER_PORT', '9876')
GODOT_PROJECT_PATH = config.get('GODOT_PROJECT_PATH', r'd:\folder\tools\godot_demo\2')
GODOT_MCP_ALLOWED_DIRS = config.get('GODOT_MCP_ALLOWED_DIRS', r'd:\folder\tools;d:\folder\tools\godot_demo\2')

SSE_SERVER = os.path.join(SCRIPT_DIR, 'mcp_sse_server.js')
NGROK_EXE = os.path.join(SCRIPT_DIR, 'ngrok.exe')
NGROK_AUTHTOKEN = config.get('NGROK_AUTHTOKEN', '')
NGROK_DOMAIN = config.get('NGROK_DOMAIN', '')

# === 1. Giai phong ngrok cu va port 8080 ===
try:
    if sys.platform == "win32":
        subprocess.run("taskkill /F /IM ngrok.exe /T 2>nul", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
env["GODOT_MCP_SCRIPT"] = GODOT_MCP_SCRIPT
env["BLENDER_MCP_CMD"] = BLENDER_MCP_CMD
env["BLENDER_HOST"] = BLENDER_HOST
env["BLENDER_PORT"] = BLENDER_PORT
env["GODOT_PROJECT_PATH"] = GODOT_PROJECT_PATH
env["GODOT_MCP_ALLOWED_DIRS"] = GODOT_MCP_ALLOWED_DIRS
env["PYTHONIOENCODING"] = "utf-8"
env["DEBUG"] = "true"
env["PORT"] = str(PORT)

print("=" * 75, flush=True)
print("  🚀 MASTER MCP HUB (GODOT + BLENDER + AI IMAGE) + NGROK LINK CỐ ĐỊNH", flush=True)
print("=" * 75, flush=True)

# === 3. Khoi dong Master MCP SSE Server ===
gateway_cmd = ["node", SSE_SERVER]
gateway_proc = subprocess.Popen(
    gateway_cmd, env=env,
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    text=True, bufsize=1, encoding='utf-8', errors='replace'
)

def stream_mcp_logs():
    try:
        while True:
            line = gateway_proc.stdout.readline()
            if not line and gateway_proc.poll() is not None:
                break
            if line:
                print(line.rstrip(), flush=True)
    except Exception:
        pass

threading.Thread(target=stream_mcp_logs, daemon=True).start()
time.sleep(2.5)

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
    text=True, bufsize=1, encoding='utf-8', errors='replace'
)

time.sleep(3)

if NGROK_DOMAIN:
    public_url = f"https://{NGROK_DOMAIN}"
    print(f"\n{'=' * 75}", flush=True)
    print("  🎉 KẾT NỐI THÀNH CÔNG! BỘ 3 LINK TĨNH VĨNH VIỄN CHO SPARK:", flush=True)
    print(f"  {'-' * 71}", flush=True)
    print(f"  🎮 1. GODOT MCP     : {public_url}/mcp", flush=True)
    print(f"  🎨 2. BLENDER MCP   : {public_url}/blender/mcp", flush=True)
    print(f"  🖼️ 3. AI IMAGE MCP  : {public_url}/image/mcp", flush=True)
    print(f"{'=' * 75}", flush=True)
    print("  💡 Cả 3 link này chạy song song, vĩnh viễn không bao giờ thay đổi!", flush=True)
    print(f"{'=' * 75}\n", flush=True)
else:
    print("[!] Khong co NGROK_DOMAIN trong .env. Dang dung link ngau nhien.", flush=True)

def stream_ngrok_logs():
    try:
        while True:
            line = tunnel_proc.stdout.readline()
            if not line and tunnel_proc.poll() is not None:
                break
            if line:
                stripped = line.rstrip()
                if "ERROR" in stripped or "ERR" in stripped or "started tunnel" in stripped:
                    print(f"[NGROK] {stripped}", flush=True)
    except Exception:
        pass

threading.Thread(target=stream_ngrok_logs, daemon=True).start()

# === 6. Xu ly thoat ===
def cleanup(sig=None, frame=None):
    print("\n  Đang đóng tất cả các tiến trình...", flush=True)
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
            print(f"[CẢNH BÁO] Server đã dừng (mã thoát: {gateway_proc.poll()})", flush=True)
            break
        if tunnel_proc.poll() is not None:
            print(f"[CẢNH BÁO] Ngrok đã dừng (mã thoát: {tunnel_proc.poll()})", flush=True)
            break
except KeyboardInterrupt:
    cleanup()
