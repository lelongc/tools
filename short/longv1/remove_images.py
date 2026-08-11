import zipfile
import xml.etree.ElementTree as ET
import os

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
new_zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project_Test.scribe'

try:
    with zipfile.ZipFile(zip_path, 'r') as z:
        xml_bytes = z.read('drawing.xml')
        root = ET.fromstring(xml_bytes.decode('utf-8'))
        
        # Find and remove image elements
        for el in root.findall('element'):
            if el.get('elementType') == 'image':
                root.remove(el)
                print(f"Removed image element {el.get('elementID')}")
                
        # Also remove element 7 just in case the DOCTYPE cleanup wasn't in this version of the scribe file!
        # Wait, the DOCTYPE cleanup was NOT in Auto_Project (1).scribe when the user created it!
        # Auto_Project (1).scribe was created BEFORE I gave them the xmlns fix, but wait, Auto_Project (1).scribe was created AFTER the SVG DOCTYPE fix?
        # Actually, let's just write the XML back without image elements to test.
        new_xml = ET.tostring(root, encoding='utf-8')
        
    # Create new zip
    with zipfile.ZipFile(new_zip_path, 'w') as new_z:
        with zipfile.ZipFile(zip_path, 'r') as z:
            for item in z.infolist():
                if item.filename == 'drawing.xml':
                    new_z.writestr('drawing.xml', new_xml)
                else:
                    new_z.writestr(item, z.read(item.filename))
    print("Created Auto_Project_Test.scribe without image elements.")
except Exception as e:
    print("Error:", e)
