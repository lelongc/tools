import os
import json
import time
import sys
import io
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Load env
ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)
api_key = os.getenv("gemini_api")

if not api_key:
    print("❌ Thieu GEMINI_API_KEY trong .env")
    exit(1)

client = genai.Client(api_key=api_key)

audio_path = Path("d:/folder/tools/short/projects/how_to_use_the_word_get_in_english/audio.mp3")
if not audio_path.exists():
    print(f"❌ Khong tim thay audio file tai: {audio_path}")
    exit(1)

print("🚀 Uploading audio to Gemini API...")
uploaded_file = client.files.upload(file=str(audio_path))
print(f"   Uploaded file: {uploaded_file.name}")

# Wait for file to be processed if needed (audio is fast, but good practice)
while uploaded_file.state.name == "PROCESSING":
    print("   Waiting for processing...")
    time.sleep(2)
    uploaded_file = client.files.get(name=uploaded_file.name)

if uploaded_file.state.name == "FAILED":
    print("❌ File processing failed!")
    exit(1)

print("🎙️ Requesting word-level timestamps from Gemini...")
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

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[uploaded_file, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    print("\n✅ Responded! Raw Output:")
    print(response.text[:1000])
    
    # Save output to test
    output_path = Path("d:/folder/tools/short/projects/how_to_use_the_word_get_in_english/word_timestamps.json")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(response.text)
    print(f"✅ Saved to {output_path}")

finally:
    # Clean up uploaded file
    print("🧹 Cleaning up file on Gemini Server...")
    client.files.delete(name=uploaded_file.name)
    print("   Done!")
