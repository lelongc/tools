import json
import os
import random
import re
import html
import shutil

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell_5_source = """def generate_scribe_project():
    import html
    import random
    import shutil
    
    if not os.path.exists("scene_metadata.json"): return
    with open("scene_metadata.json", "r", encoding="utf-8") as f:
        meta_data = json.load(f)

    BUILD_DIR = "scribe_build"
    os.makedirs(BUILD_DIR, exist_ok=True)
    
    for item in os.listdir(BUILD_DIR):
        item_path = os.path.join(BUILD_DIR, item)
        if os.path.isfile(item_path): os.remove(item_path)
            
    if os.path.exists(AUDIO_FILE):
        shutil.copy(AUDIO_FILE, os.path.join(BUILD_DIR, "voiceover.mp3"))
        
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
        
    # Phase 2: Professional Scene Grouping (AI Director 4.0)
    scenes = []
    current_scene = []
    for item in valid_items:
        current_scene.append(item)
        # Group 1 to 3 items per scene dynamically
        if len(current_scene) >= random.randint(1, 3):
            scenes.append(current_scene)
            current_scene = []
    if current_scene:
        scenes.append(current_scene)
        
    # Phase 3: Write XML
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\\n<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Auto Project" defaultHandMD5="default_right">\\n')
        
        scene_spacing = 4000
        for scene_idx, scene in enumerate(scenes):
            scene_x = scene_spacing * (scene_idx % 4)
            scene_y = scene_spacing * int(scene_idx / 4)
            
            n = len(scene)
            for i, item in enumerate(scene):
                meta = item['meta']
                is_svg = item['is_svg']
                actual_filename = item['actual_filename']
                content = item['content']
                
                # Element Layout within Scene
                if n == 1:
                    pos_x = scene_x
                    pos_y = scene_y
                elif n == 2:
                    pos_x = scene_x + (-700 if i == 0 else 700)
                    pos_y = scene_y
                elif n == 3:
                    if i == 0:
                        pos_x, pos_y = scene_x, scene_y - 600
                    elif i == 1:
                        pos_x, pos_y = scene_x - 700, scene_y + 600
                    else:
                        pos_x, pos_y = scene_x + 700, scene_y + 600
                else:
                    pos_x = scene_x + (-700 if i % 2 == 0 else 700)
                    pos_y = scene_y + (-600 if i < 2 else 600)
                    
                # Camera Configuration
                cam_x = scene_x
                cam_y = scene_y
                cam_scale = "1.0"
                if i == n - 1 and n > 1:
                    # Dynamic Zoom-in emphasis on the last element of a complex scene
                    cam_scale = "1.15"
                
                duration = meta['end'] - meta['start']
                elem_type = 'drawing' if is_svg else 'image'
                
                # Extract AI decisions
                ai_style = meta.get('animation_style', 'draw')
                ai_pace = meta.get('pace', 'normal')
                ai_color = meta.get('color_filter', 'normal')
                
                # Styles
                if ai_style == 'draw': draw_style = 'draw_style_normal'
                elif ai_style in ['movein_hand', 'movein_nohand']: draw_style = 'draw_style_movein'
                elif ai_style == 'fadein': draw_style = 'draw_style_fadein'
                else: draw_style = 'draw_style_normal'
                
                if not is_svg and ai_style == 'draw': draw_style = 'draw_style_movein'
                
                movin_compass = str(random.randint(1, 8))
                draw_detail = 'yes' if draw_style == 'draw_style_normal' else 'no'
                movin_arc = random.choice(['1', '2'])
                
                # Timing
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
                
                # Filters
                color_effect = '2' if ai_color == 'greyscale' else '0'
                
                drawing_xml_attr = f'drawingXML="{html.escape(content, quote=True)}"' if is_svg else f'imageRef="{actual_filename}"'
                hand_md5 = '""'
                
                # Required VideoScribe Attributes
                f.write(f'''  <element elementType="{elem_type}" {drawing_xml_attr} colourEffect="{color_effect}" customHandMD5={hand_md5} drawStyle="{draw_style}" movinCompass="{movin_compass}" movinFlow="{movin_flow}" movinArc="{movin_arc}" movinAllowRotate="yes" drawDetail="{draw_detail}" targetTime="{target_time_ms}" pauseTime="500" transitionTime="500" currentPosX="{pos_x}" currentPosY="{pos_y}" offsetX="{pos_x}" offsetY="{pos_y}" cameraPositionX="{cam_x}" cameraPositionY="{cam_y}" cameraScale="{cam_scale}" rotation="0" visible="true" scalesX="1.0" scalesY="1.0" theScale="1.0" targetHeight="800" opacity="1" blendMode="normal" keepRunning="no" />\\n''')
            
        if os.path.exists(AUDIO_FILE):
            f.write('''  <audio volume="1.0" loop="false">\\n    <file>voiceover.mp3</file>\\n  </audio>\\n''')
            
        f.write('</drawing>')

    output_filename = "Auto_Project.scribe"
    import zipfile
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUILD_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BUILD_DIR)
                zipf.write(file_path, arcname)
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án của bạn: {output_filename} (AI Director 4.0 Layout Engine)")

generate_scribe_project()
"""

for cell in nb.get('cells', []):
    if cell['cell_type'] == 'code':
        source = ''.join(cell['source'])
        if 'def generate_scribe_project' in source:
            cell['source'] = [l + '\n' for l in cell_5_source.split('\n')]
            cell['source'][-1] = cell['source'][-1].strip()

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Notebook cell 5 updated with AI Director 4.0 layout.")
