def get_effective_gemini_key(user_key=""):
    k_cand = ""
    if user_key and user_key.strip():
        k_cand = user_key.strip()
    elif SETTINGS_FILE.exists():
        try:
            data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
            k_cand = data.get("gemini_api_key", "").strip()
        except Exception: pass
    if not k_cand:
        k_cand = os.environ.get("GEMINI_API_KEY", "").strip()
    
    # Clean quotes and spaces
    return k_cand.strip('"\' \t\r\n')


def get_anilist_anime_info(anime_name):
    query = '''
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        title { english romaji }
        description(asHtml: false)
        genres
        characters(limit: 12) {
          nodes {
            name { full }
          }
        }
      }
    }
    '''
    try:
        r = requests.post('https://graphql.anilist.co', json={'query': query, 'variables': {'search': anime_name.replace('_', ' ')}}, timeout=10)
        if r.status_code == 200:
            data = r.json().get('data', {}).get('Media', {})
            title = data.get('title', {}).get('english') or data.get('title', {}).get('romaji') or anime_name
            desc = data.get('description', '')
            genres = ", ".join(data.get('genres', []))
            chars = ", ".join([c['name']['full'] for c in data.get('characters', {}).get('nodes', [])])
            return f"Anime: {title}\nGenres: {genres}\nCharacters: {chars}\nSynopsis: {desc[:600]}"
    except Exception as e:
        print(f"⚠️ Lỗi AniList API: {e}")
    return f"Anime: {anime_name}"

def suggest_viral_topics(anime_name, api_key):
    print(f"🔎 [ANILIST AI] Đang cào dữ liệu Lore & Tóm tắt cho Anime '{anime_name}'...", flush=True)
    lore_info = get_anilist_anime_info(anime_name)
    
    models = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemma-4-31b-it"]
    prompt = f"""You are a top YouTube Shorts Strategist for Anime Channels with 10M subscribers.
Anime Name: {anime_name}

Anime Lore & Metadata from AniList:
{lore_info}

TASK:
Analyze this anime and generate 5 EXPLOSIVE, VIRAL YouTube Short Topic Titles in ENGLISH that will:
1. Drive high click-through rate (CTR) and initial 3-second retention.
2. Spark massive comment section debates.
3. Deliver high lore value to convince viewers to SUBSCRIBE immediately.

Return STRICTLY a JSON array of 5 strings:
[
  "Topic 1 Title...",
  "Topic 2 Title...",
  "Topic 3 Title...",
  "Topic 4 Title...",
  "Topic 5 Title..."
]"""
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=12)
            if r.status_code == 200:
                raw_txt = r.json()['candidates'][0]['content']['parts'][0]['text']
                topics = json.loads(clean_json_text(raw_txt))
                if isinstance(topics, list) and len(topics) >= 5:
                    print(f"   ✅ [ANILIST AI '{model}'] Đã tạo 5 Chủ đề Viral xuất sắc!", flush=True)
                    return topics[:5]
        except Exception as e:
            print(f"⚠️ Thử Gemini Suggestion {model}: {e}", flush=True)
            
    print("⚠️ API Key chưa hợp lệ hoặc bị lỗi Status 401! Đang nạp 5 chủ đề mẫu mặc định...", flush=True)
    print("👉 Hãy dán Gemini API Key chuẩn từ https://aistudio.google.com/app/apikey vào ô 'Gemini Key:'!", flush=True)
    return [
        f"The Dark Secret Behind {anime_name} That 99% Of Fans Missed",
        f"Why {anime_name}'s Main Character Is Way Overpowered",
        f"The Most Shocking Plot Twist In {anime_name} History",
        f"Top 3 Hidden Facts About {anime_name} You Didn't Know",
        f"The True Power Scaling Secrets Of {anime_name}"
    ]



def load_conf_for_anime(anime_name):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    anime_dir.mkdir(parents=True, exist_ok=True)
    conf_path = anime_dir / "characters_config.json"
    if conf_path.exists():
        try:
            return json.loads(conf_path.read_text(encoding="utf-8"))
        except Exception: pass
    return {}

def save_conf_for_anime(anime_name, data):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    anime_dir.mkdir(parents=True, exist_ok=True)
    conf_path = anime_dir / "characters_config.json"
    conf_path.write_text(json.dumps(data, indent=4, ensure_ascii=False), encoding="utf-8")

def get_all_animes():
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    animes = []
    for item in BASE_LIBRARY_DIR.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            animes.append(item.name)
    if not animes:
        animes = ["Tensei_Slime"]
        save_conf_for_anime("Tensei_Slime", {
            "Rimuru_Tempest": "Rimuru Tempest",
            "Veldora_Tempest": "Veldora Tempest",
            "Milim_Nava": "Milim Nava",
            "Guy_Crimson": "Guy Crimson",
            "Diablo": "Diablo",
            "Benimaru": "Benimaru",
            "Shion": "Shion"
        })
    return sorted(animes)


# @title ⚙️ 2. Core Engine (Hỗ Trợ Tự Nhập Kịch Bản Tùy Chỉnh + AI Gemini Auto + Live Progress Bar %)
import warnings
warnings.filterwarnings('ignore')
import os, sys, time, json, cv2, numpy as np, hashlib, re, urllib.parse, asyncio, random, shutil, subprocess
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFont
from curl_cffi import requests as cffi_requests
from difflib import SequenceMatcher
import nest_asyncio
nest_asyncio.apply()
import whisper

