import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        new_source = []
        for line in cell['source']:
            if '&lt;recolouringSchemes/&gt;' in line:
                line = line.replace('&lt;recolouringSchemes/&gt;', '&lt;recolouringSchemes/>')
                print("Fixed recolouringSchemes!")
            new_source.append(line)
        cell['source'] = new_source

with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)
print("Saved.")
