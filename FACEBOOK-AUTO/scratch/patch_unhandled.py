import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

inject_str = 'window.onunhandledrejection = function(event) { alert("Unhandled Promise Rejection in schedual.js: " + event.reason); };\n'
if 'window.onunhandledrejection' not in text:
    text = inject_str + text
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Injected onunhandledrejection to schedual.js')
else:
    print('Already injected')
