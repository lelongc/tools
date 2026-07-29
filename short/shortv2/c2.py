# @title 🎨 3. ANIME SHORT STUDIO WEB APP (HỖ TRỢ TỰ NHẬP KỊCH BẢN TÙY CHỈNH + GEMINI AI)
import ipywidgets as widgets
from IPython.display import display, clear_output
try:
    from google.colab import output
    output.enable_custom_widget_manager()
except Exception:
    pass

import json, shutil
from pathlib import Path

BASE_LIBRARY_DIR = Path('/content/drive/MyDrive/anime_library')
SETTINGS_FILE = BASE_LIBRARY_DIR / "studio_settings.json"

DEFAULT_DATA = {
    "Tensei_Slime": {
        "Rimuru_Tempest": ["Rimuru Tempest"],
        "Veldora_Tempest": ["Veldora Tempest"],
        "Benimaru": ["Benimaru"],
        "Shuna": ["Shuna"],
        "Shion": ["Shion"],
        "Souei": ["Souei"],
        "Hakurou": ["Hakurou"],
        "Ranga": ["Ranga"],
        "Geld": ["Geld"],
        "Gabiru": ["Gabiru"],
        "Gobta": ["Gobta"],
        "Diablo": ["Diablo"],
        "Testarossa": ["Testarossa"],
        "Carrera": ["Carrera"],
        "Ultima": ["Ultima"],
        "Guy_Crimson": ["Guy Crimson"],
        "Rain": ["Rain"],
        "Misery": ["Misery"],
        "Milim_Nava": ["Milim Nava"],
        "Luminous_Valentine": ["Luminous Valentine"],
        "Ramiris": ["Ramiris"],
        "Leon_Cromwell": ["Leon Cromwell"],
        "Dagruel": ["Dagruel"],
        "Dino": ["Dino"],
        "Carrion": ["Carrion"],
        "Frey": ["Frey"],
        "Velgrynd": ["Velgrynd"],
        "Velzard": ["Velzard"],
        "Veldanava": ["Veldanava"],
        "Chloe_Aubert": ["Chloe Aubert"],
        "Hinata_Sakaguchi": ["Hinata Sakaguchi"],
        "Zegion": ["Zegion"],
        "Kumara": ["Kumara"],
        "Adalman": ["Adalman"],
        "Beretta": ["Beretta"],
        "Yuuki_Kagurazaka": ["Yuuki Kagurazaka"],
        "Feldway": ["Feldway"],
        "Rudra_Nam_Ul_Nasca": ["Rudra Nam Ul Nasca"]
    }
}
config_data = {}
saved_settings = {}

def load_settings():
    global saved_settings
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    if SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
                saved_settings = json.load(f)
        except Exception:
            saved_settings = {}

def save_setting_key(key_name, value):
    global saved_settings
    saved_settings[key_name] = value
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(saved_settings, f, indent=4, ensure_ascii=False)

def load_config():
    global config_data
    config_data = {}
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    load_settings()
    
    for item in BASE_LIBRARY_DIR.iterdir():
        if item.is_dir():
            anime_name = item.name
            char_conf = item / "characters_config.json"
            if char_conf.exists():
                try:
                    with open(char_conf, 'r', encoding='utf-8') as f:
                        config_data[anime_name] = json.load(f)
                except:
                    config_data[anime_name] = {}
    
    slime_dir = BASE_LIBRARY_DIR / "Tensei_Slime"
    slime_conf = slime_dir / "characters_config.json"
    if not slime_conf.exists():
        slime_dir.mkdir(parents=True, exist_ok=True)
        config_data["Tensei_Slime"] = DEFAULT_DATA["Tensei_Slime"].copy()
        save_conf_for_anime("Tensei_Slime")

def save_conf_for_anime(anime_name):
    if anime_name in config_data:
        anime_dir = BASE_LIBRARY_DIR / anime_name
        anime_dir.mkdir(parents=True, exist_ok=True)
        conf_file = anime_dir / "characters_config.json"
        with open(conf_file, 'w', encoding='utf-8') as f:
            json.dump(config_data[anime_name], f, indent=4, ensure_ascii=False)

load_config()
out = widgets.Output()

# ==========================================
# TAB 1: QUẢN LÝ THƯ VIỆN & TẢI PINTEREST
# ==========================================
anime_dropdown = widgets.Dropdown(options=list(config_data.keys()), description='Chọn Anime:', layout=widgets.Layout(width='300px'))
new_anime_input = widgets.Text(placeholder='Anime Mới', layout=widgets.Layout(width='150px'))
add_anime_btn = widgets.Button(description='Thêm Anime', button_style='success')
del_anime_btn = widgets.Button(description='Xóa Cả Anime', button_style='danger')

new_char_input = widgets.Text(placeholder='Tên NV Mới', layout=widgets.Layout(width='150px'))
add_char_btn = widgets.Button(description='Thêm NV', button_style='info')

char_multiselect = widgets.SelectMultiple(
    options=[],
    description='Chọn Các NV:',
    layout=widgets.Layout(width='380px', height='160px')
)

