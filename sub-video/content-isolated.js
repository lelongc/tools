// content-isolated.js
let active = false;
let subtitleQueue = []; // { start, end, text }
let renderTimer = null;
let uiInjected = false;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'toggle') {
    active = msg.state;
    // Báo cho MAIN world
    window.postMessage({ type: 'LC_TOGGLE', state: active }, '*');
    
    if (active) {
      initUI();
      console.log('[LC] Web Sniffer Đã BẬT');
    } else {
      destroyUI();
      subtitleQueue = [];
      console.log('[LC] Web Sniffer Đã TẮT');
    }
  }
});

// Nhận mảnh video từ MAIN world
window.addEventListener('message', async (e) => {
  if (e.source !== window) return;
  if (e.data && e.data.type === 'LC_SEGMENT' && active) {
    const { url, buffer, estimatedStart } = e.data;
    console.log(`[LC] Chộp được segment: ${url.substring(url.length-20)} | estimatedStart: ${estimatedStart.toFixed(1)}s`);
    processSegment(buffer, estimatedStart);
  }
});

async function processSegment(buffer, estimatedStart) {
  try {
    if (!GROQ_KEY || GROQ_KEY.startsWith('gsk_...')) {
      console.error('[LC] Thiếu API Key Groq trong config.js');
      return;
    }

    // Giả làm file webm/mp4 để lừa Whisper
    const blob = new Blob([buffer], { type: 'video/mp4' });
    const fd = new FormData();
    fd.append('file', new File([blob], 'audio.mp4', { type: 'video/mp4' }));
    fd.append('model', 'whisper-large-v3-turbo');
    fd.append('response_format', 'verbose_json');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + GROQ_KEY },
      body: fd
    });

    if (!res.ok) {
      console.warn('[LC] Whisper từ chối mảnh này:', await res.text());
      return;
    }

    const data = await res.json();
    if (!data.segments || data.segments.length === 0) return;

    // Gộp tất cả các câu để dịch 1 lần
    const payload = data.segments.map(s => `[${s.id}] ${s.text}`).join('\n');
    
    // Gọi Llama 3 dịch sang Tiếng Việt
    const transRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a professional subtitle translator. Translate the text to Vietnamese. Keep the exact format "[id] translated_text". Output ONLY the translated text.' },
          { role: 'user', content: payload }
        ]
      })
    });

    if (!transRes.ok) return;
    const transData = await transRes.json();
    const resultText = transData.choices[0]?.message?.content || '';
    
    const lines = resultText.split('\n');
    const translatedMap = {};
    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*(.*)$/);
      if (match) translatedMap[match[1]] = match[2].trim();
    }

    // Đưa vào hàng đợi render
    data.segments.forEach(s => {
      const text = translatedMap[s.id] || s.text;
      if (text.length > 1) {
        subtitleQueue.push({
          start: estimatedStart + s.start,
          end: estimatedStart + s.end,
          text: text
        });
      }
    });

    // Sắp xếp lại hàng đợi theo thời gian
    subtitleQueue.sort((a, b) => a.start - b.start);

  } catch (err) {
    console.error('[LC] Lỗi xử lý segment:', err);
  }
}

// ==========================================
// RENDERER UI
// ==========================================
function initUI() {
  if (uiInjected) return;
  const video = document.querySelector('video');
  if (!video) return;

  // Cố gắng ẩn phụ đề mặc định của web
  try {
    Array.from(video.textTracks).forEach(t => t.mode = 'hidden');
  } catch(e) {}

  const wrap = document.createElement('div');
  wrap.id = 'lc-sub-container';
  wrap.innerHTML = `<div id="lc-sub-text">Đang Mai Phục HLS... (Vui lòng chờ video load)</div>`;
  
  // Chèn đè lên video
  if (video.parentElement) {
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(wrap);
  }

  uiInjected = true;
  renderLoop();
}

function destroyUI() {
  const wrap = document.getElementById('lc-sub-container');
  if (wrap) wrap.remove();
  cancelAnimationFrame(renderTimer);
  uiInjected = false;
}

let lastText = '';
function renderLoop() {
  if (!active) return;
  const video = document.querySelector('video');
  const textEl = document.getElementById('lc-sub-text');
  
  if (video && textEl) {
    const t = video.currentTime;
    
    // Tìm phụ đề khớp với thời gian hiện tại
    const currentSub = subtitleQueue.find(s => t >= s.start && t <= s.end);
    
    if (currentSub) {
      if (lastText !== currentSub.text) {
        textEl.textContent = currentSub.text;
        textEl.style.opacity = '1';
        lastText = currentSub.text;
      }
    } else {
      if (lastText !== '') {
        textEl.style.opacity = '0';
        lastText = '';
      }
    }
  }
  
  renderTimer = requestAnimationFrame(renderLoop);
}
