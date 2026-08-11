"""
Add post-processing to replace &gt; with > in the final .scribe zip file.
Insert the code right after the zipfile creation loop ends, before generate_scribe_project() call.
"""
import json

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] != 'code':
        continue
    src = ''.join(cell['source'])
    if 'def generate_scribe_project' not in src:
        continue
    
    new_source = []
    for i, line in enumerate(cell['source']):
        if line.strip() == 'generate_scribe_project()':
            # Insert post-processing BEFORE this call
            post_process_lines = [
                "    # === CRITICAL POST-PROCESSING: Fix &gt; -> > for VideoScribe ===\n",
                "    # VideoScribe CANNOT parse &gt; entities - it freezes/hangs!\n",
                "    # Python's xml/html libraries always escape > to &gt; which breaks VS.\n",
                "    import tempfile\n",
                "    tmp_path = output_filename + '.tmp'\n",
                "    with zipfile.ZipFile(output_filename, 'r') as zin:\n",
                "        with zipfile.ZipFile(tmp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n",
                "            for item in zin.infolist():\n",
                "                data = zin.read(item.filename)\n",
                "                if item.filename == 'drawing.xml':\n",
                "                    xml_text = data.decode('utf-8')\n",
                "                    count_before = xml_text.count('&gt;')\n",
                "                    xml_text = xml_text.replace('&gt;', '>')\n",
                "                    data = xml_text.encode('utf-8')\n",
                "                    if count_before > 0:\n",
                "                        print(f'Post-fix: replaced {count_before} &gt; entities with raw >')\n",
                "                zout.writestr(item, data)\n",
                "    os.replace(tmp_path, output_filename)\n",
                "\n",
            ]
            new_source.extend(post_process_lines)
            print(f"Inserted post-processing at line {i}")
        new_source.append(line)
    
    cell['source'] = new_source

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

# Verify
with open(notebook_path, 'r', encoding='utf-8') as f:
    nb2 = json.load(f)
for cell in nb2['cells']:
    if cell['cell_type'] == 'code':
        src = ''.join(cell['source'])
        if 'Post-fix: replaced' in src:
            print("VERIFIED: post-processing code is present!")
            # Also compile check
            try:
                compile(src, 'test', 'exec')
                print("VERIFIED: Code compiles OK!")
            except SyntaxError as e:
                print(f"SYNTAX ERROR: {e}")
