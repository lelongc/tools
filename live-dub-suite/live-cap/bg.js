// bg.js — Background Service Worker
let targetTabId = null;

async function createOff(streamId, srcLang, tgtLang) {
  try { await chrome.offscreen.closeDocument(); } catch(_){}
  await chrome.offscreen.createDocument({
    url: `offscreen.html#${encodeURIComponent(streamId)}&${srcLang}&${tgtLang}`,
    reasons: ['USER_MEDIA'],
    justification: 'Tab audio capture'
  });
}

function forward(tabId, text, action = 'show') {
  chrome.tabs.sendMessage(tabId, { action, text }).catch(()=>{});
}

chrome.runtime.onMessage.addListener((m, sender, reply) => {

  if (m.action === 'start') {
    targetTabId = m.tabId;
    chrome.storage.local.set({ _tabId: m.tabId });

    (async () => {
      try {
        // Lấy settings trước
        const prefs = await new Promise(res => chrome.storage.local.get(['srcLang', 'tgtLang'], res));
        const srcLang = prefs.srcLang || 'en';
        const tgtLang = prefs.tgtLang || '';

        // Lấy streamId — phải dùng NGAY lập tức sau bước này
        const sid = await new Promise((ok, no) => {
          chrome.tabCapture.getMediaStreamId(
            { targetTabId: m.tabId },
            id => chrome.runtime.lastError ? no(chrome.runtime.lastError.message) : ok(id)
          );
        });

        // TẠO OFFSCREEN NGAY (không await gì khác trước bước này)
        await createOff(sid, srcLang, tgtLang);

        // Nhúng UI vào tab (không cần await, chạy song song)
        chrome.scripting.insertCSS({ target: { tabId: m.tabId }, files: ['caption.css'] }).catch(()=>{});
        chrome.scripting.executeScript({ target: { tabId: m.tabId }, files: ['caption.js'] }).catch(()=>{});

        // Gửi "đang lắng nghe" sau 200ms để caption.js kịp load
        setTimeout(() => forward(m.tabId, '🎧 Đang lắng nghe...'), 200);
        reply({ ok: true });

      } catch(e) {
        reply({ ok: false, err: String(e) });
      }
    })();
    return true; // giữ kênh async reply
  }

  if (m.action === 'stop') {
    if (targetTabId) forward(targetTabId, '', 'hide');
    targetTabId = null;
    chrome.storage.local.remove('_tabId');
    chrome.offscreen.closeDocument().catch(()=>{});
    return;
  }

  // Offscreen gửi caption về
  if (m.action === '_c') {
    const tid = targetTabId;
    if (tid) {
      forward(tid, m.t);
    } else {
      // Service Worker có thể đã sleep và mất biến — khôi phục từ storage
      chrome.storage.local.get(['_tabId'], r => {
        if (r._tabId) {
          targetTabId = r._tabId;
          forward(r._tabId, m.t);
        }
      });
    }
  }
});
