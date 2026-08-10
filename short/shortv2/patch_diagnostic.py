import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Add a diagnostic print inside build_semantic_timeline
for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if 'available_chars = list(set(list(char_static_map.keys()) + list(char_gif_map.keys())))' in line:
                replacement = '''    available_chars = list(set(list(char_static_map.keys()) + list(char_gif_map.keys())))
    print("=== CHUẨN ĐOÁN LỖI KHỚP NHÂN VẬT ===")
    print(f"Nhân vật AI đã chọn (từ STAGE 2): {[sc.get('character_key') for sc in (scenes or [])]}")
    print(f"Nhân vật CÓ ẢNH thực tế trên ổ cứng Colab: {available_chars}")
    print("====================================")
'''
                source[i] = replacement
        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
