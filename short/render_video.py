"""
Phase 2: Parse SRT + Tải ảnh Pexels + Generate HTML Animation + Record + Merge Audio.

Usage:
    python render_video.py <project_name>
    python render_video.py morning_routine
"""

import sys
import io
import os
import json
import re
import subprocess
import shutil
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import requests
import pysrt
from config import PEXELS_API_KEY

PROJECTS_DIR = Path(__file__).parent / "projects"
TEMPLATE_PATH = Path(__file__).parent / "template.html"


# ============================================================
# STEP 1: Parse SRT
# ============================================================
def parse_srt(srt_path: str) -> list:
    """Đọc file SRT, trả về danh sách subtitle entries."""
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


def get_ffmpeg_path() -> str:
    """Tìm path của ffmpeg (ưu tiên local ffmpeg-static, rồi đến hệ thống, playwright)."""
    # 1. Thử local npm ffmpeg-static
    local_npm_ffmpeg = Path(__file__).resolve().parent / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
    if local_npm_ffmpeg.exists():
        return str(local_npm_ffmpeg)

    # 2. Thử system PATH
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    
    # 3. Thử playwright ffmpeg
    local_appdata = os.getenv("LOCALAPPDATA")
    if local_appdata:
        playwright_dir = Path(local_appdata) / "ms-playwright"
        if playwright_dir.exists():
            ffmpeg_files = list(playwright_dir.glob("**/ffmpeg-win64.exe"))
            if ffmpeg_files:
                return str(ffmpeg_files[0])
    
    return "ffmpeg"


def get_audio_duration(audio_path: str) -> float:
    """Lấy duration của file audio bằng ffmpeg -i."""
    ffmpeg_path = get_ffmpeg_path()
    try:
        # Chạy ffmpeg -i để lấy thông tin duration từ stderr
        result = subprocess.run(
            [ffmpeg_path, "-i", audio_path],
            capture_output=True, text=True, errors="ignore"
        )
        # Regex tìm Duration: 00:00:00.00
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", result.stderr)
        if match:
            hours = int(match.group(1))
            minutes = int(match.group(2))
            seconds = float(match.group(3))
            return hours * 3600 + minutes * 60 + seconds
    except Exception as e:
        print(f"⚠️  Không đọc được duration audio: {e}")
    
    print("   Sẽ dùng timestamp cuối cùng trong SRT.")
    return 0.0


# ============================================================
# STEP 2: Match Keywords → Timestamps
# ============================================================
def match_keywords_to_timestamps(subtitles: list, keywords: list, total_duration: float) -> list:
    """
    Với mỗi keyword, tìm subtitle entry chứa keyword đó.
    Trả về danh sách segments (start/end) theo thứ tự thời gian.
    """
    segments = []

    for kw in keywords:
        keyword_lower = kw["keyword"].lower()
        # Tìm subtitle chứa keyword
        matched = False
        for sub in subtitles:
            if keyword_lower in sub["text"].lower():
                segments.append({
                    "keyword": kw["keyword"],
                    "search_query": kw.get("search_query", kw["keyword"]),
                    "start": sub["start"],
                })
                matched = True
                break

        if not matched:
            # Thử match từng từ riêng lẻ trong keyword
            words = keyword_lower.split()
            for sub in subtitles:
                text_lower = sub["text"].lower()
                if any(w in text_lower for w in words):
                    segments.append({
                        "keyword": kw["keyword"],
                        "search_query": kw.get("search_query", kw["keyword"]),
                        "start": sub["start"],
                    })
                    matched = True
                    break

        if not matched:
            print(f"   ⚠️  Keyword '{kw['keyword']}' không tìm thấy trong SRT, bỏ qua.")

    if not segments:
        print("❌ Không match được keyword nào! Kiểm tra lại keywords.json và subtitles.srt.")
        sys.exit(1)

    # Sort theo start time
    segments.sort(key=lambda x: x["start"])

    # Segment đầu bắt đầu từ 0
    segments[0]["start"] = 0.0

    # Loại bỏ duplicate timestamps
    unique = [segments[0]]
    for seg in segments[1:]:
        if seg["start"] > unique[-1]["start"]:
            unique.append(seg)
    segments = unique

    # Tính end time cho mỗi segment
    for i in range(len(segments)):
        if i + 1 < len(segments):
            segments[i]["end"] = segments[i + 1]["start"]
        else:
            segments[i]["end"] = total_duration

    return segments


