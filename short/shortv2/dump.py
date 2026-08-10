import json
with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)
with open('cell3_dump.py', 'w', encoding='utf-8') as f:
    f.write(''.join(nb['cells'][3]['source']))
