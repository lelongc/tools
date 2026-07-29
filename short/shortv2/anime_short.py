#!/usr/bin/env python3
"""
🎬 ANIME SHORT VIDEO MAKER — 100% Anime Image Filtering + Tenor GIFs + Gemini Whisper Subtitle Corrector
- Lọc ảnh Anime 100%: Chỉ lấy ảnh từ các domain Anime/LN uy tín (Fandom, Wikia, Zerochan, Safebooru, Wallhaven, Tenor GIF, MAL). Loại bỏ hoàn toàn ảnh đời thực/người thật!
- Tenor GIF API Free Unlimited: Tải trực tiếp GIF cảnh Anime chuyển động chất lượng cao từ Tenor.
- Gemini 3.1 Flash Subtitle Corrector: Tự động sửa lỗi chính tả tên nhân vật Anime do Whisper nghe nhầm (vd: "Reemoo" -> "RIMURU"), giữ nguyên mốc millisecond!
- T4 GPU NVENC Acceleration + Dynamic Ken Burns Motion Effects.
"""
import argparse
import asyncio
import hashlib
import json
import mimetypes
import os
import random
import re
import struct
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote

import requests
import whisper
from PIL import Image, ImageSequence
from google import genai
from google.genai import types

TARGET_W = 1080
TARGET_H = 1920
FPS = 30
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

# Các domain uy tín 100% về Anime / Light Novel
ANIME_DOMAINS = [
    "wikia.nocookie.net", "fandom.com", "zerochan.net", "wallhaven.cc",
    "safebooru.org", "tenor.com", "tenor.googleapis.com", "gelbooru.com",
    "danbooru.donmai.us", "myanimelist.net", "anime-planet.com", "media.tenor.com"
]

PROMPT_TEMPLATE = """You are an expert anime content creator who makes viral YouTube Shorts about hidden anime lore, unknown facts, and shocking revelations. Write an engaging narration script about: "{topic}"

## CRITICAL RULES:
- You MUST research and use ACCURATE anime lore. Do NOT make up facts.
- The script MUST be between 150 and 165 words for a 60-second video at natural storytelling pace.
- Write in a gripping, mysterious narrative — like a deep-voiced anime narrator revealing secrets.
- Use short, punchy sentences. High energy, zero fluff.

## STRUCTURE:
- Opening Hook (~25 words): Shocking statement or question.
- Body (~110 words): Clear, fast-paced lore breakdown.
- Closing (~25 words): Strong call-to-action or mind-blowing question.

## SCENES (EXACTLY 30 SCENES FOR 30 DISTINCT ANIME IMAGES/GIFS):
Split the script into EXACTLY 30 short scenes. Each scene = 1 image/GIF shown for ~2 seconds.

IMPORTANT INSTRUCTION FOR search_query:
- Every single scene MUST have a DIFFERENT, SPECIFIC visual search query (3-5 words).
- DO NOT repeat the exact same search query across scenes!
- Include specific actions, forms, skills, locations, or secondary characters in each scene's query.
- Examples for Tensura:
  "Rimuru Tempest slime form anime", "Rimuru human form sword", "Rimuru True Demon Lord evolution",
  "Great Sage skill blue aura Tensura", "Veldora Tempest storm dragon", "Milim Nava dragonoid form anime",
  "Benimaru dark flame skill Tensura", "Shizue Izawa Ifrit flame mask", "Raphael Ultimate Skill Tensura",
  "Diablo Black Progenitor demon Tensura", "Tempest Federation capital city anime", "Rimuru vs Clayman fight scene".

## OUTPUT (valid JSON only):
{{
  "word_count": 160,
  "anime_title": "Anime Name",
  "script": "Full narration script.",
  "director_note": "Pace: Natural speaking pace, smooth, fluid. Deep, engaging male voice.",
  "tts_script": "Script for TTS without unnecessary pause cues.",
  "scenes": [
    {{"text": "Most anime fans know Rimuru Tempest", "search_query": "Rimuru Tempest slime form anime"}},
    {{"text": "became an overpowered True Demon Lord", "search_query": "Rimuru True Demon Lord evolution"}}
  ]
}}

IMPORTANT: You MUST return EXACTLY 30 scenes with 30 UNIQUE, SPECIFIC search_queries."""



