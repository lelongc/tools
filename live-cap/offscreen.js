// offscreen.js — Thu âm tab → Groq Whisper
// GROQ_KEY được load từ config.js (trước file này)

const hashParts = location.hash.substring(1).split('&');
const sid = decodeURIComponent(hashParts[0]);
let srcLang = hashParts[1] || 'en';
let tgtLang  = hashParts[2] || '';


// cap() gửi text về bg.js — luôn có .catch để tránh crash offscreen
function cap(text) {
  chrome.runtime.sendMessage({ action: '_c', t: text }).catch(() => {});
}

if (!sid) {
  console.error('[LC] Không có streamId trong hash:', location.hash);
  cap('❌ Không có streamId');
} else {
  console.log('[LC] StreamId OK, bắt đầu go():', sid.substring(0, 20) + '...');
  go(sid);
}

async function go(sid) {
  try {
    console.log('[LC] Đang gọi getUserMedia...');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: sid } }
    });

    console.log('[LC] getUserMedia OK, tracks:', stream.getAudioTracks().length);
    cap('🎧 Đang thu âm...');

    // --- Phát lại cho user nghe ---
    const audioEl = new Audio();
    audioEl.srcObject = stream;
    audioEl.play().catch(e => console.warn('[LC] audio.play() lỗi:', e.message));

    // --- MediaRecorder ---
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : '';
    console.log('[LC] mimeType sẽ dùng:', mimeType || '(default)');

    let chunks = [];
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    recorder.ondataavailable = e => {
      console.log('[LC] ondataavailable, size:', e.data?.size);
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onerror = e => console.error('[LC] recorder.onerror:', e);

    recorder.onstop = async () => {
      console.log('[LC] recorder.onstop, chunks:', chunks.length);
      const blob = new Blob(chunks, { type: recorder.mimeType });
      chunks = [];
      console.log('[LC] Blob size:', blob.size);

      if (blob.size < 3000) {
        console.log('[LC] Blob quá nhỏ, bỏ qua');
        recorder.start();
        return;
      }

      await sendToGroq(blob, recorder.mimeType);

      if (recorder.state === 'inactive') {
        recorder.start();
      }
    };

    console.log('[LC] Bắt đầu recorder.start()');
    recorder.start();
    console.log('[LC] recorder.state sau start:', recorder.state);

    setInterval(() => {
      console.log('[LC] tick — recorder.state:', recorder.state);
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, 3000);

  } catch (e) {
    cap('❌ Audio lỗi: ' + e.message);
  }
}

async function sendToGroq(blob, mimeType) {
  const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm';
  console.log('[LC] sendToGroq, mimeType:', mimeType, 'ext:', ext, 'lang:', srcLang);
  try {
    const fd = new FormData();
    fd.append('file', new File([blob], 'audio.' + ext, { type: mimeType }));
    fd.append('model', 'whisper-large-v3-turbo');
    fd.append('response_format', 'json');
    fd.append('language', srcLang);

    const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + GROQ_KEY },
      body: fd
    });

    if (!r.ok) {
      const errText = await r.text();
      cap('⚠ Groq ' + r.status + ': ' + errText.substring(0, 80));
      return;
    }

    const data = await r.json();
    let text = (data.text || '').trim();

    if (text.length < 2) return; // bỏ kết quả rỗng

    if (tgtLang) {
      text = await translate(text, tgtLang);
    }

    cap(text);
  } catch (err) {
    cap('❌ Fetch lỗi: ' + err.message);
  }
}

async function translate(text, targetLang) {
  const langName = targetLang === 'vi' ? 'Vietnamese'
    : targetLang === 'en' ? 'English'
    : targetLang;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate the text to ${langName}. Output ONLY the translated text, no quotes, no explanation.`
          },
          { role: 'user', content: text }
        ]
      })
    });

    if (!res.ok) return text; // nếu dịch lỗi thì hiện bản gốc

    const d = await res.json();
    const translated = d.choices?.[0]?.message?.content?.trim();
    if (translated && translated.length > 0) {
      return translated + '\n\n─────\n' + text;
    }
    return text;
  } catch {
    return text; // dịch thất bại → vẫn hiện bản gốc
  }
}
