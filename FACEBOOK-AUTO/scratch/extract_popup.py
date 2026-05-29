import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('postingFinished')
if idx == -1:
    print("Not found")
else:
    print(text[max(0, idx-100):idx+1000])
