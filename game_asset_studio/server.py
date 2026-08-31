import os
import io
import json
import base64
import asyncio
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

app = FastAPI(title="Game Asset & Animation Pipeline Studio PRO")

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
GAMES_DB_FILE = os.path.join(STUDIO_DIR, "game_projects.json")
GODOT_SPRITES_DIR = r"d:\folder\tools\godot_demo\2\assets\sprites"
RAW_ASSETS_DIR = r"d:\folder\tools\godot_demo\2\raw_assets"

os.makedirs(ASSETS_LIB_DIR, exist_ok=True)
os.makedirs(WORKSPACE_DIR, exist_ok=True)
os.makedirs(RAW_ASSETS_DIR, exist_ok=True)
for cat in ["characters", "monsters", "items", "environments", "vfx", "ui", "raw_videos", "raw_sheets"]:
    os.makedirs(os.path.join(ASSETS_LIB_DIR, cat), exist_ok=True)

# =========================================================================
# INITIAL GAMES DATABASE
# =========================================================================
def init_games_db():
    if not os.path.exists(GAMES_DB_FILE):
        initial_data = {
            "active_game_id": "game_rooster_dark_fantasy",
            "games": [
                {
                    "id": "game_rooster_dark_fantasy",
                    "title": "Huyền Thoại Gà Chọi: Đấu Trường Bóng Tối",
                    "genre": "2D Action Roguelike / Platformer",
                    "art_style": "16-Bit Dark Fantasy Pixel Art, Gothic, Crimson Neon Accent",
                    "raw_input_story": "Một chú gà chọi dũng mãnh với mào lửa bị bắt cóc vào hầm ngục bóng tối của các pháp sư cơ giới, phải chiến đấu với quái vật máy móc và sói bóng đêm để giải cứu đồng loại.",
                    "full_story": {
                        "synopsis": "Vùng đất lông vũ Avia ngập chìm trong bóng đêm khi Giáo phái Cơ Giới Malakar xâm chiếm. Chú gà chiến Roosterius sở hữu dòng máu chiến kê thượng cổ thức tỉnh, mang theo cựa sắt phong ấn ma thuật dấn thân vào hầm ngục vô tận.",
                        "protagonist": "Roosterius - Chiến Binh Gà Chọi (Mào đỏ rực lửa, cựa sắt bọc lôi điện, thân đen tuyền dũng mãnh).",
                        "antagonists": "Sói Bóng Đêm Vorash (Thú săn mồi hắc ám) & Chúa Tể Cơ Giới Malakar (Boss trùm nửa máy nửa ma).",
                        "environment": "Hầm Ngục Đá Cổ (Dungeon), Đấu Trường Cơ Giới Rực Lửa, Rừng Nấm Độc Biến Dị.",
                        "gameplay_elements": "Tốc độ di chuyển cao, combo đá cựa trên không, lướt né đòn, nhặt Bình Lửa Inferno để tăng sát thương."
                    },
                    "assets": [
                        {
                            "id": "asset_hero_rooster",
                            "name": "Chiến Binh Gà Chọi (Roosterius)",
                            "category": "characters",
                            "format": "video",
                            "format_reason": "Cử động chạy, nhấp gối, vung cựa đá liên hoàn nhiều khớp -> Tạo Video 2-3s bóc 8 frame cực mượt",
                            "priority": "Cao",
                            "status": "ready",
                            "prompt_video": "2D game animation of a fierce battle rooster running in place, 8-frame seamless run cycle, dark fantasy gothic aesthetic, crimson comb, armored talons, solid bright green screen background, crisp outlines, side-view 2D game asset",
                            "prompt_image": "2D pixel art spritesheet of battle rooster character, 8 action poses, solid neutral background",
                            "animations": ["idle", "run", "jump", "attack_kick", "hurt", "death"]
                        },
                        {
                            "id": "asset_shadow_wolf",
                            "name": "Sói Bóng Đêm (Shadow Wolf Mini-Boss)",
                            "category": "monsters",
                            "format": "video",
                            "format_reason": "Chuyển động vồ mồi và bờm phát sáng liên tục -> Dạng Video cho chuyển động khói bóng mượt",
                            "priority": "Cao",
                            "status": "pending",
                            "prompt_video": "2D dark fantasy shadow wolf monster running and lunging attack cycle, glowing purple spectral eyes, solid bright green screen background, side view, game sprite animation",
                            "prompt_image": "2D pixel art monster spritesheet of shadow wolf, clean 2x4 grid, transparent background",
                            "animations": ["idle", "run", "bite_attack", "howl", "death"]
                        },
                        {
                            "id": "asset_fire_potion",
                            "name": "Bình Thuốc Lửa (Inferno Flask)",
                            "category": "items",
                            "format": "image",
                            "format_reason": "Vật phẩm tĩnh / icon giao diện -> Dạng Ảnh Spritesheet nhanh & sắc nét 100%",
                            "priority": "Trung bình",
                            "status": "pending",
                            "prompt_video": "2D glowing potion bottle with boiling lava liquid inside, subtle looping glow, green screen",
                            "prompt_image": "2D game item icon set of magical fire potion flasks, glowing glass bottle with molten amber liquid, 16-bit pixel art, isolated transparent background",
                            "animations": ["idle_glow"]
                        },
                        {
                            "id": "asset_dungeon_tileset",
                            "name": "Tileset Hầm Ngục Cổ (Gothic Stone Dungeon)",
                            "category": "environments",
                            "format": "image",
                            "format_reason": "Gạch nền, tường, cột đá cần thẳng hàng pixel chuẩn lưới -> Dạng Ảnh Spritesheet",
                            "priority": "Cao",
                            "status": "pending",
                            "prompt_image": "2D pixel art platformer tileset of dark gothic castle dungeon, stone brick floor, spikes, chains, torches, seamless repeatable tiles, 16-bit style",
                            "animations": ["static"]
                        }
                    ],
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
                }
            ]
        }
        with open(GAMES_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(initial_data, f, ensure_ascii=False, indent=2)

init_games_db()

def load_games_db() -> dict:
    if os.path.exists(GAMES_DB_FILE):
        try:
            with open(GAMES_DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"active_game_id": "", "games": []}

def save_games_db(data: dict):
    with open(GAMES_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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
def image_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def base64_to_image(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    data = base64.b64decode(b64_str)
    return Image.open(io.BytesIO(data)).convert("RGBA")

def remove_chroma_key(img_pil: Image.Image, mode: str = "green", tolerance: int = 35) -> Image.Image:
    img_np = np.array(img_pil.convert("RGBA"))
    r, g, b, a = img_np[:,:,0], img_np[:,:,1], img_np[:,:,2], img_np[:,:,3]
    
    if mode == "green":
        is_green = (g > 100) & (g > r.astype(int) + tolerance) & (g > b.astype(int) + tolerance)
        img_np[is_green, 3] = 0
    elif mode == "black":
        is_black = (r < tolerance) & (g < tolerance) & (b < tolerance)
        img_np[is_black, 3] = 0
    elif mode == "white":
        is_white = (r > 255 - tolerance) & (g > 255 - tolerance) & (b > 255 - tolerance)
        img_np[is_white, 3] = 0
        
    return Image.fromarray(img_np, "RGBA")

# =========================================================================
# 1. GAME PROJECT & SCENARIO PLANNER APIs
# =========================================================================
class CreateGameRequest(BaseModel):
    title: str
    genre: str = "2D Action Platformer"
    art_style: str = "16-Bit Pixel Art"
    raw_story: str

class AssetPlanItem(BaseModel):
    id: Optional[str] = None
    name: str
    category: str = "characters"  # characters, monsters, items, environments, vfx, ui
    format: str = "video"         # video or image
    format_reason: Optional[str] = "Chuyển động liên tục"
    priority: str = "Cao"         # Cao, Trung bình, Thấp
    status: str = "pending"       # pending, generating, ready, exported
    prompt_video: Optional[str] = ""
    prompt_image: Optional[str] = ""
    animations: List[str] = ["idle", "run", "attack", "hurt", "death"]

class StoryAnalysisRequest(BaseModel):
    game_id: Optional[str] = None
    title: str
    genre: str = "2D Action Platformer"
    art_style: str = "16-Bit Pixel Art"
    raw_story: str

@app.get("/api/games/list")
async def get_games_list():
    db = load_games_db()
    return {
        "active_game_id": db.get("active_game_id", ""),
        "games": db.get("games", [])
    }

@app.get("/api/games/active")
async def get_active_game():
    db = load_games_db()
    active_id = db.get("active_game_id", "")
    for g in db.get("games", []):
        if g.get("id") == active_id:
            return {"game": g}
    if db.get("games"):
        return {"game": db["games"][0]}
    return {"game": None}

@app.post("/api/games/set_active")
async def set_active_game(game_id: str = Form(...)):
    db = load_games_db()
    db["active_game_id"] = game_id
    save_games_db(db)
    await broadcast_ws({"type": "ACTIVE_GAME_CHANGED", "game_id": game_id})
    return {"status": "ok", "active_game_id": game_id}

@app.post("/api/games/analyze_and_create")
async def analyze_and_create_game(req: StoryAnalysisRequest):
    """
    Phân tích cốt truyện thô của người dùng -> Hoàn thiện kịch bản game chi tiết
    và tự động đề xuất trọn bộ Asset (Nhân vật, Quái, Boss, Vật phẩm, Môi trường) kèm prompt Video/Ảnh!
    """
    db = load_games_db()
    game_id = req.game_id or f"game_{int(datetime.now().timestamp())}"
    
    # AI Heuristic Story Analysis & Structuring
    full_synopsis = f"Trong thế giới {req.genre} với phong cách {req.art_style}: {req.raw_story.strip()} Cuộc phiêu lưu đưa người chơi qua nhiều màn chơi thách thức với các boss hiểm ác và những bí mật cổ xưa đang chờ giải mã."
    
    # Synthesize Asset Proposals automatically based on story keywords with full multi-step prompt pipeline
    assets_proposals = []
    
    # 1. Main Hero
    assets_proposals.append({
        "id": f"asset_hero_{int(datetime.now().timestamp())}",
        "name": f"Nhân Vật Chính ({req.title} Hero)",
        "category": "characters",
        "format": "video",
        "format_reason": "Chuyển động chạy, nhảy, vung vũ khí nhiều khớp -> Dùng Video AI 2-3s để bóc 8 frame cực mượt",
        "priority": "Cao",
        "status": "pending",
        "animations": ["idle", "run", "jump", "attack_combo", "hurt", "death"],
        "pipeline_steps": [
            {
                "step_name": "📸 Bước 1: Tạo Ảnh Dáng Gốc (Base Character Pose)",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Tạo 1 ảnh nhân vật góc nhìn ngang chuẩn nét trên phông xanh lá để làm ảnh gốc nạp vào Video AI (I2V)",
                "prompt": f"2D side-view character full body pose of {req.title} main hero, {req.art_style}, clean outlines, centered, solid bright green chroma key background --ar 1:1",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.1: Video Hoạt Ảnh [idle] (Đứng Thở)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 vào I2V tạo chuyển động đứng thở nhịp nhàng",
                "prompt": "Full body character idle breathing animation, subtle weapon movement, 8 frames seamless loop, fixed side profile view, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.2: Video Hoạt Ảnh [run] (Chạy Lướt)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 vào I2V tạo bước chạy liên tục 8 frame",
                "prompt": "Full body character running forward in place, 8 frames continuous run cycle, fixed side profile view, moving right, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.3: Video Hoạt Ảnh [attack_combo] (Tấn Công)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 vào I2V tạo đòn đánh vung chiêu",
                "prompt": "Full body character performing dynamic weapon attack slash combo, dramatic action motion, 8 frames loop, fixed side view, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.4: Video Hoạt Ảnh [death] (Gục Ngã / Thất Bại)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 vào I2V tạo cảnh bị hạ gục",
                "prompt": "Full body character taking critical hit and collapsing in defeat, 6 frames animation, fixed side view, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🖼️ Bước 3: Spritesheet Trọn Bộ (Dự phòng & Icon UI)",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Ảnh lưới tổng hợp các tư thế để dùng làm icon và cắt ảnh tĩnh",
                "prompt": f"2D pixel art character spritesheet of {req.title} hero: idle, run, attack, hurt, death, {req.art_style}, 3x2 grid, solid bright green screen background",
                "completed": false
            }
        ]
    })
    
    # 2. Regular Monster / Minion
    assets_proposals.append({
        "id": f"asset_minion_{int(datetime.now().timestamp())}",
        "name": "Quái Vật Thường (Dungeon Minion)",
        "category": "monsters",
        "format": "video",
        "format_reason": "Cử động tuần tra, lao vào tấn công nhịp nhàng -> Dùng Video AI 2-3s",
        "priority": "Cao",
        "status": "pending",
        "animations": ["idle", "walk", "attack", "hurt", "death"],
        "pipeline_steps": [
            {
                "step_name": "📸 Bước 1: Tạo Ảnh Dáng Quái Gốc",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Tạo 1 ảnh quái vật góc nhìn ngang trên phông xanh",
                "prompt": f"2D side-view monster creature, menacing stance, {req.art_style}, clean outlines, solid bright green chroma key background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.1: Video [walk] (Bò / Đi Tuần Tra)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 tạo chuyển động di chuyển",
                "prompt": "2D monster walking forward animation, 8 frames seamless loop, fixed side view, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.2: Video [attack] (Lao Đánh)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 tạo đòn cắn / vồ",
                "prompt": "2D monster lunging forward with fierce bite attack, 6 frames animation, fixed side view, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🖼️ Bước 3: Spritesheet Quái Vật Lưới",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Ảnh lưới tổng hợp",
                "prompt": f"2D monster spritesheet for game, 6 action poses in clean grid, {req.art_style}, solid green screen background",
                "completed": false
            }
        ]
    })
    
    # 3. Epic Boss
    assets_proposals.append({
        "id": f"asset_boss_{int(datetime.now().timestamp())}",
        "name": "Trùm Cuối (Epic Final Boss)",
        "category": "monsters",
        "format": "video",
        "format_reason": "Kích thước lớn, đòn đánh dội lửa/năng lượng -> Dạng Video tạo hiệu ứng biến hình & vung chiêu hoành tráng",
        "priority": "Cao",
        "status": "pending",
        "animations": ["idle_phase1", "rage_attack", "ultimate_cast", "stagger_hurt", "death_explosion"],
        "pipeline_steps": [
            {
                "step_name": "📸 Bước 1: Tạo Ảnh Dáng Boss Khổng Lồ",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Ảnh boss oai vệ trên phông xanh",
                "prompt": f"2D giant epic boss monster, imposing dark armor, glowing aura, {req.art_style}, side view, centered, solid bright green screen background",
                "completed": false
            },
            {
                "step_name": "🎬 Bước 2.1: Video [rage_attack] (Tuyệt Kỹ Nộ)",
                "tool_recommended": "Tencent HY Video 1.5 / Kling (I2V)",
                "purpose": "Nạp ảnh Bước 1 tạo đòn nộ hoành tráng",
                "prompt": "2D gigantic boss monster executing special ultimate slam attack with ground impact shockwave, 8 frames loop, fixed side view, solid green screen",
                "completed": false
            },
            {
                "step_name": "🖼️ Bước 3: Spritesheet Boss",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Spritesheet tổng hợp",
                "prompt": f"2D giant boss spritesheet, multiple attack phases, {req.art_style}, transparent background",
                "completed": false
            }
        ]
    })

    # 4. Item / Powerup
    assets_proposals.append({
        "id": f"asset_item_{int(datetime.now().timestamp())}",
        "name": "Bảo Vật / Bình Năng Lượng (Artifact Powerup)",
        "category": "items",
        "format": "image",
        "format_reason": "Vật phẩm tĩnh / icon giao diện -> Dạng Ảnh Spritesheet sắc nét 100%",
        "priority": "Trung bình",
        "status": "pending",
        "animations": ["idle_sparkle"],
        "pipeline_steps": [
            {
                "step_name": "🖼️ Bước 1: Spritesheet Bộ Vật Phẩm & Icon",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Tạo bộ icon các vật phẩm nổi bồng bềnh",
                "prompt": f"2D game item icon set of glowing magical powerups, potions, and crystals, {req.art_style}, isolated on transparent background",
                "completed": false
            }
        ]
    })

    # 5. Environment Tileset
    assets_proposals.append({
        "id": f"asset_tile_{int(datetime.now().timestamp())}",
        "name": "Tileset Môi Trường Màn Chơi (Stage Tileset)",
        "category": "environments",
        "format": "image",
        "format_reason": "Gạch nền, vách tường, chướng ngại vật cần thẳng hàng pixel chuẩn lưới -> Dạng Ảnh",
        "priority": "Cao",
        "status": "pending",
        "animations": ["static"],
        "pipeline_steps": [
            {
                "step_name": "🖼️ Bước 1: Tileset Gạch Nền Chuẩn Lưới (Modular Tileset)",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Tạo mặt sàn gạch, nền đất, chướng ngại vật ghép nối liền mạch",
                "prompt": f"2D platformer game environment tileset, ground blocks, wall platforms, traps, hazards, seamless repeatable tiles, {req.art_style}",
                "completed": false
            },
            {
                "step_name": "🖼️ Bước 2: Parallax Background (3 Lớp Chiều Sâu)",
                "tool_recommended": "ChatGPT / Midjourney",
                "purpose": "Cảnh nền cuộn phía sau (Trời xa, Đồi núi giữa, Cây cỏ gần)",
                "prompt": f"2D side-scrolling parallax background depth layers: layer 1 distant sky, layer 2 mountains, layer 3 foreground props, {req.art_style}, seamless loop",
                "completed": false
            }
        ]
    })

    # 6. VFX Skill Effect
    assets_proposals.append({
        "id": f"asset_vfx_{int(datetime.now().timestamp())}",
        "name": "Hiệu Ứng Tuyệt Chiêu (Skill Slash VFX)",
        "category": "vfx",
        "format": "video",
        "format_reason": "Vệt chém tia sáng / chưởng lửa cần độ mượt từng mili-giây -> Dạng Video",
        "priority": "Trung bình",
        "status": "pending",
        "animations": ["slash_burst"],
        "pipeline_steps": [
            {
                "step_name": "🎬 Bước 1: Video Hiệu Ứng Vệt Chém / Nổ Năng Lượng",
                "tool_recommended": "Tencent HY Video 1.5 / Runway",
                "purpose": "Tạo luồng năng lượng bùng nổ trên nền đen",
                "prompt": "2D elemental energy slash wave effect expanding and bursting, glowing neon particles, solid black background, side view, VFX animation",
                "completed": false
            }
        ]
    })

    game_entry = {
        "id": game_id,
        "title": req.title,
        "genre": req.genre,
        "art_style": req.art_style,
        "raw_input_story": req.raw_story,
        "full_story": {
            "synopsis": full_synopsis,
            "protagonist": f"Nhân vật chính của {req.title}, mang sức mạnh đặc trưng để vượt qua thử thách.",
            "antagonists": "Thế lực quái vật hắc ám và các trùm khu vực canh giữ cánh cổng.",
            "environment": f"Các khu vực màn chơi đa dạng theo phong cách {req.art_style}.",
            "gameplay_elements": "Hành động chiến đấu, tích lũy bảo vật, né tránh bẫy và hạ gục trùm cuối."
        },
        "assets": assets_proposals,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    # Save to DB
    exists = False
    for i, g in enumerate(db.get("games", [])):
        if g.get("id") == game_id:
            db["games"][i] = game_entry
            exists = True
            break
    if not exists:
        db["games"].insert(0, game_entry)
        
    db["active_game_id"] = game_id
    save_games_db(db)

    await broadcast_ws({"type": "GAME_CREATED_OR_UPDATED", "game": game_entry})
    return {"status": "ok", "game": game_entry}

@app.post("/api/games/add_asset")
async def add_asset_to_game(game_id: str = Form(...), plan_json: str = Form(...)):
    db = load_games_db()
    plan_dict = json.loads(plan_json)
    if not plan_dict.get("id"):
        plan_dict["id"] = f"asset_{int(datetime.now().timestamp())}"
        
    for g in db.get("games", []):
        if g.get("id") == game_id:
            g["assets"].insert(0, plan_dict)
            save_games_db(db)
            await broadcast_ws({"type": "ASSET_ADDED_TO_GAME", "game_id": game_id, "asset": plan_dict})
            return {"status": "ok", "asset": plan_dict}
    raise HTTPException(status_code=404, detail="Game not found")

@app.delete("/api/games/{game_id}")
async def delete_game(game_id: str):
    db = load_games_db()
    db["games"] = [g for g in db.get("games", []) if g.get("id") != game_id]
    if db["active_game_id"] == game_id and db["games"]:
        db["active_game_id"] = db["games"][0]["id"]
    save_games_db(db)
    await broadcast_ws({"type": "GAMES_LIST_UPDATED", "games": db["games"]})
    return {"status": "ok"}

@app.delete("/api/games/{game_id}/asset/{asset_id}")
async def delete_game_asset(game_id: str, asset_id: str):
    db = load_games_db()
    for g in db.get("games", []):
        if g.get("id") == game_id:
            g["assets"] = [a for a in g.get("assets", []) if a.get("id") != asset_id]
            save_games_db(db)
            await broadcast_ws({"type": "GAME_ASSET_DELETED", "game_id": game_id, "asset_id": asset_id})
            return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Game not found")

@app.post("/api/assets/upload_raw")
async def upload_asset_raw_file(
    game_id: str = Form(...),
    asset_id: str = Form(...),
    step_index: int = Form(...),
    file: UploadFile = File(...)
):
    """
    Tự động lưu trữ file raw (video mp4 hoặc ảnh png/jpg) tải từ AI về vào đúng thư mục game & asset:
    godot_demo/2/raw_assets/<game_id>/<asset_id>/<filename>
    để commit lên Git an toàn và có thể chuyển ngay sang tab xử lý!
    """
    db = load_games_db()
    game = None
    asset = None
    for g in db.get("games", []):
        if g.get("id") == game_id:
            game = g
            for a in g.get("assets", []):
                if a.get("id") == asset_id:
                    asset = a
                    break
            break
            
    if not game or not asset:
        raise HTTPException(status_code=404, detail="Game or Asset not found")

    clean_game = "".join(c if c.isalnum() or c == "_" else "_" for c in game_id.lower())
    clean_asset = "".join(c if c.isalnum() or c == "_" else "_" for c in asset_id.lower())
    
    target_dir = os.path.join(RAW_ASSETS_DIR, clean_game, clean_asset)
    os.makedirs(target_dir, exist_ok=True)
    
    ext = os.path.splitext(file.filename)[1].lower() or ".png"
    clean_filename = f"step_{step_index}_{int(datetime.now().timestamp())}{ext}"
    target_file_path = os.path.join(target_dir, clean_filename)
    
    with open(target_file_path, "wb") as f:
        f.write(await file.read())

    relative_url = f"/raw_assets/{clean_game}/{clean_asset}/{clean_filename}"
    if "pipeline_steps" in asset and 0 <= step_index < len(asset["pipeline_steps"]):
        step = asset["pipeline_steps"][step_index]
        step["raw_file_name"] = file.filename
        step["raw_file_path"] = target_file_path
        step["raw_file_url"] = relative_url
        step["completed"] = True
        step["uploaded_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        
    total_steps = len(asset.get("pipeline_steps", []))
    done_steps = sum(1 for s in asset.get("pipeline_steps", []) if s.get("completed"))
    if done_steps == total_steps and total_steps > 0:
        asset["status"] = "ready_to_export"
    elif done_steps > 0:
        asset["status"] = "in_progress"
    else:
        asset["status"] = "pending"

    save_games_db(db)
    
    await broadcast_ws({
        "type": "RAW_FILE_UPLOADED",
        "game_id": game_id,
        "asset_id": asset_id,
        "step_index": step_index,
        "file_url": relative_url,
        "file_name": file.filename
    })
    
    return {
        "status": "ok",
        "raw_file_path": target_file_path,
        "raw_file_url": relative_url,
        "file_name": file.filename,
        "asset": asset
    }

@app.post("/api/assets/toggle_step")
async def toggle_asset_step(
    game_id: str = Form(...),
    asset_id: str = Form(...),
    step_index: int = Form(...),
    completed: bool = Form(...)
):
    db = load_games_db()
    for g in db.get("games", []):
        if g.get("id") == game_id:
            for a in g.get("assets", []):
                if a.get("id") == asset_id:
                    if "pipeline_steps" in a and 0 <= step_index < len(a["pipeline_steps"]):
                        a["pipeline_steps"][step_index]["completed"] = completed
                        
                        total_steps = len(a["pipeline_steps"])
                        done_steps = sum(1 for s in a["pipeline_steps"] if s.get("completed"))
                        if done_steps == total_steps and total_steps > 0:
                            a["status"] = "ready_to_export"
                        elif done_steps > 0:
                            a["status"] = "in_progress"
                        else:
                            a["status"] = "pending"
                            
                        save_games_db(db)
                        return {"status": "ok", "completed": completed, "status_text": a["status"]}
    raise HTTPException(status_code=404, detail="Asset not found")

# =========================================================================
# 2. VIDEO & IMAGE FRAME PROCESSOR API
# =========================================================================
@app.post("/api/process/video_file")
async def process_video_file(
    video: UploadFile = File(...),
    start_sec: float = Form(0.0),
    end_sec: float = Form(0.0),
    frame_count: int = Form(8),
    bg_removal: str = Form("green"),  # green, black, white, none
    tolerance: int = Form(35),
    target_size: int = Form(256),
    pixelate: bool = Form(True)
):
    temp_video_path = os.path.join(WORKSPACE_DIR, f"temp_{int(datetime.now().timestamp())}_{video.filename}")
    with open(temp_video_path, "wb") as f:
        f.write(await video.read())
        
    frames_b64 = []
    frames_pil = []
    
    if HAS_CV2:
        cap = cv2.VideoCapture(temp_video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        
        real_start = max(0.0, start_sec)
        real_end = end_sec if end_sec > real_start else duration
        
        start_frame = int(real_start * fps)
        end_frame = int(min(total_frames - 1, real_end * fps))
        
        if end_frame <= start_frame:
            end_frame = total_frames - 1
            
        frame_indices = np.linspace(start_frame, end_frame, frame_count, dtype=int)
        
        for f_idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
            ret, frame = cap.read()
            if ret:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(frame_rgb).convert("RGBA")
                
                if bg_removal != "none":
                    img = remove_chroma_key(img, mode=bg_removal, tolerance=tolerance)
                
                if pixelate and target_size < img.width:
                    img = img.resize((target_size, target_size), Image.Resampling.NEAREST)
                else:
                    img = img.resize((target_size, target_size), Image.Resampling.BICUBIC)
                    
                frames_pil.append(img)
                frames_b64.append(image_to_base64(img))
                
        cap.release()
    else:
        raise HTTPException(status_code=500, detail="OpenCV (cv2) not available on server.")

    if frames_pil:
        cols = min(4, len(frames_pil))
        rows = (len(frames_pil) + cols - 1) // cols
        sheet = Image.new("RGBA", (cols * target_size, rows * target_size), (0, 0, 0, 0))
        for i, f in enumerate(frames_pil):
            c = i % cols
            r = i // cols
            sheet.paste(f, (c * target_size, r * target_size))
        sheet_b64 = image_to_base64(sheet)
    else:
        sheet_b64 = None

    return {
        "status": "ok",
        "frame_count": len(frames_b64),
        "frames": frames_b64,
        "spritesheet": sheet_b64,
        "duration": duration if 'duration' in locals() else 0.0
    }

# =========================================================================
# 3. GODOT EXPORT API
# =========================================================================
class GodotExportRequest(BaseModel):
    asset_name: str
    category: str = "characters"
    clips: Dict[str, List[str]]

@app.post("/api/godot/export")
async def export_to_godot(req: GodotExportRequest):
    c_name = "".join(c if c.isalnum() or c == "_" else "_" for c in req.asset_name.lower().strip())
    
    godot_target_dir = os.path.join(GODOT_SPRITES_DIR, req.category, c_name)
    os.makedirs(godot_target_dir, exist_ok=True)
    
    lib_target_dir = os.path.join(ASSETS_LIB_DIR, req.category, c_name)
    os.makedirs(lib_target_dir, exist_ok=True)

    sections = []
    first_thumb_saved = False
    
    for clip_key, frames_b64 in req.clips.items():
        for idx, b64 in enumerate(frames_b64):
            f_img = base64_to_image(b64)
            f_path = os.path.join(godot_target_dir, f"{clip_key}_{idx}.png")
            f_img.save(f_path)
            f_img.save(os.path.join(lib_target_dir, f"{clip_key}_{idx}.png"))
            
            if not first_thumb_saved:
                thumb = f_img.resize((128, 128), Image.Resampling.NEAREST)
                thumb.save(os.path.join(lib_target_dir, "thumb.png"))
                first_thumb_saved = True
            
        loop = "true" if clip_key in ["idle", "run", "walk"] else "false"
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
    with open(os.path.join(godot_target_dir, f"{c_name}_frames.tres"), "w", encoding="utf-8") as f:
        f.write(tres_content)
    with open(os.path.join(lib_target_dir, f"{c_name}_frames.tres"), "w", encoding="utf-8") as f:
        f.write(tres_content)

    meta = {
        "name": req.asset_name,
        "category": req.category,
        "clips": list(req.clips.keys()),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(os.path.join(lib_target_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    await broadcast_ws({
        "type": "ASSET_EXPORTED_GODOT",
        "name": req.asset_name,
        "category": req.category
    })

    return {"status": "ok", "godot_dir": godot_target_dir, "library_dir": lib_target_dir}

# =========================================================================
# 4. LIBRARY CATALOG
# =========================================================================
@app.get("/api/library/assets")
async def get_library_assets():
    catalog: Dict[str, List[dict]] = {
        "all": [], "characters": [], "monsters": [], "items": [],
        "environments": [], "vfx": [], "ui": [], "raw_videos": [], "raw_sheets": []
    }
    
    for cat in catalog.keys():
        if cat == "all": continue
        cat_dir = os.path.join(ASSETS_LIB_DIR, cat)
        if not os.path.exists(cat_dir): continue
            
        for item_name in os.listdir(cat_dir):
            item_path = os.path.join(cat_dir, item_name)
            if os.path.isdir(item_path):
                meta_file = os.path.join(item_path, "meta.json")
                if not os.path.exists(meta_file):
                    meta_file = os.path.join(item_path, "metadata.json")
                    
                meta_data = {}
                if os.path.exists(meta_file):
                    try:
                        with open(meta_file, "r", encoding="utf-8") as f:
                            meta_data = json.load(f)
                    except Exception:
                        pass
                
                thumb_url = f"/assets_library/{cat}/{item_name}/thumb.png"
                sheet_url = f"/assets_library/{cat}/{item_name}/spritesheet.png"
                
                entry = {
                    "id": item_name,
                    "name": meta_data.get("name", item_name),
                    "category": cat,
                    "thumb": thumb_url,
                    "spritesheet": sheet_url,
                    "created_at": meta_data.get("created_at", "")
                }
                catalog[cat].append(entry)
                catalog["all"].append(entry)
                
    return catalog

app.mount("/assets_library", StaticFiles(directory=ASSETS_LIB_DIR), name="assets_library")
app.mount("/raw_assets", StaticFiles(directory=RAW_ASSETS_DIR), name="raw_assets")
app.mount("/", StaticFiles(directory=STUDIO_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8899)
