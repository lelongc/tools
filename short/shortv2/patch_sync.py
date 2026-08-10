import os

c2_path = r"d:\folder\tools\short\shortv2\c2.py"
with open(c2_path, "r", encoding="utf-8") as f:
    code = f.read()

# Replace definition of build_fixed_two_second_timeline
old_def = """def build_fixed_two_second_timeline(scenes, anime_name, topic, total_duration):"""
new_def = """def build_fixed_two_second_timeline(scenes, anime_name, topic, total_duration, all_words=None):"""
code = code.replace(old_def, new_def)

# Add char tracking and word tracking BEFORE the loop
old_loop_start = """    for i in range(num_segments):
        st = i * segment_dur"""

new_loop_start = """    # Pre-calculate char boundaries for scenes for accurate sync
    total_chars = sum(len(sc.get("text_snippet", "")) for sc in scenes)
    char_accum = 0
    for sc in scenes:
        sc["char_start"] = char_accum
        char_accum += len(sc.get("text_snippet", ""))
        sc["char_end"] = char_accum

    if all_words:
        total_word_chars = sum(len(w["word"]) for w in all_words)
        w_char_accum = 0
        for w in all_words:
            w["char_start"] = w_char_accum
            w_char_accum += len(w["word"])
            w["char_end"] = w_char_accum

    for i in range(num_segments):
        st = i * segment_dur"""

code = code.replace(old_loop_start, new_loop_start)

# Update the scene mapping logic inside the loop
old_sc_idx = """        sc_idx = min(int((i / num_segments) * len(scenes)), len(scenes) - 1)
        sc = scenes[sc_idx]"""

new_sc_idx = """        mt = (st + (st + segment_dur if i < num_segments - 1 else total_duration)) / 2.0
        sc_idx = 0
        
        if all_words and total_word_chars > 0 and total_chars > 0:
            target_w = None
            closest_dist = 999999
            for w in all_words:
                if w["start"] <= mt <= w["end"]:
                    target_w = w
                    break
                dist = min(abs(w["start"] - mt), abs(w["end"] - mt))
                if dist < closest_dist:
                    closest_dist = dist
                    target_w = w
                    
            if target_w:
                w_mid = (target_w["char_start"] + target_w["char_end"]) / 2.0
                ratio = w_mid / total_word_chars
                target_char_idx = ratio * total_chars
                
                for idx, sc_tmp in enumerate(scenes):
                    if sc_tmp["char_start"] <= target_char_idx <= sc_tmp["char_end"]:
                        sc_idx = idx
                        break
        else:
            sc_idx = min(int((i / num_segments) * len(scenes)), len(scenes) - 1)
            
        sc = scenes[sc_idx]"""

code = code.replace(old_sc_idx, new_sc_idx)

# Finally, update the call to it in line 1579 (approx)
old_call = """timeline = build_fixed_two_second_timeline(scenes, anime_name, topic, total_dur)"""
new_call = """timeline = build_fixed_two_second_timeline(scenes, anime_name, topic, total_dur, all_words)"""
code = code.replace(old_call, new_call)

with open(c2_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Patched sync successfully!")