try:
    from proglog import ProgressBarLogger
    class ColabMoviePyLogger(ProgressBarLogger):
        def __init__(self, pbar_widget=None, label_widget=None, start_pct=55, end_pct=95):
            super().__init__()
            self.pbar = pbar_widget
            self.label = label_widget
            self.start_pct = start_pct
            self.end_pct = end_pct

        def bars_callback(self, bar, attr, value, old_value=None):
            if bar == 't':
                total = self.bars[bar]['total']
                if total and total > 0:
                    pct = int(self.start_pct + (value / total) * (self.end_pct - self.start_pct))
                    if self.pbar: self.pbar.value = min(100, max(0, pct))
                    if self.label: self.label.value = f"<b>🎥 [5/5] Đang xuất Video MP4 Dọc: {pct}%</b> (Đã xuất {value}/{total} khung hình)"
except Exception:
    ColabMoviePyLogger = None

try:
    from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips, CompositeVideoClip
except Exception:
    from moviepy.video.io.ImageSequenceClip import ImageSequenceClip

TARGET_W, TARGET_H = 1080, 1920
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
def get_base_library_dir():
    drive_dir = Path('/content/drive/MyDrive/anime_library')
    local_dir = Path('/content/anime_library')
    if Path('/content/drive/MyDrive').exists():
        try:
            drive_dir.mkdir(parents=True, exist_ok=True)
            return drive_dir
        except Exception: pass
    local_dir.mkdir(parents=True, exist_ok=True)
    return local_dir

BASE_LIBRARY_DIR = get_base_library_dir()
SETTINGS_FILE = BASE_LIBRARY_DIR / "studio_settings.json"


def check_gpu():
    try:
        import subprocess
        output = subprocess.check_output('nvidia-smi', shell=True).decode('utf-8')
        if 'CUDA Version' in output:
            return True
    except: pass
    return False

WHISPER_MODEL = None

def get_whisper():
    global WHISPER_MODEL
    if WHISPER_MODEL is None:
        print("⏳ Đang nạp Whisper AI (tiny model) để bóc tách mốc thời gian từng từ...")
        WHISPER_MODEL = whisper.load_model("tiny")
    return WHISPER_MODEL


def search_bing_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.bing.com/images/search?q={query_clean}&adlt=strict"
    cands = []
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            import re
            for match in re.findall(r'murl&quot;:&quot;(.*?)&quot;', r.text):
                ml = match.lower()
                if not any(x in ml for x in ['cosplay', 'figure', '3d', 'real', 'statue', 'toy', 'tiktok', 'youtube']):
                    cands.append(match)
    except Exception as e:
        print(f"Lỗi Bing Images: {e}")
    seen = set()
    unique = [u for u in cands if not (u in seen or seen.add(u))]
    return unique[:limit]

def search_google_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.google.com/search?q={query_clean}&tbm=isch"
    cands = []
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            import re
            matches = re.findall(r'\["(https://[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]', r.text)
            for m in matches:
                ml = m.lower()
                if not any(x in ml for x in ['cosplay', 'figure', '3d', 'real', 'statue', 'toy', 'tiktok', 'youtube']):
                    cands.append(m)
    except Exception as e:
        print(f"Lỗi Google Images: {e}")
    seen = set()
    unique = [u for u in cands if not (u in seen or seen.add(u))]
    return unique[:limit]

def search_pinterest_gifs(query, limit=50):
    query_clean = urllib.parse.quote(query + " gif")
    search_url = f"https://www.pinterest.com/search/pins/?q={query_clean}"
    session = cffi_requests.Session()
    urls = []
    bookmarks = []
    try:
        r1 = session.get(search_url, impersonate="chrome124")
        csrf_token = session.cookies.get("csrftoken") or "123456"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrf_token,
            "X-Pinterest-AppState": "active",
            "X-Pinterest-PWS-Handler": "www/search/pins.js",
            "Referer": search_url,
        }
        for page in range(5):
            options = {"isPrefetch": False, "query": query + " gif", "scope": "pins", "no_fetch_context_on_resource": False}
            if bookmarks: options["bookmarks"] = bookmarks
            params = {"source_url": f"/search/pins/?q={query_clean}", "data": json.dumps({"options": options, "context": {}}), "_": str(int(time.time() * 1000))}
            api_url = "https://www.pinterest.com/resource/BaseSearchResource/get/"
            r2 = session.get(api_url, params=params, headers=headers, impersonate="chrome124")
            if r2.status_code == 200:
                res_resp = r2.json().get("resource_response", {})
                results = res_resp.get("data", {}).get("results", [])
                new_b = res_resp.get("bookmark")
                if new_b: bookmarks = [new_b]
                for pin in results:
                    images = pin.get("images", {})
                    orig = images.get("orig", {}).get("url") or images.get("736x", {}).get("url") or images.get("474x", {}).get("url")
                    if orig and orig not in urls and (orig.lower().endswith(".gif") or "originals" in orig):
                        urls.append(orig)
                if len(urls) >= limit or not new_b: break
            else: break
            time.sleep(1)
    except Exception as e:
        print(f"Lỗi Pinterest GIF: {e}")
    seen = set()
    return [u for u in urls if not (u in seen or seen.add(u))][:limit]

