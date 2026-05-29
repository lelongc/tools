import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    popup = f.read()

# Replace t()("#importCsvBtn").on("click",E) 
# with t()("#importCsvBtn").on("click",()=>t()("#csvFileInput").click()),t()("#csvFileInput").on("change",E)

old_str = 't()("#importCsvBtn").on("click",E)'
new_str = 't()("#importCsvBtn").on("click",()=>t()("#csvFileInput").click()),t()("#csvFileInput").on("change",E)'

if old_str in popup:
    popup = popup.replace(old_str, new_str)
    with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'w', encoding='utf-8') as f:
        f.write(popup)
    print("Successfully patched CSV logic in popup.js")
else:
    print("Could not find exact string. Searching for similar pattern...")
    idx = popup.find('importCsvBtn')
    print(popup[max(0,idx-50):idx+100])