del_char_btn = widgets.Button(description='💣 XÓA NV ĐƯỢC CHỌN & ẢNH', button_style='danger', layout=widgets.Layout(width='220px'))
source_dropdown = widgets.Dropdown(options=[('Pinterest (Mặc định)', 'pinterest'), ('Google Images', 'google'), ('Bing Images', 'bing')], description='Nguồn Ảnh:', layout=widgets.Layout(width='300px'))
target_count_slider = widgets.IntSlider(value=50, min=10, max=100, step=5, description='Số ảnh/NV:', layout=widgets.Layout(width='350px'))

fetch_selected_btn = widgets.Button(description='🚀 TẢI ẢNH CHO CÁC NV ĐƯỢC CHỌN (BẬT BẰNG GIỮ CTRL)', button_style='primary', layout=widgets.Layout(width='100%', height='45px'))
fetch_all_btn = widgets.Button(description='⚡ TẢI ẢNH CHO TẤT CẢ NV TRONG ANIME', button_style='success', layout=widgets.Layout(width='100%', height='45px'))

def update_ui(*args):
    sel_anime = anime_dropdown.value
    if sel_anime and sel_anime in config_data:
        char_list = list(config_data[sel_anime].keys())
        char_multiselect.options = char_list
        if char_list:
            char_multiselect.value = tuple(char_list)
        chars_str = ", ".join(char_list) if char_list else "(Trống)"
        with out:
            clear_output()
            conf_file = BASE_LIBRARY_DIR / sel_anime / "characters_config.json"
            print(f"📌 [Thư mục: /anime_library/{sel_anime}]")
            print(f"📄 Cấu hình lưu tại: {conf_file}")
            print(f"👉 Các nhân vật ({len(char_list)}): {chars_str}")

anime_dropdown.observe(update_ui, 'value')

def on_add_anime(b):
    nv = new_anime_input.value.strip().replace(" ", "_")
    if nv and nv not in config_data:
        config_data[nv] = {}
        save_conf_for_anime(nv)
        anime_dropdown.options = list(config_data.keys())
        anime_dropdown.value = nv
        new_anime_input.value = ''
        update_ui()

def on_del_anime(b):
    sel = anime_dropdown.value
    if sel in config_data:
        del config_data[sel]
        anime_dir = BASE_LIBRARY_DIR / sel
        if anime_dir.exists(): shutil.rmtree(anime_dir, ignore_errors=True)
        anime_dropdown.options = list(config_data.keys())
        if config_data: anime_dropdown.value = list(config_data.keys())[0]
        update_ui()
        with out: print(f"🗑️ Đã xóa Anime '{sel}' và toàn bộ thư mục Drive!")

def on_add_char(b):
    sel_anime = anime_dropdown.value
    cname = new_char_input.value.strip().replace(" ", "_")
    if sel_anime and cname:
        config_data[sel_anime][cname] = [cname.replace("_", " ")]
        save_conf_for_anime(sel_anime)
        new_char_input.value = ''
        update_ui()

def on_del_char(b):
    sel_anime = anime_dropdown.value
    selected_chars = list(char_multiselect.value)
    if sel_anime and selected_chars:
        for cname in selected_chars:
            if cname in config_data.get(sel_anime, {}):
                del config_data[sel_anime][cname]
                char_dir = BASE_LIBRARY_DIR / sel_anime / cname
                if char_dir.exists(): shutil.rmtree(char_dir, ignore_errors=True)
        save_conf_for_anime(sel_anime)
        update_ui()
        with out: print(f"💣 ĐÃ XÓA SẠCH VĨNH VIỄN {len(selected_chars)} nhân vật được chọn và thư mục ảnh Drive!")

