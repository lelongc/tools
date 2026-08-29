import os
import io
import math
import json
import base64
import urllib.request
from PIL import Image, ImageDraw

LIB_CHAR_DIR = r"d:\folder\tools\2d_studio\assets_library\characters\female_swordmaster"
os.makedirs(LIB_CHAR_DIR, exist_ok=True)

# PALETTE (Sleek Cyber Samurai Anime Palette)
C_HAIR = (255, 230, 245, 255)       # Tóc bạch kim ánh hồng
C_HAIR_SHADOW = (210, 170, 200, 255) # Bóng tóc
C_SKIN = (255, 224, 200, 255)       # Da trắng anime
C_SKIN_SHADOW = (230, 185, 160, 255)
C_EYES = (0, 240, 255, 255)         # Mắt xanh dạ quang
C_COAT = (24, 28, 42, 255)          # Áo choàng xanh đen
C_COAT_TRIM = (255, 0, 128, 255)    # Viền áo hồng neon
C_ARMOR = (50, 60, 85, 255)         # Giáp ngực / tay
C_ARMOR_HI = (100, 125, 170, 255)
C_BLADE = (0, 240, 255, 255)        # Lưỡi kiếm Katana ánh sáng
C_BLADE_HI = (255, 255, 255, 255)   # Sống kiếm trắng sáng
C_HILT = (255, 215, 0, 255)         # Chuôi kiếm vàng kim
C_BOOTS = (18, 20, 30, 255)

def draw_pixel_box(draw, x, y, w, h, fill, outline=None):
    draw.rectangle([x, y, x + w - 1, y + h - 1], fill=fill, outline=outline)