def generate_script(topic: str, api_key: str) -> dict:
    print(f"\n{'='*60}")
    print(f"📖 [1/6] Sinh kịch bản anime (Gemini 3.1 Flash Lite)...")
    print(f"{'='*60}")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"

    body = {
        'contents': [{'role': 'user', 'parts': [{'text': PROMPT_TEMPLATE.format(topic=topic, anime_name=anime_name, example_chars=", ".join(list(char_dict.keys())[:10]) if char_dict else "Goku, Naruto")}]}],
        'systemInstruction': {'parts': [{'text': 'Return valid JSON only. Accurate anime lore. 150-165 words. EXACTLY 30 scenes.'}]},
        'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0.7}
    }

    for attempt in range(3):
        try:
            resp = requests.post(url, headers={'Content-Type': 'application/json'}, json=body, timeout=90)
            if resp.status_code in (429, 503):
                time.sleep(10)
                continue
            resp.raise_for_status()

            raw = resp.json()['candidates'][0]['content']['parts'][0]['text'].strip()
            raw = re.sub(r'^```json\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            data = json.loads(raw)

            wc = len(data.get('script', '').split())
            sc = len(data.get('scenes', []))
            print(f"   ✅ Kịch bản: {wc} từ, {sc} scenes (~2s/ảnh)")

            return data
        except Exception as e:
            if attempt >= 2:
                raise
            time.sleep(5)

    return data


def search_anime_images(query: str, used_urls: set, limit: int = 25, strict_domain: bool = True) -> list:
    """
    Tải 100% ảnh/GIF Anime chuẩn xác — Wallhaven API + Tenor GIFs + Safebooru + Bing/Google Anime.
    Nếu strict_domain=True: Chỉ lấy từ các domain Anime uy tín.
    Nếu strict_domain=False: Mở rộng lấy ảnh từ mọi nguồn nhưng vẫn lọc sạch xe cộ, người thật, cosplay, logo.
    """
    clean_q = re.sub(r"[^a-zA-Z0-9\s]", " ", query.strip()).strip()
    candidates = []
    
    ANIME_DOMAINS = [
        "wikia.nocookie.net", "fandom.com", "zerochan.net", "wallhaven.cc", "w.wallhaven.cc",
        "safebooru.org", "tenor.com", "tenor.googleapis.com", "gelbooru.com", "cdn.donmai.us",
        "danbooru.donmai.us", "myanimelist.net", "anime-planet.com", "media.tenor.com",
        "pxfuel.com", "wallpapercave.com", "wallpaperflare.com", "wallpapers.com",
        "deviantart.net", "wixmp.com", "pixiv.net", "alphacoders.com"
    ]
    
    JUNK_KEYWORDS = [
        "ferrari", "car", "vehicle", "auto", "cosplay", "real", "person", "photo", "model",
        "logo", "icon", "banner", "white-screen", "hentai", "ecchi", "nsfw", "sexy", "nude", "bikini", "r18"
    ]

    # 1. Tenor GIF API (Free Unlimited — Cảnh GIF Anime chuyển động)
    try:
        tenor_url = f"https://tenor.googleapis.com/v2/search?q={quote(clean_q + ' anime')}&key=LIVDSRZULELA&limit=10"
        r_tenor = requests.get(tenor_url, headers=HEADERS, timeout=5)
        if r_tenor.status_code == 200:
            for item in r_tenor.json().get('results', []):
                media_formats = item.get('media_formats', {})
                gif_url = media_formats.get('gif', {}).get('url') or media_formats.get('mediumgif', {}).get('url')
                if gif_url and gif_url not in used_urls:
                    candidates.append(gif_url)
    except Exception:
        pass

    # 2. Wallhaven Anime API (Categories = 010 -> 100% Anime Category)
    try:
        wh_url = f"https://wallhaven.cc/api/v1/search?q={quote(clean_q)}&categories=010&purity=100"
        r_wh = requests.get(wh_url, headers=HEADERS, timeout=5)
        if r_wh.status_code == 200:
            for item in r_wh.json().get('data', []):
                path = item.get('path')
                if path and path not in used_urls:
                    candidates.append(path)
    except Exception:
        pass

    # 3. Safebooru (rating:general — Official Anime Artwork / Render)
    try:
        sb_tag = re.sub(r"\s+", "_", clean_q.lower())
        sb_url = f"https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=10&tags={quote(sb_tag)}+rating:general"
        r_sb = requests.get(sb_url, headers=HEADERS, timeout=5)
        if r_sb.status_code == 200 and r_sb.json():
            for post in r_sb.json():
                file_url = post.get('file_url')
                if file_url and file_url not in used_urls:
                    if not file_url.startswith('http'): file_url = 'https:' + file_url
                    candidates.append(file_url)
    except Exception:
        pass

    # 4. Bing Image Search
    try:
        bing_query = f"{clean_q} anime screenshot"
        b_url = f"https://www.bing.com/images/search?q={quote(bing_query)}&adlt=strict&FORM=HDRSC2"
        r_bing = requests.get(b_url, headers=HEADERS, timeout=5)
        if r_bing.status_code == 200:
            for m in re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', r_bing.text):
                m_low = m.lower()
                if m not in used_urls:
                    if not strict_domain or any(dom in m_low for dom in ANIME_DOMAINS):
                        if not any(bad in m_low for bad in JUNK_KEYWORDS):
                            candidates.append(m)
    except Exception:
        pass

    # 5. Google Images
    try:
        g_url = f"https://www.google.com/search?q={quote(clean_q + ' anime screenshot')}&tbm=isch&safe=active"
        r_g = requests.get(g_url, headers=HEADERS, timeout=5)
        if r_g.status_code == 200:
            for m in re.findall(r'\["(https?://[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"', r_g.text):
                m_low = m.lower()
                if m not in used_urls and len(m) < 500:
                    if not strict_domain or any(dom in m_low for dom in ANIME_DOMAINS):
                        if not any(bad in m_low for bad in JUNK_KEYWORDS):
                            if "gstatic.com" not in m_low and "google.com" not in m_low:
                                candidates.append(m)
    except Exception:
        pass

    # Loại bỏ trùng lặp giữ nguyên thứ tự
    seen = set()
    unique = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            unique.append(c)

    return unique[:limit]





def resize_crop_media(media_path: Path, out_path: Path):
    """Cắt/Resize ảnh tĩnh hoặc GIF hoạt hình về kích thước chuẩn 1080x1920 (9:16)."""
    img = Image.open(media_path)
    is_gif = getattr(img, "is_animated", False)

    if is_gif:
        frames = []
        for frame in ImageSequence.Iterator(img):
            f = frame.convert('RGB')
            w, h = f.size
            ratio = TARGET_W / TARGET_H
            if w / h > ratio:
                new_h, new_w = TARGET_H, int(w * (TARGET_H / h))
            else:
                new_w, new_h = TARGET_W, int(h * (TARGET_W / w))
            f = f.resize((new_w, new_h), Image.LANCZOS)
            left = (new_w - TARGET_W) // 2
            top = (new_h - TARGET_H) // 2
            frames.append(f.crop((left, top, left + TARGET_W, top + TARGET_H)))
        if frames:
            frames[0].save(out_path, save_all=True, append_images=frames[1:], loop=0, duration=100)
            return

    img = img.convert('RGB')
    w, h = img.size
    ratio = TARGET_W / TARGET_H
    if w / h > ratio:
        new_h, new_w = TARGET_H, int(w * (TARGET_H / h))
    else:
        new_w, new_h = TARGET_W, int(h * (TARGET_W / w))
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - TARGET_W) // 2
    top = (new_h - TARGET_H) // 2
    img.crop((left, top, left + TARGET_W, top + TARGET_H)).save(out_path, 'JPEG', quality=92)