def search_bing_gifs(query, limit=50):
    query_clean = urllib.parse.quote(query + " anime gif")
    search_url = f"https://www.bing.com/images/search?q={query_clean}&qft=+filterui:photo-animatedgif"
    cands = []
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            import re
            for match in re.findall(r'murl&quot;:&quot;(.*?)&quot;', r.text):
                if match.lower().endswith('.gif'):
                    cands.append(match)
    except Exception as e:
        print(f"Lỗi Bing GIF: {e}")
    seen = set()
    return [u for u in cands if not (u in seen or seen.add(u))][:limit]

def search_pinterest_direct(query, limit=50):
    query_clean = urllib.parse.quote(query)
    search_url = f"https://www.pinterest.com/search/pins/?q={query_clean}"
    session = cffi_requests.Session()
    urls = []
    bookmarks = []
    try:
        r1 = session.get(search_url, impersonate="chrome124")
        csrf_token = session.cookies.get("csrftoken") or "123456"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrf_token,
            "X-Pinterest-AppState": "active",
            "X-Pinterest-PWS-Handler": "www/search/pins.js",
            "Referer": search_url,
        }
        for page in range(5):
            options = {"isPrefetch": False, "query": query, "scope": "pins", "no_fetch_context_on_resource": False}
            if bookmarks: options["bookmarks"] = bookmarks
            params = {"source_url": f"/search/pins/?q={query_clean}", "data": json.dumps({"options": options, "context": {}}), "_": str(int(time.time() * 1000))}
            api_url = "https://www.pinterest.com/resource/BaseSearchResource/get/"
            r2 = session.get(api_url, params=params, headers=headers, impersonate="chrome124")
            if r2.status_code == 200:
                res_resp = r2.json().get("resource_response", {})
                results = res_resp.get("data", {}).get("results", [])
                new_b = res_resp.get("bookmark")
                if new_b: bookmarks = [new_b]
                for pin in results:
                    images = pin.get("images", {})
                    orig = images.get("orig", {}).get("url") or images.get("736x", {}).get("url") or images.get("474x", {}).get("url")
                    if orig and orig not in urls: urls.append(orig)
                if len(urls) >= limit or not new_b: break
            else: break
            time.sleep(1)
    except Exception as e:
        print(f"Lỗi kết nối Pinterest Web: {e}")
    seen = set()
    unique = [u for u in urls if not (u in seen or seen.add(u))]
    return unique[:limit]

def resize_crop_save(media_data, out_path):
    tmp = out_path.parent / f"_tmp_{out_path.name}"
    tmp.write_bytes(media_data)
    try:
        img = Image.open(tmp).convert('RGB')
        w, h = img.size
        ratio = TARGET_W / TARGET_H
        if w/h > ratio: nh, nw = TARGET_H, int(w * (TARGET_H / h))
        else: nw, nh = TARGET_W, int(h * (TARGET_W / w))
        img = img.resize((nw, nh), Image.LANCZOS)
        l, t = (nw - TARGET_W) // 2, (nh - TARGET_H) // 2
        img.crop((l, t, l + TARGET_W, t + TARGET_H)).save(out_path, 'JPEG', quality=92)
        tmp.unlink(missing_ok=True)
        return True
    except Exception:
        tmp.unlink(missing_ok=True)
        return False

def build_library(char_key, anime_name, base_dir, target=50, source='pinterest', media_type='image', query_aliases=None):
    char_dir = base_dir / char_key
    char_dir.mkdir(parents=True, exist_ok=True)
    if media_type == 'gif':
        save_dir = char_dir / "gif"
        save_dir.mkdir(parents=True, exist_ok=True)
        existing = list(save_dir.glob("*.gif")) + list(save_dir.glob("*.GIF")) + list(char_dir.glob("*.gif")) + list(char_dir.glob("*.GIF"))
        ext_str = "file GIF ĐỘNG (thư mục /gif)"
    else:
        save_dir = char_dir
        existing = list(save_dir.glob("*.jpg")) + list(save_dir.glob("*.png")) + list(save_dir.glob("*.jpeg")) + list(save_dir.glob("*.webp"))
        ext_str = "ảnh tĩnh"

    if len(existing) >= target:
        print(f"  ✅ [{char_key}]: Đã đủ {len(existing)}/{target} {ext_str} yêu cầu!", flush=True)
        return
    used_hashes = {hashlib.md5(f.read_bytes()).hexdigest() for f in existing if f.exists()}
    
    # Hỗ trợ cào đa dạng từ khóa nếu config dạng Danh Sách ["Rimuru Tempest", "Rimuru Demon Lord"] hoặc Chuỗi
    queries = []
    if isinstance(query_aliases, list) and query_aliases:
        queries = [f"{q.strip()} {anime_name.replace('_', ' ')}" for q in query_aliases if q.strip()]
    elif isinstance(query_aliases, str) and query_aliases.strip():
        queries = [f"{query_aliases.strip()} {anime_name.replace('_', ' ')}"]
    else:
        queries = [f"{char_key.replace('_', ' ')} {anime_name.replace('_', ' ')}"]

    print(f"🔎 Đang cào {ext_str} ({source.upper()}) cho '{char_key}' với {len(queries)} từ khóa tìm kiếm (Hiện có: {len(existing)}/{target})...", flush=True)

    urls = []
    for q in queries:
        if len(urls) >= target * 3: break
        if media_type == 'gif':
            new_urls = search_bing_gifs(q, limit=target * 3) if source == 'bing' else search_pinterest_gifs(q, limit=target * 3)
        else:
            new_urls = search_bing_direct(q, limit=target * 2) if source == 'bing' else search_google_direct(q, limit=target * 2) if source == 'google' else search_pinterest_direct(q, limit=target * 2)
        for u in new_urls:
            if u not in urls: urls.append(u)

    saved_count = len(existing)
    for url in urls:
        if saved_count >= target: break
        try:
            r = requests.get(url, headers=HEADERS, timeout=12)
            if r.status_code != 200 or len(r.content) < 8000: continue
            h = hashlib.md5(r.content).hexdigest()
            if h in used_hashes: continue

            if media_type == 'gif':
                out_file = save_dir / f"{char_key}_gif_{saved_count+1:02d}.gif"
                out_file.write_bytes(r.content)
                try:
                    img = Image.open(out_file)
                    n_frames = getattr(img, 'n_frames', 1)
                    is_anim = getattr(img, 'is_animated', False)
                    # LỌC BỎ ẢNH TĨNH GIẢ NẠP ĐUÔI .GIF (Chỉ nhận GIF thực sự có chuyển động > 1 khung hình!)
                    if n_frames <= 1 or not is_anim:
                        out_file.unlink(missing_ok=True)
                        continue
                    used_hashes.add(h)
                    saved_count += 1
                    print(f"    🎬 [{char_key}] GIF ĐỘNG #{saved_count:02d}: Đã lưu GIF thực sự có chuyển động ({n_frames} khung hình) vào thư mục /gif!", flush=True)
                except Exception:
                    out_file.unlink(missing_ok=True)
            else:
                out_file = save_dir / f"{char_key}_{saved_count+1:02d}.jpg"
                if resize_crop_save(r.content, out_file):
                    used_hashes.add(h)
                    saved_count += 1
                    print(f"    🖼️ [{char_key}] Ảnh #{saved_count:02d}: Đã lưu ảnh ({source})!", flush=True)
        except Exception: continue
    print(f"  🎉 HOÀN THÀNH [{char_key}]: {saved_count}/{target} {ext_str}!", flush=True)

