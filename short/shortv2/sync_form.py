import json

form_code = """# @title 🎬 3. ANIME SHORT STUDIO (FORM CONTROL)
# @markdown ---
# @markdown ### 🔑 1. API & Kịch Bản Video Short
Gemini_API_Key = "" #@param {type:"string"}
Anime_Name = "Tensei_Slime" #@param {type:"string"}
Topic = "Secrets of Rimuru Tempest when evolving into a True Demon Lord" #@param {type:"string"}
Custom_Script = "" #@param {type:"raw"}
Voice = "en-US-ChristopherNeural" #@param ["en-US-ChristopherNeural", "en-US-GuyNeural", "en-US-JennyNeural", "en-US-AriaNeural"]

# @markdown ---
# @markdown ### 🖼️ 2. Nguồn Cào Ảnh & Số Lượng
Image_Source = "pinterest" #@param ["pinterest", "google", "bing"]
Target_Images_Per_Char = 50 #@param {type:"slider", min:10, max:100, step:5}

# @markdown ---
# @markdown ### 🚀 3. Thực Thi Hành Động
Action = "1-Click Render Video Short MP4" #@param ["1-Click Render Video Short MP4", "Chỉ Cào Ảnh Cho Anime Library"]

# ==========================================
# THỰC THI LOGIC
# ==========================================
import json
from pathlib import Path

BASE_LIBRARY_DIR = Path('/content/drive/MyDrive/anime_library')
SETTINGS_FILE = BASE_LIBRARY_DIR / "studio_settings.json"

if not Gemini_API_Key.strip() and SETTINGS_FILE.exists():
    try:
        data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        Gemini_API_Key = data.get("gemini_api_key", "")
        if Gemini_API_Key:
            print("🔑 Đã tự động nạp Gemini API Key từ cấu hình Drive cũ!")
    except Exception: pass

if Gemini_API_Key.strip():
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    try:
        curr = json.loads(SETTINGS_FILE.read_text(encoding="utf-8")) if SETTINGS_FILE.exists() else {}
        curr["gemini_api_key"] = Gemini_API_Key.strip()
        SETTINGS_FILE.write_text(json.dumps(curr, indent=4, ensure_ascii=False), encoding="utf-8")
    except Exception: pass

print(f"\\n{'='*60}")
print(f"🎬 HÀNH ĐỘNG: {Action}")
print(f"📌 Anime: {Anime_Name} | Nguồn ảnh: {Image_Source}")
print(f"{'='*60}\\n")

if Action == "Chỉ Cào Ảnh Cho Anime Library":
    run_fetch(Anime_Name, target_per_char=Target_Images_Per_Char, source=Image_Source)
else:
    if not Custom_Script.strip() and not Gemini_API_Key.strip():
        print("❌ LỖI: Vui lòng nhập Gemini API Key HOẶC dán Kịch Bản Tùy Chỉnh ở trên!")
    else:
        generate_video_short(
            anime_name=Anime_Name,
            topic=Topic,
            api_key=Gemini_API_Key.strip(),
            voice=Voice,
            custom_script=Custom_Script.strip()
        )"""

with open('c2.py', 'w', encoding='utf-8') as f:
    f.write(form_code)

with open('c0.py', encoding='utf-8') as f: c0 = f.read()
with open('c1.py', encoding='utf-8') as f: c1 = f.read()
with open('c2.py', encoding='utf-8') as f: c2 = f.read()

nb = {
  'cells': [
    {'cell_type': 'code', 'metadata': {'id': 'cell_001'}, 'outputs': [], 'execution_count': None, 'source': [l+'\n' for l in c0.split('\n')]},
    {'cell_type': 'code', 'metadata': {'id': 'cell_002'}, 'outputs': [], 'execution_count': None, 'source': [l+'\n' for l in c1.split('\n')]},
    {'cell_type': 'code', 'metadata': {'id': 'cell_003'}, 'outputs': [], 'execution_count': None, 'source': [l+'\n' for l in c2.split('\n')]}
  ],
  'metadata': {'colab': {'provenance': []}, 'gpuClass': 'standard', 'language_info': {'name': 'python'}, 'accelerator': 'GPU'},
  'nbformat': 4, 'nbformat_minor': 0
}

for cell in nb['cells']:
    if cell['source'] and cell['source'][-1] == '\n': cell['source'].pop()

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print('Updated anime_short.ipynb with Form UI successfully!')