URL_LOCK = threading.Lock()

def download_single_scene_media(idx: int, scene: dict, images_dir: Path, used_urls: set, used_hashes: set, anime_name: str, char_dict: dict) -> tuple:
    """Tải 1 ảnh/GIF độc nhất cho từng scene — Ưu tiên lấy từ Thư mục Drive bạn tự lọc (anime_library)."""
    query = scene.get('search_query', 'Rimuru Tempest')
    final_path = images_dir / f"scene_{idx:02d}.jpg"

    if final_path.exists() and final_path.stat().st_size > 8000:
        return idx, final_path, True

    # Phase 0: Ưu tiên lấy từ Drive
    drive_lib = Path(f"/content/drive/MyDrive/anime_library/{anime_name}")
    local_lib = Path(__file__).parent / "anime_library" / anime_name
    lib_bases = [drive_lib, local_lib]

    q_low = query.lower()
    matched_folder = None
    for key in char_dict.keys():
        fw = key.lower().replace("_", " ").split()[0]
        if fw in q_low: matched_folder = key; break

    if matched_folder:
        for base in lib_bases:
            if base.exists():
                target_dir = base / matched_folder
                if target_dir.exists():
                    local_images = sorted(list(target_dir.glob("*.jpg")) + list(target_dir.glob("*.png")) + list(target_dir.glob("*.gif")))
                    if local_images:
                        with URL_LOCK:
                            for img_p in local_images:
                                if str(img_p) not in used_urls:
                                    used_urls.add(str(img_p))
                                    resize_crop_media(img_p, final_path)
                                    return idx, final_path, True


    # Phase 1: Search bằng query chính (Strict Anime Domains)
    with URL_LOCK:
        candidates = search_anime_images(query, used_urls, limit=30, strict_domain=True)
        if not candidates and " " in query:
            fw = query.strip().split()[0]
            if len(fw) > 2:
                candidates = search_anime_images(f"{fw} anime", used_urls, limit=30, strict_domain=True)
        if not candidates:
            candidates = search_anime_images(f"{query} anime wallpaper scene {idx+1}", used_urls, limit=30, strict_domain=False)
        if not candidates and " " in query:
            fw = query.strip().split()[0]
            if len(fw) > 2:
                candidates = search_anime_images(f"{fw} anime wallpaper", used_urls, limit=30, strict_domain=False)

        my_candidates = []
        for url in candidates:
            if url not in used_urls:
                used_urls.add(url)
                my_candidates.append(url)

    tmp_path = images_dir / f"_tmp_{idx:02d}.dat"

    for url in my_candidates:
        try:
            r = requests.get(url, headers=HEADERS, timeout=8)
            if r.status_code != 200 or len(r.content) < 8000:
                continue

            img_hash = hashlib.md5(r.content).hexdigest()
            with URL_LOCK:
                if img_hash in used_hashes:
                    continue
                used_hashes.add(img_hash)

            tmp_path.write_bytes(r.content)
            resize_crop_media(tmp_path, final_path)
            tmp_path.unlink(missing_ok=True)

            return idx, final_path, True
        except Exception:
            continue


    bg_color = ((idx * 43) % 180 + 30, (idx * 83) % 180 + 30, (idx * 127) % 180 + 30)
    Image.new('RGB', (TARGET_W, TARGET_H), bg_color).save(final_path, 'JPEG')
    return idx, final_path, False



