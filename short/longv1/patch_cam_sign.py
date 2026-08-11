import json
import os

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell['cell_type'] == 'code':
        source = ''.join(cell['source'])
        if 'cam_x = scene_x' in source:
            new_source = source.replace('cam_x = scene_x', 'cam_x = -scene_x')
            new_source = new_source.replace('cam_y = scene_y', 'cam_y = -scene_y')
            cell['source'] = [l + '\n' for l in new_source.split('\n')]
            cell['source'][-1] = cell['source'][-1].strip()

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Notebook cell 5 camera coordinates inverted.")
