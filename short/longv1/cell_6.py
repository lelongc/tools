def search_local_svg(query, database_dir):
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

if 'scenes' not in locals() and 'scenes' not in globals(): scenes = []
if len(scenes) == 0:
    print("⚠️ Lỗi: Không có cảnh nào.")
else:
    for i in range(0, len(scenes), BATCH_SIZE):
        batch_scenes = scenes[i:i+BATCH_SIZE]
        prompt_scenes_text = "".join([f"ID: {i+j+1} | Câu thoại: \"{s['text']}\"\n" for j, s in enumerate(batch_scenes)])
            
        prompt_instruction = f"""
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
        """
        
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
