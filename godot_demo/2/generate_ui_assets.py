import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

UI_DIR = r"d:\folder\tools\godot_demo\2\assets\ui"
os.makedirs(UI_DIR, exist_ok=True)

def supersampled_image(w, h, scale=4):
    """Creates a high-res image and returns (img, draw, scale) for anti-aliasing."""
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw, scale

def downsample(img, scale=4):
    w, h = img.size
    return img.resize((w // scale, h // scale), Image.Resampling.LANCZOS)

# ==============================================================================
# 1. CANDY 3D BUTTON GENERATOR (Normal & Pressed)
# ==============================================================================
def create_candy_button(name, w, h, top_color, base_color, border_color, radius=24):
    """Generates normal and pressed 3D candy buttons with glossy shine and bottom bevel."""
    # --- NORMAL STATE ---
    img, draw, s = supersampled_image(w, h)
    sw, sh = w * s, h * s
    sr = radius * s
    bevel = 8 * s
    
    # 1. Bottom shadow (3D edge)
    draw.rounded_rectangle([2*s, 2*s + bevel, sw - 2*s, sh - 2*s], radius=sr, fill=base_color)
    # 2. Main Top Face
    draw.rounded_rectangle([2*s, 2*s, sw - 2*s, sh - bevel - 2*s], radius=sr, fill=top_color, outline=border_color, width=4*s)
    # 3. Glossy highlight (top oval shine)
    draw.ellipse([8*s, 5*s, sw - 8*s, (sh - bevel) * 0.55], fill=(255, 255, 255, 90))
    draw.rounded_rectangle([8*s, 5*s, sw - 8*s, (sh - bevel) * 0.45], radius=sr // 2, fill=(255, 255, 255, 70))
    
    normal_img = downsample(img, s)
    normal_path = os.path.join(UI_DIR, f"btn_{name}_normal.png")
    normal_img.save(normal_path, "PNG")
    
    # --- PRESSED STATE ---
    img_p, draw_p, s = supersampled_image(w, h)
    # Pressed is shifted down by bevel and slightly darker
    pressed_top = tuple(int(c * 0.88) for c in top_color[:3]) + (top_color[3],)
    draw_p.rounded_rectangle([2*s, 2*s + (bevel // 2), sw - 2*s, sh - 2*s], radius=sr, fill=base_color)
    draw_p.rounded_rectangle([2*s, 2*s + bevel, sw - 2*s, sh - 2*s], radius=sr, fill=pressed_top, outline=border_color, width=4*s)
    
    pressed_img = downsample(img_p, s)
    pressed_path = os.path.join(UI_DIR, f"btn_{name}_pressed.png")
    pressed_img.save(pressed_path, "PNG")
    print(f"[OK] Button: {name}")

# ==============================================================================
# 2. ROUND ICON BUTTON (Arrows, Pause, Steer)
# ==============================================================================
def create_circle_button(name, size, top_color, base_color, border_color, icon_drawer):
    """Generates round buttons with custom drawn icon."""
    img, draw, s = supersampled_image(size, size)
    ss = size * s
    bevel = 6 * s
    
    # Shadow
    draw.ellipse([2*s, 2*s + bevel, ss - 2*s, ss - 2*s], fill=base_color)
    # Face
    draw.ellipse([2*s, 2*s, ss - 2*s, ss - bevel - 2*s], fill=top_color, outline=border_color, width=4*s)
    # Shine
    draw.ellipse([6*s, 4*s, ss - 6*s, (ss - bevel) * 0.5], fill=(255, 255, 255, 80))
    # Icon
    icon_drawer(draw, s, ss // 2, (ss - bevel) // 2)
    
    normal_img = downsample(img, s)
    normal_path = os.path.join(UI_DIR, f"btn_{name}_normal.png")
    normal_img.save(normal_path, "PNG")
    
    # Pressed
    img_p, draw_p, s = supersampled_image(size, size)
    pressed_top = tuple(int(c * 0.88) for c in top_color[:3]) + (top_color[3],)
    draw_p.ellipse([2*s, 2*s + bevel, ss - 2*s, ss - 2*s], fill=base_color)
    draw_p.ellipse([2*s, 2*s + bevel, ss - 2*s, ss - 2*s], fill=pressed_top, outline=border_color, width=4*s)
    icon_drawer(draw_p, s, ss // 2, ss // 2 + (bevel // 2))
    
    pressed_img = downsample(img_p, s)
    pressed_path = os.path.join(UI_DIR, f"btn_{name}_pressed.png")
    pressed_img.save(pressed_path, "PNG")
    print(f"[OK] Circle Button: {name}")

# ==============================================================================
# 3. CLEAN VECTOR ICONS (Crisp, High Quality, No Unicode Emojis!)
# ==============================================================================
def create_icon_apple():
    img, draw, s = supersampled_image(64, 64)
    # Red glossy apple body
    draw.ellipse([8*s, 14*s, 56*s, 58*s], fill=(240, 45, 55, 255), outline=(180, 20, 30, 255), width=3*s)
    # Indent
    draw.ellipse([24*s, 10*s, 40*s, 20*s], fill=(210, 30, 40, 255))
    # Brown stem
    draw.line([(32*s, 16*s), (32*s, 6*s)], fill=(120, 60, 20, 255), width=4*s)
    # Green leaf
    draw.ellipse([32*s, 4*s, 48*s, 14*s], fill=(70, 200, 70, 255), outline=(40, 140, 40, 255), width=2*s)
    # Shine highlight
    draw.ellipse([14*s, 20*s, 24*s, 34*s], fill=(255, 255, 255, 180))
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "icon_apple.png"), "PNG")
    print("[OK] icon_apple.png")

def create_icon_coin():
    img, draw, s = supersampled_image(64, 64)
    # Outer gold rim
    draw.ellipse([4*s, 4*s, 60*s, 60*s], fill=(255, 195, 25, 255), outline=(210, 140, 10, 255), width=4*s)
    # Inner face
    draw.ellipse([10*s, 10*s, 54*s, 54*s], fill=(255, 225, 60, 255), outline=(230, 170, 15, 255), width=3*s)
    # Star emboss in center
    cx, cy, r_out, r_in = 32*s, 32*s, 14*s, 7*s
    pts = []
    for i in range(10):
        ang = i * math.pi / 5 - math.pi / 2
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, fill=(240, 160, 15, 255))
    # Shine highlight
    draw.ellipse([14*s, 12*s, 26*s, 22*s], fill=(255, 255, 255, 180))
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "icon_coin.png"), "PNG")
    print("[OK] icon_coin.png")

def create_icon_trophy():
    img, draw, s = supersampled_image(64, 64)
    # Trophy cup
    draw.polygon([(16*s, 12*s), (48*s, 12*s), (42*s, 36*s), (22*s, 36*s)], fill=(255, 205, 30, 255), outline=(210, 140, 10, 255))
    # Handles
    draw.ellipse([8*s, 14*s, 22*s, 28*s], outline=(220, 150, 15, 255), width=3*s)
    draw.ellipse([42*s, 14*s, 56*s, 28*s], outline=(220, 150, 15, 255), width=3*s)
    # Stem
    draw.rectangle([28*s, 36*s, 36*s, 46*s], fill=(230, 170, 20, 255))
    # Base
    draw.rounded_rectangle([18*s, 46*s, 46*s, 56*s], radius=3*s, fill=(120, 60, 25, 255), outline=(80, 35, 10, 255), width=2*s)
    # Shine
    draw.polygon([(20*s, 14*s), (26*s, 14*s), (24*s, 32*s), (20*s, 32*s)], fill=(255, 255, 255, 140))
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "icon_trophy.png"), "PNG")
    print("[OK] icon_trophy.png")

def create_icon_giraffe():
    img, draw, s = supersampled_image(64, 64)
    # Cute yellow head
    draw.rounded_rectangle([16*s, 20*s, 48*s, 54*s], radius=10*s, fill=(255, 200, 45, 255), outline=(200, 140, 20, 255), width=3*s)
    # Snout
    draw.rounded_rectangle([20*s, 38*s, 44*s, 52*s], radius=6*s, fill=(255, 235, 190, 255))
    draw.ellipse([26*s, 43*s, 29*s, 47*s], fill=(130, 65, 20, 255))
    draw.ellipse([35*s, 43*s, 38*s, 47*s], fill=(130, 65, 20, 255))
    # Horns
    draw.line([(24*s, 20*s), (22*s, 10*s)], fill=(240, 180, 30, 255), width=3*s)
    draw.ellipse([19*s, 7*s, 25*s, 13*s], fill=(130, 65, 20, 255))
    draw.line([(40*s, 20*s), (42*s, 10*s)], fill=(240, 180, 30, 255), width=3*s)
    draw.ellipse([39*s, 7*s, 45*s, 13*s], fill=(130, 65, 20, 255))
    # Big eyes
    draw.ellipse([21*s, 26*s, 29*s, 36*s], fill=(20, 20, 30, 255))
    draw.ellipse([23*s, 28*s, 26*s, 31*s], fill=(255, 255, 255, 255))
    draw.ellipse([35*s, 26*s, 43*s, 36*s], fill=(20, 20, 30, 255))
    draw.ellipse([37*s, 28*s, 40*s, 31*s], fill=(255, 255, 255, 255))
    # Blush
    draw.ellipse([17*s, 33*s, 23*s, 38*s], fill=(255, 120, 160, 160))
    draw.ellipse([41*s, 33*s, 47*s, 38*s], fill=(255, 120, 160, 160))
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "icon_giraffe.png"), "PNG")
    print("[OK] icon_giraffe.png")

