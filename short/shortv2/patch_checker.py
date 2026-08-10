import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Insert a new cell before the video generation cell
new_cell = {
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "outputs": [],
    "source": [
        "# CHẠY CELL NÀY ĐỂ KIỂM TRA XEM PYTHON CÓ NHÌN THẤY ẢNH CỦA BẠN KHÔNG!\n",
        "import json\n",
        "from pathlib import Path\n",
        "\n",
        "def kiem_tra_anh_tren_drive():\n",
        "    anime_name = anime_dropdown.value\n",
        "    if not anime_name:\n",
        "        print(\"Vui lòng chọn Anime ở trên trước!\")\n",
        "        return\n",
        "    \n",
        "    print(\"=\"*50)\n",
        "    print(f\"KIỂM TRA ẢNH NHÂN VẬT: {anime_name}\")\n",
        "    print(\"=\"*50)\n",
        "    \n",
        "    anime_dir = BASE_LIBRARY_DIR / anime_name\n",
        "    conf_path = anime_dir / \"characters_config.json\"\n",
        "    \n",
        "    if not conf_path.exists():\n",
        "        print(\"Không tìm thấy file characters_config.json\")\n",
        "        return\n",
        "        \n",
        "    chars = json.loads(conf_path.read_text(encoding=\"utf-8\")).keys()\n",
        "    for c in chars:\n",
        "        cdir = anime_dir / c\n",
        "        if not cdir.exists():\n",
        "            print(f\"❌ [{c}]: THƯ MỤC BỊ THIẾU HOẶC COLAB CHƯA NHẬN DIỆN ĐƯỢC!\")\n",
        "            continue\n",
        "            \n",
        "        imgs = list(cdir.rglob(\"*.jpg\")) + list(cdir.rglob(\"*.png\")) + list(cdir.rglob(\"*.jpeg\")) + list(cdir.rglob(\"*.webp\")) + list(cdir.rglob(\"*.JPG\")) + list(cdir.rglob(\"*.PNG\")) + list(cdir.rglob(\"*.JPEG\")) + list(cdir.rglob(\"*.WEBP\")) + list(cdir.rglob(\"*.gif\")) + list(cdir.rglob(\"*.GIF\"))\n",
        "        if len(imgs) == 0:\n",
        "            print(f\"❌ [{c}]: CÓ THƯ MỤC NHƯNG CÓ 0 TẤM ẢNH! (Tool sẽ tự bỏ qua nhân vật này)\")\n",
        "        else:\n",
        "            print(f\"✅ [{c}]: Tuyệt vời, tìm thấy {len(imgs)} tấm ảnh.\")\n",
        "            \n",
        "    print(\"=\"*50)\n",
        "    print(\"Nếu báo 0 tấm ảnh hoặc thư mục thiếu DÙ BẠN THẤY NÓ TRÊN DRIVE:\")\n",
        "    print(\"-> Hãy bấm Runtime > Disconnect and delete runtime > Chạy lại từ đầu để làm mới Drive!\")\n",
        "\n",
        "kiem_tra_anh_tren_drive()\n"
    ]
}

# Find the index of the video generation cell
target_idx = 0
for i, cell in enumerate(nb['cells']):
    if 'code' == cell['cell_type'] and ''.join(cell['source']).find('generate_video_short') != -1 and ''.join(cell['source']).find('def generate_video_short') == -1:
        target_idx = i
        break

if target_idx > 0:
    nb['cells'].insert(target_idx, new_cell)
else:
    nb['cells'].append(new_cell)

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
