"""
Compare the EXACT raw bytes of the <drawing> opening tag and the first <element> tag
between working 1.scribe and broken Auto_Project.scribe.
Focus on escape sequences: &lt; vs < and &gt; vs > and &amp; etc.
"""
import zipfile
import re

def get_raw(path):
    with zipfile.ZipFile(path, 'r') as z:
        return z.read('drawing.xml').decode('utf-8')

good = get_raw(r'd:\folder\tools\short\longv1\proj\1.scribe')
bad = get_raw(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe')

# 1. Check: Does good file have <?xml?> header?
print("=== XML DECLARATION ===")
print(f"Good starts with <?xml: {good.startswith('<?xml')}")
print(f"Bad starts with <?xml: {bad.startswith('<?xml')}")

# 2. Compare options attribute escaping
print("\n=== OPTIONS ATTRIBUTE RAW ===")
good_options = re.search(r'options="(.*?)"', good)
bad_options = re.search(r'options="(.*?)"', bad)
if good_options:
    print(f"Good options: {repr(good_options.group(1))}")
if bad_options:
    print(f"Bad options:  {repr(bad_options.group(1))}")

# 3. Compare first element's drawingXML escaping  
print("\n=== FIRST ELEMENT drawingXML ESCAPING ===")
# Get raw drawingXML attribute values
good_dxml = re.findall(r'drawingXML="(.*?)"', good, re.DOTALL)
bad_dxml = re.findall(r'drawingXML="(.*?)"', bad, re.DOTALL)

if good_dxml:
    g = good_dxml[0][:200]
    print(f"Good[0] raw: {repr(g)}")
if bad_dxml:
    b = bad_dxml[0][:200]
    print(f"Bad[0] raw:  {repr(b)}")

# 4. Check escaping: in good file, are < escaped as &lt; or as &amp;lt; ?
print("\n=== ESCAPE ANALYSIS ===")
if good_dxml:
    print(f"Good uses &lt;: {'&lt;' in good_dxml[0]}")
    print(f"Good uses &amp;lt;: {'&amp;lt;' in good_dxml[0]}")
if bad_dxml:
    print(f"Bad uses &lt;: {'&lt;' in bad_dxml[0]}")
    print(f"Bad uses &amp;lt;: {'&amp;lt;' in bad_dxml[0]}")

# 5. Check availableRecolours and filters escaping
print("\n=== FILTERS/RECOLOURS ESCAPING ===")
good_filters = re.findall(r'filters="(.*?)"', good)
bad_filters = re.findall(r'filters="(.*?)"', bad)
if good_filters:
    print(f"Good filters[0]: {repr(good_filters[0])}")
if bad_filters:
    print(f"Bad filters[0]:  {repr(bad_filters[0])}")

good_ar = re.findall(r'availableRecolours="(.*?)"', good)
bad_ar = re.findall(r'availableRecolours="(.*?)"', bad)
if good_ar:
    print(f"Good availableRecolours[0]: {repr(good_ar[0])}")
if bad_ar:
    print(f"Bad availableRecolours[0]:  {repr(bad_ar[0])}")

good_rs = re.findall(r'recolouringSchemes="(.*?)"', good)
bad_rs = re.findall(r'recolouringSchemes="(.*?)"', bad)
if good_rs:
    print(f"Good recolouringSchemes[0]: {repr(good_rs[0])}")
if bad_rs:
    print(f"Bad recolouringSchemes[0]:  {repr(bad_rs[0])}")