def draw_swordmaster_raw_64(act, idx):
    # 64x64 Pixel Art Canvas
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    bx, by = 32, 34

    if act == "idle":
        offset_y = int(math.sin(idx * math.pi / 2.0) * 1.5)
        wind_x = idx % 2

        # 1. Tóc sau
        draw_pixel_box(d, bx - 9 + wind_x, by - 16 + offset_y, 18, 14, C_HAIR_SHADOW)
        draw_pixel_box(d, bx - 11 + wind_x, by - 14 + offset_y, 22, 10, C_HAIR)

        # 2. Chân & Ủng
        draw_pixel_box(d, bx - 6, by + 12, 4, 14, C_BOOTS)
        draw_pixel_box(d, bx + 2, by + 12, 4, 14, C_BOOTS)
        # Viền neon ủng
        draw_pixel_box(d, bx - 6, by + 18, 4, 2, C_COAT_TRIM)
        draw_pixel_box(d, bx + 2, by + 18, 4, 2, C_COAT_TRIM)

        # 3. Váy / Tà áo choàng
        draw_pixel_box(d, bx - 7, by + 4 + offset_y, 14, 9, C_COAT)
        draw_pixel_box(d, bx - 8 + wind_x, by + 10 + offset_y, 16, 2, C_COAT_TRIM)

        # 4. Thân áo & Giáp ngực
        draw_pixel_box(d, bx - 5, by - 4 + offset_y, 10, 9, C_ARMOR)
        draw_pixel_box(d, bx - 4, by - 3 + offset_y, 8, 4, C_ARMOR_HI)
        # Thắt lưng vàng
        draw_pixel_box(d, bx - 6, by + 3 + offset_y, 12, 2, C_HILT)

        # 5. Đầu & Mặt
        draw_pixel_box(d, bx - 5, by - 13 + offset_y, 10, 9, C_SKIN)
        # Mắt to anime
        draw_pixel_box(d, bx - 3, by - 9 + offset_y, 2, 3, C_EYES)
        draw_pixel_box(d, bx + 1, by - 9 + offset_y, 2, 3, C_EYES)
        # Tròng đen / viền mi
        draw_pixel_box(d, bx - 3, by - 10 + offset_y, 2, 1, C_COAT)
        draw_pixel_box(d, bx + 1, by - 10 + offset_y, 2, 1, C_COAT)
        # Má hồng
        draw_pixel_box(d, bx - 4, by - 7 + offset_y, 1, 1, C_COAT_TRIM)
        draw_pixel_box(d, bx + 3, by - 7 + offset_y, 1, 1, C_COAT_TRIM)

        # 6. Mái tóc trước & Ruy băng
        draw_pixel_box(d, bx - 6, by - 15 + offset_y, 12, 4, C_HAIR)
        draw_pixel_box(d, bx - 7 + wind_x, by - 13 + offset_y, 3, 9, C_HAIR)
        draw_pixel_box(d, bx + 4 + wind_x, by - 13 + offset_y, 3, 9, C_HAIR)
        # Nơ / Kẹp tóc hồng
        draw_pixel_box(d, bx + 4, by - 15 + offset_y, 2, 2, C_COAT_TRIM)

        # 7. Tay & Thanh Katana giắt hông
        draw_pixel_box(d, bx - 8, by - 2 + offset_y, 3, 8, C_SKIN)
        draw_pixel_box(d, bx + 5, by - 2 + offset_y, 3, 8, C_SKIN)
        # Bao kiếm & Chuôi Katana
        draw_pixel_box(d, bx + 6, by - 3 + offset_y, 3, 3, C_HILT)
        draw_pixel_box(d, bx + 8, by - 8 + offset_y, 2, 5, C_BLADE)
        draw_pixel_box(d, bx + 5, by + 2 + offset_y, 3, 14, C_COAT, C_COAT_TRIM)

    elif act == "run":
        offset_y = (idx % 2) * -2
        lean_x = 3

        # 1. Chân sải bước chạy
        leg_states = [(-6, 4), (-10, 8), (4, -6), (8, -10)][idx]
        draw_pixel_box(d, bx - 3 + leg_states[0], by + 10, 4, 15, C_BOOTS)
        draw_pixel_box(d, bx + 1 + leg_states[1], by + 10, 4, 15, C_BOOTS)

        # 2. Tóc bay vút ra sau
        draw_pixel_box(d, bx - 14, by - 16 + offset_y, 12, 10, C_HAIR)
        draw_pixel_box(d, bx - 18, by - 13 + offset_y, 6, 6, C_HAIR_SHADOW)

        # 3. Thân & Váy nghiêng tới
        draw_pixel_box(d, bx - 5 + lean_x, by + 3 + offset_y, 12, 8, C_COAT)
        draw_pixel_box(d, bx - 4 + lean_x, by - 4 + offset_y, 10, 8, C_ARMOR)

        # 4. Đầu & Mặt
        draw_pixel_box(d, bx - 4 + lean_x, by - 13 + offset_y, 10, 9, C_SKIN)
        draw_pixel_box(d, bx + 1 + lean_x, by - 9 + offset_y, 2, 3, C_EYES)
        draw_pixel_box(d, bx - 5 + lean_x, by - 15 + offset_y, 12, 4, C_HAIR)

        # 5. Cầm kiếm rút sẵn nghiêng tay
        draw_pixel_box(d, bx + 6 + lean_x, by - 2 + offset_y, 3, 3, C_HILT)
        draw_pixel_box(d, bx + 9 + lean_x, by - 12 + offset_y, 2, 12, C_BLADE)

    elif act == "attack":
        if idx == 0: # Chuẩn bị rút kiếm (Iai stance)
            draw_pixel_box(d, bx - 6, by + 12, 5, 14, C_BOOTS)
            draw_pixel_box(d, bx + 2, by + 12, 5, 14, C_BOOTS)
            draw_pixel_box(d, bx - 5, by - 2, 10, 14, C_COAT)
            draw_pixel_box(d, bx - 4, by - 11, 10, 9, C_SKIN)
            draw_pixel_box(d, bx - 5, by - 13, 12, 4, C_HAIR)
            draw_pixel_box(d, bx + 2, by - 7, 2, 2, C_EYES)
            # Tay đặt lên chuôi kiếm sẵn sàng rút
            draw_pixel_box(d, bx + 4, by, 4, 4, C_HILT)
            draw_pixel_box(d, bx + 6, by - 10, 2, 10, C_BLADE)

        elif idx == 1: # Chém vung cực mạnh (Slash 1 - Crescent Blade)
            draw_pixel_box(d, bx - 4, by + 10, 5, 16, C_BOOTS)
            draw_pixel_box(d, bx + 4, by + 10, 5, 16, C_BOOTS)
            draw_pixel_box(d, bx - 5, by - 4, 12, 14, C_ARMOR)
            draw_pixel_box(d, bx - 3, by - 13, 10, 9, C_SKIN)
            draw_pixel_box(d, bx - 5, by - 15, 12, 4, C_HAIR)
            draw_pixel_box(d, bx + 2, by - 9, 2, 3, C_EYES)
            # Lưỡi Katana vung chéo
            draw_pixel_box(d, bx + 6, by - 4, 4, 4, C_HILT)
            d.line([(bx + 8, by - 4), (bx + 26, by - 20)], fill=C_BLADE, width=3)
            d.line([(bx + 9, by - 5), (bx + 25, by - 19)], fill=C_BLADE_HI, width=1)
            # Vệt chém trăng khuyết khổng lồ (Slash VFX)
            d.arc([bx - 10, by - 28, bx + 32, by + 14], start=210, end=350, fill=C_BLADE, width=4)
            d.arc([bx - 8, by - 26, bx + 30, by + 12], start=220, end=340, fill=C_BLADE_HI, width=2)

        elif idx == 2: # Xoay chém đòn 2 hất tung (Slash 2 - Rising Moon)
            draw_pixel_box(d, bx - 6, by + 8, 5, 18, C_BOOTS)
            draw_pixel_box(d, bx + 2, by + 8, 5, 18, C_BOOTS)
            draw_pixel_box(d, bx - 4, by - 5, 12, 14, C_ARMOR)
            draw_pixel_box(d, bx - 3, by - 14, 10, 9, C_SKIN)
            draw_pixel_box(d, bx - 5, by - 16, 12, 4, C_HAIR)
            # Katana chém ngược lên
            draw_pixel_box(d, bx + 4, by - 16, 4, 4, C_HILT)
            d.line([(bx + 6, by - 16), (bx + 18, by - 32)], fill=C_COAT_TRIM, width=4)
            d.line([(bx + 7, by - 17), (bx + 17, by - 31)], fill=C_BLADE_HI, width=2)
            # Vệt kiếm khí hồng neon
            d.arc([bx - 16, by - 34, bx + 28, by + 10], start=0, end=180, fill=C_COAT_TRIM, width=5)

        else: # Thu hồi kiếm tra vào bao
            draw_pixel_box(d, bx - 6, by + 12, 4, 14, C_BOOTS)
            draw_pixel_box(d, bx + 2, by + 12, 4, 14, C_BOOTS)
            draw_pixel_box(d, bx - 5, by - 4, 10, 14, C_ARMOR)
            draw_pixel_box(d, bx - 5, by - 13, 10, 9, C_SKIN)
            draw_pixel_box(d, bx - 6, by - 15, 12, 4, C_HAIR)
            draw_pixel_box(d, bx + 1, by - 9, 2, 3, C_EYES)
            draw_pixel_box(d, bx + 5, by - 2, 3, 3, C_HILT)
            draw_pixel_box(d, bx + 7, by - 8, 2, 6, C_BLADE)
            # Tia sáng lấp lánh ở chuôi kiếm
            draw_pixel_box(d, bx + 6, by - 3, 1, 1, (255, 255, 255, 255))

    elif act == "hurt":
        lean_x = -6 * (idx + 1)
        draw_pixel_box(d, bx - 6 + lean_x, by + 12, 4, 14, C_BOOTS)
        draw_pixel_box(d, bx + 2 + lean_x, by + 12, 4, 14, C_BOOTS)
        draw_pixel_box(d, bx - 5 + lean_x, by - 4, 10, 14, (255, 80, 100, 255))
        draw_pixel_box(d, bx - 5 + lean_x, by - 13, 10, 9, (255, 180, 180, 255))
        draw_pixel_box(d, bx - 6 + lean_x, by - 15, 12, 4, C_HAIR)

    elif act == "death":
        rot_y = idx * 5
        draw_pixel_box(d, bx - 10, by + 10 + rot_y, 20, 10, (100, 110, 130, 255))
        draw_pixel_box(d, bx - 14, by + 12 + rot_y, 8, 8, (180, 190, 200, 255))
        # Thanh kiếm cắm xuống đất
        d.line([(bx + 12, by + 6), (bx + 12, by + 26)], fill=C_BLADE, width=2)
        draw_pixel_box(d, bx + 11, by + 4, 3, 3, C_HILT)

    # Upscale 64x64 -> 256x256 via Nearest Neighbor for crisp pixel-art!
    return img.resize((256, 256), Image.Resampling.NEAREST)

def generate_full_female_swordmaster():
    clips = {
        "idle": [],
        "run": [],
        "attack": [],
        "hurt": [],
        "death": []
    }
    actions = [("idle", 4), ("run", 4), ("attack", 4), ("hurt", 2), ("death", 4)]
    
    for act, count in actions:
        for i in range(count):
            img_256 = draw_swordmaster_raw_64(act, i)
            f_path = os.path.join(LIB_CHAR_DIR, f"{act}_{i}.png")
            img_256.save(f_path)
            
            buf = io.BytesIO()
            img_256.save(buf, format="PNG")
            b64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")
            clips[act].append(b64)

    # Save thumb
    img_thumb = Image.open(os.path.join(LIB_CHAR_DIR, "idle_0.png"))
    img_thumb.resize((128, 128)).save(os.path.join(LIB_CHAR_DIR, "thumb.png"))
    
    return clips

if __name__ == "__main__":
    print("Generating High-Quality Female Swordmaster Pixel Art...")
    clips = generate_full_female_swordmaster()
    print("DONE! Generated all 5 animation clips for Female Swordmaster!")
