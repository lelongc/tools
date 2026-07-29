import ipywidgets as widgets
from IPython.display import display, clear_output
import json
from pathlib import Path
import os

CONFIG_PATH = Path('/content/drive/MyDrive/anime_library/anime_characters_config.json')

DEFAULT_DATA = {
    "Tensei_Slime": {
        "Rimuru_Tempest": ["Rimuru Tempest Tensei Shitara Slime Datta Ken", "Rimuru Demon Lord"],
        "Veldora_Tempest": ["Veldora Tempest Tensei Shitara Slime Datta Ken"],
        "Milim_Nava": ["Milim Nava Tensei Shitara Slime Datta Ken"]
    }
}

config_data = {}

def load_config():
    global config_data
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
        except:
            config_data = DEFAULT_DATA.copy()
    else:
        config_data = DEFAULT_DATA.copy()
        CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, indent=4, ensure_ascii=False)

load_config()

out = widgets.Output()

anime_dropdown = widgets.Dropdown(options=list(config_data.keys()), description='Anime:', layout=widgets.Layout(width='300px'))
new_anime_input = widgets.Text(placeholder='Tên Anime mới (VD: Naruto)', layout=widgets.Layout(width='200px'))
add_anime_btn = widgets.Button(description='Thêm Anime', button_style='success')
del_anime_btn = widgets.Button(description='Xóa Anime', button_style='danger')

char_dropdown = widgets.Dropdown(description='Nhân Vật:', layout=widgets.Layout(width='300px'))
char_name_input = widgets.Text(placeholder='Mã Nhân Vật (VD: Naruto_Uzumaki)', layout=widgets.Layout(width='300px'))
char_query_input = widgets.Text(placeholder='Từ khóa search, cách nhau bằng phẩy', layout=widgets.Layout(width='400px'))
add_char_btn = widgets.Button(description='Thêm/Sửa NV', button_style='primary')
del_char_btn = widgets.Button(description='Xóa NV', button_style='warning')

save_btn = widgets.Button(description='💾 LƯU CẤU HÌNH VÀO DRIVE', button_style='info', layout=widgets.Layout(width='100%', height='50px'))

def update_char_dropdown(*args):
    sel_anime = anime_dropdown.value
    if sel_anime and sel_anime in config_data:
        char_dropdown.options = list(config_data[sel_anime].keys())
    else:
        char_dropdown.options = []

def update_char_inputs(*args):
    sel_anime = anime_dropdown.value
    sel_char = char_dropdown.value
    if sel_anime and sel_char and sel_char in config_data.get(sel_anime, {}):
        char_name_input.value = sel_char
        char_query_input.value = ", ".join(config_data[sel_anime][sel_char])

anime_dropdown.observe(update_char_dropdown, 'value')
char_dropdown.observe(update_char_inputs, 'value')

def on_add_anime(b):
    with out:
        clear_output()
        nv = new_anime_input.value.strip()
        if nv and nv not in config_data:
            config_data[nv] = {}
            anime_dropdown.options = list(config_data.keys())
            anime_dropdown.value = nv
            new_anime_input.value = ''
            print(f"✅ Đã thêm phim: {nv}")

def on_del_anime(b):
    with out:
        clear_output()
        sel = anime_dropdown.value
        if sel in config_data:
            del config_data[sel]
            anime_dropdown.options = list(config_data.keys())
            print(f"🗑️ Đã xóa phim: {sel}")

def on_add_char(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        cname = char_name_input.value.strip().replace(" ", "_")
        cqueries = [q.strip() for q in char_query_input.value.split(',') if q.strip()]
        if sel_anime and cname and cqueries:
            config_data[sel_anime][cname] = cqueries
            update_char_dropdown()
            char_dropdown.value = cname
            print(f"✅ Đã thêm/sửa nhân vật: {cname} -> {cqueries}")
        else:
            print("❌ Tên nhân vật hoặc từ khóa không được để trống!")

def on_del_char(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        sel_char = char_dropdown.value
        if sel_anime and sel_char in config_data.get(sel_anime, {}):
            del config_data[sel_anime][sel_char]
            update_char_dropdown()
            print(f"🗑️ Đã xóa nhân vật: {sel_char}")

def on_save(b):
    with out:
        clear_output()
        CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, indent=4, ensure_ascii=False)
        print(f"🎉 ĐÃ LƯU THÀNH CÔNG LÊN DRIVE: {CONFIG_PATH}")
        print(f"Số phim: {len(config_data)}. Đã sẵn sàng chạy Fetch/Video script!")

add_anime_btn.on_click(on_add_anime)
del_anime_btn.on_click(on_del_anime)
add_char_btn.on_click(on_add_char)
del_char_btn.on_click(on_del_char)
save_btn.on_click(on_save)

# Init
if config_data: update_char_dropdown()

anime_box = widgets.HBox([anime_dropdown, new_anime_input, add_anime_btn, del_anime_btn])
char_box = widgets.HBox([char_dropdown, char_name_input, char_query_input, add_char_btn, del_char_btn])
ui = widgets.VBox([widgets.HTML("<h2>⚙️ QUẢN LÝ THƯ VIỆN NHÂN VẬT ANIME</h2>"), anime_box, char_box, save_btn, out])

display(ui)
