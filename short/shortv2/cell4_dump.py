# @title 4. TẠO THUMBNAIL CHO SHORTS
import os
import random
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

def generate_thumbnail(anime_name, topic, output_path="thumbnail.jpg"):
    print(f"🎨 Đang tạo Thumbnail cho chủ đề: {topic}...")
    base_dir = BASE_LIBRARY_DIR / anime_name
    
    if not base_dir.exists():
        print(f"❌ Không tìm thấy thư mục anime: {base_dir}")
        return
        
    chars = [d for d in base_dir.iterdir() if d.is_dir() and d.name != "output_shorts"]
    if not chars:
        print("❌ Không tìm thấy nhân vật nào!")
        return
        
    char_dir = random.choice(chars)
    images = list(char_dir.glob("*.jpg")) + list(char_dir.glob("*.png")) + list(char_dir.glob("*.jpeg")) + list(char_dir.glob("*.webp"))
    if not images:
        print(f"❌ Không có ảnh trong thư mục {char_dir.name}")
        return
        
    img_path = random.choice(images)
    print(f"🖼️ Đã chọn ảnh: {img_path}")
    
    # Mở ảnh bằng OpenCV để crop tỷ lệ 9:16 (Shorts)
    img = cv2.imread(str(img_path))
    if img is None:
        print("❌ Lỗi đọc ảnh!")
        return
        
    h, w = img.shape[:2]
    target_ratio = 9 / 16
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        x_start = (w - new_w) // 2
        img_cropped = img[:, x_start:x_start+new_w]
    else:
        new_h = int(w / target_ratio)
        y_start = (h - new_h) // 2
        img_cropped = img[y_start:y_start+new_h, :]
        
    img_resized = cv2.resize(img_cropped, (1080, 1920), interpolation=cv2.INTER_AREA)
    
    # Chuyển sang PIL để ghi text
    img_pil = Image.fromarray(cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB))
    
    # Lấy font
    font_paths = ["C:\\Windows\\Fonts\\impact.ttf", "C:\\Windows\\Fonts\\arialbd.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
    font = None
    for fp in font_paths:
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, 130)
            break
    if not font:
        font = ImageFont.load_default()
        
    # Làm tối vùng trên cùng để chữ nổi hơn (Gradient nhẹ)
    overlay = Image.new('RGBA', img_pil.size, (0,0,0,0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([0, 0, 1080, 700], fill=(0, 0, 0, 160))
    img_pil = Image.alpha_composite(img_pil.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img_pil)
    
    # Phân tách title thành 2 dòng
    words = topic.split()
    mid = len(words)//2 + 1 if len(words) > 3 else len(words)//2
    line1 = " ".join(words[:mid])
    line2 = " ".join(words[mid:])
    
    # Ghi text (Có viền đen chữ vàng)
    def draw_text_with_outline(d, x, y, text, font):
        outline_color = (0, 0, 0)
        text_color = (255, 230, 0) # Vàng rực
        thickness = 10
        for adj in range(-thickness, thickness+1):
            for adj2 in range(-thickness, thickness+1):
                d.text((x+adj, y+adj2), text, font=font, fill=outline_color)
        d.text((x, y), text, font=font, fill=text_color)

    try:
        if line1:
            bbox1 = draw.textbbox((0, 0), line1.upper(), font=font)
            w1 = bbox1[2] - bbox1[0]
            draw_text_with_outline(draw, (1080 - w1) // 2, 200, line1.upper(), font)
        
        if line2:
            bbox2 = draw.textbbox((0, 0), line2.upper(), font=font)
            w2 = bbox2[2] - bbox2[0]
            draw_text_with_outline(draw, (1080 - w2) // 2, 360, line2.upper(), font)
    except:
        draw_text_with_outline(draw, 50, 200, topic.upper(), font)
        
    img_pil.save(output_path)
    print(f"✅ Đã lưu Thumbnail tại: {output_path}")


# --- TÙY CHỈNH Ở ĐÂY ---
anime_for_thumb = 'Tensei_Slime'
topic_for_thumb = 'The Truth About Rimuru'
generate_thumbnail(anime_for_thumb, topic_for_thumb, 'thumbnail.jpg')
from IPython.display import Image as IPImage, display
display(IPImage('thumbnail.jpg'))