# ============================================================
# STEP 3: Download Pexels Media (Video preferred, Image fallback)
# ============================================================
def download_pexels_video(query: str, save_path: str) -> bool:
    """Tải 1 video từ Pexels Video API."""
    url = "https://api.pexels.com/videos/search"
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": 3, "size": "small"}

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        if resp.status_code != 200:
            return False

        videos = resp.json().get("videos", [])
        if not videos:
            return False

        # Tìm file HD hoặc SD chất lượng tốt nhất
        video = videos[0]
        best = None
        for vf in video.get("video_files", []):
            q = vf.get("quality", "")
            h = vf.get("height", 0)
            if q in ("hd", "sd") and (best is None or h > best.get("height", 0)):
                best = vf
        if not best and video.get("video_files"):
            best = video["video_files"][0]
        if not best:
            return False

        vid_resp = requests.get(best["link"], timeout=60, stream=True)
        if vid_resp.status_code == 200:
            with open(save_path, "wb") as f:
                for chunk in vid_resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"   ⚠️  Video download error: {e}")
    return False


def download_pexels_image(query: str, save_path: str) -> bool:
    """Tải 1 ảnh portrait từ Pexels API."""
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
    except Exception as e:
        print(f"   ⚠️  Image download error: {e}")
    return False


def download_all_media(segments: list, project_dir: Path):
    """Tải video (ưu tiên) hoặc ảnh cho tất cả segments."""
    videos_dir = project_dir / "videos"
    images_dir = project_dir / "images"
    videos_dir.mkdir(exist_ok=True)
    images_dir.mkdir(exist_ok=True)

    for seg in segments:
        slug = re.sub(r"[^a-z0-9]+", "_", seg["keyword"].lower()).strip("_")
        seg["image_slug"] = slug
        vid_path = videos_dir / f"{slug}.mp4"
        img_path = images_dir / f"{slug}.jpg"

        # Đã có video?
        if vid_path.exists():
            seg["media_type"] = "video"
            seg["has_media"] = True
            print(f"   ✅ Đã có video: {slug}.mp4")
            continue
        # Đã có ảnh?
        if img_path.exists():
            seg["media_type"] = "image"
            seg["has_media"] = True
            print(f"   ✅ Đã có ảnh: {slug}.jpg")
            continue

        # Thử tải video trước
        print(f"   🎬 Tải video: \"{seg['search_query']}\"...")
        if download_pexels_video(seg["search_query"], str(vid_path)):
            seg["media_type"] = "video"
            seg["has_media"] = True
            print(f"   ✅ OK video: {slug}.mp4")
            continue

        # Fallback sang ảnh
        print(f"   📸 Fallback ảnh: \"{seg['search_query']}\"...")
        if download_pexels_image(seg["search_query"], str(img_path)):
            seg["media_type"] = "image"
            seg["has_media"] = True
            print(f"   ✅ OK ảnh: {slug}.jpg")
        elif download_pexels_image(seg["keyword"], str(img_path)):
            seg["media_type"] = "image"
            seg["has_media"] = True
            print(f"   ✅ OK ảnh (fallback): {slug}.jpg")
        else:
            seg["media_type"] = "none"
            seg["has_media"] = False
            print(f"   ⚠️  Không tìm được media, sẽ dùng gradient.")


# ============================================================
# STEP 4: Generate HTML Animation
# ============================================================
def build_subtitle_html(text: str, keywords_set: set) -> str:
    """Tạo HTML cho subtitle, highlight keywords."""
    result = text
    for kw in keywords_set:
        pattern = re.compile(r"(?i)\b(" + re.escape(kw) + r")\b")
        result = pattern.sub(r'<span class="highlight">\1</span>', result)
    return result


def generate_html(segments: list, subtitles: list, total_duration: float, project_dir: Path) -> Path:
    """Render HTML animation từ template."""
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template_content = f.read()

    keywords_set = {seg["keyword"].lower() for seg in segments}

    # Build timeline data
    scenes_data = []
    for i, seg in enumerate(segments):
        slug = seg.get("image_slug", "unknown")
        scenes_data.append({
            "start": round(seg["start"], 3),
            "end": round(seg["end"], 3),
            "image_path": f"images/{slug}.jpg",
            "video_path": f"videos/{slug}.mp4",
            "media_type": seg.get("media_type", "image"),
            "has_media": seg.get("has_media", seg.get("has_image", False)),
            "keyword": seg["keyword"],
        })

    subs_data = []
    for sub in subtitles:
        subs_data.append({
            "start": round(sub["start"], 3),
            "end": round(sub["end"], 3),
            "html": build_subtitle_html(sub["text"], keywords_set),
        })

    timeline = {
        "total_duration": round(total_duration, 3),
        "scenes": scenes_data,
        "subtitles": subs_data,
    }

    # Inject data vào template
    timeline_json = json.dumps(timeline, ensure_ascii=False)
    html_content = template_content.replace("__TIMELINE_DATA__", timeline_json)

    output_path = project_dir / "animation.html"
    output_path.write_text(html_content, encoding="utf-8")

    return output_path


