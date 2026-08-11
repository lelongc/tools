import zipfile
import xml.etree.ElementTree as ET

zip_path = r'd:\folder\tools\short\longv1\proj\1.scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml_content = z.read('drawing.xml')
    root = ET.fromstring(xml_content)
    for i, el in enumerate(root.findall('element')):
        print(f"Elem {i+1}: targetTime={el.get('targetTime')} pauseTime={el.get('pauseTime')} transitionTime={el.get('transitionTime')}")
