import zipfile
import re

def parse_elements(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as z:
        xml = z.read('drawing.xml').decode('utf-8')
        elems = re.findall(r'<element (.*?)\s*/>', xml, re.DOTALL)
        return elems

def analyze():
    good_elems = parse_elements(r'd:\folder\tools\short\longv1\proj\1.scribe')
    bad_elems = parse_elements(r'd:\folder\tools\short\longv1\proj\Auto_Project (1).scribe')
    
    print("Good elems:", len(good_elems))
    print("Bad elems:", len(bad_elems))
    
    # Just print the first element's attributes from both
    if good_elems and bad_elems:
        print("\nGood [0] (first 200 chars):")
        print(good_elems[0][:200])
        print("\nBad [0] (first 200 chars):")
        print(bad_elems[0][:200])
        
        # Search for any differences in attribute names
        good_attrs = re.findall(r'(\w+)="', good_elems[0])
        bad_attrs = re.findall(r'(\w+)="', bad_elems[0])
        
        diff = set(bad_attrs) - set(good_attrs)
        print("\nAttributes in Bad but not Good:", diff)
        diff2 = set(good_attrs) - set(bad_attrs)
        print("Attributes in Good but not Bad:", diff2)
        
if __name__ == '__main__':
    analyze()
