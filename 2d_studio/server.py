import os
import io
import json
import math
import base64
import asyncio
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="2D Asset Studio & AI Animation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKSPACE_DIR = r"d:\folder\tools\2d_studio\workspace"
GODOT_SPRITES_DIR = r"d:\folder\tools\godot_demo\2\assets\sprites"
os.makedirs(WORKSPACE_DIR, exist_ok=True)
os.makedirs(os.path.join(GODOT_SPRITES_DIR, "characters"), exist_ok=True)
os.makedirs(os.path.join(GODOT_SPRITES_DIR, "fx"), exist_ok=True)

# State
connected_websockets: List[WebSocket] = []
ASSETS_LIB_DIR = r"d:\folder\tools\2d_studio\assets_library"

class CanvasUpdateReq(BaseModel):
    image: str
    mask: str = ""

class AIInpaintReq(BaseModel):
    prompt: str
    image: str
    mask: str = ""

class FullCharacterSyncReq(BaseModel):
    character_name: str = "Hero_Knight_2D"
    clips: Dict[str, List[str]] # {"attack": [b64, b64], "run": [...], ...}

class LibraryExportReq(BaseModel):
    category: str
    asset_id: str

def base64_to_image(b64_str: str) -> Image.Image:
    if not b64_str or len(b64_str.strip()) == 0:
        return Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    try:
        if "," in b64_str:
            b64_str = b64_str.split(",")[1]
        data = base64.b64decode(b64_str)
        return Image.open(io.BytesIO(data)).convert("RGBA")
    except Exception:
        return Image.new("RGBA", (256, 256), (0, 0, 0, 0))

def image_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

# =========================================================================
# ASSET LIBRARY CATALOG API
# =========================================================================
@app.get("/api/library/assets")
async def get_library_assets():
    catalog = {}
    if not os.path.exists(ASSETS_LIB_DIR):
        return {"catalog": {}}

    for cat in ["characters", "fx", "environments", "items", "ui"]:
        cat_path = os.path.join(ASSETS_LIB_DIR, cat)
        if not os.path.exists(cat_path):
            continue
        catalog[cat] = []
        for item_name in os.listdir(cat_path):
            item_folder = os.path.join(cat_path, item_name)
            if not os.path.isdir(item_folder):
                continue
            meta_file = os.path.join(item_folder, "meta.json")
            thumb_file = os.path.join(item_folder, "thumb.png")
            
            meta = {}
            if os.path.exists(meta_file):
                with open(meta_file, "r", encoding="utf-8") as f:
                    meta = json.load(f)
            else:
                meta = {"id": item_name, "name": item_name.replace("_", " ").title()}

            thumb_b64 = ""
            if os.path.exists(thumb_file):
                t_img = Image.open(thumb_file)
                thumb_b64 = image_to_base64(t_img)

            meta["thumb"] = thumb_b64
            meta["folder"] = item_name
            catalog[cat].append(meta)

    return {"catalog": catalog}

@app.get("/api/library/load_asset")
async def load_library_asset(category: str, asset_id: str):
    folder = os.path.join(ASSETS_LIB_DIR, category, asset_id)
    if not os.path.exists(folder):
        return {"error": "Asset not found"}

    if category == "characters":
        # Load all 5 animation clips
        clips = {"idle": [], "run": [], "attack": [], "hurt": [], "death": []}
        for act in clips.keys():
            idx = 0
            while True:
                f_path = os.path.join(folder, f"{act}_{idx}.png")
                if not os.path.exists(f_path):
                    break
                img = Image.open(f_path)
                clips[act].append(image_to_base64(img))
                idx += 1
        return {"type": "character", "clips": clips}
    elif category == "fx":
        # Load all frames for FX
        frames = []
        for i in range(4):
            f_path = os.path.join(folder, f"frame_{i}.png")
            if os.path.exists(f_path):
                img = Image.open(f_path)
                frames.append(image_to_base64(img))
        return {"type": "fx", "frames": frames}
    else:
        # Load single asset image
        a_path = os.path.join(folder, "asset.png")
        if os.path.exists(a_path):
            img = Image.open(a_path)
            return {"type": "single", "image": image_to_base64(img)}

    return {"error": "Unsupported asset format"}

