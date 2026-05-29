import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    js = f.read()

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.html', 'r', encoding='utf-8') as f:
    html = f.read()

ids = re.findall(r'getElementById\([\'"]([^\'"]+)[\'"]\)', js)
missing_ids = [i for i in set(ids) if f'id="{i}"' not in html and f"id='{i}'" not in html]

print('Missing IDs in HTML:', missing_ids)
