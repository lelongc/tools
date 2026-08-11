import zipfile
import re
with zipfile.ZipFile(r'proj\Auto_Project (1).scribe', 'r') as z:
    xml = z.read('drawing.xml').decode('utf-8')
    elements = re.findall(r'<element.+?/>', xml, flags=re.DOTALL)
    e = elements[5]
    print(e[-200:])
    print('-----')
    m = re.search(r'drawingXML=".*?"', e, flags=re.DOTALL)
    if m:
        print(f"Matched! Length: {len(m.group(0))}")
    else:
        print("No match!")
