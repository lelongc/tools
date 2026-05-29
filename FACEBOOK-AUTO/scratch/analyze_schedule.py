import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for m in re.finditer(r'schedulePost|startPosting', text):
    start = max(0, m.start()-100)
    end = min(len(text), m.start()+300)
    print(f"Pos {m.start()}: ...{text[start:end]}...")
    print()
