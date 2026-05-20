"""
Phase 1: Sinh kịch bản YouTube Shorts + Visual Keywords bằng Groq API (Llama 3).

Usage:
    python generate_script.py "Morning routine"
    python generate_script.py "Cooking pasta"
"""

import sys
import io
import json
import re
import time
from pathlib import Path

import requests as http_requests

# Fix Windows encoding (cp1252 can't handle Unicode)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from config import GROQ_API_KEY

PROJECTS_DIR = Path(__file__).parent / "projects"

PROMPT_TEMPLATE = """You are a top-tier viral YouTube Shorts scriptwriter and English language educator. Write an engaging English learning/storytelling script about: "{topic}"

## CRITICAL LENGTH REQUIREMENT:
- The script MUST be 120-140 words long. This is non-negotiable.
- At normal speaking pace, 120-140 words = approximately 45-50 seconds of audio.
- Write in a flowing, storytelling narrative — NOT a bullet-point list.
- Use clear, professional, yet conversational English, making it perfect for English learners to listen and study.
- Highlight or use useful vocabulary, expressions, or idiomatic phrases relevant to the topic.

## PUNCTUATION RULES (TTS system reads these as timing cues):
- COMMAS (,) = chain actions smoothly in one breath, no pause. Use these to connect flowing descriptions.
- PERIODS (.) QUESTION MARKS (?) EXCLAMATION (!) SEMICOLONS (;) COLONS (:) = end of sentence, brief 0.1s pause.
- BLANK LINES between paragraphs = dramatic 0.35s pause for emphasis.
- NEVER use ellipsis (...). Use a period or new paragraph instead.

## SCRIPT STRUCTURE:
- Paragraph 1 (HOOK): An attention-grabbing question or shocking fact related to the topic. 1-2 sentences max.
- Paragraphs 2-4 (BODY): Educational, informative, or vivid storytelling. Introduce key English vocabulary, idioms, or communication tips and use them in context.
- Final paragraph (CTA): Short call to action encouraging viewers to practice or subscribe.

## EXAMPLE SCRIPT (topic: "Why you should wake up at 5 AM"):

You are wasting the most powerful hours of your day.
Most people wake up at eight, rush through breakfast, and start their day already behind.

But imagine this; your alarm goes off at five, the world is silent, the air is cool, and you have three full hours before anyone else is even awake.
You pour yourself a glass of cold water, sit at your desk, and start working on the thing that actually matters to you.
No notifications, no distractions, no noise.

By the time everyone else opens their eyes, you have already exercised, planned your entire day, and finished your most important task.
You feel unstoppable, focused, and three steps ahead.

That is the power of waking up early.
Follow for more daily productivity hacks.

## VISUAL KEYWORDS:
Extract exactly 10-12 concrete nouns, actions, or phrases from YOUR script, in strict order of appearance.
- They MUST be evenly distributed throughout the script (roughly one keyword/action for every 10-15 words).
- This is to ensure a new visual appears on screen every 4-5 seconds.
- "keyword": 1-3 words that appear literally in the script.
- "search_query": 3-6 word descriptive phrase for Pexels search (prefer high-quality portrait/vertical videos/images that match the keyword's mood/concept perfectly).

## OUTPUT (valid JSON only, no markdown, no explanation):
{{
  "script": "Full script here with blank lines between paragraphs.",
  "visual_keywords": [
    {{"keyword": "alarm", "search_query": "alarm clock morning dark bedroom"}},
    {{"keyword": "cold water", "search_query": "glass cold water splash morning"}}
  ]
}}"""


def generate_script(topic: str) -> dict:
    """Gọi Groq API (Llama 3) sinh kịch bản và visual keywords."""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    prompt = PROMPT_TEMPLATE.format(topic=topic)

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a JSON-only response bot. Always return valid JSON."},
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.8,
        "max_tokens": 2000,
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            resp = http_requests.post(url, headers=headers, json=body, timeout=30)
            if resp.status_code == 429 and attempt < max_retries - 1:
                wait = 30
                print(f"   Rate limit hit. Retrying in {wait}s... ({attempt+1}/{max_retries})")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            break
        except http_requests.exceptions.HTTPError as e:
            if attempt >= max_retries - 1:
                raise
            print(f"   Error: {e}. Retrying...")
            time.sleep(10)

    result = resp.json()
    raw = result["choices"][0]["message"]["content"].strip()

    # Loại bỏ markdown code fences nếu có
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    data = json.loads(raw)
    return data


def save_project(topic: str, data: dict) -> Path:
    """Tạo thư mục project và lưu script + keywords."""
    slug = re.sub(r"[^a-z0-9]+", "_", topic.lower()).strip("_")
    project_dir = PROJECTS_DIR / slug
    project_dir.mkdir(parents=True, exist_ok=True)

    # Lưu script.txt
    script_path = project_dir / "script.txt"
    script_path.write_text(data["script"], encoding="utf-8")

    # Lưu keywords.json
    keywords_path = project_dir / "keywords.json"
    keywords_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return project_dir


def main():
    if len(sys.argv) < 2:
        topic = input("Nhap chu de video Shorts: ").strip()
    else:
        topic = " ".join(sys.argv[1:])

    if not topic:
        print("[X] Can nhap chu de!")
        sys.exit(1)

    print(f"[*] Dang sinh kich ban cho: '{topic}'...")
    data = generate_script(topic)

    project_dir = save_project(topic, data)

    print(f"\n{'='*60}")
    print(f"[OK] DA TAO KICH BAN THANH CONG!")
    print(f"{'='*60}")
    print(f"\nThu muc project: {project_dir}")
    print(f"\nKICH BAN:")
    print(f"{'-'*60}")
    print(data["script"])
    print(f"{'-'*60}")
    print(f"\nVISUAL KEYWORDS ({len(data['visual_keywords'])} tu khoa):")
    for i, kw in enumerate(data["visual_keywords"], 1):
        print(f"   {i}. {kw['keyword']:<20} -> Pexels: \"{kw['search_query']}\"")

    print(f"\n{'='*60}")
    print(f"BUOC TIEP THEO:")
    print(f"   1. Copy noi dung script.txt sang Colab de tao TTS")
    print(f"   2. Tao file audio.mp3 va subtitles.srt")
    print(f"   3. Bo 2 file do vao: {project_dir}")
    print(f"   4. Chay: python render_video.py {project_dir.name}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
