"""
DEFINITIVE TEST: Take the raw XML from 1.scribe, reduce it to just 3 elements,
and save as a new .scribe file. If this loads, the format is proven correct.
Then we know exactly what format to replicate.
"""
import zipfile
import re

# Get the raw XML from 1.scribe (NOT parsed by ElementTree - keep exact bytes)
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw = z.read('drawing.xml').decode('utf-8')
    file_list = z.namelist()

# Extract the <drawing ...> opening tag
drawing_open = re.match(r'(<drawing\s+[^>]*>)', good_raw, re.DOTALL).group(1)

# Extract ALL element tags (raw strings, not parsed)
elements_raw = re.findall(r'(<element\s+[^/]*/>)', good_raw, re.DOTALL)
print(f"Total elements extracted: {len(elements_raw)}")

# Take only the first 3 elements 
test_elements = elements_raw[:3]

# Build test XML using exact same format
test_xml = drawing_open + '\n'
for elem in test_elements:
    test_xml += elem + '\n'
test_xml += '</drawing>'

print(f"Test XML size: {len(test_xml)}")
print(f"Test XML starts with: {test_xml[:100]}")
print(f"Test XML ends with: {test_xml[-100:]}")

# Write to a test scribe file
output_path = r'd:\folder\tools\short\longv1\proj\Test_3elem.scribe'
with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', test_xml.encode('utf-8'))
    # Copy the voiceover.mp3 from the good file
    with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as zin:
        if 'voiceover.mp3' in zin.namelist():
            zout.writestr('voiceover.mp3', zin.read('voiceover.mp3'))

print(f"\nCreated: {output_path}")
print("Please open this in VideoScribe to verify the format works!")
