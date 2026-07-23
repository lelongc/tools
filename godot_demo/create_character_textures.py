import os
import math
from PIL import Image, ImageDraw

output_dir = r"D:\folder\tools\godot_demo\assets"
os.makedirs(output_dir, exist_ok=True)

TEX_SIZE = 1024

def create_blank_texture(fill_color):
    img = Image.new("RGBA", (TEX_SIZE, TEX_SIZE), fill_color)
    draw = ImageDraw.Draw(img)
    return img, draw

def save_texture(img, filename):
    out_path = os.path.join(output_dir, filename)
    img.save(out_path, "PNG")
    print(f"Saved texture: {out_path}")

def draw_jelly_feet_uv(draw, cx, cy, colors):
    num = len(colors)
    foot_w = 90
    foot_h = 55
    start_x = cx - ((num - 1) * foot_w * 0.7) / 2
    for i, color in enumerate(colors):
        fx = start_x + i * foot_w * 0.7 - foot_w / 2
        fy = cy - foot_h / 2
        draw.ellipse([fx, fy, fx + foot_w, fy + foot_h], fill=color, outline="#FFFFFF", width=3)

# ----------------------------------------------------
# 1. NEKO CAT TEXTURE (Centered Compact Cute Face!)
# ----------------------------------------------------
def make_neko_cat_tex():
    img, draw = create_blank_texture("#FFFDF0")
    cx, cy = 512, 512
    
    # Top Ear/Head Patches (Left Purple, Right Mint)
    draw.ellipse([280, 160, 512, 420], fill="#CDB4DB")
    draw.ellipse([512, 160, 744, 420], fill="#98D7C2")
    
    # Cream Face Center Overlay
    draw.ellipse([340, 320, 684, 660], fill="#FFFDF0")
    
    # Eyes (Centered closer together: X=442, X=582, Y=450)
    eye_r = 18
    draw.ellipse([442 - eye_r, 450 - eye_r, 442 + eye_r, 450 + eye_r], fill="#4A3E3D")
    draw.ellipse([582 - eye_r, 450 - eye_r, 582 + eye_r, 450 + eye_r], fill="#4A3E3D")
    
    # Pink Nose
    draw.ellipse([512 - 12, 470 - 8, 512 + 12, 470 + 8], fill="#FF85A2")
    
    # :3 Cute Cat Mouth
    draw.arc([486, 476, 512, 502], 0, 180, fill="#4A3E3D", width=5)
    draw.arc([512, 476, 538, 502], 0, 180, fill="#4A3E3D", width=5)
    
    # Rosy Blush
    draw.ellipse([380 - 24, 490 - 14, 380 + 24, 490 + 14], fill="#FFB7B2")
    draw.ellipse([644 - 24, 490 - 14, 644 + 24, 490 + 14], fill="#FFB7B2")
    
    # 3 Whiskers per side (Compact)
    colors_whiskers = ["#CDB4DB", "#FFB7B2", "#98D7C2"]
    for i, col in enumerate(colors_whiskers):
        y_off = (i - 1) * 20
        draw.line([(310, 480 + y_off), (370, 475 + y_off)], fill=col, width=7)
        draw.line([(654, 475 + y_off), (714, 480 + y_off)], fill=col, width=7)
        
    # Jelly Feet positioned higher up (Y=660) so they show perfectly on front!
    draw_jelly_feet_uv(draw, 512, 660, ["#FFB7B2", "#FFDAC1", "#98D7C2", "#CDB4DB"])
    
    save_texture(img, "neko_cat_tex.png")

# ----------------------------------------------------
# 2. PINKY BEAR TEXTURE
# ----------------------------------------------------
def make_pinky_bear_tex():
    img, draw = create_blank_texture("#FFC6FF")
    
    # White Snout
    draw.ellipse([400, 420, 624, 550], fill="#FFFDF0")
    
    # Nose & Mouth
    draw.ellipse([512 - 14, 450, 512 + 14, 476], fill="#4A3E3D")
    draw.line([(512, 476), (512, 496)], fill="#4A3E3D", width=5)
    
    # Eyes
    eye_r = 18
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#4A3E3D")
    
    # Blush
    draw.ellipse([370 - 24, 485 - 14, 370 + 24, 485 + 14], fill="#FF6584")
    draw.ellipse([654 - 24, 485 - 14, 654 + 24, 485 + 14], fill="#FF6584")
    
    # Feet
    draw_jelly_feet_uv(draw, 512, 660, ["#FFC6FF", "#FFB7B2", "#FFDAC1"])
    
    save_texture(img, "pinky_bear_tex.png")

# ----------------------------------------------------
# 3. FROGGO TEXTURE
# ----------------------------------------------------
def make_froggo_tex():
    img, draw = create_blank_texture("#B5EAD7")
    
    # Pale Yellow Belly
    draw.ellipse([380, 520, 644, 670], fill="#FFFFD1")
    
    # Frog Eyes
    eye_r = 20
    draw.ellipse([420 - eye_r, 390 - eye_r, 420 + eye_r, 390 + eye_r], fill="#4A3E3D")
    draw.ellipse([604 - eye_r, 390 - eye_r, 604 + eye_r, 390 + eye_r], fill="#4A3E3D")
    
    # Eye Shine
    draw.ellipse([414 - 6, 384 - 6, 414 + 6, 384 + 6], fill="#FFFDF0")
    draw.ellipse([598 - 6, 384 - 6, 598 + 6, 384 + 6], fill="#FFFDF0")
    
    # Blush
    draw.ellipse([360 - 24, 450 - 14, 360 + 24, 450 + 14], fill="#FFB7B2")
    draw.ellipse([664 - 24, 450 - 14, 664 + 24, 450 + 14], fill="#FFB7B2")
    
    # Feet
    draw_jelly_feet_uv(draw, 512, 670, ["#B5EAD7", "#FFFFD1", "#98D7C2"])
    
    save_texture(img, "froggo_tex.png")

# ----------------------------------------------------
# 4. BUNNY TEXTURE
# ----------------------------------------------------
def make_bunny_tex():
    img, draw = create_blank_texture("#FFFFF5")
    
    # Pink Belly
    draw.ellipse([380, 520, 644, 670], fill="#FFD1DC")
    
    # Pink Nose
    draw.ellipse([512 - 12, 460, 512 + 12, 482], fill="#FF85A2")
    
    # Eyes
    eye_r = 18
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#4A3E3D")
    
    # Blush
    draw.ellipse([370 - 24, 485 - 14, 370 + 24, 485 + 14], fill="#FF6584")
    draw.ellipse([654 - 24, 485 - 14, 654 + 24, 485 + 14], fill="#FF6584")
    
    # Feet
    draw_jelly_feet_uv(draw, 512, 660, ["#FFFFF5", "#FFD1DC", "#FFB7B2"])
    
    save_texture(img, "bunny_tex.png")

make_neko_cat_tex()
make_pinky_bear_tex()
make_froggo_tex()
make_bunny_tex()

print("All 4 refined compact UV textures generated successfully!")
