import os
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
    print(f"Saved clean texture: {out_path}")

def draw_shiny_eyes(draw, x1, y1, x2, y2, eye_r=18, eye_color="#4A3E3D"):
    draw.ellipse([x1 - eye_r, y1 - eye_r, x1 + eye_r, y1 + eye_r], fill=eye_color)
    draw.ellipse([x2 - eye_r, y2 - eye_r, x2 + eye_r, y2 + eye_r], fill=eye_color)
    sp_r = 6
    draw.ellipse([x1 - 6 - sp_r, y1 - 6 - sp_r, x1 - 6 + sp_r, y1 - 6 + sp_r], fill="#FFFFFF")
    draw.ellipse([x2 - 6 - sp_r, y2 - 6 - sp_r, x2 - 6 + sp_r, y2 - 6 + sp_r], fill="#FFFFFF")

# 1. NEKO CAT
def make_neko_cat_tex():
    img, draw = create_blank_texture("#FFFDF0")
    draw.ellipse([260, 140, 512, 400], fill="#CDB4DB")
    draw.ellipse([512, 140, 764, 400], fill="#98D7C2")
    draw.ellipse([320, 280, 704, 640], fill="#FFFDF0")
    draw_shiny_eyes(draw, 435, 430, 589, 430, eye_r=18)
    draw.ellipse([512 - 12, 452, 512 + 12, 474], fill="#FF85A2")
    draw.arc([486, 465, 512, 492], 0, 180, fill="#4A3E3D", width=5)
    draw.arc([512, 465, 538, 492], 0, 180, fill="#4A3E3D", width=5)
    draw.ellipse([370 - 24, 470 - 14, 370 + 24, 470 + 14], fill="#FFB7B2")
    draw.ellipse([654 - 24, 470 - 14, 654 + 24, 470 + 14], fill="#FFB7B2")
    colors_whiskers = ["#CDB4DB", "#FFB7B2", "#98D7C2"]
    for i, col in enumerate(colors_whiskers):
        y_off = (i - 1) * 18
        draw.line([(290, 460 + y_off), (350, 455 + y_off)], fill=col, width=6)
        draw.line([(674, 455 + y_off), (734, 460 + y_off)], fill=col, width=6)
    save_texture(img, "neko_cat_tex.png")

# 2. PINKY BEAR
def make_pinky_bear_tex():
    img, draw = create_blank_texture("#FFC6FF")
    draw.ellipse([400, 410, 624, 540], fill="#FFFDF0")
    draw.ellipse([512 - 14, 440, 512 + 14, 466], fill="#4A3E3D")
    draw.line([(512, 466), (512, 486)], fill="#4A3E3D", width=5)
    draw_shiny_eyes(draw, 425, 420, 599, 420, eye_r=18)
    draw.ellipse([365 - 24, 470 - 14, 365 + 24, 470 + 14], fill="#FF6584")
    draw.ellipse([659 - 24, 470 - 14, 659 + 24, 470 + 14], fill="#FF6584")
    save_texture(img, "pinky_bear_tex.png")

# 3. FROGGO (Texture for 3D Eye Frog ONLY - ZERO texture eyes drawn on body!)
def make_froggo_tex():
    img, draw = create_blank_texture("#A8E6CF") # Pastel Mint Green
    
    # Smooth Pale Yellow Belly Patch
    draw.ellipse([340, 530, 684, 730], fill="#FFFFD1")

    # Cute Frog Mouth (:3)
    draw.arc([486, 440, 512, 468], 0, 180, fill="#2D3748", width=5)
    draw.arc([512, 440, 538, 468], 0, 180, fill="#2D3748", width=5)
    
    # Soft Pink Blush Cheeks
    draw.ellipse([360 - 26, 450 - 15, 360 + 26, 450 + 15], fill="#FF85A2")
    draw.ellipse([664 - 26, 450 - 15, 664 + 26, 450 + 15], fill="#FF85A2")
    
    save_texture(img, "froggo_tex.png")

