// Ghi lại thao tác của người dùng
let isRecording = true;
const recordedActions = [];
let lastActionTime = Date.now();

// Cố định một khoảng chờ ban đầu
recordedActions.push({ delay: 1000, type: "init", selector: "body" });

// Indicator
const statusUI = document.createElement('div');
statusUI.innerHTML = '<span style="display:inline-block;width:10px;height:10px;background:red;border-radius:50%;margin-right:8px;animation:pulse 1s infinite;"></span> ĐANG GHI NHỚ...';
statusUI.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:10px 20px; background:rgba(15,23,42,0.95); color:#f8fafc; font-weight:600; font-size: 14px; border: 1px solid #334155; border-radius:30px; z-index:2147483647; pointer-events:none; font-family:sans-serif;box-shadow: 0 4px 20px rgba(0,0,0,0.5); display:flex; align-items:center;';

const style = document.createElement('style');
style.textContent = `@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`;
document.head.appendChild(style);
document.body.appendChild(statusUI);

function getCssSelector(el) {
  if (!(el instanceof Element)) return;
  if (el.tagName === 'BODY' || el.tagName === 'HTML') return 'body';

  // Lấy thuộc tính ưu tiên, loại bỏ những ID chèn ngẫu nhiên số
  if (el.id && !/\d{3,}/.test(el.id)) return `#${el.id}`;
  if (el.hasAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
  if (el.hasAttribute('name')) return `${el.tagName.toLowerCase()}[name="${el.getAttribute('name')}"]`;
  if (el.hasAttribute('aria-label') && el.getAttribute('aria-label').trim().length > 0) {
    return `${el.tagName.toLowerCase()}[aria-label="${el.getAttribute('aria-label')}"]`;
  }
  if (el.hasAttribute('placeholder')) return `${el.tagName.toLowerCase()}[placeholder="${el.getAttribute('placeholder')}"]`;

  // Rất cùi bắp: Leo cây DOM
  const path = [];
  while (el.nodeType === Node.ELEMENT_NODE && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
    let selector = el.nodeName.toLowerCase();
    
    // Nếu đụng container có ID rõ ràng thì chốt hạ
    if (el.id && !/\d{3,}/.test(el.id)) {
      selector += '#' + el.id;
      path.unshift(selector);
      break; 
    } 

    // Dùng class nếu element có vẻ rõ ràng
    let cls = el.getAttribute('class');
    if (cls) {
      cls = cls.split(/\s+/).filter(c => c && !['active','focus','hover','selected','hidden','show'].includes(c))[0];
      if (cls && !/\d{3,}/.test(cls)) { // Không có số random
        selector += `.${cls}`;
      }
    }

    let sib = el, nth = 1;
    while (sib = sib.previousElementSibling) {
      if (sib.nodeName.toLowerCase() == el.nodeName.toLowerCase()) nth++;
    }
    if (nth != 1) selector += `:nth-of-type(${nth})`;
    
    path.unshift(selector);
    el = el.parentNode;
  }
  return path.join(" > ") || 'body';
}

function recordAction(type, target, value = null) {
  if (!isRecording) return;
  
  // Bỏ qua bấm linh tinh vào thanh cuộn / body
  if (type === 'click' && (target.tagName === 'HTML' || target.tagName === 'BODY')) return;

  const now = Date.now();
  const delay = now - lastActionTime;
  lastActionTime = now;
  
  const selector = getCssSelector(target);
  if(!selector) return;

  // Lấy thêm text nếu bấm là thẻ a hoặc button để thêm chính xác cho replayer nếu cần về sau
  const text = (target.tagName==='BUTTON' || target.tagName==='A') ? target.innerText.trim().slice(0, 20) : '';

  recordedActions.push({
    type,
    selector,
    value,
    text,
    delay: Math.max(10, delay) 
  });
}

// Bắt click
document.addEventListener('click', (e) => recordAction('click', e.target), true);

// Bắt input / text changes
document.addEventListener('change', (e) => recordAction('input', e.target, e.target.value), true);

// Bắt Enter press trên file input / search / form
document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
     recordAction('enter', e.target, e.target.value);
  }
}, true);

// Listeners
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'PING') {
    sendResponse({ isRecording });
  } else if (msg.action === 'STOP_RECORDING') {
    isRecording = false;
    statusUI.remove();
    sendResponse({ actions: recordedActions, url: window.location.href });
  }
});
