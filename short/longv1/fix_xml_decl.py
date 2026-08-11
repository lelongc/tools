import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        new_source = []
        for line in cell['source']:
            if '<?xml version="1.0" encoding="UTF-8"?>' in line:
                line = line.replace('<?xml version="1.0" encoding="UTF-8"?>\\n', '')
                print("Removed XML declaration!")
            new_source.append(line)
        cell['source'] = new_source

with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)
print("Saved.")
