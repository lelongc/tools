import zipfile
import re
import os

bad_zip = r'd:\folder\tools\short\longv1\proj\Auto_Project copy.scribe'
test_g = r'd:\folder\tools\short\longv1\proj\TestG_image_href.scribe'

try:
    with zipfile.ZipFile(bad_zip, 'r') as zin:
        raw_xml = zin.read('drawing.xml').decode('utf-8')
        png_files = [f for f in zin.namelist() if f.endswith('.png') or f.endswith('.jpg')]
        
        def replace_func(match):
            elem_text = match.group(0)
            ref_match = re.search(r'imageRef="([^"]+)"', elem_text)
            if ref_match:
                img_name = ref_match.group(1)
                new_svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><image href="{img_name}" width="800" height="800"/></svg>'
                escaped_svg = new_svg.replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
                elem_text = re.sub(r'drawingXML="[^"]*"', f'drawingXML="{escaped_svg}"', elem_text)
            
            elem_text = elem_text.replace('elementType="image"', 'elementType="drawing"')
            return elem_text
            
        fixed_xml = re.sub(r'<element[^>]*elementType="image"[^>]*>', replace_func, raw_xml)
        
        with zipfile.ZipFile(test_g, 'w', zipfile.ZIP_DEFLATED) as zout:
            zout.writestr('drawing.xml', fixed_xml.encode('utf-8'))
            for f in zin.namelist():
                if f != 'drawing.xml':
                    zout.writestr(f, zin.read(f))
                    
        print(f"Created TestG! Size: {len(fixed_xml)}")
except Exception as e:
    print(f"Error: {e}")