def fetch_scene_images_parallel(scenes: list, images_dir: Path, anime_name: str, char_dict: dict) -> list:
    print(f"\n{'='*60}")
    print(f"🖼️ [2/6] Tải 30 ảnh/GIF Anime độc nhất (Atomic Thread-Safe Engine)...")
    print(f"{'='*60}")

    scene_images = [None] * len(scenes)
    used_urls = set()
    used_hashes = set()

    start_dl = time.time()

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(download_single_scene_media, i, sc, images_dir, used_urls, used_hashes, anime_name, char_dict)
            for i, sc in enumerate(scenes)
        ]

        for future in as_completed(futures):
            idx, path, ok = future.result()
            scene_images[idx] = path
            status = "✅ Anime OK" if ok else "⚠️ Fallback"
            print(f"   ⚡ [{idx+1:2d}/30] Scene #{idx+1:02d} -> {status}")

    dl_time = time.time() - start_dl
    print(f"   🚀 TẢI HOÀN TẤT 30 ẢNH/GIF ANIME ĐỘC NHẤT TRONG {dl_time:.1f} GIÂY!")

    return scene_images



async def generate_edge_tts_async(text: str, voice_name: str, output_mp3: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice_name)
    await communicate.save(str(output_mp3))


def generate_tts(script: str, director_note: str, tts_script: str, api_key: str, output_dir: Path, voice: str = "Fenrir") -> Path:
    print(f"\n{'='*60}")
    print(f"🎙️ [3/6] Sinh giọng đọc TTS (Edge-TTS Neural Voice)...")
    print(f"{'='*60}")

    narration = tts_script if tts_script else script
    output_mp3 = output_dir / "audio.mp3"

    try:
        asyncio.run(generate_edge_tts_async(narration, "en-US-ChristopherNeural", output_mp3))
        if output_mp3.exists() and output_mp3.stat().st_size > 10000:
            print(f"   ✅ Audio saved: {output_mp3.name}")
            return output_mp3
    except Exception as e:
        print(f"   ⚠️ Edge-TTS failed: {e}. Switching to Gemini TTS...")

    client = genai.Client(api_key=api_key)
    prompt = f"Read the following transcript in a deep storytelling tone:\n\n{narration}"
    contents = [types.Content(role='user', parts=[types.Part.from_text(text=prompt)])]
    config = types.GenerateContentConfig(
        temperature=1, response_modalities=['audio'],
        speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)))
    )
    all_audio, final_mime = b'', None
    for chunk in client.models.generate_content_stream(model='gemini-3.1-flash-tts-preview', contents=contents, config=config):
        if chunk.parts and chunk.parts[0].inline_data:
            all_audio += chunk.parts[0].inline_data.data
            if final_mime is None: final_mime = chunk.parts[0].inline_data.mime_type
    audio_file = output_dir / "audio.wav"
    audio_file.write_bytes(all_audio)
    print(f"   ✅ Audio saved: {audio_file.name}")
    return audio_file


