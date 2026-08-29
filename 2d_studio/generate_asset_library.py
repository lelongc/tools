import os
import io
import math
import json
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

LIB_DIR = r"d:\folder\tools\2d_studio\assets_library"

def create_characters():
    chars = [
        ("cyber_ninja", (20, 240, 255), (10, 20, 35), "Ninja Công Nghệ Song Kiếm", "Hero"),
        ("knight_hero", (255, 215, 0), (70, 80, 110), "Hiệp Sĩ Hoàng Gia Kiếm Khiên", "Hero"),
        ("brawler_girl", (255, 0, 128), (40, 20, 40), "Nữ Võ Sĩ Đường Phố", "Hero"),
        ("goblin_thug", (80, 220, 80), (40, 60, 20), "Quái Vật Côn Đồ", "Enemy"),
        ("mecha_drone", (255, 120, 0), (40, 40, 50), "Drone Robot Laser Bay", "Enemy"),
        ("titan_golem", (255, 50, 50), (60, 30, 30), "Trùm Titan Golem Dung Nham", "Boss"),
    ]

    for char_id, accent_col, body_col, name_vn, role in chars:
        char_folder = os.path.join(LIB_DIR, "characters", char_id)
        os.makedirs(char_folder, exist_ok=True)
        
        meta = {
            "id": char_id,
            "name": name_vn,
            "category": "characters",
            "role": role,
            "clips": ["idle", "run", "attack", "hurt", "death"],
            "description": f"Bộ animation hoàn chỉnh 5 clips cho {name_vn}."
        }
        with open(os.path.join(char_folder, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        # Generate 5 clips
        actions = [("idle", 4), ("run", 4), ("attack", 4), ("hurt", 2), ("death", 4)]
        for act, count in actions:
            for i in range(count):
                img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
                draw_character_sprite(img, char_id, act, i, accent_col, body_col)
                img.save(os.path.join(char_folder, f"{act}_{i}.png"))
        
        # Save thumbnail (idle_0)
        img_thumb = Image.open(os.path.join(char_folder, "idle_0.png"))
        img_thumb.resize((128, 128)).save(os.path.join(char_folder, "thumb.png"))

def draw_character_sprite(img, char_id, act, idx, accent, body):
    draw = ImageDraw.Draw(img)
    bx, by = 128, 128
    is_boss = (char_id == "titan_golem")
    is_drone = (char_id == "mecha_drone")
    scale = 1.35 if is_boss else (0.85 if is_drone else 1.0)
    
    if is_drone:
        # Drone bay lơ lửng
        fly_y = math.sin(idx * math.pi / 2.0) * 8
        draw.ellipse([bx - 40, by - 40 + fly_y, bx + 40, by + 40 + fly_y], fill=body, outline=(180, 190, 200), width=4)
        draw.ellipse([bx - 18, by - 18 + fly_y, bx + 18, by + 18 + fly_y], fill=accent)
        if act == "attack":
            # Bắn laser đỏ
            draw.line([(bx + 30, by + fly_y), (bx + 110, by + fly_y)], fill=(255, 0, 50, 255), width=10)
        return

    # Nhân vật hình người
    if act == "idle":
        offset_y = math.sin(idx * math.pi / 2.0) * 3
        # Thân
        draw.ellipse([bx - 32*scale, by - 25*scale + offset_y, bx + 32*scale, by + 35*scale + offset_y], fill=body, outline=accent, width=3)
        # Đầu
        draw.ellipse([bx - 26*scale, by - 65*scale + offset_y, bx + 26*scale, by - 15*scale + offset_y], fill=(230, 235, 245), outline=body, width=3)
        # Mắt / Kính
        draw.rectangle([bx - 14*scale, by - 45*scale + offset_y, bx + 14*scale, by - 37*scale + offset_y], fill=accent)
        # Vũ khí
        draw.ellipse([bx - 42*scale, by - 5*scale + offset_y, bx - 22*scale, by + 15*scale + offset_y], fill=accent)
        draw.ellipse([bx + 22*scale, by - 5*scale + offset_y, bx + 42*scale, by + 15*scale + offset_y], fill=accent)

    elif act == "run":
        offset_y = (idx % 2) * -6
        lean_x = 8
        leg_offset = [(-16, 18), (-24, 26), (16, -18), (24, -26)][idx]
        draw.line([(bx - 12, by + 30), (bx - 12 + leg_offset[0], by + 60)], fill=body, width=int(8*scale))
        draw.line([(bx + 12, by + 30), (bx + 12 + leg_offset[1], by + 60)], fill=body, width=int(8*scale))
        draw.ellipse([bx - 32*scale + lean_x, by - 25*scale + offset_y, bx + 32*scale + lean_x, by + 35*scale + offset_y], fill=body, outline=accent, width=3)
        draw.ellipse([bx - 26*scale + lean_x, by - 65*scale + offset_y, bx + 26*scale + lean_x, by - 15*scale + offset_y], fill=(230, 235, 245), outline=body, width=3)
        draw.rectangle([bx - 10*scale + lean_x, by - 45*scale + offset_y, bx + 18*scale + lean_x, by - 37*scale + offset_y], fill=accent)

    elif act == "attack":
        if idx == 0:
            draw.ellipse([bx - 32*scale, by - 25*scale, bx + 32*scale, by + 35*scale], fill=body, outline=accent, width=3)
            draw.ellipse([bx - 26*scale, by - 65*scale, bx + 26*scale, by - 15*scale], fill=(230, 235, 245), outline=body, width=3)
            draw.line([(bx - 40, by - 30), (bx - 85, by - 85)], fill=accent, width=10)
        elif idx == 1:
            draw.ellipse([bx - 28*scale, by - 20*scale, bx + 36*scale, by + 40*scale], fill=body, outline=accent, width=3)
            draw.ellipse([bx - 20*scale, by - 60*scale, bx + 32*scale, by - 10*scale], fill=(230, 235, 245), outline=body, width=3)
            draw.arc([bx - 60, by - 90, bx + 110, by + 70], start=210, end=350, fill=accent, width=18)
            draw.arc([bx - 52, by - 82, bx + 102, by + 62], start=220, end=340, fill=(255, 255, 255), width=6)
        elif idx == 2:
            draw.ellipse([bx - 30*scale, by - 22*scale, bx + 34*scale, by + 38*scale], fill=body, outline=accent, width=3)
            draw.ellipse([bx - 24*scale, by - 62*scale, bx + 28*scale, by - 12*scale], fill=(230, 235, 245), outline=body, width=3)
            draw.arc([bx - 90, by - 40, bx + 110, by + 60], start=0, end=180, fill=(255, 0, 128), width=18)
        else:
            draw.ellipse([bx - 32*scale, by - 25*scale, bx + 32*scale, by + 35*scale], fill=body, outline=accent, width=3)
            draw.ellipse([bx - 26*scale, by - 65*scale, bx + 26*scale, by - 15*scale], fill=(230, 235, 245), outline=body, width=3)

    elif act == "hurt":
        lean_x = -20 * (idx + 1)
        draw.ellipse([bx - 32*scale + lean_x, by - 25*scale, bx + 32*scale + lean_x, by + 35*scale], fill=(255, 70, 70), outline=(200, 20, 20), width=3)
        draw.ellipse([bx - 26*scale + lean_x, by - 65*scale, bx + 26*scale + lean_x, by - 15*scale], fill=(255, 150, 150), outline=(200, 20, 20), width=3)

    elif act == "death":
        rot_y = idx * 12
        draw.ellipse([bx - 35*scale, by + 10*scale + rot_y, bx + 35*scale, by + 50*scale + rot_y], fill=(100, 110, 130), outline=(70, 80, 95), width=3)

def create_combat_fx():
    fx_list = [
        ("neon_slash_blue", "Vệt Chém Katana Neon", (0, 240, 255)),
        ("fire_slash_red", "Vệt Chém Lửa Liệt Hỏa", (255, 60, 0)),
        ("lightning_strike", "Sấm Sét Thiên Phạt", (255, 230, 0)),
        ("energy_blast", "Cầu Năng Lượng Plasma", (180, 0, 255)),
        ("hit_spark_burst", "Tia Lửa Va Chạm Bạo Kích", (255, 220, 50)),
        ("ground_smash_shockwave", "Sóng Xung Kích Đập Đất", (255, 120, 50)),
    ]

    for fx_id, name_vn, col in fx_list:
        folder = os.path.join(LIB_DIR, "fx", fx_id)
        os.makedirs(folder, exist_ok=True)
        
        meta = {
            "id": fx_id,
            "name": name_vn,
            "category": "fx",
            "frames_count": 4,
            "fps": 16,
            "description": f"Hiệu ứng hình ảnh {name_vn} 4 khung hình chất lượng cao."
        }
        with open(os.path.join(folder, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        for i in range(4):
            img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            bx, by = 128, 128

            if "slash" in fx_id:
                angle_start = 180 + i * 20
                angle_end = 340 + i * 15
                radius = 70 + i * 15
                draw.arc([bx - radius, by - radius, bx + radius, by + radius], start=angle_start, end=angle_end, fill=col, width=16)
                draw.arc([bx - radius + 5, by - radius + 5, bx + radius - 5, by + radius - 5], start=angle_start + 10, end=angle_end - 10, fill=(255, 255, 255), width=6)
            elif "lightning" in fx_id:
                pts = [(bx, 20), (bx - 20, 80 + i*10), (bx + 15, 140 + i*10), (bx - 5, 200 + i*10), (bx + 10, 240)]
                draw.line(pts, fill=col, width=12)
                draw.line(pts, fill=(255, 255, 255), width=4)
            elif "energy" in fx_id:
                r = 25 + i * 18
                draw.ellipse([bx - r, by - r, bx + r, by + r], fill=col)
                draw.ellipse([bx - r*0.6, by - r*0.6, bx + r*0.6, by + r*0.6], fill=(255, 255, 255))
            elif "spark" in fx_id:
                for angle in range(0, 360, 45):
                    rad = math.radians(angle)
                    dist = 30 + i * 22
                    ex = bx + math.cos(rad) * dist
                    ey = by + math.sin(rad) * dist
                    draw.line([(bx, by), (ex, ey)], fill=col, width=8)
            elif "ground" in fx_id:
                w = 40 + i * 35
                h = 20 + i * 15
                draw.ellipse([bx - w, by + 40 - h, bx + w, by + 40 + h], fill=col)
                draw.ellipse([bx - w*0.7, by + 40 - h*0.7, bx + w*0.7, by + 40 + h*0.7], fill=(255, 255, 200))

            img.save(os.path.join(folder, f"frame_{i}.png"))

        img_thumb = Image.open(os.path.join(folder, "frame_1.png"))
        img_thumb.resize((128, 128)).save(os.path.join(folder, "thumb.png"))

def create_environments():
    env_list = [
        ("cyber_street_road", "Đường Phố Cyberpunk", "tile"),
        ("dungeon_stone_floor", "Sàn Đá Hầm Ngục", "tile"),
        ("metal_girder_platform", "Thanh Giàn Kim Loại", "platform"),
        ("cyber_neon_billboard", "Biển Quảng Cáo Neon Thành Phố", "prop"),
        ("castle_brick_wall", "Tường Gạch Lâu Đài Cổ", "background"),
        ("dungeon_torch_light", "Đuốc Lửa Tường", "animated"),
    ]

    for env_id, name_vn, env_type in env_list:
        folder = os.path.join(LIB_DIR, "environments", env_id)
        os.makedirs(folder, exist_ok=True)
        
        meta = {
            "id": env_id,
            "name": name_vn,
            "category": "environments",
            "type": env_type,
            "description": f"Asset môi trường màn chơi: {name_vn}."
        }
        with open(os.path.join(folder, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        if "street" in env_id:
            # Mặt đường nhựa + vạch kẻ neon xanh
            draw.rectangle([0, 0, 256, 256], fill=(20, 24, 32))
            draw.line([(0, 128), (256, 128)], fill=(0, 240, 255), width=8)
            draw.line([(0, 16), (256, 16)], fill=(255, 0, 128), width=4)
            draw.line([(0, 240), (256, 240)], fill=(255, 0, 128), width=4)
        elif "stone" in env_id:
            # Gạch đá dungeon
            draw.rectangle([0, 0, 256, 256], fill=(55, 60, 70))
            for y in range(0, 256, 64):
                draw.line([(0, y), (256, y)], fill=(30, 35, 42), width=4)
            for x in range(0, 256, 64):
                draw.line([(x, 0), (x, 256)], fill=(30, 35, 42), width=4)
        elif "metal" in env_id:
            # Khung thép giàn
            draw.rectangle([0, 64, 256, 192], fill=(45, 52, 65), outline=(100, 115, 140), width=6)
            draw.line([(0, 64), (256, 192)], fill=(120, 140, 170), width=6)
            draw.line([(0, 192), (256, 64)], fill=(120, 140, 170), width=6)
        elif "billboard" in env_id:
            draw.rectangle([20, 40, 236, 216], fill=(15, 18, 25), outline=(0, 240, 255), width=8)
            draw.rectangle([40, 60, 216, 196], fill=(255, 0, 128))
            draw.ellipse([80, 90, 176, 166], fill=(255, 230, 0))
        elif "brick" in env_id:
            draw.rectangle([0, 0, 256, 256], fill=(75, 45, 40))
            for y in range(0, 256, 32):
                draw.line([(0, y), (256, y)], fill=(40, 20, 20), width=3)
        else: # torch
            draw.ellipse([100, 60, 156, 130], fill=(255, 120, 0))
            draw.ellipse([110, 80, 146, 120], fill=(255, 230, 50))
            draw.rectangle([118, 130, 138, 210], fill=(100, 70, 40))

        img.save(os.path.join(folder, "asset.png"))
        img.resize((128, 128)).save(os.path.join(folder, "thumb.png"))

def create_items_and_props():
    items = [
        ("health_potion", "Bình Thuốc Hồi Máu Đỏ", (255, 30, 60)),
        ("energy_crystal", "Pha Lê Năng Lượng Xanh", (0, 220, 255)),
        ("gold_coin", "Đồng Tiền Vàng May Mắn", (255, 215, 0)),
        ("treasure_chest", "Rương Báu Hoàng Kim", (180, 120, 40)),
        ("wooden_crate", "Thùng Gỗ Phá Hủy Được", (140, 90, 50)),
    ]

    for item_id, name_vn, col in items:
        folder = os.path.join(LIB_DIR, "items", item_id)
        os.makedirs(folder, exist_ok=True)
        
        meta = {
            "id": item_id,
            "name": name_vn,
            "category": "items",
            "description": f"Vật phẩm trò chơi: {name_vn}."
        }
        with open(os.path.join(folder, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        bx, by = 128, 128

        if "potion" in item_id:
            draw.ellipse([78, 100, 178, 210], fill=col, outline=(255, 255, 255), width=6)
            draw.rectangle([114, 40, 142, 100], fill=(220, 230, 240), outline=(255, 255, 255), width=4)
            draw.rectangle([106, 30, 150, 45], fill=(130, 80, 40))
        elif "crystal" in item_id:
            pts = [(bx, 30), (bx + 60, 128), (bx, 226), (bx - 60, 128)]
            draw.polygon(pts, fill=col, outline=(255, 255, 255), width=6)
            draw.polygon([(bx, 50), (bx + 40, 128), (bx, 206), (bx - 40, 128)], fill=(200, 245, 255))
        elif "coin" in item_id:
            draw.ellipse([48, 48, 208, 208], fill=col, outline=(200, 160, 0), width=10)
            draw.ellipse([78, 78, 178, 178], fill=(255, 235, 80), outline=(200, 160, 0), width=4)
            draw.rectangle([120, 98, 136, 158], fill=(200, 160, 0))
        elif "chest" in item_id:
            draw.rectangle([48, 100, 208, 200], fill=col, outline=(255, 215, 0), width=8)
            draw.arc([48, 50, 208, 140], start=180, end=0, fill=col, width=8)
            draw.rectangle([116, 120, 140, 160], fill=(255, 215, 0))
        else: # crate
            draw.rectangle([48, 48, 208, 208], fill=col, outline=(90, 50, 20), width=10)
            draw.line([(48, 48), (208, 208)], fill=(90, 50, 20), width=8)
            draw.line([(48, 208), (208, 48)], fill=(90, 50, 20), width=8)

        img.save(os.path.join(folder, "asset.png"))
        img.resize((128, 128)).save(os.path.join(folder, "thumb.png"))

def create_ui_hud():
    ui_items = [
        ("health_bar_cyber", "Thanh Máu Cyber Neon", "hud"),
        ("combo_rank_badge", "Huy Hiệu Combo Rank S", "hud"),
        ("action_skill_button", "Nút Kỹ Năng Hexagon Neon", "button"),
        ("virtual_joystick_pro", "Cần Gạt Cảm Ứng Virtual Joystick", "control"),
    ]

    for ui_id, name_vn, ui_type in ui_items:
        folder = os.path.join(LIB_DIR, "ui", ui_id)
        os.makedirs(folder, exist_ok=True)
        
        meta = {
            "id": ui_id,
            "name": name_vn,
            "category": "ui",
            "type": ui_type,
            "description": f"Thành phần Giao diện & HUD: {name_vn}."
        }
        with open(os.path.join(folder, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        bx, by = 128, 128

        if "health" in ui_id:
            # Khung HP bar
            draw.rectangle([10, 96, 246, 160], fill=(15, 18, 25), outline=(0, 240, 255), width=6)
            draw.rectangle([20, 106, 200, 150], fill=(0, 230, 118))
        elif "combo" in ui_id:
            draw.ellipse([48, 48, 208, 208], fill=(255, 0, 128), outline=(255, 230, 0), width=10)
            draw.ellipse([64, 64, 192, 192], fill=(20, 24, 35))
            # Chữ S
            draw.arc([100, 80, 156, 130], start=130, end=360, fill=(255, 230, 0), width=14)
            draw.arc([100, 125, 156, 175], start=0, end=230, fill=(255, 230, 0), width=14)
        elif "action" in ui_id:
            # Nút tròn action
            draw.ellipse([32, 32, 224, 224], fill=(20, 25, 38), outline=(0, 240, 255), width=8)
            draw.ellipse([50, 50, 206, 206], fill=(0, 180, 255))
            draw.line([(80, 128), (176, 128)], fill=(255, 255, 255), width=12)
            draw.line([(128, 80), (128, 176)], fill=(255, 255, 255), width=12)
        else: # joystick
            draw.ellipse([32, 32, 224, 224], fill=(15, 20, 30), outline=(100, 120, 160), width=6)
            draw.ellipse([88, 88, 168, 168], fill=(0, 240, 255), outline=(255, 255, 255), width=6)

        img.save(os.path.join(folder, "asset.png"))
        img.resize((128, 128)).save(os.path.join(folder, "thumb.png"))

if __name__ == "__main__":
    print("Generating comprehensive 2D Game Asset Library...")
    create_characters()
    create_combat_fx()
    create_environments()
    create_items_and_props()
    create_ui_hud()
    print("DONE! All 2D Assets generated into assets_library/")
