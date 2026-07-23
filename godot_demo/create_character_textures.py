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

# 1. NEKO CAT
def make_neko_cat_tex():
    img, draw = create_blank_texture("#FFFDF0")
    draw.ellipse([280, 160, 512, 420], fill="#CDB4DB")
    draw.ellipse([512, 160, 744, 420], fill="#98D7C2")
    draw.ellipse([340, 320, 684, 660], fill="#FFFDF0")
    eye_r = 18
    draw.ellipse([442 - eye_r, 450 - eye_r, 442 + eye_r, 450 + eye_r], fill="#4A3E3D")
    draw.ellipse([582 - eye_r, 450 - eye_r, 582 + eye_r, 450 + eye_r], fill="#4A3E3D")
    draw.ellipse([512 - 12, 470 - 8, 512 + 12, 470 + 8], fill="#FF85A2")
    draw.arc([486, 476, 512, 502], 0, 180, fill="#4A3E3D", width=5)
    draw.arc([512, 476, 538, 502], 0, 180, fill="#4A3E3D", width=5)
    draw.ellipse([380 - 24, 490 - 14, 380 + 24, 490 + 14], fill="#FFB7B2")
    draw.ellipse([644 - 24, 490 - 14, 644 + 24, 490 + 14], fill="#FFB7B2")
    colors_whiskers = ["#CDB4DB", "#FFB7B2", "#98D7C2"]
    for i, col in enumerate(colors_whiskers):
        y_off = (i - 1) * 20
        draw.line([(310, 480 + y_off), (370, 475 + y_off)], fill=col, width=7)
        draw.line([(654, 475 + y_off), (714, 480 + y_off)], fill=col, width=7)
    draw_jelly_feet_uv(draw, 512, 660, ["#FFB7B2", "#FFDAC1", "#98D7C2", "#CDB4DB"])
    save_texture(img, "neko_cat_tex.png")

# 2. PINKY BEAR
def make_pinky_bear_tex():
    img, draw = create_blank_texture("#FFC6FF")
    draw.ellipse([400, 420, 624, 550], fill="#FFFDF0")
    draw.ellipse([512 - 14, 450, 512 + 14, 476], fill="#4A3E3D")
    draw.line([(512, 476), (512, 496)], fill="#4A3E3D", width=5)
    eye_r = 18
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([370 - 24, 485 - 14, 370 + 24, 485 + 14], fill="#FF6584")
    draw.ellipse([654 - 24, 485 - 14, 654 + 24, 485 + 14], fill="#FF6584")
    draw_jelly_feet_uv(draw, 512, 660, ["#FFC6FF", "#FFB7B2", "#FFDAC1"])
    save_texture(img, "pinky_bear_tex.png")

# 3. FROGGO
def make_froggo_tex():
    img, draw = create_blank_texture("#B5EAD7")
    draw.ellipse([380, 520, 644, 670], fill="#FFFFD1")
    eye_r = 20
    draw.ellipse([420 - eye_r, 390 - eye_r, 420 + eye_r, 390 + eye_r], fill="#4A3E3D")
    draw.ellipse([604 - eye_r, 390 - eye_r, 604 + eye_r, 390 + eye_r], fill="#4A3E3D")
    draw.ellipse([414 - 6, 384 - 6, 414 + 6, 384 + 6], fill="#FFFDF0")
    draw.ellipse([598 - 6, 384 - 6, 598 + 6, 384 + 6], fill="#FFFDF0")
    draw.ellipse([360 - 24, 450 - 14, 360 + 24, 450 + 14], fill="#FFB7B2")
    draw.ellipse([664 - 24, 450 - 14, 664 + 24, 450 + 14], fill="#FFB7B2")
    draw_jelly_feet_uv(draw, 512, 670, ["#B5EAD7", "#FFFFD1", "#98D7C2"])
    save_texture(img, "froggo_tex.png")

# 4. BUNNY
def make_bunny_tex():
    img, draw = create_blank_texture("#FFFFF5")
    draw.ellipse([380, 520, 644, 670], fill="#FFD1DC")
    draw.ellipse([512 - 12, 460, 512 + 12, 482], fill="#FF85A2")
    eye_r = 18
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([370 - 24, 485 - 14, 370 + 24, 485 + 14], fill="#FF6584")
    draw.ellipse([654 - 24, 485 - 14, 654 + 24, 485 + 14], fill="#FF6584")
    draw_jelly_feet_uv(draw, 512, 660, ["#FFFFF5", "#FFD1DC", "#FFB7B2"])
    save_texture(img, "bunny_tex.png")

# 5. SHIBA DOG
def make_shiba_dog_tex():
    img, draw = create_blank_texture("#F4A261")
    # White Muzzle & Eyebrows
    draw.ellipse([360, 420, 664, 620], fill="#FFFDF0")
    draw.ellipse([410, 380, 450, 405], fill="#FFFDF0")
    draw.ellipse([574, 380, 614, 405], fill="#FFFDF0")
    # Nose & Mouth
    draw.ellipse([512 - 16, 460, 512 + 16, 486], fill="#4A3E3D")
    draw.line([(512, 486), (512, 506)], fill="#4A3E3D", width=5)
    # Eyes
    eye_r = 18
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#4A3E3D")
    # Feet
    draw_jelly_feet_uv(draw, 512, 660, ["#F4A261", "#FFFDF0", "#E76F51"])
    save_texture(img, "shiba_dog_tex.png")

