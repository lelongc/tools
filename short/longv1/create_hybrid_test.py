"""
COMPLETELY DIFFERENT APPROACH:
Instead of trying to guess, take the WORKING 1.scribe file,
replace just the SVG content of the first element with a simple test SVG,
keep everything else EXACTLY the same, and save as a test file.

Then progressively add our own elements to narrow down exactly what breaks.
"""
import zipfile

# Step 1: Read raw XML from 1.scribe (the working file)
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw = z.read('drawing.xml').decode('utf-8')

# Step 2: Read raw XML from Auto_Project.scribe (broken)
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe', 'r') as z:
    bad_raw = z.read('drawing.xml').decode('utf-8')
    bad_files = z.namelist()
    bad_file_data = {}
    for f in bad_files:
        bad_file_data[f] = z.read(f)

# Step 3: The simplest possible test - take 1.scribe's XML structure 
# but strip it down to just 3 elements
# Find each element boundary properly
def find_elements(xml):
    """Find element boundaries accounting for nested quotes."""
    elements = []
    i = 0
    while i < len(xml):
        start = xml.find('<element ', i)
        if start == -1:
            break
        # Find the matching /> by tracking quote depth
        in_quote = False
        j = start
        while j < len(xml) - 1:
            c = xml[j]
            if c == '"':
                in_quote = not in_quote
            elif c == '/' and xml[j+1] == '>' and not in_quote:
                elements.append(xml[start:j+2])
                i = j + 2
                break
            j += 1
        else:
            break
    return elements

good_elements = find_elements(good_raw)
bad_elements = find_elements(bad_raw)

print(f"Good file: {len(good_elements)} elements")
print(f"Bad file: {len(bad_elements)} elements")

# Step 4: Create a HYBRID file:
# - Use the <drawing> tag from 1.scribe (known to work)
# - Replace elements with elements from Auto_Project.scribe
# - Add audio reference

# Extract the drawing tag from good file
drawing_start = good_raw.find('<drawing ')
drawing_tag_end = good_raw.find('>', drawing_start) + 1
good_drawing_tag = good_raw[drawing_start:drawing_tag_end]

# Modify the drawing tag to add voiceover if Auto_Project has it  
if 'voiceOver=' not in good_drawing_tag and 'voiceover.mp3' in bad_file_data:
    # Add voiceover attribute
    good_drawing_tag = good_drawing_tag[:-1] + ' voiceOver="voiceover.mp3" voiceOverVolume="1">'

print(f"\nDrawing tag:\n{good_drawing_tag[:200]}...")

# Step 5: Build the hybrid XML
hybrid_xml = good_drawing_tag + '\n'
for elem in bad_elements:
    hybrid_xml += elem + '\n'
hybrid_xml += '</drawing>'

print(f"\nHybrid XML size: {len(hybrid_xml)}")
print(f"Hybrid &gt; count: {hybrid_xml.count('&gt;')}")

# Step 6: Save as Hybrid_Test.scribe
output_path = r'd:\folder\tools\short\longv1\proj\Hybrid_Test.scribe'
with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', hybrid_xml.encode('utf-8'))
    # Copy all non-xml files from Auto_Project
    for fname, data in bad_file_data.items():
        if fname != 'drawing.xml':
            zout.writestr(fname, data)

print(f"\nCreated: {output_path}")

# Step 7: Also create a MINIMAL test with just 1 element from good file
# with voiceover from bad file
minimal_xml = good_drawing_tag + '\n'
minimal_xml += good_elements[0] + '\n'
minimal_xml += '</drawing>'

minimal_path = r'd:\folder\tools\short\longv1\proj\Minimal_Test.scribe'
with zipfile.ZipFile(minimal_path, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', minimal_xml.encode('utf-8'))
    if 'voiceover.mp3' in bad_file_data:
        zout.writestr('voiceover.mp3', bad_file_data['voiceover.mp3'])

print(f"Created: {minimal_path}")
print("\nTest these files in VideoScribe:")
print("1. Minimal_Test.scribe - 1 element from 1.scribe (should work)")
print("2. Hybrid_Test.scribe - elements from Auto_Project in 1.scribe shell")
