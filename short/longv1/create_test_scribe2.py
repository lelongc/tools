"""
Extract raw elements from 1.scribe - handle multiline elements properly.
"""
import zipfile
import re

with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw = z.read('drawing.xml').decode('utf-8')

# The elements might have newlines inside the drawingXML attribute
# Let's find them differently - find <element and then the closing />
# Use a more robust regex
elements = []
pos = 0
while True:
    start = good_raw.find('<element ', pos)
    if start == -1:
        break
    end = good_raw.find('/>', start)
    if end == -1:
        break
    elements.append(good_raw[start:end+2])
    pos = end + 2

print(f"Total elements: {len(elements)}")
for i, elem in enumerate(elements[:3]):
    print(f"\nElement {i} length: {len(elem)}")
    print(f"First 150 chars: {elem[:150]}")
    print(f"Last 100 chars: ...{elem[-100:]}")

# Also extract the drawing tag
drawing_match = re.match(r'(<drawing\s.*?>)', good_raw, re.DOTALL)
drawing_open = drawing_match.group(1)
print(f"\nDrawing tag length: {len(drawing_open)}")

# Build a test file with first 5 elements
test_xml = drawing_open + '\n'
for elem in elements[:5]:
    test_xml += elem + '\n'
test_xml += '</drawing>'

print(f"\nTest XML total size: {len(test_xml)}")
print(f"Has &gt;: {test_xml.count('&gt;')}")

# Write it
output_path = r'd:\folder\tools\short\longv1\proj\Test_5elem.scribe'
with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', test_xml.encode('utf-8'))
    with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as zin:
        if 'voiceover.mp3' in zin.namelist():
            zout.writestr('voiceover.mp3', zin.read('voiceover.mp3'))

print(f"Created: {output_path}")
