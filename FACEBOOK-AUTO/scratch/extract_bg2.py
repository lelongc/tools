import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('chrome.runtime.onMessage.addListener(function(e,t,o){')
if idx == -1:
    idx = text.rfind('chrome.runtime.onMessage.addListener')
print(text[max(0, idx):idx+2500])
