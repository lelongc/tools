# @title 🎬 3. ANIME SHORT STUDIO WEB APP (ANILIST LORE & VIRAL SHORT MAKER)
import json, shutil, os, requests
import ipywidgets as widgets
from IPython.display import display, clear_output
from pathlib import Path

def get_base_library_dir():
    drive_dir = Path('/content/drive/MyDrive/anime_library')
    local_dir = Path('/content/anime_library')
    if Path('/content/drive/MyDrive').exists():
        try:
            drive_dir.mkdir(parents=True, exist_ok=True)
            return drive_dir
        except Exception: pass
    local_dir.mkdir(parents=True, exist_ok=True)
    return local_dir

BASE_LIBRARY_DIR = get_base_library_dir()
SETTINGS_FILE = BASE_LIBRARY_DIR / "studio_settings.json"

def get_effective_gemini_key(user_key=""):
    k_cand = ""
    if user_key and user_key.strip():
        k_cand = user_key.strip()
    elif SETTINGS_FILE.exists():
        try:
            data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
            k_cand = data.get("gemini_api_key", "").strip()
        except Exception: pass
    if not k_cand:
        k_cand = os.environ.get("GEMINI_API_KEY", "").strip()
    return k_cand.strip('" \t\r\n')


def get_all_animes():
    BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
    animes = [item.name for item in BASE_LIBRARY_DIR.iterdir() if item.is_dir() and not item.name.startswith('.')]
    if not animes:
        animes = ["Tensei_Slime"]
        conf_path = BASE_LIBRARY_DIR / "Tensei_Slime" / "characters_config.json"
        conf_path.parent.mkdir(parents=True, exist_ok=True)
        if not conf_path.exists():
            conf_path.write_text(json.dumps({
                "Rimuru_Tempest": "Rimuru Tempest",
                "Veldora_Tempest": "Veldora Tempest",
                "Milim_Nava": "Milim Nava",
                "Guy_Crimson": "Guy Crimson",
                "Diablo": "Diablo",
                "Benimaru": "Benimaru",
                "Shion": "Shion"
            }, indent=4, ensure_ascii=False), encoding="utf-8")
    return sorted(animes)

def load_conf_for_anime(anime_name):
    conf_path = BASE_LIBRARY_DIR / anime_name / "characters_config.json"
    if conf_path.exists():
        try: return json.loads(conf_path.read_text(encoding="utf-8"))
        except Exception: pass
    return {}

def save_conf_for_anime(anime_name, data):
    anime_dir = BASE_LIBRARY_DIR / anime_name
    anime_dir.mkdir(parents=True, exist_ok=True)
    conf_path = anime_dir / "characters_config.json"
    conf_path.write_text(json.dumps(data, indent=4, ensure_ascii=False), encoding="utf-8")

out = widgets.Output()

# --- TAB 1: CẤU HÌNH ANIME & NHÂN VẬT ---
animes_list = get_all_animes()
anime_dropdown = widgets.Dropdown(options=animes_list, description='Chọn Anime:', layout=widgets.Layout(width='320px'))
new_anime_input = widgets.Text(placeholder='Nhập tên Anime mới...', layout=widgets.Layout(width='200px'))
add_anime_btn = widgets.Button(description='➕ Thêm Anime', button_style='primary', layout=widgets.Layout(width='120px'))
del_anime_btn = widgets.Button(description='🗑️ Xóa Anime', button_style='danger', layout=widgets.Layout(width='120px'))
del_anime_btn.layout.display = 'none' # Hidden to prevent accidental deletion

new_char_input = widgets.Text(placeholder='Nhập tên Nhân Vật mới...', layout=widgets.Layout(width='250px'))
add_char_btn = widgets.Button(description='➕ Thêm NV', button_style='info', layout=widgets.Layout(width='110px'))
del_char_btn = widgets.Button(description='❌ Xóa NV Chọn', button_style='warning', layout=widgets.Layout(width='140px'))

source_dropdown = widgets.Dropdown(options=[('Pinterest Web', 'pinterest'), ('Bing Images', 'bing'), ('Google Images', 'google')], description='Nguồn:', layout=widgets.Layout(width='240px'))
media_type_dropdown = widgets.Dropdown(options=[('🖼️ Ảnh Tĩnh (JPG/PNG)', 'image'), ('🎬 Ảnh Động GIF (Thư mục /gif)', 'gif')], description='Loại File:', layout=widgets.Layout(width='280px'))
target_count_slider = widgets.IntSlider(value=20, min=5, max=100, step=5, description='Chỉ Tiêu:', layout=widgets.Layout(width='240px'))

