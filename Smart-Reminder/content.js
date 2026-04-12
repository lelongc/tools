// ============================================
// Smart Reminder - Content Script
// In-page toast notification overlay
// ============================================

(function() {
  'use strict';

  // Ensure container exists
  function getContainer() {
    let container = document.getElementById('sr-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sr-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  // Format current time
  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  // Create and show toast
  function showToast(data) {
    const container = getContainer();
    const toast = document.createElement('div');
    toast.className = 'sr-toast';

    const title = data.title || 'Smart Reminder';
    const message = data.message || 'Đã đến giờ nhắc nhở!';

    toast.innerHTML = `
      <div class="sr-toast-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2C10.343 2 9 3.343 9 5V6.08C6.164 7.029 4 9.79 4 13V17L2 19V20H22V19L20 17V13C20 9.79 17.836 7.029 15 6.08V5C15 3.343 13.657 2 12 2Z" fill="url(#sr-bell-g)"/>
          <path d="M12 24C13.657 24 15 22.657 15 21H9C9 22.657 10.343 24 12 24Z" fill="url(#sr-bell-g2)"/>
          <defs>
            <linearGradient id="sr-bell-g" x1="2" y1="2" x2="22" y2="20">
              <stop stop-color="#6C63FF"/>
              <stop offset="1" stop-color="#3F8EFC"/>
            </linearGradient>
            <linearGradient id="sr-bell-g2" x1="9" y1="21" x2="15" y2="24">
              <stop stop-color="#6C63FF"/>
              <stop offset="1" stop-color="#3F8EFC"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="sr-toast-body">
        <div class="sr-toast-label">🔔 Smart Reminder</div>
        <div class="sr-toast-title">${escapeHtml(title)}</div>
        <div class="sr-toast-message">${escapeHtml(message)}</div>
        <div class="sr-toast-time">${formatTime()}</div>
      </div>
      <div class="sr-toast-progress" style="--duration: ${data.duration}s"></div>
      <button class="sr-toast-close" title="Đóng">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    // Close button handler
    const closeBtn = toast.querySelector('.sr-toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    // Click toast body to dismiss
    toast.addEventListener('click', (e) => {
      if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
        dismissToast(toast);
      }
    });

    container.appendChild(toast);

    // Auto-dismiss after custom duration
    const durationMs = (data.duration || 8) * 1000;
    setTimeout(() => dismissToast(toast), durationMs);

    // Limit max toasts to 5
    const toasts = container.querySelectorAll('.sr-toast:not(.sr-closing)');
    if (toasts.length > 5) {
      dismissToast(toasts[0]);
    }
  }

  function dismissToast(toast) {
    if (toast.classList.contains('sr-closing')) return;
    toast.classList.add('sr-closing');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }

  function escapeHtml(str) {
    const el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  // Listen for messages from background service worker
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showToast') {
      showToast(request.data);
      sendResponse({ success: true });
    }
    return true;
  });
})();
