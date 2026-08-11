import json
import os

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell_5_source = """def generate_scribe_project():
    import html
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
        
    xml_path = os.path.join(BUILD_DIR, "drawing.xml")
    
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\\n<drawing>\\n')
        
        for i, meta in enumerate(meta_data):
            file_path = os.path.join(ASSETS_DIR, meta['file_name'])
            # Hỗ trợ ghi đè file có đuôi khác
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
                
            duration = meta['end'] - meta['start']
            
            pos_x = 1200 * (i % 3)
            pos_y = 800 * int(i / 3)
            
            elem_type = 'drawing' if is_svg else 'image'
            
            # AI Context-Aware Animation Engine v3.0
            import random
            ai_style = meta.get('animation_style', 'draw')
            ai_pace = meta.get('pace', 'normal')
            ai_color = meta.get('color_filter', 'normal')
            
            # Map style to DrawStyle and Hand
            if ai_style == 'draw':
                draw_style = 'draw_style_normal'
            elif ai_style == 'movein_hand':
                draw_style = 'draw_style_movein'
            elif ai_style == 'movein_nohand':
                draw_style = 'draw_style_movein'
            elif ai_style == 'fadein':
                draw_style = 'draw_style_fadein'
            else:
                draw_style = 'draw_style_normal'
            
            # Phá lệ nếu là ảnh PNG mà AI vẫn đòi draw (sẽ xấu), ép sang movein_hand
            if not is_svg and ai_style == 'draw':
                draw_style = 'draw_style_movein'
            
            movin_compass = str(random.randint(1, 8))
            draw_detail = 'yes' if ai_style == 'draw' else 'no'
            movin_arc = random.choice(['1', '2'])
            
            # Map Pace to Time and Bounce
            if ai_pace == 'fast':
                target_time_ms = 500
                movin_flow = '2' # Bounce
            elif ai_pace == 'slow':
                target_time_ms = max(1500, int((duration - 0.5) * 1000))
                movin_flow = '0' # Smooth
            else:
                target_time_ms = max(800, min(1200, int(duration * 1000)))
                movin_flow = '0'
                
            # Cân chỉnh lại cho hợp lý nếu time quá ngắn
            if target_time_ms < 300: target_time_ms = 300
            
            # Map Color Filter
            color_effect = '2' if ai_color == 'greyscale' else '0'
            
            # Escape drawingXML
            drawing_xml_attr = f'drawingXML="{html.escape(content, quote=True)}"' if is_svg else f'imageRef="{actual_filename}"'
            
            # BỎ customHandMD5 vì nó gây lỗi nếu gán sai ID.
            f.write(f'''  <element elementType="{elem_type}" {drawing_xml_attr} colourEffect="{color_effect}" drawStyle="{draw_style}" movinCompass="{movin_compass}" movinFlow="{movin_flow}" movinArc="{movin_arc}" movinAllowRotate="yes" drawDetail="{draw_detail}" targetTime="{target_time_ms}" pauseTime="500" transitionTime="500" currentPosX="{pos_x}" currentPosY="{pos_y}" cameraPositionX="{pos_x}" cameraPositionY="{pos_y}" cameraScale="1.0" />\\n''')
            
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
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án của bạn: {output_filename}")

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

print("Notebook cell 5 updated successfully with proper XML attributes.")