def run_fetch(anime_name, char_list=None, single_char=None, target_per_char=50, source='pinterest', media_type='image'):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    conf_path = anime_dir / "characters_config.json"
    if not conf_path.exists():
        print(f"LỖI: Chưa có file characters_config.json cho '{anime_name}'!", flush=True)
        return
    try: char_dict = json.loads(conf_path.read_text(encoding="utf-8"))
    except Exception as e: print(f"LỖI đọc config: {e}", flush=True); return
    
    target_chars = [single_char] if single_char else list(char_list) if char_list else list(char_dict.keys())
    type_str = "GIF ĐỘNG 🎬" if media_type == 'gif' else "ẢNH TĨNH 🖼️"
    print(f"\n{'='*50}\n🚀 TẢI {type_str} ({source.upper()}) CHO {len(target_chars)} NV TRONG: {anime_name} (Chỉ tiêu: {target_per_char} file/NV)\n{'='*50}", flush=True)
    for char_key in target_chars:
        query_aliases = char_dict.get(char_key)
        build_library(char_key, anime_name, anime_dir, target=target_per_char, source=source, media_type=media_type, query_aliases=query_aliases)

def parse_custom_script_into_scenes(script_text, available_chars):
    words = script_text.strip().split()
    total_words = len(words)
    scenes = []
    chunk_size = max(1, total_words // 30)
    for i in range(30):
        st_idx = i * chunk_size
        et_idx = (i + 1) * chunk_size if i < 29 else total_words
        snip = " ".join(words[st_idx:et_idx])
        if not snip:
            snip = f"Scene {i+1}"
        chosen_char = available_chars[0] if available_chars else ""
        for char_key in available_chars:
            char_clean = char_key.replace("_", " ").lower()
            if char_clean in snip.lower():
                chosen_char = char_key
                break
        scenes.append({
            "scene_index": i + 1,
            "text_snippet": snip,
            "character_key": chosen_char
        })
    return scenes, " ".join(words)

def clean_json_text(text):
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def generate_script_gemini(topic, anime_name, available_chars, api_key, hook_style="Shocking Secret", ending_style="Viral Comment Question"):
    models = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemma-4-31b-it"]
    chars_str = ", ".join(available_chars) if available_chars else anime_name
    
    hook_prompts = {
        "Shocking Secret": "Start with an explosive, shocking secret hook that immediately grabs attention (e.g., 'Did you know the dark truth behind... that 99% of fans missed?').",
        "Power Scaling": "Start with a mind-blowing power scaling hook about how insanely broken this ability/character is.",
        "Controversial Take": "Start with a controversial, debate-triggering take that makes viewers want to comment immediately.",
        "Mysterious Twist": "Start with a mysterious question that promises a crazy plot twist."
    }
    
    ending_prompts = {
        "Viral Comment Question": "End with a compelling question asking viewers for their opinion to drive hundreds of comments (crucial for YouTube algorithm boosting!).",
        "Seamless Loop": "End with a cliffhanger phrase that seamlessly loops back to the beginning of the video.",
        "Deep Lore Conclusion": "End with a powerful, epic summary statement about the character's legacy."
    }
    
    selected_hook_instruction = hook_prompts.get(hook_style, hook_prompts["Shocking Secret"])
    selected_ending_instruction = ending_prompts.get(ending_style, ending_prompts["Viral Comment Question"])

    prompt = f"""You are a YouTube Shorts Master Producer. Write a viral, 100% original narrative script in ENGLISH about '{topic}' for anime '{anime_name}'.

CRITICAL MANDATE:
- Script language MUST BE 100% ENGLISH!
- MUST avoid generic Wikipedia summaries to ensure 100% YOUTUBE MONETIZATION COMPLIANCE & ORIGINAL CONTENT.
- Use high-retention storytelling, fast pacing, and emotional impact.

HOOK MANDATE:
{selected_hook_instruction}

ENDING MANDATE:
{selected_ending_instruction}

Available character keys for image mapping: [{chars_str}]

SCRIPT STRUCTURE & EXACT LENGTH:
1. Exact total word count: STRICTLY 175 to 185 English words (Guarantees final video is EXACTLY 52 to 58 seconds, perfectly under YouTube Shorts 60s limit).
2. Divide into 14 to 16 scenes (~3 to 3.5 seconds per scene).
3. Assign the most relevant 'character_key' from [{chars_str}] to EACH scene.

Return STRICTLY valid JSON:
{{
  "script": "Full narrative script text in English...",
  "tts_script": "Full voiceover text in English...",
  "scenes": [
    {{
      "scene_index": 1,
      "text_snippet": "English spoken text in this ~3s scene",
      "character_key": "Character_Name_Key"
    }}
  ]
}}"""
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=30)
            if r.status_code == 200:
                raw_txt = r.json()['candidates'][0]['content']['parts'][0]['text']
                data = json.loads(clean_json_text(raw_txt))
                print(f"   ✅ Đã tạo kịch bản VIRAL ({hook_style} + {ending_style}) thành công từ Gemini model '{model}'!", flush=True)
                return data
            else:
                print(f"⚠️ Thử model {model} (Status {r.status_code})...", flush=True)
        except Exception as e:
            print(f"⚠️ Lỗi model {model}: {e}", flush=True)
    return None


