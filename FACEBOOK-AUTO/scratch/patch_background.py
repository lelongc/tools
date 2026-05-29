import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix 1: Pass groupName in completed posts
# Find: const{timeInSeconds:p,group:f,maxDelay:maxD}=r,y=f.links;
# Find: s.push({link:y[t],response:f})
# But f is reused for response string. We'll add a new variable `gName = f.title || "Nhóm không tên"` and use it.

text = text.replace(
    'const{timeInSeconds:p,group:f,maxDelay:maxD}=r,y=f.links;',
    'const{timeInSeconds:p,group:f,maxDelay:maxD}=r,y=f.links,gName=f.title||"Nhóm không tên";'
)

text = text.replace(
    's.push({link:y[t],response:f})',
    's.push({link:y[t],response:f,groupName:gName})'
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("background.js patched")
