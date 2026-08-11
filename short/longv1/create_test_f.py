import zipfile
import re

bad_zip = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
test_f = r'd:\folder\tools\short\longv1\proj\TestF_image_href.scribe'

try:
    with zipfile.ZipFile(bad_zip, 'r') as zin:
        raw_xml = zin.read('drawing.xml').decode('utf-8')
        
        # We want to replace the huge base64 with just an empty string for now, OR find a way to reference the PNG
        # Let's replace the huge base64 <image href="data:image/png;base64,..."> with <image href="0.png">
        # wait, we don't know the image filename from the XML directly.
        # But we can just replace data:image/png;base64,[^"]+ with empty string
        # Actually, let's just make the image empty for TestF to see if the freeze is caused by the HUGE XML size!
        fixed_xml = re.sub(r'data:image/png;base64,[^"]+', '', raw_xml)
        
        with zipfile.ZipFile(test_f, 'w', zipfile.ZIP_DEFLATED) as zout:
            zout.writestr('drawing.xml', fixed_xml.encode('utf-8'))
            for f in zin.namelist():
                if f != 'drawing.xml':
                    zout.writestr(f, zin.read(f))
                    
    print(f"Created TestF! Size: {len(fixed_xml)}")
except Exception as e:
    print(f"Error: {e}")
