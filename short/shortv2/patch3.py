import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Fix del_anime_btn in HBox
source = nb['cells'][3]['source']
for i, line in enumerate(source):
    if 'widgets.HBox([anime_dropdown, new_anime_input, add_anime_btn, del_anime_btn])' in line:
        source[i] = line.replace(', del_anime_btn', '')
        
# Also fix add_anime_btn.on_click
for i, line in enumerate(source):
    if '# add_anime_btn.on_click(on_add_anime); del_anime_btn.on_click(on_del_anime)' in line:
        source[i] = "add_anime_btn.on_click(on_add_anime)\n"

nb['cells'][3]['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
