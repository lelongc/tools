import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Current logic:
# this.classList.contains("active") || (document.querySelectorAll(".schedule-card").forEach(e=>e.classList.remove("active")),this.classList.add("active"),this.querySelector('input[type="radio"]').checked=!0)

pattern = r'this\.classList\.contains\("active"\)\s*\|\|\s*\(\s*document\.querySelectorAll\("\.schedule-card"\)\.forEach\(e=>e\.classList\.remove\("active"\)\),this\.classList\.add\("active"\),this\.querySelector\(\'input\[type="radio"\]\'\)\.checked=!0\s*\)'

replacement = '''
if (e.target.closest('input[type="time"]') || e.target.closest('input[type="date"]')) {
  this.querySelector('input[type="radio"]').checked = true;
} else if (!this.classList.contains("active")) {
  document.querySelectorAll(".schedule-card").forEach(e=>e.classList.remove("active"));
  this.classList.add("active");
  this.querySelector('input[type="radio"]').checked = true;
}
'''.strip().replace('\n', '')

new_text = re.sub(pattern, replacement, text)

if new_text != text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched successfully!")
else:
    print("Could not find pattern")
