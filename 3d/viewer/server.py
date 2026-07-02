import http.server
import socketserver
import json
import os
import io
import re
import base64
import time

PORT = 8000
SAVE_FILE = "save.json"
TEXTURE_DIR = "assets"

# Global timestamp - changes every server restart, forces full cache bust
CACHE_BUST = str(int(time.time()))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path == '/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(SAVE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))

        elif self.path == '/upload-texture':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                filename = data['filename']
                # Sanitize filename
                filename = os.path.basename(filename)
                img_data = base64.b64decode(data['data'])
                filepath = os.path.join(TEXTURE_DIR, filename)
                with open(filepath, 'wb') as f:
                    f.write(img_data)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "path": f"assets/{filename}"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path == '/list-textures':
            try:
                files = []
                for f in os.listdir(TEXTURE_DIR):
                    ext = f.lower().split('.')[-1]
                    if ext in ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp']:
                        files.append(f"assets/{f}")
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(files).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            # Strip query strings for file lookup (e.g. main.js?t=123 -> main.js)
            clean_path = self.path.split('?')[0]
            
            # For .js files, intercept and rewrite import paths with cache bust
            if clean_path.endswith('.js'):
                self.path = clean_path  # Use clean path for file lookup
                file_path = self.translate_path(self.path)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Rewrite all ES module imports to add cache bust timestamp
                    # Matches: from './xxx.js' or from "./xxx.js"
                    content = re.sub(
                        r"from\s+['\"](\./[^'\"]+\.js)['\"]",
                        lambda m: f"from '{m.group(1)}?_cb={CACHE_BUST}'",
                        content
                    )
                    
                    encoded = content.encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-type', 'application/javascript')
                    self.send_header('Content-Length', str(len(encoded)))
                    self.end_headers()
                    self.wfile.write(encoded)
                except FileNotFoundError:
                    self.send_response(404)
                    self.end_headers()
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
            else:
                super().do_GET()

if __name__ == '__main__':
    print(f"Cache bust token: {CACHE_BUST}")
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
