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
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

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


def normalize_token(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", text.lower())


def tokenize_text(text: str) -> list:
    return [t for t in (normalize_token(w) for w in re.split(r"\s+", text)) if t]


def match_keywords_to_words(word_timestamps: list, keywords: list) -> list:
    if not word_timestamps or not keywords:
        return []

    words_norm = [normalize_token(w["word"]) for w in word_timestamps]
    matches = []
    cursor = 0

    for kw in keywords:
        kw_tokens = tokenize_text(kw["keyword"])
        if not kw_tokens:
            continue

        found = False
        for i in range(cursor, len(words_norm)):
            if words_norm[i] != kw_tokens[0]:
                continue
            j = i
            k = 0
            while j < len(words_norm) and k < len(kw_tokens) and words_norm[j] == kw_tokens[k]:
                j += 1
                k += 1
            if k == len(kw_tokens):
                matches.append({
                    "keyword": kw["keyword"],
                    "start_index": i,
                    "end_index": j - 1
                })
                cursor = j
                found = True
                break
        if not found:
            continue

    return matches


def build_visual_timeline(word_timestamps: list, keywords: list, project_dir: Path, subtitles: list, total_duration: float) -> list:
    # 1. Collect all downloaded images in order (same as keyword order)
    images_dir = project_dir / "images"
    image_paths = []
    
    for kw in keywords:
        slug = re.sub(r"[^a-z0-9]+", "_", kw["keyword"].lower()).strip("_")
        img_path = images_dir / f"{slug}.jpg"
        if img_path.exists():
            img_url = f"file:///{str(img_path.resolve()).replace(chr(92), '/')}"
            image_paths.append(img_url)

    if not image_paths:
        print("   ⚠️ Không có ảnh. Sử dụng fallback...")
        return [{
            "type": "text_pop",
            "text": project_dir.name.replace("_", " ").upper(),
            "start": 0.0,
            "end": total_duration
        }]

    # 2. Assign images to subtitles sequentially (cycle through images)
    # Every subtitle gets exactly one image, in order
    timeline = []
    for idx, sub in enumerate(subtitles):
        img_idx = idx % len(image_paths)  # Cycle through images
        timeline.append({
            "type": "image",
            "path": image_paths[img_idx],
            "start": sub["start"],
            "end": sub["end"],
            "slot": 1 if idx % 2 == 0 else 2
        })
    
    # Fill gaps to make the visual timeline contiguous
    if timeline:
        timeline[0]["start"] = 0.0
        for i in range(len(timeline) - 1):
            timeline[i]["end"] = timeline[i+1]["start"]
        timeline[-1]["end"] = total_duration

    return timeline


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

    # Auto-import from TurboFlow download directory if it exists
    turboflow_dir = Path(r"D:\download\win\turboflow")
    if turboflow_dir.exists():
        all_files = [f for f in turboflow_dir.iterdir() if f.is_file() and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
        if all_files:
            print(f"   🎨 Tìm thấy {len(all_files)} ảnh trong thư mục TurboFlow local.")
            
            prompts = [kw['search_query'] for kw in keywords]
            expected_count = len(prompts)
            slug = project_dir.name

            # Strategy 1: Match by token overlap similarity
            def get_words(s):
                words = re.findall(r'[a-z0-9]+', s.lower())
                stop_words = {'a', 'an', 'the', 'in', 'on', 'at', 'of', 'and', 'or', 'for', 'with', 'to', 'by', 'is', 'are', 'was', 'were'}
                filtered = [w for w in words if w not in stop_words]
                return filtered if filtered else words

            prompt_word_sets = [set(get_words(p)) for p in prompts]
            prompt_norms = [re.sub(r'[^a-z0-9]', '', p.lower()) for p in prompts]

            found_by_prompt = {}
            for i, p_words in enumerate(prompt_word_sets):
                p_norm = prompt_norms[i]
                if not p_words:
                    continue
                best_file = None
                best_score = 0.0
                best_mtime = 0.0
                for f in all_files:
                    stem = f.stem
                    s_norm = re.sub(r'[^a-z0-9]', '', stem.lower())
                    
                    if p_norm == s_norm or p_norm in s_norm or s_norm in p_norm:
                        score = 2.0
                    else:
                        s_words = set(get_words(stem))
                        overlap = p_words.intersection(s_words)
                        score = len(overlap) / len(p_words)
                        
                    if score >= 0.35:
                        f_mtime = f.stat().st_mtime
                        if score > best_score:
                            best_score = score
                            best_file = f
                            best_mtime = f_mtime
                        elif abs(score - best_score) < 1e-5:
                            if f_mtime > best_mtime:
                                best_file = f
                                best_mtime = f_mtime
                if best_file:
                    found_by_prompt[i] = best_file

            # Strategy 2: Match by prefix (e.g. project_name-1.jpg, etc.)
            found_by_prefix = []
            prefix_prefix = f"{slug}-"
            prefix_files = [x for x in all_files if x.name.startswith(prefix_prefix)]
            if len(prefix_files) >= expected_count:
                prefix_files.sort(key=lambda x: x.name)
                found_by_prefix = prefix_files[:expected_count]

            # Copy files if matching succeeds (always copy & overwrite to allow updating images)
            if len(found_by_prompt) == expected_count:
                print(f"   ✅ Đã khớp thành công {expected_count}/{expected_count} ảnh theo tên prompt!")
                for i in range(expected_count):
                    src = found_by_prompt[i]
                    kw_slug = re.sub(r'[^a-z0-9]+', '_', keywords[i]['keyword'].lower()).strip('_')
                    dest = images_dir / f"{kw_slug}.jpg"
                    shutil.copy2(src, dest)
                    print(f"   🎨 Import TurboFlow (prompt): {src.name} → {kw_slug}.jpg")
            elif len(found_by_prefix) >= expected_count:
                print(f"   ✅ Đã khớp thành công {expected_count}/{expected_count} ảnh theo prefix!")
                for i in range(expected_count):
                    src = found_by_prefix[i]
                    kw_slug = re.sub(r'[^a-z0-9]+', '_', keywords[i]['keyword'].lower()).strip('_')
                    dest = images_dir / f"{kw_slug}.jpg"
                    shutil.copy2(src, dest)
                    print(f"   🎨 Import TurboFlow (prefix): {src.name} → {kw_slug}.jpg")
            else:
                # Partial match fallback
                print(f"   ⚠️ Chỉ khớp được {len(found_by_prompt)}/{expected_count} ảnh theo tên prompt.")
                for i, src in found_by_prompt.items():
                    kw_slug = re.sub(r'[^a-z0-9]+', '_', keywords[i]['keyword'].lower()).strip('_')
                    dest = images_dir / f"{kw_slug}.jpg"
                    shutil.copy2(src, dest)
                    print(f"   🎨 Import TurboFlow (partial prompt): {src.name} → {kw_slug}.jpg")

    for kw in keywords:
        slug = re.sub(r"[^a-z0-9]+", "_", kw["keyword"].lower()).strip("_")
        img_path = images_dir / f"{slug}.jpg"

        if img_path.exists():
            print(f"   ✅ Đã có ảnh: {slug}.jpg")
            continue
            
        print(f"   📸 Tải ảnh Pexels: \"{kw['search_query']}\"...")
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

    words_norm = [normalize_token(w["word"]) for w in word_timestamps]
    cursor = 0

    for sub in subtitles:
        scan_start = cursor
        tokens = tokenize_text(sub["text"])
        if not tokens:
            sub["words"] = []
            continue

        match_indices = []
        for token in tokens:
            while cursor < len(words_norm) and words_norm[cursor] != token:
                cursor += 1
            if cursor >= len(words_norm):
                break
            match_indices.append(cursor)
            cursor += 1

        match_ratio = len(match_indices) / max(len(tokens), 1)
        # Threshold 0.7 for balanced sync (not too loose, not too strict)
        if match_indices and match_ratio >= 0.7:
            start_idx = match_indices[0]
            end_idx = match_indices[-1]
            sub["start"] = max(0.0, word_timestamps[start_idx]["start"])
            sub["end"] = word_timestamps[end_idx]["end"]
            sub["words"] = word_timestamps[start_idx:end_idx + 1]
            continue

        if match_indices:
            cursor = match_indices[-1] + 1
        else:
            cursor = scan_start

        # Fallback: use subtitle's original time range, assign words within that range
        sub["words"] = [
            w for w in word_timestamps
            if sub["start"] <= w["start"] <= sub["end"]
        ]

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
        
        # Pre-load all image files to avoid stuttering
        unique_image_paths = set()
        for seg in segments:
            if seg.get("type") == "image" and seg.get("path"):
                unique_image_paths.add(seg["path"])
        
        if unique_image_paths:
            print(f"   🖼️ Pre-loading {len(unique_image_paths)} images...")
            preload_script = "; ".join([f"await window.preloadImage('{path}')" for path in unique_image_paths])
            page.evaluate(f"(async () => {{ {preload_script} }})()")
        
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
        "-movflags", "+faststart",
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
    segments = build_visual_timeline(word_timestamps, keywords, project_dir, subtitles, audio_duration)

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
