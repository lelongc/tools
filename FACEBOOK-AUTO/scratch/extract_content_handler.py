import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the message listener that handles createQuickPost
idx = text.find('contentcreateQuickPost')
print("=== contentcreateQuickPost handler ===")
print(text[max(0,idx-500):idx+1500])
print()
print("---")
print()

# Find all operationStatus references in content.js 
matches = [(m.start(), text[max(0,m.start()-50):m.start()+150]) for m in re.finditer(r'operationStatus', text)]
print("=== ALL operationStatus references in content.js ===")
for p, s in matches:
    print(f"Pos {p}: ...{s}...")
    print()
