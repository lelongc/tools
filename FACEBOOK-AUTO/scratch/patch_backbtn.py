import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace document.getElementById("backBtn").addEventListener... with something safe
text = text.replace(
    'document.getElementById("backBtn").addEventListener("click",()=>location.href="popup.html");',
    'if(document.getElementById("backBtn")) document.getElementById("backBtn").addEventListener("click",()=>location.href="popup.html");'
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("schedual.js patched to avoid backBtn crash")
