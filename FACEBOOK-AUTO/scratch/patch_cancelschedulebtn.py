import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace document.getElementById("cancelScheduleBtn").addEventListener... with a safe version
text = text.replace(
    'document.getElementById("cancelScheduleBtn").addEventListener("click",()=>location.href="popup.html");',
    'if(document.getElementById("cancelScheduleBtn")) document.getElementById("cancelScheduleBtn").addEventListener("click",()=>location.href="popup.html");'
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("schedual.js patched to avoid cancelScheduleBtn crash")
