import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    popup = f.read()

import re

print("=== CSV Import Listeners ===")
for m in re.finditer(r'importCsvBtn|csvFileInput', popup):
    start = max(0, m.start()-100)
    end = min(len(popup), m.start()+300)
    print(f"Pos {m.start()}: ...{popup[start:end]}...")
    print()

print("=== Function E (likely the import handler) ===")
idx = popup.find('function E()')
if idx != -1:
    print(popup[idx:idx+1500])
