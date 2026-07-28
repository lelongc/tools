#!/usr/bin/env python3
"""
🎬 ANIME SHORT VIDEO MAKER — T4 GPU & UltraFast CPU Support
- Hỗ trợ T4 GPU (h264_nvenc) & CPU UltraFast (libx264 -preset ultrafast)
- Font chữ: Arial / Liberation Sans Đậm Chuẩn (Fontsize 78, Bold: Yes), Chữ Vàng Căn Giữa Màn Hình
- Tìm ảnh đơn giản: Chỉ tìm theo TÊN NHÂN VẬT & ANIME (Ví dụ: "Rimuru Tempest Tensura")
"""
import argparse
import json
import mimetypes
import os
import re
import struct
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import quote

import requests
from PIL import Image
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

## PUNCTUATION & PACING FOR TTS:
- Flow smoothly from sentence to sentence. Keep pauses brief and natural.

## DIRECTOR'S NOTE:
- Pace: Natural speaking pace, smooth, articulate, fluid. Moderate fast pace.
- Tone: Deep, authoritative, dramatic, mysterious, engaging.

## SCENES (EXACTLY 30 SCENES FOR 30 IMAGES):
Split the script into EXACTLY 30 short scenes. Each scene = 1 image shown for ~2 seconds.

CRITICAL INSTRUCTION FOR search_query:
- KEEP SEARCH QUERIES EXTREMELY SIMPLE! Just the character name and anime title!
- Examples: "Rimuru Tempest Tensura", "Veldora Tensura", "Raphael Tensura", "Gojo Satoru Jujutsu Kaisen"
- DO NOT use detailed descriptions like "Rimuru absorbing cosmic energy magic concept".
- Just use the simple Character Name + Anime Title for clean image results!

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

IMPORTANT: You MUST return EXACTLY 30 scenes, covering the ENTIRE script."""


def generate_script(topic: str, api_key: str) -> dict:
    print(f"\n{'='*60}")
    print(f"📖 [1/5] Sinh kịch bản anime (Gemini 3.1 Flash Lite)...")
    print(f"{'='*60}")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"

    body = {
        'contents': [{'role': 'user', 'parts': [{'text': PROMPT_TEMPLATE.format(topic=topic)}]}],
        'systemInstruction': {'parts': [{'text': 'Return valid JSON only. Accurate anime lore. 150-165 words. EXACTLY 30 scenes with SIMPLE character search_query.'}]},
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


def search_anime_images(query: str, num: int = 6) -> list:
    """Tải ảnh đơn giản theo tên nhân vật & Anime qua Google/Bing."""
    words = query.strip().split()
    simple_q = " ".join(words[:4]) if len(words) > 4 else query
    clean_q = re.sub(r"[^a-zA-Z0-9\s]", " ", simple_q).strip()

    search_term = f"{clean_q} anime"
    urls = []

    # 1. Bing Image Search với SafeSearch Strict
    try:
        bing_url = f"https://www.bing.com/images/search?q={quote(search_term)}&adlt=strict&FORM=HDRSC2"
        r_bing = requests.get(bing_url, headers=HEADERS, timeout=7)
        if r_bing.status_code == 200:
            for m in re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', r_bing.text):
                m_low = m.lower()
                if not any(bad in m_low for bad in ["hentai", "ecchi", "nsfw", "sexy", "nude", "bikini", "r18", "icon", "logo", "svg"]):
                    urls.append(m)
                if len(urls) >= num:
                    break
    except Exception:
        pass

    # 2. Google Images Fallback
    if len(urls) < num:
        try:
            g_url = f"https://www.google.com/search?q={quote(search_term)}&tbm=isch&safe=active"
            r_g = requests.get(g_url, headers=HEADERS, timeout=7)
            for m in re.findall(r'\["(https?://[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)",[0-9]+,[0-9]+', r_g.text):
                if 'gstatic.com' not in m and 'google.com' not in m and m not in urls:
                    urls.append(m)
                if len(urls) >= num:
                    break
        except Exception:
            pass

    return urls[:num]


def resize_crop_vertical(img_path: Path, out_path: Path):
    img = Image.open(img_path).convert('RGB')
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


def fetch_scene_images(scenes: list, images_dir: Path) -> list:
    print(f"\n{'='*60}")
    print(f"🖼️ [2/5] Tải 30 ảnh Anime đơn giản theo tên nhân vật...")
    print(f"{'='*60}")

    scene_images = []
    good_images = []

    for i, scene in enumerate(scenes):
        query = scene.get('search_query', 'Rimuru Tempest Tensura')
        final_path = images_dir / f"scene_{i:02d}.jpg"

        if final_path.exists() and final_path.stat().st_size > 8000:
            scene_images.append(final_path)
            good_images.append(final_path)
            continue

        q_disp = query[:30]
        print(f"   🔍 [{i+1:2d}/{len(scenes)}] '{q_disp}...'", end="", flush=True)

        urls = search_anime_images(query, num=5)
        downloaded = False
        tmp_path = images_dir / f"_tmp_{i:02d}.jpg"

        for url in urls:
            try:
                r = requests.get(url, headers=HEADERS, timeout=10)
                if r.status_code != 200 or len(r.content) < 8000:
                    continue
                tmp_path.write_bytes(r.content)
                resize_crop_vertical(tmp_path, final_path)
                tmp_path.unlink(missing_ok=True)
                downloaded = True
                print(" ✅")
                good_images.append(final_path)
                break
            except Exception:
                continue

        if not downloaded:
            if good_images:
                import shutil
                fallback = good_images[i % len(good_images)]
                shutil.copy2(fallback, final_path)
                print(" ⚠️ (dùng lại ảnh anime)")
            else:
                Image.new('RGB', (TARGET_W, TARGET_H), (15, 15, 25)).save(final_path, 'JPEG')
                print(" ⚠️ (placeholder)")

        scene_images.append(final_path)
        tmp_path.unlink(missing_ok=True)

        if i < len(scenes) - 1:
            time.sleep(0.3)

    print(f"   📊 Tải thành công {len(good_images)}/{len(scenes)} ảnh nhân vật anime")
    return scene_images


def convert_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    bits, rate = 16, 24000
    for p in mime_type.split(';'):
        p = p.strip()
        if p.lower().startswith('rate='):
            try: rate = int(p.split('=', 1)[1])
            except: pass
        elif p.startswith('audio/L'):
            try: bits = int(p.split('L', 1)[1])
            except: pass
    bps = bits // 8
    header = struct.pack('<4sI4s4sIHHIIHH4sI', b'RIFF', 36 + len(audio_data), b'WAVE', b'fmt ', 16, 1, 1, rate, rate * bps, bps, bits, b'data', len(audio_data))
    return header + audio_data


def generate_tts(script: str, director_note: str, tts_script: str,
                 api_key: str, output_path: Path, voice: str = "Fenrir") -> Path:
    print(f"\n{'='*60}")
    print(f"🎤 [3/5] Tạo giọng đọc trầm vừa, mượt mà (Gemini TTS - {voice})...")
    print(f"{'='*60}")

    moderate_note = "Pace: Moderate fast, natural storytelling speed, fluid, engaging. Deep tone, zero long pauses."

    narration = tts_script if tts_script else script
    prompt = f"""Read the following transcript based on the director's note.

