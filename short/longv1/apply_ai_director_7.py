import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

# CELL 2: SENTENCE SPLITTING (1 Sentence = 1 Camera Scene)
cell_2_source = """# --- CẤU HÌNH HỆ THỐNG ---
AUDIO_FILE = "voiceover.mp3"
GEMINI_API_KEY = "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY"
ASSETS_DIR = "assets"
DRIVE_IMAGE_DIR = "/content/drive/MyDrive/image/f" 

import os
import whisper
import glob

os.makedirs(ASSETS_DIR, exist_ok=True)

found_audio = None
for name in ["voiceover.mp3", "voice_qwen.mp3", "audio.mp3", "*.mp3"]:
    matches = glob.glob(name)
    if matches:
        found_audio = matches[0]
        AUDIO_FILE = found_audio
        break

if not found_audio:
    print(f"\\n❌ LỖI: Không tìm thấy file mp3 nào trên Colab!")
else:
    print(f"\\n⏳ Đang kiểm tra GPU và tải mô hình Whisper...")
    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_type = "small" if device == "cuda" else "base"
    print(f"🚀 GPU: {'BẬT' if device == 'cuda' else 'TẮT'} | Model: Whisper {model_type.upper()}")
    model = whisper.load_model(model_type, device=device)

    print(f"🎙️ Đang bóc tách Audio theo CÂU THOẠI: {AUDIO_FILE}...")
    result = model.transcribe(AUDIO_FILE, word_timestamps=True)

    # 1 CÂU THOẠI (SENTENCE) = 1 CẢNH CAMERA (CAMERA SCENE)
    MIN_SENTENCE_DURATION = 3.0
    scenes = []
    current_scene = {"start": 0, "end": 0, "text": ""}
    
    for segment in result['segments']:
        if current_scene["text"] == "":
            current_scene["start"] = segment["start"]
        current_scene["text"] += segment["text"] + " "
        current_scene["end"] = segment["end"]
        
        # Ngắt theo câu thoại hoàn chỉnh (dấu câu hoặc thời lượng câu > 3.0s)
        if (segment['text'].strip().endswith(('.', '?', '!', ';')) and (current_scene["end"] - current_scene["start"]) >= MIN_SENTENCE_DURATION) or (current_scene["end"] - current_scene["start"]) >= 5.5:
            scenes.append(current_scene)
            current_scene = {"start": 0, "end": 0, "text": ""}

    if current_scene["text"].strip() != "":
        scenes.append(current_scene)

    print(f"🎉 Đã chia bài đọc thành {len(scenes)} CÂU THOẠI hoàn chỉnh (1 Câu thoại = 1 Cảnh Camera)!")
"""

