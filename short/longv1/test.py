import re
with open(r'd:\folder\tools\short\longv1\proj\1_extracted\drawing.xml', 'r', encoding='utf-8') as f:
    text = f.read()
    
# Find the end of drawingXML and print the rest of the attributes
idx = text.find('&lt;/svg>"')
if idx != -1:
    end_of_tag = text.find('/>', idx)
    print(text[idx+10:end_of_tag])
