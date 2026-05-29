import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix null check
text = text.replace('null!==e', 'e!=null')

# 2. Fix the missing preventDefault on edit/delete buttons
text = text.replace(
    'function(){let e=t()(this).attr("target-index");e?(o.editMode="group",o.editIndex=e,m(e)):m()}',
    'function(ev){ev.preventDefault();let e=t()(this).attr("target-index");e!=null?(o.editMode="group",o.editIndex=e,m(e)):m()}'
)
text = text.replace(
    'function(){b(t()(this).attr("target-index"))}',
    'function(ev){ev.preventDefault();b(t()(this).attr("target-index"))}'
)
text = text.replace(
    'function(){let e=t()(this).attr("target-index");e?(o.editMode="post",o.editIndex=e,p(e)):p()}',
    'function(ev){ev.preventDefault();let e=t()(this).attr("target-index");e!=null?(o.editMode="post",o.editIndex=e,p(e)):p()}'
)
text = text.replace(
    'function(){_(t()(this).attr("target-index"))}',
    'function(ev){ev.preventDefault();_(t()(this).attr("target-index"))}'
)
text = text.replace(
    'function(){x(t()(this).attr("target-index"))}',
    'function(ev){ev.preventDefault();x(t()(this).attr("target-index"))}'
)
text = text.replace(
    'function(){let e=t()(this).attr("target-index");e?(o.editMode="product",o.editIndex=e,g(e)):g()}',
    'function(ev){ev.preventDefault();let e=t()(this).attr("target-index");e!=null?(o.editMode="product",o.editIndex=e,g(e)):g()}'
)

# 3. Make ALL links clickable in the log modal
old_link = 'let badgeClass = "bg-secondary", linkHtml = item.link;'
new_link = 'let badgeClass = "bg-secondary", linkHtml = `<a href="${item.link}" target="_blank" class="text-white text-decoration-underline" style="word-break: break-all;">${item.link}</a>`;'
text = text.replace(old_link, new_link)

# 4. Remove the override that was stripping it back to just Xem Bài Đăng for successful posts
text = text.replace(
    'linkHtml = `<a href="${item.link}" target="_blank" class="text-white text-decoration-underline" style="word-break: break-all;">Xem Bài Đăng</a>`;',
    ''
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("popup.js patched")
