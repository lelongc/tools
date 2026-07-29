# @title ⚙️ 2. Core Engine (Hỗ Trợ Tự Nhập Kịch Bản Tùy Chỉnh + AI Gemini Auto + Live Progress Bar %)
import warnings
warnings.filterwarnings('ignore')
import os, sys, time, json, cv2, numpy as np, hashlib, re, urllib.parse, asyncio, random, shutil, subprocess
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont
from curl_cffi import requests as cffi_requests
from difflib import SequenceMatcher
import nest_asyncio
nest_asyncio.apply()
import whisper

try:
    from proglog import ProgressBarLogger
    class ColabMoviePyLogger(ProgressBarLogger):
        def __init__(self, pbar_widget=None, label_widget=None, start_pct=55, end_pct=95):
            super().__init__()
            self.pbar = pbar_widget
            self.label = label_widget
            self.start_pct = start_pct
            self.end_pct = end_pct

        def bars_callback(self, bar, attr, value, old_value=None):
            if bar == 't':
                total = self.bars[bar]['total']
                if total and total > 0:
                    pct = int(self.start_pct + (value / total) * (self.end_pct - self.start_pct))
                    if self.pbar: self.pbar.value = min(100, max(0, pct))
                    if self.label: self.label.value = f"<b>🎥 [5/5] Đang xuất Video MP4 Dọc: {pct}%</b> (Đã xuất {value}/{total} khung hình)"
except Exception:
    ColabMoviePyLogger = None

try:
    from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
except Exception:
    from moviepy.video.io.ImageSequenceClip import ImageSequenceClip

TARGET_W, TARGET_H = 1080, 1920
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
BASE_LIBRARY_DIR = Path('/content/drive/MyDrive/anime_library')
SETTINGS_FILE = BASE_LIBRARY_DIR / "studio_settings.json"

def check_gpu():
    try:
        import subprocess
        output = subprocess.check_output('nvidia-smi', shell=True).decode('utf-8')
        if 'CUDA Version' in output:
            return True
    except: pass
    return False

WHISPER_MODEL = None

def get_whisper():
    global WHISPER_MODEL
    if WHISPER_MODEL is None:
        print("⏳ Đang nạp Whisper AI (tiny model) để bóc tách mốc thời gian từng từ...")
        WHISPER_MODEL = whisper.load_model("tiny")
    return WHISPER_MODEL


def search_bing_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.bing.com/images/search?q={query_clean}&adlt=strict"
    cands = []
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            import re
            for match in re.findall(r'murl&quot;:&quot;(.*?)&quot;', r.text):
                ml = match.lower()
                if not any(x in ml for x in ['cosplay', 'figure', '3d', 'real', 'statue', 'toy', 'tiktok', 'youtube']):
                    cands.append(match)
    except Exception as e:
        print(f"Lỗi Bing Images: {e}")
    seen = set()
    unique = [u for u in cands if not (u in seen or seen.add(u))]
    return unique[:limit]

def search_google_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.google.com/search?q={query_clean}&tbm=isch"
    cands = []
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            import re
            matches = re.findall(r'\["(https://[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]', r.text)
            for m in matches:
                ml = m.lower()
                if not any(x in ml for x in ['cosplay', 'figure', '3d', 'real', 'statue', 'toy', 'tiktok', 'youtube']):
                    cands.append(m)
    except Exception as e:
        print(f"Lỗi Google Images: {e}")
    seen = set()
    unique = [u for u in cands if not (u in seen or seen.add(u))]
    return unique[:limit]

def search_pinterest_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.pinterest.com/search/pins/?q={query_clean}"
    session = cffi_requests.Session()
    urls = []
    bookmarks = []
    try:
        r1 = session.get(search_url, impersonate="chrome124")
        csrf_token = session.cookies.get("csrftoken") or "123456"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrf_token,
            "X-Pinterest-AppState": "active",
            "X-Pinterest-PWS-Handler": "www/search/pins.js",
            "Referer": search_url,
        }
        for page in range(5):
            options = {"isPrefetch": False, "query": query, "scope": "pins", "no_fetch_context_on_resource": False}
            if bookmarks: options["bookmarks"] = bookmarks
            params = {"source_url": f"/search/pins/?q={query_clean}", "data": json.dumps({"options": options, "context": {}}), "_": str(int(time.time() * 1000))}
            api_url = "https://www.pinterest.com/resource/BaseSearchResource/get/"
            r2 = session.get(api_url, params=params, headers=headers, impersonate="chrome124")
            if r2.status_code == 200:
                res_resp = r2.json().get("resource_response", {})
                results = res_resp.get("data", {}).get("results", [])
                new_b = res_resp.get("bookmark")
                if new_b: bookmarks = [new_b]
                for pin in results:
                    images = pin.get("images", {})
                    orig = images.get("orig", {}).get("url") or images.get("736x", {}).get("url") or images.get("474x", {}).get("url")
                    if orig and orig not in urls: urls.append(orig)
                if len(urls) >= limit or not new_b: break
            else: break
            time.sleep(1)
    except Exception as e:
        print(f"Lỗi kết nối Pinterest Web: {e}")
    seen = set()
    unique = [u for u in urls if not (u in seen or seen.add(u))]
    return unique[:limit]