# 6. PANDA
def make_panda_tex():
    img, draw = create_blank_texture("#FFFFFF")
    # Black Eye Patches
    draw.ellipse([380, 410, 470, 490], fill="#333333")
    draw.ellipse([554, 410, 644, 490], fill="#333333")
    # Eyes Inside Patches
    draw.ellipse([425 - 10, 450 - 10, 425 + 10, 450 + 10], fill="#FFFFFF")
    draw.ellipse([599 - 10, 450 - 10, 599 + 10, 450 + 10], fill="#FFFFFF")
    # Nose
    draw.ellipse([512 - 14, 470, 512 + 14, 494], fill="#333333")
    # Blush
    draw.ellipse([360 - 20, 495 - 12, 360 + 20, 495 + 12], fill="#FFB7B2")
    draw.ellipse([664 - 20, 495 - 12, 664 + 20, 495 + 12], fill="#FFB7B2")
    draw_jelly_feet_uv(draw, 512, 660, ["#333333", "#FFFFFF", "#333333"])
    save_texture(img, "panda_tex.png")

# 7. PENGUIN
def make_penguin_tex():
    img, draw = create_blank_texture("#4EA8DE")
    # White Belly/Face Patch
    draw.ellipse([340, 360, 684, 680], fill="#FFFFFF")
    # Orange Beak
    draw.polygon([(482, 470), (542, 470), (512, 510)], fill="#F4A261")
    # Eyes
    eye_r = 16
    draw.ellipse([430 - eye_r, 435 - eye_r, 430 + eye_r, 435 + eye_r], fill="#111111")
    draw.ellipse([594 - eye_r, 435 - eye_r, 594 + eye_r, 435 + eye_r], fill="#111111")
    draw_jelly_feet_uv(draw, 512, 660, ["#F4A261", "#FFFFFF", "#F4A261"])
    save_texture(img, "penguin_tex.png")

# 8. AXOLOTL
def make_axolotl_tex():
    img, draw = create_blank_texture("#FFB7B2")
    # Eyes
    eye_r = 16
    draw.ellipse([430 - eye_r, 445 - eye_r, 430 + eye_r, 445 + eye_r], fill="#4A3E3D")
    draw.ellipse([594 - eye_r, 445 - eye_r, 594 + eye_r, 445 + eye_r], fill="#4A3E3D")
    # Mouth
    draw.arc([490, 465, 534, 490], 0, 180, fill="#4A3E3D", width=4)
    # Blush
    draw.ellipse([370 - 24, 485 - 14, 370 + 24, 485 + 14], fill="#FF4081")
    draw.ellipse([654 - 24, 485 - 14, 654 + 24, 485 + 14], fill="#FF4081")
    draw_jelly_feet_uv(draw, 512, 660, ["#FFB7B2", "#FF4081", "#FFD1DC"])
    save_texture(img, "axolotl_tex.png")

# 9. PIGGY
def make_piggy_tex():
    img, draw = create_blank_texture("#FFACC7")
    # Pig Snout
    draw.ellipse([452, 445, 572, 505], fill="#FF85A2")
    draw.ellipse([482 - 8, 475 - 12, 482 + 8, 475 + 12], fill="#4A3E3D")
    draw.ellipse([542 - 8, 475 - 12, 542 + 8, 475 + 12], fill="#4A3E3D")
    # Eyes
    eye_r = 16
    draw.ellipse([410 - eye_r, 435 - eye_r, 410 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([614 - eye_r, 435 - eye_r, 614 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw_jelly_feet_uv(draw, 512, 660, ["#FFACC7", "#FF85A2", "#FFACC7"])
    save_texture(img, "piggy_tex.png")

# 10. DUCKY
def make_ducky_tex():
    img, draw = create_blank_texture("#FFD166")
    # Orange Duck Beak
    draw.ellipse([442, 460, 582, 515], fill="#F4A261")
    # Eyes
    eye_r = 16
    draw.ellipse([420 - eye_r, 435 - eye_r, 420 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw.ellipse([604 - eye_r, 435 - eye_r, 604 + eye_r, 435 + eye_r], fill="#4A3E3D")
    draw_jelly_feet_uv(draw, 512, 660, ["#FFD166", "#F4A261", "#FFD166"])
    save_texture(img, "ducky_tex.png")

make_neko_cat_tex()
make_pinky_bear_tex()
make_froggo_tex()
make_bunny_tex()
make_shiba_dog_tex()
make_panda_tex()
make_penguin_tex()
make_axolotl_tex()
make_piggy_tex()
make_ducky_tex()

print("All 10 character UV textures generated successfully!")
