import re

with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

# 1. Update Gemini Prompt to 200-210 words (~45-50 seconds)
old_req = """REQUIREMENTS:
1. The full script MUST be 260-290 English words (MUST be at least 55-60 seconds reading duration when spoken).
2. Divide the script into 20-25 scenes (each scene corresponds to ~2.5-3 seconds of narration)."""

new_req = """REQUIREMENTS:
1. The full script MUST be 200-210 English words (exact reading duration of 45-50 seconds when spoken).
2. Divide the script into 16-18 scenes (each scene corresponds to ~2.5-3 seconds of narration)."""

c1 = c1.replace(old_req, new_req)

# 2. Update parse_custom_script_into_scenes for 200-210 words
old_num_scenes = "num_scenes = max(18, min(25, total_words // 11))"
new_num_scenes = "num_scenes = max(14, min(18, total_words // 12))"
c1 = c1.replace(old_num_scenes, new_num_scenes)

# 3. Replace render_mp4_video_word_sync with Pre-baked Subtitle Image Clip Engine (10x faster, 100% reliable)
prebaked_render_code = """def draw_subtitle_on_image(image_path, text, font_size=75):
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
    print("🚀 [SIÊU TỐC 10X] Đang tiền xử lý phụ đề vẽ trực tiếp lên ảnh...", flush=True)
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    scenes_count = len(timeline)
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    step_dur = total_duration / scenes_count
    temp_dir = out_mp4_path.parent / f"_baked_clips_{int(time.time())}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    video_clips = []
    print(f"🖼️ Đang tiền render {len(word_chunks)} khung phụ đề trên {scenes_count} phân cảnh...", flush=True)
    
    for idx, chunk in enumerate(word_chunks):
        c_text, c_start, c_end = chunk["text"], chunk["start"], chunk["end"]
        dur = max(0.1, c_end - c_start)
        
        # Tìm cảnh tương ứng với thời gian c_start
        scene_idx = min(int(c_start / step_dur), scenes_count - 1)
        bg_img_path = timeline[scene_idx]["image_path"]
        
        baked_img = draw_subtitle_on_image(bg_img_path, c_text, font_size=75)
        baked_path = temp_dir / f"baked_{idx:04d}.jpg"
        baked_img.save(baked_path, "JPEG", quality=90)
        
        clip = ImageClip(str(baked_path)).set_duration(dur)
        video_clips.append(clip)
        
    print("⚡ FFmpeg đang ghép video & âm thanh trực tiếp (Chỉ tốn ~10s)...", flush=True)
    final_video = concatenate_videoclips(video_clips, method="compose").set_duration(total_duration).set_audio(audio_clip)
    
    final_video.write_videofile(
        str(out_mp4_path),
        fps=24,
        codec='libx264',
        audio_codec='aac',
        threads=8,
        preset='ultrafast',
        logger=None
    )
    
    audio_clip.close()
    final_video.close()
    shutil.rmtree(temp_dir, ignore_errors=True)"""

pattern = r"def draw_word_subtitle_transparent.*?(?=def generate_video_short)"
c1 = re.sub(pattern, prebaked_render_code + "\n\n", c1, flags=re.DOTALL)

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1)

print("Pre-baked engine written to c1.py successfully!")
