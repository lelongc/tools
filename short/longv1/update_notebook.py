import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Update Cell 4 (Whisper Logic)
cell_4_source = """# --- CẤU HÌNH HỆ THỐNG ---
AUDIO_FILE = "voiceover.mp3"
GEMINI_API_KEY = "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY"
ASSETS_DIR = "assets"
# Sửa lại đường dẫn này nếu thư mục ảnh trong Drive của bạn khác
DRIVE_IMAGE_DIR = "/content/drive/MyDrive/image/f" 

import os
import whisper

os.makedirs(ASSETS_DIR, exist_ok=True)

# Tìm file audio thông minh (hỗ trợ nhiều tên)
import glob
found_audio = None
for name in ["voiceover.mp3", "voice_qwen.mp3", "audio.mp3", "*.mp3"]:
    matches = glob.glob(name)
    if matches:
        found_audio = matches[0]
        AUDIO_FILE = found_audio
        break

if not found_audio:
    print(f"\\n❌ LỖI: Không tìm thấy file âm thanh nào! Vui lòng upload file mp3 lên Colab (cột bên trái).")
else:
    print(f"\\n⏳ Đang kiểm tra phần cứng và tải mô hình Whisper...")
    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_type = "small" if device == "cuda" else "base"
    print(f"🚀 Tối ưu hóa GPU: {'BẬT (T4/V100)' if device == 'cuda' else 'TẮT (Chỉ CPU)'} | Mô hình: Whisper {model_type.upper()}")
    model = whisper.load_model(model_type, device=device)

    print(f"🎙️ Đang bóc tách Audio: {AUDIO_FILE}...")
    result = model.transcribe(AUDIO_FILE, word_timestamps=True)

    MIN_SCENE_DURATION = 2.0
    scenes = []
    current_scene = {"start": 0, "end": 0, "text": ""}
    
    for segment in result['segments']:
        if current_scene["text"] == "":
            current_scene["start"] = segment["start"]
        current_scene["text"] += segment["text"] + " "
        current_scene["end"] = segment["end"]
        
        # Ngắt cảnh dựa theo nhịp thở tự nhiên của Whisper (phân đoạn segment)
        if (current_scene["end"] - current_scene["start"]) >= MIN_SCENE_DURATION:
            scenes.append(current_scene)
            current_scene = {"start": 0, "end": 0, "text": ""}

    if current_scene["text"].strip() != "":
        scenes.append(current_scene)

    print(f"✅ Đã chia bài đọc thành {len(scenes)} phân cảnh (Scenes) đồng bộ nhịp thở!")
"""

