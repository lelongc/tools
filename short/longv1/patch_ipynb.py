import json

def patch():
    with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)
        
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            new_source = []
            for line in cell['source']:
                if "content = re.sub(r'<\\?xml[^>]*\\?>', '', f2.read())" in line:
                    new_line = line.replace(
                        "content = re.sub(r'<\\?xml[^>]*\\?>', '', f2.read())",
                        "content = re.sub(r'<\\?xml[^>]*\\?>', '', f2.read()).replace('\\n', ' ').replace('\\r', '')"
                    )
                    new_source.append(new_line)
                    print("Patched line!")
                else:
                    new_source.append(line)
            cell['source'] = new_source
            
    with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=2)
        print("Notebook saved.")

if __name__ == '__main__':
    patch()
