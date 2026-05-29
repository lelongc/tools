import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the p() function which does status checking
idx = text.find('async function p(e = 1, t = 10)')
print("=== p() function (status checker) ===")
print(text[idx:idx+2000])
