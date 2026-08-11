import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

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
MODEL_ID = "gemini-2.5-flash"
BATCH_SIZE = 5
scene_metadata = []

print("🤖 Đang phân tích kịch bản bằng Gemini và lục lọi ảnh trong Google Drive...")

if len(scenes) == 0:
    print("⚠️ Lỗi: Không có cảnh nào.")
else:
    for i in range(0, len(scenes), BATCH_SIZE):
        batch_scenes = scenes[i:i+BATCH_SIZE]
        prompt_scenes_text = "".join([f"ID: {i+j+1} | Text: \\"{s['text']}\\"\\n" for j, s in enumerate(batch_scenes)])
            
        prompt_instruction = f\"\"\"
        Đạo diễn Whiteboard Animation. Câu thoại:
        {prompt_scenes_text}
        
        Trả về DUY NHẤT 1 MẢNG JSON ARRAY. Phân tích thật kỹ ngữ cảnh để quyết định hiệu ứng. Mỗi phần tử:
        - "id": ID câu thoại
        - "visual_concept": Ý tưởng hình ảnh (Tiếng Việt)
        - "svg_search_prompt": Từ khóa tìm kiếm hình ảnh NGẮN GỌN (1-3 từ Tiếng Anh)
        - "animation_style": Chọn 1 trong 4: "draw" (vẽ tay chậm rãi), "movein_hand" (tay thò ra đẩy ảnh vào màn hình), "movein_nohand" (ảnh tự đập/trượt nhanh vào màn hình), "fadein" (xuất hiện mờ ảo).
        - "pace": Chọn nhịp độ: "slow" (chậm), "normal" (vừa), "fast" (nhanh/kịch tính).
        - "color_filter": Chọn: "normal" hoặc "greyscale" (đen trắng, dùng cho quá khứ/hồi tưởng).
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
                    result = next((item for item in batch_data if item.get("id") == scene_id), None)
                    if result:
                        meta = {
                            "start": s['start'], "end": s['end'], "speech_text": s['text'],
                            "visual_concept": result.get("visual_concept", ""),
                            "svg_search_prompt": result.get("svg_search_prompt", ""),
                            "animation_style": result.get("animation_style", "draw"),
                            "pace": result.get("pace", "normal"),
                            "color_filter": result.get("color_filter", "normal"),
                            "file_name": f"scene_{scene_id:03d}.svg"
                        }
                        
                        # TÌM ẢNH TRONG GOOGLE DRIVE
                        best_match = search_local_svg(meta['svg_search_prompt'], DRIVE_IMAGE_DIR)
                        if best_match:
                            meta['file_name'] = f"scene_{scene_id:03d}{os.path.splitext(best_match)[1]}"
                            shutil.copy(best_match, os.path.join(ASSETS_DIR, meta['file_name']))
                            meta['source'] = f"✅ Đã bốc từ Drive: {os.path.basename(best_match)}"
                        else:
                            meta['source'] = "❌ KHÔNG TÌM THẤY ẢNH KHỚP (Cần tự chèn)"
                            with open(os.path.join(ASSETS_DIR, f"scene_{scene_id:03d}_THIEU.txt"), 'w') as temp: temp.write("Thieu anh")
                            
                        scene_metadata.append(meta)
                break
            except Exception as e:
                print(f"Lỗi Batch {i//BATCH_SIZE+1}: {e}. Thử lại...")
                time.sleep(5)
        time.sleep(2)

    with open("scene_metadata.json", "w", encoding="utf-8") as f:
        json.dump(scene_metadata, f, ensure_ascii=False, indent=2)
    print("🎉 Hoàn tất bốc ảnh từ Drive!")
"""

cell_5_source = """def generate_scribe_project():
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
                content = f"<image src='{actual_filename}' width='800' height='600' />"
                
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
                hand_choice = '' # Default drawing hand
            elif ai_style == 'movein_hand':
                draw_style = 'draw_style_movein'
                hand_choice = '' # Default pushing hand
            elif ai_style == 'movein_nohand':
                draw_style = 'draw_style_movein'
                hand_choice = 'default_nohand'
            elif ai_style == 'fadein':
                draw_style = 'draw_style_fadein'
                hand_choice = 'default_nohand'
            else:
                draw_style = 'draw_style_normal'
                hand_choice = ''
            
            # Phá lệ nếu là ảnh PNG mà AI vẫn đòi draw (sẽ xấu), ép sang movein_hand
            if not is_svg and ai_style == 'draw':
                draw_style = 'draw_style_movein'
                hand_choice = ''
            
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
            filter_str = "<filters/>"
            if ai_color == 'greyscale':
                filter_str = '''<filters>\\n  <filter filterType="greyscale" distance="4" amount="30" blurX="4" blurY="4" angle="120" colour="0"/>\\n</filters>'''
            
            f.write(f'''  <element elementType="{elem_type}" drawStyle="{draw_style}" customHandMD5="{hand_choice}" movinCompass="{movin_compass}" movinFlow="{movin_flow}" movinArc="{movin_arc}" movinAllowRotate="yes" drawDetail="{draw_detail}" targetTime="{target_time_ms}" pauseTime="500" transitionTime="500" currentPosX="{pos_x}" currentPosY="{pos_y}" cameraPositionX="{pos_x}" cameraPositionY="{pos_y}" cameraScale="1.0">\\n''')
            f.write(f'''    {filter_str}\\n''')
            if is_svg:
                f.write(f'''    <drawingXML><![CDATA[{content}]]></drawingXML>\\n''')
            else:
                f.write(f'''    <imageRef>{actual_filename}</imageRef>\\n''')
            f.write('''  </element>\\n''')
            
        if os.path.exists(AUDIO_FILE):
            f.write('''  <audio volume="1.0" loop="false">\\n    <file>voiceover.mp3</file>\\n  </audio>\\n''')
            
        f.write('</drawing>')

    output_filename = "Auto_Project.scribe"
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUILD_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BUILD_DIR)
                zipf.write(file_path, arcname)
                    
    print(f"\\n🎉 ĐÃ HOÀN TẤT! File dự án của bạn: {output_filename}")

generate_scribe_project()
"""

# Replace the cells
for cell in nb.get('cells', []):
    if cell['cell_type'] == 'code':
        source = ''.join(cell['source'])
        if 'def search_local_svg' in source:
            cell['source'] = [l + '\n' for l in cell_3_source.split('\n')]
            cell['source'][-1] = cell['source'][-1].strip() # remove trailing newline
        elif 'def generate_scribe_project' in source:
            cell['source'] = [l + '\n' for l in cell_5_source.split('\n')]
            cell['source'][-1] = cell['source'][-1].strip()

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Context-Aware AI Director patched successfully!")
