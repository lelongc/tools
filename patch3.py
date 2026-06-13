import re

file_path = 'd:/folder/tools/flow-image/mx-a3f8b2c1.js'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

old_on = 'chrome.downloads.onDeterminingFilename.addListener((e,t)=>{const a=re.get(e.url)||re.get(e.id);if(a)t({filename:a,conflictAction:"uniquify"})})'
# Remove the global listener completely
if old_on in text:
    text = text.replace(old_on + ',', '')  # It is followed by a comma usually.
    text = text.replace(old_on, '')        # Fallback
    print("Removed global onDeterminingFilename in TurboFlow")
else:
    print("Warning: old_on not found")

# The current Lt is:
old_lt = 'function Lt(e,t){return new Promise((a,r)=>{re.set(e,t);chrome.downloads.download({url:e,filename:t,saveAs:!1,conflictAction:"uniquify"},id=>{chrome.runtime.lastError?r(new Error(chrome.runtime.lastError.message)):a(id)})})}'
new_lt = 'function Lt(e,t){return new Promise((a,r)=>{const L=(i,s)=>{if(i.url===e){s({filename:t,conflictAction:"uniquify"});chrome.downloads.onDeterminingFilename.removeListener(L)}};chrome.downloads.onDeterminingFilename.addListener(L);chrome.downloads.download({url:e,filename:t,saveAs:!1,conflictAction:"uniquify"},id=>{if(chrome.runtime.lastError){chrome.downloads.onDeterminingFilename.removeListener(L);r(new Error(chrome.runtime.lastError.message))}else{a(id)}})})} '

if old_lt in text:
    text = text.replace(old_lt, new_lt)
    print("Patched Lt to use dynamic listener")
else:
    print("Warning: old_lt not found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