char_multiselect = widgets.SelectMultiple(options=[], description='Danh Sách NV:', layout=widgets.Layout(width='350px', height='140px'))

fetch_selected_btn = widgets.Button(description='🔎 1. CÀO ẢNH / GIF CHO CÁC NHÂN VẬT ĐƯỢC CHỌN', button_style='primary', layout=widgets.Layout(width='100%', height='40px'))
fetch_all_btn = widgets.Button(description='⚠️ TẢI TOÀN BỘ (CẨN THẬN)', button_style='danger', layout=widgets.Layout(width='200px', height='36px'))

def update_ui():
    sel_anime = anime_dropdown.value
    if sel_anime:
        char_dict = load_conf_for_anime(sel_anime)
        char_multiselect.options = list(char_dict.keys())

def on_anime_change(change):
    update_ui()

anime_dropdown.observe(on_anime_change, names='value')

def on_add_anime(b):
    name = new_anime_input.value.strip().replace(" ", "_")
    if name:
        save_conf_for_anime(name, {})
        new_anime_input.value = ""
        anime_dropdown.options = get_all_animes()
        anime_dropdown.value = name
        update_ui()
        with out: print(f"✅ Đã thêm Anime mới: {name}")

def on_del_anime(b):
    sel = anime_dropdown.value
    if sel:
        shutil.rmtree(BASE_LIBRARY_DIR / sel, ignore_errors=True)
        anime_dropdown.options = get_all_animes()
        if anime_dropdown.options: anime_dropdown.value = anime_dropdown.options[0]
        update_ui()
        with out: print(f"🗑️ Đã xóa hoàn toàn Anime: {sel}")

def on_add_char(b):
    sel_anime = anime_dropdown.value
    cname = new_char_input.value.strip().replace(" ", "_")
    if sel_anime and cname:
        char_dict = load_conf_for_anime(sel_anime)
        char_dict[cname] = cname.replace("_", " ")
        save_conf_for_anime(sel_anime, char_dict)
        new_char_input.value = ""
        update_ui()
        with out: print(f"✅ Đã thêm nhân vật '{cname}' vào '{sel_anime}'")

def on_del_char(b):
    sel_anime = anime_dropdown.value
    selected_chars = list(char_multiselect.value)
    if sel_anime and selected_chars:
        char_dict = load_conf_for_anime(sel_anime)
        for cname in selected_chars:
            if cname in char_dict: del char_dict[cname]
            shutil.rmtree(BASE_LIBRARY_DIR / sel_anime / cname, ignore_errors=True)
        save_conf_for_anime(sel_anime, char_dict)
        update_ui()
        with out: print(f"💣 Đã xóa vĩnh viễn {len(selected_chars)} nhân vật khỏi '{sel_anime}'!")

