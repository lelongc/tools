// workspace.js
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const progressContainer = document.getElementById('progress-container');
const statusText = document.getElementById('status-text');
const progressFill = document.getElementById('progress-fill');
const logBox = document.getElementById('log-box');
const downloadBtn = document.getElementById('download-btn');
const tgtLangSelect = document.getElementById('tgtLang');

function log(msg, type = 'info') {
  const div = document.createElement('div');
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (type === 'err') div.className = 'err';
  if (type === 'succ') div.className = 'succ';
  logBox.appendChild(div);
  logBox.scrollTop = logBox.scrollHeight;
}

function setProgress(percent, text) {
  progressFill.style.width = percent + '%';
  if (text) statusText.textContent = text;
}

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => {
  if (e.target.files.length) processFile(e.target.files[0]);
});

let finalSrtContent = '';

async function processFile(file) {
  if (!GROQ_KEY || GROQ_KEY.startsWith('gsk_...') || GROQ_KEY === '') {
    alert('Vui lòng thêm API Key Groq vào file config.js trước khi dùng!');
    return;
  }

  dropZone.classList.add('hidden');
  progressContainer.classList.remove('hidden');
  downloadBtn.classList.add('hidden');
  logBox.innerHTML = '';
  finalSrtContent = '';

  const tgtLang = tgtLangSelect.value;
  
  try {
    log(`Bắt đầu xử lý file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
    setProgress(5, 'Đang đọc file vào bộ nhớ...');
    
    const arrayBuffer = await file.arrayBuffer();
    
    setProgress(15, 'Đang tách và giải mã âm thanh (Audio Context)...');
    log('Đang khởi tạo AudioContext...');
    
    // Decode audio via AudioContext
    const ctx = new AudioContext({ sampleRate: 16000 });
    let audioBuffer;
    try {
      audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
      throw new Error('Không thể giải mã âm thanh. Vui lòng thử file .mp4 chuẩn.');
    }
    
    const duration = audioBuffer.duration;
    log(`Giải mã thành công! Thời lượng: ${formatTime(duration)}`);
    
    setProgress(30, 'Đang chia nhỏ âm thanh (Chunking)...');
    
    // Chunking: 5 phút mỗi chunk (300 giây)
    const CHUNK_SECONDS = 300;
    const sampleRate = 16000;
    const chunkSize = CHUNK_SECONDS * sampleRate;
    const channelData = audioBuffer.getChannelData(0); // mono
    
    const chunks = [];
    for (let i = 0; i < channelData.length; i += chunkSize) {
      chunks.push(channelData.slice(i, i + chunkSize));
    }
    
    log(`Chia thành ${chunks.length} đoạn nhỏ (mỗi đoạn tối đa 5 phút)`);
    
    let allSegments = [];
    
    // Xử lý từng chunk
    for (let i = 0; i < chunks.length; i++) {
      const p = 30 + ((i / chunks.length) * 60);
      setProgress(p, `Đang nhờ AI nhận diện & dịch đoạn ${i + 1}/${chunks.length}...`);
      log(`--- Đang xử lý đoạn ${i + 1}/${chunks.length} ---`);
      
      // 1. Tạo file WAV
      const wavBlob = toWav(chunks[i], 16000);
      
      // 2. Whisper Transcription
      log(`Gửi đoạn ${i + 1} cho Groq Whisper...`);
      const whisperRes = await fetchGroqWhisper(wavBlob);
      
      if (!whisperRes.segments || whisperRes.segments.length === 0) {
        log(`Đoạn ${i + 1} không có tiếng nói.`, 'succ');
        continue;
      }
      
      // 3. Chuẩn hóa timestamps
      const offset = i * CHUNK_SECONDS;
      const validSegments = whisperRes.segments.map((s, idx) => ({
        id: idx + 1,
        start: s.start + offset,
        end: s.end + offset,
        text: s.text.trim()
      })).filter(s => s.text.length > 0);
      
      // 4. Translation
      if (tgtLang) {
        log(`Gửi ${validSegments.length} câu của đoạn ${i + 1} cho Llama 3 dịch...`);
        await translateSegments(validSegments, tgtLang);
      }
      
      allSegments = allSegments.concat(validSegments);
      log(`Hoàn thành đoạn ${i + 1}`, 'succ');
    }
    
    setProgress(95, 'Đang tạo file phụ đề SRT...');
    log('Đang ráp nối toàn bộ phụ đề...');
    
    finalSrtContent = buildSrt(allSegments);
    
    setProgress(100, 'Hoàn tất thành công!');
    log('Tạo file SRT thành công! Bấm nút bên dưới để tải về.', 'succ');
    
    downloadBtn.onclick = () => downloadSrt(finalSrtContent, file.name);
    downloadBtn.classList.remove('hidden');

  } catch (e) {
    setProgress(0, 'Lỗi xảy ra!');
    log(e.message, 'err');
    console.error(e);
  }
}

// Gọi Groq Whisper
async function fetchGroqWhisper(blob) {
  const fd = new FormData();
  fd.append('file', new File([blob], 'audio.wav', { type: 'audio/wav' }));
  fd.append('model', 'whisper-large-v3-turbo');
  fd.append('response_format', 'verbose_json'); // Lấy chi tiết mốc thời gian
  
  const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + GROQ_KEY },
    body: fd
  });
  
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Whisper API lỗi ${r.status}: ${text}`);
  }
  return await r.json();
}

// Gọi Llama 3 để dịch hàng loạt
async function translateSegments(segments, targetLang) {
  // Gộp text với định dạng: [id] text
  const payload = segments.map(s => `[${s.id}] ${s.text}`).join('\n');
  
  const prompt = `You are a professional subtitle translator. Translate the following video subtitles to ${targetLang}. 
RULES:
1. Keep the exact same line format: "[id] translated_text".
2. Do not merge lines or change the IDs.
3. Output ONLY the translated lines, nothing else.`;

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + GROQ_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: payload }
      ]
    })
  });

  if (!r.ok) {
    log('Lỗi dịch Llama 3, sẽ giữ nguyên tiếng gốc cho đoạn này.', 'err');
    return;
  }

  const d = await r.json();
  const resultText = d.choices[0]?.message?.content || '';
  
  // Phân tích kết quả trả về để ráp lại vào segments
  const lines = resultText.split('\n');
  for (const line of lines) {
    const match = line.match(/^\[(\d+)\]\s*(.*)$/);
    if (match) {
      const id = parseInt(match[1]);
      const transText = match[2].trim();
      const seg = segments.find(s => s.id === id);
      if (seg && transText) {
        seg.text = transText;
      }
    }
  }
}

// Helper: Chuyển Array sang định dạng SRT
function buildSrt(segments) {
  let srt = '';
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    srt += `${i + 1}\n`;
    srt += `${formatSrtTime(s.start)} --> ${formatSrtTime(s.end)}\n`;
    srt += `${s.text}\n\n`;
  }
  return srt;
}

// Format giây sang HH:MM:SS,MMM
function formatSrtTime(seconds) {
  const date = new Date(seconds * 1000);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss},${ms}`;
}

// Format giây sang MM:SS
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m${s}s`;
}

// Tải file xuống
function downloadSrt(content, originalName) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  a.download = `${baseName}_vi.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Float32Array sang WAV
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
  return new Blob([b], { type: 'audio/wav' });
}
