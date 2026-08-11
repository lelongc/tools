import zipfile
import xml.etree.ElementTree as ET

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    xml = z.read('drawing.xml')
    root = ET.fromstring(xml)
    for i, el in enumerate(root.findall('element')):
        svg_content = el.get('drawingXML', '')
        
        print(f"\n--- Elem {i} ---")
        print(f"Type: {el.get('elementType')}")
        print(f"imageRef: {el.get('imageRef', 'N/A')}")
        print(f"SVG length: {len(svg_content)}")
        
        if svg_content:
            # Check if SVG starts with <svg
            if not svg_content.strip().startswith('<svg'):
                print("WARNING: Does not start with <svg")
                print(svg_content[:100])
            
            # Check xmlns
            if 'xmlns="http://www.w3.org/2000/svg"' not in svg_content:
                print("WARNING: Missing xmlns=\"http://www.w3.org/2000/svg\"")
                
            # Try parsing the SVG itself with ElementTree
            try:
                svg_root = ET.fromstring(svg_content)
                # Check for path tags
                paths = svg_root.findall('.//{http://www.w3.org/2000/svg}path')
                print(f"Number of paths: {len(paths)}")
            except ET.ParseError as e:
                print(f"SVG XML PARSE ERROR: {e}")
                print("Snippet:", svg_content[:200])
                print("Ending:", svg_content[-200:])
