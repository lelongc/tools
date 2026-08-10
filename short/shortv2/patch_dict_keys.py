import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if "sc_key = sc.get('character_key', '').strip()" in line:
                source[i] = "            sc_key = (sc.get('character_key') or sc.get('character_folder') or '').strip()\n"
        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
