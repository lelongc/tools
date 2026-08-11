import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Patch Cell 3 to add bulletproof safety check for `scenes`
cell_3_lines = nb['cells'][6]['source']

# Insert safety check right before `if len(scenes) == 0:`
new_cell_3_lines = []
for line in cell_3_lines:
    if "if len(scenes) == 0:" in line:
        new_cell_3_lines.append("if 'scenes' not in locals() and 'scenes' not in globals(): scenes = []\n")
    new_cell_3_lines.append(line)

nb['cells'][6]['source'] = new_cell_3_lines

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)

print("Bulletproof fix applied successfully!")
