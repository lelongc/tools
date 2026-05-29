with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('id="closeModalBtn" style="border: none; background: none;"', 'id="closeModalBtn" style="border: none; background: none; z-index: 9999;"')

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("schedual.html patched for z-index")
