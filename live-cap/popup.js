const go = document.getElementById('go');
const stop = document.getElementById('stop');
const log = document.getElementById('log');
const keyInput = document.getElementById('key');

function addLog(s) {
  log.textContent += s + '\n';
  log.scrollTop = log.scrollHeight;
}

// Khôi phục API key đã lưu
chrome.storage.local.get(['groqKey'], r => {
  if (r.groqKey) keyInput.value = r.groqKey;
});

go.addEventListener('click', () => {
  const apiKey = keyInput.value.trim();
  if (!apiKey) {
    addLog('❌ Hãy nhập Groq API Key!');
    return;
  }

  // Lưu key
  chrome.storage.local.set({ groqKey: apiKey });

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
