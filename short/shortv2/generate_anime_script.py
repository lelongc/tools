"""
Generate Anime Script — Sinh kịch bản anime narration bằng Gemini
Tạo ~30 scenes, mỗi scene có search_query riêng để tải ảnh (~2s/ảnh)
"""
import sys
import io
import json
import re
import time
from pathlib import Path

import requests as http_requests

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from config import GEMINI_API_KEY

PROJECTS_DIR = Path(__file__).resolve().parent / "projects"

PROMPT_TEMPLATE = """You are an expert anime content creator who makes viral YouTube Shorts about hidden anime lore, unknown facts, and shocking revelations. Write an engaging narration script about: "{topic}"

## CRITICAL RULES:
- You MUST research and use ACCURATE anime lore. Do NOT make up facts.
- The script MUST be between 150 and 185 words (target ~165 words for a 1-minute video).
- Write in a flowing, dramatic narration style — like a mysterious anime narrator revealing secrets.
- Use short, punchy sentences. Build tension and curiosity.

## STRUCTURE:
- Opening Hook (~25 words): Start with a shocking statement or question. Example: "Most fans know X, but almost no one knows Y."
- Body (~120 words): Reveal the lore/fact step by step. Explain context, build intrigue.
- Closing (~25 words): End with a mind-blowing conclusion or question. Example: "Did you know about this broken lore?"

## PUNCTUATION FOR TTS:
- Use periods (.) for natural pauses.
- Use commas (,) for flowing continuation.
- Blank lines between paragraphs = dramatic pause.
- NEVER use ellipsis (...). Use a period instead.
- Do NOT use markdown formatting (no *, **, etc.).

## DIRECTOR'S NOTE:
- Generate a director's note for TTS voice acting. Describe pace, tone, and emotion.
- Use tags like [monotone], [analytical], [dramatic], [whisper], [matter-of-fact], [informative], [deadpan] in the tts_script.

## SCENES (CRITICAL — THIS IS THE MOST IMPORTANT PART):
You MUST split the script into exactly 25-30 short scenes. Each scene will be shown as a SEPARATE image for ~2 seconds.

Rules for scenes:
- Each scene is ONE short phrase or half-sentence (roughly 4-7 words each).
- The scenes, when joined together, MUST reconstruct the full script text.
- Every scene MUST have a unique "search_query" to find a DIFFERENT relevant anime image.
- search_query should describe what's visually happening or being referenced in that moment.
- Use character names, actions, concepts, transformations, battles, etc. to make each query unique.
- NEVER repeat the same search_query across scenes.
- The search_query must be a good Google Images search for an anime screenshot or fan art.
- Include the anime series name in search queries for better results.

Example scenes for a Rimuru topic:
- scene: "Most anime fans know Rimuru Tempest" → search_query: "Rimuru Tempest slime form anime screenshot"
- scene: "became an overpowered True Demon Lord" → search_query: "Rimuru Demon Lord transformation Tensura"
- scene: "but almost no one knows" → search_query: "Rimuru shocked face That Time I Got Reincarnated as a Slime"
- scene: "he also unlocked the potential" → search_query: "Rimuru new power awakening Tensura anime"
- scene: "to become a True Hero" → search_query: "Rimuru hero form light novel illustration"

## OUTPUT (valid JSON only, no markdown, no explanation):
{{
  "word_count": 165,
  "anime_title": "That Time I Got Reincarnated as a Slime",
  "script": "Full narration script here with blank lines between paragraphs.",
  "director_note": "Pace: Slow, dramatic, building tension. Long pauses for emphasis.",
  "tts_script": "Script with [tone] tags inserted for TTS. Example: [monotone] Most fans believe... [dramatic] However...",
  "scenes": [
    {{"text": "Most anime fans know Rimuru Tempest", "search_query": "Rimuru Tempest slime form anime screenshot"}},
    {{"text": "became an overpowered True Demon Lord", "search_query": "Rimuru Demon Lord transformation Tensura"}},
    {{"text": "but almost no one knows", "search_query": "mystery anime reveal shocked face"}},
    {{"text": "he also unlocked the potential", "search_query": "Rimuru new power awakening Tensura anime"}},
    {{"text": "to become a True Hero", "search_query": "anime hero awakening golden aura"}}
  ]
}}

IMPORTANT: You MUST generate between 25 and 30 scenes. Each scene text should be 4-7 words. The scenes must cover the ENTIRE script."""


