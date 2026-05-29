import re
f = open('content.js', 'r', encoding='utf-8').read()

def extract_balanced(text, start_idx):
    count = 0
    in_str = False
    str_char = None
    for i in range(start_idx, len(text)):
        char = text[i]
        if not in_str:
            if char in ('"', "'", "`"):
                in_str = True
                str_char = char
            elif char == '{': count += 1
            elif char == '}':
                count -= 1
                if count == 0: return text[start_idx:i+1]
        else:
            if char == str_char and text[i-1] != '\\': in_str = False
    return text[start_idx:start_idx+200]

m = re.search(r'async function p\(e\s*=\s*1,\s*t\s*=\s*10\)\s*\{', f)
if m:
    old_p_body = extract_balanced(f, m.end()-1)
    old_p = f[m.start():m.end()-1] + old_p_body
    new_p = '''async function p(e = 1, t = 10) {
  function n(e, t) {
    const n = document.querySelectorAll(e);
    return Array.from(n).some(e => e.textContent.toLowerCase().includes(t.toLowerCase()));
  }
  console.log(`Checking post status... attempt ${e}`);
  const isPending = n("div[role='alert']", "pending") || n("div[role='alert']", "approval") || n("div[role='alert']", "duy") || n("div[role='alert']", "quA");
  
  const isSuccess = n("div[role='alert']", "published") || n("div[role='alert']", "chia") || n("div[role='alert']", "ng") || n("div[role='alert']", "hi");
  
  const isRestricted = n("div", "We limit how often you can post") || n("span", "You can try again later") || n("div", "protect the community from spam") || n("span", "th") || n("div", "gi") || n("div", "spam");
  
  if (isPending) { console.log("Post went to pending approval"); return "success"; }
  if (isSuccess) { console.log("Post successfully published"); return "success"; }
  if (isRestricted) return console.log("Facebook posting temporarily limited."), "restricted";
  
  if (e > 5) {
      const dialogs = document.querySelectorAll('div[role="dialog"]');
      let createPostDialogExists = false;
      for (const d of dialogs) {
          if (d.offsetParent !== null && (d.textContent.toLowerCase().includes("post") || d.textContent.toLowerCase().includes("bA") || d.textContent.toLowerCase().includes("bài viết"))) {
              createPostDialogExists = true;
          }
      }
      if (!createPostDialogExists) {
          console.log("Create Post dialog closed and no restriction detected. Assuming success.");
          return "success";
      }
  }

  if (e < t) {
    await y(0.5);
    return await p(e + 1, t);
  }
  return console.log("Could not determine post status."), "unknown";
}'''
    f = f.replace(old_p, new_p)
    open('content.js', 'w', encoding='utf-8').write(f)
    print('Patched p')
else: print('p not found')