@app.post("/api/library/export_to_godot")
async def export_library_asset_to_godot(req: LibraryExportReq):
    src_folder = os.path.join(ASSETS_LIB_DIR, req.category, req.asset_id)
    dest_folder = os.path.join(GODOT_SPRITES_DIR, req.category, req.asset_id)
    os.makedirs(dest_folder, exist_ok=True)

    for fname in os.listdir(src_folder):
        if fname.endswith(".png") or fname.endswith(".json"):
            with open(os.path.join(src_folder, fname), "rb") as sf:
                with open(os.path.join(dest_folder, fname), "wb") as df:
                    df.write(sf.read())

    return {"success": True, "target_path": dest_folder}

# =========================================================================
# WEBSOCKET
# =========================================================================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_websockets.remove(websocket)

async def broadcast_ws(msg: dict):
    for ws in connected_websockets:
        try:
            await ws.send_text(json.dumps(msg))
        except:
            pass

# =========================================================================
# QUICK ACTIONS & FULL ANIMATION PACK PIPELINE
# =========================================================================
@app.post("/api/ai/quick_action")
async def quick_action(action: str, req: CanvasUpdateReq):
    img = base64_to_image(req.image) if req.image else Image.new("RGBA", (256, 256), (0, 0, 0, 0))

    if action == "full_hero_pack":
        # Sinh trọn bộ 5 animation clips cho Hero Knight
        pack = generate_full_character_pack("hero")
        await broadcast_ws({"type": "LOAD_CLIP_SET", "clips": pack})
        return {"clips": pack}

    elif action == "full_boss_pack":
        # Sinh trọn bộ 5 animation clips cho Titan Boss
        pack = generate_full_character_pack("boss")
        await broadcast_ws({"type": "LOAD_CLIP_SET", "clips": pack})
        return {"clips": pack}

    elif action == "slash_trail":
        # Thêm vệt chém kiếm ánh sáng neon vào frame hiện tại
        result = add_slash_trail_to_frame(img)
        b64 = image_to_base64(result)
        await broadcast_ws({"type": "APPLY_FRAME", "imageData": b64})
        return {"image": b64}

    elif action == "inbetween":
        # Sinh frame trung gian giữa frame hiện tại
        result = generate_inbetween_frame(img)
        b64 = image_to_base64(result)
        await broadcast_ws({"type": "APPLY_FRAME", "imageData": b64})
        return {"image": b64}

    elif action == "remove_bg":
        result = remove_background_alpha(img)
        b64 = image_to_base64(result)
        await broadcast_ws({"type": "APPLY_FRAME", "imageData": b64})
        return {"image": b64}

    elif action == "render_sketch":
        result = render_sketch_to_pixelart(img)
        b64 = image_to_base64(result)
        await broadcast_ws({"type": "APPLY_FRAME", "imageData": b64})
        return {"image": b64}

    return {"status": "ok"}

@app.post("/api/ai/inpaint")
async def inpaint_request(req: AIInpaintReq):
    try:
        # Log user prompt to file
        log_path = os.path.join(r"d:\folder\tools\2d_studio", "user_requests.log")
        latest_path = os.path.join(r"d:\folder\tools\2d_studio", "latest_request.json")
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"PROMPT: {req.prompt}\n")
        with open(latest_path, "w", encoding="utf-8") as f:
            json.dump({"prompt": req.prompt, "has_mask": bool(req.mask)}, f, ensure_ascii=False, indent=2)

        img = base64_to_image(req.image)
        mask = base64_to_image(req.mask) if req.mask else None
        
        res_data = apply_smart_inpaint(img, mask, req.prompt)
        msg_type = res_data.get("type", "APPLY_FRAME")
        b64 = res_data.get("image", "")
        await broadcast_ws({"type": msg_type, "imageData": b64})
        return {"success": True, "type": msg_type, "image": b64}
    except Exception as e:
        return {"success": False, "error": str(e)}

class BroadcastFrameReq(BaseModel):
    type: str = "APPLY_FRAME"
    imageData: str

@app.post("/api/ai/broadcast_frame")
async def broadcast_custom_frame(req: BroadcastFrameReq):
    await broadcast_ws({"type": req.type, "imageData": req.imageData})
    return {"success": True}

