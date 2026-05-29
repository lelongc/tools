import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace p(1, 60) with p(1, 160) to wait 80 seconds instead of 30
text = text.replace('await p(1, 60)', 'await p(1, 160)')

# Broaden isSuccess even more just in case Facebook uses weird text
old_isSuccess = 'const isSuccess = n("span", "đã được đăng") || n("span", "đã chia sẻ") || n("span", "published") || n("span", "đã đăng") || n("div", "đã được đăng") || n("div", "đã chia sẻ") || n("div", "đã đăng") || n("div[role=\'alert\']", "published");'
new_isSuccess = 'const isSuccess = n("span", "đã được đăng") || n("span", "đã chia sẻ") || n("span", "published") || n("span", "đã đăng") || n("span", "hiển thị trong nhóm") || n("div", "đã được đăng") || n("div", "đã chia sẻ") || n("div", "đã đăng") || n("div", "hiển thị trong nhóm") || n("div[role=\'alert\']", "published") || n("div[role=\'alert\']", "đăng");'

if old_isSuccess in text:
    text = text.replace(old_isSuccess, new_isSuccess)
    print("Patched isSuccess")
else:
    print("Could not find old isSuccess")

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'w', encoding='utf-8') as f:
    f.write(text)
