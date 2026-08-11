import json

with open('auto_scribe.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        src = ''.join(cell['source'])
        if 'def generate_scribe_project' in src:
            # Check for any remaining &gt; 
            for i, line in enumerate(cell['source']):
                if '&gt;' in line:
                    print(f"Line {i}: STILL HAS &gt;: {line.strip()[:120]}")
                if 'html.escape' in line:
                    print(f"Line {i}: STILL HAS html.escape: {line.strip()[:120]}")
                if 'videoscribe_escape' in line:
                    print(f"Line {i}: HAS videoscribe_escape: {line.strip()[:80]}")
            
            # Check for remaining &gt; in element_xml string 
            for i, line in enumerate(cell['source']):
                if 'element_xml' in line and '&gt;' in line:
                    print(f"\n!!! CRITICAL: element_xml still has &gt; at line {i}")
                    print(f"    {line.strip()[:200]}")
                    
print("\nDone checking.")
