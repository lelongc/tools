const go = document.getElementById('go');
const stop = document.getElementById('stop');
const log = document.getElementById('log');
const srcLangSel = document.getElementById('srcLang');
const tgtLangSel = document.getElementById('tgtLang');

function addLog(s) {
  log.textContent += s + '\n';
  log.scrollTop = log.scrollHeight;
}

// Khôi phục cài đặt đã lưu
chrome.storage.local.get(['srcLang', 'tgtLang'], r => {
  if (r.srcLang) srcLangSel.value = r.srcLang;
  if (r.tgtLang !== undefined) tgtLangSel.value = r.tgtLang;
});

// Lưu ngay khi đổi (để offscreen cập nhật tức thì)
srcLangSel.addEventListener('change', () => chrome.storage.local.set({ srcLang: srcLangSel.value }));
tgtLangSel.addEventListener('change', () => chrome.storage.local.set({ tgtLang: tgtLangSel.value }));

// Kiểm tra xem đang chạy không để khôi phục nút
chrome.offscreen.hasDocument(has => {
  if (has) {
    go.style.display = 'none';
    stop.style.display = 'block';
    addLog('Đang chạy nền...');
  }
});

go.addEventListener('click', () => {
  addLog('→ Đang tìm tab...');

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const t = tabs[0];
    if (!t) { addLog('❌ Không tìm thấy tab'); return; }
    if (t.url.startsWith('chrome://') || t.url.startsWith('edge://')) {
      addLog('❌ Tab hệ thống, không hỗ trợ');
      return;
    }

    addLog('→ Tab: ' + t.id);
    addLog('→ Đang lấy stream...');

    chrome.runtime.sendMessage({ action: 'start', tabId: t.id }, r => {
      if (chrome.runtime.lastError) {
        addLog('❌ ' + chrome.runtime.lastError.message);
        return;
      }
      if (r && r.ok) {
        go.style.display = 'none';
        stop.style.display = 'block';
        addLog('✅ Đang chạy! Chờ 5-6s...');
      } else {
        addLog('❌ ' + (r?.err || 'Không rõ lỗi'));
      }
    });
  });
});

stop.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
  go.style.display = 'block';
  stop.style.display = 'none';
  addLog('■ Đã tắt.');
});
