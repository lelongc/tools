import json

def patch():
    with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)
        
    for cell in nb['cells']:
        if cell['cell_type'] == 'code':
            new_source = []
            for line in cell['source']:
                if "content = \"\"" in line and "shutil.copy(" in "".join(cell['source']):
                    # This is the else branch for is_svg
                    new_line = line.replace("content = \"\"", "content = '<svg width=\"100\" height=\"100\"></svg>'")
                    new_source.append(new_line)
                    print("Patched line content!")
                elif "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'drawingXML=\"\" imageRef=\"{actual_filename}\"'" in line:
                    # Revert back to injecting the escaped content to drawingXML for PNGs, and adding imageRef
                    new_line = line.replace(
                        "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'drawingXML=\"\" imageRef=\"{actual_filename}\"'",
                        "drawing_xml_attr = f'drawingXML=\"{html.escape(content, quote=True)}\"' if is_svg else f'drawingXML=\"{html.escape(content, quote=True)}\" imageRef=\"{actual_filename}\"'"
                    )
                    new_source.append(new_line)
                    print("Patched line drawing_xml_attr!")
                else:
                    new_source.append(line)
            cell['source'] = new_source
            
    with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=2)
        print("Notebook saved.")

if __name__ == '__main__':
    patch()
