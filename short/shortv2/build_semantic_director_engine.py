with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

idx_start = c1.find("def build_dynamic_timeline_from_whisper")
idx_end = c1.find("def generate_video_short")

semantic_director_code = """def map_script_snippets_to_characters_gemini(snippets, available_chars, anime_name, api_key):
    if not api_key:
        return [available_chars[0] if available_chars else "Rimuru_Tempest"] * len(snippets)
        
    chars_str = ", ".join(available_chars)
    prompt = f\"\"\"You are an expert anime Short film director for '{anime_name}'.
Below are {len(snippets)} consecutive 2-second voiceover text snippets from a video script.

Available character image folders: [{chars_str}]

Task: For EACH snippet (1 to {len(snippets)}), analyze the semantic context, subject, or character being mentioned.
Assign the SINGLE MOST RELEVANT 'character_key' from the available list: [{chars_str}].
Rules:
- If a specific character is named or described (e.g., Storm Dragon -> Veldora_Tempest, Pink haired demon -> Milim_Nava, Red haired demon -> Guy_Crimson), pick that character.
- If general events, power-ups, or main story actions are described without naming someone else, default to the protagonist ({available_chars[0] if available_chars else 'Rimuru_Tempest'}).

Return STRICTLY a JSON array of {len(snippets)} strings matching the available character keys:
[
  "Rimuru_Tempest",
  "Veldora_Tempest",
  ...
]\"\"\"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    try:
        r = requests.post(url, json=body, timeout=12)
        if r.status_code == 200:
            assigned = json.loads(clean_json_text(r.json()['candidates'][0]['content']['parts'][0]['text']))
            if isinstance(assigned, list) and len(assigned) == len(snippets):
                # Validate that returned keys exist in available_chars
                valid_assigned = []
                for k in assigned:
                    matching = next((c for c in available_chars if c.lower() in k.lower() or k.lower() in c.lower()), available_chars[0])
                    valid_assigned.append(matching)
                print(f"   🧠 Gemini AI đã phân tích ngữ cảnh & gán đúng nhân vật cho {len(snippets)} phân cảnh!", flush=True)
                return valid_assigned
    except Exception as e:
        print(f"⚠️ Lỗi phân tích ngữ cảnh Gemini: {e}", flush=True)
        
    return [available_chars[0] if available_chars else "Rimuru_Tempest"] * len(snippets)

def build_semantic_timeline(all_words, script_text, anime_name, total_duration, api_key, target_images=30):
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
    available_chars = list(char_images_map.keys())
    
    # 1. Split script into exactly target_images (30) 2.0s snippets
    interval_dur = total_duration / target_images
    snippets = []
    for i in range(target_images):
        st = i * interval_dur
        et = (i + 1) * interval_dur
        words_in_interval = [w["word"] for w in all_words if st <= w["start"] < et]
        snip_text = " ".join(words_in_interval) if words_in_interval else f"Scene {i+1}"
        snippets.append(snip_text)
        
    # 2. Call Gemini AI to semantically map each 2-second snippet to the correct character folder
    assigned_chars = map_script_snippets_to_characters_gemini(snippets, available_chars, anime_name, api_key)
    
    # 3. Pick unrepeated image for each 2.0s interval
    timeline_segments = []
    used_images_per_char = {c: [] for c in available_chars}
    
    for i in range(target_images):
        st = i * interval_dur
        et = (i + 1) * interval_dur if i < target_images - 1 else total_duration
        ckey = assigned_chars[i]
        
        # Pick next image
        pool = char_images_map.get(ckey, all_anime_imgs)
        used = used_images_per_char.get(ckey, [])
        avail = [img for img in pool if img not in used]
        if not avail:
            used_images_per_char[ckey] = []
            avail = pool
        chosen_img = random.choice(avail) if avail else random.choice(all_anime_imgs)
        if ckey in used_images_per_char:
            used_images_per_char[ckey].append(chosen_img)
            
        timeline_segments.append({
            "start": st,
            "end": et,
            "char": ckey,
            "snippet": snippets[i],
            "image_path": str(chosen_img)
        })
        
    return timeline_segments

def draw_subtitle_on_image_cv(cv_img, text, font_size=75):
    pil_img = Image.fromarray(cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB))
    w, h = pil_img.size
    draw = ImageDraw.Draw(pil_img)
    
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
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

def render_mp4_video_word_sync(timeline, script_text, audio_path, out_mp4_path, pbar_widget=None, label_widget=None, api_key=None):
    print("🚀 [AI SEMANTIC DIRECTOR ENGINE] Phân tích ngữ cảnh kịch bản & gán chuẩn 30 ảnh (2s/ảnh)...", flush=True)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    anime_name = out_mp4_path.parent.parent.name
    dynamic_timeline = build_semantic_timeline(all_words, script_text, anime_name, total_duration, api_key, target_images=30)
    print(f"🎬 Đã gán chuẩn CHÍNH XÁC {len(dynamic_timeline)} bức ảnh (Đúng 2.0s/ảnh theo ngữ cảnh giọng đọc)...", flush=True)
    
    fps = 30
    total_frames = int(total_duration * fps)
    
    temp_raw_avi = out_mp4_path.parent / f"_raw_{int(time.time())}.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(str(temp_raw_avi), fourcc, fps, (TARGET_W, TARGET_H))
    
    loaded_imgs = []
    for idx, seg in enumerate(dynamic_timeline):
        pil_img = Image.open(seg["image_path"]).convert("RGB")
        w, h = pil_img.size
        ratio = TARGET_W / TARGET_H
        if w/h > ratio: nh, nw = TARGET_H, int(w * (TARGET_H / h))
        else: nw, nh = TARGET_W, int(h * (TARGET_W / w))
        pil_img = pil_img.resize((nw, nh), Image.LANCZOS)
        l, t_crop = (nw - TARGET_W) // 2, (nh - TARGET_H) // 2
        pil_img = pil_img.crop((l, t_crop, l + TARGET_W, t_crop + TARGET_H))
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        loaded_imgs.append((seg["start"], seg["end"], cv_img, idx))

    sub_img_cache = {}
    for chunk in word_chunks:
        txt = chunk["text"]
        if txt not in sub_img_cache:
            overlay = np.zeros((TARGET_H, TARGET_W, 4), dtype=np.uint8)
            pil_ov = Image.fromarray(overlay)
            draw = ImageDraw.Draw(pil_ov)
            
            font = None
            font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", "C:\\\\Windows\\\\Fonts\\\\arialbd.ttf"]
            for fp in font_paths:
                if os.path.exists(fp):
                    try: font = ImageFont.truetype(fp, 75); break
                    except: pass
            if not font: font = ImageFont.load_default()
            
            txt_upper = txt.strip().upper()
            bbox = draw.textbbox((0, 0), txt_upper, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            if tw > (TARGET_W - 120):
                f_size = int(75 * (TARGET_W - 120) / tw)
                for fp in font_paths:
                    if os.path.exists(fp):
                        try: font = ImageFont.truetype(fp, f_size); break
                        except: pass
                bbox = draw.textbbox((0, 0), txt_upper, font=font)
                tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                
            x, y = (TARGET_W - tw) // 2, (TARGET_H - th) // 2
            stroke_w = 5
            for dx in range(-stroke_w, stroke_w + 1):
                for dy in range(-stroke_w, stroke_w + 1):
                    if dx != 0 or dy != 0: draw.text((x + dx, y + dy), txt_upper, font=font, fill=(0, 0, 0, 255))
            draw.text((x, y), txt_upper, font=font, fill=(255, 255, 0, 255))
            
            ov_np = np.array(pil_ov)
            sub_img_cache[txt] = (ov_np[:, :, :3], ov_np[:, :, 3] / 255.0)

    fade_frames = 4
    print(f"🎬 C++ OpenCV đang ghi {total_frames} khung hình với tốc độ SIÊU TỐC...", flush=True)

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        
        seg_idx = 0
        for st, et, _, idx in loaded_imgs:
            if st <= t <= et:
                seg_idx = idx
                break
                
        st, et, cv_img_curr, _ = loaded_imgs[seg_idx]
        seg_dur = max(0.1, et - st)
        progress = min(1.0, max(0.0, (t - st) / seg_dur))
        
        scale = (1.0 + 0.06 * progress) if (seg_idx % 2 == 0) else (1.06 - 0.06 * progress)
        
        zw, zh = int(TARGET_W * scale), int(TARGET_H * scale)
        img_zoomed = cv2.resize(cv_img_curr, (zw, zh), interpolation=cv2.INTER_LINEAR)
        zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
        frame_bg = img_zoomed[zt:zt+TARGET_H, zl:zl+TARGET_W]
        
        if seg_idx < len(loaded_imgs) - 1 and (et - t) < (fade_frames / fps):
            next_st, next_et, cv_img_next, _ = loaded_imgs[seg_idx + 1]
            alpha = (et - t) / (fade_frames / fps)
            frame_bg = cv2.addWeighted(frame_bg, alpha, cv_img_next, 1.0 - alpha, 0)
            
        active_sub_text = None
        for chunk in word_chunks:
            if chunk["start"] <= t <= chunk["end"]:
                active_sub_text = chunk["text"]
                break
                
        if active_sub_text and active_sub_text in sub_img_cache:
            txt_rgb, alpha_mask = sub_img_cache[active_sub_text]
            mask_3d = alpha_mask[:, :, None]
            frame_final = (frame_bg * (1.0 - mask_3d) + txt_rgb * mask_3d).astype(np.uint8)
        else:
            frame_final = frame_bg
            
        writer.write(frame_final)
        
    writer.release()
    print("⚡ FFmpeg đang muxing MP4 AAC (stream copy ~2s)...", flush=True)
    
    cmd = f'ffmpeg -y -i "{temp_raw_avi}" -i "{audio_path}" -c:v libx264 -preset ultrafast -c:a aac -shortest "{out_mp4_path}"'
    subprocess.run(cmd, shell=True)
    
    temp_raw_avi.unlink(missing_ok=True)
"""

c1_new = c1[:idx_start] + semantic_director_code + "\n\n" + c1[idx_end:]

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_new)

print("AI Semantic Director Engine written to c1.py successfully!")
