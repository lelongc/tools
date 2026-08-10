# @title 2. Khởi tạo Core Backend (Chạy 1 lần sau khi cài thư viện)
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


def fetch_deep_lore(anime_name, api_key="", idea=""):
    try:
        print(f"🔎 [DEEP LORE RAG] Đang dò tìm 'Deep Lore' trên Web bằng Google Search (Gemini Grounding) cho Anime: {anime_name}...", flush=True)
        if not api_key: return ""
        
        prompt = f"Tìm kiếm thông tin trên web. Hãy ưu tiên truy xuất và kiểm chứng chéo từ các nguồn uy tín nhất, đặc biệt là TRANG WIKI/FANDOM CHÍNH THỨC của bộ anime '{anime_name}' và các bài phân tích chuyên sâu trên Reddit. Đưa ra 4-5 facts 'deep lore' (bí ẩn, thông tin Light Novel/Manga chưa lên anime, hoặc sự thật đen tối/thú vị) về '{anime_name}'."
        if idea:
            prompt += f" Vui lòng tập trung ĐÀO SÂU vào các thông tin xoay quanh chủ đề/ý tưởng này: '{idea}'."
        prompt += " Chỉ xuất ra văn bản tiếng Anh (để AI khác dễ đọc), dạng gạch đầu dòng chi tiết."
        
        body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "tools": [{"googleSearch": {}}]
        }
        
        import requests
        for model in ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-flash"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            try:
                r = requests.post(url, json=body, timeout=12)
                if r.status_code == 200:
                    text = r.json()['candidates'][0]['content']['parts'][0]['text']
                    return text
            except Exception:
                continue
                
        return ""
    except Exception as e:
        print(f"⚠️ [DEEP LORE RAG] Lỗi khi cào dữ liệu bằng Gemini Search: {e}", flush=True)
        return ""

