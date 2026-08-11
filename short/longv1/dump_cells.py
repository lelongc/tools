import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i in [2, 6, 10]:
    with open(f'cell_{i}.py', 'w', encoding='utf-8') as out:
        out.write(''.join(nb['cells'][i]['source']))
        
print("Dumped cells")
