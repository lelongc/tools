import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter

TEXTURES_DIR = r"d:\folder\tools\godot_demo\2\textures"
os.makedirs(TEXTURES_DIR, exist_ok=True)
SIZE = 512

def create_seamless_giraffe_skin():
    # Vibrant warm yellow background with smooth rounded cartoon brown spots
    img = Image.new("RGBA", (SIZE, SIZE), (255, 195, 30, 255))
    draw = ImageDraw.Draw(img)
    
    # Spot centers with periodic boundary conditions
    spots = [
        (80, 80, 45, 35, 15),
        (230, 70, 50, 40, -20),
        (390, 90, 40, 45, 10),
        (140, 220, 55, 45, 30),
        (310, 200, 48, 52, -15),
        (460, 240, 42, 38, 25),
        (70, 360, 45, 50, -10),
        (240, 350, 52, 42, 20),
        (400, 370, 48, 46, -30),
        (160, 470, 44, 40, 5),
        (320, 480, 50, 45, -25),
    ]
    
    spot_color = (130, 60, 20, 255)       # Rich warm brown
    spot_border = (180, 95, 30, 255)      # Slightly lighter warm rim
    
    def draw_spot(cx, cy, rx, ry, angle):
        # Draw with periodic wrap for seamless tiling
        for ox in [-SIZE, 0, SIZE]:
            for oy in [-SIZE, 0, SIZE]:
                x = cx + ox
                y = cy + oy
                if -100 <= x <= SIZE + 100 and -100 <= y <= SIZE + 100:
                    draw.ellipse([x - rx - 4, y - ry - 4, x + rx + 4, y + ry + 4], fill=spot_border)
                    draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=spot_color)
    
    for s in spots:
        draw_spot(s[0], s[1], s[2], s[3], s[4])
        
    img = img.filter(ImageFilter.GaussianBlur(1.0))
    save_path = os.path.join(TEXTURES_DIR, "giraffe_skin.png")
    img.save(save_path, "PNG")
    print(f"[OK] Generated seamless: {save_path}")

def create_seamless_cyber_skin():
    # Dark cyan/neon tech grid with glowing circuits
    img = Image.new("RGBA", (SIZE, SIZE), (15, 35, 60, 255))
    draw = ImageDraw.Draw(img)
    
    step = 64
    for y in range(0, SIZE + step, step):
        draw.line([(0, y), (SIZE, y)], fill=(30, 180, 220, 120), width=2)
    for x in range(0, SIZE + step, step):
        draw.line([(x, 0), (x, SIZE)], fill=(30, 180, 220, 120), width=2)
        
    for y in range(0, SIZE + step, step):
        for x in range(0, SIZE + step, step):
            draw.ellipse([x-5, y-5, x+5, y+5], fill=(220, 50, 255, 220))
            draw.ellipse([x-2, y-2, x+2, y+2], fill=(255, 255, 255, 255))
            
    for cy in range(32, SIZE, 64):
        for cx in range(32, SIZE, 64):
            pts = [(cx, cy-12), (cx+12, cy), (cx, cy+12), (cx-12, cy)]
            draw.polygon(pts, outline=(0, 240, 255, 180), fill=(20, 70, 110, 200))
            
    save_path = os.path.join(TEXTURES_DIR, "cyber_skin.png")
    img.save(save_path, "PNG")
    print(f"[OK] Generated seamless: {save_path}")

def create_seamless_flamingo_skin():
    # Pastel pink with scallop feather pattern
    img = Image.new("RGBA", (SIZE, SIZE), (255, 140, 180, 255))
    draw = ImageDraw.Draw(img)
    
    row_h = 48
    col_w = 64
    for row, y in enumerate(range(-row_h, SIZE + row_h, row_h)):
        offset_x = (col_w // 2) if (row % 2 == 1) else 0
        for x in range(-col_w + offset_x, SIZE + col_w, col_w):
            draw.ellipse([x - 28, y, x + 28, y + 56], fill=(255, 105, 155, 240), outline=(255, 210, 230, 255), width=3)
            draw.ellipse([x - 14, y + 12, x + 14, y + 42], fill=(255, 170, 200, 200))
            
    save_path = os.path.join(TEXTURES_DIR, "flamingo_skin.png")
    img.save(save_path, "PNG")
    print(f"[OK] Generated seamless: {save_path}")

def create_seamless_gold_skin():
    # Golden scales / luxury diamond facets
    img = Image.new("RGBA", (SIZE, SIZE), (245, 190, 25, 255))
    draw = ImageDraw.Draw(img)
    
    step_y = 64
    step_x = 64
    for row, y in enumerate(range(-step_y, SIZE + step_y, step_y)):
        ox = (step_x // 2) if (row % 2 == 1) else 0
        for x in range(-step_x + ox, SIZE + step_x, step_x):
            pts = [(x, y), (x + 32, y + 32), (x, y + 64), (x - 32, y + 32)]
            draw.polygon(pts, fill=(255, 215, 60, 255), outline=(200, 140, 10, 255))
            inner_pts = [(x, y + 10), (x + 20, y + 32), (x, y + 54), (x - 20, y + 32)]
            draw.polygon(inner_pts, fill=(255, 240, 140, 200))
            
    save_path = os.path.join(TEXTURES_DIR, "gold_skin.png")
    img.save(save_path, "PNG")
    print(f"[OK] Generated seamless: {save_path}")

if __name__ == "__main__":
    create_seamless_giraffe_skin()
    create_seamless_cyber_skin()
    create_seamless_flamingo_skin()
    create_seamless_gold_skin()
