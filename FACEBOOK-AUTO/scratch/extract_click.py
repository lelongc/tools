import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [(m.start(), text[max(0, m.start() - 50): m.start() + 500]) for m in re.finditer(r'document\.addEventListener\("click"', text)]
for p, s in matches:
    print(f'Pos {p}: ...{s}...')
