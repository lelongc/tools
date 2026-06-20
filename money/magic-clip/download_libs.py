import os
import urllib.request

libs_dir = r"d:\folder\tools\money\magic-clip\libs"
os.makedirs(libs_dir, exist_ok=True)

files = {
    "dexie.min.js": "https://unpkg.com/dexie@3.2.4/dist/dexie.min.js",
    "tesseract.min.js": "https://unpkg.com/tesseract.js@5.0.5/dist/tesseract.min.js",
    "worker.min.js": "https://unpkg.com/tesseract.js@5.0.5/dist/worker.min.js",
    "tesseract-core-wasm.js": "https://unpkg.com/tesseract.js-core@5.0.0/tesseract-core-wasm.js",
    "eng.traineddata.gz": "https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz",
    "vie.traineddata.gz": "https://tessdata.projectnaptha.com/4.0.0/vie.traineddata.gz"
}

for filename, url in files.items():
    path = os.path.join(libs_dir, filename)
    print(f"Downloading {filename}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Saved {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("Done downloading libraries.")
