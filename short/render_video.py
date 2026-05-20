"""
Phase 2: Parse SRT + Tải media Pexels + Pure FFmpeg Pipeline → Output MP4.

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
import random
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import requests
import pysrt
from config import PEXELS_API_KEY

PROJECTS_DIR = Path(__file__).parent / "projects"


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
# STEP 2: Match Keywords → Timestamps (Interpolation)
# ============================================================
def match_keywords_to_timestamps(subtitles: list, keywords: list, total_duration: float) -> list:
    """
    Với mỗi keyword, tìm subtitle entry chứa keyword đó.
    Nội suy thời điểm xuất hiện của keyword trong câu phụ đề dựa trên vị trí ký tự của nó.
    """
    segments = []

    for kw in keywords:
        keyword_lower = kw["keyword"].lower()
        matched = False
        
        # 1. Thử match chính xác cụm keyword trong phụ đề
        for sub in subtitles:
            text_lower = sub["text"].lower()
            if keyword_lower in text_lower:
                # Nội suy start time dựa trên vị trí ký tự của keyword trong câu
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

        # 2. Nếu không match chính xác, thử tìm từng từ lẻ trong keyword
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
        elif seg["start"] == unique[-1]["start"]:
            # Nếu trùng tuyệt đối, dịch chuyển nhẹ 0.3s
            seg["start"] = round(seg["start"] + 0.3, 2)
            unique.append(seg)
            
    segments = unique
    segments.sort(key=lambda x: x["start"])

    # Tính end time cho mỗi segment
    for i in range(len(segments)):
        if i + 1 < len(segments):
            segments[i]["end"] = segments[i + 1]["start"]
        else:
            segments[i]["end"] = total_duration

    return segments


# ============================================================
# STEP 3: Download Pexels Media (Random mix video + ảnh)
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
    """Tải media cho tất cả segments, random xen kẽ video và ảnh."""
    videos_dir = project_dir / "videos"
    images_dir = project_dir / "images"
    videos_dir.mkdir(exist_ok=True)
    images_dir.mkdir(exist_ok=True)

    for i, seg in enumerate(segments):
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

        # Random: 55% video, 45% ảnh → tạo sự đa dạng
        prefer_video = random.random() < 0.55

        if prefer_video:
            print(f"   🎬 Tải video: \"{seg['search_query']}\"...")
            if download_pexels_video(seg["search_query"], str(vid_path)):
                seg["media_type"] = "video"
                seg["has_media"] = True
                print(f"   ✅ OK video: {slug}.mp4")
                continue
            # Fallback sang ảnh
            print(f"   📸 Fallback ảnh...")
            if download_pexels_image(seg["search_query"], str(img_path)):
                seg["media_type"] = "image"
                seg["has_media"] = True
                print(f"   ✅ OK ảnh: {slug}.jpg")
                continue
        else:
            print(f"   📸 Tải ảnh: \"{seg['search_query']}\"...")
            if download_pexels_image(seg["search_query"], str(img_path)):
                seg["media_type"] = "image"
                seg["has_media"] = True
                print(f"   ✅ OK ảnh: {slug}.jpg")
                continue
            # Fallback sang video
            print(f"   🎬 Fallback video...")
            if download_pexels_video(seg["search_query"], str(vid_path)):
                seg["media_type"] = "video"
                seg["has_media"] = True
                print(f"   ✅ OK video: {slug}.mp4")
                continue

        # Last resort: thử keyword gốc
        if download_pexels_image(seg["keyword"], str(img_path)):
            seg["media_type"] = "image"
            seg["has_media"] = True
            print(f"   ✅ OK ảnh (keyword): {slug}.jpg")
        else:
            seg["media_type"] = "none"
            seg["has_media"] = False
            print(f"   ⚠️  Không tìm được media, sẽ dùng gradient.")


# ============================================================
# STEP 4: Process Individual Clips with FFmpeg
# ============================================================
def process_single_clip(seg: dict, idx: int, project_dir: Path, ffmpeg_path: str) -> Path:
    """Xử lý 1 segment thành clip chuẩn 1080x1920 @ 30fps."""
    slug = seg.get("image_slug", "unknown")
    duration = round(seg["end"] - seg["start"], 2)
    if duration < 0.5:
        duration = 0.5

    clips_dir = project_dir / "clips"
    clips_dir.mkdir(exist_ok=True)
    clip_path = clips_dir / f"clip_{idx:03d}.mp4"

    media_type = seg.get("media_type", "none")
    has_media = seg.get("has_media", False)

    if media_type == "video" and has_media:
        # Video stock: scale/crop sang 1080x1920, trim đúng duration
        vid_path = project_dir / "videos" / f"{slug}.mp4"
        vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1"
        cmd = [
            ffmpeg_path, "-y",
            "-i", str(vid_path),
            "-t", str(duration),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-r", "30", "-an", "-pix_fmt", "yuv420p",
            str(clip_path),
        ]
    elif media_type == "image" and has_media:
        # Ảnh: Ken Burns effect (slow zoom in)
        img_path = project_dir / "images" / f"{slug}.jpg"
        frames = max(int(duration * 30), 15)
        # Scale ảnh lên lớn hơn 1080x1920 (x1.1) để có headroom cho zoom
        # zoompan: zoom từ 1.0 → 1.05 từ từ, pan center
        vf = (
            "scale=1188:2112:force_original_aspect_ratio=increase,"
            "crop=1188:2112,"
            f"zoompan=z='min(zoom+0.0005\\,1.05)'"
            f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
            f":d={frames}:s=1080x1920:fps=30"
        )
        cmd = [
            ffmpeg_path, "-y",
            "-loop", "1", "-i", str(img_path),
            "-t", str(duration),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-pix_fmt", "yuv420p",
            str(clip_path),
        ]
    else:
        # Gradient fallback (dark indigo)
        cmd = [
            ffmpeg_path, "-y",
            "-f", "lavfi",
            "-i", f"color=c=0x1e1b4b:s=1080x1920:d={duration}:r=30",
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-pix_fmt", "yuv420p",
            str(clip_path),
        ]

    result = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
    if result.returncode != 0:
        print(f"      ⚠️  Clip error, fallback gradient...")
        # Fallback: gradient
        cmd_fb = [
            ffmpeg_path, "-y",
            "-f", "lavfi",
            "-i", f"color=c=0x1e1b4b:s=1080x1920:d={duration}:r=30",
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-pix_fmt", "yuv420p",
            str(clip_path),
        ]
        subprocess.run(cmd_fb, capture_output=True, text=True, errors="ignore")

    return clip_path


# ============================================================
# STEP 5: Convert SRT → ASS (styled subtitles - fullscreen friendly)
# ============================================================
def srt_to_ass(srt_path: str, ass_path: str, keywords_set: set):
    """Convert SRT sang ASS với style phù hợp fullscreen video."""
    subs = pysrt.open(srt_path, encoding="utf-8")

    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,56,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,2,40,40,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    # Sort keywords theo độ dài giảm dần (tránh highlight đè)
    sorted_keywords = sorted(list(keywords_set), key=len, reverse=True)

    lines = []
    for sub in subs:
        start = f"{sub.start.hours}:{sub.start.minutes:02d}:{sub.start.seconds:02d}.{sub.start.milliseconds // 10:02d}"
        end = f"{sub.end.hours}:{sub.end.minutes:02d}:{sub.end.seconds:02d}.{sub.end.milliseconds // 10:02d}"
        text = sub.text.replace("\n", "\\N")

        # Highlight keywords vàng
        for kw in sorted_keywords:
            if not kw.strip():
                continue
            pattern = re.compile(r"(?i)\b(" + re.escape(kw) + r")\b")
            text = pattern.sub(r"{\\c&H00D7FF&}\1{\\c&HFFFFFF&}", text)

        # Fade in/out
        text = "{\\fad(200,100)}" + text

        lines.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(lines))
        f.write("\n")

    return ass_path


# ============================================================
# STEP 6: Pure FFmpeg Render Pipeline
# ============================================================
def render_ffmpeg_pipeline(segments: list, project_dir: Path, audio_path: Path, srt_path: Path, audio_duration: float):
    """Render video hoàn chỉnh bằng pure FFmpeg pipeline."""
    ffmpeg_path = get_ffmpeg_path()

    # ---- Process each segment into individual clip ----
    print(f"\n🎬 [4/6] Processing {len(segments)} clips with FFmpeg...")
    clip_paths = []
    for i, seg in enumerate(segments):
        duration = round(seg["end"] - seg["start"], 2)
        media_type = seg.get("media_type", "none")
        print(f"   [{i+1}/{len(segments)}] {seg['keyword']:<20} {duration:.1f}s [{media_type}]")
        clip_path = process_single_clip(seg, i, project_dir, ffmpeg_path)
        clip_paths.append(clip_path)
    print(f"   ✅ Processed {len(clip_paths)} clips")

    # ---- Concat all clips ----
    print(f"\n🔗 [5/6] Concatenating {len(clip_paths)} clips...")
    concat_list = project_dir / "concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for cp in clip_paths:
            safe_path = str(cp.resolve()).replace("\\", "/")
            f.write(f"file '{safe_path}'\n")

    concat_raw = project_dir / "concat_raw.mp4"
    cmd_concat = [
        ffmpeg_path, "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(concat_raw),
    ]
    result = subprocess.run(cmd_concat, capture_output=True, text=True, errors="ignore")
    if result.returncode != 0:
        print(f"   ⚠️  Concat error: {result.stderr[-300:]}")
        sys.exit(1)
    print(f"   ✅ Concatenated → {concat_raw.name}")

    # ---- Add audio + burn subtitles ----
    print(f"\n🔊 [6/6] Adding audio + burning subtitles...")

    # Convert SRT → ASS
    ass_path = project_dir / "styled.ass"
    keywords_json = project_dir / "keywords.json"
    keywords_set = set()
    if keywords_json.exists():
        with open(keywords_json, "r", encoding="utf-8") as f:
            kw_data = json.load(f)
        keywords_set = {kw["keyword"].lower() for kw in kw_data.get("visual_keywords", [])}

    srt_to_ass(str(srt_path), str(ass_path), keywords_set)
    print(f"   ✅ Created styled.ass")

    output_path = project_dir / "output.mp4"

    # Chạy FFmpeg từ project dir để dùng relative path cho ASS
    cmd_final = [
        ffmpeg_path, "-y",
        "-i", str(concat_raw.resolve()),
        "-i", str(audio_path.resolve()),
        "-vf", "ass=styled.ass",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart",
        str(output_path.resolve()),
    ]

    print(f"   Merging: video + audio + subtitles → output.mp4")
    result = subprocess.run(cmd_final, capture_output=True, text=True, errors="ignore", cwd=str(project_dir))

    if result.returncode != 0:
        print(f"   ⚠️  ASS filter failed, trying without subtitles...")
        print(f"   {result.stderr[-300:]}")
        # Fallback: merge without subtitles
        cmd_fallback = [
            ffmpeg_path, "-y",
            "-i", str(concat_raw.resolve()),
            "-i", str(audio_path.resolve()),
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            str(output_path.resolve()),
        ]
        result = subprocess.run(cmd_fallback, capture_output=True, text=True, errors="ignore")
        if result.returncode != 0:
            print(f"   ❌ FFmpeg error:\n{result.stderr[-500:]}")
            sys.exit(1)

    print(f"   ✅ Output: {output_path}")

    # Cleanup temporary files
    for cp in clip_paths:
        if cp.exists():
            cp.unlink()
    clips_dir = project_dir / "clips"
    if clips_dir.exists():
        shutil.rmtree(str(clips_dir), ignore_errors=True)
    if concat_list.exists():
        concat_list.unlink()
    if concat_raw.exists():
        concat_raw.unlink()

    return output_path


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
                    has_srt = (d / "subtitles.srt").exists() or (d / "subtitle.srt").exists()
                    status = "✅" if (has_audio and has_srt) else "⏳"
                    print(f"   {status} {d.name}")
        sys.exit(1)

    project_name = sys.argv[1]
    project_dir = PROJECTS_DIR / project_name

    # Check required files
    audio_path = project_dir / "audio.mp3"
    srt_path = project_dir / "subtitles.srt"
    if not srt_path.exists() and (project_dir / "subtitle.srt").exists():
        srt_path = project_dir / "subtitle.srt"
    keywords_path = project_dir / "keywords.json"

    missing = []
    if not keywords_path.exists():
        missing.append("keywords.json (chạy generate_script.py trước)")
    if not audio_path.exists():
        missing.append("audio.mp3 (tạo TTS trên Colab)")
    if not srt_path.exists():
        missing.append("subtitles.srt hoặc subtitle.srt (tạo subtitle)")

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

    # ---- Step 2: Match keywords ----
    print(f"\n🔗 [2/6] Matching keywords → timestamps...")
    with open(keywords_path, "r", encoding="utf-8") as f:
        kw_data = json.load(f)
    keywords = kw_data.get("visual_keywords", [])
    print(f"   Keywords: {[k['keyword'] for k in keywords]}")

    segments = match_keywords_to_timestamps(subtitles, keywords, audio_duration)
    print(f"   Segments: {len(segments)}")
    for seg in segments:
        print(f"     [{seg['start']:.1f}s - {seg['end']:.1f}s] {seg['keyword']}")

    # ---- Step 3: Download media (random mix) ----
    print(f"\n📥 [3/6] Downloading Pexels media (random video + ảnh)...")
    download_all_media(segments, project_dir)

    # ---- Steps 4-6: Pure FFmpeg Pipeline ----
    output_path = render_ffmpeg_pipeline(segments, project_dir, audio_path, srt_path, audio_duration)

    print(f"\n{'='*60}")
    print(f"🎉 HOÀN TẤT!")
    print(f"   📁 Project: {project_dir}")
    print(f"   🎥 Video:   {output_path}")
    print(f"   📐 Size:    1080x1920 (YouTube Shorts)")
    print(f"   ⏱️  Duration: {audio_duration:.1f}s")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
