"""
MCP Bridge & Script Automation for Game Asset Studio
Dùng để Antigravity AI Agent dễ dàng kết nối, đẩy kịch bản game, phân tích cốt truyện,
định hướng dạng Video vs Ảnh và tự động lập plan Asset theo từng Game riêng biệt.
"""

import json
import urllib.request
import urllib.error
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

STUDIO_API_BASE = "http://localhost:8899/api"

def get_all_games():
    """Lấy danh sách tất cả các Dự án Game trong tool"""
    try:
        req = urllib.request.Request(f"{STUDIO_API_BASE}/games/list")
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching games: {e}")
        return {"games": [], "active_game_id": ""}

def get_active_game():
    """Lấy thông tin chi tiết game đang được chọn (Cốt truyện + Asset plans)"""
    try:
        req = urllib.request.Request(f"{STUDIO_API_BASE}/games/active")
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8')).get('game')
    except Exception as e:
        print(f"Error fetching active game: {e}")
        return None

def create_or_analyze_game(title, genre="2D Action Platformer", art_style="16-Bit Pixel Art", raw_story=""):
    """
    AI Agent tạo một dự án Game mới hoặc phân tích cốt truyện:
    Tự động xây dựng cấu trúc cốt truyện hoàn chỉnh và đề xuất toàn bộ Asset (Video/Ảnh).
    """
    payload = {
        "title": title,
        "genre": genre,
        "art_style": art_style,
        "raw_story": raw_story
    }
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(f"{STUDIO_API_BASE}/games/analyze_and_create", data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            game = res.get('game', {})
            print(f"Successfully analyzed & created game project: '{title}' with {len(game.get('assets', []))} suggested assets!")
            return game
    except Exception as e:
        print(f"Error analyzing and creating game: {e}")
        return None

def add_asset_to_active_game(game_id, name, category="characters", format_type="video", format_reason="", priority="Cao", prompt_video="", prompt_image="", animations=None):
    """Thêm một asset cụ thể vào dự án game đang chọn"""
    asset_item = {
        "name": name,
        "category": category,
        "format": format_type,
        "format_reason": format_reason or ("Tạo Video để lấy animation mượt" if format_type == "video" else "Tạo ảnh Spritesheet"),
        "priority": priority,
        "status": "pending",
        "prompt_video": prompt_video,
        "prompt_image": prompt_image,
        "animations": animations or ["idle", "run", "attack", "hurt", "death"]
    }
    try:
        data = urllib.parse.urlencode({
            "game_id": game_id,
            "plan_json": json.dumps(asset_item)
        }).encode('utf-8')
        req = urllib.request.Request(f"{STUDIO_API_BASE}/games/add_asset", data=data)
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            print(f"Added asset '{name}' to game {game_id}")
            return res
    except Exception as e:
        print(f"Error adding asset: {e}")
        return None

if __name__ == "__main__":
    print("Game Asset Studio Bridge Ready!")
    db = get_all_games()
    print(f"Total Games in Studio: {len(db.get('games', []))}")
    for g in db.get('games', []):
        print(f" - 🎮 [{g.get('title')}] ({len(g.get('assets', []))} assets)")
