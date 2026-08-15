"""
LOCAL BRIDGE SERVER FOR AUTO-SCRIBE (SIÊU NHẸ - CHỈ ~15MB RAM)
- Chạy trên Laptop của bạn
- Tự động mở Cloudflare Tunnel (Miễn phí 100%, không cần tài khoản)
- Nhận kịch bản từ Colab, phân tích từ khóa hình ảnh & hiệu ứng mà KHÔNG CẦN GEMINI API KEY!
"""

import os
import sys
import json
import re
import random
import urllib.request
import urllib.parse
import subprocess
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

PORT = 8765

def analyze_script_nlp(scenes, sec_per_img=3.5):
    """
    Phân tích câu thoại bằng thuật toán ngữ nghĩa & từ điển trực quan siêu nhẹ (0% CPU/GPU).
    Tự động trích xuất các danh từ, động từ hành động và chuyển thể thành từ khóa vẽ Doodle tiếng Anh!
    """
    keyword_dict = {
        "thành công": "success trophy winner podium",
        "tiền": "money cash gold coins stack",
        "đầu tư": "investment profit growth chart arrow",
        "kinh doanh": "business handshake strategy office",
        "thời gian": "stopwatch clock hourglass schedule",
        "đồng hồ": "luxury watch timer wrist",
        "mục tiêu": "target bullseye arrow goal aim",
        "ý tưởng": "lightbulb idea innovation spark",
        "công nghệ": "artificial intelligence computer tech robot",
        "lựa chọn": "decision crossroads direction choices",
        "tăng trưởng": "growth upward graph success bar",
        "bảo vệ": "security shield safety lock",
        "thử thách": "climbing mountain obstacle flag",
        "cảm xúc": "happy face emotion psychology smile",
        "logic": "brain logic puzzle thinking gears",
        "bí mật": "secret key treasure lock chest",
        "kế hoạch": "planning clipboard checklist notes",
        "đội ngũ": "teamwork collaboration people group",
        "khách hàng": "customer client handshake support",
        "bán hàng": "shopping cart store sales money",
        "giá trị": "diamond precious value luxury gem",
        "bài học": "book wisdom learning study education",
        "sai lầm": "warning error alert caution stop",
        "tương lai": "future telescope vision rocket space",
        "thói quen": "daily routine calendar habit check",
        "tập trung": "focus target magnifying glass center",
        "kết nối": "network connection global link web",
        "sáng tạo": "art palette brush creativity design",
        "đột phá": "breakthrough rocket launch power speed",
        "tự do": "freedom flying bird wings sky"
    }

    results = []
    for s_idx, s in enumerate(scenes):
        text = s.get('text', '').strip()
        dur = float(s.get('end', 0)) - float(s.get('start', 0))
        num_imgs = max(1, int(round(dur / float(sec_per_img))))
        
        lower_text = text.lower()
        matched_prompts = []
        for vi_kw, en_prompt in keyword_dict.items():
            if vi_kw in lower_text:
                matched_prompts.append(en_prompt)
                
        default_concepts = [
            "concept idea lightbulb innovation",
            "business strategy handshake deal",
            "growth chart upward trend arrow",
            "target goal achievement bullseye",
            "thinking brain logic puzzle",
            "time management clock hourglass"
        ]
        
        images = []
        for img_i in range(num_imgs):
            if img_i < len(matched_prompts):
                prompt = matched_prompts[img_i]
            else:
                prompt = random.choice(default_concepts)
                
            if img_i == 0:
                style = "draw"
            else:
                style = random.choice(["draw", "movein", "fadein"])
                
            images.append({
                "visual_concept": f"Minh họa câu #{s.get('sentence_id', s_idx+1)} (ảnh {img_i+1})",
                "svg_search_prompt": prompt,
                "animation_style": style
            })
            
        results.append({
            "sentence_id": s.get('sentence_id', s_idx + 1),
            "images": images
        })
        
    return results

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
        resp = {"status": "online", "message": "Local Bridge Server is running!"}
        self.wfile.write(json.dumps(resp).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            req = json.loads(post_data.decode('utf-8'))
            scenes = req.get('scenes', [])
            sec_per_img = req.get('sec_per_img', 3.5)
            
            print(f"\n📩 [Colab ➔ Laptop] Nhận yêu cầu phân tích {len(scenes)} câu thoại...")
            analyzed_data = analyze_script_nlp(scenes, sec_per_img)
            
            with open("last_analyzed_scenes.json", "w", encoding="utf-8") as f:
                json.dump(analyzed_data, f, ensure_ascii=False, indent=2)
                
            print(f"✨ [Laptop ➔ Colab] Đã phân tích thành công {len(analyzed_data)} cảnh kịch bản!")
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            resp = {
                "status": "success",
                "data": analyzed_data
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
    
    tunnel_url = None
    for line in proc.stdout:
        match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
        if match:
            tunnel_url = match.group(0)
            print("\n" + "═"*70)
            print(f"🎉 ĐÃ KẾT NỐI CLOUDFLARE TUNNEL THÀNH CÔNG!")
            print(f"👉 Đường link để dán vào Colab: {tunnel_url}")
            print("═"*70)
            print("💡 Hãy giữ cửa sổ này mở (chỉ tốn ~15MB RAM) để Colab gửi kịch bản về!\n")
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