# Director's note
{moderate_note}

## Transcript:
{narration}"""

    client = genai.Client(api_key=api_key)
    contents = [types.Content(role='user', parts=[types.Part.from_text(text=prompt)])]
    config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=['audio'],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
            )
        ),
    )

    max_tts_retries = 4
    all_audio, final_mime = b'', None

    for attempt in range(max_tts_retries):
        try:
            print(f"   🎙️ Generating audio ({voice} - Thử lần {attempt+1}/{max_tts_retries})...")
            all_audio = b''
            for chunk in client.models.generate_content_stream(
                model='gemini-3.1-flash-tts-preview', contents=contents, config=config
            ):
                if chunk.parts is None: continue
                if chunk.parts[0].inline_data and chunk.parts[0].inline_data.data:
                    all_audio += chunk.parts[0].inline_data.data
                    if final_mime is None: final_mime = chunk.parts[0].inline_data.mime_type
            if all_audio:
                break
        except Exception as e:
            print(f"   ⚠️ Lỗi TTS API: {e}")
            if attempt < max_tts_retries - 1:
                time.sleep(5 * (attempt + 1))
            else:
                raise

    if not all_audio:
        raise RuntimeError("❌ Audio empty!")

    ext = mimetypes.guess_extension(final_mime) if final_mime else None
    if ext is None:
        ext = '.wav'
        all_audio = convert_to_wav(all_audio, final_mime or 'audio/L16;rate=24000')

    audio_file = output_path.parent / f"audio{ext}"
    audio_file.write_bytes(all_audio)
    print(f"   ✅ Audio saved: {audio_file.name} (Giọng {voice})")
    return audio_file


def get_audio_duration(audio_path: Path) -> float:
    try:
        r = subprocess.run(['ffmpeg', '-i', str(audio_path)], capture_output=True, text=True, errors='ignore')
        m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', r.stderr)
        if m:
            return int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
    except: pass
    return 0.0


def generate_subtitles(scenes: list, audio_dur: float, output_path: Path):
    """
    Tạo phụ đề CHUẨN ĐẸP ARIAL / DEJAVU SANS TO ĐẬM:
    - Font: Arial / DejaVu Sans béo đậm (Fontsize: 78, Bold: Yes)
    - Màu sắc: CHỮ VÀNG RỰC RỠ (&H0000FFFF&), viền đen đậm 7px
    - CĂN GIỮA MÀN HÌNH CHÍNH XÁC (Alignment 5)
    - Tách nhỏ 1-2 từ/lần hiện ở giữa màn hình
    """
    print(f"\n{'='*60}")
    print(f"📝 [4/5] Tạo phụ đề Arial To Đậm CHỮ VÀNG Căn Giữa (.ass)...")
    print(f"{'='*60}")

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
    n_scenes = len(scenes)
    dur_per_scene = audio_dur / n_scenes if n_scenes else 2.0

    events = []
    scene_start = 0.0

    for i, sc in enumerate(scenes):
        scene_end = audio_dur if i == n_scenes - 1 else scene_start + dur_per_scene
        scene_dur = scene_end - scene_start
        words = sc['text'].strip().split()
        if not words:
            scene_start = scene_end
            continue

        chunks = []
        w_idx = 0
        while w_idx < len(words):
            if w_idx + 1 < len(words) and len(words[w_idx]) + len(words[w_idx+1]) <= 12:
                chunks.append(f"{words[w_idx]} {words[w_idx+1]}")
                w_idx += 2
            else:
                chunks.append(words[w_idx])
                w_idx += 1

        chunk_dur = scene_dur / len(chunks)
        c_start = scene_start

        for c_idx, chunk in enumerate(chunks):
            c_end = scene_end if c_idx == len(chunks) - 1 else c_start + chunk_dur
            events.append(f"Dialogue: 0,{fmt(c_start)},{fmt(c_end)},Default,,0,0,0,,{chunk.upper()}")
            c_start = c_end

        scene_start = scene_end

    output_path.write_text(ass_header + "\n".join(events), encoding='utf-8')
    print(f"   ✅ Phụ đề DejaVu Sans / Arial To Đậm CHỮ VÀNG Căn Giữa màn hình")

    scene_timings = []
    st = 0.0
    for i in range(n_scenes):
        se = audio_dur if i == n_scenes - 1 else st + dur_per_scene
        scene_timings.append((st, se))
        st = se
    return scene_timings


def render_video(scene_images: list, timings: list, audio_path: Path, sub_path: Path, output_path: Path):
    print(f"\n{'='*60}")
    print(f"🎬 [5/5] Render video...")
    print(f"{'='*60}")

    project_dir = output_path.parent
    clips = []

    # Fast CPU libx264 ultrafast rendering
    for i, (img, t) in enumerate(zip(scene_images, timings)):
        dur = t[1] - t[0]
        if dur <= 0: dur = 2.0
        df = max(int(dur * FPS), 1)
        clip = project_dir / f"_clip_{i:03d}.mp4"
        clips.append(clip)

        zf = f"zoompan=z='min(zoom+0.0004,1.08)':x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2':d={df}:s={TARGET_W}x{TARGET_H}:fps={FPS}"

        cmd = ['ffmpeg', '-y', '-loop', '1', '-i', str(img), '-vf', zf,
               '-c:v', 'libx264', '-preset', 'ultrafast', '-t', f'{dur:.3f}',
               '-pix_fmt', 'yuv420p', '-r', str(FPS), str(clip)]

        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"\r   📹 Clip {i+1}/{len(scene_images)}", end="", flush=True)

    print(" ✅")
    concat_file = project_dir / "_concat.txt"
    concat_file.write_text("\n".join(f"file '{c.name}'" for c in clips))

    merged = project_dir / "_merged.mp4"
    subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
        '-c', 'copy', str(merged)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Merge audio + video + subtitles
    merge_cmd = ['ffmpeg', '-y', '-i', str(merged), '-i', str(audio_path),
                 '-vf', f"subtitles={sub_path.name}", '-c:v', 'libx264', '-preset', 'ultrafast',
                 '-c:a', 'aac', '-b:a', '192k', '-shortest', str(output_path)]

    res = subprocess.run(merge_cmd, cwd=str(project_dir), capture_output=True, text=True, errors='ignore')

    for c in clips: c.unlink(missing_ok=True)
    concat_file.unlink(missing_ok=True); merged.unlink(missing_ok=True)

    if output_path.exists():
        mb = output_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Final video: {output_path.name} ({mb:.1f} MB)")
        return True
    else:
        print("   ❌ Final merge failed! Log:")
        print(res.stderr[:500])
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
    img_dir = out / "images"
    img_dir.mkdir(exist_ok=True)

    data = generate_script(args.topic, args.api_key)
    script, scenes = data.get('script', ''), data.get('scenes', [])
    director_note, tts_script = data.get('director_note', 'Pace: Moderate fast.'), data.get('tts_script', '')

    scene_images = fetch_scene_images(scenes, img_dir)
    audio_path = generate_tts(script, director_note, tts_script, args.api_key, out, args.voice)

    audio_dur = get_audio_duration(audio_path)
    if audio_dur <= 0: audio_dur = len(script.split()) / 3.0

    sub_path = out / "subtitles.ass"
    timings = generate_subtitles(scenes, audio_dur, sub_path)

    final = out / "final_short.mp4"
    ok = render_video(scene_images, timings, audio_path, sub_path, final)

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
