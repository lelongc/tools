import zipfile
import xml.etree.ElementTree as ET

def analyze_scribe(path, name):
    print(f"=== ANALYZING: {name} ({path}) ===")
    with zipfile.ZipFile(path, 'r') as z:
        print("Zip contents:", z.namelist())
        xml_data = z.read('drawing.xml').decode('utf-8')
        print(f"XML length: {len(xml_data)} bytes")
        
        try:
            root = ET.fromstring(xml_data)
            print("Root tag:", root.tag)
            print("Root attribs:", root.attrib)
            
            elements = root.findall('element')
            print(f"Total elements: {len(elements)}")
            
            for i, el in enumerate(elements[:5]):
                print(f"\n--- Element {i+1} ---")
                print("ElementType:", el.get("elementType"))
                print("Attributes:")
                for k, v in el.attrib.items():
                    if k != "drawingXML":
                        print(f"  {k}: {v}")
                    else:
                        print(f"  drawingXML: [length {len(v)}]")
        except Exception as e:
            print("XML ERROR:", e)

analyze_scribe(r'd:\folder\tools\short\longv1\proj\1.scribe', '1.scribe')
analyze_scribe(r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe', 'Auto_Project (1).scribe')