def suggest_viral_topics(anime_name, api_key, idea=""):

    print(f"🔎 [ANILIST AI] Đang cào dữ liệu Lore & Tóm tắt cho Anime '{anime_name}'...", flush=True)
    lore_info = get_anilist_anime_info(anime_name)
    deep_lore = fetch_deep_lore(anime_name, api_key, idea)
    lore_info += f"\n\nDeep Lore (Reddit/Fandom):\n{deep_lore}\n"

    
    idea_prompt = f"The user provided a specific idea or direction for the topics: '{idea}'. Ensure all 10 topics revolve around this idea while remaining highly engaging." if idea else "Generate 10 random, explosive topics based on the lore."
    
    models = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro", "gemini-flash-latest"]
    prompt = f"""You are a top YouTube Shorts Strategist for Anime Channels with 10M subscribers.
Anime Name: {anime_name}

Anime Lore & Metadata from AniList:
{lore_info}

TASK:
Analyze this anime and generate 10 EXPLOSIVE, VIRAL YouTube Short Topic Titles in ENGLISH that will:
1. Drive high click-through rate (CTR) and initial 3-second retention.
2. Spark massive comment section debates.
3. Deliver high lore value to convince viewers to SUBSCRIBE immediately.

{idea_prompt}

Return STRICTLY a JSON array of 10 strings:
[
  "Topic 1 Title...",
  "Topic 2 Title...",
  ...
  "Topic 10 Title..."
]"""
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=12)
            if r.status_code == 200:
                raw_txt = r.json()['candidates'][0]['content']['parts'][0]['text']
                topics = json.loads(clean_json_text(raw_txt))
                if isinstance(topics, list) and len(topics) >= 1:
                    print(f"   ✅ [ANILIST AI '{model}'] Đã tạo {len(topics)} Chủ đề Viral xuất sắc!", flush=True)
                    return topics[:10]
        except Exception as e:
            print(f"⚠️ Thử Gemini Suggestion {model}: {e}", flush=True)
            
    print("⚠️ API Key chưa hợp lệ hoặc bị lỗi Status 401! Đang nạp chủ đề mẫu mặc định...", flush=True)
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
            import time
            self.start_time = time.time()

        def bars_callback(self, bar, attr, value, old_value=None):
            if bar == 't':
                total = self.bars[bar]['total']
                if total and total > 0:
                    pct = int(self.start_pct + (value / total) * (self.end_pct - self.start_pct))
                    import time
                    elapsed = time.time() - self.start_time
                    eta_str = ""
                    if value > 0 and elapsed > 0:
                        speed = value / elapsed
                        rem = (total - value) / speed
                        eta_str = f" | ⏳ ETA: {int(rem)}s"
                    if self.pbar: self.pbar.value = min(100, max(0, pct))
                    if self.label: self.label.value = f"<b>🎥 [5/5] Đang xuất Video: {pct}%</b> ({value}/{total} khung hình){eta_str}"
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
        device = "cuda" if check_gpu() else "cpu"
        WHISPER_MODEL = whisper.load_model("tiny", device=device)
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
        chosen_chars = []
        for char_key in available_chars:
            char_clean = char_key.replace("_", " ").lower()
            if char_clean in snip.lower():
                chosen_chars.append(char_key)
        
        if not chosen_chars:
            chosen_chars = [available_chars[0]] if available_chars else []
            
        scenes.append({
            "scene_index": i + 1,
            "text_snippet": snip,
            "character_keys": chosen_chars
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
    api_key = get_effective_gemini_key(api_key)
    # Ưu tiên gemini-3.1-flash-lite cho cả 2 công đoạn
    models = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro", "gemini-flash-latest"]
    chars_str = ", ".join(available_chars) if available_chars else anime_name
    
    hook_prompts = {
        "Shocking Secret": f"Start with an explosive 3-second hook about '{topic}' revealing a dark or hidden truth that 99% of fans missed. Make it sound natural and engaging. (Vibe: 'Everyone thinks X, but the real truth is terrifying...')",
        "Power Scaling": f"Start with a mind-blowing power scaling hook about '{topic}'. Challenge the viewer's perception of their strength. Make it sound conversational. (Vibe: 'You think X is strong? You have no idea how broken their true power is.')",
        "Controversial Take": f"Start with a highly controversial, debate-triggering hook about '{topic}' that forces viewers to disagree or comment immediately. Keep it natural and punchy.",
        "Mysterious Twist": f"Start with a mysterious hook about '{topic}' that sets up a mind-bending plot twist. Make the audience extremely curious but keep the dialogue natural."
    }
    
    ending_prompts = {
        "Viral Comment Question": f"End with a natural, engaging question asking for the viewer's opinion on '{topic}' to drive comments. Tie it back to the narrative seamlessly. Do NOT sound like a generic robot.",
        "Seamless Loop": f"End with a cliffhanger sentence about '{topic}' that seamlessly loops back into the opening hook, creating a perfect circle. It must sound like a natural continuation of the story's climax.",
        "Deep Lore Conclusion": f"End with an epic, thought-provoking summary statement about the legacy of '{topic}' in the world of {anime_name}. Make it a profound, natural conclusion to the script."
    }
    
    selected_hook = hook_prompts.get(hook_style, hook_prompts["Shocking Secret"])
    selected_ending = ending_prompts.get(ending_style, ending_prompts["Viral Comment Question"])
    
    deep_lore = fetch_deep_lore(anime_name, api_key, topic)


    # CÔNG ĐOẠN 1 (STAGE 1): Tập trung 100% AI vào việc viết kịch bản hấp dẫn (Không bị áp lực JSON)
    stage1_prompt = f"""You are a YouTube Shorts Master Storyteller. Write a viral, high-retention narrative script in 100% ENGLISH about '{topic}' for anime '{anime_name}'.

CRITICAL MANDATES:
- Script MUST BE 100% ENGLISH!
- MUST be 100% original narrative (no generic Wikipedia summaries).
- EXACT LENGTH: STRICTLY 195 to 215 English words (~52-59s voiceover at +10% speed).

1. HOOK DIRECTIVE:
{selected_hook}

2. ENDING DIRECTIVE:
{selected_ending}

3. NARRATIVE COHESION:
Incorporate these Deep Lore facts naturally if they fit:
{deep_lore}

4. FLOW:
The body of the script MUST logically connect the HOOK to the ENDING. The transition from the climax of the story into the ENDING must feel completely earned and natural. Do NOT make it sound like two unrelated ideas pasted together.

CRITICAL: The script MUST end with a 100% complete, standalone sentence! Ensure the ENTIRE script flows naturally like a real passionate YouTuber talking, avoiding robotic, repetitive, or forced phrasing. Use engaging, conversational English.

Output ONLY the plain text script in English."""

    script_text = ""
    model_used = models[0]

    print("  🔹 [CÔNG ĐOẠN 1/2] AI Gemini đang viết câu chuyện Viral Tiếng Anh (200 từ)...", flush=True)
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        body1 = {'contents': [{'parts': [{'text': stage1_prompt}]}]}
        try:
            r1 = requests.post(url, json=body1, timeout=30)
            if r1.status_code == 200:
                raw1 = r1.json()['candidates'][0]['content']['parts'][0]['text'].strip()
                word_count = len(raw1.split())
                if word_count >= 180:
                    script_text = raw1
                    model_used = model
                    print(f"   ✅ [STAGE 1 '{model}'] Đã viết xong kịch bản hấp dẫn ({word_count} từ English)!", flush=True)
                    break

        except Exception as e:
            print(f"⚠️ Stage 1 lỗi {model}: {e}", flush=True)

    if not script_text:
        print("❌ LỖI Stage 1: Không thể tạo văn bản kịch bản!", flush=True)
        return None

    # CÔNG ĐOẠN 2 (STAGE 2): Chia kịch bản đã viết thành các phân cảnh vừa vặn ~2.0s & Gán nhân vật chuẩn xác
    stage2_prompt = f"""Here is an English YouTube Shorts script about '{topic}':
"{script_text}"

TASK:
1. Divide this script into sequential narrative scenes based ONLY on full sentences or clauses ending in punctuation (.,?!). NEVER cut a sentence in the middle!
2. For EACH scene, assign a list of the most relevant character_keys from available list: [{chars_str}].
If multiple characters are explicitly mentioned or relevant in that scene, assign all their character_keys in a JSON array. If only one is relevant, assign a JSON array with one character_key. If none, assign ['{available_chars[0] if available_chars else "Rimuru_Tempest"}'].
*IMPORTANT*: Use your knowledge of the {anime_name} anime and its lore to resolve any aliases, titles, nicknames, and color names to the correct character_key (e.g. if the script mentions a title or an alternate name, map it to the character's real name from the available list).

CRITICAL INSTRUCTION:
- You MUST cover 100% of the original script. Do NOT shorten, summarize, paraphrase, or omit any sentences or words!
- The sequential concatenation of all "text_snippet" fields MUST perfectly equal the original script string. Do NOT alter any words, do NOT replace aliases with real names inside the text, and do NOT change the punctuation!
- DO NOT worry about scene length. A scene can be as long as a full sentence or two if it's about the same character(s).

Return STRICTLY valid JSON:
{{
  "scenes": [
    {{
      "scene_index": 1,
      "text_snippet": "exact spoken text in scene 1...",
      "character_keys": ["Character_Name_Key_1", "Character_Name_Key_2"]
    }}
  ]
}}"""
    body2 = {'contents': [{'parts': [{'text': stage2_prompt}]}], 'generationConfig': {'responseMimeType': 'application/json', 'maxOutputTokens': 2048}}

    print("  🔹 [CÔNG ĐOẠN 2/2] AI Gemini đang bóc tách phân cảnh JSON (~2s/cảnh) & Gán nhân vật chuẩn xác...", flush=True)
    for model in [model_used] + models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r2 = requests.post(url, json=body2, timeout=30)
            if r2.status_code == 200:
                raw2 = r2.json()['candidates'][0]['content']['parts'][0]['text']
                data2 = json.loads(clean_json_text(raw2))
                if data2.get('scenes') and isinstance(data2['scenes'], list):
                    clean_snippets = [sc['text_snippet'].strip() for sc in data2['scenes'] if sc.get('text_snippet')]
                    full_tts = " ".join(clean_snippets)
                    data2['tts_script'] = full_tts
                    data2['script'] = full_tts
                    print(f"   ✅ [STAGE 2 '{model}'] Đã phân chia {len(data2['scenes'])} phân cảnh & gán nhân vật chuẩn xác 100%!", flush=True)
                    return data2
        except Exception as e:
            print(f"⚠️ Stage 2 lỗi {model}: {e}", flush=True)

    # Dự phòng nếu Stage 2 JSON bị lỗi mạng
    fallback_scenes, full_tts = parse_custom_script_into_scenes(script_text, available_chars)
    return {
        "script": full_tts,
        "tts_script": full_tts,
        "scenes": fallback_scenes
    }


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
    # Ensure old file is deleted to avoid reusing stale audio
    if out_mp3.exists():
        try:
            out_mp3.unlink()
        except Exception:
            pass
            
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(_edge_tts_save(text, voice, out_mp3))
            for _ in range(60):
                if out_mp3.exists() and out_mp3.stat().st_size > 1000:
                    return True
                time.sleep(0.5)
        else:
            loop.run_until_complete(_edge_tts_save(text, voice, out_mp3))
            return True
    except Exception:
        pass
    
    # Fallback to CLI edge-tts
    if out_mp3.exists():
        try: out_mp3.unlink()
        except: pass
    txt_tmp = out_mp3.parent / "script_tts_tmp.txt"
    txt_tmp.write_text(text, encoding="utf-8")
    cmd = f'edge-tts --file "{txt_tmp}" --voice "{voice}" --rate="+10%" --write-media "{out_mp3}"'
    os.system(cmd)
    txt_tmp.unlink(missing_ok=True)
    return out_mp3.exists() and out_mp3.stat().st_size > 1000



def refine_subtitles_gemini(word_chunks, script_text, api_key):
    if not api_key: return word_chunks
    print("✨ Gọi Gemini lần 2 để chuốt chuẩn Tên Riêng (Capitalization) trong phụ đề...")
    
    models = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro", "gemini-flash-latest"]
    
    prompt = f"""Original Script with proper nouns:
{script_text}

Here is a list of subtitle chunks generated by Whisper:
{json.dumps([c['text'] for c in word_chunks], ensure_ascii=False)}

Your task is to fix the capitalization, spelling mistakes, and proper nouns of the subtitle chunks to perfectly match the Original Script.
Specifically, correct names like 'Romuru' or 'Ramuru' to 'Rimuru'.
Return EXACTLY the same number of chunks in a valid JSON array of strings. DO NOT merge or split chunks.
[
  "First chunk fixed",
  "Second chunk fixed"
]"""

    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=12)
            if r.status_code == 200:
                fixed_texts = json.loads(clean_json_text(r.json()['candidates'][0]['content']['parts'][0]['text']))
                if len(fixed_texts) == len(word_chunks):
                    for i in range(len(word_chunks)):
                        word_chunks[i]['text'] = fixed_texts[i].upper()
                    print("   ✅ Đã chuốt thành công Tên Riêng với Gemini!")
                    return word_chunks
        except Exception as e:
            print(f"⚠️ Thử chuốt phụ đề {model} thất bại: {e}")
            
    print("⚠️ Tất cả các model chuốt phụ đề đều thất bại, sử dụng fallback.")
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

def build_semantic_timeline(all_words, script_text, anime_name, topic, total_duration, api_key, scenes=None, target_images=30):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    char_static_map = {}
    char_gif_map = {}

    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                statics = list(cdir.rglob("*.jpg")) + list(cdir.rglob("*.png")) + list(cdir.rglob("*.jpeg")) + list(cdir.rglob("*.webp")) + list(cdir.rglob("*.JPG")) + list(cdir.rglob("*.PNG")) + list(cdir.rglob("*.JPEG")) + list(cdir.rglob("*.WEBP"))
                gifs = list(cdir.rglob("*.gif")) + list(cdir.rglob("*.GIF"))

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

    print(f"🎯 AI phân bổ nhân vật chủ đề chính của Video: [{main_subject_char}]", flush=True)

    interval_dur = total_duration / target_images
    timeline_segments = []
    used_statics_per_char = {c: [] for c in available_chars}
    used_gifs_per_char = {c: [] for c in available_chars}

    # Map scenes directly from AI Gemini if available!
    scene_char_map = []
    if scenes and isinstance(scenes, list):
        for sc in scenes:
            sc_key = sc.get('character_key', '').strip()
            if sc_key and sc_key in available_chars:
                scene_char_map.append(sc_key)
            else:
                # Match against available_chars with strict regex word boundaries
                matched = None
                snip_lower = sc.get('text_snippet', '').lower()
                for ckey in available_chars:
                    first_name = ckey.lower().replace("_", " ").split()[0]
                    if len(first_name) >= 3 and re.search(r'\b' + re.escape(first_name) + r'\b', snip_lower):
                        matched = ckey
                        break
                scene_char_map.append(matched or main_subject_char)

    for i in range(target_images):
        st = i * interval_dur
        et = (i + 1) * interval_dur if i < target_images - 1 else total_duration

        words_in_interval = [w["word"].lower() for w in all_words if st <= w["start"] < et]
        interval_text = " ".join(words_in_interval)

        # Trọng yếu: Ưu tiên lấy trực tiếp nhân vật do AI Gemini phân bổ cho từng phân cảnh!
        assigned_char = None
        if scene_char_map:
            sc_idx = min(int((i / target_images) * len(scene_char_map)), len(scene_char_map) - 1)
            assigned_char = scene_char_map[sc_idx]

        if not assigned_char:
            assigned_char = main_subject_char
            for ckey in available_chars:
                first_name = ckey.lower().replace("_", " ").split()[0]
                # Sử dụng Regex \bword\b CHÍNH XÁC NGUYÊN TỪ (không bao giờ nhầm BRAIN thành RAIN hay ULTIMATE thành ULTIMA)
                if len(first_name) >= 3 and re.search(r'\b' + re.escape(first_name) + r'\b', interval_text):
                    assigned_char = ckey
                    break

        # TỰ ĐỘNG ƯU TIÊN GIF NẾU CÓ, NẾU RỖNG THÌ TỰ ĐỘNG CHUYỂN SANG ẢNH TĨNH 100% KHÔNG BAO GIỜ BỊ LỖI
        prefer_gif = (i % 2 == 1) or any(kw in interval_text for kw in ['skill', 'fight', 'power', 'attack', 'kill', 'demon', 'slash', 'blast', 'magic', 'true', 'ultimate'])

        chosen_img = None
        if prefer_gif and assigned_char in char_gif_map:
            gif_pool = char_gif_map[assigned_char]
            used = used_gifs_per_char.get(assigned_char, [])
            avail = [g for g in gif_pool if g not in used]
            if avail:
                chosen_img = random.choice(avail)
                if assigned_char not in used_gifs_per_char:
                    used_gifs_per_char[assigned_char] = []
                used_gifs_per_char[assigned_char].append(chosen_img)

        # Fallback tự động lấy ảnh tĩnh nếu không có GIF hoặc thư mục GIF rỗng
        if not chosen_img and assigned_char in char_static_map:
            static_pool = char_static_map[assigned_char]
            used = used_statics_per_char.get(assigned_char, [])
            avail = [s for s in static_pool if s not in used]
            if avail:
                chosen_img = random.choice(avail)
                if assigned_char not in used_statics_per_char:
                    used_statics_per_char[assigned_char] = []
                used_statics_per_char[assigned_char].append(chosen_img)

        # Ultimate fallback nếu thư mục ảnh tĩnh cũng rỗng hoặc cả 2 đã dùng hết thì reset cả 2 và random
        if not chosen_img:
            all_char_imgs = []
            if assigned_char in char_gif_map: all_char_imgs.extend(char_gif_map[assigned_char])
            if assigned_char in char_static_map: all_char_imgs.extend(char_static_map[assigned_char])
            
            if all_char_imgs:
                used_gifs_per_char[assigned_char] = []
                used_statics_per_char[assigned_char] = []
                chosen_img = random.choice(all_char_imgs)
            elif all_anime_imgs:
                chosen_img = random.choice(all_anime_imgs)

        timeline_segments.append({
            "start": st,
            "end": et,
            "char": assigned_char,
            "snippet": interval_text,
            "image_path": str(chosen_img) if chosen_img else ""
        })

    return timeline_segments

def analyze_character_timeline_gemini(script_text, available_chars, api_key):
    api_key = get_effective_gemini_key(api_key)
    print("\n🧠 [AI DETECTOR] Đang phân tích kịch bản và quyết định phân bổ nhân vật cho từng phân cảnh...", flush=True)
    
    import re
    # Split script into logical segments by punctuation
    raw_segments = re.split(r'(?<=[.?!,])\s+', script_text.strip())
    segments = []
    current_seg = ""
    for seg in raw_segments:
        if not seg.strip(): continue
        if current_seg:
            current_seg += " " + seg.strip()
        else:
            current_seg = seg.strip()
            
        if len(current_seg.split()) >= 5 or re.search(r'[.?!]$', current_seg):
            segments.append(current_seg)
            current_seg = ""
    if current_seg:
        if segments:
            segments[-1] += " " + current_seg
        else:
            segments.append(current_seg)
        
    models = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro", "gemini-flash-latest"]
    chars_str = ", ".join(available_chars)
    main_subject_char = available_chars[0] if available_chars else "Rimuru_Tempest"
    
    prompt = f"""You are an Anime Video Editor. You have a list of available character image folders: [{chars_str}].
Here are the sequential script segments of the video:
{json.dumps(segments, indent=2)}

TASK:
For each segment in the list, select the most relevant character folders from the available list: [{chars_str}] that should be shown on screen.
- If multiple characters are mentioned or active in a segment, select all their exact folder names.
- If no specific character is active, select the main topic character.
- Ensure the folder names match EXACTLY the names in the list.
*IMPORTANT*: Use your knowledge of the {anime_name} anime and its lore to resolve any aliases, titles, nicknames, and color names to the correct character_key (e.g. if the script mentions a title or an alternate name, map it to the character's real name from the available list).

Return STRICTLY a JSON array of arrays of strings, where each inner array contains the folder names for the corresponding segment:
[
  ["Folder_For_Segment_1_A", "Folder_For_Segment_1_B"],
  ["Folder_For_Segment_2"],
  ...
]"""

    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}
    assigned_folders = []
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            r = requests.post(url, json=body, timeout=20)
            if r.status_code == 200:
                raw_txt = r.json()['candidates'][0]['content']['parts'][0]['text']
                assigned_folders = json.loads(clean_json_text(raw_txt))
                if isinstance(assigned_folders, list) and len(assigned_folders) > 0:
                    print(f"   ✅ [AI DETECTOR '{model}'] Đã phân bổ nhân vật thành công!", flush=True)
                    break
        except Exception as e:
            print(f"⚠️ Lỗi AI Detector {model}: {e}", flush=True)
            
    # Normalize list length to match segments
    while len(assigned_folders) < len(segments):
        assigned_folders.append([main_subject_char])
    assigned_folders = assigned_folders[:len(segments)]
    
    # Reconstruct scenes structure expected by caller
    scenes = []
    for idx, (seg, folders) in enumerate(zip(segments, assigned_folders)):
        # Validate that the folders returned are valid, otherwise fallback
        if isinstance(folders, str): folders = [folders]
        if not isinstance(folders, list): folders = [main_subject_char]
        
        final_folders = [f for f in folders if f in available_chars]
        if not final_folders: final_folders = [main_subject_char]
        
        scenes.append({
            "segment_index": idx + 1,
            "text_snippet": seg,
            "character_keys": final_folders
        })
        print(f"     🎬 Cảnh {idx+1}: {final_folders} -> \"{seg}\"", flush=True)
        
    return scenes

