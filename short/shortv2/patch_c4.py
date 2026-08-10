import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

c4_source = nb['cells'][4]['source']
for i, line in enumerate(c4_source):
    if "display(IPImage('thumbnail.jpg'))" in line:
        c4_source[i] = "if os.path.exists('thumbnail.jpg'):\n    display(IPImage('thumbnail.jpg'))\nelse:\n    print('❌ Không thể hiển thị Thumbnail vì quá trình tạo ảnh thất bại!')\n"

nb['cells'][4]['source'] = c4_source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
