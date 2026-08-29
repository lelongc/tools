import os
import io
import json
import base64
import asyncio
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

app = FastAPI(title="2D Asset Studio & AI MCP Server")

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
os.makedirs(GODOT_SPRITES_DIR, exist_ok=True)

# State
current_canvas_img = None
current_mask_img = None
connected_websockets: List[WebSocket] = []

class CanvasUpdateReq(BaseModel):
    image: str
    mask: str = ""

class GodotSyncReq(BaseModel):
    image: str
    name: str = "hero_brawler_2d"
    frame_width: int = 128
    frame_height: int = 128

class AIInpaintReq(BaseModel):
    prompt: str
    image: str
    mask: str = ""

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
# WEBSOCKET & STATE ENDPOINTS
# =========================================================================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connected_websockets.remove(websocket)

async def broadcast_ws(msg: dict):
    for ws in connected_websockets:
        try:
            await ws.send_text(json.dumps(msg))
        except:
            pass

@app.get("/api/canvas")
async def get_canvas():
    global current_canvas_img
    if current_canvas_img is None:
        canvas_path = os.path.join(WORKSPACE_DIR, "current_canvas.png")
        if os.path.exists(canvas_path):
            current_canvas_img = Image.open(canvas_path).convert("RGBA")
        else:
            current_canvas_img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    return {"image": image_to_base64(current_canvas_img)}

@app.post("/api/canvas/update")
async def update_canvas(req: CanvasUpdateReq):
    global current_canvas_img, current_mask_img
    current_canvas_img = base64_to_image(req.image)
    current_canvas_img.save(os.path.join(WORKSPACE_DIR, "current_canvas.png"))
    if req.mask:
        current_mask_img = base64_to_image(req.mask)
        current_mask_img.save(os.path.join(WORKSPACE_DIR, "current_mask.png"))
    return {"status": "ok"}

# =========================================================================
# QUICK ACTIONS & IMAGE GENERATION PIPELINE
# =========================================================================
@app.post("/api/ai/quick_action")
async def quick_action(action: str, req: CanvasUpdateReq):
    img = base64_to_image(req.image) if req.image else Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    result_img = img

    if action == "remove_bg":
        # Tự động loại bỏ màu nền đen/trắng xung quanh
        result_img = remove_background_alpha(img)

    elif action == "slash_fx":
        # Tạo vệt chém kiếm ánh sáng neon 4 frames
        result_img = generate_slash_spritesheet()

    elif action == "run_frames":
        # Tạo chuỗi frame chạy brawler 4 frames
        result_img = generate_run_cycle_spritesheet()

    elif action == "hit_spark":
        # Tạo hiệu ứng nổ tia lửa
        result_img = generate_hit_spark_spritesheet()

    elif action == "knight_hero":
        # Tạo nhân vật Hiệp sĩ Brawler
        result_img = generate_character_sprite("hero")

    elif action == "boss_titan":
        # Tạo Boss Titan Khổng Lồ
        result_img = generate_character_sprite("boss")

    b64 = image_to_base64(result_img)
    result_img.save(os.path.join(WORKSPACE_DIR, "current_canvas.png"))
    await broadcast_ws({"type": "APPLY_IMAGE", "imageData": b64})
    return {"image": b64}

@app.post("/api/ai/inpaint")
async def inpaint_request(req: AIInpaintReq):
    img = base64_to_image(req.image)
    mask = base64_to_image(req.mask) if req.mask else None
    
    # Xử lý nét vẽ / sửa chi tiết theo mask
    result = apply_smart_inpaint(img, mask, req.prompt)
    b64 = image_to_base64(result)
    result.save(os.path.join(WORKSPACE_DIR, "current_canvas.png"))
    await broadcast_ws({"type": "APPLY_IMAGE", "imageData": b64})
    return {"image": b64}

# =========================================================================
# EXPORT DIRECTLY TO GODOT 2D
# =========================================================================
@app.post("/api/godot/sync")
async def sync_to_godot(req: GodotSyncReq):
    img = base64_to_image(req.image)
    clean_name = req.name.lower().replace(" ", "_")
    target_png = os.path.join(GODOT_SPRITES_DIR, "characters", f"{clean_name}.png")
    img.save(target_png)

    # Tự động sinh file SpriteFrames resource cho Godot 2D
    tres_path = os.path.join(GODOT_SPRITES_DIR, "characters", f"{clean_name}_frames.tres")
    create_godot_spriteframes_resource(tres_path, f"res://assets/sprites/characters/{clean_name}.png", req.frame_width, req.frame_height)

    return {
        "success": True,
        "saved_path": target_png,
        "tres_path": tres_path
    }

