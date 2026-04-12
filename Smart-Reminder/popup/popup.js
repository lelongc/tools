// ============================================
// Smart Reminder - Popup Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const btnToggleForm = document.getElementById('btnToggleForm');
  const formSection = document.getElementById('formSection');
  const formTitle = document.getElementById('formTitle');
  const btnCancel = document.getElementById('btnCancel');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const reminderForm = document.getElementById('reminderForm');
  const reminderList = document.getElementById('reminderList');
  const emptyState = document.getElementById('emptyState');
  const editIdField = document.getElementById('editId');
  
  // Type selector
  const typeBtns = document.querySelectorAll('.type-btn');
  const fixedTimeGroup = document.getElementById('fixedTimeGroup');
  const repeatGroup = document.getElementById('repeatGroup');
  
  let currentType = 'fixed';
  let isFormVisible = false;
  let isEditMode = false;
  
  // --- Initialize ---
  loadReminders();
  
  // --- Toggle Form (for creating new) ---
  btnToggleForm.addEventListener('click', () => {
    if (isEditMode) {
      // If currently editing, cancel edit and close
      closeForm();
      return;
    }
    
    isFormVisible = !isFormVisible;
    
    if (isFormVisible) {
      openFormForCreate();
    } else {
      closeForm();
    }
  });
  
  btnCancel.addEventListener('click', () => {
    closeForm();
  });
  
  function openFormForCreate() {
    isEditMode = false;
    editIdField.value = '';
    formTitle.textContent = 'Tạo nhắc nhở mới';
    btnSubmitText.textContent = 'Tạo';
    
    reminderForm.reset();
    resetTypeSelector();
    showForm();
  }
  
  function openFormForEdit(reminder) {
    isEditMode = true;
    editIdField.value = reminder.id;
    formTitle.textContent = 'Sửa nhắc nhở';
    btnSubmitText.textContent = 'Lưu';
    
    // Pre-fill form
    document.getElementById('title').value = reminder.title;
    document.getElementById('message').value = reminder.message || '';
    
    // Set type
    currentType = reminder.type;
    typeBtns.forEach(b => b.classList.remove('active'));
    typeBtns.forEach(b => {
      if (b.dataset.type === reminder.type) b.classList.add('active');
    });
    
    if (reminder.type === 'fixed') {
      fixedTimeGroup.classList.remove('hidden');
      repeatGroup.classList.add('hidden');
      document.getElementById('fixedTime').value = reminder.fixedTime || '08:00';
    } else {
      fixedTimeGroup.classList.add('hidden');
      repeatGroup.classList.remove('hidden');
      document.getElementById('intervalMinutes').value = reminder.intervalMinutes || 30;
    }
    
    showForm();
  }
  
  function showForm() {
    isFormVisible = true;
    formSection.classList.remove('hidden');
    formSection.offsetHeight; // Force reflow
    formSection.classList.add('visible');
    btnToggleForm.classList.add('active');
    
    // Focus title input
    setTimeout(() => document.getElementById('title').focus(), 100);
  }
  
  function closeForm() {
    formSection.classList.remove('visible');
    btnToggleForm.classList.remove('active');
    isFormVisible = false;
    isEditMode = false;
    editIdField.value = '';
    
    setTimeout(() => {
      if (!isFormVisible) {
        formSection.classList.add('hidden');
      }
    }, 350);
    
    reminderForm.reset();
    resetTypeSelector();
  }
  
  // --- Type Selector ---
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      
      if (currentType === 'fixed') {
        fixedTimeGroup.classList.remove('hidden');
        repeatGroup.classList.add('hidden');
      } else {
        fixedTimeGroup.classList.add('hidden');
        repeatGroup.classList.remove('hidden');
      }
    });
  });
  
  function resetTypeSelector() {
    currentType = 'fixed';
    typeBtns.forEach(b => b.classList.remove('active'));
    typeBtns[0].classList.add('active');
    fixedTimeGroup.classList.remove('hidden');
    repeatGroup.classList.add('hidden');
  }
  
  // --- Submit Form (Create or Update) ---
  reminderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!title) return;
    
    const reminderData = {
      title,
      message: message || title,
      type: currentType
    };
    
    if (currentType === 'fixed') {
      reminderData.fixedTime = document.getElementById('fixedTime').value;
      if (!reminderData.fixedTime) return;
    } else {
      reminderData.intervalMinutes = parseInt(document.getElementById('intervalMinutes').value, 10);
      if (!reminderData.intervalMinutes || reminderData.intervalMinutes < 1) return;
    }
    
    try {
      const editId = editIdField.value;
      
      if (editId) {
        // UPDATE existing reminder
        reminderData.id = editId;
        const response = await chrome.runtime.sendMessage({
          action: 'update',
          data: reminderData
        });
        
        if (response.success) {
          closeForm();
          loadReminders();
        }
      } else {
        // CREATE new reminder
        const response = await chrome.runtime.sendMessage({
          action: 'create',
          data: reminderData
        });
        
        if (response.success) {
          closeForm();
          loadReminders();
        }
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  });
  
  // --- Load & Render Reminders ---
  async function loadReminders() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getAll' });
      
      if (response.success) {
        renderReminders(response.reminders);
      }
    } catch (err) {
      console.error('Load failed:', err);
    }
  }
  
  function renderReminders(reminders) {
    reminderList.innerHTML = '';
    
    if (reminders.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    
    emptyState.style.display = 'none';
    
    // Sort: enabled first, then by creation time (newest first)
    const sorted = [...reminders].sort((a, b) => {
      if (a.enabled !== b.enabled) return b.enabled - a.enabled;
      return b.createdAt - a.createdAt;
    });
    
    sorted.forEach(reminder => {
      const item = createReminderElement(reminder);
      reminderList.appendChild(item);
    });
  }
  
  function createReminderElement(reminder) {
    const div = document.createElement('div');
    div.className = `reminder-item${reminder.enabled ? '' : ' disabled'}`;
    div.dataset.id = reminder.id;
    
    const typeIcon = reminder.type === 'fixed'
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23,4 23,10 17,10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
    
    const typeLabel = reminder.type === 'fixed' ? 'Cố định' : 'Lặp lại';
    const typeClass = reminder.type;
    
    const timeDisplay = reminder.type === 'fixed'
      ? reminder.fixedTime
      : `mỗi ${reminder.intervalMinutes} phút`;
    
    div.innerHTML = `
      <div class="reminder-top">
        <div class="reminder-info">
          <div class="reminder-title">${escapeHtml(reminder.title)}</div>
          ${reminder.message && reminder.message !== reminder.title 
            ? `<div class="reminder-message">${escapeHtml(reminder.message)}</div>` 
            : ''}
        </div>
        <div class="reminder-actions">
          <button class="btn-edit" data-action="edit" data-id="${reminder.id}" title="Sửa nhắc nhở">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <label class="toggle" title="${reminder.enabled ? 'Tắt' : 'Bật'} nhắc nhở">
            <input type="checkbox" ${reminder.enabled ? 'checked' : ''} data-action="toggle" data-id="${reminder.id}">
            <span class="toggle-slider"></span>
          </label>
          <button class="btn-delete" data-action="delete" data-id="${reminder.id}" title="Xóa nhắc nhở">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="reminder-meta">
        <span class="meta-badge ${typeClass}">
          ${typeIcon}
          ${typeLabel}
        </span>
        <span class="meta-time">${timeDisplay}</span>
      </div>
    `;
    
    // Event: Edit
    const editBtn = div.querySelector('[data-action="edit"]');
    editBtn.addEventListener('click', () => {
      openFormForEdit(reminder);
    });
    
    // Event: Toggle
    const toggleInput = div.querySelector('[data-action="toggle"]');
    toggleInput.addEventListener('change', () => toggleReminder(reminder.id));
    
    // Event: Delete
    const deleteBtn = div.querySelector('[data-action="delete"]');
    deleteBtn.addEventListener('click', () => deleteReminder(reminder.id, div));
    
    return div;
  }
  
  // --- Toggle Reminder ---
  async function toggleReminder(id) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'toggle',
        id
      });
      
      if (response.success) {
        loadReminders();
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  }
  
  // --- Delete Reminder ---
  async function deleteReminder(id, element) {
    element.style.animation = 'slideOut 0.25s ease forwards';
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'delete',
        id
      });
      
      if (response.success) {
        // If currently editing this reminder, close form
        if (editIdField.value === id) {
          closeForm();
        }
        setTimeout(() => {
          loadReminders();
        }, 250);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      loadReminders();
    }
  }
  
  // --- Utility ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // --- Listen for storage changes ---
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.reminders) {
      renderReminders(changes.reminders.newValue || []);
    }
  });
});
