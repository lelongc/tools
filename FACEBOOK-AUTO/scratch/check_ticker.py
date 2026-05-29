import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('scheduleTicker')
print("=== scheduleTicker alarm ===")
print(text[max(0,idx-100):idx+2500])