# ==============================================================================
# 4. 9-SLICE BACKGROUND PANELS & PILLS
# ==============================================================================
def create_marshmallow_panel():
    img, draw, s = supersampled_image(128, 128)
    # Soft drop shadow
    draw.rounded_rectangle([8*s, 10*s, 120*s, 122*s], radius=24*s, fill=(0, 0, 0, 40))
    # Base bevel rim
    draw.rounded_rectangle([8*s, 6*s, 120*s, 118*s], radius=24*s, fill=(255, 210, 60, 255))
    # White marshmallow inner face
    draw.rounded_rectangle([10*s, 8*s, 118*s, 114*s], radius=22*s, fill=(255, 255, 255, 248), outline=(255, 240, 190, 255), width=2*s)
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "panel_marshmallow.png"), "PNG")
    print("[OK] panel_marshmallow.png")

def create_pill_badge():
    img, draw, s = supersampled_image(160, 56)
    # Drop shadow
    draw.rounded_rectangle([4*s, 6*s, 156*s, 54*s], radius=24*s, fill=(0, 0, 0, 30))
    # Outer rim
    draw.rounded_rectangle([4*s, 3*s, 156*s, 50*s], radius=24*s, fill=(230, 240, 255, 255))
    # Inner face
    draw.rounded_rectangle([6*s, 4*s, 154*s, 48*s], radius=22*s, fill=(255, 255, 255, 250), outline=(200, 220, 245, 255), width=2*s)
    # Glossy top
    draw.ellipse([14*s, 6*s, 146*s, 26*s], fill=(255, 255, 255, 120))
    res = downsample(img, s)
    res.save(os.path.join(UI_DIR, "pill_badge.png"), "PNG")
    print("[OK] pill_badge.png")

