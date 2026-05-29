import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# use regex to replace
pattern = r'e\.target\.closest\("\.schedule-options"\)\|\|\(document\.querySelectorAll\("\.schedule-card"\)\.forEach\(e=>e\.classList\.remove\("active"\)\),this\.classList\.add\("active"\),this\.querySelector\(\'input\[name="scheduleType"\]\'\)\.checked=!0\)'
replacement = 'e.target.closest(".schedule-options") || e.target.closest("button") || e.target.closest("input") || this.classList.contains("active") || (document.querySelectorAll(".schedule-card").forEach(e=>e.classList.remove("active")),this.classList.add("active"),this.querySelector(\'input[name="scheduleType"]\').checked=!0)'

new_text = re.sub(pattern, replacement, text)

if new_text != text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched successfully via regex")
else:
    print("Could not find pattern")