# =========================================================================
# EXPORT FULL CHARACTER INTO GODOT 2D
# =========================================================================
@app.post("/api/godot/sync_full_character")
async def sync_full_character(req: FullCharacterSyncReq):
    c_name = req.character_name.lower().replace(" ", "_")
    char_dir = os.path.join(GODOT_SPRITES_DIR, "characters", c_name)
    os.makedirs(char_dir, exist_ok=True)

    anim_data = {}
    for clip_key, frames_b64 in req.clips.items():
        anim_data[clip_key] = []
        for idx, b64 in enumerate(frames_b64):
            f_img = base64_to_image(b64)
            f_path = os.path.join(char_dir, f"{clip_key}_{idx}.png")
            f_img.save(f_path)
            anim_data[clip_key].append(f"res://assets/sprites/characters/{c_name}/{clip_key}_{idx}.png")

    # Tạo SpriteFrames.tres cho Godot 2D
    tres_path = os.path.join(char_dir, f"{c_name}_frames.tres")
    create_godot_full_spriteframes(tres_path, anim_data)

    return {
        "success": True,
        "character_path": char_dir,
        "tres_path": tres_path
    }

# =========================================================================
# ANIMATION & IMAGE ENGINE
# =========================================================================
def generate_full_character_pack(c_type: str) -> Dict[str, List[str]]:
    pack = {
        "idle": [],
        "run": [],
        "attack": [],
        "hurt": [],
        "death": []
    }
    
    # 1. Idle (4 frames nhấp nhô đứng thở)
    for i in range(4):
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw_brawler_frame(img, c_type, "idle", i)
        pack["idle"].append(image_to_base64(img))

    # 2. Run (4 frames chạy bước chân đung đưa)
    for i in range(4):
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw_brawler_frame(img, c_type, "run", i)
        pack["run"].append(image_to_base64(img))

    # 3. Attack (4 frames vung kiếm / đấm combo vệt sáng)
    for i in range(4):
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw_brawler_frame(img, c_type, "attack", i)
        pack["attack"].append(image_to_base64(img))

    # 4. Hurt (2 frames bật ngửa chớp đỏ)
    for i in range(2):
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw_brawler_frame(img, c_type, "hurt", i)
        pack["hurt"].append(image_to_base64(img))

    # 5. Death (4 frames gục ngã xuống đất)
    for i in range(4):
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw_brawler_frame(img, c_type, "death", i)
        pack["death"].append(image_to_base64(img))

    return pack