# ==============================================================================
# 5. ICON DRAWER FUNCTIONS FOR BUTTONS
# ==============================================================================
def draw_left_arrow(draw, s, cx, cy):
    draw.polygon([(cx + 10*s, cy - 14*s), (cx - 12*s, cy), (cx + 10*s, cy + 14*s)], fill=(255, 255, 255, 255))
    # Border highlight
    draw.line([(cx + 10*s, cy - 14*s), (cx - 12*s, cy), (cx + 10*s, cy + 14*s)], fill=(220, 240, 255, 255), width=2*s)

def draw_right_arrow(draw, s, cx, cy):
    draw.polygon([(cx - 10*s, cy - 14*s), (cx + 12*s, cy), (cx - 10*s, cy + 14*s)], fill=(255, 255, 255, 255))
    draw.line([(cx - 10*s, cy - 14*s), (cx + 12*s, cy), (cx - 10*s, cy + 14*s)], fill=(220, 240, 255, 255), width=2*s)

def draw_pause_bars(draw, s, cx, cy):
    draw.rounded_rectangle([cx - 10*s, cy - 12*s, cx - 3*s, cy + 12*s], radius=3*s, fill=(255, 255, 255, 255))
    draw.rounded_rectangle([cx + 3*s, cy - 12*s, cx + 10*s, cy + 12*s], radius=3*s, fill=(255, 255, 255, 255))

# ==============================================================================
# MAIN GENERATION PIPELINE
# ==============================================================================
if __name__ == "__main__":
    print("Generating Professional 2D Game UI Texture Kit...")
    
    # 1. Main Action Buttons
    create_candy_button("green_play", 280, 68, (85, 225, 95, 255), (35, 150, 50, 255), (25, 120, 35, 255), radius=22)
    create_candy_button("yellow_stretch", 180, 68, (255, 210, 45, 255), (210, 140, 15, 255), (170, 105, 10, 255), radius=22)
    create_candy_button("pink_shop", 130, 48, (255, 110, 180, 255), (195, 45, 125, 255), (160, 30, 95, 255), radius=16)
    create_candy_button("blue_sound", 130, 48, (65, 190, 255, 255), (25, 125, 205, 255), (15, 95, 165, 255), radius=16)
    create_candy_button("orange_lang", 130, 48, (255, 155, 50, 255), (210, 95, 15, 255), (170, 70, 10, 255), radius=16)
    create_candy_button("purple_home", 240, 52, (180, 100, 245, 255), (120, 45, 190, 255), (95, 30, 150, 255), radius=18)
    create_candy_button("red_retry", 240, 52, (255, 80, 100, 255), (190, 35, 55, 255), (150, 20, 40, 255), radius=18)
    create_candy_button("gold_revive", 240, 56, (255, 200, 40, 255), (200, 135, 15, 255), (160, 95, 10, 255), radius=18)
    
    # 2. Circle Steer & Pause Buttons
    create_circle_button("steer_left", 72, (70, 190, 255, 255), (25, 125, 205, 255), (15, 95, 165, 255), draw_left_arrow)
    create_circle_button("steer_right", 72, (70, 190, 255, 255), (25, 125, 205, 255), (15, 95, 165, 255), draw_right_arrow)
    create_circle_button("pause", 52, (70, 190, 255, 255), (25, 125, 205, 255), (15, 95, 165, 255), draw_pause_bars)
    
    # 3. Clean Vector Icons
    create_icon_apple()
    create_icon_coin()
    create_icon_trophy()
    create_icon_giraffe()
    
    # 4. 9-Slice Panel Backgrounds
    create_marshmallow_panel()
    create_pill_badge()
    
    print("\nAll 2D UI Game Textures Generated Successfully in:", UI_DIR)