def resize_crop_save(media_data, out_path):
    tmp = out_path.parent / f"_tmp_{out_path.name}"
    tmp.write_bytes(media_data)
    try:
        img = Image.open(tmp).convert('RGB')
        w, h = img.size
        ratio = TARGET_W / TARGET_H
        if w/h > ratio: nh, nw = TARGET_H, int(w * (TARGET_H / h))
        else: nw, nh = TARGET_W, int(h * (TARGET_W / w))
        img = img.resize((nw, nh), Image.LANCZOS)
        l, t = (nw - TARGET_W) // 2, (nh - TARGET_H) // 2
        img.crop((l, t, l + TARGET_W, t + TARGET_H)).save(out_path, 'JPEG', quality=92)
        tmp.unlink(missing_ok=True)
        return True
    except Exception:
        tmp.unlink(missing_ok=True)
        return False

def build_library(char_key, anime_name, base_dir, target=50, source='pinterest'):
    char_dir = base_dir / char_key
    char_dir.mkdir(parents=True, exist_ok=True)
    existing = list(char_dir.glob("*.jpg")) + list(char_dir.glob("*.png")) + list(char_dir.glob("*.jpeg")) + list(char_dir.glob("*.webp"))
    if len(existing) >= target:
        print(f"  ✅ [{char_key}]: Đã đủ {len(existing)}/{target} ảnh yêu cầu! (Bỏ qua không tải nữa)")
        return
    used_hashes = {hashlib.md5(f.read_bytes()).hexdigest() for f in existing if f.exists()}
    query = f"{char_key.replace('_', ' ')} {anime_name.replace('_', ' ')}"
    print(f"🔎 Đang cào ảnh ({source}) cho '{query}' (Hiện có: {len(existing)}/{target})...")
    urls = search_bing_direct(query, limit=target * 2) if source == 'bing' else search_google_direct(query, limit=target * 2) if source == 'google' else search_pinterest_direct(query, limit=target * 2)
    saved_count = len(existing)
    for url in urls:
        if saved_count >= target: break
        try:
            r = requests.get(url, headers=HEADERS, timeout=10)
            if r.status_code != 200 or len(r.content) < 8000: continue
            h = hashlib.md5(r.content).hexdigest()
            if h in used_hashes: continue
            used_hashes.add(h)
            out_file = char_dir / f"{char_key}_{saved_count+1:02d}.jpg"
            if resize_crop_save(r.content, out_file):
                saved_count += 1
                print(f"    + [{char_key}] #{saved_count:02d}: Đã lưu ảnh ({source})!")
        except Exception: continue
    print(f"  🎉 HOÀN THÀNH [{char_key}]: {saved_count}/{target} ảnh!")

def run_fetch(anime_name, char_list=None, single_char=None, target_per_char=50, source='pinterest'):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    conf_path = anime_dir / "characters_config.json"
    if not conf_path.exists():
        print(f"LỖI: Chưa có file characters_config.json cho '{anime_name}'!")
        return
    try: char_dict = json.loads(conf_path.read_text(encoding="utf-8"))
    except Exception as e: print(f"LỖI đọc config: {e}"); return
    
    if single_char:
        target_chars = [single_char]
    elif char_list and len(char_list) > 0:
        target_chars = list(char_list)
    else:
        target_chars = list(char_dict.keys())
    
    print(f"\n{'='*50}\n🚀 TẢI ẢNH ({source}) CHO {len(target_chars)} NV TRONG: {anime_name} (Chỉ tiêu: {target_per_char} ảnh/NV)\n{'='*50}")
    for char_key in target_chars:
        build_library(char_key, anime_name, anime_dir, target=target_per_char, source=source)