def pick_unique_scene_images(scenes, anime_name):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    char_images_map = {}
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                imgs = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp")) + list(cdir.glob("*.gif")) + list(cdir.glob("*.GIF"))
                random.shuffle(imgs)
                char_images_map[cdir.name] = imgs
            
    used_images = set()
    all_anime_imgs = [img for imgs in char_images_map.values() for img in imgs]
    random.shuffle(all_anime_imgs)
    
    selected_timeline = []
    for sc in scenes:
        s_idx = sc.get('scene_index', len(selected_timeline)+1)
        ckey = sc.get('character_key', '')
        snippet = sc.get('text_snippet', '')
        chosen_img = None
        
        if ckey in char_images_map:
            for img in char_images_map[ckey]:
                if str(img) not in used_images:
                    chosen_img = img
                    break
        
        if not chosen_img:
            for img in all_anime_imgs:
                if str(img) not in used_images:
                    chosen_img = img
                    break
                    
        if not chosen_img and all_anime_imgs:
            chosen_img = random.choice(all_anime_imgs)
            
        if chosen_img:
            used_images.add(str(chosen_img))
            selected_timeline.append({
                "scene": s_idx,
                "character": ckey,
                "text": snippet,
                "image": chosen_img.name,
                "image_path": str(chosen_img)
            })
    return selected_timeline

async def _edge_tts_save(text, voice, out_mp3):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate="+10%")
    await communicate.save(str(out_mp3))

def generate_tts_robust(text, voice, out_mp3):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(_edge_tts_save(text, voice, out_mp3))
            for _ in range(30):
                if out_mp3.exists() and out_mp3.stat().st_size > 1000:
                    return True
                time.sleep(0.5)
        else:
            loop.run_until_complete(_edge_tts_save(text, voice, out_mp3))
            return True
    except Exception:
        pass
    
    txt_tmp = out_mp3.parent / "script_tts_tmp.txt"
    txt_tmp.write_text(text, encoding="utf-8")
    cmd = f'edge-tts --file "{txt_tmp}" --voice "{voice}" --rate="+10%" --write-media "{out_mp3}"'
    os.system(cmd)
    txt_tmp.unlink(missing_ok=True)
    return out_mp3.exists() and out_mp3.stat().st_size > 1000


