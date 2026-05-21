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

from config import GROQ_API_KEY as GEMINI_API_KEY # Assuming config is modified or we just rename it

PROJECTS_DIR = Path(__file__).parent / "projects"

PROMPT_TEMPLATE = """You are a top-tier viral YouTube Shorts scriptwriter and English language educator. Write an engaging English learning/storytelling script about: "{topic}"

## CRITICAL LENGTH & DURATION REQUIREMENT:
- The script MUST be around 150 words (strictly between 140 and 155 words). This is a hard requirement.
- At normal speaking pace, 150 words = approximately 50 seconds of audio.
- Write in a flowing, storytelling narrative — NOT bullet points.
- Use clear, professional, yet conversational English, making it perfect for English learners to listen and study.
- Highlight or use useful vocabulary, expressions, or idiomatic phrases relevant to the topic.
- To hit exactly ~150 words, please structure the script length paragraph by paragraph as follows:
  * Paragraph 1 (HOOK): ~25 words (1-2 sentences).
  * Paragraph 2 (BODY 1): ~30 words (2-3 sentences).
  * Paragraph 3 (BODY 2): ~30 words (2-3 sentences).
  * Paragraph 4 (BODY 3): ~35 words (2-3 sentences).
  * Paragraph 5 (CTA): ~30 words (2 sentences).
  * Total Target: 150 words.
- You MUST count the words in your generated script before outputting. If it is less than 140 words or more than 155 words, rewrite and adjust it to fit the range.

## PUNCTUATION RULES (TTS system reads these as timing cues):
- COMMAS (,) = chain actions smoothly in one breath, no pause. Use these to connect flowing descriptions.
- PERIODS (.) QUESTION MARKS (?) EXCLAMATION (!) SEMICOLONS (;) COLONS (:) = end of sentence, brief 0.1s pause.
- BLANK LINES between paragraphs = dramatic 0.35s pause for emphasis.
- NEVER use ellipsis (...). Use a period or new paragraph instead.
- Do NOT include any markdown bold (* or **) or italic inside the script text.

## SCRIPT STRUCTURE:
- Paragraph 1 (HOOK): An attention-grabbing question or shocking fact related to the topic. 1-2 sentences max.
- Paragraphs 2-4 (BODY): Educational, informative, or vivid storytelling. Introduce key English vocabulary, idioms, or communication tips and use them in context.
- Final paragraph (CTA): Short call to action encouraging viewers to practice or subscribe.

## EXAMPLE SCRIPT (topic: "Why you should wake up at 5 AM" - EXACTLY 150 WORDS):

You are wasting the most valuable and quiet hours of your entire day.
Most people wake up around eight, rush through a quick breakfast, and start their day feeling stressed and already behind.

But imagine this instead; your alarm goes off at five in the morning, the whole world is silent, the air is clean, and you have three full hours before anyone else is awake.
You pour yourself a glass of cold water, sit comfortably at your desk, and start working on the project that actually matters to you.
No phone notifications, no social media distractions, and no noise.

By the time everyone else finally opens their eyes, you have already exercised, planned your entire day, and completed your most important task.
You feel completely unstoppable, highly focused, and three steps ahead of everyone.

That is the true power of early rising.
Follow us for more daily productivity hacks.

## VISUAL KEYWORDS:
Extract exactly 10-12 concrete nouns, actions, or phrases from YOUR script, in strict order of appearance.
- They MUST be evenly distributed throughout the script (roughly one keyword/action for every 10-15 words).
- "keyword": 1-3 words that appear literally in the script.
- "search_query": 3-6 word descriptive phrase for image generation.

## OUTPUT (valid JSON only, no markdown, no explanation):
{{
  "word_count": 150,
  "script": "Full script here with blank lines between paragraphs.",
  "visual_keywords": [
    {{"keyword": "alarm", "search_query": "alarm clock morning dark bedroom"}},
    {{"keyword": "cold water", "search_query": "glass cold water splash morning"}}
  ]
}}"""

def generate_script(topic: str) -> dict:
    url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json",
    }

    prompt = PROMPT_TEMPLATE.format(topic=topic)
    messages = [
        {"role": "system", "content": "You are a JSON-only response bot. Always return valid JSON. Make sure the generated script has around 150 words (strictly 140-155)."},
        {"role": "user", "content": prompt},
    ]

    max_retries = 3
    data = {}
    for attempt in range(max_retries):
        try:
            body = {
                "model": "gemini-1.5-flash",
                "messages": messages,
                "response_format": {"type": "json_object"},
                "temperature": 0.7,
                "max_tokens": 2000,
            }
            resp = http_requests.post(url, headers=headers, json=body, timeout=30)
            if resp.status_code == 429 and attempt < max_retries - 1:
                wait = 10
                print(f"   Rate limit hit. Retrying in {wait}s... ({attempt+1}/{max_retries})")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            
            result = resp.json()
            raw = result["choices"][0]["message"]["content"].strip()
            raw = re.sub(r"^```json\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            data = json.loads(raw)
            
            script_text = data.get("script", "")
            word_count = len(script_text.split())
            print(f"   Generated script word count: {word_count} words (Attempt {attempt+1}/{max_retries})")
            
            if 140 <= word_count <= 155:
                print("   ✅ Word count is within target range [140, 155]!")
                break
            else:
                if attempt < max_retries - 1:
                    print(f"   ⚠️ Word count {word_count} is outside [140, 155]. Asking model to rewrite...")
                    messages.append({"role": "assistant", "content": raw})
                    messages.append({
                        "role": "user",
                        "content": f"The previous script you generated was too short/long ({word_count} words). Please rewrite so that the total word count is strictly between 140 and 155 words (target exactly 150 words)."
                    })
                else:
                    print(f"   ⚠️ Word count {word_count} is outside [140, 155] but reached max retries.")
        except Exception as e:
            if attempt >= max_retries - 1:
                raise
            print(f"   Error: {e}. Retrying...")
            time.sleep(5)

    return data

def save_project(topic: str, data: dict) -> Path:
    slug = re.sub(r"[^a-z0-9]+", "_", topic.lower()).strip("_")
    project_dir = PROJECTS_DIR / slug
    project_dir.mkdir(parents=True, exist_ok=True)
    
    (project_dir / "script.txt").write_text(data.get("script", ""), encoding="utf-8")
    (project_dir / "keywords.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    
    prompts = [kw["search_query"] for kw in data.get("visual_keywords", [])]
    (project_dir / "prompts.txt").write_text("\n".join(prompts), encoding="utf-8")
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
    print(f"\n[OK] DA TAO KICH BAN THANH CONG!")
    print(f"Thu muc project: {project_dir}")

if __name__ == "__main__":
    main()
