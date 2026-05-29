import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_str = 'group:{links:e.metadata.groupLinks||[]}'
new_str = 'group:{links:e.metadata.groupLinks||[],title:e.metadata.groupTitle}'

if old_str in text:
    text = text.replace(old_str, new_str)
    with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully patched background.js for schedule group title")
else:
    print("Could not find pattern in background.js")
