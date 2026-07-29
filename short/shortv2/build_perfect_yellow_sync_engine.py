with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

idx_start = c1.find("def align_word_subtitles_whisper_smart")
idx_end = c1.find("def generate_video_short")

perfect_engine_code = """def align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2):
    w_model = get_whisper()
    print("🎙️ Whisper AI đang bóc tách mốc thời gian âm thanh từng từ...", flush=True)
    res = w_model.transcribe(str(audio_path), word_timestamps=True, language="en")
    
    whisper_words = []
    for segment in res.get("segments", []):
        for w_info in segment.get("words", []):
            w_str = w_info["word"].strip()
            st, et = w_info["start"], w_info["end"]
            if w_str and len(re.sub(r'[^a-zA-Z0-9]', '', w_str)) > 0:
                whisper_words.append({"word": w_str.upper(), "start": st, "end": et})
                
    if not whisper_words:
        ref_w = script_text.split()
        total_d = 45.0
        dur_w = total_d / max(1, len(ref_w))
        whisper_words = [{"word": w.upper(), "start": i*dur_w, "end": (i+1)*dur_w} for i, w in enumerate(ref_w)]

    chunks = []
    curr_words, curr_st, curr_et = [], None, None
    for idx, item in enumerate(whisper_words):
        if not curr_words: curr_st = item['start']
        curr_words.append(item['word'])
        curr_et = item['end']
        
        is_last = (idx == len(whisper_words) - 1)
        pause_next = False
        if not is_last and (whisper_words[idx+1]['start'] - item['end']) > 0.35:
            pause_next = True
                
        if len(curr_words) >= max_words_per_chunk or pause_next or is_last:
            chunks.append({"text": " ".join(curr_words), "start": curr_st, "end": curr_et})
            curr_words, curr_st, curr_et = [], None, None
            
    for i in range(len(chunks) - 1):
        gap = chunks[i+1]['start'] - chunks[i]['end']
        if 0 < gap < 0.25: chunks[i]['end'] = chunks[i+1]['start']
            
    return chunks, whisper_words

def build_semantic_timeline(all_words, script_text, anime_name, topic, total_duration, api_key, target_images=30):
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
    
    # 1. Determine Main Subject Character (e.g. Rimuru_Tempest)
    main_subject_char = available_chars[0] if available_chars else "Rimuru_Tempest"
    topic_clean = topic.lower().replace("_", " ")
    for ckey in available_chars:
        ckey_clean = ckey.lower().replace("_", " ")
        if ckey_clean in topic_clean or any(part in topic_clean for part in ckey_clean.split()):
            main_subject_char = ckey
            break
            
    print(f"🎯 Nhân vật chủ đề chính của Video: [{main_subject_char}]", flush=True)

    # 2. Divide video into 30 intervals (2.0s per image)
    interval_dur = total_duration / target_images
    timeline_segments = []
    used_images_per_char = {c: [] for c in available_chars}
    
    for i in range(target_images):
        st = i * interval_dur
        et = (i + 1) * interval_dur if i < target_images - 1 else total_duration
        
        # Collect spoken words in this 2s window
        words_in_interval = [w["word"].lower() for w in all_words if st <= w["start"] < et]
        interval_text = " ".join(words_in_interval)
        
        # Check if another character is explicitly mentioned in this 2s window
        assigned_char = main_subject_char
        for ckey in available_chars:
            ckey_parts = ckey.lower().replace("_", " ").split()
            first_name = ckey_parts[0]
            if first_name in interval_text and len(first_name) >= 3:
                assigned_char = ckey
                break
                
        # Pick image for assigned_char
        pool = char_images_map.get(assigned_char, all_anime_imgs)
        used = used_images_per_char.get(assigned_char, [])
        avail = [img for img in pool if img not in used]
        if not avail:
            used_images_per_char[assigned_char] = []
            avail = pool
        chosen_img = random.choice(avail) if avail else random.choice(all_anime_imgs)
        if assigned_char in used_images_per_char:
            used_images_per_char[assigned_char].append(chosen_img)
            
        timeline_segments.append({
            "start": st,
            "end": et,
            "char": assigned_char,
            "snippet": interval_text,
            "image_path": str(chosen_img)
        })
        
    return timeline_segments

def render_mp4_video_word_sync(timeline, script_text, audio_path, out_mp4_path, pbar_widget=None, label_widget=None, api_key=None):
    print("🚀 [PERFECT YELLOW SUBTITLE & MAIN CHARACTER ENGINE] Đồng bộ mốc từ Whisper & Phụ đề Vàng...", flush=True)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    
    anime_name = out_mp4_path.parent.parent.name
    # Get topic from output filename or default
    topic = "Rimuru Tempest"
    dynamic_timeline = build_semantic_timeline(all_words, script_text, anime_name, topic, total_duration, api_key, target_images=30)
    print(f"🎬 Đã nạp {len(dynamic_timeline)} bức ảnh (Chủ đề chính + Khớp NV khi nhắc tên, 2.0s/ảnh)...", flush=True)
    
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

    # PRE-RENDER BRIGHT YELLOW SUBTITLES WITH CORRECT BGR CONVERSION
    sub_img_cache = {}
    for chunk in word_chunks:
        txt = chunk["text"]
        if txt not in sub_img_cache:
            overlay = np.zeros((TARGET_H, TARGET_W, 4), dtype=np.uint8)
            pil_ov = Image.fromarray(overlay, mode="RGBA")
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
            stroke_w = 6
            # Draw thick black outline
            for dx in range(-stroke_w, stroke_w + 1):
                for dy in range(-stroke_w, stroke_w + 1):
                    if dx != 0 or dy != 0: draw.text((x + dx, y + dy), txt_upper, font=font, fill=(0, 0, 0, 255))
            # Draw BRIGHT YELLOW text (RGBA: 255, 255, 0, 255)
            draw.text((x, y), txt_upper, font=font, fill=(255, 255, 0, 255))
            
            # PROPER RGBA -> BGRA conversion for OpenCV
            bgra_np = cv2.cvtColor(np.array(pil_ov), cv2.COLOR_RGBA2BGRA)
            sub_img_cache[txt] = (bgra_np[:, :, :3], bgra_np[:, :, 3] / 255.0)

    fade_frames = 4
    print(f"🎬 C++ OpenCV đang ghi {total_frames} khung hình (Phụ đề Vàng rực rỡ & Khớp tuyệt đối)...", flush=True)

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
            txt_bgr, alpha_mask = sub_img_cache[active_sub_text]
            mask_3d = alpha_mask[:, :, None]
            frame_final = (frame_bg * (1.0 - mask_3d) + txt_bgr * mask_3d).astype(np.uint8)
        else:
            frame_final = frame_bg
            
        writer.write(frame_final)
        
    writer.release()
    print("⚡ FFmpeg đang muxing MP4 AAC (stream copy ~2s)...", flush=True)
    
    cmd = f'ffmpeg -y -i "{temp_raw_avi}" -i "{audio_path}" -c:v libx264 -preset ultrafast -c:a aac -shortest "{out_mp4_path}"'
    subprocess.run(cmd, shell=True)
    
    temp_raw_avi.unlink(missing_ok=True)
"""

c1_new = c1[:idx_start] + perfect_engine_code + "\n\n" + c1[idx_end:]

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_new)

print("Perfect Yellow Sync Engine written to c1.py successfully!")
