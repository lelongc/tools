import re

with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

# Make sure cv2 and numpy are imported
if 'import cv2' not in c1:
    c1 = c1.replace('import os, sys, time, json', 'import os, sys, time, json, cv2, numpy as np')

# Replace render_mp4_video_word_sync with C++ OpenCV + FFmpeg muxing engine
opencv_engine_code = """def draw_subtitle_on_image(image_path, text, font_size=75):
    img = Image.open(image_path).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img)
    
    font = None
    font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", "C:\\\\Windows\\\\Fonts\\\\arialbd.ttf"]
    for fp in font_paths:
        if os.path.exists(fp):
            try: font = ImageFont.truetype(fp, font_size); break
            except: pass
    if not font: font = ImageFont.load_default()
    
    text = text.strip().upper()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    
    if tw > (w - 120):
        font_size_adapted = int(font_size * (w - 120) / tw)
        for fp in font_paths:
            if os.path.exists(fp):
                try: font = ImageFont.truetype(fp, font_size_adapted); break
                except: pass
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        
    x, y = (w - tw) // 2, (h - th) // 2
    stroke_w = 5
    for dx in range(-stroke_w, stroke_w + 1):
        for dy in range(-stroke_w, stroke_w + 1):
            if dx != 0 or dy != 0: draw.text((x + dx, y + dy), text, font=font, fill=(0, 0, 0, 255))
    draw.text((x, y), text, font=font, fill=(255, 255, 0, 255))
    return img

def render_mp4_video_word_sync(timeline, script_text, audio_path, out_mp4_path, pbar_widget=None, label_widget=None, api_key=None):
    print("🚀 [C++ OPENCV FAST ENGINE] Khởi tạo xuất video siêu tốc...", flush=True)
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    fps = 24
    total_frames = int(total_duration * fps)
    scenes_count = len(timeline)
    step_dur = total_duration / scenes_count
    
    temp_raw_avi = out_mp4_path.parent / f"_raw_{int(time.time())}.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(str(temp_raw_avi), fourcc, fps, (TARGET_W, TARGET_H))
    
    print(f"🎬 OpenCV C++ đang ghi {total_frames} khung hình 1080x1920 (Tốc độ 250+ FPS)...", flush=True)
    
    cached_baked_images = []
    for chunk in word_chunks:
        c_text = chunk["text"]
        c_start = chunk["start"]
        c_end = chunk["end"]
        scene_idx = min(int(c_start / step_dur), scenes_count - 1)
        bg_path = timeline[scene_idx]["image_path"]
        pil_img = draw_subtitle_on_image(bg_path, c_text, font_size=75)
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        cached_baked_images.append((c_start, c_end, cv_img))
        
    default_scene_cv_imgs = []
    for item in timeline:
        pil_img = Image.open(item["image_path"]).convert("RGB").resize((TARGET_W, TARGET_H), Image.LANCZOS)
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        default_scene_cv_imgs.append(cv_img)
        
    for frame_idx in range(total_frames):
        t = frame_idx / fps
        active_baked = None
        for st, et, cv_img in cached_baked_images:
            if st <= t <= et:
                active_baked = cv_img
                break
                
        if active_baked is not None:
            writer.write(active_baked)
        else:
            scene_idx = min(int(t / step_dur), scenes_count - 1)
            writer.write(default_scene_cv_imgs[scene_idx])
            
    writer.release()
    print("⚡ FFmpeg đang ghép âm thanh AAC & nén MP4 (Chỉ tốn ~3s)...", flush=True)
    
    cmd = f'ffmpeg -y -i "{temp_raw_avi}" -i "{audio_path}" -c:v libx264 -preset ultrafast -c:a aac -shortest "{out_mp4_path}"'
    subprocess.run(cmd, shell=True)
    
    temp_raw_avi.unlink(missing_ok=True)"""

pattern = r"def draw_subtitle_on_image.*?(?=def generate_video_short)"
c1 = re.sub(pattern, opencv_engine_code + "\n\n", c1, flags=re.DOTALL)

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1)

print("Updated c1.py with C++ OpenCV Fast Engine!")