# 4. BUNNY
def make_bunny_tex():
    img, draw = create_blank_texture("#FFFFF5")
    draw.ellipse([360, 530, 664, 720], fill="#FFD1DC")
    draw.ellipse([512 - 12, 445, 512 + 12, 468], fill="#FF85A2")
    draw_shiny_eyes(draw, 425, 420, 599, 420, eye_r=18)
    draw.ellipse([365 - 24, 470 - 14, 365 + 24, 470 + 14], fill="#FF6584")
    draw.ellipse([659 - 24, 470 - 14, 659 + 24, 470 + 14], fill="#FF6584")
    save_texture(img, "bunny_tex.png")

# 5. SHIBA DOG
def make_shiba_dog_tex():
    img, draw = create_blank_texture("#F4A261")
    draw.ellipse([340, 410, 684, 620], fill="#FFFDF0")
    draw.ellipse([410, 370, 450, 395], fill="#FFFDF0")
    draw.ellipse([574, 370, 614, 395], fill="#FFFDF0")
    draw.ellipse([512 - 16, 450, 512 + 16, 476], fill="#4A3E3D")
    draw.line([(512, 476), (512, 496)], fill="#4A3E3D", width=5)
    draw_shiny_eyes(draw, 425, 420, 599, 420, eye_r=18)
    save_texture(img, "shiba_dog_tex.png")

# 6. PANDA
def make_panda_tex():
    img, draw = create_blank_texture("#FFFFFF")
    draw.ellipse([370, 390, 470, 470], fill="#333333")
    draw.ellipse([554, 390, 654, 470], fill="#333333")
    draw_shiny_eyes(draw, 420, 430, 604, 430, eye_r=12, eye_color="#FFFFFF")
    draw.ellipse([512 - 14, 455, 512 + 14, 480], fill="#333333")
    draw.ellipse([350 - 20, 480 - 12, 350 + 20, 480 + 12], fill="#FFB7B2")
    draw.ellipse([674 - 20, 480 - 12, 674 + 20, 480 + 12], fill="#FFB7B2")
    save_texture(img, "panda_tex.png")

# 7. PENGUIN
def make_penguin_tex():
    img, draw = create_blank_texture("#4EA8DE")
    draw.ellipse([320, 340, 704, 690], fill="#FFFFFF")
    draw.polygon([(482, 450), (542, 450), (512, 490)], fill="#F4A261")
    draw_shiny_eyes(draw, 425, 415, 599, 415, eye_r=16, eye_color="#111111")
    save_texture(img, "penguin_tex.png")

# 8. AXOLOTL
def make_axolotl_tex():
    img, draw = create_blank_texture("#FFB7B2")
    draw_shiny_eyes(draw, 425, 430, 599, 430, eye_r=16)
    draw.arc([490, 450, 534, 475], 0, 180, fill="#4A3E3D", width=4)
    draw.ellipse([365 - 24, 470 - 14, 365 + 24, 470 + 14], fill="#FF4081")
    draw.ellipse([659 - 24, 470 - 14, 659 + 24, 470 + 14], fill="#FF4081")
    save_texture(img, "axolotl_tex.png")

# 9. PIGGY
def make_piggy_tex():
    img, draw = create_blank_texture("#FFACC7")
    draw.ellipse([452, 435, 572, 495], fill="#FF85A2")
    draw.ellipse([482 - 8, 465 - 12, 482 + 8, 465 + 12], fill="#4A3E3D")
    draw.ellipse([542 - 8, 465 - 12, 542 + 8, 465 + 12], fill="#4A3E3D")
    draw_shiny_eyes(draw, 405, 425, 619, 425, eye_r=16)
    save_texture(img, "piggy_tex.png")

# 10. DUCKY
def make_ducky_tex():
    img, draw = create_blank_texture("#FFD166")
    draw.ellipse([442, 445, 582, 500], fill="#F4A261")
    draw_shiny_eyes(draw, 415, 425, 609, 425, eye_r=16)
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

print("Froggo texture eyes removed completely!")
