content = open('popup.js', encoding='utf-8').read()
idx = content.find('function D(){const e=t()("#postSelector").val()')
if idx != -1:
    open('scratch/content_D.txt', 'w', encoding='utf-8').write(content[max(0, idx):idx+1500])
else:
    print('Not found')
