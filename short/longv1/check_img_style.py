import zipfile
import xml.etree.ElementTree as ET
zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml = z.read('drawing.xml')
    root = ET.fromstring(xml)
    for i, el in enumerate(root.findall('element')):
        if el.get('elementType') == 'image':
            print("Elem {}: drawStyle={} drawingXML_len={}".format(
                i, el.get("drawStyle"), len(el.get("drawingXML", ""))
            ))
