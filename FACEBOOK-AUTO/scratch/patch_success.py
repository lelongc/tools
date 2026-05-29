import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the strict isSuccess line
old_isSuccess = 'const isSuccess = n("div[role=\'alert\']", "đã được đăng") || n("div[role=\'alert\']", "đã chia sẻ") || n("div[role=\'alert\']", "published") || n("div[role=\'dialog\']", "đã được đăng") || n("div[role=\'dialog\']", "đã chia sẻ") || n("div[role=\'dialog\']", "published");'
new_isSuccess = 'const isSuccess = n("span", "đã được đăng") || n("span", "đã chia sẻ") || n("span", "published") || n("span", "đã đăng") || n("div", "đã được đăng") || n("div", "đã chia sẻ") || n("div", "đã đăng") || n("div[role=\'alert\']", "published");'

if old_isSuccess in text:
    text = text.replace(old_isSuccess, new_isSuccess)
    print("Replaced isSuccess")
else:
    print("Could not find old_isSuccess")

# Replace await y(2) with await y(0.5)
# And the retry call p(e + 1, t) stays the same, but we will adjust the max retries from 15 to 60 where it's called
text = text.replace('await y(2);\n    return await p(e + 1, t);', 'await y(0.5);\n    return await p(e + 1, t);')

# Replace p(1, 15) with p(1, 60) (30 seconds total at 0.5s per retry)
text = text.replace('await p(1, 15)', 'await p(1, 60)')

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied to content.js")
