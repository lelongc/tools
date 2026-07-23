import os
import math
from PIL import Image, ImageDraw, ImageFilter

output_dir = r"D:\folder\tools\godot_demo\assets"
os.makedirs(output_dir, exist_ok=True)

SIZE = 512

def create_blank_image():
    scale = 2
    w, h = SIZE * scale, SIZE * scale
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw, scale, w, h

def save_sprite(img, filename):
    out_path = os.path.join(output_dir, filename)
    final_img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    final_img.save(out_path, "PNG")
    print(f"Saved sprite: {out_path}")

def draw_smooth_polygon(draw, points, fill, outline=None, width=1):
    draw.polygon(points, fill=fill, outline=outline, width=width)

def draw_jelly_feet(draw, scale, cx, cy, colors):
    num_feet = len(colors)
    foot_w = 60 * scale
    foot_h = 35 * scale
    start_x = cx - ((num_feet - 1) * foot_w * 0.7) / 2
    for i, color in enumerate(colors):
        fx = start_x + i * foot_w * 0.7 - foot_w / 2
        fy = cy - foot_h / 2
        bbox = [fx, fy, fx + foot_w, fy + foot_h]
        draw.ellipse(bbox, fill=color, outline=(255, 255, 255, 180), width=int(3 * scale))

# 1. NEKO CAT
def make_neko_cat():
    img, draw, s, w, h = create_blank_image()
    cx, cy = w / 2, h / 2 + 10 * s
    
    body_w, body_h = 320 * s, 300 * s
    body_bbox = [cx - body_w/2, cy - body_h/2, cx + body_w/2, cy + body_h/2]
    
    # Left Ear
    l_ear_pts = [(cx - 120 * s, cy - 80 * s), (cx - 160 * s, cy - 210 * s), (cx - 60 * s, cy - 140 * s)]
    draw_smooth_polygon(draw, l_ear_pts, fill="#CDB4DB")
    l_inner_pts = [(cx - 115 * s, cy - 90 * s), (cx - 150 * s, cy - 190 * s), (cx - 70 * s, cy - 135 * s)]
    draw_smooth_polygon(draw, l_inner_pts, fill="#FFB7B2")
    
    # Right Ear
    r_ear_pts = [(cx + 120 * s, cy - 80 * s), (cx + 160 * s, cy - 210 * s), (cx + 60 * s, cy - 140 * s)]
    draw_smooth_polygon(draw, r_ear_pts, fill="#98D7C2")
    r_inner_pts = [(cx + 115 * s, cy - 90 * s), (cx + 150 * s, cy - 190 * s), (cx + 70 * s, cy - 135 * s)]
    draw_smooth_polygon(draw, r_inner_pts, fill="#FFB7B2")
    
    draw.ellipse(body_bbox, fill="#FFFDF0")
    
    draw.chord([cx - body_w/2, cy - body_h/2, cx, cy + body_h/2], 180, 270, fill="#CDB4DB")
    draw.chord([cx, cy - body_h/2, cx + body_w/2, cy + body_h/2], 270, 360, fill="#98D7C2")
    
    face_w, face_h = 300 * s, 250 * s
    face_bbox = [cx - face_w/2, cy - face_h/2 + 20*s, cx + face_w/2, cy + face_h/2 + 20*s]
    draw.ellipse(face_bbox, fill="#FFFDF0")
    
    eye_r = 14 * s
    draw.ellipse([cx - 80*s - eye_r, cy - 20*s - eye_r, cx - 80*s + eye_r, cy - 20*s + eye_r], fill="#4A3E3D")
    draw.ellipse([cx + 80*s - eye_r, cy - 20*s - eye_r, cx + 80*s + eye_r, cy - 20*s + eye_r], fill="#4A3E3D")
    
    nose_w, nose_h = 16 * s, 12 * s
    draw.ellipse([cx - nose_w/2, cy - 10*s, cx + nose_w/2, cy - 10*s + nose_h], fill="#FF85A2")
    
    draw.arc([cx - 24*s, cy, cx, cy + 20*s], 0, 180, fill="#4A3E3D", width=int(4*s))
    draw.arc([cx, cy, cx + 24*s, cy + 20*s], 0, 180, fill="#4A3E3D", width=int(4*s))
    
    whisker_colors = ["#CDB4DB", "#FFB7B2", "#98D7C2"]
    for i, color in enumerate(whisker_colors):
        y_off = (i - 1) * 22 * s
        draw.line([(cx - 150*s, cy + 10*s + y_off), (cx - 100*s, cy + 5*s + y_off)], fill=color, width=int(6*s))
        draw.line([(cx + 100*s, cy + 5*s + y_off), (cx + 150*s, cy + 10*s + y_off)], fill=color, width=int(6*s))
        
    draw_jelly_feet(draw, s, cx, cy + body_h/2 - 10*s, ["#CDB4DB", "#FFB7B2", "#FFDAC1", "#98D7C2"])
    
    save_sprite(img, "neko_cat.png")

