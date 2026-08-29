import os
import math
from PIL import Image, ImageDraw, ImageFilter

TEXTURES_DIR = r"d:\folder\tools\godot_demo\2\textures"
os.makedirs(TEXTURES_DIR, exist_ok=True)
SIZE = 256  # 256x256 is super lightweight and crisp for mobile!

def create_cute_road():
    # Cute candy pastel road: Soft sky-blue/indigo asphalt with warm sunshine dashed lines and pastel edge lines
    img = Image.new("RGBA", (SIZE, SIZE), (70, 85, 130, 255))
    draw = ImageDraw.Draw(img)
    
    # Left and Right pastel cyan curb stripes
    draw.rectangle([0, 0, 16, SIZE], fill=(100, 220, 255, 255))
    draw.rectangle([SIZE - 16, 0, SIZE, SIZE], fill=(100, 220, 255, 255))
    
    # Center dashed yellow line
    for y in range(0, SIZE, 64):
        draw.rounded_rectangle([SIZE//2 - 6, y + 10, SIZE//2 + 6, y + 54], radius=4, fill=(255, 225, 60, 255))
        
    save_path = os.path.join(TEXTURES_DIR, "road_texture.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_danger_stripes():
    # Cute pink-yellow candy warning stripes
    img = Image.new("RGBA", (SIZE, SIZE), (255, 215, 60, 255))
    draw = ImageDraw.Draw(img)
    stripe_w = 32
    for offset in range(-SIZE, SIZE * 2, stripe_w * 2):
        pts = [(offset, 0), (offset + stripe_w, 0), (offset + stripe_w + SIZE, SIZE), (offset + SIZE, SIZE)]
        draw.polygon(pts, fill=(255, 80, 120, 255))
    save_path = os.path.join(TEXTURES_DIR, "danger_stripes.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_gate_bonus():
    # Glowing rainbow hologram glass
    img = Image.new("RGBA", (SIZE, SIZE), (40, 220, 160, 210))
    draw = ImageDraw.Draw(img)
    # Shiny sparkles and gradient grid
    for y in range(0, SIZE, 32):
        draw.line([(0, y), (SIZE, y)], fill=(255, 255, 255, 80), width=2)
    for x in range(0, SIZE, 32):
        draw.line([(x, 0), (x, SIZE)], fill=(255, 255, 255, 80), width=2)
    draw.ellipse([SIZE//2 - 40, SIZE//2 - 40, SIZE//2 + 40, SIZE//2 + 40], fill=(255, 255, 255, 140))
    save_path = os.path.join(TEXTURES_DIR, "gate_bonus.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_giraffe_skin():
    img = Image.new("RGBA", (SIZE, SIZE), (255, 205, 50, 255))
    draw = ImageDraw.Draw(img)
    spots = [
        (40, 40, 24, 18),
        (120, 35, 26, 20),
        (200, 45, 22, 24),
        (70, 110, 28, 22),
        (160, 100, 24, 26),
        (230, 120, 20, 18),
        (35, 180, 22, 26),
        (120, 175, 26, 22),
        (200, 190, 25, 24),
        (80, 240, 22, 20),
        (160, 245, 26, 22),
    ]
    for cx, cy, rx, ry in spots:
        for ox in [-SIZE, 0, SIZE]:
            for oy in [-SIZE, 0, SIZE]:
                x = cx + ox
                y = cy + oy
                draw.ellipse([x - rx - 2, y - ry - 2, x + rx + 2, y + ry + 2], fill=(190, 100, 30, 255))
                draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=(140, 65, 20, 255))
    save_path = os.path.join(TEXTURES_DIR, "giraffe_skin.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_flamingo_skin():
    img = Image.new("RGBA", (SIZE, SIZE), (255, 150, 190, 255))
    draw = ImageDraw.Draw(img)
    row_h = 24
    col_w = 32
    for row, y in enumerate(range(-row_h, SIZE + row_h, row_h)):
        offset_x = (col_w // 2) if (row % 2 == 1) else 0
        for x in range(-col_w + offset_x, SIZE + col_w, col_w):
            draw.ellipse([x - 14, y, x + 14, y + 28], fill=(255, 110, 165, 240), outline=(255, 220, 240, 255), width=2)
    save_path = os.path.join(TEXTURES_DIR, "flamingo_skin.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_cyber_skin():
    img = Image.new("RGBA", (SIZE, SIZE), (20, 40, 70, 255))
    draw = ImageDraw.Draw(img)
    for y in range(0, SIZE, 32):
        draw.line([(0, y), (SIZE, y)], fill=(40, 200, 240, 140), width=2)
    for x in range(0, SIZE, 32):
        draw.line([(x, 0), (x, SIZE)], fill=(40, 200, 240, 140), width=2)
    for cy in range(16, SIZE, 32):
        for cx in range(16, SIZE, 32):
            draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 80, 220, 255))
    save_path = os.path.join(TEXTURES_DIR, "cyber_skin.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

def create_cute_gold_skin():
    img = Image.new("RGBA", (SIZE, SIZE), (255, 200, 40, 255))
    draw = ImageDraw.Draw(img)
    for row, y in enumerate(range(0, SIZE, 24)):
        ox = 16 if row % 2 == 1 else 0
        for x in range(-16 + ox, SIZE + 16, 32):
            pts = [(x, y), (x + 16, y - 12), (x + 32, y), (x + 16, y + 12)]
            draw.polygon(pts, fill=(255, 225, 80, 255), outline=(210, 150, 15, 255))
    save_path = os.path.join(TEXTURES_DIR, "gold_skin.png")
    img.save(save_path, "PNG", optimize=True)
    print(f"[OK] {save_path}")

if __name__ == "__main__":
    create_cute_road()
    create_cute_danger_stripes()
    create_cute_gate_bonus()
    create_cute_giraffe_skin()
    create_cute_flamingo_skin()
    create_cute_cyber_skin()
    create_cute_gold_skin()
    print("All textures created successfully!")
