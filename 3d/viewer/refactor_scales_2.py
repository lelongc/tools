import re

with open('psx.js', 'r', encoding='utf-8') as f:
    code = f.read()

def repl_addF(m):
    obj = m.group(1)
    x = float(m.group(2)) * 0.75
    z = float(m.group(3)) * 0.75
    rest = m.group(4) if m.group(4) else ''
    return f"addF({obj}, {x:g}, {z:g}{rest});"

code = re.sub(r'addF\(([^,]+),\s*(-?[\d\.]+)\s*,\s*(-?[\d\.]+)(.*?)\);', repl_addF, code)

with open('psx.js', 'w', encoding='utf-8') as f:
    f.write(code)
print('Done fixing coords!')
