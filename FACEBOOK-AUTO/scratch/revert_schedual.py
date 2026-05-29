with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'chrome.storage.local.get(["posts"],t=>{e(t.posts||[])})',
    'chrome.storage.local.get(["postKey"],t=>{e(t.postKey||[])})'
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("schedual.js reverted")
