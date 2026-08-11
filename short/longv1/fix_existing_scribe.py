"""
Fix the EXISTING Auto_Project.scribe file by replacing all &gt; with >
and removing the <?xml?> declaration. This creates a fixed version you can test immediately.
"""
import zipfile
import os

input_path = r'd:\folder\tools\short\longv1\proj\Auto_Project.scribe'
output_path = r'd:\folder\tools\short\longv1\proj\Auto_Project_FIXED.scribe'

with zipfile.ZipFile(input_path, 'r') as zin:
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'drawing.xml':
                xml_text = data.decode('utf-8')
                
                # Count before
                gt_count = xml_text.count('&gt;')
                print(f"Before fix: {gt_count} &gt; entities found")
                
                # Remove <?xml?> declaration  
                if xml_text.startswith('<?xml'):
                    xml_text = xml_text[xml_text.index('?>') + 2:].lstrip()
                    print("Removed <?xml?> declaration")
                
                # Replace ALL &gt; with >
                xml_text = xml_text.replace('&gt;', '>')
                
                # Verify
                gt_after = xml_text.count('&gt;')
                print(f"After fix: {gt_after} &gt; entities remaining")
                
                data = xml_text.encode('utf-8')
            zout.writestr(item, data)

print(f"\nFixed file saved to: {output_path}")
print("Please open this in VideoScribe to test!")
