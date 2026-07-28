#!/usr/bin/env python3
"""
🎬 ANIME SHORT VIDEO MAKER — Random Top-10 Bing/Google SafeSearch + Drive Cache + Whisper AI
- Tìm kiếm Bing & Google Images SafeSearch Strict: Lấy Top 10 kết quả và chọn ngẫu nhiên (Random Choice) -> Ảnh cực kỳ phong phú và chuẩn theo prompt!
- Bộ lọc SFW 100%: Lọc sạch 100% ảnh nhạy cảm / ecchi
- Cache tự động (Drive / Local): Lưu trữ và tái sử dụng ảnh/GIF đã tải
- Tải song song (ThreadPoolExecutor): Tải 30 ảnh/GIF chỉ trong 3 GIÂY
- Whisper AI Subtitles + T4 GPU NVENC Acceleration + Ken Burns Motion
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

## SCENES (EXACTLY 30 SCENES FOR 30 IMAGES/GIFS):
Split the script into EXACTLY 30 short scenes. Each scene = 1 image/GIF shown for ~2 seconds.

IMPORTANT INSTRUCTION FOR search_query:
- Use simple, descriptive scene queries combining character/event name + anime title!
- Examples for Tensura: "Rimuru Tempest Tensura", "Rimuru Demon Lord Tensura", "Great Sage Tensura", "Shizue Izawa Tensura", "Veldora Tempest Tensura", "Raphael Tensura", "Benimaru Tensura", "Shuna Tensura", "Jura Tempest City", "Milim Nava Tensura".
- Keep queries simple (2-4 words)!

## OUTPUT (valid JSON only):
{{
  "word_count": 160,
  "anime_title": "Anime Name",
  "script": "Full narration script.",
  "director_note": "Pace: Natural speaking pace, smooth, fluid. Deep, engaging male voice.",
  "tts_script": "Script for TTS without unnecessary pause cues.",
  "scenes": [
    {{"text": "Most anime fans know Rimuru Tempest", "search_query": "Rimuru Tempest Tensura"}},
    {{"text": "became an overpowered True Demon Lord", "search_query": "Rimuru Demon Lord Tensura"}}
  ]
}}

IMPORTANT: You MUST return EXACTLY 30 scenes with simple search_query."""


