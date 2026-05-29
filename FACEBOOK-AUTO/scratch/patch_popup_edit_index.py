import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all occurrences of null!==o.editIndex with o.editIndex!=null
text = text.replace('null!==o.editIndex', 'o.editIndex!=null')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("popup.js patched for o.editIndex!=null")
