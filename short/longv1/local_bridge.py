"""
LOCAL BRIDGE SERVER FOR AUTO-SCRIBE (AGENT-IN-THE-LOOP)
- Chạy trên Laptop của bạn (Siêu nhẹ ~15MB RAM)
- Nhận danh sách câu thoại từ Colab -> Lưu thành 'pending_scenes.json'
- In hướng dẫn chi tiết chuẩn format để bạn nhờ AI trong IDE phân tích
- AI phân tích và ghi file 'last_analyzed_scenes.json'
- Colab tự động kéo file về để vẽ SVG nét viền (outline) và đóng gói VideoScribe!
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
import subprocess
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

PORT = 8765
PENDING_FILE = "pending_scenes.json"
ANALYZED_FILE = "last_analyzed_scenes.json"

class BridgeHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path == "/get_analyzed_scenes":
            if os.path.exists(ANALYZED_FILE):
                with open(ANALYZED_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                resp = {"status": "success", "data": data}
            else:
                resp = {"status": "pending", "message": f"Chưa có file {ANALYZED_FILE}. Hãy bảo AI trong IDE phân tích kịch bản!"}
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return
            
        resp = {"status": "online", "message": "Local Bridge Server is running!"}
        self.wfile.write(json.dumps(resp).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            req = json.loads(post_data.decode('utf-8'))
            scenes = req.get('scenes', [])
            
            with open(PENDING_FILE, "w", encoding="utf-8") as f:
                json.dump(scenes, f, ensure_ascii=False, indent=2)
                
            print("\n" + "═"*75)
            print(f"📩 [Colab ➔ Laptop] ĐÃ NHẬN {len(scenes)} CÂU THOẠI TỪ COLAB!")
            print(f"📁 Đã lưu vào file: {os.path.abspath(PENDING_FILE)}")
            print("─"*75)
            print("👉 HÃY COPY HOẶC NHẮN VÀO KHUNG CHAT ANTIGRAVITY (AI) CÂU NÀY:")
            print()
            print(f"   'Hãy đọc file {PENDING_FILE} và phân tích kịch bản video Whiteboard Doodle,")
            print("    sau đó lưu kết quả vào last_analyzed_scenes.json'")
            print("─"*75)
            print("💡 AI trong IDE sẽ đọc file và tạo kịch bản với đầy đủ từ khóa nét vẽ & hiệu ứng!")
            print("═"*75 + "\n")
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            resp = {
                "status": "received",
                "message": f"Đã nhận {len(scenes)} câu thoại. Đang chờ AI trong IDE phân tích!",
                "total_scenes": len(scenes)
            }
            self.wfile.write(json.dumps(resp).encode('utf-8'))
        except Exception as e:
            print(f"❌ Lỗi xử lý POST: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

def start_server():
    server = HTTPServer(('127.0.0.1', PORT), BridgeHandler)
    server.serve_forever()

def run_tunnel():
    cloudflared_bin = "cloudflared.exe" if sys.platform == "win32" else "cloudflared"
    if not os.path.exists(cloudflared_bin) or os.path.getsize(cloudflared_bin) < 5000000:
        print("⬇️ Đang tải Cloudflare Tunnel...")
        url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" if sys.platform == "win32" else "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(cloudflared_bin, 'wb') as f:
            f.write(resp.read())
        print("✅ Đã tải xong Cloudflare Tunnel!")

    if sys.platform != "win32":
        os.chmod(cloudflared_bin, 0o755)

    print("\n🌐 Đang khởi tạo đường hầm kết nối Cloudflare Tunnel...")
    cmd = [os.path.abspath(cloudflared_bin), "tunnel", "--url", f"http://127.0.0.1:{PORT}"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    
    for line in proc.stdout:
        match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
        if match:
            tunnel_url = match.group(0)
            print("\n" + "═"*75)
            print(f"🎉 ĐÃ KẾT NỐI CLOUDFLARE TUNNEL THÀNH CÔNG!")
            print(f"👉 Đường link dán vào Colab: {tunnel_url}")
            print("═"*75)
            print("💡 Khi Colab gửi kịch bản, nó sẽ lưu thành 'pending_scenes.json'.")
            print("   Bạn chỉ cần bảo AI trong khung chat phân tích kịch bản đó!\n")
            break

if __name__ == "__main__":
    print(f"🚀 Khởi động Server Local tại: http://127.0.0.1:{PORT}")
    t = threading.Thread(target=start_server, daemon=True)
    t.start()
    time.sleep(0.5)
    run_tunnel()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nĐã dừng server.")
