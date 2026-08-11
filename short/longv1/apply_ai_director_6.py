import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Cell 2: Super dense timing (1.5s - 2.2s per scene)
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

    print(f"🎙️ Đang bóc tách Audio: {AUDIO_FILE}...")
    result = model.transcribe(AUDIO_FILE, word_timestamps=True)

    # ĐỒNG BỘ SIÊU DÀY ĐẶC: Cứ 1.5s - 2.2s ngắt 1 cảnh (cho video cực kỳ sống động như 1.scribe)
    MAX_SCENE_DURATION = 2.0
    scenes = []
    current_scene = {"start": 0, "end": 0, "text": ""}
    
    for segment in result['segments']:
        for word in segment['words']:
            if current_scene["text"] == "":
                current_scene["start"] = word["start"]
            current_scene["text"] += word["word"] + " "
            current_scene["end"] = word["end"]
            
            if (current_scene["end"] - current_scene["start"]) >= MAX_SCENE_DURATION:
                scenes.append(current_scene)
                current_scene = {"start": 0, "end": 0, "text": ""}

    if current_scene["text"].strip() != "":
        scenes.append(current_scene)

    print(f"🎉 Đã tạo thành công {len(scenes)} phân cảnh sinh động (Mỗi cảnh 1.5s - 2s)!")
"""

# Cell 5: 100% compliant XML generator with full options and attributes matching 1.scribe
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
        
    scenes = []
    current_scene = []
    for item in valid_items:
        current_scene.append(item)
        if len(current_scene) >= random.randint(2, 3):
            scenes.append(current_scene)
            current_scene = []
    if current_scene:
        scenes.append(current_scene)
        
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        audio_attr = 'voiceOver="voiceover.mp3" voiceOverVolume="1"' if has_audio else ''
        
        # BỔ SUNG ĐẦY ĐỦ THUỘC TÍNH ROOT CHUẨN 100% THEO FILE 1.SCRIBE MẪU
        options_val = '&lt;drawingOptions paperStyle=&quot;1&quot; paperColour=&quot;16777215&quot; threeDMode=&quot;no&quot; loopSound=&quot;no&quot; zoomAtEnd=&quot;no&quot; vignette=&quot;0&quot; xPerspective=&quot;0&quot; yPerspective=&quot;0&quot; zPerspective=&quot;0&quot;/&gt;'
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\\n<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" desc="" tags="" uniqueID="1048856588" isDescendedFromTemplate="not_desc" defaultHandMD5="default_right" options="{options_val}" backingTrack="" lastRenderDateTime="Invalid Date" {audio_attr}>\\n')
        
        scene_spacing = 1500
        element_counter = 1095000000
        
        for scene_idx, scene in enumerate(scenes):
            scene_x = scene_spacing * (scene_idx % 4)
            scene_y = scene_spacing * int(scene_idx / 4)
            
            n = len(scene)
            for i, item in enumerate(scene):
                meta = item['meta']
                is_svg = item['is_svg']
                actual_filename = item['actual_filename']
                content = item['content']
                element_counter += random.randint(1000, 5000)
                
                if n == 1:
                    pos_x, pos_y = scene_x, scene_y
                elif n == 2:
                    pos_x = scene_x + (-220 if i == 0 else 220)
                    pos_y = scene_y
                else:
                    if i == 0: pos_x, pos_y = scene_x, scene_y - 180
                    elif i == 1: pos_x, pos_y = scene_x - 220, scene_y + 180
                    else: pos_x, pos_y = scene_x + 220, scene_y + 180
                    
                if i == n - 1 and n > 1:
                    cam_scale = 0.82
                    cam_x = 448.5 - scene_x * cam_scale
                    cam_y = 252.5 - scene_y * cam_scale
                else:
                    cam_scale = 1.05
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
                movin_arc = random.choice(['0', '1']) if draw_style == 'draw_style_movein' else '0'
                
                # TỐC ĐỘ VẼ CHUẨN 1.SCRIBE (TRUNG BÌNH 800MS - 1500MS): Tuyệt đối không bị đơ
                target_time_ms = max(500, min(1800, int(duration * 500)))
                pause_time_ms = 500
                trans_time_ms = 500
                
                color_effect = '2' if ai_color == 'greyscale' else '0'
                drawing_xml_attr = f'drawingXML="{html.escape(content, quote=True)}"' if is_svg else f'imageRef="{actual_filename}"'
                
                # CẤU TRÚC 100% COMPLIANT GIỐNG 1.SCRIBE MẪU
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
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án: {output_filename} (AI Director 6.0 Engine!)")

generate_scribe_project()
"""

def str_to_source(s):
    lines = s.split('\n')
    return [line + '\n' for line in lines[:-1]] + [lines[-1]] if lines else []

nb['cells'][4]['source'] = str_to_source(cell_2_source)
nb['cells'][10]['source'] = str_to_source(cell_5_source)

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("AI Director 6.0 patch successfully applied!")
