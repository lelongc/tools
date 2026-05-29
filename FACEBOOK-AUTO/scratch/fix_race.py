import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Current order (BUGGY):
#   await g(o.id,d),await c(3),await new Promise(e=>{chrome.storage.local.remove("operationStatus",()=>{e()})});

# Fixed order: remove operationStatus BEFORE sending the message
old = 'await g(o.id,d),await c(3),await new Promise(e=>{chrome.storage.local.remove("operationStatus",()=>{e()})});'
new = 'await new Promise(e=>{chrome.storage.local.remove("operationStatus",()=>{e()})});await g(o.id,d),await c(3);'

if old in text:
    text = text.replace(old, new)
    with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("✅ Patched successfully! operationStatus is now removed BEFORE sending message to content.js")
else:
    print("❌ Could not find pattern")
    # Let's see what's there
    idx = text.find('await g(o.id,d)')
    print(text[idx:idx+200])
