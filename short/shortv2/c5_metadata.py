# @title 4. TỰ ĐỘNG TẠO METADATA YOUTUBE SHORTS (Tiêu Đề, Mô Tả, Tag & Bình Luận Ghim Chuẩn Ori Anime)
import google.generativeai as genai
import ipywidgets as widgets
from IPython.display import display, HTML
import os
import json
from pathlib import Path

def generate_youtube_metadata_interactive(b=None):
    # Lấy thông tin KỊCH BẢN và PHỤ ĐỀ XÁC THỰC CỦA VIDEO VỪA TẠO XONG
    script_text = globals().get('LAST_GENERATED_SCRIPT', '')
    subtitles_text = globals().get('LAST_GENERATED_WORDS', script_text)
    topic = globals().get('LAST_GENERATED_TOPIC', topic_dropdown.value if 'topic_dropdown' in globals() and topic_dropdown.value else "Diablo vs Milim")
    sel_anime = globals().get('LAST_GENERATED_ANIME', anime_dropdown.value if 'anime_dropdown' in globals() else "Tensei_Slime")
    
    key = gemini_key_input.value if 'gemini_key_input' in globals() and gemini_key_input.value else os.environ.get("GEMINI_API_KEY", "")
    
    if not key:
        print("❌ LỖI: Vui lòng nhập Gemini API Key ở Cell 3!")
        return

    # Nếu phiên chạy mới chưa dựng video, lấy từ Custom Script hoặc JSON mới nhất
    if not script_text:
        c_script = custom_script_input.value if 'custom_script_input' in globals() and custom_script_input.value.strip() else ""
        out_dir = BASE_LIBRARY_DIR / sel_anime / "output_shorts" if 'BASE_LIBRARY_DIR' in globals() else Path("/content/drive/MyDrive/anime_library") / sel_anime / "output_shorts"
        script_text = c_script
        
        if not script_text and out_dir.exists():
            json_files = list(out_dir.glob("*.json")) + list(Path('projects').rglob("script_data.json"))
            if json_files:
                latest_json = max(json_files, key=lambda f: f.stat().st_mtime)
                try:
                    data = json.loads(latest_json.read_text(encoding='utf-8'))
                    script_text = data.get('script', '')
                except: pass
                
    if not script_text:
        script_text = f"An epic lore breakdown video about {topic} in {sel_anime}."
        subtitles_text = script_text

    genai.configure(api_key=key.strip())
    
    prompt = f"""You are an elite YouTube Shorts SEO Specialist analyzing an anime video for channel style 'Ori Anime' (from setup blueprint).
Analyze the EXACT spoken subtitles and script of the video below, and AUTONOMOUSLY DECIDE the best viral metadata.

ANIME: {sel_anime}
TOPIC: {topic}
FULL SCRIPT: "{script_text}"
SPOKEN SUBTITLES TRANSCRIPT: "{subtitles_text}"

SEO & CHANNEL BLUEPRINT RULES (Style: Ori Anime):
1. TITLE:
   - Must be explosive, high CTR clickbait under 60 characters based on the video's main plot twist.
   - Include 1-2 emojis.
   - End with EXACTLY 3 core viral hashtags (e.g. #{sel_anime.replace('_','')} #{topic.split()[0]} #AnimeShorts).
2. DESCRIPTION:
   - 2-3 sentences of compelling lore summary based on the spoken subtitles to hooked viewers.
   - Followed by the exact Ori Anime Fair Use Disclaimer:
     "Welcome to Shimanime. We focus on original anime and light novel lore, analysis, and commentary. All content is transformed with original narration, analytical commentary, and editing into educational lore content."
   - Followed by 3 core hashtags.
3. TAGS:
   - Comma-separated list of 12-15 high-volume search tags for this anime and character lore (e.g. {sel_anime.replace('_',' ')}, {topic}, Light Novel Lore, Ori Anime, Anime Shorts).
4. PINNED COMMENT:
   - A debate-triggering question derived from the exact ending of the subtitles to drive massive comment section engagement.

Return STRICTLY valid JSON:
{{
  "title": "EXPLOSIVE TITLE HERE 🔥 #Hashtag1 #Hashtag2 #Hashtag3",
  "description": "Engaging 2-sentence summary of the subtitles...\n\nWelcome to Shimanime. We focus on original anime and light novel lore, analysis, and commentary. All content is transformed with original narration, analytical commentary, and editing into educational lore content.\n\n#Hashtag1 #Hashtag2 #Hashtag3",
  "tags": "Tag1, Tag2, Tag3, Tag4, Tag5, Tag6, Tag7, Tag8, Tag9, Tag10",
  "pinned_comment": "Who do you think has the edge in this fight? Drop your take below! 👇"
}}"""

    print("✨ AI Gemini đang đọc toàn bộ Phụ Đề & Kịch bản để tự động quyết định Metadata SEO chuẩn Ori Anime...", flush=True)
    models = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-1.5-flash', 'gemini-flash-latest']
    meta_data = None
    for m in models:
        try:
            model = genai.GenerativeModel(m)
            res = model.generate_content(prompt)
            text = res.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.startswith("```"): text = text[3:]
            if text.endswith("```"): text = text[:-3]
            meta_data = json.loads(text.strip())
            break
        except Exception as e:
            continue
            
    if not meta_data:
        print("❌ Lỗi: Tất cả các model Gemini đều không thể tạo Metadata!")
        return

    print("\n" + "="*60)
    print("🚀 NỘI DUNG SEO YOUTUBE SHORTS VIÊN VIÊN CHUẨN KÊNH ORI ANIME")
    print(f"🎬 Chủ đề: [{topic}] | Anime: [{sel_anime}]")
    print("="*60)
    print(f"\n📌 1. TIÊU ĐỀ (TITLE):\n{meta_data.get('title')}\n")
    print(f"📝 2. MÔ TẢ (DESCRIPTION):\n{meta_data.get('description')}\n")
    print(f"🏷️ 3. TAGS (THẺ VIDEO):\n{meta_data.get('tags')}\n")
    print(f"💬 4. BÌNH LUẬN GHIM (PINNED COMMENT):\n{meta_data.get('pinned_comment')}\n")
    print("="*60 + "\n")

btn_gen_meta = widgets.Button(description="🔥 1-CLICK TẠO METADATA SEO CHUẨN ORI ANIME", button_style="success", layout=widgets.Layout(width="420px", height="45px"))
btn_gen_meta.on_click(generate_youtube_metadata_interactive)
display(btn_gen_meta)
