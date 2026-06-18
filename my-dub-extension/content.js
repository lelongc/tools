let subtitleContainer = null;
let fadeTimeout = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "subtitle") {
    showSubtitle(msg.text);
  } else if (msg.type === "stop") {
    if (subtitleContainer) {
      subtitleContainer.remove();
      subtitleContainer = null;
    }
  }
});

function createContainer() {
  subtitleContainer = document.createElement('div');
  subtitleContainer.style.position = 'fixed';
  subtitleContainer.style.bottom = '10%';
  subtitleContainer.style.left = '50%';
  subtitleContainer.style.transform = 'translateX(-50%)';
  subtitleContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  subtitleContainer.style.color = 'white';
  subtitleContainer.style.padding = '15px 30px';
  subtitleContainer.style.borderRadius = '10px';
  subtitleContainer.style.fontSize = '24px';
  subtitleContainer.style.fontWeight = 'bold';
  subtitleContainer.style.fontFamily = 'Arial, sans-serif';
  subtitleContainer.style.zIndex = '9999999';
  subtitleContainer.style.pointerEvents = 'none';
  subtitleContainer.style.transition = 'opacity 0.3s';
  subtitleContainer.style.textAlign = 'center';
  subtitleContainer.style.textShadow = '2px 2px 4px #000000';
  document.body.appendChild(subtitleContainer);
}

function showSubtitle(text) {
  if (!subtitleContainer) {
    createContainer();
  }
  subtitleContainer.textContent = text;
  subtitleContainer.style.opacity = '1';

  if (fadeTimeout) clearTimeout(fadeTimeout);
  
  // Ẩn phụ đề sau 5 giây nếu không có câu mới
  fadeTimeout = setTimeout(() => {
    if (subtitleContainer) {
      subtitleContainer.style.opacity = '0';
    }
  }, 5000);
}
