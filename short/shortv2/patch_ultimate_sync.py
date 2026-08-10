import os

c2_path = r"d:\folder\tools\short\shortv2\c2.py"
with open(c2_path, "r", encoding="utf-8") as f:
    code = f.read()

# We will completely replace the `build_fixed_two_second_timeline` function
import re

# Find the start of the function
start_idx = code.find("def build_fixed_two_second_timeline")
if start_idx == -1:
    print("Cannot find function")
    exit(1)

# Find the start of the next function
end_idx = code.find("def render_mp4_video_word_sync", start_idx)
if end_idx == -1:
    end_idx = len(code)

new_func = """def build_fixed_two_second_timeline(scenes, anime_name, topic, total_duration, all_words=None):
    import random
    from pathlib import Path
    
    anime_dir = Path("d:/folder/tools/short/shortv2") / anime_name
    available_chars = []
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                available_chars.append(cdir.name)
                
    main_subject_char = available_chars[0] if available_chars else "Rimuru_Tempest"
    
    char_static_map = {}
    char_gif_map = {}
    if anime_dir.exists():
        for cdir in anime_dir.iterdir():
            if cdir.is_dir() and cdir.name != "output_shorts":
                statics = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp"))
                gifs = list(cdir.glob("*.gif")) + list(cdir.glob("*.GIF"))
                gif_subdir = cdir / "gif"
                if gif_subdir.exists():
                    gifs += list(gif_subdir.glob("*.gif")) + list(gif_subdir.glob("*.GIF"))

                random.shuffle(statics)
                random.shuffle(gifs)
                if statics: char_static_map[cdir.name] = statics
                if gifs: char_gif_map[cdir.name] = gifs

    all_anime_statics = [img for imgs in char_static_map.values() for img in imgs]
    all_anime_gifs = [img for imgs in char_gif_map.values() for img in imgs]
    all_anime_imgs = all_anime_statics + all_anime_gifs
    random.shuffle(all_anime_statics)
    random.shuffle(all_anime_imgs)

    used_statics_per_char = {c: [] for c in available_chars}
    used_gifs_per_char = {c: [] for c in available_chars}

    # Pre-calculate char boundaries for scenes
    total_chars = sum(max(1, len(sc.get("text_snippet", ""))) for sc in scenes)
    char_accum = 0
    for sc in scenes:
        sc["char_start"] = char_accum
        char_accum += max(1, len(sc.get("text_snippet", "")))
        sc["char_end"] = char_accum

    if all_words:
        total_word_chars = sum(max(1, len(w["word"])) for w in all_words)
        w_char_accum = 0
        for w in all_words:
            w["char_start"] = w_char_accum
            w_char_accum += max(1, len(w["word"]))
            w["char_end"] = w_char_accum
            
        for sc in scenes:
            target_start = sc["char_start"]
            target_end = sc["char_end"]
            
            sc_start_time = 0.0
            sc_end_time = total_duration
            
            if total_word_chars > 0 and total_chars > 0:
                ratio_start = target_start / total_chars
                w_target_start = ratio_start * total_word_chars
                for w in all_words:
                    if w["char_start"] >= w_target_start or w["char_end"] >= w_target_start:
                        sc_start_time = w["start"]
                        break
                        
                ratio_end = target_end / total_chars
                w_target_end = ratio_end * total_word_chars
                for w in reversed(all_words):
                    if w["char_end"] <= w_target_end or w["char_start"] <= w_target_end:
                        sc_end_time = w["end"]
                        break
            sc["start_time"] = sc_start_time
            sc["end_time"] = sc_end_time
    else:
        # Fallback if no words provided
        for i, sc in enumerate(scenes):
            sc["start_time"] = (i / len(scenes)) * total_duration
            sc["end_time"] = ((i + 1) / len(scenes)) * total_duration

    # Make strictly contiguous
    for i in range(len(scenes)):
        if i == 0:
            scenes[i]["start_time"] = 0.0
        else:
            scenes[i]["start_time"] = scenes[i-1]["end_time"]
            
        if i == len(scenes) - 1:
            scenes[i]["end_time"] = total_duration

    timeline_segments = []
    chunk_counter = 0

    for sc in scenes:
        st = sc["start_time"]
        et = sc["end_time"]
        dur = et - st
        if dur <= 0: dur = 0.1
        
        num_chunks = max(1, round(dur / 2.0))
        chunk_dur = dur / num_chunks
        
        assigned_char = sc.get("character_folder", "").strip()
        if not assigned_char or assigned_char not in available_chars:
            assigned_char = main_subject_char
            
        snippet_text = sc.get("text_snippet", "").lower()
        prefer_gif_base = any(kw in snippet_text for kw in ['skill', 'fight', 'power', 'attack', 'kill', 'demon', 'slash', 'blast', 'magic', 'true', 'ultimate'])
        
        for c_i in range(num_chunks):
            c_st = st + c_i * chunk_dur
            c_et = st + (c_i + 1) * chunk_dur if c_i < num_chunks - 1 else et
            
            prefer_gif = prefer_gif_base or (chunk_counter % 2 == 1)
            
            chosen_img = None
            if prefer_gif and assigned_char in char_gif_map:
                gif_pool = char_gif_map[assigned_char]
                used = used_gifs_per_char.get(assigned_char, [])
                avail = [g for g in gif_pool if g not in used]
                if not avail:
                    used_gifs_per_char[assigned_char] = []
                    avail = gif_pool
                if avail:
                    chosen_img = random.choice(avail)
                    used_gifs_per_char[assigned_char].append(chosen_img)

            if not chosen_img and assigned_char in char_static_map:
                static_pool = char_static_map[assigned_char]
                used = used_statics_per_char.get(assigned_char, [])
                avail = [s for s in static_pool if s not in used]
                if not avail:
                    used_statics_per_char[assigned_char] = []
                    avail = static_pool
                if avail:
                    chosen_img = random.choice(avail)
                    used_statics_per_char[assigned_char].append(chosen_img)

            if not chosen_img and all_anime_imgs:
                chosen_img = random.choice(all_anime_imgs)

            timeline_segments.append({
                "start": c_st,
                "end": c_et,
                "char": assigned_char,
                "snippet": snippet_text,
                "image_path": str(chosen_img) if chosen_img else ""
            })
            
            img_name = Path(chosen_img).name if chosen_img else "None"
            print(f"     🎬 Khớp ảnh [{assigned_char}] ({img_name}) cho mốc {c_st:.2f}s -> {c_et:.2f}s: \\\"{snippet_text}\\\"", flush=True)
            chunk_counter += 1

    return timeline_segments

"""

# Reconstruct code
full_code = code[:start_idx] + new_func + code[end_idx:]

with open(c2_path, "w", encoding="utf-8") as f:
    f.write(full_code)

print("Patched ultimate sync successfully!")
