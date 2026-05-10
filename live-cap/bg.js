// bg.js — Background Service Worker
let targetTabId = null;

async function createOff(streamId) {
  try { await chrome.offscreen.closeDocument(); } catch(_){}
  await chrome.offscreen.createDocument({
    url: 'offscreen.html#' + encodeURIComponent(streamId),
    reasons: ['USER_MEDIA'],
    justification: 'Tab audio capture'
  });
}

function forward(tabId, text) {
  chrome.tabs.sendMessage(tabId, { action: 'show', text }).catch(()=>{});
}

chrome.runtime.onMessage.addListener((m, sender, reply) => {

  if (m.action === 'start') {
    targetTabId = m.tabId;
    // Lưu tabId vào storage để không mất khi SW restart
    chrome.storage.local.set({ _tabId: m.tabId });

    (async () => {
      try {
        const sid = await new Promise((ok, no) => {
          chrome.tabCapture.getMediaStreamId(
            { targetTabId: m.tabId },
            id => chrome.runtime.lastError ? no(chrome.runtime.lastError.message) : ok(id)
          );
        });
        
        // Bơm script thủ công để không bắt user phải F5
        await chrome.scripting.insertCSS({ target: { tabId: m.tabId }, files: ['caption.css'] }).catch(()=>{});
        await chrome.scripting.executeScript({ target: { tabId: m.tabId }, files: ['caption.js'] }).catch(()=>{});

        await createOff(sid);
        forward(m.tabId, '🎧 Đang lắng nghe...');
        reply({ ok: true });
      } catch(e) {
        reply({ ok: false, err: String(e) });
      }
    })();
    return true;
  }

  if (m.action === 'stop') {
    targetTabId = null;
    chrome.storage.local.remove('_tabId');
    try { chrome.offscreen.closeDocument(); } catch(_){}
  }

  // Offscreen gửi caption về — đọc tabId từ storage nếu biến bị mất
  if (m.action === '_c') {
    if (targetTabId) {
      forward(targetTabId, m.t);
    } else {
      chrome.storage.local.get(['_tabId'], r => {
        if (r._tabId) {
          targetTabId = r._tabId;
          forward(r._tabId, m.t);
        }
      });
    }
  }
});
