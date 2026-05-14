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
    console.log(`[LC] Chộp được segment: ${url.substring(url.length-20)}`);
    processSegment(buffer, estimatedStart);
  }
});

// THỬ NGHIỆM: "Kéo" toàn bộ âm thanh nếu là link trực tiếp (MP4)
async function tryFullPull(src) {
  if (!src || src.startsWith('blob:') || src.startsWith('data:')) return;
  console.log('[LC] Phát hiện link trực tiếp, đang thử "Kéo" toàn bộ âm thanh...', src);
  
  try {
    const res = await fetch(src, { mode: 'no-cors' }); // Thử fetch ngầm
    // Lưu ý: no-cors sẽ không cho đọc nội dung. 
    // Nếu site không cho CORS, chúng ta phải nhờ Background Script tải hộ.
    chrome.runtime.sendMessage({ action: 'fetch_video', url: src });
  } catch (e) {
    console.error('[LC] Không thể kéo trực tiếp:', e);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'full_audio_ready') {
    console.log('[LC] Đã kéo xong toàn bộ âm thanh từ Background! Đang xử lý...');
    // Gọi hàm xử lý hàng loạt giống như bản Workspace cũ
    processFullAudio(msg.buffer);
  }
});
async function processFullAudio(arrayBuffer) {
  try {
    const ctx = new AudioContext({ sampleRate: 16000 });
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const CHUNK_SECONDS = 300;
    const sampleRate = 16000;
    const chunkSize = CHUNK_SECONDS * sampleRate;
    const channelData = audioBuffer.getChannelData(0);
    
    console.log(`[LC] Đang chia nhỏ âm thanh (${Math.ceil(channelData.length/chunkSize)} chunks)...`);
    for (let i = 0; i < channelData.length; i += chunkSize) {
      const slice = channelData.slice(i, i + chunkSize);
      const offset = (i / chunkSize) * CHUNK_SECONDS;
      await processSegment(toWav(slice, 16000), offset);
    }
    console.log('[LC] Hoàn tất xử lý toàn bộ video!');
  } catch (e) {
    console.error('[LC] Lỗi xử lý Full Audio:', e);
  }
}

function toWav(p, sr) {
  const n = p.length, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); v.setUint32(4, 36+n*2, true); w(8,'WAVE');
  w(12,'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr*2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36,'data'); v.setUint32(40, n*2, true);
  for (let i = 0; i < n; i++) {
    let s = Math.max(-1, Math.min(1, p[i]));
    v.setInt16(44 + i*2, s < 0 ? s*0x8000 : s*0x7FFF, true);
  }
  return b;
}

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
let findVideoRetry = 0;
function initUI() {
  if (uiInjected) return;
  
  const video = document.querySelector('video');
  if (!video) {
    if (findVideoRetry < 20) { // Thử tìm video trong 10 giây
      findVideoRetry++;
      setTimeout(initUI, 500);
    }
    return;
  }
  findVideoRetry = 0;

  console.log('[LC] Đã tìm thấy video element. SRC:', video.src || 'Chưa có SRC (có thể dùng <source>)');
  const finalSrc = video.src || (video.querySelector('source') ? video.querySelector('source').src : '');
  if (finalSrc) {
     console.log('[LC] Source:', finalSrc);
     tryFullPull(finalSrc);
  }

  console.log('[LC] Đang chèn UI...');

  // Cố gắng ẩn phụ đề mặc định của web
  try {
    Array.from(video.textTracks).forEach(t => t.mode = 'hidden');
  } catch(e) {}

  let wrap = document.getElementById('lc-sub-container');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'lc-sub-container';
    wrap.innerHTML = `<div id="lc-sub-text">Đang Mai Phục HLS... (Vui lòng chờ video load)</div>`;
    
    // Gắn vào body thay vì parent video để tránh bị overflow:hidden cắt mất
    document.body.appendChild(wrap);
  }

  uiInjected = true;
  renderLoop();
}

function destroyUI() {
  const wrap = document.getElementById('lc-sub-container');
  if (wrap) wrap.remove();
  cancelAnimationFrame(renderTimer);
  uiInjected = false;
  findVideoRetry = 0;
}

let lastText = '';
function renderLoop() {
  if (!active) return;
  const video = document.querySelector('video');
  const textEl = document.getElementById('lc-sub-text');
  const wrapEl = document.getElementById('lc-sub-container');
  
  if (video && textEl && wrapEl) {
    const t = video.currentTime;
    
    // Đồng bộ vị trí của container với video (trường hợp video di chuyển hoặc resize)
    const rect = video.getBoundingClientRect();
    wrapEl.style.top = (rect.top + rect.height * 0.75) + 'px'; // Hiện ở 3/4 chiều cao video
    wrapEl.style.left = rect.left + 'px';
    wrapEl.style.width = rect.width + 'px';
    wrapEl.style.position = 'fixed';
    wrapEl.style.zIndex = '2147483647';
    wrapEl.style.pointerEvents = 'none';
    wrapEl.style.display = 'flex';
    wrapEl.style.justifyContent = 'center';

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
