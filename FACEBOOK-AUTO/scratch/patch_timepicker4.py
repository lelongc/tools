import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We want to replace the current faulty logic that bypasses activation for inputs/buttons.
# The current string in the file (from my previous patch) is:
# e.target.closest(".schedule-options") || e.target.closest("button") || e.target.closest("input") || this.classList.contains("active") || (document.querySelectorAll(".schedule-card").forEach(e=>e.classList.remove("active")),this.classList.add("active"),this.querySelector('input[type="radio"]').checked=!0)

pattern = r'e\.target\.closest\("\.schedule-options"\)\s*\|\|\s*e\.target\.closest\("button"\)\s*\|\|\s*e\.target\.closest\("input"\)\s*\|\|\s*this\.classList\.contains\("active"\)\s*\|\|\s*\('
replacement = 'this.classList.contains("active") || ('

new_text = re.sub(pattern, replacement, text)

if new_text != text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched successfully!")
else:
    print("Could not find pattern")