def parse_custom_script_into_scenes(script_text, available_chars):
    words = script_text.strip().split()
    total_words = len(words)
    scenes = []
    chunk_size = max(1, total_words // 30)
    for i in range(30):
        st_idx = i * chunk_size
        et_idx = (i + 1) * chunk_size if i < 29 else total_words
        snip = " ".join(words[st_idx:et_idx])
        if not snip:
            snip = f"Scene {i+1}"
        chosen_char = available_chars[0] if available_chars else ""
        for char_key in available_chars:
            char_clean = char_key.replace("_", " ").lower()
            if char_clean in snip.lower():
                chosen_char = char_key
                break
        scenes.append({
            "scene_index": i + 1,
            "text_snippet": snip,
            "character_key": chosen_char
        })
    return scenes, " ".join(words)

def clean_json_text(text):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def generate_script_gemini(topic, anime_name, available_chars, api_key):
    models = [
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-1.5-flash"
    ]
    chars_str = ", ".join(available_chars) if available_chars else anime_name
    prompt = f"""You are an expert anime Short video director. Write a viral 60-second narrative script in ENGLISH about '{topic}' for anime '{anime_name}'.
CRITICAL MANDATE: Regardless of what language the topic is provided in, the generated script and voiceover text MUST BE WRITTEN ENTIRELY IN ENGLISH!

Available character keys in this anime library: [{chars_str}]

REQUIREMENTS:
1. The full script must be 150-160 English words (~60 seconds reading duration).
2. Divide the script into EXACTLY 30 scenes (each scene corresponds to ~2 seconds of English narration).
3. For EACH scene, assign the most relevant 'character_key' from the available list: [{chars_str}]. If a scene refers to general events, assign the main protagonist character key.

Return STRICTLY valid JSON with structure:
{{
  "script": "Full narrative script text in English...",
  "tts_script": "Full voiceover text in English...",
  "scenes": [
    {{
      "scene_index": 1,
      "text_snippet": "Short English text spoken in this 2s scene",
      "character_key": "Character_Name_Key"
    }}
  ]
}}"""
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=12)
            if r.status_code == 200:
                raw_txt = r.json()['candidates'][0]['content']['parts'][0]['text']
                clean_txt = clean_json_text(raw_txt)
                data = json.loads(clean_txt)
                print(f"   ✅ Đã tạo kịch bản thành công từ Gemini model '{model}'!")
                return data
            else:
                print(f"⚠️ Thử model {model} (Status {r.status_code}): {r.text[:80]}...")
        except Exception as e:
            print(f"⚠️ Lỗi model {model}: {e}")
    return None

def pick_unique_scene_images(scenes, anime_name):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    char_images_map = {}
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                imgs = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp"))
                random.shuffle(imgs)
                char_images_map[cdir.name] = imgs
            
    used_images = set()
    all_anime_imgs = [img for imgs in char_images_map.values() for img in imgs]
    random.shuffle(all_anime_imgs)
    
    selected_timeline = []
    for sc in scenes:
        s_idx = sc.get('scene_index', len(selected_timeline)+1)
        ckey = sc.get('character_key', '')
        snippet = sc.get('text_snippet', '')
        chosen_img = None
        
        if ckey in char_images_map:
            for img in char_images_map[ckey]:
                if str(img) not in used_images:
                    chosen_img = img
                    break
        
        if not chosen_img:
            for img in all_anime_imgs:
                if str(img) not in used_images:
                    chosen_img = img
                    break
                    
        if not chosen_img and all_anime_imgs:
            chosen_img = random.choice(all_anime_imgs)
            
        if chosen_img:
            used_images.add(str(chosen_img))
            selected_timeline.append({
                "scene": s_idx,
                "character": ckey,
                "text": snippet,
                "image": chosen_img.name,
                "image_path": str(chosen_img)
            })
    return selected_timeline

async def _edge_tts_save(text, voice, out_mp3):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate="+15%")
    await communicate.save(str(out_mp3))

def generate_tts_robust(text, voice, out_mp3):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(_edge_tts_save(text, voice, out_mp3))
            for _ in range(30):
                if out_mp3.exists() and out_mp3.stat().st_size > 1000:
                    return True
                time.sleep(0.5)
        else:
            loop.run_until_complete(_edge_tts_save(text, voice, out_mp3))
            return True
    except Exception:
        pass
    
    txt_tmp = out_mp3.parent / "script_tts_tmp.txt"
    txt_tmp.write_text(text, encoding="utf-8")
    cmd = f'edge-tts --file "{txt_tmp}" --voice "{voice}" --rate="+15%" --write-media "{out_mp3}"'
    os.system(cmd)
    txt_tmp.unlink(missing_ok=True)
    return out_mp3.exists() and out_mp3.stat().st_size > 1000


