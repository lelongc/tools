import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('#postTextInput', '#postContentInput')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("popup.js patched for postTextInput -> postContentInput")
