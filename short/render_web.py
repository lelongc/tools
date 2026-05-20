import sys
import io
import os
import json
import re
import subprocess
import shutil
import time
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import requests
import pysrt
from playwright.sync_api import sync_playwright
from config import PEXELS_API_KEY, GEMINI_API_KEY
from google import genai
from google.genai import types

PROJECTS_DIR = Path(__file__).parent / "projects"
TEMPLATE_PATH = Path(__file__).parent / "template_v2.html"


def get_ffmpeg_path() -> str:
    local_npm_ffmpeg = Path(__file__).resolve().parent / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
    if local_npm_ffmpeg.exists():
        return str(local_npm_ffmpeg)
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    return "ffmpeg"


def parse_srt(srt_path: str) -> list:
    subs = pysrt.open(srt_path, encoding="utf-8")
    entries = []
    for sub in subs:
        entries.append({
            "index": sub.index,
            "text": sub.text.replace("\n", " ").strip(),
            "start": sub.start.ordinal / 1000.0,
            "end": sub.end.ordinal / 1000.0,
        })
    return entries


def get_audio_duration(audio_path: str) -> float:
    ffmpeg_path = get_ffmpeg_path()
    try:
        result = subprocess.run(
            [ffmpeg_path, "-i", audio_path],
            capture_output=True, text=True, errors="ignore"
        )
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", result.stderr)
        if match:
            hours = int(match.group(1))
            minutes = int(match.group(2))
            seconds = float(match.group(3))
            return hours * 3600 + minutes * 60 + seconds
    except Exception as e:
        print(f"⚠️ Không đọc được duration audio: {e}")
    return 0.0


def build_visual_timeline(word_timestamps: list, keywords: list, project_dir: Path, total_duration: float) -> list:
    # 1. Map keywords to their downloaded image paths
    keyword_images = {}
    images_dir = project_dir / "images"
    for kw in keywords:
        slug = re.sub(r"[^a-z0-9]+", "_", kw["keyword"].lower()).strip("_")
        img_path = images_dir / f"{slug}.jpg"
        if img_path.exists():
            keyword_images[kw["keyword"].lower()] = f"file:///{str(img_path.resolve()).replace(chr(92), '/')}"

    # 2. Build raw timeline events from words
    timeline = []
    
    stop_words = {
        "are", "you", "using", "the", "word", "is", "very", "it", "can", "mean", 
        "or", "something", "also", "use", "to", "describe", "a", "in", "its", 
        "it's", "common", "way", "express", "how", "by", "different", "and", 
        "better", "of", "now", "ready", "take", "your", "for", "more", "with", 
        "this", "that", "them", "their", "they", "from", "here", "there", "then"
    }

    if not word_timestamps:
        print("   ⚠️ Không có word timestamps. Sử dụng fallback timeline...")
        return []

    for w in word_timestamps:
        word_text = w["word"].strip().replace(".", "").replace(",", "").replace("?", "").replace("!", "")
        word_lower = word_text.lower()
        
        # Check if this word is a keyword or is part of a keyword
        matched_image_path = None
        for kw_name, img_url in keyword_images.items():
            if word_lower == kw_name or word_lower in kw_name.split():
                matched_image_path = img_url
                break
        
        if matched_image_path:
            timeline.append({
                "type": "image",
                "path": matched_image_path,
                "start": w["start"],
                "end": w["end"],
                "keyword": word_text
            })
        elif len(word_lower) > 3 and word_lower not in stop_words:
            timeline.append({
                "type": "text_pop",
                "text": word_text.upper(),
                "start": w["start"],
                "end": w["end"]
            })

    if not timeline:
        timeline.append({
            "type": "text_pop",
            "text": project_dir.name.replace("_", " ").upper(),
            "start": 0.0,
            "end": total_duration
        })

    # Sort timeline by start time
    timeline.sort(key=lambda x: x["start"])
    
    # Merge consecutive events of the same type and text/path if they are very close
    merged = []
    for ev in timeline:
        if not merged:
            merged.append(ev)
            continue
            
        prev = merged[-1]
        if (ev["start"] - prev["end"] < 0.2 and 
            ev["type"] == prev["type"] and 
            ev.get("path") == prev.get("path") and 
            ev.get("text") == prev.get("text")):
            prev["end"] = ev["end"]
        else:
            merged.append(ev)
            
    timeline = merged

    # Fill gaps and align start/ends sequentially
    resolved = []
    for i in range(len(timeline)):
        current = timeline[i]
        if i + 1 < len(timeline):
            next_ev = timeline[i + 1]
            current["end"] = next_ev["start"]
        resolved.append(current)

    if resolved:
        resolved[0]["start"] = 0.0
        resolved[-1]["end"] = total_duration

    return resolved


