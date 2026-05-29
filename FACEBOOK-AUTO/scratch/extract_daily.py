import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('else if("daily"===i)')
print(text[max(0, idx-50):idx+500])
