"""
Extract ALL unique attribute sets from the working 1.scribe to understand
the exact element structure VideoScribe expects.
"""
import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    root = ET.fromstring(z.read('drawing.xml'))

# Count attribute sets
attr_patterns = {}
for i, el in enumerate(root.findall('element')):
    keys = tuple(sorted(el.keys()))
    if keys not in attr_patterns:
        attr_patterns[keys] = []
    attr_patterns[keys].append(i)

print(f"Total elements: {len(root.findall('element'))}")
print(f"Unique attribute patterns: {len(attr_patterns)}")
print()

for pattern, indices in attr_patterns.items():
    el = root.findall('element')[indices[0]]
    print(f"=== Pattern used by {len(indices)} elements (e.g. elem {indices[0]}) ===")
    print(f"  Attributes ({len(pattern)}): {', '.join(pattern)}")
    # Print key values
    for k in pattern:
        v = el.get(k)
        if k == 'drawingXML':
            print(f"  {k}: [{len(v)} chars]")
        else:
            print(f"  {k}: {v}")
    print()
