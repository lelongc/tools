import json

def patch():
    with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)
        
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            new_source = []
            for line in cell['source']:
                if "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'imageRef=\"{actual_filename}\"'" in line:
                    new_line = line.replace(
                        "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'imageRef=\"{actual_filename}\"'",
                        "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'drawingXML=\"\" imageRef=\"{actual_filename}\"'"
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
