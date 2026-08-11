import re
with open(r'd:\folder\tools\short\longv1\proj\1_extracted\drawing.xml', 'r', encoding='utf-8') as f:
    text = f.read()
elements = text.split('<element ')
for i, el in enumerate(elements[1:16]):
    cx = re.search(r'currentPosX="([^"]+)"', el)
    cy = re.search(r'currentPosY="([^"]+)"', el)
    cpx = re.search(r'cameraPositionX="([^"]+)"', el)
    cpy = re.search(r'cameraPositionY="([^"]+)"', el)
    cs = re.search(r'cameraScale="([^"]+)"', el)
    ts = re.search(r'theScale="([^"]+)"', el)
    sx = re.search(r'scalesX="([^"]+)"', el)
    print(f"Elem {i+1}: POS({cx.group(1) if cx else ''}, {cy.group(1) if cy else ''}) CAM({cpx.group(1) if cpx else ''}, {cpy.group(1) if cpy else ''}) CAM_SCALE({cs.group(1) if cs else ''}) ELEM_SCALE({ts.group(1) if ts else ''}/{sx.group(1) if sx else ''})")
