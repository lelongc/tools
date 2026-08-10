import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if 'available_chars = list(json.loads(conf_path.read_text' in line:
                replacement = '''    available_chars = []
    if conf_path.exists():
        try:
            available_chars = list(json.loads(conf_path.read_text(encoding="utf-8")).keys())
        except:
            pass
    if not available_chars:
        # Fallback to reading directory names if JSON is missing or empty
        if anime_dir.exists():
            for cdir in anime_dir.iterdir():
                if cdir.is_dir() and cdir.name != "output_shorts":
                    available_chars.append(cdir.name)
'''
                source[i] = replacement

        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
