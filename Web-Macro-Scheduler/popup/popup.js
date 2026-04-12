document.addEventListener('DOMContentLoaded', async () => {
  const startBtn = document.getElementById('startRecordBtn');
  const stopBtn = document.getElementById('stopRecordBtn');
  const saveSection = document.getElementById('saveMacroSection');
  const macroNameInput = document.getElementById('macroName');
  const macroTimeInput = document.getElementById('macroTime');
  const saveBtn = document.getElementById('saveMacroBtn');
  const cancelBtn = document.getElementById('cancelSaveBtn');
  const macroList = document.getElementById('macroList');
  const macroCount = document.getElementById('macroCount');

  let currentActions = [];
  let currentUrl = '';

  // Render danh sách Macros ngay khi mở
  await renderMacros();

  // Kiểm tra xem có bản ghi nháp chưa lưu (Draft) không
  const draftRes = await chrome.storage.local.get('draftMacro');
  if (draftRes.draftMacro) {
    currentActions = draftRes.draftMacro.actions;
    currentUrl = draftRes.draftMacro.url;
    startBtn.classList.add('hidden');
    saveSection.classList.remove('hidden');
  } else {
    // Nếu không có draft, kiểm tra xem ngoài kia Content Script có đang Record không
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'PING' }, (resp) => {
        if (chrome.runtime.lastError) {} // Ignore err
        if (resp && resp.isRecording) {
          startBtn.classList.add('hidden');
          stopBtn.classList.remove('hidden');
        }
      });
    }
  }

  startBtn.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Inject script bắt đầu ghi
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content/recorder.js']
    });

    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
  });

  stopBtn.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, { action: 'STOP_RECORDING' }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        alert('Lỗi kết nối tới tab (Hãy đảm bảo web tải xong và không phải là thư mục chrome://).');
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        return;
      }
      
      if (response && response.actions) {
        currentActions = response.actions;
        currentUrl = response.url;
        
        // Lưu nháp ngay lập tức phòng hờ người dùng tắt Popup
        await chrome.storage.local.set({ draftMacro: { actions: currentActions, url: currentUrl } });
        
        stopBtn.classList.add('hidden');
        saveSection.classList.remove('hidden');
      }
    });
  });

  cancelBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove('draftMacro');
    saveSection.classList.add('hidden');
    startBtn.classList.remove('hidden');
    currentActions = [];
    currentUrl = '';
  });

  saveBtn.addEventListener('click', async () => {
    const name = macroNameInput.value.trim();
    const time = macroTimeInput.value;

    if (!name || !time) {
      alert('Vui lòng nhập Tên và Chọn giờ thao tác!');
      return;
    }

    const macro = {
      id: 'macro_' + Date.now(),
      name,
      time,
      startUrl: currentUrl,
      actions: currentActions,
      enabled: true
    };

    const result = await chrome.storage.local.get('macros');
    const macros = result.macros || [];
    macros.push(macro);
    await chrome.storage.local.set({ macros });

    // Xóa draft
    await chrome.storage.local.remove('draftMacro');

    // Hẹn giờ
    chrome.runtime.sendMessage({ action: 'SCHEDULE_MACRO', macro });

    // Reset UI
    saveSection.classList.add('hidden');
    startBtn.classList.remove('hidden');
    macroNameInput.value = '';
    macroTimeInput.value = '';

    await renderMacros();
  });

  async function renderMacros() {
    const result = await chrome.storage.local.get('macros');
    const macros = result.macros || [];
    macroList.innerHTML = '';
    macroCount.innerText = macros.length;

    if (macros.length === 0) {
      macroList.innerHTML = '<div style="color:#64748b;font-size:0.85rem;text-align:center;padding:20px;background:#1e293b;border-radius:8px;border:1px dashed #334155;">Bạn chưa tạo Macro nào.<br/>Nhấn Start Recording để thử ngay.</div>';
      return;
    }

    macros.forEach((macro, index) => {
      const item = document.createElement('div');
      item.className = 'macro-item';
      
      item.innerHTML = `
        <div class="macro-info">
          <div class="macro-name">${macro.name}</div>
          <div class="macro-time">
             <span style="color:#38bdf8">⏰ ${macro.time}</span> 
             &nbsp;|&nbsp; 
             <span><small>${macro.actions.length} bước</small></span>
          </div>
        </div>
        <div class="macro-controls">
          <label class="switch">
            <input type="checkbox" data-id="${macro.id}" ${macro.enabled ? 'checked' : ''} class="toggle-enabled">
            <span class="slider"></span>
          </label>
          <button class="delete-btn" title="Xóa" data-index="${index}" data-id="${macro.id}">
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
          </button>
        </div>
      `;
      macroList.appendChild(item);
    });

    // Event listener cho xóa và toggle
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const btnElem = e.currentTarget;
        const idx = btnElem.getAttribute('data-index');
        const id = btnElem.getAttribute('data-id');
        macros.splice(idx, 1);
        await chrome.storage.local.set({ macros });
        chrome.runtime.sendMessage({ action: 'CLEAR_MACRO', id });
        renderMacros();
      });
    });

    document.querySelectorAll('.toggle-enabled').forEach(toggle => {
      toggle.addEventListener('change', async (e) => {
        const id = e.target.getAttribute('data-id');
        const isEnabled = e.target.checked;
        const targetMacro = macros.find(m => m.id === id);
        
        if (targetMacro) {
          targetMacro.enabled = isEnabled;
          await chrome.storage.local.set({ macros });
          
          if (isEnabled) {
            chrome.runtime.sendMessage({ action: 'SCHEDULE_MACRO', macro: targetMacro });
          } else {
            chrome.runtime.sendMessage({ action: 'CLEAR_MACRO', id });
          }
        }
      });
    });
  }
});
