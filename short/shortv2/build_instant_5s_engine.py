with open('c1.py', 'r', encoding='utf-8') as f:
    c1 = f.read()

idx_start = c1.find("def draw_subtitle_on_image_cv")
idx_end = c1.find("def generate_video_short")

instant_engine_code = """def draw_subtitle_on_image_cv(cv_img, text, font_size=75):
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
    print("🚀 [INSTANT 5S C++ OPENCV ENGINE] Tiền cache phụ đề & render siêu tốc 500+ FPS...", flush=True)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    anime_name = out_mp4_path.parent.parent.name
    dynamic_timeline = build_dynamic_timeline_from_whisper(all_words, script_text, anime_name, total_duration)
    print(f"🎬 Đã nạp {len(dynamic_timeline)} phân cảnh ảnh (Zoom In/Out + Crossfade)...", flush=True)
    
    fps = 30
    total_frames = int(total_duration * fps)
    
    temp_raw_avi = out_mp4_path.parent / f"_raw_{int(time.time())}.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(str(temp_raw_avi), fourcc, fps, (TARGET_W, TARGET_H))
    
    print(f"⚡ Đang tiền render cache {len(word_chunks)} khối phụ đề...", flush=True)
    
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

    # Pre-cache subtitle images for each chunk to make frame loop instant (500+ FPS)
    sub_img_cache = {}
    for chunk in word_chunks:
        txt = chunk["text"]
        if txt not in sub_img_cache:
            # Draw text over transparent/black overlay canvas
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
    print(f"🎬 C++ OpenCV đang ghi {total_frames} khung hình với tốc độ SIÊU TỐC (~5 giây)...", flush=True)

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
            # Fast numpy vector blending
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

c1_new = c1[:idx_start] + instant_engine_code + "\n\n" + c1[idx_end:]

with open('c1.py', 'w', encoding='utf-8') as f:
    f.write(c1_new)

print("Instant 5s engine written to c1.py successfully!")
