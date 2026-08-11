import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

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
            
    has_audio = False
    mp3_files = glob.glob("*.mp3")
    if mp3_files:
        # Prefer voiceover.mp3 if it exists, otherwise use the first mp3 found
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
        if len(current_scene) >= random.randint(1, 3):
            scenes.append(current_scene)
            current_scene = []
    if current_scene:
        scenes.append(current_scene)
        
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        audio_attr = 'voiceOver="voiceover.mp3" voiceOverVolume="1"' if has_audio else ''
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\\n<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" defaultHandMD5="default_right" {audio_attr}>\\n')
        
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
                    
                if i == n - 1 and n > 1:
                    cam_scale = 0.65 
                    cam_x = 448.5 - scene_x * cam_scale
                    cam_y = 252.5 - scene_y * cam_scale
                else:
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
                movin_arc = random.choice(['1', '2']) if draw_style == 'draw_style_movein' else '0'
                
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
                
                # CRITICAL FIX: scalesX, scalesY, theScale must be consistent. 1.0 is safe.
                element_xml = (
                    f'  <element elementType="{elem_type}" {drawing_xml_attr} '
                    f'colourEffect="{color_effect}" customHandMD5={hand_md5} '
                    f'drawStyle="{draw_style}" movinCompass="{movin_compass}" '
                    f'movinFlow="{movin_flow}" movinArc="{movin_arc}" movinAllowRotate="yes" '
                    f'drawDetail="{draw_detail}" targetTime="{target_time_ms}" pauseTime="500" '
                    f'transitionTime="500" currentPosX="{pos_x}" currentPosY="{pos_y}" '
                    f'offsetX="{pos_x}" offsetY="{pos_y}" cameraPositionX="{cam_x}" '
                    f'cameraPositionY="{cam_y}" cameraScale="{cam_scale}" rotation="0" '
                    f'visible="true" scalesX="1.0" scalesY="1.0" theScale="1.0" '
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
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án: {output_filename} (Bản Sửa Lỗi Đơ Camera 4.1!)")

generate_scribe_project()
"""

def str_to_source(s):
    lines = s.split('\n')
    return [line + '\n' for line in lines[:-1]] + [lines[-1]] if lines else []

nb['cells'][10]['source'] = str_to_source(cell_10_source)

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