# Update Cell 10 (generate_scribe_project)
cell_10_source = """def generate_scribe_project():
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
            
    # Tự động tìm bất kỳ file audio nào bạn đang có trên Colab
    has_audio = False
    for audio_name in ["voiceover.mp3", "voice_qwen.mp3", "audio.mp3"]:
        matches = glob.glob(audio_name)
        if not matches:
            matches = glob.glob("*.mp3")
        if matches and os.path.exists(matches[0]):
            shutil.copy(matches[0], os.path.join(BUILD_DIR, "voiceover.mp3"))
            has_audio = True
            break
        
    # Phase 1: Filter valid assets and read contents
    valid_items = []
    for meta in meta_data:
        file_path = os.path.join(ASSETS_DIR, meta['file_name'])
        
        alt_svg = os.path.join(ASSETS_DIR, meta['file_name'].split('.')[0] + '.svg')
        alt_png = os.path.join(ASSETS_DIR, meta['file_name'].split('.')[0] + '.png')
        
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
            
        valid_items.append({
            'meta': meta,
            'is_svg': is_svg,
            'actual_filename': actual_filename,
            'content': content
        })
        
    # Phase 2: Professional Scene Grouping (AI Director 4.1)
    scenes = []
    current_scene = []
    for item in valid_items:
        current_scene.append(item)
        if len(current_scene) >= random.randint(1, 3):
            scenes.append(current_scene)
            current_scene = []
    if current_scene:
        scenes.append(current_scene)
        
    # Phase 3: Write XML
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        audio_attr = 'voiceOver="voiceover.mp3" voiceOverVolume="1"' if has_audio else ''
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\\n<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" defaultHandMD5="default_right" {audio_attr}>\\n')
        
        # Rút ngắn khoảng cách giữa các cảnh để tránh lãng phí Canvas
        scene_spacing = 1500
        for scene_idx, scene in enumerate(scenes):
            scene_x = scene_spacing * (scene_idx % 4)
            scene_y = scene_spacing * int(scene_idx / 4)
            
            n = len(scene)
            for i, item in enumerate(scene):
                meta = item['meta']
                is_svg = item['is_svg']
                actual_filename = item['actual_filename']
                content = item['content']
                
                # Bố cục vị trí GẦN NHAU HƠN để camera dễ dàng bao quát (Fix lỗi cắt ảnh)
                # Khoảng cách 400px là tối ưu để scale không bị vỡ
                if n == 1:
                    pos_x = scene_x
                    pos_y = scene_y
                elif n == 2:
                    pos_x = scene_x + (-200 if i == 0 else 200)
                    pos_y = scene_y
                elif n == 3:
                    if i == 0:
                        pos_x, pos_y = scene_x, scene_y - 200
                    elif i == 1:
                        pos_x, pos_y = scene_x - 200, scene_y + 200
                    else:
                        pos_x, pos_y = scene_x + 200, scene_y + 200
                else:
                    pos_x = scene_x + (-200 if i % 2 == 0 else 200)
                    pos_y = scene_y + (-200 if i < 2 else 200)
                    
                # KHẮC PHỤC LỖI TỌA ĐỘ CAMERA & ZOOM ĐÚNG CHIỀU:
                # 448.5 và 252.5 là tọa độ pixel chính giữa tâm của khung hình VideoScribe.
                if i == n - 1 and n > 1:
                    # Bức ảnh cuối cùng sẽ lùi ra xa. Trong VideoScribe, scale < 1.0 là Zoom OUT.
                    cam_scale = 0.65 
                    cam_x = 448.5 - scene_x * cam_scale
                    cam_y = 252.5 - scene_y * cam_scale
                else:
                    # Tiến lại gần vẽ từng bức (Scale 1.0)
                    cam_scale = 1.0 
                    cam_x = 448.5 - pos_x * cam_scale
                    cam_y = 252.5 - pos_y * cam_scale
                
                duration = meta['end'] - meta['start']
                elem_type = 'drawing' if is_svg else 'image'
                
                ai_style = meta.get('animation_style', 'draw')
                ai_pace = meta.get('pace', 'normal')
                ai_color = meta.get('color_filter', 'normal')
                
                if ai_style == 'draw': draw_style = 'draw_style_normal'
                elif ai_style in ['movein_hand', 'movein_nohand']: draw_style = 'draw_style_movein'
                elif ai_style == 'fadein': draw_style = 'draw_style_fadein'
                else: draw_style = 'draw_style_normal'
                
                if not is_svg and ai_style == 'draw': draw_style = 'draw_style_movein'
                
                movin_compass = str(random.randint(1, 8))
                draw_detail = 'yes' if draw_style == 'draw_style_normal' else 'no'
                movin_arc = random.choice(['1', '2'])
                
                if ai_pace == 'fast':
                    target_time_ms = 500
                    movin_flow = '2'
                elif ai_pace == 'slow':
                    target_time_ms = max(1500, int((duration - 0.5) * 1000))
                    movin_flow = '0'
                else:
                    target_time_ms = max(800, min(1200, int(duration * 1000)))
                    movin_flow = '0'
                    
                if target_time_ms < 300: target_time_ms = 300
                color_effect = '2' if ai_color == 'greyscale' else '0'
                drawing_xml_attr = f'drawingXML="{html.escape(content, quote=True)}"' if is_svg else f'imageRef="{actual_filename}"'
                hand_md5 = '""'
                
                element_xml = (
                    f'  <element elementType="{elem_type}" {drawing_xml_attr} '
                    f'colourEffect="{color_effect}" customHandMD5={hand_md5} '
                    f'drawStyle="{draw_style}" movinCompass="{movin_compass}" '
                    f'movinFlow="{movin_flow}" movinArc="{movin_arc}" movinAllowRotate="yes" '
                    f'drawDetail="{draw_detail}" targetTime="{target_time_ms}" pauseTime="500" '
                    f'transitionTime="500" currentPosX="{pos_x}" currentPosY="{pos_y}" '
                    f'offsetX="{pos_x}" offsetY="{pos_y}" cameraPositionX="{cam_x}" '
                    f'cameraPositionY="{cam_y}" cameraScale="{cam_scale}" rotation="0" '
                    f'visible="true" scalesX="0.5" scalesY="0.5" theScale="0.8" '
                    f'targetHeight="800" opacity="1" blendMode="normal" keepRunning="no" />\\n'
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
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án: {output_filename} (Bản Camera & Phân cảnh chuẩn 4.1!)")

generate_scribe_project()
"""

# Function to convert string code to ipynb source lines
def str_to_source(s):
    lines = s.split('\n')
    return [line + '\n' for line in lines[:-1]] + [lines[-1]] if lines else []

nb['cells'][4]['source'] = str_to_source(cell_4_source)
nb['cells'][10]['source'] = str_to_source(cell_10_source)

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
