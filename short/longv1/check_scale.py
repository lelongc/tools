import re
with open(r'd:\folder\tools\short\longv1\proj\1_extracted\drawing.xml', 'r', encoding='utf-8') as f:
    text = f.read()
elements = text.split('<element ')[1:10]
for i, el in enumerate(elements):
    th = re.search(r'targetHeight="([^"]+)"', el)
    ts = re.search(r'theScale="([^"]+)"', el)
    sx = re.search(r'scalesX="([^"]+)"', el)
    sy = re.search(r'scalesY="([^"]+)"', el)
    print(f"Elem {i+1}: targetHeight={th.group(1) if th else ''} theScale={ts.group(1) if ts else ''} scalesX={sx.group(1) if sx else ''} scalesY={sy.group(1) if sy else ''}")
