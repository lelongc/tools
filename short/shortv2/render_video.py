"""
Render Video — Ghép ảnh + audio + subtitle thành video MP4
Sử dụng FFmpeg, không cần Playwright hay GPU.
"""
import io
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


def get_ffmpeg_path() -> str:
    """Find ffmpeg executable."""
    # Check local npm install
    local_npm = Path(__file__).resolve().parent / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
    if local_npm.exists():
        return str(local_npm)
    # Check parent dir
    parent_npm = Path(__file__).resolve().parent.parent / "shortv1" / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"
    if parent_npm.exists():
        return str(parent_npm)
    # System ffmpeg
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    return "ffmpeg"


def get_audio_duration(audio_path: str) -> float:
    """Get audio duration in seconds using ffmpeg."""
    ffmpeg = get_ffmpeg_path()
    try:
        result = subprocess.run(
            [ffmpeg, "-i", audio_path],
            capture_output=True, text=True, errors="ignore"
        )
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", result.stderr)
        if match:
            h = int(match.group(1))
            m = int(match.group(2))
            s = float(match.group(3))
            return h * 3600 + m * 60 + s
    except Exception as e:
        print(f"   ⚠️ Cannot read audio duration: {e}")
    return 0.0


def generate_ass_subtitles(
    scenes: list[dict],
    scene_timings: list[tuple[float, float]],
    output_path: Path,
):
    """
    Generate .ass subtitle file from scenes and their timings.
    Highlights character names in yellow.
    """
    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 1

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,62,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,3,8,0,2,50,50,130,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    def fmt_time(s: float) -> str:
        h = int(s // 3600)
        m = int((s % 3600) // 60)
        sec = int(s % 60)
        ms = int((s % 1) * 100)
        return f"{h}:{m:02d}:{sec:02d}.{ms:02d}"

    events = []
    # Collect all character names for highlighting
    all_chars = set()
    for scene in scenes:
        char = scene.get("character", "")
        if char:
            all_chars.add(char)

    for i, (scene, timing) in enumerate(zip(scenes, scene_timings)):
        start = fmt_time(timing[0])
        end = fmt_time(timing[1])
        text = scene["text"].strip()

        # Highlight character names in yellow
        for char_name in all_chars:
            # Highlight full name and first name
            names_to_highlight = [char_name]
            parts = char_name.split()
            if len(parts) > 1:
                names_to_highlight.append(parts[0])  # First name

            for name in names_to_highlight:
                pattern = re.compile(r'\b' + re.escape(name) + r'\b', re.IGNORECASE)
                text = pattern.sub(
                    lambda m: f"{{\\c&H00FFFF&\\b1}}{m.group(0)}{{\\c&HFFFFFF&\\b0}}",
                    text
                )

        events.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    output_path.write_text(ass_header + "\n".join(events), encoding="utf-8")
    print(f"   ✅ Subtitle created: {output_path.name}")


def render_video(
    scene_images: list[Path],
    scene_timings: list[tuple[float, float]],
    audio_path: Path,
    subtitle_path: Path,
    output_path: Path,
    fps: int = 30,
):
    """
    Render final video using FFmpeg:
    - Each image is shown for its allocated duration with slow zoom effect
    - Audio is overlaid
    - Subtitles are burned in
    """
    ffmpeg = get_ffmpeg_path()
    project_dir = output_path.parent

    print(f"\n🎬 Rendering video...")
    print(f"   📸 {len(scene_images)} scenes")
    print(f"   🎵 Audio: {audio_path.name}")

    # Step 1: Create individual clips for each scene with zoom effect
    clip_paths = []
    for i, (img_path, timing) in enumerate(zip(scene_images, scene_timings)):
        duration = timing[1] - timing[0]
        if duration <= 0:
            duration = 2.5  # fallback

        dur_frames = max(int(duration * fps), 1)
        clip_path = project_dir / f"_clip_{i:03d}.mp4"
        clip_paths.append(clip_path)

        # Slow zoom effect: zoom from 1.0 to 1.08
        zoom_filter = (
            f"zoompan=z='min(zoom+0.0003,1.08)'"
            f":x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2'"
            f":d={dur_frames}:s=1080x1920:fps={fps}"
        )

        cmd = [
            ffmpeg, "-y",
            "-loop", "1",
            "-i", str(img_path),
            "-vf", zoom_filter,
            "-c:v", "libx264",
            "-t", f"{duration:.3f}",
            "-pix_fmt", "yuv420p",
            "-r", str(fps),
            str(clip_path),
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
        if result.returncode != 0:
            print(f"      ⚠️ Clip {i} render error: {result.stderr[-200:]}")
        else:
            print(f"      📹 Clip {i+1}/{len(scene_images)}: {duration:.1f}s ({img_path.name})")

    # Step 2: Concatenate all clips
    concat_list = project_dir / "_concat.txt"
    concat_list.write_text(
        "\n".join(f"file '{clip.name}'" for clip in clip_paths),
        encoding="utf-8"
    )

    merged_path = project_dir / "_merged.mp4"
    cmd = [
        ffmpeg, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(merged_path),
    ]
    subprocess.run(cmd, capture_output=True, text=True, errors="ignore")

    # Step 3: Combine video + audio + subtitles
    # Escape the subtitle path for ffmpeg filter (Windows backslashes)
    ass_escaped = str(subtitle_path).replace("\\", "/").replace(":", "\\:")

    cmd = [
        ffmpeg, "-y",
        "-i", str(merged_path),
        "-i", str(audio_path),
        "-vf", f"ass='{ass_escaped}'",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(output_path),
    ]

    print(f"\n   🔧 Merging video + audio + subtitles...")
    result = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")

    if result.returncode != 0:
        # Fallback: try without subtitles
        print(f"   ⚠️ Subtitle overlay failed, trying without subtitles...")
        cmd_fallback = [
            ffmpeg, "-y",
            "-i", str(merged_path),
            "-i", str(audio_path),
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "18",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            str(output_path),
        ]
        result = subprocess.run(cmd_fallback, capture_output=True, text=True, errors="ignore")
        if result.returncode != 0:
            print(f"   ❌ FFmpeg error: {result.stderr[-500:]}")
            return None

    # Step 4: Cleanup temp files
    print(f"   🧹 Cleaning up temp files...")
    for clip in clip_paths:
        if clip.exists():
            clip.unlink()
    if concat_list.exists():
        concat_list.unlink()
    if merged_path.exists():
        merged_path.unlink()

    if output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Video rendered: {output_path.name} ({size_mb:.1f} MB)")
        return output_path
    else:
        print(f"   ❌ Video rendering failed!")
        return None


def calculate_scene_timings(
    scenes: list[dict],
    audio_duration: float,
    min_duration: float = 2.0,
    max_duration: float = 4.0,
) -> list[tuple[float, float]]:
    """
    Calculate start/end times for each scene based on audio duration.
    Distributes time evenly across scenes, clamped to [min, max] per scene.
    """
    n = len(scenes)
    if n == 0:
        return []

    # Base duration per scene
    base_dur = audio_duration / n

    # Clamp to range
    dur = max(min_duration, min(max_duration, base_dur))

    # If total would exceed audio, scale down
    total = dur * n
    if total > audio_duration:
        dur = audio_duration / n

    timings = []
    current = 0.0
    for i in range(n):
        if i == n - 1:
            # Last scene extends to end of audio
            end = audio_duration
        else:
            end = current + dur

        timings.append((current, end))
        current = end

    return timings
