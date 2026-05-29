import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the core posting loop - let me get a bigger chunk
idx = text.find('for(let t=0;t<y.length')
print("=== Core posting loop ===")
print(text[idx:idx+1000])
