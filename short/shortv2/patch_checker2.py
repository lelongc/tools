import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'code' == cell['cell_type']:
        if 'kiem_tra_anh_tren_drive' in ''.join(cell['source']):
            cell['source'] = [
                "# CHẠY CELL NÀY ĐỂ KIỂM TRA XEM PYTHON CÓ NHÌN THẤY ẢNH CỦA BẠN KHÔNG!\n",
                "import json\n",
                "from pathlib import Path\n",
                "\n",
                "def kiem_tra_anh_tren_drive():\n",
                "    BASE_LIBRARY_DIR = Path('/content/drive/MyDrive/anime_library')\n",
                "    # Tự động tìm thư mục anime mới nhất có characters_config.json\n",
                "    animes = [d for d in BASE_LIBRARY_DIR.iterdir() if d.is_dir() and (d / 'characters_config.json').exists()]\n",
                "    if not animes:\n",
                "        print('Không tìm thấy bất kỳ thư mục Anime nào có chứa characters_config.json')\n",
                "        return\n",
                "    \n",
                "    # Lấy thư mục anime được tạo gần đây nhất hoặc chọn Tensei_Slime nếu có\n",
                "    anime_dir = next((a for a in animes if 'Tensei_Slime' in a.name), animes[0])\n",
                "    anime_name = anime_dir.name\n",
                "    \n",
                "    print('='*50)\n",
                "    print(f'KIỂM TRA ẢNH NHÂN VẬT: {anime_name}')\n",
                "    print('='*50)\n",
                "    \n",
                "    conf_path = anime_dir / 'characters_config.json'\n",
                "    \n",
                "    try:\n",
                "        chars = json.loads(conf_path.read_text(encoding='utf-8')).keys()\n",
                "    except Exception as e:\n",
                "        print(f'Lỗi khi đọc file characters_config.json: {e}')\n",
                "        return\n",
                "        \n",
                "    for c in chars:\n",
                "        cdir = anime_dir / c\n",
                "        if not cdir.exists():\n",
                "            print(f'❌ [{c}]: THƯ MỤC BỊ THIẾU HOẶC COLAB CHƯA NHẬN DIỆN ĐƯỢC!')\n",
                "            continue\n",
                "            \n",
                "        try:\n",
                "            imgs = list(cdir.rglob('*.jpg')) + list(cdir.rglob('*.png')) + list(cdir.rglob('*.jpeg')) + list(cdir.rglob('*.webp')) + list(cdir.rglob('*.JPG')) + list(cdir.rglob('*.PNG')) + list(cdir.rglob('*.JPEG')) + list(cdir.rglob('*.WEBP')) + list(cdir.rglob('*.gif')) + list(cdir.rglob('*.GIF'))\n",
                "            if len(imgs) == 0:\n",
                "                print(f'❌ [{c}]: CÓ THƯ MỤC NHƯNG CÓ 0 TẤM ẢNH! (Tool sẽ tự bỏ qua nhân vật này)')\n",
                "            else:\n",
                "                print(f'✅ [{c}]: Tuyệt vời, tìm thấy {len(imgs)} tấm ảnh.')\n",
                "        except Exception as e:\n",
                "            print(f'❌ [{c}]: Lỗi khi quét ảnh: {e}')\n",
                "            \n",
                "    print('='*50)\n",
                "    print('Nếu báo 0 tấm ảnh hoặc thư mục thiếu DÙ BẠN THẤY NÓ TRÊN DRIVE:')\n",
                "    print('-> Hãy bấm Runtime > Disconnect and delete runtime > Chạy lại từ đầu để làm mới Drive!')\n",
                "\n",
                "kiem_tra_anh_tren_drive()\n"
            ]

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