def on_fetch_selected(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        selected_chars = list(char_multiselect.value)
        target = target_count_slider.value
        if sel_anime and selected_chars:
            print(f"⏳ Đang cào riêng ảnh Pinterest cho {len(selected_chars)} NV được chọn trong '{sel_anime}'...")
            run_fetch(sel_anime, char_list=selected_chars, target_per_char=target, source=source_dropdown.value)
        else:
            print("⚠️ Hãy giữ Ctrl và bấm chọn ít nhất 1 nhân vật trong danh sách trên!")

def on_fetch_all(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        target = target_count_slider.value
        print(f"⏳ Đang cào ảnh Pinterest cho TẤT CẢ nhân vật trong '{sel_anime}' (Chỉ tiêu: {target} ảnh/NV)...")
        run_fetch(sel_anime, char_list=None, target_per_char=target, source=source_dropdown.value)

add_anime_btn.on_click(on_add_anime); del_anime_btn.on_click(on_del_anime)
add_char_btn.on_click(on_add_char); del_char_btn.on_click(on_del_char)
fetch_selected_btn.on_click(on_fetch_selected); fetch_all_btn.on_click(on_fetch_all)

tab1_content = widgets.VBox([
    widgets.HTML("<h3>📁 CẤU HÌNH ANIME (LƯU RIÊNG THEO THƯ MỤC CỦA TỪNG ANIME)</h3>"),
    widgets.HBox([anime_dropdown, new_anime_input, add_anime_btn, del_anime_btn]),
    widgets.HBox([widgets.Label("Thêm NV Mới:"), new_char_input, add_char_btn]),
    widgets.HBox([source_dropdown, target_count_slider]),
    widgets.HBox([char_multiselect, widgets.VBox([widgets.HTML("<i>💡 Giữ phím <b>Ctrl</b> hoặc <b>Shift</b> để chọn nhiều nhân vật cùng lúc!</i>"), del_char_btn])]),
    fetch_selected_btn,
    fetch_all_btn
])

# ==========================================
# TAB 2: STUDIO TẠO VIDEO SHORT ANIME (HỖ TRỢ TỰ NHẬP KỊCH BẢN TÙY CHỈNH)
# ==========================================
initial_api_key = saved_settings.get("gemini_api_key", "")
gemini_key_input = widgets.Text(value=initial_api_key, description='Gemini API:', placeholder='Dán API Key Gemini vào đây (Bắt buộc khi dùng AI tự viết kịch bản)', layout=widgets.Layout(width='450px'))
topic_input = widgets.Text(description='Chủ đề Short:', value='Secrets of Rimuru Tempest when evolving into a True Demon Lord', layout=widgets.Layout(width='550px'))
custom_script_input = widgets.Textarea(
    placeholder='[TÙY CHỌN] Dán kịch bản Tiếng Anh của bạn vào đây (Nếu đã nhập kịch bản ở đây, hệ thống sẽ DÙNG KỊCH BẢN NÀY VÀ BỎ QUA AI GEMINI)...',
    description='Kịch bản riêng:',
    layout=widgets.Layout(width='550px', height='100px')
)
voice_dropdown = widgets.Dropdown(
    options=[
        ('English - Male Voice (Christopher)', 'en-US-ChristopherNeural'),
        ('English - Male Voice (Guy)', 'en-US-GuyNeural'),
        ('English - Female Voice (Jenny)', 'en-US-JennyNeural'),
        ('English - Female Voice (Aria)', 'en-US-AriaNeural')
    ],
    description='Giọng Đọc:', layout=widgets.Layout(width='400px')
)
create_short_btn = widgets.Button(description='🎬 1-CLICK TẠO VIDEO SHORT MP4 (CÓ THANH % RENDER LIVE)', button_style='success', layout=widgets.Layout(width='100%', height='50px'))

progress_bar = widgets.IntProgress(
    value=0, min=0, max=100, step=1,
    description='Tiến trình:', bar_style='info',
    layout=widgets.Layout(width='100%', height='25px')
)
progress_label = widgets.HTML(value="<b>⏳ Trạng thái:</b> Sẵn sàng tạo video.")

def on_api_key_change(change):
    new_val = change['new'].strip()
    if new_val:
        save_setting_key("gemini_api_key", new_val)

gemini_key_input.observe(on_api_key_change, names='value')

def on_create_short(b):
    with out:
        clear_output()
        key = gemini_key_input.value.strip()
        c_script = custom_script_input.value.strip()
        if not c_script and not key:
            progress_label.value = "<b style='color:red;'>⚠️ VUI LÒNG NHẬP GEMINI API KEY HOẶC DÁN KỊCH BẢN TÙY CHỈNH VÀO Ô DƯỚI TRƯỚC KHI TẠO VIDEO!</b>"
            return
        if key:
            save_setting_key("gemini_api_key", key)
        sel_anime = anime_dropdown.value
        topic = topic_input.value.strip()
        voice = voice_dropdown.value
        generate_video_short(sel_anime, topic, key, voice, custom_script=c_script, pbar_widget=progress_bar, label_widget=progress_label)

create_short_btn.on_click(on_create_short)

tab2_content = widgets.VBox([
    widgets.HTML("<h3>🎬 XƯỞNG RENDER VIDEO SHORT MP4 (BẠN CÓ THỂ TỰ NHẬP KỊCH BẢN HOẶC DÙNG AI)</h3>"),
    widgets.HTML("<i>💡 <b>Mẹo:</b> Bạn có thể dán trực tiếp kịch bản Tiếng Anh của bạn vào ô 'Kịch bản riêng'. Nếu ô này có nội dung, hệ thống sẽ sử dụng kịch bản của bạn và tạo video ngay lập tức!</i><br><br>"),
    gemini_key_input,
    topic_input,
    custom_script_input,
    voice_dropdown,
    create_short_btn,
    widgets.VBox([progress_bar, progress_label], layout=widgets.Layout(margin='15px 0 0 0'))
])

# ==========================================
# GỘP THÀNH GIAO DIỆN TAB WEB STUDIO DỄ DÙNG
# ==========================================
tabs = widgets.Tab(children=[tab1_content, tab2_content])
tabs.set_title(0, '📁 1. Cấu hình & Tải Ảnh Pinterest')
tabs.set_title(1, '🎬 2. Tạo Video Short MP4 (English)')

if config_data: update_ui()

ui = widgets.VBox([
    widgets.HTML("<h2 style='color:#1E88E5;'>🌟 ANIME SHORT STUDIO WEB APP — PINTEREST & FULL MP4 MAKER (ENGLISH)</h2>"),
    tabs,
    out
])
display(ui)
