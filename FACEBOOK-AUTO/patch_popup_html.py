import re

with open('popup.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add filter input and button
target1 = '''<div class="d-flex gap-2 flex-wrap">
            <button type="button" class="btn btn-sm btn-outline-success" id="importCsvBtn">'''

replacement1 = '''<div class="d-flex gap-2 flex-wrap align-items-center">
            <button type="button" class="btn btn-sm btn-outline-success" id="importCsvBtn">'''

if target1 in content:
    content = content.replace(target1, replacement1)
else:
    print("Warning: target1 not found")

target2 = '''<input type="file" id="csvFileInput" accept=".csv" class="d-none">
          </div>'''

replacement2 = '''<input type="file" id="csvFileInput" accept=".csv" class="d-none">
          </div>
          <div class="d-flex gap-2 mt-2 align-items-center">
            <input type="text" class="form-control form-control-sm" id="keywordFilterInput" placeholder="Nhập từ khóa lọc nhóm (VD: Bất Động Sản)" style="width: auto; flex-grow: 1;">
            <button type="button" class="btn btn-sm btn-outline-info" id="startKeywordExtractBtn"><i class="bi bi-funnel"></i> Lọc Nhóm &amp; Xuất CSV <span class="spinner-border spinner-border-sm ms-1 d-none" id="keywordExtractSpinner" role="status" aria-hidden="true"></span></button>
          </div>'''

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Warning: target2 not found")


# 2. Update group links buttons
target3 = '''<button type="button" class="btn btn-sm btn-outline-secondary mt-2" id="addGroupLinkBtn"><i class="bi bi-plus"></i> Thêm 1 Link</button>'''

replacement3 = '''<div class="d-flex gap-2 mt-2">
            <button type="button" class="btn btn-sm btn-outline-secondary" id="addGroupLinkBtn"><i class="bi bi-plus"></i> Thêm 1 Link</button>
            <button type="button" class="btn btn-sm btn-outline-danger" id="clearAllGroupsBtn"><i class="bi bi-trash"></i> Xóa Tất Cả Nhóm</button>
            <button type="button" class="btn btn-sm btn-outline-success" id="exportGroupsCsvBtn"><i class="bi bi-download"></i> Xuất CSV</button>
          </div>'''

if target3 in content:
    content = content.replace(target3, replacement3)
else:
    print("Warning: target3 not found")

with open('popup.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to popup.html")
