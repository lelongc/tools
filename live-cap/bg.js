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

function inject(tabId, text) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (t) => {
      let el = document.getElementById('__lc__');
      if (!el) {
        el = document.createElement('div');
        el.id = '__lc__';
        Object.assign(el.style, {
          position:'fixed', bottom:'10%', left:'50%',
          transform:'translateX(-50%)', zIndex:'2147483647',
          background:'rgba(0,0,0,.85)', color:'#fff',
          font:'600 20px/1.4 Segoe UI,sans-serif',
          padding:'12px 24px', borderRadius:'10px',
          maxWidth:'720px', textAlign:'center',
          boxShadow:'0 4px 20px rgba(0,0,0,.6)',
          textShadow:'1px 1px 2px #000',
          pointerEvents:'auto', cursor:'grab',
          transition:'opacity .3s', opacity:'1'
        });
        let dx=0,dy=0,sx,sy,dr=false;
        el.onmousedown=e=>{dr=true;sx=e.clientX-dx;sy=e.clientY-dy;el.style.cursor='grabbing'};
        onmousemove=e=>{if(!dr)return;dx=e.clientX-sx;dy=e.clientY-sy;el.style.transform=`translate(${dx}px,${dy}px)`;el.style.left='auto';el.style.bottom='auto'};
        onmouseup=()=>{dr=false;el&&(el.style.cursor='grab')};
        document.body.appendChild(el);
      }
      el.textContent = t;
      el.style.opacity = '1';
      // KHÔNG tự ẩn — caption luôn hiện cho đến khi có caption mới
    },
    args: [text]
  }).catch(()=>{});
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
        await createOff(sid);
        inject(m.tabId, '🎧 Đang lắng nghe...');
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
      inject(targetTabId, m.t);
    } else {
      chrome.storage.local.get(['_tabId'], r => {
        if (r._tabId) {
          targetTabId = r._tabId;
          inject(r._tabId, m.t);
        }
      });
    }
  }
});
