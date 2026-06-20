import re

# 1. Update popup.html
html_path = r'd:\folder\tools\FACEBOOK-AUTO\popup.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

target_html = '<select class="form-select" id="groupSelector" style="width: 100%"><option value="">Chọn các nhóm muốn đăng...</option></select>\n          </div>'
range_html = '''<select class="form-select" id="groupSelector" style="width: 100%"><option value="">Chọn các nhóm muốn đăng...</option></select>
          </div>
          <div class="row mb-3" id="groupRangeContainer">
            <div class="col-6">
              <label class="form-label text-muted" style="font-size: 13px;">Từ nhóm số</label>
              <input type="number" class="form-control" id="startGroupIndex" value="1" min="1" />
            </div>
            <div class="col-6">
              <label class="form-label text-muted" style="font-size: 13px;">Đến nhóm số</label>
              <input type="number" class="form-control" id="endGroupIndex" value="" min="1" placeholder="Tất cả" />
            </div>
            <div class="col-12 mt-1">
              <small class="text-muted" id="groupRangeInfo"></small>
            </div>
          </div>'''

if 'id="startGroupIndex"' not in html_content:
    if target_html in html_content:
        html_content = html_content.replace(target_html, range_html)
        print("Updated popup.html successfully.")
    else:
        print("Could not find target html string. Trying generic replace.")
        html_content = html_content.replace('id="groupSelector" style="width: 100%"><option value="">Chọn các nhóm muốn đăng...</option></select>\n          </div>', 'id="groupSelector" style="width: 100%"><option value="">Chọn các nhóm muốn đăng...</option></select>\n          </div>\n          <div class="row mb-3" id="groupRangeContainer">\n            <div class="col-6">\n              <label class="form-label text-muted" style="font-size: 13px;">Từ nhóm số</label>\n              <input type="number" class="form-control" id="startGroupIndex" value="1" min="1" />\n            </div>\n            <div class="col-6">\n              <label class="form-label text-muted" style="font-size: 13px;">Đến nhóm số</label>\n              <input type="number" class="form-control" id="endGroupIndex" value="" min="1" placeholder="Tất cả" />\n            </div>\n            <div class="col-12 mt-1">\n              <small class="text-muted" id="groupRangeInfo"></small>\n            </div>\n          </div>')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
else:
    print("popup.html already contains the range inputs.")

# 2. Update popup.js
js_path = r'd:\folder\tools\FACEBOOK-AUTO\popup.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace `group:o.groups[i]` with a sliced version
# But ONLY in the context of D()
old_d = 'function D(){const e=t()("#postSelector").val(),n=t()("#productSelector").val(),i=t()("#groupSelector").val(),r=parseInt(t()("#delayInput").val());if(!i||!e&&!n)return void M("Please select at least a post and target groups","warning");const a={action:"",post:e?o.posts[e]:null,product:n?o.products[n]:null,group:o.groups[i],timeInSeconds:r,activeIndex:e,activeIndexProducts:n};a.post&&a.product?a.action="postBoth":a.post?a.action="createQuickPost":a.product&&(a.action="postProduct"),a.action&&(a.post&&chrome.storage.local.get(["licenseVerified","currentPost"],function(e){let t=e.currentPost;void 0===t?(t=0,chrome.storage.local.set({currentPost:t})):(t+=1,chrome.storage.local.set({currentPost:t})),s(t,e.licenseVerified),t>3&&!e.licenseVerified?H():(chrome.runtime.sendMessage(a),L("Starting posting process..."))}),o.isPosting=!0)}'

new_d = 'function D(){const e=t()("#postSelector").val(),n=t()("#productSelector").val(),i=t()("#groupSelector").val(),r=parseInt(t()("#delayInput").val());if(!i||!e&&!n)return void M("Please select at least a post and target groups","warning");const a={action:"",post:e?o.posts[e]:null,product:n?o.products[n]:null,group:(()=>{let g=JSON.parse(JSON.stringify(o.groups[i]));let sIdx=parseInt(t()("#startGroupIndex").val())||1;let eIdx=parseInt(t()("#endGroupIndex").val())||g.links.length;sIdx=Math.max(1,sIdx);eIdx=Math.min(g.links.length,eIdx);g.links=g.links.slice(sIdx-1,eIdx);return g})(),timeInSeconds:r,activeIndex:e,activeIndexProducts:n};a.post&&a.product?a.action="postBoth":a.post?a.action="createQuickPost":a.product&&(a.action="postProduct"),a.action&&(a.post&&chrome.storage.local.get(["licenseVerified","currentPost"],function(e){let t=e.currentPost;void 0===t?(t=0,chrome.storage.local.set({currentPost:t})):(t+=1,chrome.storage.local.set({currentPost:t})),s(t,e.licenseVerified),t>3&&!e.licenseVerified?H():(chrome.runtime.sendMessage(a),L("Starting posting process..."))}),o.isPosting=!0)}'

if old_d in js_content:
    js_content = js_content.replace(old_d, new_d)
    print("Updated function D() in popup.js")
else:
    print("Warning: old_d not found in popup.js")

# 3. Add listener to update groupRangeInfo
js_append = """
// UI helper for Group Range
document.addEventListener('DOMContentLoaded', () => {
    let updateGroupInfo = () => {
        let sel = document.getElementById('groupSelector');
        let info = document.getElementById('groupRangeInfo');
        if (!sel || !info) return;
        let selectedOpt = sel.options[sel.selectedIndex];
        if (selectedOpt && selectedOpt.value !== "") {
            // Extracted from original title
            let countMatch = selectedOpt.text.match(/\\((\\d+)/);
            let count = countMatch ? countMatch[1] : '?';
            info.textContent = `Nhóm đã chọn có tổng cộng ${count} nhóm.`;
        } else {
            info.textContent = '';
        }
    };
    let sel = document.getElementById('groupSelector');
    if (sel) {
        sel.addEventListener('change', updateGroupInfo);
        // Also observe for jQuery select2 changes if it uses that
        if (typeof jQuery !== 'undefined') {
            jQuery('#groupSelector').on('change', updateGroupInfo);
        }
    }
});
"""

if 'updateGroupInfo' not in js_content:
    js_content += '\n' + js_append
    print("Appended updateGroupInfo to popup.js")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Patch applied successfully.")
