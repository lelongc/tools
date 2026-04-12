// Phát lại hành động
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'REPLAY_MACRO') {
    replay(msg.actions);
    sendResponse({ playing: true });
  }
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function replay(actions) {
  // Tạo thanh trạng thái
  const statusUI = document.createElement('div');
  statusUI.innerHTML = '▶️ AUTO PLAYING MACRO...';
  statusUI.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:8px 16px; background:rgba(0,180,0,0.9); color:white; font-weight:bold; font-size: 13px; border-radius:20px; z-index:2147483647; pointer-events:none; font-family:sans-serif;box-shadow: 0 4px 15px rgba(0,255,0,0.3); letter-spacing:1px;';
  document.body.appendChild(statusUI);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    
    // Bỏ qua init
    if (action.type === 'init') {
      await sleep(action.delay || 1000);
      continue;
    }

    // Chờ theo độ trễ đã ghi nhận
    await sleep(action.delay || 500);
    
    const el = document.querySelector(action.selector);
    if (!el) {
      console.warn('Replay failed to find element:', action.selector);
      continue;
    }

    // Hightlight phần tử sắp bị tác động
    const oldOutline = el.style.outline;
    el.style.outline = '2px solid rgba(0, 200, 0, 0.8)';
    
    if (action.type === 'click') {
      try {
        el.click();
      } catch(e) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        el.dispatchEvent(evt);
      }
    } else if (action.type === 'input') {
      el.value = action.value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (action.type === 'enter') {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    }

    // Gỡ highlight
    setTimeout(() => {
      if (el) el.style.outline = oldOutline;
    }, 300);
  }
  
  statusUI.innerHTML = '✅ MACRO DONE';
  setTimeout(() => statusUI.remove(), 3000);
}
