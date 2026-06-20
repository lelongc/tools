import re

# 1. Update schedual.html
html_path = r'd:\folder\tools\FACEBOOK-AUTO\schedual.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

target_html = '<select class="form-select" id="groupSelect">\n              <option value="">Chọn các nhóm mục tiêu</option>\n            </select>\n          </div>'
range_html = '''<select class="form-select" id="groupSelect">\n              <option value="">Chọn các nhóm mục tiêu</option>\n            </select>\n            <div class="row mt-2" id="groupRangeContainer">\n              <div class="col-6">\n                <label class="form-label text-muted" style="font-size: 13px;">Từ nhóm số</label>\n                <input type="number" class="form-control form-control-sm" id="startGroupIndex" value="1" min="1" />\n              </div>\n              <div class="col-6">\n                <label class="form-label text-muted" style="font-size: 13px;">Đến nhóm số</label>\n                <input type="number" class="form-control form-control-sm" id="endGroupIndex" value="" min="1" placeholder="Tất cả" />\n              </div>\n              <div class="col-12 mt-1">\n                <small class="text-muted" id="groupRangeInfo"></small>\n              </div>\n            </div>\n          </div>'''

if 'id="startGroupIndex"' not in html_content:
    if target_html in html_content:
        html_content = html_content.replace(target_html, range_html)
        print("Updated schedual.html successfully.")
    else:
        print("Could not find target html string in schedual.html.")
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
else:
    print("schedual.html already contains the range inputs.")

# 2. Update schedual.js
js_path = r'd:\folder\tools\FACEBOOK-AUTO\schedual.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

old_meta = "groupLinks:g.links||[]"
new_meta = "groupLinks:(()=>{let ls=g.links||[];let sIdx=parseInt(document.getElementById('startGroupIndex')?.value)||1;let eIdx=parseInt(document.getElementById('endGroupIndex')?.value)||ls.length;sIdx=Math.max(1,sIdx);eIdx=Math.min(ls.length,eIdx);return ls.slice(sIdx-1,eIdx)})()"

if old_meta in js_content:
    js_content = js_content.replace(old_meta, new_meta)
    print("Updated groupLinks in schedual.js")
else:
    print("Warning: old_meta not found in schedual.js (maybe already patched?)")

# 3. Add listener to update groupRangeInfo in schedual.js
js_append = """
// UI helper for Group Range in Scheduler
document.addEventListener('DOMContentLoaded', () => {
    let updateGroupInfo = () => {
        let sel = document.getElementById('groupSelect');
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
    let sel = document.getElementById('groupSelect');
    if (sel) {
        sel.addEventListener('change', updateGroupInfo);
    }
});
"""

if 'UI helper for Group Range in Scheduler' not in js_content:
    js_content += '\n' + js_append
    print("Appended updateGroupInfo to schedual.js")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Patch for schedule applied successfully.")
