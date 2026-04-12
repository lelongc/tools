// ============================================
// Smart Reminder - Service Worker (Background)
// ============================================

// --- Storage Helpers ---
async function getReminders() {
  const result = await chrome.storage.local.get('reminders');
  return result.reminders || [];
}

async function saveReminders(reminders) {
  await chrome.storage.local.set({ reminders });
}

async function getReminderById(id) {
  const reminders = await getReminders();
  return reminders.find(r => r.id === id);
}

// --- Alarm Scheduling ---
function scheduleAlarm(reminder) {
  if (!reminder.enabled) return;

  if (reminder.type === 'repeat') {
    chrome.alarms.create(reminder.id, {
      delayInMinutes: reminder.intervalMinutes,
      periodInMinutes: reminder.intervalMinutes
    });
  } else if (reminder.type === 'fixed') {
    const now = new Date();
    const [hours, minutes] = reminder.fixedTime.split(':').map(Number);
    
    let target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const delayMs = target.getTime() - now.getTime();
    const delayInMinutes = delayMs / 60000;
    
    chrome.alarms.create(reminder.id, {
      delayInMinutes: delayInMinutes
    });
  }
}

function clearAlarm(reminderId) {
  chrome.alarms.clear(reminderId);
}

// --- Reschedule fixed reminder for next day ---
function rescheduleFixedReminder(reminder) {
  const [hours, minutes] = reminder.fixedTime.split(':').map(Number);
  
  let target = new Date();
  target.setDate(target.getDate() + 1);
  target.setHours(hours, minutes, 0, 0);
  
  const delayMs = target.getTime() - Date.now();
  const delayInMinutes = delayMs / 60000;
  
  chrome.alarms.create(reminder.id, {
    delayInMinutes: delayInMinutes
  });
}

// --- In-page Toast Notification ---
// Send toast to ALL active tabs so the user sees it no matter which tab they're on
async function showInPageToast(reminder) {
  const data = {
    title: reminder.title || 'Smart Reminder',
    message: reminder.message || 'Đã đến giờ nhắc nhở!'
  };

  try {
    // Get all normal browser tabs
    const tabs = await chrome.tabs.query({});
    
    // Try to send to the active tab in the focused window first
    const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    
    if (activeTabs.length > 0) {
      const activeTab = activeTabs[0];
      // Skip chrome:// and edge:// internal pages
      if (activeTab.url && !activeTab.url.startsWith('chrome://') && 
          !activeTab.url.startsWith('edge://') && !activeTab.url.startsWith('chrome-extension://') &&
          !activeTab.url.startsWith('about:')) {
        try {
          await chrome.tabs.sendMessage(activeTab.id, {
            action: 'showToast',
            data: data
          });
          return; // Success, stop here
        } catch (e) {
          // Content script might not be injected, try to inject it
          try {
            await chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              files: ['content.js']
            });
            await chrome.scripting.insertCSS({
              target: { tabId: activeTab.id },
              files: ['content.css']
            });
            // Retry sending message after injection
            await chrome.tabs.sendMessage(activeTab.id, {
              action: 'showToast',
              data: data
            });
            return;
          } catch (e2) {
            // Fall through to try other tabs
          }
        }
      }
    }

    // Fallback: try sending to any tab that can receive messages
    for (const tab of tabs) {
      if (tab.url && !tab.url.startsWith('chrome://') && 
          !tab.url.startsWith('edge://') && !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('about:')) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'showToast',
            data: data
          });
          return; // Success with this tab
        } catch (e) {
          // Try next tab
          continue;
        }
      }
    }
    
    // Last resort: no tab available, we can't show the toast.
    // The user will still see the badge count on the extension icon.
    console.log('Smart Reminder: No available tab to show toast notification');
    
  } catch (err) {
    console.error('Smart Reminder: Failed to show toast', err);
  }
}

// --- Update badge count ---
async function updateBadge() {
  const reminders = await getReminders();
  const activeCount = reminders.filter(r => r.enabled).length;
  
  if (activeCount > 0) {
    chrome.action.setBadgeText({ text: String(activeCount) });
    chrome.action.setBadgeBackgroundColor({ color: '#6C63FF' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// --- Event Listeners ---

// On extension install/update: restore all alarms
chrome.runtime.onInstalled.addListener(async () => {
  const reminders = await getReminders();
  
  if (reminders.length === 0) {
    await saveReminders([]);
  }
  
  for (const reminder of reminders) {
    if (reminder.enabled) {
      scheduleAlarm(reminder);
    }
  }
  
  updateBadge();
});

// On browser startup: restore alarms
chrome.runtime.onStartup.addListener(async () => {
  const reminders = await getReminders();
  for (const reminder of reminders) {
    if (reminder.enabled) {
      scheduleAlarm(reminder);
    }
  }
  updateBadge();
});

// Alarm fired → show in-page toast
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const reminder = await getReminderById(alarm.name);
  
  if (!reminder || !reminder.enabled) return;
  
  // Show toast on the active tab
  showInPageToast(reminder);
  
  // If fixed time, reschedule for tomorrow
  if (reminder.type === 'fixed') {
    rescheduleFixedReminder(reminder);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request).then(sendResponse);
  return true;
});

async function handleMessage(request) {
  switch (request.action) {
    case 'create': {
      const reminders = await getReminders();
      const newReminder = {
        ...request.data,
        id: `reminder_${Date.now()}`,
        createdAt: Date.now(),
        enabled: true
      };
      reminders.push(newReminder);
      await saveReminders(reminders);
      scheduleAlarm(newReminder);
      await updateBadge();
      return { success: true, reminder: newReminder };
    }
    
    case 'update': {
      const reminders = await getReminders();
      const index = reminders.findIndex(r => r.id === request.data.id);
      if (index === -1) return { success: false, error: 'Not found' };
      
      clearAlarm(reminders[index].id);
      reminders[index] = { ...reminders[index], ...request.data };
      await saveReminders(reminders);
      
      if (reminders[index].enabled) {
        scheduleAlarm(reminders[index]);
      }
      await updateBadge();
      return { success: true };
    }
    
    case 'toggle': {
      const reminders = await getReminders();
      const idx = reminders.findIndex(r => r.id === request.id);
      if (idx === -1) return { success: false, error: 'Not found' };
      
      reminders[idx].enabled = !reminders[idx].enabled;
      await saveReminders(reminders);
      
      if (reminders[idx].enabled) {
        scheduleAlarm(reminders[idx]);
      } else {
        clearAlarm(reminders[idx].id);
      }
      await updateBadge();
      return { success: true, enabled: reminders[idx].enabled };
    }
    
    case 'delete': {
      let reminders = await getReminders();
      clearAlarm(request.id);
      reminders = reminders.filter(r => r.id !== request.id);
      await saveReminders(reminders);
      await updateBadge();
      return { success: true };
    }
    
    case 'getAll': {
      const reminders = await getReminders();
      return { success: true, reminders };
    }
    
    default:
      return { success: false, error: 'Unknown action' };
  }
}