def refine_subtitles_gemini(word_chunks, script_text, api_key):
    if not api_key: return word_chunks
    print("✨ Gọi Gemini lần 2 để chuốt chuẩn Tên Riêng (Capitalization) trong phụ đề...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    
    prompt = f"""Original Script with proper nouns:
{script_text}

Here is a list of subtitle chunks generated by Whisper:
{json.dumps([c['text'] for c in word_chunks], ensure_ascii=False)}

Your task is to fix the capitalization and punctuation of the subtitle chunks to perfectly match the Original Script. 
Return EXACTLY the same number of chunks in a valid JSON array of strings. DO NOT merge or split chunks.
[
  "First chunk fixed",
  "Second chunk fixed"
]"""
    try:
        r = requests.post(url, json={'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}, timeout=10)
        if r.status_code == 200:
            fixed_texts = json.loads(clean_json_text(r.json()['candidates'][0]['content']['parts'][0]['text']))
            if len(fixed_texts) == len(word_chunks):
                for i in range(len(word_chunks)):
                    word_chunks[i]['text'] = fixed_texts[i].upper()
                print("   ✅ Đã chuốt thành công Tên Riêng với Gemini!")
                return word_chunks
    except Exception as e:
        print(f"⚠️ Không thể chuốt phụ đề với Gemini: {e}")
    return word_chunks

def align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2):
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
            font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", "C:\\Windows\\Fonts\\arialbd.ttf"]
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


def generate_video_short(anime_name, topic, api_key, voice="en-US-ChristopherNeural", custom_script="", pbar_widget=None, label_widget=None):
    out_dir = BASE_LIBRARY_DIR / anime_name / "output_shorts"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    anime_dir = BASE_LIBRARY_DIR / anime_name
    conf_path = anime_dir / "characters_config.json"
    available_chars = list(json.loads(conf_path.read_text(encoding="utf-8")).keys()) if conf_path.exists() else []
    
    if custom_script and custom_script.strip():
        if label_widget: label_widget.value = "<b>📝 [1/5] 10%</b> — Đang nạp Kịch bản Tùy Chỉnh do bạn nhập..."
        if pbar_widget: pbar_widget.value = 10
        scenes, script_text = parse_custom_script_into_scenes(custom_script, available_chars)
    else:
        if label_widget: label_widget.value = "<b>🚀 [1/5] 5%</b> — AI Gemini đang viết kịch bản Tiếng Anh 30 phân cảnh..."
        if pbar_widget: pbar_widget.value = 5
        script_data = generate_script_gemini(topic, anime_name, available_chars, api_key)
        if not script_data or 'scenes' not in script_data:
            if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không thể tạo kịch bản Gemini. Kiểm tra lại API Key hoặc nhập kịch bản tùy chỉnh!</b>"
            return
        scenes = script_data['scenes']
        script_text = script_data.get('tts_script') or script_data.get('script', '')
    
    if label_widget: label_widget.value = f"<b>🖼️ [2/5] 20%</b> — Đang lựa chọn 30 bức ảnh nhân vật từ Drive..."
    if pbar_widget: pbar_widget.value = 20
    timeline = pick_unique_scene_images(scenes, anime_name)
    
    if label_widget: label_widget.value = "<b>🎙️ [3/5] 35%</b> — Đang tạo giọng đọc Edge-TTS Tiếng Anh (Tốc độ +15%)..."
    if pbar_widget: pbar_widget.value = 35
    audio_temp_path = out_dir / "_temp_audio.mp3"
    ok = generate_tts_robust(script_text, voice, audio_temp_path)
    if not ok:
        if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không tạo được giọng đọc TTS!</b>"
        return
        
    if label_widget: label_widget.value = "<b>🧠 [4/5] 45%</b> — Whisper AI đang bóc tách mốc phát âm từng từ..."
    if pbar_widget: pbar_widget.value = 45
    
    timestamp = int(time.time())
    out_mp4_path = out_dir / f"{anime_name}_Short_{timestamp}.mp4"
    render_mp4_video_word_sync(timeline, script_text, audio_temp_path, out_mp4_path, pbar_widget, label_widget, api_key)
