with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

idx_start = c1.find("def draw_subtitle_on_image")
idx_end = c1.find("def generate_video_short")

dynamic_engine_code = """def build_dynamic_timeline_from_whisper(all_words, script_text, anime_name, total_duration):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    char_images_map = {}
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                imgs = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp"))
                random.shuffle(imgs)
                if imgs:
                    char_images_map[cdir.name] = imgs
                    
    all_anime_imgs = [img for imgs in char_images_map.values() for img in imgs]
    random.shuffle(all_anime_imgs)
    default_char = list(char_images_map.keys())[0] if char_images_map else "Rimuru_Tempest"

    # Map spoken words to character triggers with timestamps
    char_triggers = []
    for w in all_words:
        w_clean = w["word"].lower().replace("_", "")
        matched_char = None
        for ckey in char_images_map.keys():
            ckey_clean = ckey.lower().replace("_", "")
            first_name = ckey_clean.split()[0] if " " in ckey_clean else ckey_clean
            if w_clean in ckey_clean or ckey_clean in w_clean or (len(w_clean) >= 3 and w_clean in first_name):
                matched_char = ckey
                break
        if matched_char:
            char_triggers.append({"char": matched_char, "start": w["start"]})
            
    # Build continuous intervals (max 1.8s per image)
    timeline_segments = []
    curr_time = 0.0
    active_char = default_char
    used_images_per_char = {c: [] for c in char_images_map.keys()}

    def get_next_image_for_char(char_key):
        if char_key in char_images_map and char_images_map[char_key]:
            pool = char_images_map[char_key]
            used = used_images_per_char[char_key]
            available = [img for img in pool if img not in used]
            if not available:
                used_images_per_char[char_key] = []
                available = pool
            chosen = random.choice(available)
            used_images_per_char[char_key].append(chosen)
            return chosen
        elif all_anime_imgs:
            return random.choice(all_anime_imgs)
        return None

    while curr_time < total_duration:
        next_trigger = None
        for trig in char_triggers:
            if trig["start"] > curr_time and (trig["start"] - curr_time) <= 1.8:
                next_trigger = trig
                break
                
        if next_trigger:
            dur = max(0.6, next_trigger["start"] - curr_time)
            img = get_next_image_for_char(active_char)
            if img:
                timeline_segments.append({"start": curr_time, "end": curr_time + dur, "char": active_char, "image_path": str(img)})
            curr_time += dur
            active_char = next_trigger["char"]
        else:
            dur = min(1.8, total_duration - curr_time)
            img = get_next_image_for_char(active_char)
            if img:
                timeline_segments.append({"start": curr_time, "end": curr_time + dur, "char": active_char, "image_path": str(img)})
            curr_time += dur
            
    return timeline_segments

def draw_subtitle_on_image(image_path, text, font_size=75):
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
    print("🚀 [DYNAMIC CHARACTER SYNC ENGINE] Đang bóc tách thời gian từng từ & khớp tên nhân vật...", flush=True)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    anime_name = out_mp4_path.parent.parent.name
    dynamic_timeline = build_dynamic_timeline_from_whisper(all_words, script_text, anime_name, total_duration)
    print(f"🎬 Đã tạo timeline động {len(dynamic_timeline)} phân cảnh ảnh (Chuyển ảnh 1.5s-1.8s & khớp ngay khi gọi tên NV)...", flush=True)
    
    fps = 24
    total_frames = int(total_duration * fps)
    
    temp_raw_avi = out_mp4_path.parent / f"_raw_{int(time.time())}.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(str(temp_raw_avi), fourcc, fps, (TARGET_W, TARGET_H))
    
    print(f"⚡ OpenCV C++ đang ghi {total_frames} khung hình 1080x1920 (Đồng bộ tuyệt đối)...", flush=True)
    
    segment_cv_imgs = []
    for seg in dynamic_timeline:
        pil_img = Image.open(seg["image_path"]).convert("RGB").resize((TARGET_W, TARGET_H), Image.LANCZOS)
        segment_cv_imgs.append((seg["start"], seg["end"], pil_img, seg["image_path"]))
        
    for frame_idx in range(total_frames):
        t = frame_idx / fps
        
        active_bg_path = segment_cv_imgs[0][3]
        for st, et, _, bg_p in segment_cv_imgs:
            if st <= t <= et:
                active_bg_path = bg_p
                break
                
        active_sub_text = None
        for chunk in word_chunks:
            if chunk["start"] <= t <= chunk["end"]:
                active_sub_text = chunk["text"]
                break
                
        if active_sub_text:
            pil_img = draw_subtitle_on_image(active_bg_path, active_sub_text, font_size=75)
            cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        else:
            pil_img = Image.open(active_bg_path).convert("RGB").resize((TARGET_W, TARGET_H), Image.LANCZOS)
            cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            
        writer.write(cv_img)
        
    writer.release()
    print("⚡ FFmpeg đang ghép âm thanh AAC (stream copy ~3s)...", flush=True)
    
    cmd = f'ffmpeg -y -i "{temp_raw_avi}" -i "{audio_path}" -c:v libx264 -preset ultrafast -c:a aac -shortest "{out_mp4_path}"'
    subprocess.run(cmd, shell=True)
    
    temp_raw_avi.unlink(missing_ok=True)
"""

c1_new = c1[:idx_start] + dynamic_engine_code + "\n\n" + c1[idx_end:]

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_new)

print("Direct string replacement successful!")
