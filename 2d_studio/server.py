import os
import io
import json
import base64
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, ImageDraw

app = FastAPI(title="2D Game Studio & Spritesheet Slicer Pro")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STUDIO_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_LIB_DIR = os.path.join(STUDIO_DIR, "assets_library")
WORKSPACE_DIR = os.path.join(STUDIO_DIR, "workspace")
GODOT_SPRITES_DIR = r"d:\folder\tools\godot_demo\2\assets\sprites"

os.makedirs(ASSETS_LIB_DIR, exist_ok=True)
os.makedirs(WORKSPACE_DIR, exist_ok=True)
for cat in ["raw_sheets", "characters", "environments", "items", "ui", "fx"]:
    os.makedirs(os.path.join(ASSETS_LIB_DIR, cat), exist_ok=True)

app.mount("/assets_library", StaticFiles(directory=ASSETS_LIB_DIR), name="assets_library")
app.mount("/workspace", StaticFiles(directory=WORKSPACE_DIR), name="workspace")

# =========================================================================
# WEBSOCKET CONNECTION POOL
# =========================================================================
active_connections: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "PING":
                    await websocket.send_text(json.dumps({"type": "PONG"}))
            except Exception:
                pass
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)

async def broadcast_ws(msg: dict):
    for ws in list(active_connections):
        try:
            await ws.send_text(json.dumps(msg))
        except Exception:
            if ws in active_connections:
                active_connections.remove(ws)

