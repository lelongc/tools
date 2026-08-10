# @title 4. TỰ ĐỘNG TẠO METADATA YOUTUBE SHORTS (Tiêu Đề, Mô Tả, Bình Luận Ghim Chuẩn SEO)
import google.generativeai as genai
import ipywidgets as widgets
from IPython.display import display, HTML
import os
import json
from pathlib import Path

def generate_youtube_metadata_interactive(b=None):
    # Ưu tiên 1: Lấy kịch bản, chủ đề, tên anime của VIDEO VỪA MỚI TẠO XONG GẦN NHẤT
    script_text = globals().get('LAST_GENERATED_SCRIPT', '')
    topic = globals().get('LAST_GENERATED_TOPIC', topic_dropdown.value if 'topic_dropdown' in globals() and topic_dropdown.value else "Diablo vs Milim")
    sel_anime = globals().get('LAST_GENERATED_ANIME', anime_dropdown.value if 'anime_dropdown' in globals() else "Tensei_Slime")
    
    key = gemini_key_input.value if 'gemini_key_input' in globals() and gemini_key_input.value else os.environ.get("GEMINI_API_KEY", "")
    
    if not key:
        print("❌ LỖI: Vui lòng nhập Gemini API Key ở Cell 3!")
        return

    # Dự phòng 2: Nếu chưa tạo video trong phiên này, lấy từ Custom Script hoặc file JSON mới nhất
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

    genai.configure(api_key=key.strip())
    
    prompt = f"""You are an elite YouTube Shorts SEO Specialist for top-tier Anime Lore channels (like Realm of Ori).
Generates viral YouTube Shorts metadata for an anime video about '{topic}' in anime '{sel_anime}'.

Script Content (EXACT text of the latest generated video):
"{script_text}"

CRITICAL SEO RULES (From Channel Setup Blueprint youtube_channel_setup_guide.md):
1. TITLE:
   - Must be explosive, viral, high CTR clickbait under 60 characters.
   - Include 1-2 relevant emojis.
   - Include EXACTLY 3 core hashtags at the end (e.g. #{sel_anime.replace('_','')} #{topic.split()[0]} #AnimeShorts).
2. DESCRIPTION:
   - 2-3 sentences of engaging narrative summary/hook that encourages re-watching.
   - Followed by the mandatory transformation/fair use statement:
     "All content is transformed with original narration, analytical commentary, and editing into educational lore content."
   - Followed by EXACTLY 3 core hashtags.
3. PINNED COMMENT:
   - A controversial or debate-triggering question to maximize viewer comments and boost YouTube algorithm rank.
4. NO TAGS:
   - Do NOT produce tags section, as per YouTube 2023+ algorithm guidelines (Tags are obsolete for Shorts).

Return STRICTLY valid JSON:
{{
  "title": "EXPLOSIVE TITLE HERE 🔥 #Hashtag1 #Hashtag2 #Hashtag3",
  "description": "Short engaging description here...\\n\\nAll content is transformed with original narration, analytical commentary, and editing into educational lore content.\\n\\n#Hashtag1 #Hashtag2 #Hashtag3",
  "pinned_comment": "Who do you think has the edge in this fight? Let me know below! 👇"
}}"""

    print("✨ AI Gemini đang tạo Tiêu đề, Mô tả & Bình luận ghim chuẩn Viral YouTube Shorts cho Video Vừa Tạo...", flush=True)
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
    print("🚀 NỘI DUNG SEO YOUTUBE SHORTS VIÊN VIÊN (1-CLICK COPY)")
    print(f"🎬 Chủ đề Video: [{topic}] | Anime: [{sel_anime}]")
    print("="*60)
    print(f"\n📌 1. TIÊU ĐỀ (TITLE):\n{meta_data.get('title')}\n")
    print(f"📝 2. MÔ TẢ (DESCRIPTION):\n{meta_data.get('description')}\n")
    print(f"💬 3. BÌNH LUẬN GHIM (PINNED COMMENT):\n{meta_data.get('pinned_comment')}\n")
    print("="*60 + "\n")

btn_gen_meta = widgets.Button(description="🔥 1-CLICK TẠO METADATA SEO YOUTUBE", button_style="success", layout=widgets.Layout(width="400px", height="45px"))
btn_gen_meta.on_click(generate_youtube_metadata_interactive)
display(btn_gen_meta)
