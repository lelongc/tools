import os
import io
import json
import base64
import math
import asyncio
from typing import List, Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="2D Studio & Smart Slicer Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKSPACE_DIR = r"d:\folder\tools\2d_studio\workspace"
LIB_DIR = r"d:\folder\tools\2d_studio\assets_library"
GODOT_SPRITES_DIR = r"d:\folder\tools\godot_demo\2\assets\sprites"
os.makedirs(WORKSPACE_DIR, exist_ok=True)
os.makedirs(LIB_DIR, exist_ok=True)
os.makedirs(GODOT_SPRITES_DIR, exist_ok=True)

# Connected WebSocket clients
ws_clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_clients.remove(websocket)

async def broadcast_ws(message: dict):
    for client in ws_clients:
        try:
            await client.send_json(message)
        except Exception:
            pass

# Helper image functions
def base64_to_image(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    img_bytes = base64.b64decode(b64_str)
    return Image.open(io.BytesIO(img_bytes)).convert("RGBA")

def image_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

# =========================================================================
# ASSET LIBRARY CATALOG
# =========================================================================
@app.get("/api/library/assets")
async def get_library_assets():
    catalog = {
        "characters": [],
        "items": [],
        "ui": [],
        "environments": [],
        "fx": []
    }
    
    for cat in catalog.keys():
        cat_path = os.path.join(LIB_DIR, cat)
        if not os.path.exists(cat_path):
            continue
        for item_id in os.listdir(cat_path):
            item_path = os.path.join(cat_path, item_id)
            if not os.path.isdir(item_path):
                continue
            meta_path = os.path.join(item_path, "meta.json")
            meta = {}
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as f:
                        meta = json.load(f)
                except Exception:
                    pass
            
            thumb_url = f"/assets_library/{cat}/{item_id}/thumb.png"
            catalog[cat].append({
                "id": item_id,
                "name": meta.get("name", item_id.replace("_", " ").title()),
                "category": cat,
                "thumb_url": thumb_url,
                "description": meta.get("description", "")
            })
            
    return {"catalog": catalog}

# =========================================================================
# AI GENERATE FULL ASSET / SPRITESHEET
# =========================================================================
class GenerateAssetReq(BaseModel):
    category: str
    prompt: str

@app.post("/api/ai/generate_full_asset")
async def generate_full_asset(req: GenerateAssetReq):
    # Log prompt for AI co-pilot
    log_path = os.path.join(r"d:\folder\tools\2d_studio", "user_requests.log")
    latest_path = os.path.join(r"d:\folder\tools\2d_studio", "latest_request.json")
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"[{req.category.upper()}] PROMPT: {req.prompt}\n")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump({"category": req.category, "prompt": req.prompt, "has_mask": False}, f, ensure_ascii=False, indent=2)

    # Procedurally synthesize matching spritesheet image for immediate load
    w, h = 1024, 512
    sheet = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(sheet)

    p_lower = req.prompt.lower()
    cols, rows = 4, 2
    cw, rh = w // cols, h // rows

    if req.category == "ui" or "nút" in p_lower or "button" in p_lower:
        # Generate 4 distinct UI buttons (Normal, Hover, Pressed, Disabled)
        labels = ["START GAME", "RESUME", "SKILL A", "SETTINGS", "RETRY", "INVENTORY", "ATTACK", "EXIT"]
        for idx in range(8):
            r, c = idx // 4, idx % 4
            bx, by = c * cw + 20, r * rh + 20
            bw, bh = cw - 40, rh - 40
            
            color = (0, 240, 255) if idx % 2 == 0 else (255, 0, 128)
            d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=12, fill=(20, 26, 40, 255), outline=color, width=4)
            d.rounded_rectangle([bx + 4, by + 4, bx + bw - 4, by + 12], radius=4, fill=(color[0], color[1], color[2], 120))
            d.text((bx + bw // 4, by + bh // 3), labels[idx], fill=(255, 255, 255, 255))
            
    elif req.category == "items" or "vật phẩm" in p_lower or "kiếm" in p_lower or "potion" in p_lower:
        # Generate 8 distinct items
        for idx in range(8):
            r, c = idx // 4, idx % 4
            cx, cy = c * cw + cw // 2, r * rh + rh // 2
            
            if idx == 0: # Flaming Katana
                d.line([(cx - 40, cy + 40), (cx + 40, cy - 40)], fill=(0, 240, 255, 255), width=8)
                d.ellipse([cx - 44, cy + 36, cx - 36, cy + 44], fill=(255, 215, 0, 255))
            elif idx == 1: # Health Potion
                d.rounded_rectangle([cx - 24, cy - 30, cx + 24, cy + 30], radius=8, fill=(255, 40, 60, 220), outline=(255, 255, 255, 255), width=3)
            elif idx == 2: # Mana Crystal
                d.polygon([(cx, cy - 40), (cx + 30, cy), (cx, cy + 40), (cx - 30, cy)], fill=(0, 240, 255, 220), outline=(255, 255, 255, 255))
            else: # Gold Coin / Chest / Shield
                d.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=(255, 215, 0, 255), outline=(180, 140, 0, 255), width=4)

    else:
        # Character 8-frame combat sequence
        for idx in range(8):
            r, c = idx // 4, idx % 4
            cx, cy = c * cw + cw // 2, r * rh + rh // 2
            # Body & Legs
            d.rectangle([cx - 15, cy - 30, cx + 15, cy + 30], fill=(24, 28, 42, 255), outline=(0, 240, 255, 255), width=2)
            d.ellipse([cx - 14, cy - 60, cx + 14, cy - 32], fill=(255, 220, 200, 255))
            # Katana Slash arc
            start_ang = (idx * 40) % 360
            d.arc([cx - 70, cy - 70, cx + 70, cy + 70], start=start_ang, end=start_ang + 120, fill=(0, 240, 255, 255), width=8)

    b64 = image_to_base64(sheet)
    return {"success": True, "image": b64}

# =========================================================================
# AI INPAINT & CANVAS REFINEMENT
# =========================================================================
class InpaintReq(BaseModel):
    prompt: str
    image: str
    mask: Optional[str] = None

@app.post("/api/ai/inpaint")
async def inpaint_canvas(req: InpaintReq):
    try:
        img = base64_to_image(req.image)
        mask = base64_to_image(req.mask) if req.mask else None
        p_lower = req.prompt.lower()

        # Check if user requested to add new frame
        if any(k in p_lower for k in ["thêm frame", "add frame", "tạo frame", "tiếp theo"]):
            next_f = img.copy()
            d = ImageDraw.Draw(next_f)
            d.arc([20, 20, 236, 236], start=160, end=340, fill=(0, 240, 255, 255), width=16)
            d.arc([30, 30, 226, 226], start=170, end=330, fill=(255, 255, 255, 255), width=6)
            b64 = image_to_base64(next_f)
            await broadcast_ws({"type": "ADD_FRAME", "imageData": b64})
            return {"success": True, "type": "ADD_FRAME", "image": b64}

        # Apply inpaint modification
        result = img.copy()
        draw = ImageDraw.Draw(result)

        if mask:
            # Mask bounding
            m_data = mask.getdata()
            pts = []
            for y in range(img.height):
                for x in range(img.width):
                    if m_data[y * img.width + x][3] > 30:
                        pts.append((x, y))
            if pts:
                min_x, max_x = min(p[0] for p in pts), max(p[0] for p in pts)
                min_y, max_y = min(p[1] for p in pts), max(p[1] for p in pts)
                cx, cy = (min_x + max_x) // 2, (min_y + max_y) // 2

                if any(k in p_lower for k in ["cánh", "wing"]):
                    draw.polygon([(cx, cy), (min_x - 30, min_y - 20), (min_x - 40, cy + 20)], fill=(255, 0, 128, 220), outline=(0, 240, 255, 255))
                    draw.polygon([(cx, cy), (max_x + 30, min_y - 20), (max_x + 40, cy + 20)], fill=(255, 0, 128, 220), outline=(0, 240, 255, 255))
                elif any(k in p_lower for k in ["kiếm", "sword", "blade"]):
                    draw.line([(min_x, max_y), (max_x, min_y)], fill=(0, 240, 255, 255), width=10)
                    draw.line([(min_x + 2, max_y - 2), (max_x - 2, min_y + 2)], fill=(255, 255, 255, 255), width=4)
                elif any(k in p_lower for k in ["vàng", "gold"]):
                    for px, py in pts: draw.point((px, py), fill=(255, 215, 0, 255))
                elif any(k in p_lower for k in ["đỏ", "red"]):
                    for px, py in pts: draw.point((px, py), fill=(255, 40, 60, 255))
                else:
                    for px, py in pts: draw.point((px, py), fill=(0, 240, 255, 255))

        b64 = image_to_base64(result)
        await broadcast_ws({"type": "APPLY_FRAME", "imageData": b64})
        return {"success": True, "type": "APPLY_FRAME", "image": b64}
    except Exception as e:
        return {"success": False, "error": str(e)}

# =========================================================================
# BROADCAST CUSTOM FRAME
# =========================================================================
class BroadcastReq(BaseModel):
    type: str = "APPLY_FRAME"
    imageData: Optional[str] = None
    clips: Optional[dict] = None

@app.post("/api/ai/broadcast_frame")
async def broadcast_frame(req: BroadcastReq):
    payload = {"type": req.type}
    if req.imageData:
        payload["imageData"] = req.imageData
    if req.clips:
        payload["clips"] = req.clips
    await broadcast_ws(payload)
    return {"success": True}

# =========================================================================
# GODOT 2D EXPORT
# =========================================================================
class FullCharacterSyncReq(BaseModel):
    character_name: str
    clips: Dict[str, List[str]]

@app.post("/api/godot/sync_full_character")
async def sync_godot(req: FullCharacterSyncReq):
    c_name = req.character_name.lower().replace(" ", "_")
    char_dir = os.path.join(GODOT_SPRITES_DIR, "characters", c_name)
    os.makedirs(char_dir, exist_ok=True)

    tres_path = os.path.join(char_dir, f"{c_name}_frames.tres")
    sections = []
    
    for clip_key, frames_b64 in req.clips.items():
        for idx, b64 in enumerate(frames_b64):
            f_img = base64_to_image(b64)
            f_path = os.path.join(char_dir, f"{clip_key}_{idx}.png")
            f_img.save(f_path)
            
        loop = "true" if clip_key in ["idle", "run"] else "false"
        speed = 10.0 if clip_key in ["attack", "run"] else 6.0
        sections.append(f"""{{
"frames": [],
"loop": {loop},
"name": &"{clip_key}",
"speed": {speed}
}}""")

    content = f"""[gd_resource type="SpriteFrames" format=3]

[resource]
animations = [{','.join(sections)}]
"""
    with open(tres_path, "w", encoding="utf-8") as f:
        f.write(content)

    return {"status": "ok", "path": tres_path}

# Mount static frontend
app.mount("/", StaticFiles(directory=r"d:\folder\tools\2d_studio", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)
