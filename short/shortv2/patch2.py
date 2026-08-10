import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Fix Cell 4
c4_source = nb['cells'][4]['source']
for i, line in enumerate(c4_source):
    if 'Path(\"d:/folder/tools/short/library\")' in line:
        c4_source[i] = line.replace('Path(\"d:/folder/tools/short/library\")', 'BASE_LIBRARY_DIR')
    if 'if __name__ == \"__main__\":' in line:
        c4_source = c4_source[:i]
        break

c4_source.append("\n# --- TÙY CHỈNH Ở ĐÂY ---\n")
c4_source.append("anime_for_thumb = 'Tensei_Slime'\n")
c4_source.append("topic_for_thumb = 'The Truth About Rimuru'\n")
c4_source.append("generate_thumbnail(anime_for_thumb, topic_for_thumb, 'thumbnail.jpg')\n")
c4_source.append("from IPython.display import Image as IPImage, display\n")
c4_source.append("display(IPImage('thumbnail.jpg'))\n")
nb['cells'][4]['source'] = c4_source

# Fix Cell 5
c5_source = nb['cells'][5]['source']
for i, line in enumerate(c5_source):
    if 'if __name__ == \"__main__\":' in line:
        c5_source = c5_source[:i]
        break

c5_source.append("\n# --- TÙY CHỈNH Ở ĐÂY ---\n")
c5_source.append("api_key = get_effective_gemini_key('') # Lấy API Key tự động từ biến môi trường\n")
c5_source.append("topic_for_seo = 'The Truth About Rimuru'\n")
c5_source.append("script_text_for_seo = 'Put your generated script here...'\n")
c5_source.append("if api_key:\n")
c5_source.append("    generate_youtube_metadata(topic_for_seo, script_text_for_seo, api_key)\n")
c5_source.append("else:\n")
c5_source.append("    print('❌ Không tìm thấy API Key!')\n")
nb['cells'][5]['source'] = c5_source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
