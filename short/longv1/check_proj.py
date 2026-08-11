import zipfile
import re

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe'
try:
    with zipfile.ZipFile(zip_path, 'r') as z:
        xml = z.read('drawing.xml').decode('utf-8')
        
        # Check newlines in drawingXML
        matches = re.findall(r'drawingXML="(.*?)"', xml, re.DOTALL)
        has_newline = False
        for m in matches:
            if '\n' in m or '\r' in m:
                has_newline = True
                print('Found newline in drawingXML')
                break
        if not has_newline:
            print('No newlines in drawingXML.')
            
        # Check audio
        audio_match = re.search(r'voiceOver="(.*?)"', xml)
        print('Audio:', audio_match.group(1) if audio_match else 'None')
        
        # Check scales
        scales = re.findall(r'cameraScale="(.*?)"', xml)
        print('Camera scales:', scales[:5])
        
        # Check element count
        elems = re.findall(r'<element ', xml)
        print('Element count:', len(elems))
        
        # Look for potential invalid XML inside the attributes
        print("XML size:", len(xml))
        
except Exception as e:
    print('Error:', e)