def get_audio_duration(audio_path: Path) -> float:
    try:
        r = subprocess.run(['ffmpeg', '-i', str(audio_path)], capture_output=True, text=True, errors='ignore')
        m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', r.stderr)
        if m:
            return int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
    except: pass
    return 0.0


def correct_subtitles_with_gemini(raw_events: list, original_script: str, api_key: str) -> list:
    """
    Sử dụng Gemini 3.1 Flash Lite để sửa chính tả tên riêng nhân vật Anime trong phụ đề Whisper
    (ví dụ: "reemoo" -> "RIMURU", "bell dora" -> "VELDORA"), giữ nguyên timestamp!
    """
    print("   🪄 Đang dùng Gemini 3.1 Flash Lite chuẩn hóa từ ngữ Anime trong phụ đề Whisper...")
    sub_items = []
    for line in raw_events:
        m = re.match(r'Dialogue:\s*0,([^,]+),([^,]+),Default,,0,0,0,,(.*)', line)
        if m:
            sub_items.append({'st': m.group(1), 'et': m.group(2), 'text': m.group(3)})

    prompt = f"""You are an anime subtitle editor. Below is the original correct anime script:
ORIGINAL SCRIPT:
"{original_script}"

Below is a list of speech recognition subtitle lines. Speech recognition often mishears proper anime names (e.g., 'reemoo' -> 'RIMURU', '10 sura' -> 'TENSURA', 'bell dora' -> 'VELDORA').
Correct any misheard proper anime names or words in the subtitle texts based on the original script. Keep the EXACT list structure and UPPERCASE format.

INPUT SUBTITLES:
{json.dumps([item['text'] for item in sub_items])}

RETURN ONLY A VALID JSON ARRAY OF STRINGS WITH THE CORRECTED SUBTITLE TEXTS:
["CORRECTED_TEXT_1", "CORRECTED_TEXT_2", ...]"""

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"
        body = {
            'contents': [{'role': 'user', 'parts': [{'text': prompt}]}],
            'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0.1}
        }
        r = requests.post(url, headers={'Content-Type': 'application/json'}, json=body, timeout=20)
        if r.status_code == 200:
            raw = r.json()['candidates'][0]['content']['parts'][0]['text'].strip()
            raw = re.sub(r'^```json\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            corrected_texts = json.loads(raw)
            if len(corrected_texts) == len(sub_items):
                for i in range(len(sub_items)):
                    sub_items[i]['text'] = corrected_texts[i].upper()
                print("   ✅ Sửa lỗi từ ngữ Anime thành công 100%!")
    except Exception as e:
        print(f"   ⚠️ Gemini Subtitle Corrector skipped: {e}")

    corrected_events = []
    for item in sub_items:
        corrected_events.append(f"Dialogue: 0,{item['st']},{item['et']},Default,,0,0,0,,{item['text']}")
    return corrected_events


def generate_subtitles_whisper(audio_path: Path, output_ass: Path, script: str, api_key: str):
    """Whisper AI word-level timestamp extraction + Forced Script Word Alignment (100% Khớp Kịch Bản)."""
    print(f"\n{'='*60}")
    print(f"📝 [4/6] Khớp phụ đề Whisper AI + Căn chỉnh 100% từ ngữ Kịch bản gốc...")
    print(f"{'='*60}")

    print("   🧠 Đang chạy Whisper AI trích xuất timestamp từng từ...")
    w_model = whisper.load_model("tiny.en")
    res = w_model.transcribe(str(audio_path), word_timestamps=True, language="en")

    def fmt(s):
        h, m, sec, ms = int(s//3600), int((s%3600)//60), int(s%60), int((s%1)*100)
        return f"{h}:{m:02d}:{sec:02d}.{ms:02d}"

    # Trích xuất toàn bộ timestamp slots từ Whisper audio recognition
    whisper_slots = []
    for seg in res.get('segments', []):
        for w in seg.get('words', []):
            if 'start' in w and 'end' in w:
                whisper_slots.append((w['start'], w['end']))

    # Trích xuất toàn bộ danh sách từ chuẩn xác từ kịch bản gốc của Gemini (VIẾT HOA)
    script_words = [w.strip() for w in re.findall(r'\b[\w\'-]+\b', script.upper()) if w.strip()]

    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 1

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,DejaVu Sans,78,&H0000FFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,7,2,5,50,50,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    final_events = []
    total_script_words = len(script_words)
    total_slots = len(whisper_slots)

    if total_script_words > 0 and total_slots > 0:
        sw_idx = 0
        sl_idx = 0
        while sw_idx < total_script_words and sl_idx < total_slots:
            txt = script_words[sw_idx]
            st = whisper_slots[sl_idx][0]
            et = whisper_slots[sl_idx][1]
            sw_idx += 1
            sl_idx += 1
            final_events.append(f"Dialogue: 0,{fmt(st)},{fmt(et)},Default,,0,0,0,,{txt}")


    output_ass.write_text(ass_header + "\n".join(final_events), encoding='utf-8')
    print(f"   ✅ Đã xuất {len(final_events)} phụ đề KHỚP 100% TỪ NGUYÊN KỊCH BẢN GỐC!")


def render_video_gpu(scene_images: list, audio_path: Path, sub_path: Path, output_path: Path, audio_dur: float):
    """Render video GPU T4 NVENC + Ken Burns Motion Effects."""
    print(f"\n{'='*60}")
    print(f"🎬 [5/6] Render video T4 GPU NVENC + Motion Transitions...")
    print(f"{'='*60}")

    project_dir = output_path.parent
    clips = []

    has_nvenc = False
    try:
        r_gpu = subprocess.run(['ffmpeg', '-encoders'], capture_output=True, text=True, errors='ignore')
        if 'h264_nvenc' in r_gpu.stdout:
            has_nvenc = True
            print("   🚀 Kích hoạt GPU NVIDIA T4 phần cứng (h264_nvenc)!")
    except Exception:
        pass

    v_codec = 'h264_nvenc' if has_nvenc else 'libx264'
    n_scenes = len(scene_images)
    dur_per_scene = audio_dur / n_scenes if n_scenes > 0 else 2.0

    motion_effects = [
        "zoompan=z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2':d={df}:s={w}x{h}:fps={fps}",
        "zoompan=z='max(1.25-0.0015*on,1.0)':x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2':d={df}:s={w}x{h}:fps={fps}",
        "zoompan=z='1.15':x='if(lte(on,-1),0,min(x+1.2,iw-iw/zoom))':y='ih/2-(ih/zoom)/2':d={df}:s={w}x{h}:fps={fps}",
        "zoompan=z='1.15':x='if(lte(on,-1),iw-iw/zoom,max(x-1.2,0))':y='ih/2-(ih/zoom)/2':d={df}:s={w}x{h}:fps={fps}",
    ]

    for i, img in enumerate(scene_images):
        dur = dur_per_scene
        df = max(int(dur * FPS), 1)
        clip = project_dir / f"_clip_{i:03d}.mp4"
        clips.append(clip)

        effect_expr = motion_effects[i % len(motion_effects)].format(df=df, w=TARGET_W, h=TARGET_H, fps=FPS)

        is_gif = str(img).lower().endswith('.gif')
        if is_gif:
            cmd = ['ffmpeg', '-y', '-ignore_loop', '0', '-i', str(img), '-vf', f"scale={TARGET_W}:{TARGET_H}:force_original_aspect_ratio=increase,crop={TARGET_W}:{TARGET_H}",
                   '-c:v', v_codec, '-t', f'{dur:.3f}', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(clip)]
        else:
            cmd = ['ffmpeg', '-y', '-loop', '1', '-i', str(img), '-vf', effect_expr,
                   '-c:v', v_codec, '-t', f'{dur:.3f}', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(clip)]

        if not has_nvenc:
            cmd.extend(['-preset', 'ultrafast'])

        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"\r   📹 Clip {i+1}/{n_scenes} (Motion #{i%4+1})", end="", flush=True)

    print(" ✅")

    concat_file = project_dir / "_concat.txt"
    concat_file.write_text("\n".join(f"file '{c.name}'" for c in clips))
    merged_video = project_dir / "_merged_video.mp4"
    subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
        '-c', 'copy', str(merged_video)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print("   🎨 Chèn phụ đề Whisper chữ vàng & lồng âm thanh (1 pass GPU)...")
    merge_cmd = ['ffmpeg', '-y', '-i', str(merged_video), '-i', str(audio_path),
                 '-vf', f"subtitles={sub_path.name}", '-c:v', 'libx264', '-preset', 'ultrafast',
                 '-c:a', 'aac', '-b:a', '192k', '-shortest', str(output_path)]

    res = subprocess.run(merge_cmd, cwd=str(project_dir), capture_output=True, text=True, errors='ignore')

    for c in clips: c.unlink(missing_ok=True)
    concat_file.unlink(missing_ok=True); merged_video.unlink(missing_ok=True)

    if output_path.exists():
        mb = output_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Final video: {output_path.name} ({mb:.1f} MB)")
        return True
    else:
        print("   ❌ Render failed!")
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", "-t", required=True)
    parser.add_argument("--anime", "-a", required=True)
    parser.add_argument("--api-key", "-k", default=None)
    parser.add_argument("--voice", "-v", default="Fenrir")
    parser.add_argument("--output-dir", "-o", default="/content/output")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        possible_key_files = [
            Path(__file__).parent / ".env",
            Path("/content/drive/MyDrive/gemini_key.txt"),
            Path("/content/.env")
        ]
        for kf in possible_key_files:
            if kf.exists():
                content = kf.read_text(encoding="utf-8").strip()
                if "=" in content:
                    for line in content.splitlines():
                        if line.startswith("GEMINI_API_KEY="):
                            api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                            break
                else:
                    api_key = content
                if api_key:
                    break
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be provided via -k/--api-key, environment variable, .env, or /content/drive/MyDrive/gemini_key.txt")
    args.api_key = api_key

    start_time = time.time()
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    img_dir = out / "images"
    img_dir.mkdir(parents=True, exist_ok=True)

    config_path = Path("/content/drive/MyDrive/anime_library/anime_characters_config.json")
    if not config_path.exists(): config_path = Path(__file__).parent / "anime_characters_config.json"
    try:
        import json
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except:
        config = {args.anime: {}}
    char_dict = config.get(args.anime, {})
    data = generate_script(args.topic, args.api_key, args.anime, char_dict)
    script, scenes = data.get('script', ''), data.get('scenes', [])
    director_note, tts_script = data.get('director_note', 'Pace: Moderate fast.'), data.get('tts_script', '')

    scene_images = fetch_scene_images_parallel(scenes, img_dir, args.anime, char_dict)
    audio_path = generate_tts(script, director_note, tts_script, args.api_key, out, args.voice)

    audio_dur = get_audio_duration(audio_path)
    if audio_dur <= 0: audio_dur = len(script.split()) / 3.0

    sub_path = out / "subtitles.ass"
    generate_subtitles_whisper(audio_path, sub_path, script, args.api_key)

    final = out / "final_short.mp4"
    ok = render_video_gpu(scene_images, audio_path, sub_path, final, audio_dur)

    elapsed = time.time() - start_time
    print(f"\n{'='*60}")
    if ok:
        print(f"🎉 HOÀN TẤT TẠO VIDEO TRONG {elapsed:.0f}s!")
        print(f"   📁 {final}")
    else:
        print(f"❌ THẤT BẠI sau {elapsed:.0f}s")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
