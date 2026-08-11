import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell_5_lines = nb['cells'][10]['source']

new_cell_5_lines = []
for line in cell_5_lines:
    if 'scalesX="0.5" scalesY="0.5" theScale="0.8"' in line:
        line = line.replace('scalesX="0.5" scalesY="0.5" theScale="0.8"', 'scalesX="0.8" scalesY="0.8" theScale="0.8"')
    new_cell_5_lines.append(line)

nb['cells'][10]['source'] = new_cell_5_lines

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Scale deadlock fix applied successfully (scalesX=0.8, scalesY=0.8, theScale=0.8)!")
