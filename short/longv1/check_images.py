import zipfile
import xml.etree.ElementTree as ET
zip_path = r'd:\folder\tools\short\longv1\proj\1.scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml = z.read('drawing.xml')
    root = ET.fromstring(xml)
    has_image = False
    for i, el in enumerate(root.findall('element')):
        if el.get('elementType') == 'image':
            has_image = True
            print(f'Elem {i}: imageRef={el.get("imageRef")}')
    if not has_image:
        print("No image elements found in 1.scribe.")
