import zipfile
import xml.etree.ElementTree as ET

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project copy.scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml_content = z.read('drawing.xml')
    root = ET.fromstring(xml_content)
    
    for i, el in enumerate(root.findall('element')):
        print(f"Elem {i+1}:")
        print(f"  cameraScale: {el.get('cameraScale')}")
        print(f"  cameraPositionX: {el.get('cameraPositionX')}")
        print(f"  cameraPositionY: {el.get('cameraPositionY')}")
        print(f"  currentPosX: {el.get('currentPosX')}")
        print(f"  currentPosY: {el.get('currentPosY')}")
        print(f"  scalesX: {el.get('scalesX')}, scalesY: {el.get('scalesY')}, theScale: {el.get('theScale')}")
        
