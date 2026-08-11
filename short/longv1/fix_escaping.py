"""
ULTIMATE FIX: Replace html.escape() with custom escaping that matches VideoScribe's format.

VideoScribe format rules (proven from 1.scribe analysis):
  - < must be escaped to &lt;
  - " must be escaped to &quot;  
  - > must be kept as raw >  (NOT &gt;)
  - & must be escaped to &amp; (but only standalone &, not already-escaped sequences)
  
Python's html.escape(quote=True) does: & -> &amp;, < -> &lt;, > -> &gt;, " -> &quot;
The &gt; conversion is what breaks VideoScribe!

Also fix:
  - The options attribute: /&gt; -> />
  - filters, availableRecolours, recolouringSchemes: all use &lt; for < and raw > 
"""
import json
import re

notebook_path = r'd:\folder\tools\short\longv1\auto_scribe.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell_idx, cell in enumerate(nb['cells']):
    if cell['cell_type'] != 'code':
        continue
    
    src = ''.join(cell['source'])
    if 'def generate_scribe_project' not in src:
        continue
    
    print(f"Found generate_scribe_project in cell {cell_idx}")
    
    # Now rebuild the entire source with fixes
    new_lines = []
    for line in cell['source']:
        original = line
        
        # Fix 1: Replace html.escape() calls with custom escaping
        # The drawingXML line
        if "html.escape(content, quote=True)" in line:
            # Replace html.escape with our custom function
            line = line.replace(
                "html.escape(content, quote=True)",
                "videoscribe_escape(content)"
            )
            print(f"  Fixed html.escape in: {original.strip()[:60]}...")
        
        # Fix 2: Fix the options_val - it currently uses &gt; which is wrong
        if '&gt;' in line and 'options_val' in line:
            line = line.replace('&gt;', '>')
            print(f"  Fixed &gt; in options_val")
        
        # Fix 3: Fix filters, availableRecolours, recolouringSchemes
        if 'filters=' in line and '&gt;' in line and 'element_xml' in line:
            line = line.replace('&gt;', '>')
            print(f"  Fixed &gt; in element_xml filters/recolours")
        elif '&lt;filters/&gt;' in line:
            line = line.replace('&lt;filters/&gt;', '&lt;filters/>')
            print(f"  Fixed filters closing tag")
        elif '&lt;availableRecolours/&gt;' in line:
            line = line.replace('&lt;availableRecolours/&gt;', '&lt;availableRecolours/>')
            print(f"  Fixed availableRecolours closing tag")
        elif '&lt;recolouringSchemes/&gt;' in line:
            line = line.replace('&lt;recolouringSchemes/&gt;', '&lt;recolouringSchemes/>')
            print(f"  Fixed recolouringSchemes closing tag")
            
        new_lines.append(line)
    
    # Now inject the videoscribe_escape function at the top of the cell
    # Find the line with "def generate_scribe_project"
    inject_idx = None
    for i, line in enumerate(new_lines):
        if 'def generate_scribe_project' in line:
            inject_idx = i
            break
    
    if inject_idx is not None:
        # Insert the helper function right after the def line + any docstring
        # Actually, insert it BEFORE the def line
        helper_func = [
            "def videoscribe_escape(s):\n",
            "    \"\"\"Escape for VideoScribe XML attributes. Only escape < and \" and &, keep > raw.\"\"\"\n",
            "    s = s.replace('&', '&amp;')\n",
            "    s = s.replace('<', '&lt;')\n",
            "    s = s.replace('\"', '&quot;')\n",
            "    # DO NOT escape > - VideoScribe requires raw >\n",
            "    return s\n",
            "\n",
        ]
        for j, h_line in enumerate(helper_func):
            new_lines.insert(inject_idx + j, h_line)
        print("  Injected videoscribe_escape() helper function")
    
    cell['source'] = new_lines
    print(f"  Cell {cell_idx} updated successfully")

# Also need to remove "import html" if present, since we no longer use it
for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        new_source = []
        for line in cell['source']:
            if line.strip() == 'import html':
                print("Removed 'import html'")
                continue
            new_source.append(line)
        cell['source'] = new_source

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("\n=== DONE! Notebook saved with VideoScribe-compatible escaping ===")
