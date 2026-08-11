import zipfile
import xml.etree.ElementTree as ET

zip_path = r'd:\folder\tools\short\longv1\proj\Auto_Project copy.scribe'
with zipfile.ZipFile(zip_path, 'r') as z:
    file_list = z.namelist()
    print('Files in archive:', file_list)
    
    xml_content = z.read('drawing.xml')
    root = ET.fromstring(xml_content)
    
    for i, el in enumerate(root.findall('element')):
        el_type = el.get("elementType")
        print(f'Elem {i+1} elementType={el_type}')
        if el_type == 'image':
            image_ref = el.get('imageRef')
            print(f'  imageRef: {image_ref} (in zip: {image_ref in file_list})')
        
    audio = root.find('audio/file')
    if audio is not None:
        audio_file = audio.text
        print(f'Audio file: {audio_file} (in zip: {audio_file in file_list})')
