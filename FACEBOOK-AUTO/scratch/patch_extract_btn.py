import re
with open('popup.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = """<div class="dropdown">\\n                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">\\n                                <i class="bi bi-three-dots"></i>\\n                            </button>\\n                            <ul class="dropdown-menu">\\n                                <li class="c-li"><a class="dropdown-item showGroupForm" href="#" target-index="${t}">\\n                                    <i class="bi bi-pencil"></i> Edit\\n                                </a></li>\\n                                <li class="c-li"><a class="dropdown-item text-success exportGroupCsv" href="#" target-index="${t}">\\n                                    <i class="bi bi-filetype-csv"></i> Export CSV\\n                                </a></li>\\n                                <li class="c-li"><a class="dropdown-item text-danger deleteGroup" href="#" target-index="${t}">\\n                                    <i class="bi bi-trash"></i> Delete\\n                                </a></li>\\n                            </ul>\\n                        </div>"""

new_str = """<div class="d-flex align-items-center">\\n                            <button class="btn btn-sm btn-outline-danger deleteGroup me-2" type="button" target-index="${t}" title="Xóa nhóm">\\n                                <i class="bi bi-trash"></i>\\n                            </button>\\n                            <div class="dropdown">\\n                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">\\n                                    <i class="bi bi-three-dots"></i>\\n                                </button>\\n                                <ul class="dropdown-menu">\\n                                    <li class="c-li"><a class="dropdown-item showGroupForm" href="#" target-index="${t}">\\n                                        <i class="bi bi-pencil"></i> Edit\\n                                    </a></li>\\n                                    <li class="c-li"><a class="dropdown-item text-success exportGroupCsv" href="#" target-index="${t}">\\n                                        <i class="bi bi-filetype-csv"></i> Export CSV\\n                                    </a></li>\\n                                </ul>\\n                            </div>\\n                        </div>"""

if old_str in content:
    content = content.replace(old_str, new_str)
    with open('popup.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced successfully!')
else:
    print('String not found!')
