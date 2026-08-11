import zipfile
import re

def check_newlines(zip_path, name):
    try:
        with zipfile.ZipFile(zip_path, 'r') as z:
            xml = z.read('drawing.xml').decode('utf-8')
            print(f"--- {name} ---")
            
            # Find the first drawingXML value
            match = re.search(r'drawingXML="(.*?)"', xml, re.DOTALL)
            if match:
                val = match.group(1)
                print(f"Contains literal newlines? {'\n' in val}")
                if '\n' in val:
                    print(f"Number of newlines: {val.count('\n')}")
                    print(f"Snippet: {repr(val[:100])}")
            else:
                print("No drawingXML found")
    except Exception as e:
        print(f"Error reading {name}: {e}")

check_newlines(r'd:\folder\tools\short\longv1\proj\1.scribe', '1.scribe')
check_newlines(r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe', 'Auto_Project.scribe')
