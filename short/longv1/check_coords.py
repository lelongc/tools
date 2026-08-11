import zipfile
import re

def extract_coords(zip_path, name):
    print(f'--- {name} ---')
    with zipfile.ZipFile(zip_path, 'r') as z:
        xml = z.read('drawing.xml').decode('utf-8')
        elements = xml.split('<element ')[1:10]
        for i, el in enumerate(elements):
            px = re.search(r'currentPosX="([^"]+)"', el)
            cx = re.search(r'cameraPositionX="([^"]+)"', el)
            cy = re.search(r'cameraPositionY="([^"]+)"', el)
            cs = re.search(r'cameraScale="([^"]+)"', el)
            if px and cx and cy:
                print(f'Elem {i+1}: POS({px.group(1)}) CAM({cx.group(1)}, {cy.group(1)}) SCALE({cs.group(1) if cs else ""})')

extract_coords(r'd:\folder\tools\short\longv1\proj\1.scribe', '1.scribe')