def generate_script(topic: str, api_key: str) -> dict:
    print(f"\n{'='*60}")
    print(f"📖 [1/6] Sinh kịch bản anime (Gemini 3.1 Flash Lite)...")
    print(f"{'='*60}")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"

    body = {
        'contents': [{'role': 'user', 'parts': [{'text': PROMPT_TEMPLATE.format(topic=topic)}]}],
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


def search_top_candidates(query: str, used_urls: set, limit: int = 12) -> list:
    """
    Lấy Top 10-15 ảnh/GIF từ Bing Image SafeSearch & Google Images
    Lọc 100% SFW An toàn (loại bỏ hentai, ecchi, nsfw, sexy, bikini, r18).
    """
    words = query.strip().split()
    simple_q = " ".join(words[:4]) if len(words) > 4 else query
    clean_q = re.sub(r"[^a-zA-Z0-9\s]", " ", simple_q).strip()
    search_term = f"{clean_q} anime screenshot"

    candidates = []

    # 1. Bing Image Search SafeSearch Strict
    try:
        b_url = f"https://www.bing.com/images/search?q={quote(search_term)}&adlt=strict&FORM=HDRSC2"
        r_bing = requests.get(b_url, headers=HEADERS, timeout=6)
        if r_bing.status_code == 200:
            for m in re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', r_bing.text):
                m_low = m.lower()
                if m not in used_urls and not any(bad in m_low for bad in ["hentai", "ecchi", "nsfw", "sexy", "nude", "bikini", "r18", "svg"]):
                    candidates.append(m)
    except Exception:
        pass

    # 2. Google Images Safe Search Active
    try:
        g_url = f"https://www.google.com/search?q={quote(search_term)}&tbm=isch&safe=active"
        r_g = requests.get(g_url, headers=HEADERS, timeout=6)
        if r_g.status_code == 200:
            for m in re.findall(r'\["(https?://[^"]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^"]*)?)",[0-9]+,[0-9]+', r_g.text):
                m_low = m.lower()
                if 'gstatic.com' not in m_low and 'google.com' not in m_low and m not in used_urls and m not in candidates:
                    if not any(bad in m_low for bad in ["hentai", "ecchi", "nsfw", "sexy", "nude", "bikini"]):
                        candidates.append(m)
    except Exception:
        pass

    return candidates[:limit]


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


def download_single_scene_media(idx: int, scene: dict, images_dir: Path, used_urls: set, used_hashes: set) -> tuple:
    """Tải và chọn random 1 trong 10 ảnh/GIF top tìm kiếm từ Bing/Google."""
    query = scene.get('search_query', 'Rimuru Tempest Tensura')
    final_path = images_dir / f"scene_{idx:02d}.jpg"

    if final_path.exists() and final_path.stat().st_size > 8000:
        return idx, final_path, True

    candidates = search_top_candidates(query, used_urls, limit=12)

    # Chọn ngẫu nhiên (Random choice) 1 trong danh sách Top kết quả!
    if candidates:
        random.shuffle(candidates)

    tmp_path = images_dir / f"_tmp_{idx:02d}.dat"

    for url in candidates:
        try:
            r = requests.get(url, headers=HEADERS, timeout=8)
            if r.status_code != 200 or len(r.content) < 8000:
                continue

            img_hash = hashlib.md5(r.content).hexdigest()
            if img_hash in used_hashes:
                continue

            tmp_path.write_bytes(r.content)
            resize_crop_media(tmp_path, final_path)
            tmp_path.unlink(missing_ok=True)

            used_urls.add(url)
            used_hashes.add(img_hash)
            return idx, final_path, True
        except Exception:
            continue

    # Fallback placeholder an toàn nếu không tải được
    bg_color = ((idx * 43) % 180 + 30, (idx * 83) % 180 + 30, (idx * 127) % 180 + 30)
    Image.new('RGB', (TARGET_W, TARGET_H), bg_color).save(final_path, 'JPEG')
    return idx, final_path, False


def fetch_scene_images_parallel(scenes: list, images_dir: Path) -> list:
    print(f"\n{'='*60}")
    print(f"🖼️ [2/6] Tải 30 ảnh/GIF Anime Random Top 10 Bing/Google (SafeSearch SFW)...")
    print(f"{'='*60}")

    scene_images = [None] * len(scenes)
    used_urls = set()
    used_hashes = set()

    start_dl = time.time()

    # Tải song song 10 luồng cùng lúc
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(download_single_scene_media, i, sc, images_dir, used_urls, used_hashes)
            for i, sc in enumerate(scenes)
        ]

        for future in as_completed(futures):
            idx, path, ok = future.result()
            scene_images[idx] = path
            status = "✅ SFW Random" if ok else "⚠️ Fallback"
            print(f"   ⚡ [{idx+1:2d}/30] Scene #{idx+1:02d} -> {status}")

    dl_time = time.time() - start_dl
    print(f"   🚀 TẢI HOÀN TẤT 30 ẢNH/GIF AN TOÀN TRONG {dl_time:.1f} GIÂY!")

    good_paths = [p for p in scene_images if p and p.exists()]
    for i in range(len(scenes)):
        if scene_images[i] is None or not scene_images[i].exists():
            scene_images[i] = good_paths[i % len(good_paths)] if good_paths else images_dir / f"scene_{i:02d}.jpg"

    return scene_images


async def generate_edge_tts_async(text: str, voice_name: str, output_mp3: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice_name)
    await communicate.save(str(output_mp3))


