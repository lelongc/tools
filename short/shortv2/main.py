"""
🎬 Anime Short Video Maker — Main Pipeline

Tạo video YouTube Shorts về anime lore/facts tự động:
1. Gemini sinh kịch bản anime
2. Google Images tải ảnh nhân vật
3. Gemini TTS tạo giọng đọc
4. FFmpeg ghép video hoàn chỉnh

Usage:
    python main.py "Rimuru's hidden hero power in Tensura"
    python main.py  (sẽ hỏi nhập topic)
"""
import io
import json
import os
import re
import sys
import time
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from generate_anime_script import generate_script, save_project
from fetch_anime_images import fetch_images_for_characters, fetch_images_for_scenes
from generate_tts import generate_tts_audio
from render_video import (
    get_audio_duration,
    generate_ass_subtitles,
    calculate_scene_timings,
    render_video,
)


def run_pipeline(topic: str, voice_name: str = "Achird"):
    """
    Run the full anime short video pipeline.
    
    Args:
        topic: Anime topic/lore to make video about
        voice_name: Gemini TTS voice (default: Achird)
    """
    print(f"\n{'='*60}")
    print(f"🎬 ANIME SHORT VIDEO MAKER")
    print(f"{'='*60}")
    print(f"📝 Topic: {topic}")
    print(f"🎙️ Voice: {voice_name}")
    print(f"{'='*60}\n")

    start_time = time.time()

    # ==========================================
    # STEP 1: Generate Anime Script
    # ==========================================
    print(f"📖 [1/5] Sinh kịch bản anime (Gemini AI)...")
    script_data = generate_script(topic)
    project_dir = save_project(topic, script_data)

    script_text = script_data.get("script", "")
    characters = script_data.get("characters", [])
    scenes = script_data.get("scenes", [])
    director_note = script_data.get("director_note", "Pace: Slow, dramatic. Long pauses for emphasis.")
    tts_script = script_data.get("tts_script", "")
    anime_title = script_data.get("anime_title", "Unknown Anime")

    print(f"   ✅ Script: {len(script_text.split())} words")
    print(f"   🎭 Characters: {', '.join(c['name'] for c in characters)}")
    print(f"   🎬 Scenes: {len(scenes)}")
    print(f"   📺 Anime: {anime_title}")

    # ==========================================
    # STEP 2: Fetch Anime Images
    # ==========================================
    print(f"\n🖼️ [2/5] Tải ảnh nhân vật anime...")
    char_images = fetch_images_for_characters(characters, project_dir)
    scene_images = fetch_images_for_scenes(scenes, char_images, project_dir)
    print(f"   ✅ Đã mapping {len(scene_images)} ảnh cho {len(scenes)} scenes")

    # ==========================================
    # STEP 3: Generate TTS Audio
    # ==========================================
    print(f"\n🎤 [3/5] Tạo giọng đọc (Gemini TTS - {voice_name})...")
    audio_output = str(project_dir / "audio")
    audio_path = generate_tts_audio(
        script=script_text,
        director_note=director_note,
        output_path=audio_output,
        voice_name=voice_name,
        tts_script=tts_script,
    )
    audio_path = Path(audio_path)
    print(f"   ✅ Audio: {audio_path.name}")

    # ==========================================
    # STEP 4: Generate Subtitles
    # ==========================================
    print(f"\n📝 [4/5] Tạo phụ đề (.ass)...")
    audio_duration = get_audio_duration(str(audio_path))
    if audio_duration <= 0:
        # Estimate: ~150 words at ~3 words/sec = ~50s
        audio_duration = len(script_text.split()) / 3.0
        print(f"   ⚠️ Estimated duration: {audio_duration:.1f}s")
    else:
        print(f"   🕐 Audio duration: {audio_duration:.1f}s")

    scene_timings = calculate_scene_timings(scenes, audio_duration)

    subtitle_path = project_dir / "subtitles.ass"
    generate_ass_subtitles(scenes, scene_timings, subtitle_path)

    # ==========================================
    # STEP 5: Render Video
    # ==========================================
    print(f"\n🎬 [5/5] Render video hoàn chỉnh...")
    output_path = project_dir / "final_short.mp4"
    result = render_video(
        scene_images=scene_images,
        scene_timings=scene_timings,
        audio_path=audio_path,
        subtitle_path=subtitle_path,
        output_path=output_path,
    )

    elapsed = time.time() - start_time

    print(f"\n{'='*60}")
    if result and result.exists():
        size_mb = result.stat().st_size / (1024 * 1024)
        print(f"🎉 VIDEO HOÀN TẤT!")
        print(f"   📁 Project: {project_dir}")
        print(f"   🎥 Video:   {result}")
        print(f"   📏 Size:    {size_mb:.1f} MB")
        print(f"   ⏱️ Time:    {elapsed:.0f}s")
    else:
        print(f"❌ LỖI RENDER VIDEO!")
        print(f"   📁 Project: {project_dir}")
        print(f"   ⏱️ Time:    {elapsed:.0f}s")
    print(f"{'='*60}")

    return result


def main():
    if len(sys.argv) < 2:
        topic = input("Nhập chủ đề anime video: ").strip()
    else:
        topic = " ".join(sys.argv[1:])

    if not topic:
        print("[X] Cần nhập chủ đề!")
        sys.exit(1)

    run_pipeline(topic)


if __name__ == "__main__":
    main()