# 2. PINKY BEAR
def make_pinky_bear():
    img, draw, s, w, h = create_blank_image()
    cx, cy = w / 2, h / 2 + 10 * s
    
    body_w, body_h = 320 * s, 300 * s
    body_bbox = [cx - body_w/2, cy - body_h/2, cx + body_w/2, cy + body_h/2]
    
    ear_r = 50 * s
    draw.ellipse([cx - 130*s - ear_r, cy - 120*s - ear_r, cx - 130*s + ear_r, cy - 120*s + ear_r], fill="#FFB7B2")
    draw.ellipse([cx - 130*s - ear_r*0.6, cy - 120*s - ear_r*0.6, cx - 130*s + ear_r*0.6, cy - 120*s + ear_r*0.6], fill="#FFC6FF")
    
    draw.ellipse([cx + 130*s - ear_r, cy - 120*s - ear_r, cx + 130*s + ear_r, cy - 120*s + ear_r], fill="#FFB7B2")
    draw.ellipse([cx + 130*s - ear_r*0.6, cy - 120*s - ear_r*0.6, cx + 130*s + ear_r*0.6, cy - 120*s + ear_r*0.6], fill="#FFC6FF")
    
    draw.ellipse(body_bbox, fill="#FFB7B2")
    
    snout_w, snout_h = 130 * s, 90 * s
    draw.ellipse([cx - snout_w/2, cy - 10*s, cx + snout_w/2, cy - 10*s + snout_h], fill="#FFFDF0")
    
    nose_r = 10 * s
    draw.ellipse([cx - nose_r, cy, cx + nose_r, cy + nose_r*1.5], fill="#4A3E3D")
    draw.line([(cx, cy + nose_r*1.5), (cx, cy + nose_r*2.5)], fill="#4A3E3D", width=int(4*s))
    
    eye_r = 14 * s
    draw.ellipse([cx - 80*s - eye_r, cy - 30*s - eye_r, cx - 80*s + eye_r, cy - 30*s + eye_r], fill="#4A3E3D")
    draw.ellipse([cx + 80*s - eye_r, cy - 30*s - eye_r, cx + 80*s + eye_r, cy - 30*s + eye_r], fill="#4A3E3D")
    
    blush_w, blush_h = 45 * s, 25 * s
    draw.ellipse([cx - 110*s - blush_w/2, cy + 10*s, cx - 110*s + blush_w/2, cy + 10*s + blush_h], fill="#FF6584")
    draw.ellipse([cx + 110*s - blush_w/2, cy + 10*s, cx + 110*s + blush_w/2, cy + 10*s + blush_h], fill="#FF6584")
    
    draw_jelly_feet(draw, s, cx, cy + body_h/2 - 10*s, ["#FFC6FF", "#FFB7B2", "#FFDAC1"])
    
    save_sprite(img, "pinky_bear.png")

