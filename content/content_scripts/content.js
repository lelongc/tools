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
    // 1. Tìm thẻ video to nhất
    const videos = Array.from(document.querySelectorAll('video'));
    let bestVideo = null;
    let maxArea = 0;
    
    for (const v of videos) {
      const rect = v.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (area > maxArea) {
        maxArea = area;
        bestVideo = v;
      }
    }

    if (!bestVideo) {
      alert("Không tìm thấy video nào đang hiển thị!");
      return;
    }

    captureBtn.innerText = '📸 Đang chụp...';
    captureBtn.disabled = true;

    // 2. Lấy tọa độ hiển thị thực tế của Video trên màn hình
    const rect = bestVideo.getBoundingClientRect();

    // 3. Ra lệnh cho Camera của Chrome chụp lại *Toàn bộ Tab* (vượt qua lỗi CORS của canvas video)
    chrome.runtime.sendMessage({ action: "capture_tab" }, (response) => {
      if (response && response.dataUrl) {
        const img = new Image();
        img.onload = () => {
          // Tính toán tỷ lệ sai số giữa ảnh chụp và khung hình thực tế (trường hợp user Zoom màn hình)
          const viewportWidth = document.documentElement.clientWidth;
          const viewportHeight = document.documentElement.clientHeight;
          
          const scaleX = img.width / viewportWidth;
          const scaleY = img.height / viewportHeight;

          // Tính toán vùng tọa độ chính xác của Video trong bức ảnh to
          const cropX = rect.left * scaleX;
          const cropY = rect.top * scaleY;
          const cropW = rect.width * scaleX;
          const cropH = rect.height * scaleY;

          // Cắt (Crop) đúng khung video
          const canvas = document.createElement('canvas');
          canvas.width = rect.width;
          canvas.height = rect.height;
          const ctx = canvas.getContext('2d');
          
          // Hàm drawImage (Image, Nguồn_X, Nguồn_Y, Nguồn_W, Nguồn_H, Đích_X, Đích_Y, Đích_W, Đích_H)
          ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
          
          const finalDataUrl = canvas.toDataURL('image/jpeg', 0.8);

          if (finalDataUrl.length < 5000) { 
            alert("❌ Video vẫn đen xì! Chắc chắn trang web này (như Udemy/Netflix) có chuẩn DRM ẩn siêu việt.\nHoặc bạn chưa Restart lại Chrome sau khi chỉnh Setting.\nTuy nhiên, công cụ đã cố gắng hết sức.");
          } else {
            capturedFrames.push(finalDataUrl);
            panel.style.boxShadow = '0 0 15px #4CAF50';
            setTimeout(() => panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)', 200);
          }

          captureBtn.innerText = `📸 Chụp ảnh (${capturedFrames.length})`;
          captureBtn.disabled = false;
        };
        img.src = response.dataUrl;
      } else {
        alert("Lỗi máy ảnh Chrome. Hãy đảm bảo Extension có đủ quyền hoạt động.");
        captureBtn.innerText = `📸 Chụp ảnh (${capturedFrames.length})`;
        captureBtn.disabled = false;
      }
    });
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
