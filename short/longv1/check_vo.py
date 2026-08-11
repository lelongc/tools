import zipfile
import re

path = r'd:\folder\tools\short\longv1\proj\1.scribe'
with zipfile.ZipFile(path, 'r') as z:
    xml_data = z.read('drawing.xml').decode('utf-8')
    vo = re.search(r'voiceOver="([^"]*)"', xml_data)
    vov = re.search(r'voiceOverVolume="([^"]*)"', xml_data)
    print("1.scribe voiceOver:", vo.group(0) if vo else "None")
    print("1.scribe voiceOverVolume:", vov.group(0) if vov else "None")
