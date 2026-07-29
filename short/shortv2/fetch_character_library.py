import os, sys, time, json, re, hashlib, requests, argparse
from pathlib import Path
from urllib.parse import quote
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image, ImageSequence

TARGET_W, TARGET_H = 1080, 1920
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}

def search_character_media(query, limit=30):
    clean_q = re.sub(r"[^a-zA-Z0-9\s]", " ", query.strip()).strip()
    cands = []
    try:
        r = requests.get(f"https://tenor.googleapis.com/v2/search?q={quote(clean_q+' anime')}&key=LIVDSRZULELA&limit=12", headers=HEADERS, timeout=5)
        if r.status_code == 200:
            for item in r.json().get('results',[]):
                mf = item.get('media_formats',{})
                gu = mf.get('gif',{}).get('url') or mf.get('mediumgif',{}).get('url')
                if gu: cands.append(gu)
    except: pass
    try:
        r = requests.get(f"https://wallhaven.cc/api/v1/search?q={quote(clean_q)}&categories=010&purity=100", headers=HEADERS, timeout=5)
        if r.status_code == 200:
            for item in r.json().get('data',[]):
                p = item.get('path')
                if p: cands.append(p)
    except: pass
    try:
        sb_tag = re.sub(r"\s+","_",clean_q.lower().replace("anime","").strip())
        r = requests.get(f"https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=20&tags={quote(sb_tag)}+rating:general", headers=HEADERS, timeout=5)
        if r.status_code == 200 and r.text.strip().startswith('['):
            for p in r.json():
                fu = p.get('file_url')
                if fu:
                    if not fu.startswith('http'): fu = 'https:'+fu
                    cands.append(fu)
    except: pass
    try:
        r = requests.get(f"https://www.bing.com/images/search?q={quote(clean_q+' anime screenshot')}&adlt=strict", headers=HEADERS, timeout=5)
        if r.status_code == 200:
            for m in re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', r.text):
                ml = m.lower()
                if not any(bad in ml for bad in ["car", "ferrari", "cosplay", "real", "model", "logo", "banner"]):
                    cands.append(m)
    except: pass
    seen = set(); unique = []
    for c in cands:
        if c not in seen: seen.add(c); unique.append(c)
    return unique[:limit]

def resize_crop_save(media_data, out_path):
    tmp = out_path.parent / f"_tmp_{out_path.name}"
    tmp.write_bytes(media_data)
    try:
        img = Image.open(tmp)
        is_gif = getattr(img, "is_animated", False)
        if is_gif:
            frames = []
            for frame in ImageSequence.Iterator(img):
                f = frame.convert('RGB'); w,h = f.size; ratio = TARGET_W/TARGET_H
                if w/h > ratio: nh,nw = TARGET_H, int(w*(TARGET_H/h))
                else: nw,nh = TARGET_W, int(h*(TARGET_W/w))
                f = f.resize((nw,nh), Image.LANCZOS)
                l,t = (nw-TARGET_W)//2, (nh-TARGET_H)//2
                frames.append(f.crop((l,t,l+TARGET_W,t+TARGET_H)))
            if frames:
                frames[0].save(out_path, save_all=True, append_images=frames[1:], loop=0, duration=100)
                tmp.unlink(missing_ok=True); return True
        img = img.convert('RGB'); w,h = img.size; ratio = TARGET_W/TARGET_H
        if w/h > ratio: nh,nw = TARGET_H, int(w*(TARGET_H/h))
        else: nw,nh = TARGET_W, int(h*(TARGET_W/w))
        img = img.resize((nw,nh), Image.LANCZOS)
        l,t = (nw-TARGET_W)//2, (nh-TARGET_H)//2
        img.crop((l,t,l+TARGET_W,t+TARGET_H)).save(out_path, 'JPEG', quality=92)
        tmp.unlink(missing_ok=True); return True
    except:
        tmp.unlink(missing_ok=True); return False

def build_library_for_character(char_folder_name, search_terms, base_dir, target_count=15):
    char_dir = base_dir / char_folder_name
    char_dir.mkdir(parents=True, exist_ok=True)
    existing_files = list(char_dir.glob("*.jpg")) + list(char_dir.glob("*.png")) + list(char_dir.glob("*.gif"))
    if len(existing_files) >= target_count:
        print(f"  OK [{char_folder_name}]: {len(existing_files)} images ready")
        return
    used_hashes = set()
    for f in existing_files:
        try: used_hashes.add(hashlib.md5(f.read_bytes()).hexdigest())
        except: pass
    urls = []
    for term in search_terms: urls.extend(search_character_media(term, limit=25))
    saved_count = len(existing_files)
    for url in urls:
        if saved_count >= target_count: break
        try:
            r = requests.get(url, headers=HEADERS, timeout=8)
            if r.status_code != 200 or len(r.content) < 8000: continue
            h = hashlib.md5(r.content).hexdigest()
            if h in used_hashes: continue
            used_hashes.add(h)
            ext = ".gif" if url.lower().endswith(".gif") or "tenor" in url.lower() else ".jpg"
            out_file = char_dir / f"{char_folder_name}_{saved_count+1:02d}{ext}"
            if resize_crop_save(r.content, out_file):
                saved_count += 1
                print(f"    + [{char_folder_name}] #{saved_count:02d}: {out_file.name}")
        except: continue
    print(f"  FINISHED [{char_folder_name}]: {saved_count} images")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--anime", "-a", required=True, help="Tên Anime (phải khớp với tên trong anime_characters_config.json)")
    args = parser.parse_args()

    config_path = Path("/content/drive/MyDrive/anime_library/anime_characters_config.json")
    if not config_path.exists():
        # Thử fallback local
        config_path = Path(__file__).parent / "anime_characters_config.json"
        
    if not config_path.exists():
        print(f"LỖI: Không tìm thấy file {config_path}. Bạn cần tạo UI cấu hình trước!")
        return

    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"LỖI đọc JSON: {e}")
        return

    anime_name = args.anime
    if anime_name not in config:
        print(f"LỖI: '{anime_name}' không có trong file cấu hình! Các anime hiện có: {list(config.keys())}")
        return

    char_dict = config[anime_name]

    drive_lib = Path(f"/content/drive/MyDrive/anime_library/{anime_name}")
    local_lib = Path(f"./anime_library/{anime_name}")
    base_dir = drive_lib if drive_lib.parent.parent.exists() else local_lib
    base_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*60}\nBUILDING MOVIE CHARACTER LIBRARY FOR: {anime_name}\n{'='*60}")
    print(f"Saving to: {base_dir}")
    
    for char_name, terms in char_dict.items():
        build_library_for_character(char_name, terms, base_dir, target_count=15)
        
    print(f"\nMOVIE LIBRARY COMPLETE! Path: {base_dir}")

if __name__ == "__main__":
    main()
