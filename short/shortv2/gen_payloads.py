import json
import os

with open('anime_short.py', 'r', encoding='utf-8') as f: code2 = f.read()
payload2 = json.dumps({'cellId': 'OMqplGzCI2Cx', 'content': '%%writefile anime_short.py\n' + code2})
open('payload2.json', 'w', encoding='utf-8').write(payload2)

with open('fetch_character_library.py', 'r', encoding='utf-8') as f: code3 = f.read()
payload3 = json.dumps({'cellId': 'P0qRrS5gdweu', 'content': '%%writefile fetch_character_library.py\n' + code3})
open('payload3.json', 'w', encoding='utf-8').write(payload3)

with open('colab_ui.py', 'r', encoding='utf-8') as f: code0 = f.read()
payload0 = json.dumps({'content': '# Cell 0: Quản lý Thư viện Anime trên Drive\n!pip install -q ipywidgets\n' + code0, 'index': 0})
open('payload0.json', 'w', encoding='utf-8').write(payload0)

code4 = """# Cell 4: Tải ảnh thư viện cho Anime đã chọn
sel_anime = anime_dropdown.value
print(f"🚀 Đang tải ảnh cho anime: {sel_anime}")
!python fetch_character_library.py --anime "{sel_anime}"
"""
payload4 = json.dumps({'cellId': '64vLlSM2dyP5', 'content': code4})
open('payload4.json', 'w', encoding='utf-8').write(payload4)

code5 = """# Cell 5: Xóa bộ nhớ đệm (nếu cần) & Tạo video ngắn
import os
from pathlib import Path
from google.colab import files, userdata, drive

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    try:
        api_key = userdata.get('GEMINI_API_KEY')
    except:
        pass

drive_key_file = Path("/content/drive/MyDrive/gemini_key.txt")
if not api_key and drive_key_file.exists():
    api_key = drive_key_file.read_text().strip()

if not api_key:
    api_key = input("Enter GEMINI_API_KEY: ").strip()

!rm -rf /content/output/images /content/output/final_short.mp4 /content/output/_*

sel_anime = anime_dropdown.value
# 🟢 BẠN CÓ THỂ SỬA CHỦ ĐỀ VIDEO Ở DÒNG DƯỚI ĐÂY 🟢
topic_input = "Sự thật đen tối về sức mạnh thật sự của Rimuru Tempest"

print(f"🎬 Đang tạo video cho Anime: {sel_anime} | Chủ đề: {topic_input}")
!python anime_short.py -t "{topic_input}" --anime "{sel_anime}" -k "{api_key}"

if os.path.exists("/content/output/final_short.mp4"):
    print("\\nDownloading final_short.mp4...")
    files.download("/content/output/final_short.mp4")"""

payload5 = json.dumps({'cellId': 'Sd0KS_mEPVKT', 'content': code5})
open('payload5.json', 'w', encoding='utf-8').write(payload5)
