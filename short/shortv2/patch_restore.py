import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Restore del_char_btn in Cell 3
source = nb['cells'][3]['source']
for i, line in enumerate(source):
    if line.startswith('# ') and 'del_char_btn = ' in line:
        source[i] = line[2:]
    if line.startswith('# ') and 'del_char_btn.on_click(' in line:
        source[i] = line[2:]
    # Previously we removed del_char_btn from the HBox: 
    # original: widgets.HBox([widgets.Label("Nhân vật:"), char_sel, del_char_btn])
    # modified: widgets.HBox([widgets.Label("Nhân vật:"), char_sel])
    if 'widgets.HBox([widgets.Label("Nhân vật:"), char_sel])' in line:
        source[i] = line.replace('char_sel])', 'char_sel, del_char_btn])')

nb['cells'][3]['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
