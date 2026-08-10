import json
import re

with open('c2.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix 1: Update glob to rglob and full case insensitive in build_fixed_two_second_timeline
old_glob_block = '''                statics = list(cdir.glob("*.jpg")) + list(cdir.glob("*.png")) + list(cdir.glob("*.jpeg")) + list(cdir.glob("*.webp"))
                gifs = list(cdir.glob("*.gif")) + list(cdir.glob("*.GIF"))
                gif_subdir = cdir / "gif"
                if gif_subdir.exists():
                    gifs += list(gif_subdir.glob("*.gif")) + list(gif_subdir.glob("*.GIF"))'''

new_glob_block = '''                statics = list(cdir.rglob("*.jpg")) + list(cdir.rglob("*.png")) + list(cdir.rglob("*.jpeg")) + list(cdir.rglob("*.webp")) + list(cdir.rglob("*.JPG")) + list(cdir.rglob("*.PNG")) + list(cdir.rglob("*.JPEG")) + list(cdir.rglob("*.WEBP"))
                gifs = list(cdir.rglob("*.gif")) + list(cdir.rglob("*.GIF"))'''

code = code.replace(old_glob_block, new_glob_block)

# Fix 2: Add resolve_char_key function and smart matching in build_fixed_two_second_timeline
old_matching_block = '''        valid_keys = [k for k in char_keys if k in available_chars]
        if not valid_keys:
            valid_keys = [main_subject_char]'''

new_matching_block = '''        valid_keys = []
        for k in char_keys:
            if not k or not isinstance(k, str): continue
            k_clean = k.strip()
            if k_clean in available_chars:
                if k_clean not in valid_keys: valid_keys.append(k_clean)
                continue
            # Match first name / alias
            k_first = k_clean.lower().replace("_", " ").split()[0]
            matched = None
            if len(k_first) >= 3:
                for ac in available_chars:
                    ac_first = ac.lower().replace("_", " ").split()[0]
                    if k_first == ac_first:
                        matched = ac
                        break
            if matched and matched not in valid_keys:
                valid_keys.append(matched)

        if not valid_keys:
            # Subnet text regex fallback
            snip_lower = sc.get("text_snippet", "").lower()
            for ac in available_chars:
                first_name = ac.lower().replace("_", " ").split()[0]
                if len(first_name) >= 3 and re.search(r'\\b' + re.escape(first_name) + r'\\b', snip_lower):
                    if ac not in valid_keys:
                        valid_keys.append(ac)
                        break

        if not valid_keys:
            valid_keys = [main_subject_char]'''

code = code.replace(old_matching_block, new_matching_block)

with open('c2.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Patched c2.py successfully!")
