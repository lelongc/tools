import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace h(o.id) with await c(8),h(o.id)
pattern_bg = r's\.push\(\{link:y\[t\],response:f,groupName:gName\}\),h\(o\.id\)'
replacement_bg = 's.push({link:y[t],response:f,groupName:gName});await c(8);h(o.id)'

new_text = re.sub(pattern_bg, replacement_bg, text)

if new_text != text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched background.js")
else:
    print("Could not find pattern in background.js")

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    content_text = f.read()

# Swap the order of await y(10) and chrome.storage.local.set
pattern_content = r'await y\(10\);\s*// Wait 10 seconds.*?\s*chrome\.storage\.local\.set\(\{ operationStatus: "successful" \}\);'
replacement_content = 'chrome.storage.local.set({ operationStatus: "successful" });\n            await y(10); // Wait 10 seconds for success status, as requested by user'

new_content_text = re.sub(pattern_content, replacement_content, content_text)

if new_content_text != content_text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'w', encoding='utf-8') as f:
        f.write(new_content_text)
    print("Patched content.js")
else:
    print("Could not find pattern in content.js")
