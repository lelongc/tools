import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# find r()("#postSelect, #groupSelect").select2({placeholder:"Chọn một mục",allowClear:!0,width:"100%"})
target = 'r()("#postSelect, #groupSelect").select2({placeholder:"Chọn một mục",allowClear:!0,width:"100%"})'
replacement = 'try { r()("#postSelect, #groupSelect").select2({placeholder:"Chọn một mục",allowClear:!0,width:"100%"}); } catch(err) { alert("Select2 error: " + err); }'

if target in text:
    text = text.replace(target, replacement)
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Injected try-catch around select2")
else:
    print("Could not find target string!")