# CELL 3: AI SELECTS 2-3 IMAGES PER SENTENCE
cell_3_source = """def search_local_svg(query, database_dir):
    stop_words = {"vector", "illustration", "clipart", "transparent", "icon", "svg", "drawing"}
    raw_words = re.sub(r'[^a-zA-Z0-9]', ' ', query).lower().split()
    query_words = set([w for w in raw_words if w not in stop_words and len(w) > 1])
    
    if not query_words: return None
    
    best_match = None
    max_score = 0
    
    for root, dirs, files in os.walk(database_dir):
        for f in files:
            if f.lower().endswith('.svg') or f.lower().endswith('.png'):
                clean_name = re.sub(r'[^a-zA-Z0-9]', ' ', os.path.splitext(f)[0]).lower()
                item_words = set(clean_name.split())
                
                score = len(query_words.intersection(item_words))
                if score > 0:
                    query_clean = " ".join(query_words)
                    if query_clean in clean_name:
                        score += 2.0
                        
                    if score > max_score:
                        max_score = score
                        best_match = os.path.join(root, f)
                        
    return best_match

def clean_json_response(text):
    text = text.strip()
    if text.startswith("```json"): text = text[7:]
    elif text.startswith("```"): text = text[3:]
    if text.endswith("```"): text = text[:-3]
    return text.strip()

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-3.1-flash-lite"
BATCH_SIZE = 4
scene_metadata = []

print("🤖 Đang phân tích kịch bản bằng Gemini (Mỗi câu thoại tạo 2-3 ảnh) & rút ảnh từ Drive...")

if len(scenes) == 0:
    print("⚠️ Lỗi: Không có cảnh nào.")
else:
    for i in range(0, len(scenes), BATCH_SIZE):
        batch_scenes = scenes[i:i+BATCH_SIZE]
        prompt_scenes_text = "".join([f"ID: {i+j+1} | Câu thoại: \\\"{s['text']}\\\"\\n" for j, s in enumerate(batch_scenes)])
            
        prompt_instruction = f\"\"\"
        Đạo diễn Whiteboard Animation. Mỗi CÂU THOẠI cần 2 đến 3 HÌNH ẢNH đại diện vẽ lần lượt trong cùng 1 khung cảnh.
        {prompt_scenes_text}
        
        Trả về DUY NHẤT 1 MẢNG JSON ARRAY. Mỗi phần tử:
        - "sentence_id": ID câu thoại
        - "images": Mảng chứa 2 đến 3 đối tượng hình ảnh:
            [
              {{
                "visual_concept": "Ý tưởng hình (Tiếng Việt)",
                "svg_search_prompt": "Từ khóa tìm kiếm 1-3 từ Tiếng Anh",
                "animation_style": "draw", "movein_hand", "movein_nohand", hoặc "fadein",
                "pace": "slow", "normal", hoặc "fast",
                "color_filter": "normal" hoặc "greyscale"
              }},
              ...
            ]
        \"\"\"
        
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=MODEL_ID, contents=prompt_instruction,
                    config=types.GenerateContentConfig(response_mime_type="application/json")
                )
                batch_data = json.loads(clean_json_response(response.text))
                
                for j, s in enumerate(batch_scenes):
                    scene_id = i + j + 1
                    result = next((item for item in batch_data if item.get("sentence_id") == scene_id or item.get("id") == scene_id), None)
                    
                    sentence_entry = {
                        "sentence_id": scene_id,
                        "start": s['start'], "end": s['end'], "speech_text": s['text'],
                        "images": []
                    }
                    
                    raw_images = result.get("images", []) if result else []
                    if not raw_images:
                        raw_images = [{"visual_concept": "Minh họa", "svg_search_prompt": "idea", "animation_style": "draw", "pace": "normal", "color_filter": "normal"}]
                        
                    for img_idx, img_info in enumerate(raw_images):
                        file_base = f"sentence_{scene_id:03d}_img_{img_idx+1:02d}"
                        prompt = img_info.get("svg_search_prompt", "icon")
                        
                        best_match = search_local_svg(prompt, DRIVE_IMAGE_DIR)
                        if best_match:
                            ext = os.path.splitext(best_match)[1]
                            final_filename = f"{file_base}{ext}"
                            shutil.copy(best_match, os.path.join(ASSETS_DIR, final_filename))
                            source_str = f"✅ Bốc từ Drive: {os.path.basename(best_match)}"
                        else:
                            final_filename = f"{file_base}.svg"
                            source_str = "❌ THIẾU ẢNH (Cần tự chèn)"
                            with open(os.path.join(ASSETS_DIR, f"{file_base}_THIEU.txt"), 'w') as temp: temp.write("Thieu anh")
                            
                        sentence_entry["images"].append({
                            "img_idx": img_idx + 1,
                            "visual_concept": img_info.get("visual_concept", ""),
                            "svg_search_prompt": prompt,
                            "animation_style": img_info.get("animation_style", "draw"),
                            "pace": img_info.get("pace", "normal"),
                            "color_filter": img_info.get("color_filter", "normal"),
                            "file_name": final_filename,
                            "source": source_str
                        })
                        
                    scene_metadata.append(sentence_entry)
                break
            except Exception as e:
                print(f"Lỗi Batch {i//BATCH_SIZE+1}: {e}. Thử lại...")
                time.sleep(5)
        time.sleep(2)

    with open("scene_metadata.json", "w", encoding="utf-8") as f:
        json.dump(scene_metadata, f, ensure_ascii=False, indent=2)
    print("🎉 Hoàn tất bốc 2-3 ảnh cho từng câu thoại từ Drive!")
"""

