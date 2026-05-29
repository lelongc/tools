import re
f = open('popup.js', 'r', encoding='utf-8').read()

old_dropdown = """<ul class="dropdown-menu">\\n                                <li class="c-li"><a class="dropdown-item showGroupForm" href="#" target-index="${t}">\\n                                    <i class="bi bi-pencil"></i> Edit\\n                                </a></li>\\n                                <li class="c-li"><a class="dropdown-item text-danger deleteGroup" href="#" target-index="${t}">\\n                                    <i class="bi bi-trash"></i> Delete\\n                                </a></li>\\n                            </ul>"""

new_dropdown = """<ul class="dropdown-menu">\\n                                <li class="c-li"><a class="dropdown-item showGroupForm" href="#" target-index="${t}">\\n                                    <i class="bi bi-pencil"></i> Edit\\n                                </a></li>\\n                                <li class="c-li"><a class="dropdown-item text-success exportGroupCsv" href="#" target-index="${t}">\\n                                    <i class="bi bi-filetype-csv"></i> Export CSV\\n                                </a></li>\\n                                <li class="c-li"><a class="dropdown-item text-danger deleteGroup" href="#" target-index="${t}">\\n                                    <i class="bi bi-trash"></i> Delete\\n                                </a></li>\\n                            </ul>"""

if old_dropdown in f:
    f = f.replace(old_dropdown, new_dropdown)
    print('Patched dropdown')
else:
    print('old_dropdown not found!')

# Now add the listener
old_listener = """t()(document).on("click",".deleteGroup",function(ev){ev.preventDefault();b(t()(this).attr("target-index"))})"""
new_listener = """t()(document).on("click",".exportGroupCsv",function(ev){ev.preventDefault();const idx=t()(this).attr("target-index");const group=o.groups[idx];if(group&&group.links){const csvContent=group.links.join("\\n");const blob=new Blob([csvContent],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.setAttribute("href",url);link.setAttribute("download",`${group.title||"group_links"}.csv`);link.style.visibility="hidden";document.body.appendChild(link);link.click();document.body.removeChild(link);M("Exported "+group.links.length+" links successfully!","success")}}),t()(document).on("click",".deleteGroup",function(ev){ev.preventDefault();b(t()(this).attr("target-index"))})"""

if old_listener in f:
    f = f.replace(old_listener, new_listener)
    print('Patched listener')
else:
    print('old_listener not found!')

open('popup.js', 'w', encoding='utf-8').write(f)