# =========================================================================
# HELPER IMAGE PROCESSING FUNCTIONS
# =========================================================================
def remove_background_alpha(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    # Xác định màu góc trên bên trái làm màu nền
    bg_color = data[0]
    
    for item in data:
        diff = abs(item[0] - bg_color[0]) + abs(item[1] - bg_color[1]) + abs(item[2] - bg_color[2])
        if diff < 45 or (item[0] < 15 and item[1] < 15 and item[2] < 15):
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    return img

def generate_slash_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (512, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    
    # 4 frames vệt chém kiếm ánh sáng neon
    # Frame 0: Chuẩn bị vung kiếm
    draw.arc([30, 20, 100, 110], start=180, end=270, fill=(0, 240, 255, 200), width=6)
    # Frame 1: Vung mạnh vệt chém lớn
    draw.arc([140, 10, 240, 120], start=120, end=320, fill=(0, 255, 220, 255), width=14)
    draw.arc([148, 18, 232, 112], start=130, end=310, fill=(255, 255, 255, 255), width=6)
    # Frame 2: Vết chém bung tỏa tia lửa
    draw.arc([270, 15, 370, 115], start=90, end=350, fill=(255, 0, 128, 255), width=16)
    draw.arc([278, 23, 362, 107], start=100, end=340, fill=(255, 230, 100, 255), width=8)
    draw.line([360, 40, 380, 20], fill=(255, 255, 255, 255), width=4)
    draw.line([365, 80, 382, 95], fill=(255, 255, 255, 255), width=4)
    # Frame 3: Tan dần
    draw.arc([405, 30, 490, 100], start=160, end=290, fill=(0, 240, 255, 120), width=6)
    
    return sheet

def generate_hit_spark_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (512, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    
    # Frame 0: Điểm chạm nhỏ
    draw.ellipse([54, 54, 74, 74], fill=(255, 255, 255, 255))
    # Frame 1: Nổ sao lớn
    draw.ellipse([168, 44, 216, 92], fill=(255, 230, 50, 255))
    draw.polygon([(192, 20), (200, 55), (235, 64), (200, 75), (192, 110), (184, 75), (149, 64), (184, 55)], fill=(255, 255, 255, 255))
    # Frame 2: Tia lửa bung 8 hướng
    for angle in [0, 45, 90, 135, 180, 225, 270, 315]:
        import math
        rad = math.radians(angle)
        x1 = 320 + math.cos(rad) * 20
        y1 = 64 + math.sin(rad) * 20
        x2 = 320 + math.cos(rad) * 55
        y2 = 64 + math.sin(rad) * 55
        draw.line([(x1, y1), (x2, y2)], fill=(255, 80, 0, 255), width=5)
    # Frame 3: Hạt tàn tro
    draw.ellipse([435, 50, 445, 60], fill=(255, 200, 50, 180))
    draw.ellipse([460, 70, 470, 80], fill=(255, 100, 50, 180))
    
    return sheet

def generate_run_cycle_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (512, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    
    # 4 frames chuyển động chạy của Brawler chibi
    offsets = [(0, 0), (0, -6), (0, 2), (0, -4)]
    leg_angles = [(-20, 25), (-35, 35), (25, -20), (35, -35)]
    
    for i in range(4):
        bx = i * 128 + 64
        by = 64 + offsets[i][1]
        la = leg_angles[i]
        
        # Thân người (Body)
        draw.ellipse([bx - 24, by - 20, bx + 24, by + 28], fill=(0, 180, 255, 255), outline=(0, 100, 200, 255), width=3)
        # Đầu (Head)
        draw.ellipse([bx - 20, by - 48, bx + 20, by - 12], fill=(255, 220, 180, 255), outline=(180, 120, 80, 255), width=2)
        # Mắt hoạt hình
        draw.ellipse([bx + 4, by - 36, bx + 12, by - 24], fill=(20, 20, 30, 255))
        draw.ellipse([bx + 8, by - 34, bx + 12, by - 28], fill=(255, 255, 255, 255))
        # Găng đấm đỏ
        draw.ellipse([bx + 14, by - 10, bx + 36, by + 12], fill=(255, 40, 60, 255), outline=(180, 10, 30, 255), width=2)
        # Chân
        draw.line([(bx - 8, by + 26), (bx - 8 + la[0], by + 50)], fill=(0, 100, 200, 255), width=7)
        draw.line([(bx + 8, by + 26), (bx + 8 + la[1], by + 50)], fill=(0, 100, 200, 255), width=7)
        
    return sheet

def generate_character_sprite(c_type: str) -> Image.Image:
    sheet = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sheet)
    
    if c_type == "hero":
        # Knight Hero Brawler 256x256
        bx, by = 256, 256
        # Kiếm ánh sáng sau lưng
        draw.line([(bx + 50, by - 120), (bx - 40, by + 60)], fill=(0, 240, 255, 255), width=10)
        # Thân giáp xanh Cyan
        draw.ellipse([bx - 60, by - 50, bx + 60, by + 70], fill=(0, 160, 240, 255), outline=(0, 80, 160, 255), width=6)
        # Đầu mũ hiệp sĩ
        draw.ellipse([bx - 50, by - 130, bx + 50, by - 35], fill=(240, 245, 255, 255), outline=(160, 175, 195, 255), width=5)
        # Khe mắt mũ giáp phát sáng
        draw.rectangle([bx - 25, by - 90, bx + 25, by - 75], fill=(0, 240, 255, 255))
        # Găng tay vàng kim
        draw.ellipse([bx - 90, by - 10, bx - 40, by + 40], fill=(255, 200, 0, 255), outline=(180, 130, 0, 255), width=4)
        draw.ellipse([bx + 40, by - 10, bx + 90, by + 40], fill=(255, 200, 0, 255), outline=(180, 130, 0, 255), width=4)
    else:
        # Boss Titan khổng lồ
        bx, by = 256, 256
        # Thân đỏ khổng lồ
        draw.ellipse([bx - 110, by - 80, bx + 110, by + 120], fill=(230, 40, 60, 255), outline=(150, 10, 30, 255), width=8)
        # Đầu & Vương miện
        draw.ellipse([bx - 70, by - 170, bx + 70, by - 60], fill=(240, 60, 80, 255), outline=(150, 10, 30, 255), width=6)
        draw.polygon([(bx - 60, by - 165), (bx - 30, by - 210), (bx, by - 175), (bx + 30, by - 210), (bx + 60, by - 165)], fill=(255, 210, 0, 255))
        # Mắt đỏ rực
        draw.ellipse([bx - 40, by - 120, bx - 10, by - 90], fill=(255, 255, 0, 255))
        draw.ellipse([bx + 10, by - 120, bx + 40, by - 90], fill=(255, 255, 0, 255))
        
    return sheet

def apply_smart_inpaint(img: Image.Image, mask: Image.Image, prompt: str) -> Image.Image:
    # Nếu có mask, phủ màu hoặc làm nổi bật nét theo prompt
    result = img.copy()
    if mask:
        draw = ImageDraw.Draw(result)
        mask_data = mask.getdata()
        for y in range(img.height):
            for x in range(img.width):
                idx = y * img.width + x
                m_pixel = mask_data[idx]
                if m_pixel[3] > 50: # Vùng được tô mask
                    # Tăng sáng và áp dụng hiệu ứng viền vàng kim / neon
                    orig = img.getpixel((x, y))
                    if "vàng" in prompt.lower() or "gold" in prompt.lower():
                        draw.point((x, y), fill=(255, 215, 0, orig[3] if orig[3] > 0 else 255))
                    elif "lửa" in prompt.lower() or "fire" in prompt.lower():
                        draw.point((x, y), fill=(255, 60, 0, orig[3] if orig[3] > 0 else 255))
                    else:
                        draw.point((x, y), fill=(0, 240, 255, orig[3] if orig[3] > 0 else 255))
    return result

def create_godot_spriteframes_resource(tres_path: str, texture_path: str, fw: int, fh: int):
    # Tạo resource Godot SpriteFrames
    content = f"""[gd_resource type="SpriteFrames" format=3]

[resource]
animations = [{{
"frames": [],
"loop": true,
"name": &"default",
"speed": 12.0
}}]
"""
    with open(tres_path, "w", encoding="utf-8") as f:
        f.write(content)

# Phục vụ giao diện tĩnh
app.mount("/", StaticFiles(directory=r"d:\folder\tools\2d_studio", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)
