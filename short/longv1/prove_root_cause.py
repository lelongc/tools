"""
The ROOT CAUSE of VideoScribe freezing:
Python's html.escape() converts > to &gt; but VideoScribe expects raw > inside attribute values.

In the GOOD file (1.scribe):
  - drawingXML uses &lt; for < but raw > for >
  - filters uses &lt; for < but raw > for >  
  - availableRecolours uses &lt; for < but raw > for >
  - options uses &lt; for < but raw > for >
  - The closing /> of self-closing SVG tags is: /&gt; in BAD but /> in GOOD

In the BAD file (Auto_Project.scribe):
  - html.escape() converts BOTH < to &lt; AND > to &gt;
  - This double-escaping of > causes VideoScribe to fail to parse the SVG content

SOLUTION: Use html.escape() but then convert &gt; back to >
Or better: manually escape only < and " and & but leave > alone.
"""
import zipfile
import re

# Verify the exact difference
good_path = r'd:\folder\tools\short\longv1\proj\1.scribe'
bad_path = r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe'

with zipfile.ZipFile(good_path, 'r') as z:
    good = z.read('drawing.xml').decode('utf-8')
with zipfile.ZipFile(bad_path, 'r') as z:
    bad = z.read('drawing.xml').decode('utf-8')

# Count occurrences
print("=== GOOD FILE ===")
print(f"  &gt; count: {good.count('&gt;')}")
print(f"  &lt; count: {good.count('&lt;')}")
print(f"  raw > count (outside tags): lots")

print("\n=== BAD FILE ===")  
print(f"  &gt; count: {bad.count('&gt;')}")
print(f"  &lt; count: {bad.count('&lt;')}")

# Show the options tag difference specifically
good_opt = re.search(r'options="(.*?)"', good)
bad_opt = re.search(r'options="(.*?)"', bad)
print(f"\n=== OPTIONS CLOSING TAG ===")
print(f"Good options ends with: ...{repr(good_opt.group(1)[-10:])}")
print(f"Bad options ends with:  ...{repr(bad_opt.group(1)[-10:])}")

# Show SVG closing tags
good_svg_closings = re.findall(r'(/\S{0,4}>)', good_opt.group(1)) if good_opt else []
bad_svg_closings = re.findall(r'(/\S{0,4}>)', bad_opt.group(1)) if bad_opt else []
print(f"\nGood options self-close patterns: {good_svg_closings}")

# Also check drawingXML self-closing tags
good_dxml = re.findall(r'drawingXML="(.*?)"', good, re.DOTALL)
bad_dxml = re.findall(r'drawingXML="(.*?)"', bad, re.DOTALL)

if good_dxml:
    print(f"\nGood drawingXML[0] closing > pattern:")
    # Find all > and &gt;
    gt_raw = good_dxml[0].count('>')
    gt_esc = good_dxml[0].count('&gt;')
    print(f"  raw >: {gt_raw}, &gt;: {gt_esc}")

if bad_dxml:
    print(f"\nBad drawingXML[0] closing > pattern:")
    gt_raw = bad_dxml[0].count('>')
    gt_esc = bad_dxml[0].count('&gt;')
    print(f"  raw >: {gt_raw}, &gt;: {gt_esc}")
