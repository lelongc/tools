import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [(m.start(), text[max(0, m.start() - 50): m.start() + 100]) for m in re.finditer(r'B\("(?:posts|postKey)"', text)]
for p, s in matches:
    print(f'Pos {p}: ...{s}...')
