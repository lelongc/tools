import json

with open('anime_short.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

source = nb['cells'][3]['source']
for i, line in enumerate(source):
    if 'fetch_all_btn = widgets.Button' in line:
        source[i] = "fetch_all_btn = widgets.Button(description='⚠️ TẢI TOÀN BỘ (CẨN THẬN)', button_style='danger', layout=widgets.Layout(width='250px'))\n"
    if 'tab1_content = widgets.VBox([' in line:
        pass
    if 'fetch_all_btn\n' == line or 'fetch_all_btn' in line and line.strip() == 'fetch_all_btn':
        source[i] = "    widgets.HBox([widgets.HTML('<span style=\"color:gray; font-size:12px\">Khu vực nguy hiểm (Dễ đầy bộ nhớ):</span>'), fetch_all_btn], layout=widgets.Layout(justify_content='flex-end'))\n"
        
nb['cells'][3]['source'] = source

with open('anime_short.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1, ensure_ascii=False)