def refine_subtitles_gemini(word_chunks, script_text, api_key):
    if not api_key: return word_chunks
    print("✨ Gọi Gemini lần 2 để chuốt chuẩn Tên Riêng (Capitalization) trong phụ đề...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    
    prompt = f"""Original Script with proper nouns:
{script_text}

Here is a list of subtitle chunks generated by Whisper:
{json.dumps([c['text'] for c in word_chunks], ensure_ascii=False)}

Your task is to fix the capitalization and punctuation of the subtitle chunks to perfectly match the Original Script. 
Return EXACTLY the same number of chunks in a valid JSON array of strings. DO NOT merge or split chunks.
[
  "First chunk fixed",
  "Second chunk fixed"
]"""
    try:
        r = requests.post(url, json={'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}, timeout=10)
        if r.status_code == 200:
            fixed_texts = json.loads(clean_json_text(r.json()['candidates'][0]['content']['parts'][0]['text']))
            if len(fixed_texts) == len(word_chunks):
                for i in range(len(word_chunks)):
                    word_chunks[i]['text'] = fixed_texts[i].upper()
                print("   ✅ Đã chuốt thành công Tên Riêng với Gemini!")
                return word_chunks
    except Exception as e:
        print(f"⚠️ Không thể chuốt phụ đề với Gemini: {e}")
    return word_chunks

def align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2):
    w_model = get_whisper()
    print("🎙️ Whisper AI đang bóc tách mốc thời gian âm thanh từng từ...", flush=True)
    res = w_model.transcribe(str(audio_path), word_timestamps=True, language="en")
    
    whisper_words = []
    for segment in res.get("segments", []):
        for w_info in segment.get("words", []):
            w_str = w_info["word"].strip()
            st, et = w_info["start"], w_info["end"]
            if w_str and len(re.sub(r'[^a-zA-Z0-9]', '', w_str)) > 0:
                whisper_words.append({"word": w_str.upper(), "start": st, "end": et})
                
    if not whisper_words:
        ref_w = script_text.split()
        total_d = 45.0
        dur_w = total_d / max(1, len(ref_w))
        whisper_words = [{"word": w.upper(), "start": i*dur_w, "end": (i+1)*dur_w} for i, w in enumerate(ref_w)]

    chunks = []
    curr_words, curr_st, curr_et = [], None, None
    for idx, item in enumerate(whisper_words):
        if not curr_words: curr_st = item['start']
        curr_words.append(item['word'])
        curr_et = item['end']
        
        is_last = (idx == len(whisper_words) - 1)
        pause_next = False
        if not is_last and (whisper_words[idx+1]['start'] - item['end']) > 0.35:
            pause_next = True
                
        if len(curr_words) >= max_words_per_chunk or pause_next or is_last:
            chunks.append({"text": " ".join(curr_words), "start": curr_st, "end": curr_et})
            curr_words, curr_st, curr_et = [], None, None
            
    for i in range(len(chunks) - 1):
        gap = chunks[i+1]['start'] - chunks[i]['end']
        if 0 < gap < 0.25: chunks[i]['end'] = chunks[i+1]['start']
            
    return chunks, whisper_words

def build_semantic_timeline(all_words, script_text, anime_name, topic, total_duration, api_key, target_images=30):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    char_static_map = {}
    char_gif_map = {}

    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                statics = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp"))
                gifs = list(cdir.glob("*.gif")) + list(cdir.glob("*.GIF"))
                gif_subdir = cdir / "gif"
                if gif_subdir.exists():
                    gifs += list(gif_subdir.glob("*.gif")) + list(gif_subdir.glob("*.GIF"))

                random.shuffle(statics)
                random.shuffle(gifs)
                if statics: char_static_map[cdir.name] = statics
                if gifs: char_gif_map[cdir.name] = gifs

    all_anime_statics = [img for imgs in char_static_map.values() for img in imgs]
    all_anime_gifs = [img for imgs in char_gif_map.values() for img in imgs]
    all_anime_imgs = all_anime_statics + all_anime_gifs
    random.shuffle(all_anime_statics)
    random.shuffle(all_anime_imgs)

    available_chars = list(set(list(char_static_map.keys()) + list(char_gif_map.keys())))

    # 1. Determine Main Subject Character (e.g. Rimuru_Tempest)
    main_subject_char = available_chars[0] if available_chars else "Rimuru_Tempest"
    topic_clean = topic.lower().replace("_", " ")
    for ckey in available_chars:
        ckey_clean = ckey.lower().replace("_", " ")
        if ckey_clean in topic_clean or any(part in topic_clean for part in ckey_clean.split()):
            main_subject_char = ckey
            break

    print(f"🎯 Nhân vật chủ đề chính của Video: [{main_subject_char}]", flush=True)

    interval_dur = total_duration / target_images
    timeline_segments = []
    used_statics_per_char = {c: [] for c in available_chars}
    used_gifs_per_char = {c: [] for c in available_chars}

    for i in range(target_images):
        st = i * interval_dur
        et = (i + 1) * interval_dur if i < target_images - 1 else total_duration

        words_in_interval = [w["word"].lower() for w in all_words if st <= w["start"] < et]
        interval_text = " ".join(words_in_interval)

        assigned_char = main_subject_char
        for ckey in available_chars:
            ckey_parts = ckey.lower().replace("_", " ").split()
            first_name = ckey_parts[0]
            if first_name in interval_text and len(first_name) >= 3:
                assigned_char = ckey
                break

        # TỰ ĐỘNG ƯU TIÊN GIF NẾU CÓ, NẾU RỖNG THÌ TỰ ĐỘNG CHUYỂN SANG ẢNH TĨNH 100% KHÔNG BAO GIỜ BỊ LỖI
        prefer_gif = (i % 2 == 1) or any(kw in interval_text.lower() for kw in ['skill', 'fight', 'power', 'attack', 'kill', 'demon', 'slash', 'blast', 'magic', 'true', 'ultimate'])

        chosen_img = None
        if prefer_gif and assigned_char in char_gif_map:
            gif_pool = char_gif_map[assigned_char]
            used = used_gifs_per_char.get(assigned_char, [])
            avail = [g for g in gif_pool if g not in used]
            if not avail:
                used_gifs_per_char[assigned_char] = []
                avail = gif_pool
            if avail:
                chosen_img = random.choice(avail)
                used_gifs_per_char[assigned_char].append(chosen_img)

        # Fallback tự động lấy ảnh tĩnh nếu không có GIF hoặc thư mục GIF rỗng
        if not chosen_img and assigned_char in char_static_map:
            static_pool = char_static_map[assigned_char]
            used = used_statics_per_char.get(assigned_char, [])
            avail = [s for s in static_pool if s not in used]
            if not avail:
                used_statics_per_char[assigned_char] = []
                avail = static_pool
            if avail:
                chosen_img = random.choice(avail)
                used_statics_per_char[assigned_char].append(chosen_img)

        # Ultimate fallback nếu thư mục ảnh tĩnh cũng rỗng
        if not chosen_img and all_anime_imgs:
            chosen_img = random.choice(all_anime_imgs)

        timeline_segments.append({
            "start": st,
            "end": et,
            "char": assigned_char,
            "snippet": interval_text,
            "image_path": str(chosen_img) if chosen_img else ""
        })

    return timeline_segments

def render_mp4_video_word_sync(timeline, script_text, audio_path, out_mp4_path, pbar_widget=None, label_widget=None, api_key=None):
    print("🚀 [PERFECT YELLOW SUBTITLE & MAIN CHARACTER ENGINE] Đồng bộ mốc từ Whisper & Phụ đề Vàng...", flush=True)
    
    audio_clip = AudioFileClip(str(audio_path))
    total_duration = audio_clip.duration
    audio_clip.close()
    
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_path, script_text, max_words_per_chunk=2)
    
    anime_name = out_mp4_path.parent.parent.name
    # Get topic from output filename or default
    topic = "Rimuru Tempest"
    dynamic_timeline = build_semantic_timeline(all_words, script_text, anime_name, topic, total_duration, api_key, target_images=30)
    print(f"🎬 Đã nạp {len(dynamic_timeline)} bức ảnh (Chủ đề chính + Khớp NV khi nhắc tên, 2.0s/ảnh)...", flush=True)
    
    fps = 30
    total_frames = int(total_duration * fps)
    
    temp_raw_avi = out_mp4_path.parent / f"_raw_{int(time.time())}.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(str(temp_raw_avi), fourcc, fps, (TARGET_W, TARGET_H))
    
    def get_pil_frame_at_time(image_path, t_rel):
        try:
            img = Image.open(image_path)
            if str(image_path).lower().endswith(".gif"):
                n_frames = getattr(img, 'n_frames', 1)
                dur = img.info.get('duration', 100) / 1000.0
                if dur <= 0: dur = 0.1
                total_gif_dur = max(0.1, n_frames * dur)
                f_idx = int((t_rel % total_gif_dur) / dur) % n_frames
                img.seek(f_idx)
            return img.convert("RGB")
        except Exception:
            return Image.new("RGB", (TARGET_W, TARGET_H), (0, 0, 0))

    loaded_imgs = []
    for idx, seg in enumerate(dynamic_timeline):
        p = Path(seg["image_path"])
        is_gif = p.name.lower().endswith(".gif")
        if not is_gif:
            try:
                pil_img = Image.open(p).convert("RGB")
                w, h = pil_img.size
                ratio = TARGET_W / TARGET_H
                if w/h > ratio: nh, nw = TARGET_H, int(w * (TARGET_H / h))
                else: nw, nh = TARGET_W, int(h * (TARGET_W / w))
                pil_img = pil_img.resize((nw, nh), Image.LANCZOS)
                l, t_crop = (nw - TARGET_W) // 2, (nh - TARGET_H) // 2
                pil_img = pil_img.crop((l, t_crop, l + TARGET_W, t_crop + TARGET_H))
                cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                loaded_imgs.append((seg["start"], seg["end"], cv_img, idx, p, False))
            except Exception:
                black = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
                loaded_imgs.append((seg["start"], seg["end"], black, idx, p, False))
        else:
            loaded_imgs.append((seg["start"], seg["end"], None, idx, p, True))

    # PRE-RENDER BRIGHT YELLOW SUBTITLES WITH CORRECT BGR CONVERSION
    sub_img_cache = {}
    for chunk in word_chunks:
        txt = chunk["text"]
        if txt not in sub_img_cache:
            overlay = np.zeros((TARGET_H, TARGET_W, 4), dtype=np.uint8)
            pil_ov = Image.fromarray(overlay, mode="RGBA")
            draw = ImageDraw.Draw(pil_ov)
            
            font = None
            font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", "C:\\Windows\\Fonts\\arialbd.ttf"]
            for fp in font_paths:
                if os.path.exists(fp):
                    try: font = ImageFont.truetype(fp, 75); break
                    except: pass
            if not font: font = ImageFont.load_default()
            
            txt_upper = txt.strip().upper()
            bbox = draw.textbbox((0, 0), txt_upper, font=font)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            if tw > (TARGET_W - 120):
                f_size = int(75 * (TARGET_W - 120) / tw)
                for fp in font_paths:
                    if os.path.exists(fp):
                        try: font = ImageFont.truetype(fp, f_size); break
                        except: pass
                bbox = draw.textbbox((0, 0), txt_upper, font=font)
                tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                
            x, y = (TARGET_W - tw) // 2, (TARGET_H - th) // 2
            stroke_w = 6
            # Draw thick black outline
            for dx in range(-stroke_w, stroke_w + 1):
                for dy in range(-stroke_w, stroke_w + 1):
                    if dx != 0 or dy != 0: draw.text((x + dx, y + dy), txt_upper, font=font, fill=(0, 0, 0, 255))
            # Draw BRIGHT YELLOW text (RGBA: 255, 255, 0, 255)
            draw.text((x, y), txt_upper, font=font, fill=(255, 255, 0, 255))
            
            # PROPER RGBA -> BGRA conversion for OpenCV
            bgra_np = cv2.cvtColor(np.array(pil_ov), cv2.COLOR_RGBA2BGRA)
            sub_img_cache[txt] = (bgra_np[:, :, :3], bgra_np[:, :, 3] / 255.0)

    fade_frames = 4
    print(f"🎬 C++ OpenCV đang ghi {total_frames} khung hình (Phụ đề Vàng rực rỡ & Khớp tuyệt đối)...", flush=True)

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        
        seg_idx = 0
        for st, et, _, idx in loaded_imgs:
            if st <= t <= et:
                seg_idx = idx
                break
                
        st, et, cv_img_curr, _ = loaded_imgs[seg_idx]
        seg_dur = max(0.1, et - st)
        progress = min(1.0, max(0.0, (t - st) / seg_dur))
        
        scale = (1.0 + 0.06 * progress) if (seg_idx % 2 == 0) else (1.06 - 0.06 * progress)
        
        zw, zh = int(TARGET_W * scale), int(TARGET_H * scale)
        img_zoomed = cv2.resize(cv_img_curr, (zw, zh), interpolation=cv2.INTER_LINEAR)
        zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
        frame_bg = img_zoomed[zt:zt+TARGET_H, zl:zl+TARGET_W]
        
        if seg_idx < len(loaded_imgs) - 1 and (et - t) < (fade_frames / fps):
            next_st, next_et, cv_img_next, _ = loaded_imgs[seg_idx + 1]
            alpha = (et - t) / (fade_frames / fps)
            frame_bg = cv2.addWeighted(frame_bg, alpha, cv_img_next, 1.0 - alpha, 0)
            
        active_sub_text = None
        for chunk in word_chunks:
            if chunk["start"] <= t <= chunk["end"]:
                active_sub_text = chunk["text"]
                break
                
        if active_sub_text and active_sub_text in sub_img_cache:
            txt_bgr, alpha_mask = sub_img_cache[active_sub_text]
            mask_3d = alpha_mask[:, :, None]
            frame_final = (frame_bg * (1.0 - mask_3d) + txt_bgr * mask_3d).astype(np.uint8)
        else:
            frame_final = frame_bg
            
        writer.write(frame_final)
        
    writer.release()
    print("⚡ FFmpeg đang muxing MP4 AAC (stream copy ~2s)...", flush=True)
    
    cmd = f'ffmpeg -y -i "{temp_raw_avi}" -i "{audio_path}" -c:v libx264 -preset ultrafast -c:a aac -shortest "{out_mp4_path}"'
    subprocess.run(cmd, shell=True)
    
    temp_raw_avi.unlink(missing_ok=True)


def generate_video_short(anime_name, topic, api_key, voice="en-US-ChristopherNeural", custom_script="", pbar_widget=None, label_widget=None):
    out_dir = BASE_LIBRARY_DIR / anime_name / "output_shorts"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    anime_dir = BASE_LIBRARY_DIR / anime_name
    conf_path = anime_dir / "characters_config.json"
    available_chars = list(json.loads(conf_path.read_text(encoding="utf-8")).keys()) if conf_path.exists() else []
    
    if custom_script and custom_script.strip():
        if label_widget: label_widget.value = "<b>📝 [1/5] 10%</b> — Đang nạp Kịch bản Tùy Chỉnh do bạn nhập..."
        if pbar_widget: pbar_widget.value = 10
        scenes, script_text = parse_custom_script_into_scenes(custom_script, available_chars)
    else:
        if label_widget: label_widget.value = "<b>🚀 [1/5] 5%</b> — AI Gemini đang viết kịch bản Tiếng Anh 30 phân cảnh..."
        if pbar_widget: pbar_widget.value = 5
        script_data = generate_script_gemini(topic, anime_name, available_chars, api_key, hook_style=hook_style, ending_style=ending_style)
        if not script_data or 'scenes' not in script_data:
            if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không thể tạo kịch bản Gemini. Kiểm tra lại API Key hoặc nhập kịch bản tùy chỉnh!</b>"
            return
        scenes = script_data['scenes']
        script_text = script_data.get('tts_script') or script_data.get('script', '')
    
    if label_widget: label_widget.value = f"<b>🖼️ [2/5] 20%</b> — Đang lựa chọn 30 bức ảnh nhân vật từ Drive..."
    if pbar_widget: pbar_widget.value = 20
    timeline = pick_unique_scene_images(scenes, anime_name)
    
    if label_widget: label_widget.value = "<b>🎙️ [3/5] 35%</b> — Đang tạo giọng đọc Edge-TTS Tiếng Anh (Tốc độ +15%)..."
    if pbar_widget: pbar_widget.value = 35
    audio_temp_path = out_dir / "_temp_audio.mp3"
    ok = generate_tts_robust(script_text, voice, audio_temp_path)
    if not ok:
        if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không tạo được giọng đọc TTS!</b>"
        return
        
    if label_widget: label_widget.value = "<b>🧠 [4/5] 45%</b> — Whisper AI đang bóc tách mốc phát âm từng từ..."
    if pbar_widget: pbar_widget.value = 45
    
    timestamp = int(time.time())
    out_mp4_path = out_dir / f"{anime_name}_Short_{timestamp}.mp4"
    render_mp4_video_word_sync(timeline, script_text, audio_temp_path, out_mp4_path, pbar_widget, label_widget, api_key)