# 3. FROGGO
def make_froggo():
    img, draw, s, w, h = create_blank_image()
    cx, cy = w / 2, h / 2 + 10 * s
    
    eye_dome_r = 55 * s
    draw.ellipse([cx - 90*s - eye_dome_r, cy - 130*s - eye_dome_r, cx - 90*s + eye_dome_r, cy - 130*s + eye_dome_r], fill="#B5EAD7")
    draw.ellipse([cx + 90*s - eye_dome_r, cy - 130*s - eye_dome_r, cx + 90*s + eye_dome_r, cy - 130*s + eye_dome_r], fill="#B5EAD7")
    
    pupil_r = 16 * s
    draw.ellipse([cx - 90*s - pupil_r, cy - 130*s - pupil_r, cx - 90*s + pupil_r, cy - 130*s + pupil_r], fill="#4A3E3D")
    draw.ellipse([cx + 90*s - pupil_r, cy - 130*s - pupil_r, cx + 90*s + pupil_r, cy - 130*s + pupil_r], fill="#4A3E3D")
    
    shine_r = 5 * s
    draw.ellipse([cx - 94*s - shine_r, cy - 134*s - shine_r, cx - 94*s + shine_r, cy - 134*s + shine_r], fill="#FFFDF0")
    draw.ellipse([cx + 86*s - shine_r, cy - 134*s - shine_r, cx + 86*s + shine_r, cy - 134*s + shine_r], fill="#FFFDF0")
    
    body_w, body_h = 320 * s, 280 * s
    body_bbox = [cx - body_w/2, cy - body_h/2, cx + body_w/2, cy + body_h/2]
    draw.ellipse(body_bbox, fill="#B5EAD7")
    
    belly_w, belly_h = 140 * s, 90 * s
    draw.ellipse([cx - belly_w/2, cy + 20*s, cx + belly_w/2, cy + 20*s + belly_h], fill="#FFFFD1")
    
    blush_w, blush_h = 45 * s, 25 * s
    draw.ellipse([cx - 100*s - blush_w/2, cy, cx - 100*s + blush_w/2, cy + blush_h], fill="#FFB7B2")
    draw.ellipse([cx + 100*s - blush_w/2, cy, cx + 100*s + blush_w/2, cy + blush_h], fill="#FFB7B2")
    
    draw_jelly_feet(draw, s, cx, cy + body_h/2 - 10*s, ["#B5EAD7", "#FFFFD1", "#98D7C2"])
    
    save_sprite(img, "froggo.png")

# 4. BUNNY
def make_bunny():
    img, draw, s, w, h = create_blank_image()
    cx, cy = w / 2, h / 2 + 30 * s
    
    ear_w, ear_h = 55 * s, 160 * s
    draw.ellipse([cx - 70*s - ear_w/2, cy - 140*s - ear_h, cx - 70*s + ear_w/2, cy - 110*s], fill="#FFFDF0")
    draw.ellipse([cx - 70*s - ear_w*0.6/2, cy - 130*s - ear_h*0.7, cx - 70*s + ear_w*0.6/2, cy - 115*s], fill="#FFB7B2")
    
    draw.ellipse([cx + 70*s - ear_w/2, cy - 140*s - ear_h, cx + 70*s + ear_w/2, cy - 110*s], fill="#FFFDF0")
    draw.ellipse([cx + 70*s - ear_w*0.6/2, cy - 130*s - ear_h*0.7, cx + 70*s + ear_w*0.6/2, cy - 115*s], fill="#FFB7B2")
    
    body_w, body_h = 310 * s, 290 * s
    body_bbox = [cx - body_w/2, cy - body_h/2, cx + body_w/2, cy + body_h/2]
    draw.ellipse(body_bbox, fill="#FFFDF0")
    
    belly_w, belly_h = 130 * s, 85 * s
    draw.ellipse([cx - belly_w/2, cy + 25*s, cx + belly_w/2, cy + 25*s + belly_h], fill="#FFD1DC")
    
    nose_w, nose_h = 14 * s, 10 * s
    draw.ellipse([cx - nose_w/2, cy - 10*s, cx + nose_w/2, cy - 10*s + nose_h], fill="#FF85A2")
    
    eye_r = 14 * s
    draw.ellipse([cx - 80*s - eye_r, cy - 25*s - eye_r, cx - 80*s + eye_r, cy - 25*s + eye_r], fill="#4A3E3D")
    draw.ellipse([cx + 80*s - eye_r, cy - 25*s - eye_r, cx + 80*s + eye_r, cy - 25*s + eye_r], fill="#4A3E3D")
    
    blush_w, blush_h = 45 * s, 25 * s
    draw.ellipse([cx - 105*s - blush_w/2, cy + 5*s, cx - 105*s + blush_w/2, cy + 5*s + blush_h], fill="#FF6584")
    draw.ellipse([cx + 105*s - blush_w/2, cy + 5*s, cx + 105*s + blush_w/2, cy + 5*s + blush_h], fill="#FF6584")
    
    draw_jelly_feet(draw, s, cx, cy + body_h/2 - 10*s, ["#FFFDF0", "#FFD1DC", "#FFB7B2"])
    
    save_sprite(img, "bunny.png")

make_neko_cat()
make_pinky_bear()
make_froggo()
make_bunny()
print("All 4 2D pastel sticker sprites generated successfully!")
