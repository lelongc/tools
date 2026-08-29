import sys
import json
import urllib.request
import urllib.parse

STUDIO_API_URL = "http://localhost:8765"

def send_request(endpoint: str, method: str = "GET", data: dict = None):
    url = f"{STUDIO_API_URL}{endpoint}"
    req = urllib.request.Request(url, method=method)
    if data:
        json_data = json.dumps(data).encode("utf-8")
        req.add_header("Content-Type", "application/json")
        req.data = json_data
        
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

def get_canvas():
    return send_request("/api/canvas")

def trigger_quick_action(action: str, image_b64: str = ""):
    return send_request(f"/api/ai/quick_action?action={action}", method="POST", data={"image": image_b64})

def trigger_inpaint(prompt: str, image_b64: str, mask_b64: str = ""):
    return send_request("/api/ai/inpaint", method="POST", data={"prompt": prompt, "image": image_b64, "mask": mask_b64})

def export_to_godot(name: str = "hero_brawler", image_b64: str = "", fw: int = 128, fh: int = 128):
    return send_request("/api/godot/sync", method="POST", data={"name": name, "image": image_b64, "frame_width": fw, "frame_height": fh})

if __name__ == "__main__":
    # Test connection
    print("Testing 2D Studio Bridge...")
    res = get_canvas()
    print("Canvas status:", "OK" if "image" in res else res)
