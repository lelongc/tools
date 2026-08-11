import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

with open('auto_scribe_temp.py', 'w', encoding='utf-8') as f2:
    f2.write('''import sys, io, types
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
google_mock = types.ModuleType("google")
google_mock.colab = types.ModuleType("colab")
google_mock.colab.drive = types.ModuleType("drive")
google_mock.colab.drive.mount = lambda *args, **kwargs: None
sys.modules["google"] = google_mock
sys.modules["google.colab"] = google_mock.colab
sys.modules["google.colab.drive"] = google_mock.colab.drive
''')
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            src = ''.join(cell['source'])
            for line in src.split('\n'):
                if not line.strip().startswith('!'):
                    f2.write(line + '\n')
            f2.write('\n\n')