# ============================================================
# STEP 5: Record with Playwright
# ============================================================
def record_with_playwright(html_path: Path, raw_video_path: Path, duration_ms: int):
    """Mở HTML trong Chromium headless, record video 1080x1920."""
    from playwright.sync_api import sync_playwright

    recording_dir = raw_video_path.parent / "_recording_tmp"
    recording_dir.mkdir(exist_ok=True)

    print(f"   Viewport: 1080x1920 | Duration: {duration_ms/1000:.1f}s")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1080, "height": 1920},
            record_video_dir=str(recording_dir),
            record_video_size={"width": 1080, "height": 1920},
        )

        page = context.new_page()

        # Navigate to local HTML file
        file_url = html_path.resolve().as_uri()
        page.goto(file_url)

        # Đợi page load + fonts
        page.wait_for_timeout(500)

        # Animation tự chạy ngay khi page load (auto-start trong template)
        # Đợi animation chạy hết
        page.wait_for_timeout(duration_ms + 1500)

        # Lấy path video trước khi close
        video_path = page.video.path()

        context.close()
        browser.close()

    # Move recorded file
    if video_path and os.path.exists(video_path):
        shutil.move(str(video_path), str(raw_video_path))
        print(f"   ✅ Recorded: {raw_video_path.name}")
    else:
        # Tìm file trong recording dir
        for f in recording_dir.iterdir():
            if f.suffix == ".webm":
                shutil.move(str(f), str(raw_video_path))
                print(f"   ✅ Recorded: {raw_video_path.name}")
                break
        else:
            print("   ❌ Recording failed!")
            sys.exit(1)

    # Cleanup temp dir
    shutil.rmtree(str(recording_dir), ignore_errors=True)


# ============================================================
# STEP 6: Convert SRT → ASS (styled subtitles)
# ============================================================
def srt_to_ass(srt_path: str, ass_path: str, keywords_set: set):
    """Convert SRT sang ASS với style đẹp + highlight keywords."""
    subs = pysrt.open(srt_path, encoding="utf-8")

    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,50,50,340,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    lines = []
    for sub in subs:
        # Format timestamps: H:MM:SS.cs
        start = f"{sub.start.hours}:{sub.start.minutes:02d}:{sub.start.seconds:02d}.{sub.start.milliseconds // 10:02d}"
        end = f"{sub.end.hours}:{sub.end.minutes:02d}:{sub.end.seconds:02d}.{sub.end.milliseconds // 10:02d}"
        text = sub.text.replace("\n", "\\N")

        # Highlight keywords vàng
        for kw in keywords_set:
            pattern = re.compile(r"(?i)\\b(" + re.escape(kw) + r")\\b")
            text = pattern.sub(r"{\\c&H00D7FF&}\1{\\r}", text)

        # Fade in 200ms, fade out 100ms
        text = "{\\fad(200,100)}" + text

        lines.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(lines))
        f.write("\n")

    return ass_path


# ============================================================
# STEP 7: Merge Video + Audio + Subtitles with FFmpeg
# ============================================================
def merge_audio_video(video_path: Path, audio_path: Path, srt_path: Path, output_path: Path):
    """Ghép video + audio + burn subtitle từ SRT bằng FFmpeg."""
    ffmpeg_path = get_ffmpeg_path()

    # Convert SRT → ASS với style
    ass_path = srt_path.parent / "styled.ass"
    keywords_json = srt_path.parent / "keywords.json"
    keywords_set = set()
    if keywords_json.exists():
        with open(keywords_json, "r", encoding="utf-8") as f:
            kw_data = json.load(f)
        keywords_set = {kw["keyword"].lower() for kw in kw_data.get("visual_keywords", [])}

    srt_to_ass(str(srt_path), str(ass_path), keywords_set)
    print(f"   ✅ Created styled.ass")

    # Chạy FFmpeg từ project dir → dùng relative path tránh lỗi Windows escape
    project_dir = srt_path.parent

    cmd = [
        ffmpeg_path, "-y",
        "-i", str(video_path.resolve()),
        "-i", str(audio_path.resolve()),
        "-vf", "ass=styled.ass",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        str(output_path.resolve()),
    ]

    print(f"   Command: ffmpeg -i {video_path.name} -i {audio_path.name} + ass → {output_path.name}")
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(project_dir))

    if result.returncode != 0:
        print(f"   ⚠️  ASS filter failed, trying without subtitles...")
        print(f"   {result.stderr[-300:]}")
        # Fallback: merge without subtitles
        cmd_fallback = [
            ffmpeg_path, "-y",
            "-i", str(video_path),
            "-i", str(audio_path),
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            str(output_path),
        ]
        result = subprocess.run(cmd_fallback, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"   ❌ FFmpeg error:\n{result.stderr[-500:]}")
            sys.exit(1)

    print(f"   ✅ Output: {output_path}")


