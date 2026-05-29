def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace literal '\\n' at the start of the injected code
    bad_str = '\\\\n// --- EXTENSION'
    if bad_str in content:
        content = content.replace(bad_str, '\\n// --- EXTENSION')
        print(f"Fixed {path}")
    else:
        print(f"No match in {path}")
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('popup.js')
fix_file('content.js')
