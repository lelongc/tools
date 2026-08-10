import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if 'statics = list(cdir.glob("*.jpg"))' in line:
                replacement = '''                statics = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp")) + list(cdir.glob("*.JPG")) + list(cdir.glob("*.PNG")) + list(cdir.glob("*.JPEG")) + list(cdir.glob("*.WEBP"))
'''
                source[i] = replacement
        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
