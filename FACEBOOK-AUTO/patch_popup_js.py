js_code = """
// --- EXTENSION: Keyword Filtering, Clear Groups, CSV Export ---
document.addEventListener('DOMContentLoaded', () => {
  // Clear all groups
  const clearAllGroupsBtn = document.getElementById('clearAllGroupsBtn');
  if(clearAllGroupsBtn) {
    clearAllGroupsBtn.addEventListener('click', () => {
      if(confirm('Bạn có chắc muốn xóa tất cả nhóm khỏi danh sách?')) {
        document.getElementById('groupLinksContainer').innerHTML = '';
      }
    });
  }

  // Export CSV
  const exportGroupsCsvBtn = document.getElementById('exportGroupsCsvBtn');
  if(exportGroupsCsvBtn) {
    exportGroupsCsvBtn.addEventListener('click', () => {
      let links = [];
      const inputs = document.querySelectorAll('#groupLinksContainer input[type="text"]');
      inputs.forEach(input => {
        let val = input.value.trim();
        if(val) links.push(val);
      });
      if(links.length === 0) {
        alert('Không có link nhóm nào để xuất!');
        return;
      }
      let csvContent = "data:text/csv;charset=utf-8,\\uFEFF" + links.join('\\n');
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "danh_sach_nhom.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Filter Keyword & Export
  const startKeywordExtractBtn = document.getElementById('startKeywordExtractBtn');
  if(startKeywordExtractBtn) {
    startKeywordExtractBtn.addEventListener('click', () => {
      const kwInput = document.getElementById('keywordFilterInput');
      const kw = kwInput ? kwInput.value.trim() : '';
      if(!kw) {
        alert('Vui lòng nhập từ khóa lọc nhóm!');
        return;
      }
      
      const spinner = document.getElementById('keywordExtractSpinner');
      startKeywordExtractBtn.disabled = true;
      if(spinner) spinner.classList.remove('d-none');
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
      });
    });
  }
});
"""

with open('popup.js', 'a', encoding='utf-8') as f:
    f.write('\\n' + js_code)

print("Appended new logic to popup.js")