# CELL 4: DASHBOARD FOR MULTI-IMAGE PER SENTENCE
cell_4_source = """# HIỂN THỊ TRỰC QUAN CÁC ẢNH THEO TỪNG CÂU THOẠI
if not os.path.exists("scene_metadata.json"):
    print("Chưa có dữ liệu!")
else:
    with open("scene_metadata.json", "r", encoding="utf-8") as f:
        meta_data = json.load(f)

    html_code = '''
    <style>
      .dashboard { width: 100%; border-collapse: collapse; font-family: sans-serif; }
      .dashboard th, .dashboard td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      .dashboard th { background-color: #f2f2f2; color: #333; }
      .preview-img { max-width: 100px; max-height: 100px; border: 1px solid #ccc; background: white; margin: 4px; }
      .img-box { display: inline-block; text-align: center; vertical-align: top; width: 120px; }
      .missing { color: red; font-weight: bold; }
    </style>
    <h3>🎬 BẢNG KIỂM DUYỆT ẢNH THEO CÂU THOẠI (1 CÂU = 1 CẢNH CAMERA = 2-3 ẢNH)</h3>
    <table class="dashboard">
      <tr>
        <th>Câu</th>
        <th>Nội dung Thoại</th>
        <th>Các ảnh được vẽ trong Cảnh Camera này</th>
      </tr>
    '''

    import base64
    for item in meta_data:
        imgs_html = ""
        for img in item.get('images', []):
            file_path = os.path.join(ASSETS_DIR, img['file_name'])
            img_tag = "<span class='missing'>Không có ảnh</span>"
            if os.path.exists(file_path):
                try:
                    with open(file_path, "rb") as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode()
                    ext = "svg+xml" if file_path.endswith(".svg") else "png"
                    img_tag = f"<img class='preview-img' src='data:image/{ext};base64,{encoded_string}' />"
                except: pass
                
            imgs_html += f'''
            <div class="img-box">
              {img_tag}<br/>
              <small><b>#{img['img_idx']}</b>: {img['svg_search_prompt']}</small><br/>
              <code>{img['file_name']}</code>
            </div>
            '''
            
        html_code += f'''
        <tr>
          <td><b>{item['sentence_id']}</b></td>
          <td><i>"{item['speech_text']}"</i><br/><small>⏱️ {item['start']:.1f}s - {item['end']:.1f}s</small></td>
          <td>{imgs_html}</td>
        </tr>
        '''
    
    html_code += "</table>"
    display.display(display.HTML(html_code))
"""

