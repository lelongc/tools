"""
Generate TTS — Tạo giọng đọc narration bằng Gemini 3.1 Flash TTS
"""
import io
import mimetypes
import os
import re
import struct
import sys
import time
from pathlib import Path

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from google import genai
from google.genai import types

from config import GEMINI_API_KEY


def save_binary_file(file_name: str, data: bytes):
    """Save binary data to file."""
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"   💾 Audio saved: {file_name}")


def convert_to_wav(audio_data: bytes, mime_type: str) -> bytes:
    """
    Convert raw audio data to WAV format by adding a proper WAV header.
    """
    parameters = parse_audio_mime_type(mime_type)
    bits_per_sample = parameters["bits_per_sample"]
    sample_rate = parameters["rate"]
    num_channels = 1
    data_size = len(audio_data)
    bytes_per_sample = bits_per_sample // 8
    block_align = num_channels * bytes_per_sample
    byte_rate = sample_rate * block_align
    chunk_size = 36 + data_size

    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        chunk_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        num_channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b"data",
        data_size,
    )
    return header + audio_data


def parse_audio_mime_type(mime_type: str) -> dict:
    """Parse bits per sample and rate from audio MIME type."""
    bits_per_sample = 16
    rate = 24000

    parts = mime_type.split(";")
    for param in parts:
        param = param.strip()
        if param.lower().startswith("rate="):
            try:
                rate = int(param.split("=", 1)[1])
            except (ValueError, IndexError):
                pass
        elif param.startswith("audio/L"):
            try:
                bits_per_sample = int(param.split("L", 1)[1])
            except (ValueError, IndexError):
                pass

    return {"bits_per_sample": bits_per_sample, "rate": rate}


def build_tts_prompt(script: str, director_note: str, tts_script: str = None) -> str:
    """
    Build a TTS prompt with director's note and tone tags.
    If tts_script is provided (script with [tone] tags), use it.
    Otherwise, auto-generate tone tags from the plain script.
    """
    # Use the TTS-annotated script if available
    narration_text = tts_script if tts_script else script

    prompt = f"""Read the following transcript based on the director's note.

# Director's note
{director_note}

## Transcript:
{narration_text}"""

    return prompt


def generate_tts_audio(
    script: str,
    director_note: str,
    output_path: str,
    voice_name: str = "Achird",
    tts_script: str = None,
) -> str:
    """
    Generate TTS audio using Gemini 3.1 Flash TTS Preview.
    
    Args:
        script: Plain narration script
        director_note: Director's note for TTS pacing/tone
        output_path: Path to save the output WAV file
        voice_name: Gemini TTS voice name (default: Achird)
        tts_script: Optional script with [tone] tags for TTS
    
    Returns:
        Path to the saved audio file
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt_text = build_tts_prompt(script, director_note, tts_script)

    model = "gemini-3.1-flash-tts-preview"
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt_text)],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=["audio"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice_name
                )
            )
        ),
    )

    print(f"   🎙️ Generating TTS audio (voice: {voice_name})...")
    print(f"   📝 Director's note: {director_note[:80]}...")

    # Collect all audio chunks
    all_audio_data = b""
    final_mime_type = None

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if chunk.parts is None:
            continue
        if chunk.parts[0].inline_data and chunk.parts[0].inline_data.data:
            inline_data = chunk.parts[0].inline_data
            all_audio_data += inline_data.data
            if final_mime_type is None:
                final_mime_type = inline_data.mime_type

    if not all_audio_data:
        raise RuntimeError("No audio data received from Gemini TTS")

    # Determine file extension and convert if needed
    file_extension = mimetypes.guess_extension(final_mime_type) if final_mime_type else None
    if file_extension is None:
        file_extension = ".wav"
        all_audio_data = convert_to_wav(all_audio_data, final_mime_type or "audio/L16;rate=24000")

    # Save audio file
    final_path = output_path if output_path.endswith(file_extension) else f"{output_path}{file_extension}"
    save_binary_file(final_path, all_audio_data)

    return final_path


def main():
    """Test mode — generate TTS for a sample script."""
    test_script = (
        "Most anime fans know Rimuru Tempest became an overpowered True Demon Lord. "
        "But almost no one knows he also unlocked the potential to become a True Hero."
    )
    test_note = "Pace: Slow, dramatic. Long pauses for emphasis."
    test_tts = (
        "[monotone] Most anime fans know Rimuru Tempest became an overpowered True Demon Lord. "
        "[dramatic] But almost no one knows he also unlocked the potential to become a True Hero."
    )

    output_dir = Path(__file__).parent / "projects" / "test_tts"
    output_dir.mkdir(parents=True, exist_ok=True)

    result = generate_tts_audio(
        script=test_script,
        director_note=test_note,
        output_path=str(output_dir / "test_audio"),
        tts_script=test_tts,
    )
    print(f"\n[OK] Audio generated: {result}")


if __name__ == "__main__":
    main()
