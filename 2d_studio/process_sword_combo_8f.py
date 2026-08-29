import os
import io
import json
import base64
import urllib.request
from PIL import Image

IMG_PATH = r"C:\Users\Acer\.gemini\antigravity-ide\brain\9bfc5b45-1b34-465c-8191-ee3c6b2802b1\sword_slash_sequence_8f_1787992881204.jpg"
LIB_CHAR_DIR = r"d:\folder\tools\2d_studio\assets_library\characters\valkyrie_sword_combo_8f"
GODOT_CHAR_DIR = r"d:\folder\tools\godot_demo\2\assets\sprites\characters\valkyrie_sword_combo_8f"
os.makedirs(LIB_CHAR_DIR, exist_ok=True)
os.makedirs(GODOT_CHAR_DIR, exist_ok=True)

def remove_white_bg(img: Image.Image, threshold: int = 240) -> Image.Image:
    img = img.convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if r > threshold and g > threshold and b > threshold:
            new_data.append((0, 0, 0, 0))
        elif r > 210 and g > 210 and b > 210:
            alpha = int(255 * (1.0 - (min(r, g, b) - 210) / (255 - 210)))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
    img.putdata(new_data)
    return img

def main():
    raw = Image.open(IMG_PATH)
    clean = remove_white_bg(raw)
    w, h = clean.size

    cols = 4
    rows = 2
    cw = w // cols
    rh = h // rows

    # Crop height to remove bottom label text (about 12% of cell height)
    char_h = int(rh * 0.88)

    frames_b64 = []
    for row in range(rows):
        for col in range(cols):
            idx = row * cols + col
            x0 = col * cw
            y0 = row * rh
            x1 = x0 + cw
            y1 = y0 + char_h

            cropped = clean.crop((x0, y0, x1, y1))
            f_256 = cropped.resize((256, 256), Image.Resampling.NEAREST)
            
            # Save attack frames
            f_path_lib = os.path.join(LIB_CHAR_DIR, f"attack_{idx}.png")
            f_path_godot = os.path.join(GODOT_CHAR_DIR, f"attack_{idx}.png")
            f_256.save(f_path_lib)
            f_256.save(f_path_godot)
            
            # Also save base idle/run
            f_256.save(os.path.join(LIB_CHAR_DIR, f"idle_{idx}.png"))
            f_256.save(os.path.join(GODOT_CHAR_DIR, f"idle_{idx}.png"))
            f_256.save(os.path.join(LIB_CHAR_DIR, f"run_{idx}.png"))
            f_256.save(os.path.join(GODOT_CHAR_DIR, f"run_{idx}.png"))

            buf = io.BytesIO()
            f_256.save(buf, format="PNG")
            frames_b64.append("data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8"))

    # Save thumb
    clean.crop((0, 0, cw, char_h)).resize((128, 128), Image.Resampling.NEAREST).save(os.path.join(LIB_CHAR_DIR, "thumb.png"))
    clean.crop((0, 0, cw, char_h)).resize((128, 128), Image.Resampling.NEAREST).save(os.path.join(GODOT_CHAR_DIR, "thumb.png"))

    # Meta
    meta = {
        "id": "valkyrie_sword_combo_8f",
        "name": "Nữ Kiếm Sĩ - Combo 8 Bước Từ Rút Kiếm Đến Thu Kiếm (AI Generated)",
        "category": "characters",
        "role": "Hero",
        "clips": ["attack", "idle", "run"],
        "frames_count": 8,
        "description": "Chuỗi hoạt ảnh 8 khung hình hoàn chỉnh: Rút kiếm ➔ Chém nhanh ➔ Kiếm khí bán nguyệt ➔ Xoay 360 ➔ Bổ dọc ➔ Nổ sóng xung kích đất ➔ Múa xoay kiếm ➔ Tra kiếm vào bao lấp lánh."
    }
    with open(os.path.join(LIB_CHAR_DIR, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    # Godot SpriteFrames .tres
    tres_path = os.path.join(GODOT_CHAR_DIR, "valkyrie_sword_combo_8f_frames.tres")
    sections = []
    for anim in ["attack", "idle", "run"]:
        loop = "true" if anim in ["idle", "run"] else "false"
        speed = 10.0
        sections.append(f"""{{
"frames": [],
"loop": {loop},
"name": &"{anim}",
"speed": {speed}
}}""")
    content = f"""[gd_resource type="SpriteFrames" format=3]

[resource]
animations = [{','.join(sections)}]
"""
    with open(tres_path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Sliced all 8 combat frames and saved to Library & Godot!")

    # Broadcast to live web tool
    req_data = json.dumps({
        "type": "LOAD_CLIP_SET",
        "clips": {
            "attack": frames_b64,
            "idle": frames_b64,
            "run": frames_b64
        }
    }).encode("utf-8")
    req = urllib.request.Request("http://localhost:8765/api/ai/broadcast_frame", data=req_data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        print("Broadcast to web tool response:", resp.read().decode())

if __name__ == "__main__":
    main()
