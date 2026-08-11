import zipfile
import re
import os
import base64

bad_zip = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
test_g = r'd:\folder\tools\short\longv1\proj\TestG_image_href.scribe'

png_counter = 0
extracted_pngs = {}

def replace_func(match):
    global png_counter
    elem_text = match.group(0)
    
    b64_match = re.search(r'data:image/png;base64,([^&"]+)', elem_text)
    if b64_match:
        b64_data = b64_match.group(1)
        img_name = f'extracted_{png_counter}.png'
        extracted_pngs[img_name] = base64.b64decode(b64_data)
        png_counter += 1
        
        # We will use an empty SVG as drawingXML, and set imageRef to the actual PNG.
        new_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>'
        escaped_svg = new_svg.replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
        
        # We MUST replace the ENTIRE drawingXML="...". Since we know it starts with drawingXML=" and ends with the next " after the huge string.
        # It's better to use regex with dotall just for drawingXML
        elem_text = re.sub(r'drawingXML=".*?"', f'drawingXML="{escaped_svg}" imageRef="{img_name}"', elem_text, count=1, flags=re.DOTALL)
    
    return elem_text

try:
    with zipfile.ZipFile(bad_zip, 'r') as zin:
        raw_xml = zin.read('drawing.xml').decode('utf-8')
        
        # Fix regex to match until the final />\n
        fixed_xml = re.sub(r'<element.+?/>\n', replace_func, raw_xml, flags=re.DOTALL)
        
        with zipfile.ZipFile(test_g, 'w', zipfile.ZIP_DEFLATED) as zout:
            zout.writestr('drawing.xml', fixed_xml.encode('utf-8'))
            for f in zin.namelist():
                if f != 'drawing.xml':
                    zout.writestr(f, zin.read(f))
            for img_name, img_data in extracted_pngs.items():
                zout.writestr(img_name, img_data)
                
        print(f"Created TestG! Size: {len(fixed_xml)}")
        print(f"Extracted {png_counter} PNGs")
except Exception as e:
    print(f"Error: {e}")
