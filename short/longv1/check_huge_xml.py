import zipfile
import re
try:
    with zipfile.ZipFile('proj/Auto_Project (1).scribe', 'r') as z:
        xml = z.read('drawing.xml').decode('utf-8')
        print(f'Length of drawing.xml: {len(xml)}')
        
        matches = re.findall(r'drawingXML="([^"]+)"', xml)
        print(f'Total elements: {len(matches)}')
        for i, m in enumerate(matches):
            if len(m) > 5000:
                print(f'Element {i} has huge drawingXML: {len(m)} bytes')
except Exception as e:
    print(e)