def build_fixed_two_second_timeline(scenes, anime_name, topic, total_duration, all_words=None):
    import random
    from pathlib import Path
    
    anime_dir = BASE_LIBRARY_DIR / anime_name
    available_chars = []
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                available_chars.append(cdir.name)
                
    main_subject_char = available_chars[0] if available_chars else "Rimuru_Tempest"
    
    char_static_map = {}
    char_gif_map = {}
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                statics = list(cdir.rglob("*.jpg")) + list(cdir.rglob("*.png")) + list(cdir.rglob("*.jpeg")) + list(cdir.rglob("*.webp")) + list(cdir.rglob("*.JPG")) + list(cdir.rglob("*.PNG")) + list(cdir.rglob("*.JPEG")) + list(cdir.rglob("*.WEBP"))
                gifs = list(cdir.rglob("*.gif")) + list(cdir.rglob("*.GIF"))

                random.shuffle(statics)
                random.shuffle(gifs)
                if statics: char_static_map[cdir.name] = statics
                if gifs: char_gif_map[cdir.name] = gifs

    all_anime_statics = [img for imgs in char_static_map.values() for img in imgs]
    all_anime_gifs = [img for imgs in char_gif_map.values() for img in imgs]
    all_anime_imgs = all_anime_statics + all_anime_gifs
    random.shuffle(all_anime_statics)
    random.shuffle(all_anime_imgs)

    used_statics_per_char = {c: [] for c in available_chars}
    used_gifs_per_char = {c: [] for c in available_chars}

    # Pre-calculate char boundaries for scenes
    total_chars = sum(max(1, len(sc.get("text_snippet", ""))) for sc in scenes)
    char_accum = 0
    for sc in scenes:
        sc["char_start"] = char_accum
        char_accum += max(1, len(sc.get("text_snippet", "")))
        sc["char_end"] = char_accum

    if all_words:
        total_word_chars = sum(max(1, len(w["word"])) for w in all_words)
        w_char_accum = 0
        for w in all_words:
            w["char_start"] = w_char_accum
            w_char_accum += max(1, len(w["word"]))
            w["char_end"] = w_char_accum
            
        for sc in scenes:
            target_start = sc["char_start"]
            target_end = sc["char_end"]
            
            sc_start_time = 0.0
            sc_end_time = total_duration
            
            if total_word_chars > 0 and total_chars > 0:
                ratio_start = target_start / total_chars
                w_target_start = ratio_start * total_word_chars
                for w in all_words:
                    if w["char_start"] >= w_target_start or w["char_end"] >= w_target_start:
                        sc_start_time = w["start"]
                        break
                        
                ratio_end = target_end / total_chars
                w_target_end = ratio_end * total_word_chars
                for w in reversed(all_words):
                    if w["char_end"] <= w_target_end or w["char_start"] <= w_target_end:
                        sc_end_time = w["end"]
                        break
            sc["start_time"] = sc_start_time
            sc["end_time"] = sc_end_time
    else:
        # Fallback if no words provided
        for i, sc in enumerate(scenes):
            sc["start_time"] = (i / len(scenes)) * total_duration
            sc["end_time"] = ((i + 1) / len(scenes)) * total_duration

    # Make strictly contiguous
    for i in range(len(scenes)):
        if i == 0:
            scenes[i]["start_time"] = 0.0
        else:
            scenes[i]["start_time"] = scenes[i-1]["end_time"]
            
        if i == len(scenes) - 1:
            scenes[i]["end_time"] = total_duration

    timeline_segments = []
    chunk_counter = 0

    for sc in scenes:
        st = sc["start_time"]
        et = sc["end_time"]
        dur = et - st
        if dur <= 0: dur = 0.1
        
        num_chunks = max(1, round(dur / 2.0))
        chunk_dur = dur / num_chunks
        
        char_keys = sc.get("character_keys", [])
        if isinstance(char_keys, str):
            char_keys = [char_keys]
        elif not char_keys:
            single_key = sc.get("character_key", sc.get("character_folder", "")).strip()
            char_keys = [single_key] if single_key else []
            
        valid_keys = []
        for k in char_keys:
            if not k or not isinstance(k, str): continue
            k_clean = k.strip()
            if k_clean in available_chars:
                if k_clean not in valid_keys: valid_keys.append(k_clean)
                continue
            # Match first name / alias
            k_first = k_clean.lower().replace("_", " ").split()[0]
            matched = None
            if len(k_first) >= 3:
                for ac in available_chars:
                    ac_first = ac.lower().replace("_", " ").split()[0]
                    if k_first == ac_first:
                        matched = ac
                        break
            if matched and matched not in valid_keys:
                valid_keys.append(matched)

        if not valid_keys:
            # Subnet text regex fallback
            snip_lower = sc.get("text_snippet", "").lower()
            for ac in available_chars:
                first_name = ac.lower().replace("_", " ").split()[0]
                if len(first_name) >= 3 and re.search(r'\b' + re.escape(first_name) + r'\b', snip_lower):
                    if ac not in valid_keys:
                        valid_keys.append(ac)
                        break

        if not valid_keys:
            valid_keys = [main_subject_char]
            
        snippet_text = sc.get("text_snippet", "").lower()
        prefer_gif_base = any(kw in snippet_text for kw in ['skill', 'fight', 'power', 'attack', 'kill', 'demon', 'slash', 'blast', 'magic', 'true', 'ultimate'])
        
        for c_i in range(num_chunks):
            c_st = st + c_i * chunk_dur
            c_et = st + (c_i + 1) * chunk_dur if c_i < num_chunks - 1 else et
            
            assigned_char = valid_keys[c_i % len(valid_keys)]
            prefer_gif = prefer_gif_base or (chunk_counter % 2 == 1)
            
            chosen_img = None
            if prefer_gif and assigned_char in char_gif_map:
                gif_pool = char_gif_map[assigned_char]
                used = used_gifs_per_char.get(assigned_char, [])
                avail = [g for g in gif_pool if g not in used]
                if avail:
                    chosen_img = random.choice(avail)
                    if assigned_char not in used_gifs_per_char:
                        used_gifs_per_char[assigned_char] = []
                    used_gifs_per_char[assigned_char].append(chosen_img)

            if not chosen_img and assigned_char in char_static_map:
                static_pool = char_static_map[assigned_char]
                used = used_statics_per_char.get(assigned_char, [])
                avail = [s for s in static_pool if s not in used]
                if avail:
                    chosen_img = random.choice(avail)
                    if assigned_char not in used_statics_per_char:
                        used_statics_per_char[assigned_char] = []
                    used_statics_per_char[assigned_char].append(chosen_img)

            # Fallback if both unused pools are empty: reset and recycle
            if not chosen_img:
                all_char_imgs = []
                if assigned_char in char_gif_map: all_char_imgs.extend(char_gif_map[assigned_char])
                if assigned_char in char_static_map: all_char_imgs.extend(char_static_map[assigned_char])
                
                if all_char_imgs:
                    # Reset memory since we ran out of unique images
                    used_gifs_per_char[assigned_char] = []
                    used_statics_per_char[assigned_char] = []
                    chosen_img = random.choice(all_char_imgs)
                elif all_anime_imgs:
                    chosen_img = random.choice(all_anime_imgs)

            timeline_segments.append({
                "start": c_st,
                "end": c_et,
                "char": assigned_char,
                "snippet": snippet_text,
                "image_path": str(chosen_img) if chosen_img else ""
            })
            
            img_name = Path(chosen_img).name if chosen_img else "None"
            print(f"     🎬 Khớp ảnh [{assigned_char}] ({img_name}) cho mốc {c_st:.2f}s -> {c_et:.2f}s: \"{snippet_text}\"", flush=True)
            chunk_counter += 1

    return timeline_segments

