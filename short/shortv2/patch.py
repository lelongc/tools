import json
import os

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Find cell 3 (ipywidgets UI)
source = nb['cells'][3]['source']
for i, line in enumerate(source):
    if 'del_anime_btn = ' in line:
        source[i] = '# ' + line
    if 'del_char_btn = ' in line:
        source[i] = '# ' + line
    if 'del_anime_btn.on_click(' in line:
        source[i] = '# ' + line
    if 'del_char_btn.on_click(' in line:
        source[i] = '# ' + line
    if 'widgets.HBox([anime_dd, load_anime_btn, del_anime_btn])' in line:
        source[i] = line.replace('del_anime_btn', '')
    if 'widgets.HBox([widgets.Label(\"Nhân vật:\"), char_sel, del_char_btn])' in line:
        source[i] = line.replace(', del_char_btn', '')

nb['cells'][3]['source'] = source

# Read c4_thumbnail.py and c5_metadata.py
with open('c4_thumbnail.py', 'r', encoding='utf-8') as f:
    c4 = f.readlines()
with open('c5_metadata.py', 'r', encoding='utf-8') as f:
    c5 = f.readlines()

# Add a title comment to c4 and c5
c4.insert(0, '# @title 4. TẠO THUMBNAIL CHO SHORTS\n')
c5.insert(0, '# @title 5. TẠO YOUTUBE METADATA (SEO)\n')

# Append to notebook
nb['cells'].append({
    'cell_type': 'code',
    'execution_count': None,
    'metadata': {'id': 'cell-4'},
    'outputs': [],
    'source': c4
})
nb['cells'].append({
    'cell_type': 'code',
    'execution_count': None,
    'metadata': {'id': 'cell-5'},
    'outputs': [],
    'source': c5
})

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print('Successfully patched anime_short.ipynb')