def on_fetch_selected(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        selected_chars = list(char_multiselect.value)
        target = target_count_slider.value
        m_type = media_type_dropdown.value
        if sel_anime and selected_chars:
            run_fetch(sel_anime, char_list=selected_chars, target_per_char=target, source=source_dropdown.value, media_type=m_type)
        else: print("⚠️ Vui lòng giữ Ctrl bấm chọn ít nhất 1 nhân vật!")

def on_fetch_all(b):
    with out:
        clear_output()
        sel_anime = anime_dropdown.value
        target = target_count_slider.value
        m_type = media_type_dropdown.value
        run_fetch(sel_anime, char_list=None, target_per_char=target, source=source_dropdown.value, media_type=m_type)

add_anime_btn.on_click(on_add_anime); del_anime_btn.on_click(on_del_anime)
add_char_btn.on_click(on_add_char); del_char_btn.on_click(on_del_char)
fetch_selected_btn.on_click(on_fetch_selected); fetch_all_btn.on_click(on_fetch_all)

danger_box = widgets.HBox([
    widgets.HTML("<i style='color:orange;'>Khu vực nguy hiểm (Dễ đầy bộ nhớ):</i>"),
    fetch_all_btn
], layout=widgets.Layout(justify_content='space-between', align_items='center', margin='10px 0 0 0'))

tab1_content = widgets.VBox([
    widgets.HTML("<h3>📁 QUẢN LÝ ANIME & NHÂN VẬT (CÀO TỰ ĐỘNG THƯ MỤC GIF RIÊNG & ĐAN XEN THÔNG MINH)</h3>"),
    widgets.HBox([anime_dropdown, new_anime_input, add_anime_btn]),
    widgets.HBox([widgets.Label("Thêm NV Mới:"), new_char_input, add_char_btn]),
    widgets.HBox([source_dropdown, media_type_dropdown, target_count_slider]),
    widgets.HBox([char_multiselect, widgets.VBox([widgets.HTML("<i>💡 Giữ phím <b>Ctrl</b> hoặc <b>Shift</b> để chọn nhiều nhân vật cùng lúc!</i>"), del_char_btn])]),
    fetch_selected_btn,
    danger_box
])

# --- TAB 2: XƯỞNG VIRAL SHORT (ANILIST LORE RESEARCH & TOPIC GENERATOR) ---
initial_key = get_effective_gemini_key()
gemini_key_input = widgets.Password(value=initial_key, description='Gemini Key:', placeholder='🔑 Dán API Key từ https://aistudio.google.com/app/apikey', layout=widgets.Layout(width='480px'))

suggest_topics_btn = widgets.Button(description='💡 TẠO 10 CHỦ ĐỀ VIRAL XU HƯỚNG TỪ Ý TƯỞNG', button_style='info', layout=widgets.Layout(width='100%', height='40px'))
idea_input = widgets.Text(description='Ý Tưởng (Gợi ý):', placeholder='Để trống để tạo ngẫu nhiên, hoặc nhập ý tưởng (VD: Kĩ năng bá đạo nhất)', layout=widgets.Layout(width='550px'))
viral_topics_dropdown = widgets.Dropdown(options=[('--- Bấm nút ở trên để AI tạo 10 chủ đề Viral ---', '')], description='Chủ đề AI:', layout=widgets.Layout(width='550px'))
topic_input = widgets.Text(description='Chủ đề Short:', value='Secrets of Rimuru Tempest when evolving into a True Demon Lord', layout=widgets.Layout(width='550px'))

def on_suggest_topics(b):
    with out:
        clear_output()
        key = get_effective_gemini_key(gemini_key_input.value.strip())
        if not key:
            print("❌ LỖI THIẾU API KEY: Vui lòng dán Gemini API Key mới (bắt đầu bằng AIzaSy...) lấy miễn phí tại https://aistudio.google.com/app/apikey vào ô 'Gemini Key:'!", flush=True)
            return
        sel_anime = anime_dropdown.value
        user_idea = idea_input.value.strip()
        top_list = suggest_viral_topics(sel_anime, key, idea=user_idea)
        viral_topics_dropdown.options = [(t, t) for t in top_list]
        topic_input.value = top_list[0]
        if user_idea:
            print(f"🎯 ĐÃ TẠO {len(top_list)} CHỦ ĐỀ VIRAL DỰA TRÊN Ý TƯỞNG: '{user_idea}'!")
        else:
            print(f"🎯 ĐÃ TẠO {len(top_list)} CHỦ ĐỀ VIRAL NGẪU NHIÊN CHO '{sel_anime}'!")

def on_topic_select(change):
    if change['new']:
        topic_input.value = change['new']

suggest_topics_btn.on_click(on_suggest_topics)
viral_topics_dropdown.observe(on_topic_select, names='value')

hook_dropdown = widgets.Dropdown(
    options=[
        ('🔥 Shocking Secret / Dark Truth (Bí mật ẩn giấu 99% fans bỏ lỡ)', 'Shocking Secret'),
        ('⚡ Power Scaling / Broken Skill (So sánh sức mạnh vô lý)', 'Power Scaling'),
        ('💬 Controversial Hot Take (Tranh cãi bùng nổ Comment)', 'Controversial Take'),
        ('❓ Mysterious Plot Twist (Bí ẩn cú bẻ lái bất ngờ)', 'Mysterious Twist')
    ],
    description='Kiểu Hook 3s:', layout=widgets.Layout(width='550px')
)

ending_dropdown = widgets.Dropdown(
    options=[
        ('💬 Viral Comment Question (Hỏi ý kiến - Kích thích Comment đỉnh cao)', 'Viral Comment Question'),
        ('🔄 Seamless Loop / Cliffhanger (Vòng lặp tò mò - Giữ chân 100%)', 'Seamless Loop'),
        ('👑 Deep Lore Conclusion (Triết lý & Tổng kết sâu sắc)', 'Deep Lore Conclusion')
    ],
    description='Kiểu Kết Thúc:', layout=widgets.Layout(width='550px')
)

custom_script_input = widgets.Textarea(placeholder='[TÙY CHỌN] Dán kịch bản Tiếng Anh của bạn vào đây...', description='Kịch bản riêng:', layout=widgets.Layout(width='550px', height='70px'))
custom_subs_input = widgets.Textarea(placeholder='[TÙY CHỌN] Dán file phụ đề (mỗi dòng 1-2 từ) để đè chữ tùy chỉnh...', description='Phụ đề riêng:', layout=widgets.Layout(width='550px', height='70px'))

voice_dropdown = widgets.Dropdown(
    options=[
        ('English - Male Voice (Christopher)', 'en-US-ChristopherNeural'),
        ('English - Male Voice (Guy)', 'en-US-GuyNeural'),
        ('English - Female Voice (Jenny)', 'en-US-JennyNeural'),
        ('English - Female Voice (Aria)', 'en-US-AriaNeural')
    ],
    description='Giọng Đọc:', layout=widgets.Layout(width='420px')
)

progress_label = widgets.HTML(value="<b>Tiến độ:</b> Đang chờ...")
progress_bar = widgets.IntProgress(value=0, min=0, max=100, description='Tiến độ:', bar_style='info', layout=widgets.Layout(width='100%'))
progress_container = widgets.VBox([progress_label, progress_bar])

create_short_btn = widgets.Button(description='🎬 1-CLICK TẠO VIRAL SHORT MP4 (ANILIST LORE & YOUTUBE MONETIZATION)', button_style='success', layout=widgets.Layout(width='100%', height='50px'))

def on_api_key_change(change):
    new_val = change['new'].strip().strip('" \t\r\n')
    if new_val:
        try:
            BASE_LIBRARY_DIR.mkdir(parents=True, exist_ok=True)
            curr = json.loads(SETTINGS_FILE.read_text(encoding="utf-8")) if SETTINGS_FILE.exists() else {}
            curr["gemini_api_key"] = new_val
            SETTINGS_FILE.write_text(json.dumps(curr, indent=4, ensure_ascii=False), encoding="utf-8")
            with out:
                clear_output()
                print(f"✅ Đã tự động lưu Gemini API Key mới vào Google Drive cá nhân!", flush=True)
        except Exception as e:
            pass

gemini_key_input.observe(on_api_key_change, names='value')

def on_create_short(b):
    with out:
        clear_output()
        key = get_effective_gemini_key(gemini_key_input.value.strip())
        c_script = custom_script_input.value.strip()
        c_subs = custom_subs_input.value.strip()
        if not c_script and not key:
            print("❌ LỖI THIẾU API KEY: Vui lòng dán Gemini API Key mới (bắt đầu bằng AIzaSy...) lấy miễn phí tại https://aistudio.google.com/app/apikey vào ô 'Gemini Key:'!", flush=True)
            return
        sel_anime = anime_dropdown.value
        topic = topic_input.value.strip()
        voice = voice_dropdown.value
        hook = hook_dropdown.value
        ending = ending_dropdown.value
        generate_video_short(sel_anime, topic, key, voice, custom_script=c_script, custom_subs=c_subs, hook_style=hook, ending_style=ending, pbar_widget=progress_bar, label_widget=progress_label)

create_short_btn.on_click(on_create_short)

tab2_content = widgets.VBox([
    widgets.HTML("<h3>🎬 XƯỞNG VIRAL SHORT MP4 (ANILIST LORE AI & CHỌN CHỦ ĐỀ GIỮ CHÂN RETENTION)</h3>"),
    widgets.HTML("<i>💡 Lấy Gemini API Key miễn phí 100% tại: <a href='https://aistudio.google.com/app/apikey' target='_blank'>Google AI Studio Key Generator</a></i>"),
    gemini_key_input,
    idea_input,
    suggest_topics_btn,
    viral_topics_dropdown,
    topic_input,
    hook_dropdown,
    ending_dropdown,
    custom_script_input,
    custom_subs_input,
    progress_container,
    voice_dropdown,
    create_short_btn
])

tabs = widgets.Tab(children=[tab1_content, tab2_content])
tabs.set_title(0, '📁 1. Quản Lý Anime / NV & Cào Ảnh')
tabs.set_title(1, '🎬 2. Tạo Viral Short MP4 (YouTube Monetization)')

update_ui()

ui = widgets.VBox([
    widgets.HTML("<h2 style='color:#1E88E5;'>🌟 ANIME SHORT STUDIO WEB APP — ANILIST LORE RESEARCH & VIRAL TOPIC MAKER</h2>"),
    tabs,
    out
])
display(ui)
