import re
def extract_balanced(text, start_idx):
    idx = start_idx
    count = 0
    in_str = False
    str_char = None
    for i in range(start_idx, len(text)):
        char = text[i]
        if not in_str:
            if char in ('"', "'", "`"):
                in_str = True
                str_char = char
            elif char == '{': count += 1
            elif char == '}':
                count -= 1
                if count == 0: return text[start_idx:i+1]
        else:
            if char == str_char and text[i-1] != '\\': in_str = False
    return text[start_idx:start_idx+200]

f = open('popup.js', encoding='utf-8').read()
m = re.search(r'function w\([^)]*\)\s*\{', f)
if m:
    print('Function C:')
    print(extract_balanced(f, m.end()-1))
m2 = re.search(r'function E\([^)]*\)\s*\{', f)
if m2:
    print('Function E:')
    print(extract_balanced(f, m2.end()-1))
