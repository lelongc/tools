import zipfile
import re
with zipfile.ZipFile(r'proj\1.scribe', 'r') as z:
    xml = z.read('drawing.xml').decode('utf-8')
    elements = re.findall(r'<element.+?/>', xml, flags=re.DOTALL)
    print(elements[0][-500:])