# ============================================================
# MAIN
# ============================================================
def main():
    if len(sys.argv) < 2:
        print("Usage: python render_video.py <project_name>")
        print("\nCác project hiện có:")
        if PROJECTS_DIR.exists():
            for d in sorted(PROJECTS_DIR.iterdir()):
                if d.is_dir():
                    has_audio = (d / "audio.mp3").exists()
                    has_srt = (d / "subtitles.srt").exists()
                    status = "✅" if (has_audio and has_srt) else "⏳"
                    print(f"   {status} {d.name}")
        sys.exit(1)

    project_name = sys.argv[1]
    project_dir = PROJECTS_DIR / project_name

    # Check required files
    audio_path = project_dir / "audio.mp3"
    srt_path = project_dir / "subtitles.srt"
    keywords_path = project_dir / "keywords.json"

    missing = []
    if not keywords_path.exists():
        missing.append(f"keywords.json (chạy generate_script.py trước)")
    if not audio_path.exists():
        missing.append(f"audio.mp3 (tạo TTS trên Colab)")
    if not srt_path.exists():
        missing.append(f"subtitles.srt (tạo subtitle)")

    if missing:
        print(f"❌ Thiếu file trong {project_dir}:")
        for m in missing:
            print(f"   • {m}")
        sys.exit(1)

    print(f"{'='*60}")
    print(f"🎬 RENDER VIDEO: {project_name}")
    print(f"{'='*60}")

    # ---- Step 1: Parse SRT ----
    print(f"\n📖 [1/6] Parsing SRT...")
    subtitles = parse_srt(str(srt_path))
    print(f"   Tìm thấy {len(subtitles)} subtitle entries.")

    # ---- Get audio duration ----
    audio_duration = get_audio_duration(str(audio_path))
    if audio_duration <= 0:
        audio_duration = subtitles[-1]["end"] if subtitles else 45.0
    print(f"   Audio duration: {audio_duration:.1f}s")

    # ---- Step 2: Load & match keywords ----
    print(f"\n🔗 [2/6] Matching keywords → timestamps...")
    with open(keywords_path, "r", encoding="utf-8") as f:
        kw_data = json.load(f)
    keywords = kw_data.get("visual_keywords", [])
    print(f"   Keywords: {[k['keyword'] for k in keywords]}")

    segments = match_keywords_to_timestamps(subtitles, keywords, audio_duration)
    print(f"   Segments tạo được: {len(segments)}")
    for seg in segments:
        print(f"     [{seg['start']:.1f}s - {seg['end']:.1f}s] {seg['keyword']}")

    # ---- Step 3: Download Pexels media (video preferred) ----
    print(f"\n📥 [3/6] Downloading Pexels media (video + ảnh)...")
    download_all_media(segments, project_dir)

    # ---- Step 4: Generate HTML ----
    print(f"\n🎨 [4/6] Generating HTML animation...")
    html_path = generate_html(segments, subtitles, audio_duration, project_dir)
    print(f"   ✅ {html_path.name}")
    print(f"   👀 Preview: {html_path.resolve().as_uri()}")

    # ---- Step 5: Record with Playwright ----
    print(f"\n🎬 [5/6] Recording animation (chờ {audio_duration:.0f}s real-time)...")
    raw_video = project_dir / "raw_recording.webm"
    record_with_playwright(html_path, raw_video, int(audio_duration * 1000))

    # ---- Step 6: Merge audio + burn subtitles ----
    print(f"\n🔊 [6/6] Merging audio + burning subtitles...")
    output_path = project_dir / "output.mp4"
    merge_audio_video(raw_video, audio_path, srt_path, output_path)

    # Cleanup raw recording
    if raw_video.exists():
        raw_video.unlink()

    print(f"\n{'='*60}")
    print(f"🎉 HOÀN TẤT!")
    print(f"   📁 Project: {project_dir}")
    print(f"   🎥 Video:   {output_path}")
    print(f"   📐 Size:    1080x1920 (YouTube Shorts)")
    print(f"   ⏱️  Duration: {audio_duration:.1f}s")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
