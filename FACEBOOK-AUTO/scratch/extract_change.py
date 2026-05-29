import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [(m.start(), text[max(0, m.start() - 100): m.start() + 200]) for m in re.finditer(r'\.addEventListener\("change"', text)]
for p, s in matches:
    print(f'Pos {p}: ...{s}...')
