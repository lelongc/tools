content = open('content.js', encoding='utf-8').read()
idx = content.find('"successful"')
open('scratch/content_post.txt', 'w', encoding='utf-8').write(content[max(0, idx-3000):idx+3000])