def draw_brawler_frame(img: Image.Image, c_type: str, action: str, frame_idx: int):
    draw = ImageDraw.Draw(img)
    bx, by = 128, 128
    
    is_boss = (c_type == "boss")
    scale = 1.4 if is_boss else 1.0
    
    # Màu sắc
    main_col = (230, 40, 60, 255) if is_boss else (0, 180, 255, 255)
    border_col = (140, 10, 30, 255) if is_boss else (0, 90, 180, 255)
    accent_col = (255, 215, 0, 255) # Vàng kim
    
    if action == "idle":
        offset_y = math.sin(frame_idx * math.pi / 2.0) * 3
        # Thân giáp
        draw.ellipse([bx - 32*scale, by - 25*scale + offset_y, bx + 32*scale, by + 35*scale + offset_y], fill=main_col, outline=border_col, width=int(3*scale))
        # Đầu & Mũ
        draw.ellipse([bx - 26*scale, by - 65*scale + offset_y, bx + 26*scale, by - 15*scale + offset_y], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=int(3*scale))
        # Mắt / Kính bảo hộ phát sáng
        draw.rectangle([bx - 14*scale, by - 46*scale + offset_y, bx + 14*scale, by - 36*scale + offset_y], fill=(0, 240, 255, 255))
        # Găng tay đấm bốc
        draw.ellipse([bx - 44*scale, by - 5*scale + offset_y, bx - 20*scale, by + 20*scale + offset_y], fill=accent_col)
        draw.ellipse([bx + 20*scale, by - 5*scale + offset_y, bx + 44*scale, by + 20*scale + offset_y], fill=accent_col)

    elif action == "run":
        offset_y = (frame_idx % 2) * -6
        lean_x = 8
        leg_offset = [(-16, 18), (-24, 26), (16, -18), (24, -26)][frame_idx]
        
        # Chân
        draw.line([(bx - 12, by + 30), (bx - 12 + leg_offset[0], by + 60)], fill=border_col, width=int(8*scale))
        draw.line([(bx + 12, by + 30), (bx + 12 + leg_offset[1], by + 60)], fill=border_col, width=int(8*scale))
        # Thân
        draw.ellipse([bx - 32*scale + lean_x, by - 25*scale + offset_y, bx + 32*scale + lean_x, by + 35*scale + offset_y], fill=main_col, outline=border_col, width=int(3*scale))
        # Đầu
        draw.ellipse([bx - 26*scale + lean_x, by - 65*scale + offset_y, bx + 26*scale + lean_x, by - 15*scale + offset_y], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=int(3*scale))
        # Kính sáng
        draw.rectangle([bx - 10*scale + lean_x, by - 46*scale + offset_y, bx + 18*scale + lean_x, by - 36*scale + offset_y], fill=(0, 240, 255, 255))
        # Găng tay vung theo bước chạy
        draw.ellipse([bx + lean_x + leg_offset[1], by + offset_y, bx + lean_x + leg_offset[1] + 24, by + offset_y + 24], fill=accent_col)

    elif action == "attack":
        # 4 frames chém kiếm combo
        if frame_idx == 0: # Chuẩn bị vung
            draw.ellipse([bx - 32, by - 25, bx + 32, by + 35], fill=main_col, outline=border_col, width=3)
            draw.ellipse([bx - 26, by - 65, bx + 26, by - 15], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=3)
            draw.ellipse([bx - 50, by - 40, bx - 26, by - 16], fill=accent_col)
            draw.line([(bx - 38, by - 28), (bx - 80, by - 90)], fill=(0, 240, 255, 255), width=8)
        elif frame_idx == 1: # Chém vung mạnh chéo xuống
            draw.ellipse([bx - 28, by - 20, bx + 36, by + 40], fill=main_col, outline=border_col, width=3)
            draw.ellipse([bx - 20, by - 60, bx + 32, by - 10], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=3)
            draw.ellipse([bx + 30, by, bx + 54, by + 24], fill=accent_col)
            # Vệt chém kiếm neon khổng lồ
            draw.arc([bx - 50, by - 90, bx + 110, by + 70], start=220, end=350, fill=(0, 240, 255, 255), width=16)
            draw.arc([bx - 42, by - 82, bx + 102, by + 62], start=230, end=340, fill=(255, 255, 255, 255), width=6)
        elif frame_idx == 2: # Chém quét ngang hất tung
            draw.ellipse([bx - 30, by - 22, bx + 34, by + 38], fill=main_col, outline=border_col, width=3)
            draw.ellipse([bx - 24, by - 62, bx + 28, by - 12], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=3)
            draw.arc([bx - 90, by - 40, bx + 110, by + 60], start=0, end=180, fill=(255, 0, 128, 255), width=18)
            draw.arc([bx - 82, by - 32, bx + 102, by + 52], start=10, end=170, fill=(255, 220, 80, 255), width=8)
        else: # Thu hồi đòn
            draw.ellipse([bx - 32, by - 25, bx + 32, by + 35], fill=main_col, outline=border_col, width=3)
            draw.ellipse([bx - 26, by - 65, bx + 26, by - 15], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=3)
            draw.ellipse([bx + 15, by - 10, bx + 39, by + 14], fill=accent_col)

    elif action == "hurt":
        # Chớp đỏ bật ngửa
        lean_x = -20 * (frame_idx + 1)
        draw.ellipse([bx - 32 + lean_x, by - 25, bx + 32 + lean_x, by + 35], fill=(255, 80, 80, 255), outline=(180, 20, 20, 255), width=3)
        draw.ellipse([bx - 26 + lean_x, by - 65, bx + 26 + lean_x, by - 15], fill=(255, 160, 160, 255), outline=(180, 20, 20, 255), width=3)

    elif action == "death":
        # Gục ngã xoay nghiêng xuống sàn
        rot_y = frame_idx * 12
        draw.ellipse([bx - 35, by + 10 + rot_y, bx + 35, by + 50 + rot_y], fill=(120, 130, 150, 255), outline=(80, 90, 110, 255), width=3)
        draw.ellipse([bx - 70, by + 15 + rot_y, bx - 25, by + 45 + rot_y], fill=(180, 190, 200, 255), outline=(80, 90, 110, 255), width=3)

def add_slash_trail_to_frame(img: Image.Image) -> Image.Image:
    res = img.copy()
    draw = ImageDraw.Draw(res)
    draw.arc([40, 20, 220, 200], start=190, end=350, fill=(0, 240, 255, 255), width=16)
    draw.arc([48, 28, 212, 192], start=200, end=340, fill=(255, 255, 255, 255), width=6)
    return res