# =========================================================================
# HELPER FUNCTIONS
# =========================================================================
def base64_to_image(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    data = base64.b64decode(b64_str)
    return Image.open(io.BytesIO(data)).convert("RGBA")

def image_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

# =========================================================================
# ASSET LIBRARY CATALOG
# =========================================================================
@app.get("/api/library/assets")
async def get_library_assets():
    catalog: Dict[str, List[dict]] = {
        "all": [],
        "raw_sheets": [],
        "characters": [],
        "environments": [],
        "items": [],
        "ui": [],
        "fx": []
    }
    
    for cat in ["raw_sheets", "characters", "environments", "items", "ui", "fx"]:
        cat_dir = os.path.join(ASSETS_LIB_DIR, cat)
        if not os.path.exists(cat_dir):
            continue
            
        for item_id in os.listdir(cat_dir):
            item_path = os.path.join(cat_dir, item_id)
            if not os.path.isdir(item_path):
                continue
                
            meta_file = os.path.join(item_path, "meta.json")
            meta = {}
            if os.path.exists(meta_file):
                try:
                    with open(meta_file, "r", encoding="utf-8") as f:
                        meta = json.load(f)
                except Exception:
                    pass
            
            thumb_url = f"/assets_library/{cat}/{item_id}/thumb.png"
            sheet_url = f"/assets_library/{cat}/{item_id}/spritesheet.png"
            if not os.path.exists(os.path.join(item_path, "thumb.png")) and os.path.exists(os.path.join(item_path, "spritesheet.png")):
                thumb_url = sheet_url

            item_obj = {
                "id": item_id,
                "name": meta.get("name", item_id.replace("_", " ").title()),
                "category": cat,
                "thumb_url": thumb_url,
                "sheet_url": sheet_url if os.path.exists(os.path.join(item_path, "spritesheet.png")) else thumb_url,
                "description": meta.get("description", ""),
                "created_at": meta.get("created_at", "")
            }
            catalog[cat].append(item_obj)
            catalog["all"].append(item_obj)
            
    return {"catalog": catalog}

# =========================================================================
# AI GENERATE FULL ASSET / SPRITESHEET
# =========================================================================
class GenerateAssetReq(BaseModel):
    category: str
    prompt: str

@app.post("/api/ai/generate_full_asset")
async def generate_full_asset(req: GenerateAssetReq):
    # Log prompt for AI assistant
    log_path = os.path.join(STUDIO_DIR, "user_requests.log")
    latest_path = os.path.join(STUDIO_DIR, "latest_request.json")
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"[{req.category.upper()}] PROMPT: {req.prompt}\n")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump({
            "category": req.category, 
            "prompt": req.prompt, 
            "has_mask": False,
            "timestamp": datetime.now().isoformat()
        }, f, ensure_ascii=False, indent=2)

    # Save request asset placeholder into Library raw_sheets
    asset_id = f"ai_{req.category}_{int(datetime.now().timestamp())}"
    asset_dir = os.path.join(ASSETS_LIB_DIR, "raw_sheets", asset_id)
    os.makedirs(asset_dir, exist_ok=True)
    
    with open(os.path.join(asset_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump({
            "name": f"AI: {req.prompt[:30]}",
            "category": req.category,
            "description": req.prompt,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }, f, ensure_ascii=False, indent=2)

    return {
        "status": "QUEUED",
        "message": f"Đã gửi yêu cầu tạo [{req.category.upper()}]: '{req.prompt}' đến AI Co-Pilot!",
        "asset_id": asset_id
    }

# =========================================================================
# SAVE PROCESSED ASSET INTO LIBRARY
# =========================================================================
class SaveProcessedAssetReq(BaseModel):
    name: str
    category: str
    frames: List[str]
    sheet_image: Optional[str] = None
    fps: int = 10

@app.post("/api/library/save_processed")
async def save_processed_asset(req: SaveProcessedAssetReq):
    clean_name = req.name.lower().replace(" ", "_").strip() or "custom_asset"
    target_dir = os.path.join(ASSETS_LIB_DIR, req.category, clean_name)
    os.makedirs(target_dir, exist_ok=True)

    # Save frames
    for idx, b64 in enumerate(req.frames):
        img = base64_to_image(b64)
        img.save(os.path.join(target_dir, f"frame_{idx}.png"))
        if idx == 0:
            thumb = img.resize((128, 128), Image.Resampling.NEAREST)
            thumb.save(os.path.join(target_dir, "thumb.png"))

    if req.sheet_image:
        sheet = base64_to_image(req.sheet_image)
        sheet.save(os.path.join(target_dir, "spritesheet.png"))

    # Save metadata
    meta = {
        "name": req.name,
        "category": req.category,
        "frames_count": len(req.frames),
        "fps": req.fps,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(os.path.join(target_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    return {"status": "ok", "path": target_dir}

# =========================================================================
# BROADCAST CUSTOM FRAME / SPRITESHEET (FROM AI ASSISTANT)
# =========================================================================
class BroadcastReq(BaseModel):
    type: str = "APPLY_FRAME"
    imageData: Optional[str] = None
    clips: Optional[dict] = None
    save_to_library: bool = True
    category: str = "raw_sheets"
    asset_name: str = "ai_spritesheet"

@app.post("/api/ai/broadcast_frame")
async def broadcast_frame(req: BroadcastReq):
    if req.save_to_library and req.imageData:
        try:
            asset_id = f"{req.asset_name}_{int(datetime.now().timestamp())}"
            target_dir = os.path.join(ASSETS_LIB_DIR, req.category, asset_id)
            os.makedirs(target_dir, exist_ok=True)
            img = base64_to_image(req.imageData)
            img.save(os.path.join(target_dir, "spritesheet.png"))
            thumb = img.resize((160, int(160 * img.height / img.width)), Image.Resampling.NEAREST)
            thumb.save(os.path.join(target_dir, "thumb.png"))
            with open(os.path.join(target_dir, "meta.json"), "w", encoding="utf-8") as f:
                json.dump({
                    "name": req.asset_name.replace("_", " ").title(),
                    "category": req.category,
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print("Error auto-saving to library:", e)

    payload = {"type": req.type}
    if req.imageData:
        payload["imageData"] = req.imageData
    if req.clips:
        payload["clips"] = req.clips
    await broadcast_ws(payload)
    return {"success": True}

# =========================================================================
# GODOT 2D EXPORT & SYNC
# =========================================================================
class FullCharacterSyncReq(BaseModel):
    character_name: str
    clips: Dict[str, List[str]]

@app.post("/api/godot/sync_full_character")
async def sync_godot(req: FullCharacterSyncReq):
    c_name = req.character_name.lower().replace(" ", "_")
    
    # 1. Save to Godot Game Project
    char_dir = os.path.join(GODOT_SPRITES_DIR, "characters", c_name)
    os.makedirs(char_dir, exist_ok=True)

    # 2. Also Save to Studio Asset Library
    lib_char_dir = os.path.join(ASSETS_LIB_DIR, "characters", c_name)
    os.makedirs(lib_char_dir, exist_ok=True)

    sections = []
    first_thumb_saved = False
    
    for clip_key, frames_b64 in req.clips.items():
        for idx, b64 in enumerate(frames_b64):
            f_img = base64_to_image(b64)
            f_path = os.path.join(char_dir, f"{clip_key}_{idx}.png")
            f_img.save(f_path)
            f_img.save(os.path.join(lib_char_dir, f"{clip_key}_{idx}.png"))
            
            if not first_thumb_saved:
                thumb = f_img.resize((128, 128), Image.Resampling.NEAREST)
                thumb.save(os.path.join(lib_char_dir, "thumb.png"))
                first_thumb_saved = True
            
        loop = "true" if clip_key in ["idle", "run"] else "false"
        speed = 10.0 if clip_key in ["attack", "run"] else 6.0
        sections.append(f"""{{
"frames": [],
"loop": {loop},
"name": &"{clip_key}",
"speed": {speed}
}}""")

    tres_content = f"""[gd_resource type="SpriteFrames" format=3]

[resource]
animations = [{", ".join(sections)}]
"""
    with open(os.path.join(char_dir, f"{c_name}_frames.tres"), "w", encoding="utf-8") as f:
        f.write(tres_content)
    with open(os.path.join(lib_char_dir, f"{c_name}_frames.tres"), "w", encoding="utf-8") as f:
        f.write(tres_content)

    meta = {
        "name": req.character_name,
        "category": "characters",
        "clips": list(req.clips.keys()),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(os.path.join(lib_char_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    return {"status": "ok", "godot_dir": char_dir, "library_dir": lib_char_dir}

# =========================================================================
# STATIC CLIENT
# =========================================================================
app.mount("/", StaticFiles(directory=STUDIO_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)
