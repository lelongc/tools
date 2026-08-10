import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        source = cell['source']
        for i, line in enumerate(source):
            if 'patch_bgra = cv2.cvtColor(np.array(patch_img), cv2.COLOR_RGBA2BGRA)' in line:
                replacement = '''
            # Gracefully scale down if the text patch is too wide for the screen
            if pw > TARGET_W - 40:
                scale = (TARGET_W - 40) / pw
                patch_img = patch_img.resize((int(pw * scale), int(ph * scale)), Image.Resampling.LANCZOS)
                pw, ph = patch_img.size

            patch_bgra = cv2.cvtColor(np.array(patch_img), cv2.COLOR_RGBA2BGRA)
'''
                source[i] = replacement
                break
        cell['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
