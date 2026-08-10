import json
with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)
with open('cell2_dump.py', 'w', encoding='utf-8') as f:
    f.write(''.join(nb['cells'][2]['source']))
