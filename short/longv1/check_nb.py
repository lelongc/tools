import json
with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)
    for i, c in enumerate(nb['cells']):
        if c['cell_type'] == 'code':
            source = ''.join(c['source'])
            print(f'Cell {i} length: {len(source)}')
            if 'pip install' in source:
                print(f'  Contains pip install')
            if 'prompt =' in source or 'f"""' in source:
                print(f'  Contains prompt')
            if 'def generate_scribe_project' in source:
                print(f'  Contains generate_scribe_project')