def download_pexels_image(query: str, save_path: str) -> bool:
    url = "https://api.pexels.com/v1/search"
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "orientation": "portrait", "per_page": 5, "size": "large"}

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        if resp.status_code != 200:
            return False
        photos = resp.json().get("photos", [])
        if not photos:
            return False
        photo = photos[0]
        img_url = photo["src"].get("portrait") or photo["src"].get("large2x") or photo["src"]["original"]
        img_resp = requests.get(img_url, timeout=30)
        if img_resp.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(img_resp.content)
            return True
    except Exception:
        pass
    return False


def download_images_for_keywords(keywords: list, project_dir: Path):
    images_dir = project_dir / "images"
    images_dir.mkdir(exist_ok=True)

    for kw in keywords:
        slug = re.sub(r"[^a-z0-9]+", "_", kw["keyword"].lower()).strip("_")
        img_path = images_dir / f"{slug}.jpg"

        if img_path.exists():
            print(f"   ✅ Đã có ảnh: {slug}.jpg")
            continue
            
        print(f"   📸 Tải ảnh: \"{kw['search_query']}\"...")
        if not download_pexels_image(kw["search_query"], str(img_path)):
            if not download_pexels_image(kw["keyword"], str(img_path)):
                print(f"   ⚠️ Lỗi tải ảnh: {slug}.jpg")


