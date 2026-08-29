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

def generate_hero_pack():
    return send_request("/api/ai/quick_action?action=full_hero_pack", method="POST", data={"image": ""})

def generate_boss_pack():
    return send_request("/api/ai/quick_action?action=full_boss_pack", method="POST", data={"image": ""})

def trigger_quick_action(action: str, image_b64: str = ""):
    return send_request(f"/api/ai/quick_action?action={action}", method="POST", data={"image": image_b64})

def trigger_inpaint(prompt: str, image_b64: str, mask_b64: str = ""):
    return send_request("/api/ai/inpaint", method="POST", data={"prompt": prompt, "image": image_b64, "mask": mask_b64})

def sync_full_character_to_godot(character_name: str, clips: dict):
    return send_request("/api/godot/sync_full_character", method="POST", data={
        "character_name": character_name,
        "clips": clips
    })

if __name__ == "__main__":
    print("Testing 2D Studio Bridge...")
    res = generate_hero_pack()
    print("Hero Pack status:", "OK" if "clips" in res else res)
