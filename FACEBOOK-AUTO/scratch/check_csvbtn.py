import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    popup = f.read()

idx = popup.find('importCsvBtn')
print(popup[max(0,idx-200):idx+500])
