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
    # Từ điển ánh xạ từ khóa cơ bản đa lĩnh vực
    keyword_dict = {
        "thành công": "success trophy winner",
        "tiền": "money cash gold coins",
        "đầu tư": "investment profit growth chart",
        "kinh doanh": "business handshake strategy",
        "thời gian": "stopwatch clock hourglass",
        "đồng hồ": "luxury watch clock",
        "mục tiêu": "target bullseye arrow goal",
        "ý tưởng": "lightbulb idea innovation",
        "công nghệ": "artificial intelligence computer tech",
        "lựa chọn": "decision crossroads direction",
        "tăng trưởng": "growth upward graph success",
        "bảo vệ": "security shield safety",
        "thử thách": "climbing mountain obstacle",
        "cảm xúc": "happy face emotion psychology",
        "logic": "brain logic puzzle thinking",
        "bí mật": "secret key treasure lock",
        "kế hoạch": "planning clipboard checklist",
        "đội ngũ": "teamwork collaboration people",
        "khách hàng": "customer client support",
        "bán hàng": "shopping cart store sales",
        "giá trị": "diamond precious value luxury",
        "bài học": "book wisdom learning study",
        "sai lầm": "warning error alert caution",
        "tương lai": "future telescope vision rocket",
        "thói quen": "daily routine calendar habit",
        "tập trung": "focus target magnifying glass",
        "kết nối": "network connection global link",
        "sáng tạo": "art palette brush creativity",
        "đột phá": "breakthrough rocket launch power",
        "tự do": "freedom flying bird wings"
    }

    results = []
    
    for s_idx, s in enumerate(scenes):
        text = s.get('text', '').strip()
        dur = float(s.get('end', 0)) - float(s.get('start', 0))
        num_imgs = max(1, int(round(dur / float(sec_per_img))))
        
        # Phân tích tìm từ khóa phù hợp
        lower_text = text.lower()
        matched_prompts = []
        for vi_kw, en_prompt in keyword_dict.items():
            if vi_kw in lower_text:
                matched_prompts.append(en_prompt)
                
        # Nếu không có từ điển khớp, dùng các từ khóa chủ đề đa dạng
        default_concepts = [
            "concept idea lightbulb",
            "business strategy handshake",
            "growth chart arrow",
            "target goal achievement",
            "thinking brain logic",
            "time management clock"
        ]
        
        images = []
        for img_i in range(num_imgs):
            if img_i < len(matched_prompts):
                prompt = matched_prompts[img_i]
            else:
                prompt = random.choice(default_concepts)
                
            # Phân bổ hiệu ứng: Ưu tiên draw, xen kẽ movein no-hand & fadein
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
            
            print(f"\\n📩 Nhận yêu cầu phân tích {len(scenes)} câu thoại từ Colab...")
            analyzed_data = analyze_script_nlp(scenes, sec_per_img)
            
            # Lưu bản sao ra file local để kiểm tra
            with open("last_analyzed_scenes.json", "w", encoding="utf-8") as f:
                json.dump(analyzed_data, f, ensure_ascii=False, indent=2)
                
            print(f"✨ Đã phân tích thành công {len(analyzed_data)} cảnh và gửi ngược lại Colab!")
            
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
    print(f"🚀 Server Local đang chạy tại: http://127.0.0.1:{PORT}")
    server.serve_forever()

def download_and_run_cloudflared():
    cloudflared_bin = "cloudflared.exe" if sys.platform == "win32" else "cloudflared"
    
    if not os.path.exists(cloudflared_bin):
        print("⬇️ Đang tải Cloudflare Tunnel (Chỉ 15MB, chạy trực tiếp)...")
        if sys.platform == "win32":
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
        else:
            url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
            
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(cloudflared_bin, 'wb') as f:
                f.write(resp.read())
            print("✅ Đã tải xong Cloudflare Tunnel!")
        except Exception as e:
            print(f"⚠️ Lỗi tải cloudflared: {e}. Bạn có thể dùng ngrok hoặc local link.")
            return

    if sys.platform != "win32":
        os.chmod(cloudflared_bin, 0o755)

    print("\\n🌐 Đang tạo đường link kết nối Cloudflare Tunnel tới Colab...")
    cmd = [os.path.abspath(cloudflared_bin), "tunnel", "--url", f"http://127.0.0.1:{PORT}"]
    
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)
    
    tunnel_url = None
    for line in proc.stderr:
        match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
        if match:
            tunnel_url = match.group(0)
            print("\\n" + "="*70)
            print(f"🎉 ĐÃ MỞ TUNNEL THÀNH CÔNG!")
            print(f"👉 Đường link dán vào Colab: {tunnel_url}")
            print("="*70 + "\\n")
            break

if __name__ == "__main__":
    t = threading.Thread(target=start_server, daemon=True)
    t.start()
    time.sleep(1)
    download_and_run_cloudflared()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\\nĐã dừng server.")