# CELL 5: GENERATE SCRIBE PROJECT (LOCKED CAMERA PER SENTENCE SCENE)
cell_5_source = """def generate_scribe_project():
    import html
    import random
    import shutil
    import re
    import os
    import json
    import glob
    
    if not os.path.exists("scene_metadata.json"): return
    with open("scene_metadata.json", "r", encoding="utf-8") as f:
        meta_data = json.load(f)

    BUILD_DIR = "scribe_build"
    os.makedirs(BUILD_DIR, exist_ok=True)
    
    for item in os.listdir(BUILD_DIR):
        item_path = os.path.join(BUILD_DIR, item)
        if os.path.isfile(item_path): os.remove(item_path)
            
    has_audio = False
    mp3_files = glob.glob("*.mp3")
    if mp3_files:
        preferred = next((f for f in mp3_files if "voice" in f.lower()), mp3_files[0])
        shutil.copy(preferred, os.path.join(BUILD_DIR, "voiceover.mp3"))
        has_audio = True
        
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        audio_attr = 'voiceOver="voiceover.mp3" voiceOverVolume="1"' if has_audio else ''
        options_val = '&lt;drawingOptions paperStyle=&quot;1&quot; paperColour=&quot;16777215&quot; threeDMode=&quot;no&quot; loopSound=&quot;no&quot; zoomAtEnd=&quot;no&quot; vignette=&quot;0&quot; xPerspective=&quot;0&quot; yPerspective=&quot;0&quot; zPerspective=&quot;0&quot;/&gt;'
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\\n<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" desc="" tags="" uniqueID="1048856588" isDescendedFromTemplate="not_desc" defaultHandMD5="default_right" options="{options_val}" backingTrack="" lastRenderDateTime="Invalid Date" {audio_attr}>\\n')
        
        scene_spacing = 1500
        element_counter = 1095000000
        
        # 1 CÂU THOẠI = 1 CẢNH CAMERA (MÁY QUAY KHÓA CỐ ĐỊNH TRONG SUỐT CÂU THOẠI)
        for sentence_idx, sentence in enumerate(meta_data):
            scene_x = scene_spacing * (sentence_idx % 4)
            scene_y = scene_spacing * int(sentence_idx / 4)
            
            raw_images = sentence.get('images', [])
            if not raw_images: continue
            
            # Tọa độ CAMERA CỐ ĐỊNH CHO CẢ CẢNH CỦA CÂU THOẠI NÀY
            cam_scale = 0.82
            cam_x = 448.5 - scene_x * cam_scale
            cam_y = 252.5 - scene_y * cam_scale
            
            sentence_duration = sentence['end'] - sentence['start']
            n = len(raw_images)
            duration_per_img = sentence_duration / n
            
            for i, img_meta in enumerate(raw_images):
                file_path = os.path.join(ASSETS_DIR, img_meta['file_name'])
                alt_svg = os.path.join(ASSETS_DIR, img_meta['file_name'].split('.')[0] + '.svg')
                alt_png = os.path.join(ASSETS_DIR, img_meta['file_name'].split('.')[0] + '.png')
                
                if os.path.exists(alt_svg): file_path = alt_svg
                elif os.path.exists(alt_png): file_path = alt_png
                elif not os.path.exists(file_path): continue
                
                is_svg = file_path.endswith('.svg')
                actual_filename = os.path.basename(file_path)
                
                if is_svg:
                    with open(file_path, "r", encoding="utf-8") as f2:
                        content = re.sub(r'<\\?xml[^>]*\\?>', '', f2.read())
                else:
                    shutil.copy(file_path, os.path.join(BUILD_DIR, actual_filename))
                    content = ""
                    
                element_counter += random.randint(1000, 5000)
                
                # Bố cục 2-3 ảnh đứng cạnh nhau trong khung cảnh của câu thoại
                if n == 1:
                    pos_x, pos_y = scene_x, scene_y
                elif n == 2:
                    pos_x = scene_x + (-220 if i == 0 else 220)
                    pos_y = scene_y
                else:
                    if i == 0: pos_x, pos_y = scene_x, scene_y - 180
                    elif i == 1: pos_x, pos_y = scene_x - 220, scene_y + 180
                    else: pos_x, pos_y = scene_x + 220, scene_y + 180
                    
                elem_type = 'drawing' if is_svg else 'image'
                ai_style = img_meta.get('animation_style', 'draw')
                ai_pace = img_meta.get('pace', 'normal')
                ai_color = img_meta.get('color_filter', 'normal')
                
                if ai_style == 'draw': draw_style = 'draw_style_normal'
                elif ai_style in ['movein_hand', 'movein_nohand']: draw_style = 'draw_style_movein'
                elif ai_style == 'fadein': draw_style = 'draw_style_fadein'
                else: draw_style = 'draw_style_normal'
                
                if not is_svg and ai_style == 'draw': draw_style = 'draw_style_movein'
                
                movin_compass = str(random.randint(1, 8))
                draw_detail = 'yes' if draw_style == 'draw_style_normal' else 'no'
                movin_arc = random.choice(['0', '1']) if draw_style == 'draw_style_movein' else '0'
                
                # Thời gian vẽ phân bổ đều cho 2-3 ảnh trong câu thoại
                target_time_ms = max(500, min(1800, int(duration_per_img * 500)))
                pause_time_ms = 400
                trans_time_ms = 400
                
                color_effect = '2' if ai_color == 'greyscale' else '0'
                drawing_xml_attr = f'drawingXML="{html.escape(content, quote=True)}"' if is_svg else f'imageRef="{actual_filename}"'
                
                # MÁY QUAY KHÓA CỐ ĐỊNH (cam_x, cam_y, cam_scale KHÔNG ĐỔI CHO CÁC ẢNH TRONG CÙNG CÂU)
                element_xml = (
                    f'  <element elementType="{elem_type}" descName="" elementID="{element_counter}" '
                    f'splitTextField="no" drawingText="" fontName="null" {drawing_xml_attr} '
                    f'customHandMD5="" colourEffect="{color_effect}" targetTime="{target_time_ms}" '
                    f'pauseTime="{pause_time_ms}" transitionTime="{trans_time_ms}" '
                    f'drawStyle="{draw_style}" rotation="0" visible="true" '
                    f'currentPosX="{pos_x}" currentPosY="{pos_y}" offsetX="{pos_x}" offsetY="{pos_y}" '
                    f'scalesX="0.5" scalesY="0.5" theScale="0.8" targetHeight="800" '
                    f'movinCompass="{movin_compass}" movinFlow="0" movinArc="{movin_arc}" movinAllowRotate="yes" '
                    f'drawDetail="{draw_detail}" sketchStyle="no" brush="0" brushOptions="0" opacity="1" '
                    f'textColour="-1" textAlign="left" textBackwards="no" rtlLanguage="no" textSpacing="0" '
                    f'flipHoriz="no" flipVert="no" locked="no" calligraphy_angle="45" keepRunning="no" '
                    f'loopOptions="Fit to Time" blendMode="normal" filters="&lt;filters/&gt;" morphFromID="0" '
                    f'morphCamera="no" morphRemoveOld="yes" cameraPositionX="{cam_x}" cameraPositionY="{cam_y}" '
                    f'cameraScale="{cam_scale}" cameraCanvasWid="897.7777777777778" cameraCanvasHei="505" '
                    f'availableRecolours="&lt;availableRecolours/&gt;" recolouringSchemes="&lt;recolouringSchemes/&gt;" '
                    f'skinTone="-1" hairColour="-1" highlightColour="-1" customColour1="-1" customColour2="-1" '
                    f'originalOutlineColour="0" greyscaleContrast="70" />\\n'
                )
                f.write(element_xml)
            
        f.write('</drawing>')

    output_filename = "Auto_Project.scribe"
    import zipfile
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUILD_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BUILD_DIR)
                zipf.write(file_path, arcname)
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án: {output_filename} (AI Director 7.0 Engine!)")

generate_scribe_project()
"""

def str_to_source(s):
    lines = s.split('\n')
    return [line + '\n' for line in lines[:-1]] + [lines[-1]] if lines else []

nb['cells'][4]['source'] = str_to_source(cell_2_source)
nb['cells'][6]['source'] = str_to_source(cell_3_source)
nb['cells'][8]['source'] = str_to_source(cell_4_source)
nb['cells'][10]['source'] = str_to_source(cell_5_source)

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("AI Director 7.0 applied successfully!")
