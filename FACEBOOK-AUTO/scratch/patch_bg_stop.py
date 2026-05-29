import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add global gGlobalName
old_decl = 'let e=!1,t=[],o=[],s=[];'
new_decl = 'let e=!1,t=[],o=[],s=[],gGlobalName="";'

if old_decl in text:
    text = text.replace(old_decl, new_decl)

# 2. In a(r), set gGlobalName
old_loop_start = 't=f.links.slice();for(let t=0;'
new_loop_start = 't=f.links.slice();gGlobalName=gName;for(let t=0;'

if old_loop_start in text:
    text = text.replace(old_loop_start, new_loop_start)

# 3. In stopPosting, use gGlobalName
old_stop = 'o.forEach(e=>{s.push({link:e,response:"failed"})})'
new_stop = 'o.forEach(e=>{s.push({link:e,response:"failed",groupName:gGlobalName})})'

if old_stop in text:
    text = text.replace(old_stop, new_stop)

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Successfully patched background.js for stopPosting groupName")
