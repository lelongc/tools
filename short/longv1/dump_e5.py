import zipfile
import re
with zipfile.ZipFile(r'proj\Auto_Project (1).scribe', 'r') as z:
    xml = z.read('drawing.xml').decode('utf-8')
    elements = re.findall(r'<element.+?/>', xml, flags=re.DOTALL)
    e = elements[5]
    print(f"Length of element: {len(e)}")
    
    with open('element5_dump.txt', 'w', encoding='utf-8') as out:
        out.write(e)
