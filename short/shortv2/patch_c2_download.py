import re

with open('c2.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update generate_video_short to store LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME
old_save_script = '''        script_text = script_data.get('tts_script') or script_data.get('script', '')'''

new_save_script = '''        script_text = script_data.get('tts_script') or script_data.get('script', '')
        global LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME
        LAST_GENERATED_SCRIPT = script_text
        LAST_GENERATED_TOPIC = topic
        LAST_GENERATED_ANIME = anime_name'''

code = code.replace(old_save_script, new_save_script)

# Also for custom script:
old_custom_save = '''        script_text = custom_script.strip()'''
new_custom_save = '''        script_text = custom_script.strip()
        global LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME
        LAST_GENERATED_SCRIPT = script_text
        LAST_GENERATED_TOPIC = topic
        LAST_GENERATED_ANIME = anime_name'''

code = code.replace(old_custom_save, new_custom_save)

# 2. Update dest_mp4_path success logic to trigger files.download() for Colab
old_finish = '''        shutil.copy(local_mp4_path, dest_mp4_path)
        print(f"✅ TẠO VIDEO THÀNH CÔNG: {dest_mp4_path}", flush=True)'''

new_finish = '''        shutil.copy(local_mp4_path, dest_mp4_path)
        print(f"✅ TẠO VIDEO THÀNH CÔNG: {dest_mp4_path}", flush=True)
        try:
            from google.colab import files
            print(f"📥 Đang tự động tải video ({dest_mp4_path.name}) về máy tính của bạn...", flush=True)
            files.download(str(dest_mp4_path))
        except Exception as e_dl:
            pass'''

code = code.replace(old_finish, new_finish)

with open('c2.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated c2.py!")