def render_mp4_video_word_sync(timeline, word_chunks, audio_path, out_mp4_path, pbar_widget=None, label_widget=None):
    import subprocess
    print("🚀 [BƯỚC 2] Đang dựng Video Short MP4 từ file Phụ Đề & Audio đã xuất (Đan Xen Ảnh Tỷ Lệ Đều & Phụ Đề Từ Vựng)...", flush=True)

    # Calculate audio duration
    try:
        from moviepy.editor import AudioFileClip
        audio_clip = AudioFileClip(str(audio_path))
        total_duration = audio_clip.duration
        audio_clip.close()
    except Exception:
        # Fallback to checking whisper word timestamps if moviepy fails to load audio duration
        total_duration = word_chunks[-1]["end"] if word_chunks else 45.0

    fps = 30
    total_frames = int(total_duration * fps)

    def blur_background_composite(cv_img):
        h, w, _ = cv_img.shape
        ratio = TARGET_W / TARGET_H
        if w / h > 0.82:  # Ảnh ngang hoặc gần vuông -> Cho phép Panning & Background mờ
            fw = int(TARGET_W * 1.35) # 1458 pixels để chừa không gian trượt ngang
            fh = max(1, int(fw * (h / w)))
            fg_resized = cv2.resize(cv_img, (fw, fh), interpolation=cv2.INTER_AREA)
            
            # Blurred Background size: fw x TARGET_H
            bw = max(fw, int(TARGET_H * (w / h)))
            bg_resized = cv2.resize(cv_img, (bw, TARGET_H), interpolation=cv2.INTER_LINEAR)
            bl = (bw - fw) // 2
            bg_cropped = bg_resized[:, bl:bl+fw]
            
            small = cv2.resize(bg_cropped, (fw // 10, TARGET_H // 10), interpolation=cv2.INTER_NEAREST)
            blurred_small = cv2.GaussianBlur(small, (15, 15), 0)
            bg_blurred = cv2.resize(blurred_small, (fw, TARGET_H), interpolation=cv2.INTER_LINEAR)
            
            y_start = (TARGET_H - fh) // 2
            if y_start >= 0:
                bg_blurred[y_start:y_start+fh, 0:fw] = fg_resized
            return bg_blurred
        else:
            # Ảnh dọc -> Crop bình thường
            if w/h > ratio: nh, nw = TARGET_H, int(w * (TARGET_H / h))
            else: nw, nh = TARGET_W, int(h * (TARGET_W / w))
            resized = cv2.resize(cv_img, (nw, nh), interpolation=cv2.INTER_LINEAR)
            l, t_crop = (nw - TARGET_W) // 2, (nh - TARGET_H) // 2
            return resized[t_crop:t_crop+TARGET_H, l:l+TARGET_W]

    # Pre-load and cache all unique images/GIFs used in the timeline to RAM (Optimized with OpenCV + Numpy slicing)
    cached_media = {}
    unique_paths = list(set(seg["image_path"] for seg in timeline if seg.get("image_path")))
    
    print(f"⚡ Đang nạp trước và resize {len(unique_paths)} ảnh/GIF vào RAM...", flush=True)
    start_cache_time = time.time()
    
    for p_str in unique_paths:
        p = Path(p_str)
        is_gif = p.name.lower().endswith(".gif")
        if not is_gif:
            try:
                cv_img = cv2.imread(p_str)
                if cv_img is None:
                    raise Exception("cv2.imread trả về None")
                cv_img = blur_background_composite(cv_img)
                
                # Nén JPEG byte lưu RAM
                _, enc = cv2.imencode('.jpg', cv_img, [cv2.IMWRITE_JPEG_QUALITY, 90])
                cached_media[p_str] = (False, enc.tobytes())
            except Exception as e:
                print(f"⚠️ Không thể nạp ảnh {p.name} qua OpenCV (dự phòng PIL): {e}", flush=True)
                try:
                    with Image.open(p) as pil_img:
                        pil_img = pil_img.convert("RGB")
                        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                        cv_img = blur_background_composite(cv_img)
                        _, enc = cv2.imencode('.jpg', cv_img, [cv2.IMWRITE_JPEG_QUALITY, 90])
                        cached_media[p_str] = (False, enc.tobytes())
                except Exception as e2:
                    print(f"⚠️ Lỗi hoàn toàn khi nạp ảnh {p.name}: {e2}", flush=True)
                    black = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
                    _, enc = cv2.imencode('.jpg', black, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    cached_media[p_str] = (False, enc.tobytes())
        else:
            try:
                gif_frames = []
                with Image.open(p) as img:
                    n_frames = getattr(img, 'n_frames', 1)
                    gif_dur = img.info.get('duration', 100) / 1000.0
                    if gif_dur <= 0: gif_dur = 0.1
                    
                    # Tối ưu hóa tuyệt đối RAM Colab: Chỉ nạp tối đa 25 khung hình dạng JPEG bytes
                    max_cache_frames = 25
                    step = 1
                    if n_frames > max_cache_frames:
                        step = max(1, n_frames // max_cache_frames)
                        gif_dur = gif_dur * step
                    
                    for f_idx in range(0, n_frames, step):
                        img.seek(f_idx)
                        frame_rgb = np.array(img.convert("RGB"))
                        frame_bgr = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)
                        frame_composited = blur_background_composite(frame_bgr)
                        
                        # Nén JPEG byte lưu RAM
                        _, enc = cv2.imencode('.jpg', frame_composited, [cv2.IMWRITE_JPEG_QUALITY, 90])
                        gif_frames.append(enc.tobytes())
                cached_media[p_str] = (True, gif_frames, gif_dur)
            except Exception as e:
                print(f"⚠️ Không thể nạp GIF {p.name}: {e}", flush=True)
                black = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
                _, enc = cv2.imencode('.jpg', black, [cv2.IMWRITE_JPEG_QUALITY, 80])
                cached_media[p_str] = (True, [enc.tobytes()], 0.1)
                
    print(f"   ✅ Đã nạp xong vào RAM (Mất {time.time() - start_cache_time:.2f}s)!", flush=True)

    active_idx = 0
    sub_patch_cache = {}
    
    # Load font once
    font = None
    font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", "C:\\Windows\\Fonts\\arialbd.ttf"]
    for fp in font_paths:
        if os.path.exists(fp):
            try: font = ImageFont.truetype(fp, 75); break
            except: pass
    if not font: font = ImageFont.load_default()

    # Pre-render small patches for subtitles (extremely low memory, total ~15-20MB for 100 texts)
    for chunk in word_chunks:
        txt = chunk["text"]
        if txt not in sub_patch_cache:
            txt_upper = txt.strip().upper()
            
            # Temporary canvas to measure bbox
            temp_img = Image.new("RGBA", (1080, 400))
            temp_draw = ImageDraw.Draw(temp_img)
            
            current_font = font
            try:
                bbox = temp_draw.textbbox((0, 0), txt_upper, font=font)
                tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                if tw > (TARGET_W - 120):
                    current_font = ImageFont.truetype(font.path, 55)
                    bbox = temp_draw.textbbox((0, 0), txt_upper, font=current_font)
                    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            except Exception:
                tw, th = len(txt_upper) * 35, 80
                bbox = (0, 0, tw, th)
                
            stroke_w = 6
            pw, ph = tw + stroke_w * 2 + 20, th + stroke_w * 2 + 20
            patch_img = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
            draw = ImageDraw.Draw(patch_img)
            
            x = stroke_w + 10 - bbox[0]
            y = stroke_w + 10 - bbox[1]
            for dx in range(-stroke_w, stroke_w + 1):
                for dy in range(-stroke_w, stroke_w + 1):
                    if dx != 0 or dy != 0:
                        draw.text((x + dx, y + dy), txt_upper, font=current_font, fill=(0, 0, 0, 255))
            draw.text((x, y), txt_upper, font=current_font, fill=(255, 255, 0, 255))
            
            patch_bgra = cv2.cvtColor(np.array(patch_img), cv2.COLOR_RGBA2BGRA)
            p_bgr = patch_bgra[:, :, :3]
            p_alpha = (patch_bgra[:, :, 3] / 255.0)[:, :, None]
            sub_patch_cache[txt] = (p_bgr, p_alpha, pw, ph)

    fade_frames = 4
    
    # Set up GPU or CPU ffmpeg pipeline
    use_gpu = check_gpu()
    v_codec = "h264_nvenc" if use_gpu else "libx264"
    preset = "p1" if use_gpu else "ultrafast"
    
    cmd = [
        'ffmpeg', '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-pix_fmt', 'bgr24',
        '-s', f'{TARGET_W}x{TARGET_H}',
        '-r', str(fps),
        '-i', '-',
        '-i', str(audio_path),
        '-c:v', v_codec,
        '-preset', preset,
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-shortest',
        str(out_mp4_path)
    ]
    
    print(f"🎬 Khởi tạo FFmpeg pipe (Sử dụng encoder: {v_codec}, preset: {preset})...", flush=True)
    try:
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    except Exception:
        cmd[cmd.index('-c:v') + 1] = 'libx264'
        cmd[cmd.index('-preset') + 1] = 'ultrafast'
        process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    fallback_triggered = False
    start_time = time.time()
    
    last_seg_idx = -1
    current_gif_decoded_frames = []
    current_decoded_static = None
    current_decoded_next_frame = None
    current_decoded_next_seg_idx = -1
    
    for f in range(total_frames):
        t = f / fps
        
        while active_idx < len(timeline) - 1 and t >= timeline[active_idx]["end"]:
            active_idx += 1
            
        seg = timeline[active_idx]
        p_str = seg["image_path"]
        
        # Avoid redundant imdecodes when switching segments
        if active_idx != last_seg_idx:
            current_decoded_static = None
            current_gif_decoded_frames = []
            
            media_info = cached_media.get(p_str)
            if media_info:
                is_gif = media_info[0]
                if is_gif:
                    # Decode all frames of this GIF once per segment
                    gif_frames_bytes = media_info[1]
                    for f_bytes in gif_frames_bytes:
                        dec = cv2.imdecode(np.frombuffer(f_bytes, np.uint8), cv2.IMREAD_COLOR)
                        if dec is None:
                            dec = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
                        current_gif_decoded_frames.append(dec)
                else:
                    # Decode static image once per segment
                    jpeg_bytes = media_info[1]
                    current_decoded_static = cv2.imdecode(np.frombuffer(jpeg_bytes, np.uint8), cv2.IMREAD_COLOR)
                    if current_decoded_static is None:
                        current_decoded_static = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
            last_seg_idx = active_idx

        media_info = cached_media.get(p_str)
        if not media_info:
            frame_bgr = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
        else:
            is_gif = media_info[0]
            if not is_gif:
                frame_bgr = current_decoded_static
            else:
                if current_gif_decoded_frames:
                    gif_dur = media_info[2]
                    t_rel = t - seg["start"]
                    n_frames = len(current_gif_decoded_frames)
                    total_gif_dur = n_frames * gif_dur
                    f_idx = int((t_rel % total_gif_dur) / gif_dur) % n_frames
                    frame_bgr = current_gif_decoded_frames[f_idx]
                else:
                    frame_bgr = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)

        start_t = seg["start"]
        end_t = seg["end"]
        seg_dur = max(0.1, end_t - start_t)
        progress = min(1.0, max(0.0, (t - start_t) / seg_dur))

        # Zoom & Panning effect (Optimized with INTER_NEAREST for massive speedup)
        h_f, w_f, _ = frame_bgr.shape
        if w_f > TARGET_W:
            # Có Panning ngang (ảnh đã được render ở kích thước rộng hơn)
            max_x = w_f - TARGET_W
            x_start = int(max_x * progress) if active_idx % 2 == 0 else int(max_x * (1.0 - progress))
            frame_slice = frame_bgr[:, x_start:x_start+TARGET_W]
            
            # Kết hợp Zoom nhẹ
            scale = (1.0 + 0.04 * progress) if (active_idx % 2 == 0) else (1.04 - 0.04 * progress)
            zw, zh = int(TARGET_W * scale), int(TARGET_H * scale)
            img_zoomed = cv2.resize(frame_slice, (zw, zh), interpolation=cv2.INTER_NEAREST)
            zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
            frame_bg = img_zoomed[zt:zt+TARGET_H, zl:zl+TARGET_W]
        else:
            # Chỉ Zoom (cho ảnh dọc)
            scale = (1.0 + 0.06 * progress) if (active_idx % 2 == 0) else (1.06 - 0.06 * progress)
            zw, zh = int(TARGET_W * scale), int(TARGET_H * scale)
            img_zoomed = cv2.resize(frame_bgr, (zw, zh), interpolation=cv2.INTER_NEAREST)
            zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
            frame_bg = img_zoomed[zt:zt+TARGET_H, zl:zl+TARGET_W]

        # Transition effect (Decodes next frame bytes to numpy array properly, cached once per segment)
        if active_idx < len(timeline) - 1 and (end_t - t) < (fade_frames / fps):
            next_seg = timeline[active_idx + 1]
            next_p_str = next_seg["image_path"]
            next_media_info = cached_media.get(next_p_str)
            if next_media_info:
                if current_decoded_next_seg_idx != active_idx:
                    is_next_gif = next_media_info[0]
                    if not is_next_gif:
                        jpeg_bytes_next = next_media_info[1]
                    else:
                        jpeg_bytes_next = next_media_info[1][0]
                    
                    raw_next = cv2.imdecode(np.frombuffer(jpeg_bytes_next, np.uint8), cv2.IMREAD_COLOR)
                    if raw_next is None:
                        raw_next = np.zeros((TARGET_H, TARGET_W, 3), dtype=np.uint8)
                    
                    # Apply zoom/pan for progress=0 to get a TARGET_W x TARGET_H frame for seamless blending
                    h_n, w_n, _ = raw_next.shape
                    if w_n > TARGET_W:
                        x_start_n = 0 if (active_idx + 1) % 2 == 0 else (w_n - TARGET_W)
                        next_slice = raw_next[:, x_start_n:x_start_n+TARGET_W]
                        scale_n = 1.0 if ((active_idx + 1) % 2 == 0) else 1.04
                        zw, zh = int(TARGET_W * scale_n), int(TARGET_H * scale_n)
                        img_z = cv2.resize(next_slice, (zw, zh), interpolation=cv2.INTER_NEAREST)
                        zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
                        current_decoded_next_frame = img_z[zt:zt+TARGET_H, zl:zl+TARGET_W]
                    else:
                        scale_n = 1.0 if ((active_idx + 1) % 2 == 0) else 1.06
                        zw, zh = int(TARGET_W * scale_n), int(TARGET_H * scale_n)
                        img_z = cv2.resize(raw_next, (zw, zh), interpolation=cv2.INTER_NEAREST)
                        zl, zt = (zw - TARGET_W) // 2, (zh - TARGET_H) // 2
                        current_decoded_next_frame = img_z[zt:zt+TARGET_H, zl:zl+TARGET_W]
                        
                    current_decoded_next_seg_idx = active_idx
                
                if current_decoded_next_frame is not None:
                    alpha = (end_t - t) / (fade_frames / fps)
                    frame_bg = cv2.addWeighted(frame_bg, alpha, current_decoded_next_frame, 1.0 - alpha, 0)

        # Add subtitle (On-the-fly blending using pre-rendered mini patches - extremely fast, under 0.1ms)
        active_sub_text = None
        active_sub_start = 0
        for chunk in word_chunks:
            if chunk["start"] <= t <= chunk["end"]:
                active_sub_text = chunk["text"]
                active_sub_start = chunk["start"]
                break
        if active_sub_text and active_sub_text in sub_patch_cache:
            p_bgr, p_alpha, pw, ph = sub_patch_cache[active_sub_text]
            
            # POP-IN ANIMATION
            progress_frames = int((t - active_sub_start) * fps)
            if progress_frames < 2:
                scale = 0.8 + (progress_frames / 2.0) * 0.2
            elif progress_frames == 2:
                scale = 1.05
            else:
                scale = 1.0
                
            if scale != 1.0:
                new_pw, new_ph = int(pw * scale), int(ph * scale)
                p_bgr = cv2.resize(p_bgr, (new_pw, new_ph), interpolation=cv2.INTER_LINEAR)
                p_alpha = cv2.resize(p_alpha, (new_pw, new_ph), interpolation=cv2.INTER_LINEAR)
                if len(p_alpha.shape) == 2: p_alpha = p_alpha[:, :, None]
                pw, ph = new_pw, new_ph

            x_start = (TARGET_W - pw) // 2
            y_start = (TARGET_H - ph) // 2
            
            roi = frame_bg[y_start:y_start+ph, x_start:x_start+pw]
            blended = (roi.astype(np.float32) * (1.0 - p_alpha) + p_bgr.astype(np.float32) * p_alpha).astype(np.uint8)
            frame_bg[y_start:y_start+ph, x_start:x_start+pw] = blended

        # Write frame to pipe
        try:
            process.stdin.write(frame_bg.tobytes())
            # Test first frame to check if pipe died
            if f == 0:
                process.stdin.flush()
                time.sleep(0.1)
                if process.poll() is not None:
                    raise Exception("GPU Encoder failed")
        except Exception:
            if not fallback_triggered:
                fallback_triggered = True
                print(f"\n⚠️ Lỗi khởi tạo GPU Encoder ({v_codec}), đang tự động chuyển sang CPU encoder (libx264)...", flush=True)
                try: process.kill()
                except: pass
                cmd[cmd.index('-c:v') + 1] = 'libx264'
                cmd[cmd.index('-preset') + 1] = 'ultrafast'
                process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
                # Resend the first frame
                try: process.stdin.write(frame_bg.tobytes())
                except: pass
        
        # Calculate time & progress
        if (f + 1) % 15 == 0 or f == total_frames - 1:
            elapsed = time.time() - start_time
            fps_current = (f + 1) / elapsed
            eta = (total_frames - (f + 1)) / fps_current if fps_current > 0 else 0
            pct = int((f + 1) / total_frames * 100)
            overall_pct = int(50 + (pct * 0.48)) # Scale between 50% and 98%
            
            codec_used = "CPU:libx264" if fallback_triggered or not use_gpu else "GPU:h264_nvenc"
            msg = f"🎥 [5/5] Đang dựng Video ({codec_used}): {overall_pct}% | Đã chạy: {elapsed:.1f}s | Dự kiến còn: {eta:.1f}s | Tốc độ: {fps_current:.1f} fps"
            print(f"\r{msg}", end="", flush=True)
            if pbar_widget: pbar_widget.value = overall_pct
            if label_widget: label_widget.value = f"<b>{msg}</b>"

    print("\n🎬 Hoàn tất gửi dữ liệu, đang đóng file video...", flush=True)
    try:
        process.stdin.close()
        process.wait()
    except Exception:
        pass
    
    print(f"✅ TẠO VIDEO THÀNH CÔNG (LOCAL): {out_mp4_path}", flush=True)

def generate_video_short(anime_name, topic, api_key, voice, custom_script, custom_subs, hook_style, ending_style, pbar_widget, label_widget):
    import time
    
    # Save final video to Drive, but do processing locally in Colab SSD!
    local_temp_dir = Path('/content/temp_processing') if Path('/content').exists() else Path('temp_processing')
    local_temp_dir.mkdir(parents=True, exist_ok=True)
    
    out_dir = BASE_LIBRARY_DIR / anime_name / "output_shorts"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    anime_dir = get_base_library_dir() / anime_name
    conf_path = anime_dir / "characters_config.json"
    available_chars = list(json.loads(conf_path.read_text(encoding="utf-8")).keys()) if conf_path.exists() else []
    
    if custom_script and custom_script.strip():
        if label_widget: label_widget.value = "<b>📝 [1/5] 10%</b> — Đang nạp Kịch bản Tùy Chỉnh do bạn nhập..."
        if pbar_widget: pbar_widget.value = 10
        script_text = custom_script.strip()
        global LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME
        LAST_GENERATED_SCRIPT = script_text
        LAST_GENERATED_TOPIC = topic
        LAST_GENERATED_ANIME = anime_name
        scenes = analyze_character_timeline_gemini(script_text, available_chars, api_key)
    else:
        if label_widget: label_widget.value = "<b>🚀 [1/5] 5%</b> — AI Gemini đang viết kịch bản Tiếng Anh 30 phân cảnh..."
        if pbar_widget: pbar_widget.value = 5
        script_data = generate_script_gemini(topic, anime_name, available_chars, api_key, hook_style=hook_style, ending_style=ending_style)
        if not script_data or 'script' not in script_data:
            if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không thể tạo kịch bản Gemini. Kiểm tra lại API Key hoặc nhập kịch bản tùy chỉnh!</b>"
            return
        script_text = script_data.get('tts_script') or script_data.get('script', '')
        global LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME
        LAST_GENERATED_SCRIPT = script_text
        LAST_GENERATED_TOPIC = topic
        LAST_GENERATED_ANIME = anime_name
        scenes = script_data.get('scenes')
        if not scenes:
            scenes = analyze_character_timeline_gemini(script_text, available_chars, api_key)
        else:
            print("\n🧠 [AI DETECTOR] Bỏ qua vì CÔNG ĐOẠN 2 đã phân bổ nhân vật thành công!", flush=True)
    
    if label_widget: label_widget.value = "<b>🎙️ [3/5] 35%</b> — Đang tạo giọng đọc Edge-TTS Tiếng Anh (Tốc độ +15%)..."
    if pbar_widget: pbar_widget.value = 35
    audio_temp_path = local_temp_dir / "_temp_audio.mp3"
    ok = generate_tts_robust(script_text, voice, audio_temp_path)
    if not ok:
        if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không tạo được giọng đọc TTS!</b>"
        return
        
    if label_widget: label_widget.value = "<b>🧠 [4/5] 45%</b> — Whisper AI đang bóc tách mốc phát âm từng từ..."
    if pbar_widget: pbar_widget.value = 45
    
    # Whisper AI
    word_chunks, all_words = align_word_subtitles_whisper_smart(audio_temp_path, script_text)
    
    # Correct transcription typos (e.g. RAMURU -> RIMURU)
    word_chunks = refine_subtitles_gemini(word_chunks, script_text, api_key)
    
    # Post-process corrections to guarantee key name spellings are correct
    corrections = {
        "RAMURU": "RIMURU",
        "RAMURU'S": "RIMURU'S",
        "RIMURUS": "RIMURU'S",
        "VELDORAS": "VELDORA'S",
    }
    for chunk in word_chunks:
        for k, v in corrections.items():
            chunk["text"] = re.sub(r'\b' + re.escape(k) + r'\b', v, chunk["text"].upper())

    # Build strict 2.0s duration timeline based on Gemini folder planning
    total_dur = all_words[-1]["end"] if all_words else 45.0
    timeline = build_fixed_two_second_timeline(scenes, anime_name, topic, total_dur, all_words)
    
    # Render final MP4 locally, then copy to Drive
    local_mp4_path = local_temp_dir / f"_temp_video_final.mp4"
    render_mp4_video_word_sync(timeline, word_chunks, audio_temp_path, local_mp4_path, pbar_widget, label_widget)
    
    # Copy final MP4 to Drive
    timestamp = int(time.time())
    dest_mp4_path = out_dir / f"{anime_name}_Short_{timestamp}.mp4"
    if local_mp4_path.exists():
        shutil.copy(local_mp4_path, dest_mp4_path)
        print(f"✅ TẠO VIDEO THÀNH CÔNG: {dest_mp4_path}", flush=True)
        try:
            from google.colab import files
            print(f"📥 Đang tự động tải video ({dest_mp4_path.name}) về máy tính của bạn...", flush=True)
            files.download(str(dest_mp4_path))
        except Exception as e_dl:
            pass
        if label_widget: label_widget.value = f"<b style='color:green;'>✅ XONG! Video đã lưu tại: {dest_mp4_path}</b>"
        if pbar_widget: pbar_widget.value = 100
        try:
            local_mp4_path.unlink()
            audio_temp_path.unlink()
        except: pass
    else:
        print(f"❌ Lỗi: Không tìm thấy video được render tại {local_mp4_path}", flush=True)
        if label_widget: label_widget.value = "<b style='color:red;'>❌ LỖI: Không tìm thấy file video sau khi render!</b>"
