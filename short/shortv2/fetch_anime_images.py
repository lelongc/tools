"""
Fetch Anime Images — Tải ảnh nhân vật anime từ Google Images
"""
import io
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import quote_plus, urlencode

import requests
from PIL import Image

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


# Target size for 9:16 vertical video
TARGET_W = 1080
TARGET_H = 1920

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


def search_google_images(query: str, num_results: int = 5) -> list[str]:
    """
    Search Google / DuckDuckGo Images and return a list of image URLs.
    """
    urls = []
    # 1. DuckDuckGo Images API
    try:
        r1 = requests.get("https://duckduckgo.com/", params={"q": query}, headers=HEADERS, timeout=8)
        vqd = re.search(r'vqd=([\d-]+)', r1.text)
        if vqd:
            params = {"l": "us-en", "o": "json", "q": query, "vqd": vqd.group(1), "f": ",,,", "p": "1"}
            r2 = requests.get("https://duckduckgo.com/i.js", params=params, headers=HEADERS, timeout=8)
            if r2.status_code == 200:
                results = r2.json().get("results", [])
                for item in results:
                    u = item.get("image")
                    if u and u.startswith("http"):
                        urls.append(u)
                    if len(urls) >= num_results:
                        return urls
    except Exception:
        pass

    # 2. Fallback: Direct Google search
    search_url = "https://www.google.com/search"
    params = {
        "q": query,
        "tbm": "isch",
        "ijn": "0",
        "tbs": "isz:l",
    }

    try:
        resp = requests.get(search_url, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        html = resp.text

        pattern = r'\["(https?://[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)",[0-9]+,[0-9]+'
        matches = re.findall(pattern, html)
        for url in matches:
            if "gstatic.com" not in url and "google.com" not in url and url not in urls:
                urls.append(url)
            if len(urls) >= num_results:
                break

        return urls[:num_results]

    except Exception as e:
        print(f"      ⚠️ Search error: {e}")
        return urls[:num_results]


def download_image(url: str, save_path: Path, timeout: int = 20) -> bool:
    """Download an image from URL and save it."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, stream=True)
        if resp.status_code != 200:
            return False

        content_type = resp.headers.get("Content-Type", "")
        if "image" not in content_type and not url.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            return False

        data = resp.content
        if len(data) < 5000:  # Skip tiny images (likely placeholders)
            return False

        save_path.write_bytes(data)
        return True

    except Exception:
        return False


def resize_crop_to_vertical(img_path: Path, output_path: Path, target_w: int = TARGET_W, target_h: int = TARGET_H):
    """
    Resize and crop image to 9:16 vertical format.
    Strategy: resize to fill, then center-crop.
    """
    try:
        img = Image.open(img_path)
        img = img.convert("RGB")

        # Calculate scale to fill the target area
        w, h = img.size
        target_ratio = target_w / target_h  # 0.5625
        img_ratio = w / h

        if img_ratio > target_ratio:
            # Image is wider — scale by height, crop width
            new_h = target_h
            new_w = int(w * (target_h / h))
        else:
            # Image is taller — scale by width, crop height
            new_w = target_w
            new_h = int(h * (target_w / w))

        img = img.resize((new_w, new_h), Image.LANCZOS)

        # Center crop
        left = (new_w - target_w) // 2
        top = (new_h - target_h) // 2
        img = img.crop((left, top, left + target_w, top + target_h))

        img.save(output_path, "JPEG", quality=92)
        return True

    except Exception as e:
        print(f"      ⚠️ Resize error: {e}")
        return False


def fetch_images_for_characters(characters: list[dict], project_dir: Path) -> dict[str, Path]:
    """
    Download images for each character in the list.
    Returns a dict mapping character name -> image path.
    """
    images_dir = project_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    char_images = {}

    for char in characters:
        name = char["name"]
        query = char.get("search_query", f"{name} anime character")
        slug = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")
        final_path = images_dir / f"{slug}.jpg"

        # Skip if already downloaded
        if final_path.exists() and final_path.stat().st_size > 10000:
            print(f"   ✅ Đã có ảnh: {slug}.jpg")
            char_images[name] = final_path
            continue

        print(f"   🔍 Tìm ảnh: \"{query}\"...")
        urls = search_google_images(query, num_results=5)

        if not urls:
            print(f"      ⚠️ Không tìm thấy ảnh cho: {name}")
            continue

        # Try downloading each URL until one succeeds
        temp_path = images_dir / f"_temp_{slug}.jpg"
        downloaded = False

        for i, url in enumerate(urls):
            if download_image(url, temp_path):
                # Resize to 9:16 vertical
                if resize_crop_to_vertical(temp_path, final_path):
                    downloaded = True
                    print(f"      ✅ Đã tải & resize: {slug}.jpg")
                    break
                else:
                    # If resize fails, try raw copy
                    try:
                        import shutil
                        shutil.copy2(temp_path, final_path)
                        downloaded = True
                        print(f"      ✅ Đã tải (raw): {slug}.jpg")
                        break
                    except:
                        pass

        # Clean up temp file
        if temp_path.exists():
            temp_path.unlink()

        if downloaded:
            char_images[name] = final_path
        else:
            print(f"      ❌ Không tải được ảnh: {name}")

        # Rate limit between searches
        time.sleep(1)

    return char_images


def fetch_images_for_scenes(scenes: list[dict], char_images: dict[str, Path], project_dir: Path) -> list[Path]:
    """
    Map each scene to its character's image.
    Returns ordered list of image paths (one per scene).
    """
    images_dir = project_dir / "images"
    scene_images = []

    # Get a fallback image (first available character image)
    fallback = list(char_images.values())[0] if char_images else None

    for i, scene in enumerate(scenes):
        char_name = scene.get("character", "")
        img_path = char_images.get(char_name, fallback)

        if img_path and img_path.exists():
            scene_images.append(img_path)
        elif fallback and fallback.exists():
            scene_images.append(fallback)
        else:
            # Create a black placeholder
            placeholder = images_dir / f"placeholder_{i:02d}.jpg"
            if not placeholder.exists():
                img = Image.new("RGB", (TARGET_W, TARGET_H), (20, 20, 30))
                img.save(placeholder, "JPEG")
            scene_images.append(placeholder)

    return scene_images


def main():
    """Test mode — fetch images for a sample character list."""
    test_characters = [
        {"name": "Rimuru Tempest", "search_query": "Rimuru Tempest That Time I Got Reincarnated as a Slime anime"},
        {"name": "Chloe Aubert", "search_query": "Chloe Aubert Tensura anime character"},
    ]

    project_dir = Path(__file__).parent / "projects" / "test_images"
    project_dir.mkdir(parents=True, exist_ok=True)

    char_images = fetch_images_for_characters(test_characters, project_dir)
    print(f"\n[OK] Đã tải {len(char_images)} ảnh nhân vật")
    for name, path in char_images.items():
        print(f"   {name}: {path}")


if __name__ == "__main__":
    main()
