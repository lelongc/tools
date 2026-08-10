import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if 'statics = list(cdir.glob("*.jpg"))' in line:
                source[i] = '                statics = list(cdir.rglob("*.jpg")) + list(cdir.rglob("*.png")) + list(cdir.rglob("*.jpeg")) + list(cdir.rglob("*.webp")) + list(cdir.rglob("*.JPG")) + list(cdir.rglob("*.PNG")) + list(cdir.rglob("*.JPEG")) + list(cdir.rglob("*.WEBP"))\n'
            elif 'gifs = list(cdir.glob("*.gif")) + list(cdir.glob("*.GIF"))' in line:
                source[i] = '                gifs = list(cdir.rglob("*.gif")) + list(cdir.rglob("*.GIF"))\n'
            elif 'gif_subdir = cdir / "gif"' in line:
                source[i] = '                # Removed gif_subdir specific check since we use rglob now\n'
            elif 'if gif_subdir.exists():' in line:
                source[i] = '                pass\n'
            elif 'gifs += list(gif_subdir.glob("*.gif")) + list(gif_subdir.glob("*.GIF"))' in line:
                source[i] = '                pass\n'
        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
