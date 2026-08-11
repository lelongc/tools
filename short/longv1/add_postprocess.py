"""
THE REAL ULTIMATE FIX:
The notebook uses f-strings to build XML. The videoscribe_escape() function
already avoids &gt;. BUT we need to also make sure the ENTIRE final XML output
does a global replacement of &gt; -> > just in case any slips through.

This patch adds a final step right before writing the XML file:
  xml_content = xml_content.replace('&gt;', '>')
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
    for line in cell['source']:
        new_source.append(line)
        
        # After the line that closes the XML writing (f.write('</drawing>')),
        # we need to re-open the file and do a global replace.
        # Actually, better approach: collect all xml in a string first, 
        # then do the replace, then write once.
        # 
        # But that's a big refactor. Simpler: after the zip is created,
        # re-open the zip, read drawing.xml, replace &gt;, write back.
    
    cell['source'] = new_source

# Instead of modifying the XML writing loop, add a POST-PROCESSING step
# right after the zipfile is created, that re-opens it and fixes the XML.
for cell in nb['cells']:
    if cell['cell_type'] != 'code':
        continue
    src = ''.join(cell['source'])
    if 'def generate_scribe_project' not in src:
        continue
    
    new_source = []
    for line in cell['source']:
        # Find the line that creates the final zip and prints the success message
        if 'print(f"' in line and 'Auto_Project.scribe' in line:
            # Insert post-processing BEFORE the print
            post_process = [
                "\n",
                "    # === POST-PROCESSING: Fix &gt; -> > for VideoScribe compatibility ===\n",
                "    import tempfile, shutil as shutil2\n",
                "    with zipfile.ZipFile(output_filename, 'r') as zin:\n",
                "        tmp_path = output_filename + '.tmp'\n",
                "        with zipfile.ZipFile(tmp_path, 'w', zipfile.ZIP_DEFLATED) as zout:\n",
                "            for item in zin.infolist():\n",
                "                data = zin.read(item.filename)\n",
                "                if item.filename == 'drawing.xml':\n",
                "                    xml_str = data.decode('utf-8')\n",
                "                    xml_str = xml_str.replace('&gt;', '>')\n",
                "                    data = xml_str.encode('utf-8')\n",
                "                    print(f'Post-fix: removed {xml_str.count(chr(38)+\"gt;\")+ xml_str.count(\"&gt;\")} remaining &gt; entities')\n",
                "                zout.writestr(item, data)\n",
                "    os.replace(tmp_path, output_filename)\n",
                "    print('Post-processing: &gt; -> > replacement complete!')\n",
                "\n",
            ]
            new_source.extend(post_process)
        new_source.append(line)
    
    cell['source'] = new_source

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("Notebook saved with post-processing step!")

# Verify
with open(notebook_path, 'r', encoding='utf-8') as f:
    nb2 = json.load(f)
for cell in nb2['cells']:
    if cell['cell_type'] == 'code':
        src = ''.join(cell['source'])
        if 'Post-processing' in src:
            print("Verified: post-processing code is present!")
            break
