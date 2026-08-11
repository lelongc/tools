import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

# 1. Update Cell 2
cell2 = nb['cells'][2]['source']
new_cell2 = []
for line in cell2:
    new_cell2.append(line)
    if 'pip install' in line and 'vtracer' not in line:
        new_cell2[-1] = new_cell2[-1].replace('\n', '') + ' vtracer\n'
nb['cells'][2]['source'] = new_cell2


# 2. Update Cell 6 (Prompt)
cell6 = "".join(nb['cells'][6]['source'])

new_cell6 = cell6.replace(
    'Đạo diễn Whiteboard Animation. Mỗi CÂU THOẠI cần 2 đến 3 HÌNH ẢNH đại diện vẽ lần lượt trong cùng 1 khung cảnh.',
    'Đạo diễn Whiteboard Animation. Bạn MỚI nhận được TỔNG SỐ LƯỢNG ẢNH CẦN TẠO cho mỗi câu thoại. Hãy tạo đúng số ảnh được yêu cầu cho từng câu thoại.'
)

new_cell6 = new_cell6.replace(
    'prompt_scenes_text = "".join([f"ID: {i+j+1} | Câu thoại: \\"{s[\'text\']}\\"\\n" for j, s in enumerate(batch_scenes)])',
    '''prompt_scenes_text = ""
        for j, s in enumerate(batch_scenes):
            duration = s['end'] - s['start']
            num_images = max(1, int(round(duration / 3.5)))
            prompt_scenes_text += f"ID: {i+j+1} | CẦN TẠO ĐÚNG {num_images} ẢNH | Thời lượng: {duration:.1f}s | Câu thoại: \\"{s['text']}\\"\\n"'''
)

new_cell6 = new_cell6.replace(
    '"images": Mảng chứa 2 đến 3 đối tượng hình ảnh:',
    '"images": Mảng chứa ĐÚNG SỐ LƯỢNG HÌNH ẢNH ĐƯỢC YÊU CẦU cho câu thoại đó:'
)

new_cell6 = new_cell6.replace(
    'print("🤖 Đang phân tích kịch bản bằng Gemini (Mỗi câu thoại tạo 2-3 ảnh) & rút ảnh từ Drive...")',
    'print("🤖 Đang phân tích kịch bản bằng Gemini (Tự tính số ảnh theo độ dài thoại 3-4s/ảnh) & rút ảnh từ Drive...")'
)
nb['cells'][6]['source'] = [line + '\n' for line in new_cell6.split('\n')][:-1]
if not new_cell6.endswith('\n'):
    nb['cells'][6]['source'][-1] = nb['cells'][6]['source'][-1].rstrip('\n')


# 3. Update Cell 10 (generate_scribe_project)
cell10 = "".join(nb['cells'][10]['source'])

# vtracer replacement
old_svg_logic = """                if is_svg:
                    with open(file_path, "r", encoding="utf-8") as f2:
                        raw_svg = f2.read(); raw_svg = re.sub(r'<\\?xml[^>]*\\?>', '', raw_svg); raw_svg = re.sub(r'<!DOCTYPE[^>]*>', '', raw_svg); raw_svg = re.sub(r'<!--.*?-->', '', raw_svg, flags=re.DOTALL); content = raw_svg.replace('\\n', ' ').replace('\\r', '')
                else:
                    import base64
                    with open(file_path, "rb") as f2:
                        b64_data = base64.b64encode(f2.read()).decode('ascii')
                    content = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><image href="data:image/png;base64,{b64_data}" width="800" height="800"/></svg>'"""

new_svg_logic = """                if not is_svg:
                    # Chuyển đổi ảnh bitmap thành vector SVG bằng vtracer
                    import vtracer
                    vectorized_svg_path = file_path + ".vectorized.svg"
                    try:
                        vtracer.convert_image_to_svg_py(
                            file_path,
                            vectorized_svg_path,
                            colormode='color',
                            hierarchical='stacked',
                            mode='spline',
                            filter_speckle=4,
                            color_precision=6,
                            layer_difference=16,
                            corner_threshold=60,
                            length_threshold=4.0,
                            max_iterations=10,
                            splice_threshold=45,
                            path_precision=3
                        )
                        file_path = vectorized_svg_path
                        print(f"🎨 Đã vector hóa thành công: {actual_filename}")
                    except Exception as e:
                        print(f"Lỗi vector hóa {actual_filename}: {e}. Dùng SVG rỗng tạm.")
                        with open(vectorized_svg_path, "w", encoding="utf-8") as tmp_f:
                            tmp_f.write('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>')
                        file_path = vectorized_svg_path

                with open(file_path, "r", encoding="utf-8") as f2:
                    raw_svg = f2.read()
                    raw_svg = re.sub(r'<\\?xml[^>]*\\?>', '', raw_svg)
                    raw_svg = re.sub(r'<!DOCTYPE[^>]*>', '', raw_svg)
                    raw_svg = re.sub(r'<!--.*?-->', '', raw_svg, flags=re.DOTALL)
                    content = raw_svg.replace('\\n', ' ').replace('\\r', '')"""

cell10 = cell10.replace(old_svg_logic, new_svg_logic)

# Timing logic replacement
old_timing_logic = """                total_time_ms = int(duration_per_img * 1000)
                trans_time_ms = min(400, int(total_time_ms * 0.2))
                target_time_ms = min(3000, int(total_time_ms * 0.6))
                pause_time_ms = max(0, total_time_ms - trans_time_ms - target_time_ms)"""

new_timing_logic = """                total_time_ms = int(duration_per_img * 1000)
                trans_time_ms = min(800, int(total_time_ms * 0.15)) # Tối đa 0.8s chuyển cảnh
                target_time_ms = int(total_time_ms * 0.80)          # 80% thời gian dành cho việc vẽ ảnh! Rất sinh động
                pause_time_ms = max(0, total_time_ms - trans_time_ms - target_time_ms) # Chỉ còn ~5% thời gian nghỉ ngơi"""

cell10 = cell10.replace(old_timing_logic, new_timing_logic)

nb['cells'][10]['source'] = [line + '\n' for line in cell10.split('\n')][:-1]
if not cell10.endswith('\n'):
    nb['cells'][10]['source'][-1] = nb['cells'][10]['source'][-1].rstrip('\n')

with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, ensure_ascii=False, indent=2)

print("Notebook updated successfully!")
