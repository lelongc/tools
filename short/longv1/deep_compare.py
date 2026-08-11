"""
Deep comparison between 1.scribe (works) and Auto_Project.scribe (freezes).
Extract raw drawing.xml from both and compare every detail.
"""
import zipfile
import sys

def extract_raw_xml(path):
    with zipfile.ZipFile(path, 'r') as z:
        return z.read('drawing.xml')

good_xml = extract_raw_xml(r'd:\folder\tools\short\longv1\proj\1.scribe')
bad_xml = extract_raw_xml(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe')

print("=== FILE SIZES ===")
print(f"1.scribe drawing.xml: {len(good_xml)} bytes")
print(f"Auto_Project.scribe drawing.xml: {len(bad_xml)} bytes")

print("\n=== RAW XML HEADER (first 500 chars) ===")
print("GOOD:")
print(good_xml[:500].decode('utf-8'))
print("\nBAD:")
print(bad_xml[:500].decode('utf-8'))

print("\n=== RAW XML FOOTER (last 200 chars) ===")
print("GOOD:")
print(good_xml[-200:].decode('utf-8'))
print("\nBAD:")
print(bad_xml[-200:].decode('utf-8'))

# Check encoding declaration
good_str = good_xml.decode('utf-8')
bad_str = bad_xml.decode('utf-8')

print("\n=== DRAWING TAG ATTRIBUTES ===")
# Extract <drawing ...> tag
import re
good_drawing = re.search(r'<drawing\s+(.*?)>', good_str, re.DOTALL)
bad_drawing = re.search(r'<drawing\s+(.*?)>', bad_str, re.DOTALL)

if good_drawing:
    print("GOOD <drawing> attrs:")
    attrs = re.findall(r'(\w+)="([^"]*)"', good_drawing.group(1))
    for k, v in attrs:
        if k != 'options':
            print(f"  {k}={v[:80]}")
        else:
            print(f"  {k}={v[:200]}")

if bad_drawing:
    print("\nBAD <drawing> attrs:")
    attrs = re.findall(r'(\w+)="([^"]*)"', bad_drawing.group(1))
    for k, v in attrs:
        if k != 'options':
            print(f"  {k}={v[:80]}")
        else:
            print(f"  {k}={v[:200]}")
