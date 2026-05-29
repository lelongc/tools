with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'id="alertContainer"' not in html:
    inject_str = '\n  <div id="alertContainer" class="position-absolute top-0 start-50 translate-middle-x mt-2" style="z-index: 1060; width: 90%;"></div>\n'
    html = html.replace('<body>', '<body>' + inject_str)
    with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('alertContainer injected')
else:
    print('alertContainer already exists')
