import re

file_path = 'd:/folder/tools/flow-image/mx-a3f8b2c1.js'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

old_on = 'chrome.downloads.onDeterminingFilename.addListener((e,t)=>{const a=re.get(e.url)||re.get(e.id);t(a?{filename:a,conflictAction:"uniquify"}:{filename:e.filename||"download",conflictAction:"uniquify"})})'
new_on = 'chrome.downloads.onDeterminingFilename.addListener((e,t)=>{const a=re.get(e.url)||re.get(e.id);if(a)t({filename:a,conflictAction:"uniquify"})})'

if old_on in text:
    text = text.replace(old_on, new_on)
    print("Patched onDeterminingFilename in TurboFlow")
else:
    print("Warning: old_on not found")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
