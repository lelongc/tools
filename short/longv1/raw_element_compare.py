"""
REVERSE ENGINEERING APPROACH:
Instead of building XML from scratch, extract a SINGLE element from the WORKING 1.scribe,
study its EXACT byte-for-byte format, then replicate that format exactly.
"""
import zipfile
import re

# Extract the raw XML string (not parsed!) from 1.scribe
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw = z.read('drawing.xml').decode('utf-8')

with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe', 'r') as z:
    bad_raw = z.read('drawing.xml').decode('utf-8')

# Extract just the first complete <element .../> from each
good_first = re.search(r'(<element .*?/>)', good_raw, re.DOTALL).group(1)
bad_first = re.search(r'(<element .*?/>)', bad_raw, re.DOTALL).group(1)

# Write them to separate files for manual comparison
with open('good_element.txt', 'w', encoding='utf-8') as f:
    f.write(good_first)
with open('bad_element.txt', 'w', encoding='utf-8') as f:
    f.write(bad_first)

print(f"Good element length: {len(good_first)}")
print(f"Bad element length: {len(bad_first)}")

# Now do character-by-character comparison of the attributes (excluding drawingXML content)
# Strip out drawingXML content to compare structure
good_stripped = re.sub(r'drawingXML="[^"]*"', 'drawingXML="STRIPPED"', good_first)
bad_stripped = re.sub(r'drawingXML="[^"]*"', 'drawingXML="STRIPPED"', bad_first)

print(f"\nGood (stripped): {len(good_stripped)} chars")
print(f"Bad (stripped):  {len(bad_stripped)} chars")

print("\n=== GOOD ELEMENT (stripped) ===")
print(good_stripped)

print("\n=== BAD ELEMENT (stripped) ===")
print(bad_stripped)
