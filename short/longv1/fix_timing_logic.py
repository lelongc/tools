import json
import re

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

cell10 = "".join(nb['cells'][10]['source'])

# Find the duplicated timing logic
pattern_to_remove = r'''            # --- TIMING SYNC LOGIC ---
            start_ms = int(sentence\['start'\] \* 1000)
            if visual_timeline_ms < start_ms and len\(xml_elements\) > 0:
                gap_ms = start_ms - visual_timeline_ms
                import re as regex
                last_elem = xml_elements\[-1\]
                match = regex.search\(r'pauseTime="\\(\\\\d\+\\)"', last_elem\)
                if match:
                    old_pause = int\(match.group\(1\)\)
                    new_pause = old_pause \+ gap_ms
                    xml_elements\[-1\] = last_elem\[:match.start\(1\)\] \+ str\(new_pause\) \+ last_elem\[match.end\(1\):\]
                visual_timeline_ms \+= gap_ms
'''
# Actually, the string representation in python might be tricky with regex. Let's just do line by line.
lines = cell10.split('\n')
new_lines = []
skip = False
for line in lines:
    if line.strip() == "# --- TIMING SYNC LOGIC ---":
        # Keep the FIRST one, remove the SECOND one
        if any("TIMING SYNC" in l for l in new_lines):
            skip = True
            continue
    
    if skip:
        if line.strip() == "for i, img_meta in enumerate(raw_images):":
            skip = False
            new_lines.append(line)
        continue
    
    # Also replace timing formula
    if "total_time_ms = int(duration_per_img * 1000)" in line:
        new_lines.append(line)
        # We replace the next 3 lines
        skip = True
        new_lines.append("                trans_time_ms = min(500, int(total_time_ms * 0.15))")
        new_lines.append("                pause_time_ms = min(500, int(total_time_ms * 0.10))")
        new_lines.append("                target_time_ms = max(0, total_time_ms - trans_time_ms - pause_time_ms)")
        continue
        
    if skip and "pause_time_ms =" in line:
        skip = False
        continue
    
    # We need to increment visual_timeline_ms at the END of the image loop
    if "xml_elements.append(element_xml)" in line:
        new_lines.append(line)
        new_lines.append("                visual_timeline_ms += total_time_ms")
        continue
        
    new_lines.append(line)

new_cell10 = '\n'.join(new_lines)
nb['cells'][10]['source'] = [line + '\n' for line in new_cell10.split('\n')][:-1]
if not new_cell10.endswith('\n'):
    nb['cells'][10]['source'][-1] = nb['cells'][10]['source'][-1].rstrip('\n')

with open('auto_scribe.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, ensure_ascii=False, indent=2)

print("Notebook timing logic updated successfully!")
