with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'r', encoding='utf-8') as f:
    text = f.read()

inject_str = 'window.onerror = function(msg, url, line, col, error) { alert("Error in schedual.js: " + msg + " at " + line + ":" + col); };\n'
if 'window.onerror' not in text:
    text = inject_str + text
    with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.js', 'w', encoding='utf-8') as f:
        f.write(text)
print('Injected onerror to schedual.js')
