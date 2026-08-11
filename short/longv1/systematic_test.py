"""
TEST 1: Pure copy of 1.scribe with just 5 elements - NO modifications at all.
If this fails to load, the problem is in how we create the ZIP file.
If this loads, the ZIP creation is fine and the problem is in element content.
"""
import zipfile
import os

src = r'd:\folder\tools\short\longv1\proj\1.scribe'

# Test A: Just copy 1.scribe exactly (should always work)
test_a = r'd:\folder\tools\short\longv1\proj\TestA_exact_copy.scribe'
with zipfile.ZipFile(src, 'r') as zin:
    with zipfile.ZipFile(test_a, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            zout.writestr(item, zin.read(item.filename))
print(f"TestA: Exact copy of 1.scribe -> {test_a}")
print(f"  Original size: {os.path.getsize(src)}")
print(f"  Copy size: {os.path.getsize(test_a)}")

# Test B: 1.scribe XML with only 5 elements (raw string manipulation)
with zipfile.ZipFile(src, 'r') as zin:
    raw_xml = zin.read('drawing.xml').decode('utf-8')
    other_files = {}
    for f in zin.namelist():
        if f != 'drawing.xml':
            other_files[f] = zin.read(f)

# Find element boundaries using raw string search
def find_element_boundaries(xml):
    """Find start/end positions of each <element .../> in raw XML."""
    boundaries = []
    pos = 0
    while True:
        start = xml.find('<element ', pos)
        if start == -1:
            break
        # Track quotes to find the real closing />
        in_quote = False
        j = start
        while j < len(xml) - 1:
            if xml[j] == '"':
                in_quote = not in_quote
            elif xml[j] == '/' and xml[j+1] == '>' and not in_quote:
                boundaries.append((start, j + 2))
                pos = j + 2
                break
            j += 1
        else:
            break
    return boundaries

bounds = find_element_boundaries(raw_xml)
print(f"\nFound {len(bounds)} elements in 1.scribe")

# Keep only first 5 elements
if len(bounds) >= 5:
    # Get text before first element
    header = raw_xml[:bounds[0][0]]
    # Get first 5 elements
    elements_text = raw_xml[bounds[0][0]:bounds[4][1]]
    # Get closing tag
    footer = '\n</drawing>'
    
    trimmed_xml = header + elements_text + footer
    
    test_b = r'd:\folder\tools\short\longv1\proj\TestB_5elem.scribe'
    with zipfile.ZipFile(test_b, 'w', zipfile.ZIP_DEFLATED) as zout:
        zout.writestr('drawing.xml', trimmed_xml.encode('utf-8'))
        for fname, data in other_files.items():
            zout.writestr(fname, data)
    print(f"\nTestB: 1.scribe with only 5 elements -> {test_b}")
    print(f"  Size: {os.path.getsize(test_b)}")

# Test C: Auto_Project.scribe XML but using ONLY SVGs (no PNGs)
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe', 'r') as zin:
    bad_xml = zin.read('drawing.xml').decode('utf-8')
    bad_files = {}
    for f in zin.namelist():
        if f != 'drawing.xml':
            bad_files[f] = zin.read(f)

bad_bounds = find_element_boundaries(bad_xml)
print(f"\nFound {len(bad_bounds)} elements in Auto_Project.scribe")

# Filter: keep only elements that are type="drawing" (SVG), skip type="image" (PNG)
import re
svg_only_elements = []
for start, end in bad_bounds:
    elem_text = bad_xml[start:end]
    if 'elementType="image"' not in elem_text:
        svg_only_elements.append(elem_text)
    else:
        print(f"  Skipping image element")

# Build test with only SVG elements from Auto_Project
bad_header = bad_xml[:bad_bounds[0][0]]
test_c_xml = bad_header + '\n'.join(svg_only_elements) + '\n</drawing>'

test_c = r'd:\folder\tools\short\longv1\proj\TestC_svg_only.scribe'
with zipfile.ZipFile(test_c, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', test_c_xml.encode('utf-8'))
    # Only add voiceover, skip PNG files
    if 'voiceover.mp3' in bad_files:
        zout.writestr('voiceover.mp3', bad_files['voiceover.mp3'])

print(f"\nTestC: Auto_Project with only SVG elements (no PNG) -> {test_c}")
print(f"  SVG elements: {len(svg_only_elements)}")
print(f"  Size: {os.path.getsize(test_c)}")

# Test D: Auto_Project with only the FIRST 3 SVG elements
test_d_xml = bad_header + '\n'.join(svg_only_elements[:3]) + '\n</drawing>'
test_d = r'd:\folder\tools\short\longv1\proj\TestD_3svg.scribe'
with zipfile.ZipFile(test_d, 'w', zipfile.ZIP_DEFLATED) as zout:
    zout.writestr('drawing.xml', test_d_xml.encode('utf-8'))
    if 'voiceover.mp3' in bad_files:
        zout.writestr('voiceover.mp3', bad_files['voiceover.mp3'])

print(f"\nTestD: Auto_Project with only first 3 SVG elements -> {test_d}")
print(f"  Size: {os.path.getsize(test_d)}")

print("\n=== PLEASE TEST THESE FILES IN ORDER ===")
print("TestA: Exact copy of 1.scribe (MUST work)")
print("TestB: 1.scribe with 5 elements (tests ZIP creation)")
print("TestC: Auto_Project SVG only, no PNG (tests SVG content)")  
print("TestD: Auto_Project first 3 SVGs only (minimal test)")
