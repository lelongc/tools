import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the operationStatus removal point
idx = text.find('chrome.storage.local.remove("operationStatus"')
print("=== AROUND operationStatus removal ===")
print(text[max(0,idx-300):idx+600])
print()
print()

# Now find all references to operationStatus
import re
matches = [(m.start(), text[max(0,m.start()-30):m.start()+100]) for m in re.finditer(r'operationStatus', text)]
print("=== ALL operationStatus references ===")
for p, s in matches:
    print(f"Pos {p}: ...{s}...")
    print()