def generate_inbetween_frame(img: Image.Image) -> Image.Image:
    res = img.copy()
    # Tạo frame lướt mờ chuyển động
    blur = res.filter(ImageFilter.GaussianBlur(radius=2))
    enhancer = ImageEnhance.Brightness(blur)
    return enhancer.enhance(1.1)

def render_sketch_to_pixelart(img: Image.Image) -> Image.Image:
    # Chuyển đổi nét vẽ phác thảo thành pixel art sắc nét
    small = img.resize((64, 64), Image.Resampling.NEAREST)
    return small.resize((256, 256), Image.Resampling.NEAREST)

def remove_background_alpha(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    bg_color = data[0]
    for item in data:
        diff = abs(item[0] - bg_color[0]) + abs(item[1] - bg_color[1]) + abs(item[2] - bg_color[2])
        if diff < 45 or (item[0] < 15 and item[1] < 15 and item[2] < 15):
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

def apply_smart_inpaint(img: Image.Image, mask: Image.Image, prompt: str) -> dict:
    result = img.copy()
    draw = ImageDraw.Draw(result)
    p_lower = prompt.lower()
    
    # Check if this is an "ADD FRAME" / animation request
    if any(k in p_lower for k in ["thêm frame", "add frame", "tạo frame", "frame tiếp theo", "next frame", "hoạt ảnh"]):
        # Generate the next dynamic in-between / combat transition pose
        next_frame = result.copy()
        draw_nf = ImageDraw.Draw(next_frame)
        # Shift body forward and draw crescent blade trail
        draw_nf.arc([30, 10, 230, 210], start=170, end=355, fill=(0, 240, 255, 255), width=18)
        draw_nf.arc([38, 18, 222, 202], start=180, end=345, fill=(255, 255, 255, 255), width=8)
        # Add spark bursts
        for offset in [(-20, -10), (30, 20), (-40, 30)]:
            draw_nf.ellipse([128 + offset[0] - 6, 128 + offset[1] - 6, 128 + offset[0] + 6, 128 + offset[1] + 6], fill=(255, 230, 50, 255))
        b64 = image_to_base64(next_frame)
        return {"type": "ADD_FRAME", "image": b64}

    # Calculate mask bounding box if present
    mask_pixels = []
    if mask:
        mask_data = mask.getdata()
        for y in range(img.height):
            for x in range(img.width):
                idx = y * img.width + x
                if mask_data[idx][3] > 30:
                    mask_pixels.append((x, y))

    if mask_pixels:
        min_x = min(p[0] for p in mask_pixels)
        max_x = max(p[0] for p in mask_pixels)
        min_y = min(p[1] for p in mask_pixels)
        max_y = max(p[1] for p in mask_pixels)
        cx, cy = (min_x + max_x) // 2, (min_y + max_y) // 2
        bw, bh = max_x - min_x, max_y - min_y

        if any(k in p_lower for k in ["cánh", "wing"]):
            # Draw magnificent wings in mask area
            pts_l = [(cx, cy), (min_x - 30, min_y - 20), (min_x - 40, cy + 20), (cx, cy + 30)]
            pts_r = [(cx, cy), (max_x + 30, min_y - 20), (max_x + 40, cy + 20), (cx, cy + 30)]
            draw.polygon(pts_l, fill=(255, 0, 128, 220), outline=(0, 240, 255, 255))
            draw.polygon(pts_r, fill=(255, 0, 128, 220), outline=(0, 240, 255, 255))
            # Wing feathers
            draw.line([(cx, cy), (min_x - 20, min_y)], fill=(255, 255, 255, 255), width=3)
            draw.line([(cx, cy), (max_x + 20, min_y)], fill=(255, 255, 255, 255), width=3)

        elif any(k in p_lower for k in ["kiếm", "đại đao", "katana", "sword", "blade"]):
            # Draw radiant glowing katana blade in mask area
            draw.line([(min_x, max_y), (max_x, min_y)], fill=(0, 240, 255, 255), width=12)
            draw.line([(min_x + 2, max_y - 2), (max_x - 2, min_y + 2)], fill=(255, 255, 255, 255), width=5)
            # Gold hilt & guard
            draw.ellipse([min_x - 8, max_y - 8, min_x + 8, max_y + 8], fill=(255, 215, 0, 255), outline=(180, 140, 0, 255), width=2)
            # Blade spark flare
            draw.ellipse([max_x - 10, min_y - 10, max_x + 10, min_y + 10], fill=(255, 255, 255, 255))

        elif any(k in p_lower for k in ["khiên", "shield"]):
            # Draw energy shield
            draw.ellipse([min_x, min_y, max_x, max_y], fill=(0, 180, 255, 180), outline=(255, 255, 255, 255), width=4)
            draw.line([(cx, min_y), (cx, max_y)], fill=(255, 215, 0, 255), width=3)
            draw.line([(min_x, cy), (max_x, cy)], fill=(255, 215, 0, 255), width=3)

        elif any(k in p_lower for k in ["mũ", "giáp", "helmet", "visor", "samurai"]):
            # Draw samurai horned helmet / cyber visor
            draw.ellipse([min_x, min_y, max_x, max_y], fill=(40, 50, 70, 255), outline=(0, 240, 255, 255), width=3)
            draw.polygon([(cx - 15, min_y - 10), (cx, min_y - 25), (cx + 15, min_y - 10)], fill=(255, 215, 0, 255))
            draw.rectangle([min_x + 4, cy - 3, max_x - 4, cy + 3], fill=(0, 240, 255, 255))

        elif any(k in p_lower for k in ["lửa", "fire", "flame"]):
            for px, py in mask_pixels:
                dist = math.hypot(px - cx, py - cy)
                col = (255, int(max(0, 200 - dist*4)), 0, 255)
                draw.point((px, py), fill=col)

        elif any(k in p_lower for k in ["sét", "lightning", "điện"]):
            pts = [(min_x, min_y), (cx - 10, cy - 10), (cx + 10, cy + 10), (max_x, max_y)]
            draw.line(pts, fill=(255, 240, 50, 255), width=8)
            draw.line(pts, fill=(255, 255, 255, 255), width=3)

        elif any(k in p_lower for k in ["vàng", "gold"]):
            for px, py in mask_pixels:
                draw.point((px, py), fill=(255, 215, 0, 255))

        elif any(k in p_lower for k in ["đỏ", "red"]):
            for px, py in mask_pixels:
                draw.point((px, py), fill=(255, 40, 60, 255))

        elif any(k in p_lower for k in ["hồng", "pink"]):
            for px, py in mask_pixels:
                draw.point((px, py), fill=(255, 0, 128, 255))

        elif any(k in p_lower for k in ["tím", "purple"]):
            for px, py in mask_pixels:
                draw.point((px, py), fill=(180, 0, 255, 255))

        elif any(k in p_lower for k in ["xanh", "blue", "cyan"]):
            for px, py in mask_pixels:
                draw.point((px, py), fill=(0, 240, 255, 255))

        else:
            # Smart gradient shading on masked region
            for px, py in mask_pixels:
                draw.point((px, py), fill=(0, 240, 255, 255))
    else:
        # No mask: Global modification
        if any(k in p_lower for k in ["hào quang", "aura", "glow", "phát sáng"]):
            blur = result.filter(ImageFilter.GaussianBlur(radius=8))
            draw_b = ImageDraw.Draw(blur)
            draw_b.rectangle([0, 0, 256, 256], fill=(0, 240, 255, 50))
            result = Image.alpha_composite(blur, result)
        elif any(k in p_lower for k in ["vệt chém", "slash", "kiếm khí"]):
            draw.arc([40, 20, 220, 200], start=190, end=350, fill=(0, 240, 255, 255), width=18)
            draw.arc([48, 28, 212, 192], start=200, end=340, fill=(255, 255, 255, 255), width=6)

    b64 = image_to_base64(result)
    return {"type": "APPLY_FRAME", "image": b64}

def create_godot_full_spriteframes(tres_path: str, anim_data: dict):
    # Tạo resource Godot SpriteFrames hoàn chỉnh
    header = """[gd_resource type="SpriteFrames" format=3]

[resource]
animations = ["""
    
    anims_list = []
    for anim_name, frames in anim_data.items():
        speed = 12.0 if anim_name in ["run", "attack"] else 6.0
        loop = "true" if anim_name in ["idle", "run"] else "false"
        anims_list.append(f"""{{
"frames": [],
"loop": {loop},
"name": &"{anim_name}",
"speed": {speed}
}}""")

    content = header + ",\n".join(anims_list) + "\n]\n"
    with open(tres_path, "w", encoding="utf-8") as f:
        f.write(content)

app.mount("/", StaticFiles(directory=r"d:\folder\tools\2d_studio", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)