def generate_script(topic: str) -> dict:
    """Generate anime narration script using Gemini API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={GEMINI_API_KEY.strip()}"
    headers = {"Content-Type": "application/json"}

    prompt = PROMPT_TEMPLATE.format(topic=topic)
    messages = [
        {"role": "system", "content": "You are a JSON-only response bot specializing in anime content. Always return valid JSON. Use accurate anime knowledge. The script must be 150-185 words. You MUST generate exactly 25-30 scenes, each with a unique search_query for a different anime image."},
        {"role": "user", "content": prompt},
    ]

    max_retries = 3
    data = {}
    for attempt in range(max_retries):
        try:
            gemini_contents = []
            system_instruction = None
            for msg in messages:
                if msg['role'] == 'system':
                    system_instruction = {'parts': [{'text': msg['content']}]}
                else:
                    role = 'user' if msg['role'] == 'user' else 'model'
                    gemini_contents.append({'role': role, 'parts': [{'text': msg['content']}]})

            body = {
                'contents': gemini_contents,
                'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0.7}
            }
            if system_instruction:
                body['systemInstruction'] = system_instruction

            resp = http_requests.post(url, headers=headers, json=body, timeout=60)
            if resp.status_code == 429 and attempt < max_retries - 1:
                wait = 10
                print(f"   Rate limit hit. Retrying in {wait}s... ({attempt+1}/{max_retries})")
                time.sleep(wait)
                continue
            resp.raise_for_status()

            result = resp.json()
            raw = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            raw = re.sub(r"^```json\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            data = json.loads(raw)

            script_text = data.get("script", "")
            word_count = len(script_text.split())
            scene_count = len(data.get("scenes", []))
            print(f"   Generated: {word_count} words, {scene_count} scenes (Attempt {attempt+1}/{max_retries})")

            # Validate word count
            if not (140 <= word_count <= 195):
                if attempt < max_retries - 1:
                    print(f"   ⚠️ Word count {word_count} outside [140, 195]. Rewriting...")
                    messages.append({"role": "assistant", "content": raw})
                    messages.append({
                        "role": "user",
                        "content": f"The script has {word_count} words. Rewrite to be 150-185 words. Keep 25-30 scenes."
                    })
                    continue

            # Validate scene count
            if scene_count < 20:
                if attempt < max_retries - 1:
                    print(f"   ⚠️ Only {scene_count} scenes. Need 25-30. Rewriting...")
                    messages.append({"role": "assistant", "content": raw})
                    messages.append({
                        "role": "user",
                        "content": f"You only generated {scene_count} scenes. Split the script into more granular scenes (25-30 total). Each scene should be only 4-7 words. Keep the same script text."
                    })
                    continue

            print(f"   ✅ OK! {word_count} words, {scene_count} scenes")
            break

        except Exception as e:
            if attempt >= max_retries - 1:
                raise
            print(f"   Error: {e}. Retrying...")
            time.sleep(5)

    return data


def save_project(topic: str, data: dict) -> Path:
    """Save generated script data to a project directory."""
    slug = re.sub(r"[^a-z0-9]+", "_", topic.lower()).strip("_")[:80]
    project_dir = PROJECTS_DIR / slug
    project_dir.mkdir(parents=True, exist_ok=True)

    (project_dir / "script.txt").write_text(data.get("script", ""), encoding="utf-8")
    (project_dir / "script_data.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return project_dir


def main():
    if len(sys.argv) < 2:
        topic = input("Nhap chu de anime video: ").strip()
    else:
        topic = " ".join(sys.argv[1:])

    if not topic:
        print("[X] Can nhap chu de!")
        sys.exit(1)

    print(f"[*] Dang sinh kich ban cho: '{topic}'...")
    data = generate_script(topic)
    project_dir = save_project(topic, data)
    print(f"\n[OK] DA TAO KICH BAN THANH CONG!")
    print(f"Thu muc project: {project_dir}")
    print(f"So scene: {len(data.get('scenes', []))}")
    return data, project_dir


if __name__ == "__main__":
    main()