def get_word_timestamps(audio_path: Path, project_dir: Path) -> list:
    json_path = project_dir / "word_timestamps.json"
    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"   ⚠️ Không đọc được word_timestamps.json: {e}. Sẽ tạo lại...")

    if not GEMINI_API_KEY:
        print("   ⚠️ Thiếu gemini_api trong .env. Sử dụng thuật toán phỏng đoán ký tự làm fallback.")
        return []

    print("🎙️ Đang dùng Gemini API tự động phân tích âm thanh (word-level alignment)...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("   Upload file lên Gemini...")
        uploaded_file = client.files.upload(file=str(audio_path))
        
        while uploaded_file.state.name == "PROCESSING":
            time.sleep(2)
            uploaded_file = client.files.get(name=uploaded_file.name)

        if uploaded_file.state.name == "FAILED":
            print("   ❌ Lỗi xử lý file trên Gemini server.")
            return []

        prompt = (
            "Analyze the spoken audio. Transcribe the audio word-by-word with high precision. "
            "For every single word spoken, provide its start timestamp (when the word begins, in seconds) "
            "and end timestamp (when the word ends, in seconds). "
            "Ensure the timestamps are highly accurate and aligned with the actual audio playback. "
            "Output ONLY a valid JSON list of word objects, like this:\n"
            "[\n"
            "  {\"word\": \"Are\", \"start\": 0.0, \"end\": 0.25},\n"
            "  {\"word\": \"you\", \"start\": 0.25, \"end\": 0.45}\n"
            "]\n"
            "Do not include markdown code block formatting (like ```json ... ```), just return the raw JSON text."
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[uploaded_file, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        data = json.loads(response.text)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print("   ✅ Đã tạo xong word_timestamps.json")
        client.files.delete(name=uploaded_file.name)
        return data
    except Exception as e:
        print(f"   ⚠️ Lỗi gọi Gemini API: {e}. Fallback sang phỏng đoán.")
        return []


def align_words_to_subtitles(subtitles: list, word_timestamps: list) -> list:
    if not word_timestamps:
        return subtitles
    for sub in subtitles:
        sub_words = []
        for w in word_timestamps:
            # Check if the word starts within the subtitle duration (with buffer)
            if sub["start"] - 0.1 <= w["start"] < sub["end"]:
                sub_words.append(w)
        sub["words"] = sub_words
    return subtitles


def render_frames_with_playwright(project_dir: Path, segments: list, subtitles: list, keywords_set: set, audio_duration: float, fps: int = 30):
    frames_dir = project_dir / "frames"
    if frames_dir.exists():
        shutil.rmtree(str(frames_dir), ignore_errors=True)
    frames_dir.mkdir(exist_ok=True)

    formatted_subs = []
    for sub in subtitles:
        hl_word = None
        for kw in keywords_set:
            if re.search(r"\b" + re.escape(kw) + r"\b", sub["text"], re.IGNORECASE):
                hl_word = kw
                break
        formatted_subs.append({
            "start": sub["start"],
            "end": sub["end"],
            "text": sub["text"],
            "highlighted": hl_word,
            "words": sub.get("words", [])
        })

    video_data = {
        "title": project_dir.name.replace("_", " ").title(),
        "segments": segments,
        "subtitles": formatted_subs
    }

    print(f"\n🚀 [4/6] Đang chạy Playwright để Capture Frame-by-Frame ({fps} fps)...")
    total_frames = int(audio_duration * fps) + 1

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1080, "height": 1920})
        
        page.add_init_script(f"window.videoData = {json.dumps(video_data)};")
        
        html_uri = f"file:///{str(TEMPLATE_PATH.resolve()).replace(chr(92), '/')}"
        page.goto(html_uri)
        
        page.wait_for_function("window.isReady === true")
        
        print(f"   Đã load xong template. Bắt đầu render {total_frames} frames.")
        start_time = time.time()

        for frame_idx in range(total_frames):
            t_seconds = frame_idx / fps
            page.evaluate(f"window.renderFrame({t_seconds})")
            
            frame_path = frames_dir / f"frame_{frame_idx:05d}.png"
            page.screenshot(path=str(frame_path), type="png")
            
            if frame_idx % 30 == 0 and frame_idx > 0:
                elapsed = time.time() - start_time
                fps_speed = frame_idx / elapsed
                print(f"   📸 Rendered {frame_idx}/{total_frames} frames ({fps_speed:.1f} fps)...")

        browser.close()
    
    print(f"   ✅ Đã chụp xong {total_frames} frames.")
    return frames_dir


def encode_video_ffmpeg(frames_dir: Path, audio_path: Path, output_path: Path, fps: int = 30):
    ffmpeg_path = get_ffmpeg_path()
    
    print(f"\n🎬 [5/6] Đang dùng FFmpeg ghép Frames + Audio...")
    
    cmd = [
        ffmpeg_path, "-y",
        "-framerate", str(fps),
        "-i", f"{frames_dir}/frame_%05d.png",
        "-i", str(audio_path),
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest", "-movflags", "+faststart",
        str(output_path)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
    if result.returncode != 0:
        print(f"❌ FFmpeg error: {result.stderr[-500:]}")
        sys.exit(1)
        
    print(f"   ✅ Render thành công: {output_path}")
    print("   🧹 Đang dọn dẹp file rác...")
    shutil.rmtree(str(frames_dir), ignore_errors=True)


def main():
    if len(sys.argv) < 2:
        print("Usage: python render_web.py <project_name>")
        sys.exit(1)

    project_name = sys.argv[1]
    project_dir = PROJECTS_DIR / project_name

    audio_path = project_dir / "audio.mp3"
    srt_path = project_dir / "subtitles.srt"
    if not srt_path.exists() and (project_dir / "subtitle.srt").exists():
        srt_path = project_dir / "subtitle.srt"
    keywords_path = project_dir / "keywords.json"

    if not audio_path.exists() or not srt_path.exists() or not keywords_path.exists():
        print(f"❌ Thiếu file trong {project_dir}")
        sys.exit(1)

    print(f"{'='*60}")
    print(f"🎬 RENDER WEB FRAME-BY-FRAME: {project_name}")
    print(f"{'='*60}")

    print(f"\n📖 [1/6] Parsing SRT...")
    subtitles = parse_srt(str(srt_path))
    audio_duration = get_audio_duration(str(audio_path))
    if audio_duration <= 0:
        audio_duration = subtitles[-1]["end"] if subtitles else 45.0
    print(f"   Audio duration: {audio_duration:.1f}s")

    print(f"\n🎙️ [1.5/6] Aligning word-level timestamps...")
    word_timestamps = get_word_timestamps(audio_path, project_dir)
    subtitles = align_words_to_subtitles(subtitles, word_timestamps)

    print(f"\n🔗 [2/6] Loading keywords & Downloading images...")
    with open(keywords_path, "r", encoding="utf-8") as f:
        kw_data = json.load(f)
    keywords = kw_data.get("visual_keywords", [])
    keywords_set = {kw["keyword"].lower() for kw in keywords}

    download_images_for_keywords(keywords, project_dir)

    print(f"\n🎞️ [3/6] Building visual timeline (images + text pops)...")
    segments = build_visual_timeline(word_timestamps, keywords, project_dir, audio_duration)

    frames_dir = render_frames_with_playwright(project_dir, segments, subtitles, keywords_set, audio_duration, fps=30)
    
    output_path = project_dir / "output_web.mp4"
    encode_video_ffmpeg(frames_dir, audio_path, output_path, fps=30)
    
    print(f"\n{'='*60}")
    print(f"🎉 HOÀN TẤT!")
    print(f"   📁 Project: {project_dir}")
    print(f"   🎥 Video:   {output_path}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
