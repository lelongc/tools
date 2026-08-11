"""
The drawingXML contains /> as part of the SVG content but escaped differently.
In the RAW XML: the /> inside drawingXML is part of the ATTRIBUTE VALUE string.
The actual element closing /> is the one that appears at the attribute level.

Let me use ElementTree to reconstruct and see the ACTUAL element.
"""
import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    root = ET.fromstring(z.read('drawing.xml'))

# Get first element and serialize it back to string
first_elem = root.findall('element')[0]

# Print ALL attributes (sorted to match) 
print("=== Element 0 ALL attributes (excluding drawingXML content) ===")
for k in sorted(first_elem.keys()):
    v = first_elem.get(k)
    if k == 'drawingXML':
        print(f"  {k}: [{len(v)} chars]")
    elif k == 'filters':
        print(f"  {k}: {repr(v[:100])}")
    else:
        print(f"  {k}: {v}")

# Now serialize it back and see what ElementTree produces
xml_str = ET.tostring(first_elem, encoding='unicode')
print(f"\n=== ET serialized length: {len(xml_str)} ===")
print(f"First 200: {xml_str[:200]}")
print(f"Last 200: {xml_str[-200:]}")

# The key question: when ET serializes, does it produce &gt; or > ?
print(f"\nET serialized has &gt;: {xml_str.count('&gt;')}")
print(f"ET serialized has &lt;: {xml_str.count('&lt;')}")

# Now let's look at the RAW XML between two elements
good_raw_str = z.read('drawing.xml').decode('utf-8') if False else ''
# Re-read
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw_str = z.read('drawing.xml').decode('utf-8')

# Use ET to find where element 0 ends
# Actually let's just use ElementTree to serialize the ENTIRE tree and compare
full_serialized = ET.tostring(root, encoding='unicode')
print(f"\n=== Full ET serialization ===")
print(f"Length: {len(full_serialized)}")
print(f"Has &gt;: {full_serialized.count('&gt;')}")
print(f"Original has &gt;: {good_raw_str.count('&gt;')}")
