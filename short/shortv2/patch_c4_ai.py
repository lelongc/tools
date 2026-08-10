import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

c4_source = nb['cells'][4]['source']
for i, line in enumerate(c4_source):
    if 'char_dir = random.choice(chars)' in line:
        replacement = '''    char_names = [d.name for d in chars]
    print(f"🤖 Đang nhờ AI phân tích chủ đề để chọn nhân vật phù hợp nhất từ {len(char_names)} nhân vật...")
    char_dir = None
    try:
        api_key = get_effective_gemini_key("")
        if api_key:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.5-flash")
            import random
            fallback = random.choice(char_names)
            prompt = f"Topic of the YouTube short: '{topic}'. Anime: '{anime_name}'.\\nAvailable character folders: {char_names}\\nBased on the topic, which character is the MOST relevant? Return ONLY the exact folder name from the list. If you are not sure or none match, return '{fallback}'."
            response = model.generate_content(prompt)
            chosen = response.text.strip()
            for c in ["'", '"', '', '*', '\\n']:
                chosen = chosen.replace(c, '')
            if chosen in char_names:
                char_dir = base_dir / chosen
                print(f"🤖 AI đã chọn nhân vật: {chosen}")
            else:
                print(f"🤖 AI chọn '{chosen}' không khớp danh sách, chọn ngẫu nhiên...")
        else:
            print("⚠️ Không có API Key, chọn ngẫu nhiên...")
    except Exception as e:
        print(f"⚠️ Lỗi gọi AI ({e}), chọn ngẫu nhiên...")
        
    if not char_dir:
        import random
        char_dir = random.choice(chars)
        print(f"🎲 Đã chọn ngẫu nhiên nhân vật: {char_dir.name}")
'''
        c4_source[i] = replacement
        break

nb['cells'][4]['source'] = c4_source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
