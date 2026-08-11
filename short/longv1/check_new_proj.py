import zipfile
import xml.etree.ElementTree as ET
import re

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml = z.read('drawing.xml')
    print(f"Total XML size: {len(xml)}")
    try:
        root = ET.fromstring(xml)
        for i, el in enumerate(root.findall('element')):
            etype = el.get('elementType')
            img_ref = el.get('imageRef', 'N/A')
            xml_len = len(el.get('drawingXML', ''))
            scale = el.get('cameraScale', 'N/A')
            drawStyle = el.get('drawStyle', 'N/A')
            print(f'Elem {i:02d}: type={etype:<8} imgRef={img_ref:<25} xml_len={xml_len:<6} scale={scale:<6} style={drawStyle}')
    except Exception as e:
        print("XML Parse Error:", e)
