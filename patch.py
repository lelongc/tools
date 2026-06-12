import re

file_path = 'd:/folder/tools/flow-image/mx-a3f8b2c1.js'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Lt
old_lt = 'function Lt(e,t){return new Promise((a,r)=>{chrome.downloads.download({url:e,filename:t,saveAs:!1,conflictAction:"uniquify"},e=>{chrome.runtime.lastError?r(new Error(chrome.runtime.lastError.message)):(re.set(e,t),a(e))})})}'
new_lt = 'function Lt(e,t){return new Promise((a,r)=>{re.set(e,t);chrome.downloads.download({url:e,filename:t,saveAs:!1,conflictAction:"uniquify"},id=>{chrome.runtime.lastError?r(new Error(chrome.runtime.lastError.message)):a(id)})})}'

if old_lt in text:
    text = text.replace(old_lt, new_lt)
    print("Patched Lt")
else:
    print("Warning: old_lt not found")

# Replace onDeterminingFilename
old_on = 'chrome.downloads.onDeterminingFilename.addListener((e,t)=>{const a=re.get(e.id);t(a?{filename:a,conflictAction:"uniquify"}:{filename:e.filename||"download",conflictAction:"uniquify"})})'
new_on = 'chrome.downloads.onDeterminingFilename.addListener((e,t)=>{const a=re.get(e.url)||re.get(e.id);t(a?{filename:a,conflictAction:"uniquify"}:{filename:e.filename||"download",conflictAction:"uniquify"})})'

if old_on in text:
    text = text.replace(old_on, new_on)
    print("Patched onDeterminingFilename")
else:
    print("Warning: old_on not found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
