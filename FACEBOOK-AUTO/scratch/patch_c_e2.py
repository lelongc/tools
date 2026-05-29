import os, re
f = open('popup.js', 'r', encoding='utf-8').read()

def extract_balanced(text, start_idx):
    idx = start_idx
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

m = re.search(r'function C\([^)]*\)\s*\{', f)
if m:
    old_c_body = extract_balanced(f, m.end()-1)
    old_c = f[m.start():m.end()-1] + old_c_body
    new_c = r'function C(){const e=t()("#startAutoExtractModalBtn"),n=t()("#extractSpinnerModal");e.prop("disabled",!0),n.removeClass("d-none");const i=(i,r=!1)=>{chrome.tabs.sendMessage(i,{action:"startGroupScrape"});const s=()=>{chrome.storage.local.get(["LinksArray","ExtractError"],l=>{if(l.LinksArray){l.LinksArray.forEach(e=>w(e)),chrome.storage.local.remove("LinksArray"),n.addClass("d-none"),e.prop("disabled",!1),M("Groups extracted and added to list!","success",!0,"#alertContainerModal"),r&&chrome.tabs.remove(i)}else l.ExtractError?(chrome.storage.local.remove("ExtractError"),n.addClass("d-none"),e.prop("disabled",!1),M("Error extracting groups: "+l.ExtractError,"danger",!0,"#alertContainerModal"),r&&chrome.tabs.remove(i)):setTimeout(s,1e3)})};s()};chrome.tabs.query({active:!0,currentWindow:!0},function(e){e.length>0&&e[0].url&&e[0].url.includes("facebook.com")?i(e[0].id,!1):(M("Creating a background Facebook process. Please wait...","info",!0,"#alertContainerModal"),chrome.tabs.create({url:"https://www.facebook.com/groups",active:!1},function(e){chrome.tabs.onUpdated.addListener(function t(n,o){n===e.id&&"complete"===o.status&&(chrome.tabs.onUpdated.removeListener(t),setTimeout(()=>{i(e.id,!0)},3e3))})}))})}'
    f = f.replace(old_c, new_c)
    print('Patched C')
else: print('C not found')

m2 = re.search(r'function E\([^)]*\)\s*\{', f)
if m2:
    old_e_body = extract_balanced(f, m2.end()-1)
    old_e = f[m2.start():m2.end()-1] + old_e_body
    new_e = r"function E(){const e=document.getElementById('csvFileInput'),n=e.files[0];if(!n)return void M('Please select a CSV file first.','warning',!0,'#alertContainerModal');const i=new FileReader;i.onload=function(n){const i=n.target.result.split(/\r?\n/),r=[];let s=0;for(let e of i)e=e.trim(),e&&(e.includes('facebook.com/groups/')?r.push(e):s++);if(0===r.length)return void M('No valid Facebook group links found in the CSV. (URLs must contain \'facebook.com/groups/\')','danger',!0,'#alertContainerModal');r.forEach(e=>w(e));let u=`${r.length} groups imported successfully!`;s>0&&(u+=` ${s} invalid rows were skipped.`),M(u,'info',!0,'#alertContainerModal'),e.value=''},i.readAsText(n)}"
    f = f.replace(old_e, new_e)
    print('Patched E')
else: print('E not found')

open('popup.js', 'w', encoding='utf-8').write(f)