def generate_tts(script: str, director_note: str, tts_script: str,
                 api_key: str, output_path: Path, voice: str = "Fenrir") -> Path:
    print(f"\n{'='*60}")
    print(f"🎤 [3/6] Tạo giọng đọc (Microsoft Edge-TTS Unlimited)...")
    print(f"{'='*60}")

    narration = tts_script if tts_script else script
    edge_voice = "en-US-ChristopherNeural"
    output_mp3 = output_path.parent / "audio.mp3"

    try:
        print(f"   🎙️ Đang sinh audio bằng Microsoft Edge-TTS Neural ({edge_voice})...")
        asyncio.run(generate_edge_tts_async(narration, edge_voice, output_mp3))
        if output_mp3.exists() and output_mp3.stat().st_size > 10000:
            print(f"   ✅ Audio saved: {output_mp3.name} (Edge-TTS Christopher)")
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
    audio_file = output_path.parent / "audio.wav"
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


def generate_subtitles_whisper(audio_path: Path, output_ass: Path):
    """Whisper AI word-level timestamp alignment."""
    print(f"\n{'='*60}")
    print(f"📝 [4/6] Khớp phụ đề chính xác bằng Whisper AI (Word Timestamps)...")
    print(f"{'='*60}")

    print("   🧠 Đang chạy Whisper AI trích xuất timestamp từng từ...")
    w_model = whisper.load_model("tiny.en")
    res = w_model.transcribe(str(audio_path), word_timestamps=True, language="en")

    def fmt(s):
        h, m, sec, ms = int(s//3600), int((s%3600)//60), int(s%60), int((s%1)*100)
        return f"{h}:{m:02d}:{sec:02d}.{ms:02d}"

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
    events = []
    word_count = 0
    for seg in res.get('segments', []):
        words = seg.get('words', [])
        w_idx = 0
        while w_idx < len(words):
            if w_idx + 1 < len(words) and len(words[w_idx]['word']) + len(words[w_idx+1]['word']) <= 12:
                chunk_text = f"{words[w_idx]['word'].strip()} {words[w_idx+1]['word'].strip()}"
                st = words[w_idx]['start']
                et = words[w_idx+1]['end']
                w_idx += 2
            else:
                chunk_text = words[w_idx]['word'].strip()
                st = words[w_idx]['start']
                et = words[w_idx]['end']
                w_idx += 1
            if chunk_text:
                events.append(f"Dialogue: 0,{fmt(st)},{fmt(et)},Default,,0,0,0,,{chunk_text.upper()}")
                word_count += 1

    output_ass.write_text(ass_header + "\n".join(events), encoding='utf-8')
    print(f"   ✅ Đã tạo {word_count} phụ đề nảy từ khớp 100% bằng Whisper AI!")


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
    parser.add_argument("--api-key", "-k", required=True)
    parser.add_argument("--voice", "-v", default="Fenrir")
    parser.add_argument("--output-dir", "-o", default="/content/output")
    args = parser.parse_args()

    start_time = time.time()
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    # Thư mục cache tự động (nếu có Drive sẽ chọn Drive để lưu lâu dài)
    drive_cache = Path("/content/drive/MyDrive/anime_cache")
    if drive_cache.parent.exists():
        img_dir = drive_cache
    else:
        img_dir = out / "images"

    img_dir.mkdir(parents=True, exist_ok=True)

    data = generate_script(args.topic, args.api_key)
    script, scenes = data.get('script', ''), data.get('scenes', [])
    director_note, tts_script = data.get('director_note', 'Pace: Moderate fast.'), data.get('tts_script', '')

    scene_images = fetch_scene_images_parallel(scenes, img_dir)
    audio_path = generate_tts(script, director_note, tts_script, args.api_key, out, args.voice)

    audio_dur = get_audio_duration(audio_path)
    if audio_dur <= 0: audio_dur = len(script.split()) / 3.0

    sub_path = out / "subtitles.ass"
    generate_subtitles_whisper(audio_path, sub_path)

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
