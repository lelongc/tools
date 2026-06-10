// content.js

let capturedFrames = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inject_ui") {
    injectFloatingUI();
    sendResponse({ success: true });
  }
  return true;
});

function injectFloatingUI() {
  if (document.getElementById('ai-illustrator-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'ai-illustrator-panel';
  panel.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999999;
    background: rgba(0, 0, 0, 0.85); color: white; padding: 12px;
    border-radius: 8px; display: flex; flex-direction: column; gap: 10px;
    font-family: Arial, sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    min-width: 150px;
  `;

  const title = document.createElement('div');
  title.innerText = 'Trợ lý AI Video';
  title.style.cssText = 'font-weight: bold; font-size: 14px; text-align: center; margin-bottom: 5px; border-bottom: 1px solid #444; padding-bottom: 5px;';

  const manualInput = document.createElement('textarea');
  manualInput.placeholder = 'Dán transcript vào đây (Tùy chọn)...';
  manualInput.style.cssText = 'width: 100%; box-sizing: border-box; height: 60px; font-size: 12px; font-family: inherit; resize: vertical; border-radius: 4px; border: none; padding: 4px;';

  const captureBtn = document.createElement('button');
  captureBtn.innerText = '📸 Chụp ảnh (0)';
  captureBtn.style.cssText = 'padding: 8px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

  const finishBtn = document.createElement('button');
  finishBtn.innerText = '✅ Xong & Tạo Bài';
  finishBtn.style.cssText = 'padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

  const closeBtn = document.createElement('button');
  closeBtn.innerText = '✖ Đóng';
  closeBtn.style.cssText = 'padding: 4px; background: transparent; color: #aaa; border: none; cursor: pointer; font-size: 12px; margin-top: 5px;';

  captureBtn.onclick = () => {
    const video = document.querySelector('video');
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      capturedFrames.push(canvas.toDataURL('image/jpeg', 0.5));
      captureBtn.innerText = `📸 Chụp ảnh (${capturedFrames.length})`;

      // Hiệu ứng chớp nháy nhẹ để biết đã chụp
      panel.style.boxShadow = '0 0 15px #4CAF50';
      setTimeout(() => panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)', 200);
    } else {
      alert("Không tìm thấy video!");
    }
  };

  finishBtn.onclick = () => {
    if (capturedFrames.length === 0) {
      if (!confirm("Bạn chưa chụp ảnh nào. Vẫn muốn tạo bài viết?")) return;
    }

    finishBtn.innerText = '⏳ Đang xử lý...';
    finishBtn.disabled = true;
    captureBtn.disabled = true;

    // Gửi dữ liệu về background
    const manualText = manualInput.value.trim();
    const finalTranscript = manualText.length > 0 ? manualText : getTranscriptText();
    const cleanTitle = document.title.replace(/\s*-\s*YouTube$/, '').replace(/\s*\|\s*Udemy.*$/, '').trim();

    chrome.runtime.sendMessage({
      action: "process_captured_session",
      frames: capturedFrames,
      url: window.location.href,
      title: cleanTitle,
      transcript: finalTranscript
    }, (response) => {
      if (response && response.success) {
        // Tải xuống đã được background và offscreen xử lý
        capturedFrames = []; // Reset
        captureBtn.innerText = `📸 Chụp ảnh (0)`;
        alert("Đã tạo xong bài viết!");
      } else if (response && response.error) {
        alert("Lỗi từ AI: " + response.error);
      } else {
        alert("Có lỗi không xác định xảy ra.");
      }

      finishBtn.innerText = '✅ Xong & Tạo Bài';
      finishBtn.disabled = false;
      captureBtn.disabled = false;
    });
  };

  closeBtn.onclick = () => {
    panel.remove();
  };

  panel.appendChild(title);
  panel.appendChild(manualInput);
  panel.appendChild(captureBtn);
  panel.appendChild(finishBtn);
  panel.appendChild(closeBtn);
  document.body.appendChild(panel);
}

function getTranscriptText() {
  let transcriptText = "";
  const ytSegments = document.querySelectorAll('ytd-transcript-segment-renderer');
  if (ytSegments.length > 0) {
    ytSegments.forEach(segment => {
      transcriptText += segment.textContent.trim() + " ";
    });
  } else {
    const udemyTranscript = document.querySelector('[data-purpose*="transcript"], [class*="transcript-panel"]');
    if (udemyTranscript && udemyTranscript.textContent.trim().length > 100) {
      transcriptText = udemyTranscript.textContent;
    } else {
      transcriptText = document.body.innerText;
    }
  }
  return transcriptText.replace(/\s+/g, ' ').trim();
}
