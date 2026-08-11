import zipfile
import re
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    xml = z.read('drawing.xml').decode('utf-8')
    cw = re.search(r'cameraCanvasWid="([^"]+)"', xml)
    ch = re.search(r'cameraCanvasHei="([^"]+)"', xml)
    print('canvas wid:', cw.group(1) if cw else 'none')
    print('canvas hei:', ch.group(1) if ch else 'none')
