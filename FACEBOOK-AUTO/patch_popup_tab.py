import re

with open('popup.js', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to replace the `chrome.tabs.query` block in the Keyword Extract listener

target = '''      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        const url = tabs[0].url;
        
        const runExtract = (tId) => {
          chrome.tabs.sendMessage(tId, { action: "startKeywordExtract", keyword: kw });
          const poll = setInterval(() => {
            chrome.storage.local.get(["KeywordLinksArray", "KeywordExtractError"], (data) => {
              if (data.KeywordLinksArray) {
                clearInterval(poll);
                chrome.storage.local.remove(["KeywordLinksArray"]);
                if(spinner) spinner.classList.add('d-none');
                startKeywordExtractBtn.disabled = false;
                
                if(data.KeywordLinksArray.length === 0) {
                  alert('Không tìm thấy nhóm nào chứa từ khóa: ' + kw);
                  return;
                }
                
                let csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + data.KeywordLinksArray.join('\\n');
                let encodedUri = encodeURI(csvContent);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "nhom_loc_" + kw + ".csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('Xuất thành công ' + data.KeywordLinksArray.length + ' nhóm!');
              } else if (data.KeywordExtractError) {
                clearInterval(poll);
                chrome.storage.local.remove(["KeywordExtractError"]);
                if(spinner) spinner.classList.add('d-none');
                startKeywordExtractBtn.disabled = false;
                alert('Lỗi khi quét nhóm: ' + data.KeywordExtractError);
              }
            });
          }, 1000);
        };
        
        if(url && url.includes("facebook.com")) {
          runExtract(tabId);
        } else {
          alert("Vui lòng mở trang Facebook để quét nhóm!");
          startKeywordExtractBtn.disabled = false;
          if(spinner) spinner.classList.add('d-none');
        }
      });'''

replacement = '''      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const runExtract = (tId, shouldClose = false) => {
          chrome.tabs.sendMessage(tId, { action: "startKeywordExtract", keyword: kw });
          const poll = setInterval(() => {
            chrome.storage.local.get(["KeywordLinksArray", "KeywordExtractError"], (data) => {
              if (data.KeywordLinksArray) {
                clearInterval(poll);
                chrome.storage.local.remove(["KeywordLinksArray"]);
                if(spinner) spinner.classList.add('d-none');
                startKeywordExtractBtn.disabled = false;
                if (shouldClose) chrome.tabs.remove(tId);
                
                if(data.KeywordLinksArray.length === 0) {
                  alert('Không tìm thấy nhóm nào chứa từ khóa: ' + kw);
                  return;
                }
                
                let csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + data.KeywordLinksArray.join('\\n');
                let encodedUri = encodeURI(csvContent);
                let link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "nhom_loc_" + kw + ".csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('Xuất thành công ' + data.KeywordLinksArray.length + ' nhóm!');
              } else if (data.KeywordExtractError) {
                clearInterval(poll);
                chrome.storage.local.remove(["KeywordExtractError"]);
                if(spinner) spinner.classList.add('d-none');
                startKeywordExtractBtn.disabled = false;
                if (shouldClose) chrome.tabs.remove(tId);
                alert('Lỗi khi quét nhóm: ' + data.KeywordExtractError);
              }
            });
          }, 1000);
        };
        
        if (tabs && tabs.length > 0 && tabs[0].url && tabs[0].url.includes("facebook.com")) {
          runExtract(tabs[0].id, false);
        } else {
          startKeywordExtractBtn.innerHTML = '<i class="bi bi-funnel"></i> Đang mở tab ẩn...';
          chrome.tabs.create({url: "https://www.facebook.com/groups", active: false}, function(newTab) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === newTab.id && info.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                setTimeout(() => {
                  startKeywordExtractBtn.innerHTML = '<i class="bi bi-funnel"></i> Đang quét... <span class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>';
                  runExtract(newTab.id, true);
                }, 3000);
              }
            });
          });
        }
      });'''

if target in content:
    content = content.replace(target, replacement)
    with open('popup.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Could not find the target string.")
