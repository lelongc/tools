import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for m in re.finditer(r'loading-overlay', text):
    print(f"Pos {m.start()}: {text[max(0,m.start()-100):m.start()+300]}")
    print()

for m in re.finditer(r'function L\(', text):
    print(f"Pos {m.start()}: {text[max(0,m.start()-50):m.start()+300]}")
    print()

for m in re.finditer(r'function O\(', text):
    print(f"Pos {m.start()}: {text[max(0,m.start()-50):m.start()+300]}")
    print()
