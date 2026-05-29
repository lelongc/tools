import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix isSuccess in p()
old_success = 'const isSuccess = n("span", "just now") || n("span", "vừa xong") || n("div[role=\'alert\']", "đã được đăng") || n("div[role=\'alert\']", "đã chia sẻ") || n("div[role=\'alert\']", "published") || n("span", "đã được đăng") || n("span", "đã chia sẻ");'

new_success = 'const isSuccess = n("div[role=\'alert\']", "đã được đăng") || n("div[role=\'alert\']", "đã chia sẻ") || n("div[role=\'alert\']", "published") || n("div[role=\'dialog\']", "đã được đăng") || n("div[role=\'dialog\']", "đã chia sẻ") || n("div[role=\'dialog\']", "published");'

if old_success in text:
    text = text.replace(old_success, new_success)
else:
    print("WARNING: Could not find old_success string")

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("content.js patched")
