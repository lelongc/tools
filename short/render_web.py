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
from config import PEXELS_API_KEY

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


def match_keywords_to_timestamps(subtitles: list, keywords: list, total_duration: float) -> list:
    segments = []
    for kw in keywords:
        keyword_lower = kw["keyword"].lower()
        matched = False
        for sub in subtitles:
            text_lower = sub["text"].lower()
            if keyword_lower in text_lower:
                char_index = text_lower.find(keyword_lower)
                total_chars = len(text_lower) if len(text_lower) > 0 else 1
                sub_duration = sub["end"] - sub["start"]
                interpolated_start = sub["start"] + (char_index / total_chars) * sub_duration
                segments.append({
                    "keyword": kw["keyword"],
                    "search_query": kw.get("search_query", kw["keyword"]),
                    "start": round(interpolated_start, 2),
                })
                matched = True
                break

        if not matched:
            words = keyword_lower.split()
            for sub in subtitles:
                text_lower = sub["text"].lower()
                found_word = None
                for w in words:
                    if w in text_lower:
                        found_word = w
                        break
                if found_word:
                    char_index = text_lower.find(found_word)
                    total_chars = len(text_lower) if len(text_lower) > 0 else 1
                    sub_duration = sub["end"] - sub["start"]
                    interpolated_start = sub["start"] + (char_index / total_chars) * sub_duration
                    segments.append({
                        "keyword": kw["keyword"],
                        "search_query": kw.get("search_query", kw["keyword"]),
                        "start": round(interpolated_start, 2),
                    })
                    matched = True
                    break

    if not segments:
        print("❌ Không match được keyword nào!")
        sys.exit(1)

    segments.sort(key=lambda x: x["start"])
    segments[0]["start"] = 0.0

    unique = [segments[0]]
    for seg in segments[1:]:
        if seg["start"] > unique[-1]["start"]:
            unique.append(seg)
        elif seg["start"] == unique[-1]["start"]:
            seg["start"] = round(seg["start"] + 0.3, 2)
            unique.append(seg)
            
    segments = unique
    segments.sort(key=lambda x: x["start"])

    for i in range(len(segments)):
        if i + 1 < len(segments):
            segments[i]["end"] = segments[i + 1]["start"]
        else:
            segments[i]["end"] = total_duration

    return segments


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


def download_images_for_segments(segments: list, project_dir: Path):
    images_dir = project_dir / "images"
    images_dir.mkdir(exist_ok=True)

    for i, seg in enumerate(segments):
        slug = re.sub(r"[^a-z0-9]+", "_", seg["keyword"].lower()).strip("_")
        img_path = images_dir / f"{slug}.jpg"
        
        seg["path"] = f"file:///{str(img_path.resolve()).replace(chr(92), '/')}"

        if img_path.exists():
            print(f"   ✅ Đã có ảnh: {slug}.jpg")
            continue
            
        print(f"   📸 Tải ảnh: \"{seg['search_query']}\"...")
        if not download_pexels_image(seg["search_query"], str(img_path)):
            if not download_pexels_image(seg["keyword"], str(img_path)):
                print(f"   ⚠️ Lỗi tải ảnh: {slug}.jpg")


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
            "highlighted": hl_word
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

    print(f"\n🔗 [2/6] Matching keywords...")
    with open(keywords_path, "r", encoding="utf-8") as f:
        kw_data = json.load(f)
    keywords = kw_data.get("visual_keywords", [])
    
    keywords_set = {kw["keyword"].lower() for kw in keywords}
    segments = match_keywords_to_timestamps(subtitles, keywords, audio_duration)

    print(f"\n📥 [3/6] Tải Ảnh Stock...")
    download_images_for_segments(segments, project_dir)

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
