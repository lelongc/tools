// offscreen.js — Thu âm tab → WAV → Groq Whisper
// GROQ_KEY được load từ config.js (trước file này)

const hashParts = location.hash.substring(1).split('&');
const sid = decodeURIComponent(hashParts[0]);
const srcLang = hashParts[1] || 'en';
const tgtLang = hashParts[2] || '';

if (!sid) { cap('❌ Không có streamId'); }
else { go(sid, srcLang, tgtLang); }

async function go(sid, srcLang, tgtLang) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: sid } }
    });

    // Phát lại âm thanh cho user nghe
    const a = new Audio();
    a.srcObject = stream;
    a.play();

    // Thu PCM 16kHz mono
    const ctx = new AudioContext({ sampleRate: 16000 });
    const src = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    let buf = [];
    proc.onaudioprocess = e => buf.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    src.connect(proc);
    proc.connect(ctx.destination);

    cap('🎧 Đang thu âm...');

    // Mỗi 3 giây gửi Groq
    setInterval(async () => {
      const chunks = buf;
      buf = [];
      if (!chunks.length) return;

      let len = 0;
      chunks.forEach(c => len += c.length);
      const pcm = new Float32Array(len);
      let off = 0;
      chunks.forEach(c => { pcm.set(c, off); off += c.length; });

      // Bỏ qua im lặng
      let pk = 0;
      for (let i = 0; i < pcm.length; i++) if (Math.abs(pcm[i]) > pk) pk = Math.abs(pcm[i]);
      if (pk < 0.005) return;

      const wav = toWav(pcm, 16000);
      try {
        const fd = new FormData();
        fd.append('file', new File([wav], 'a.wav', { type: 'audio/wav' }));
        fd.append('model', 'whisper-large-v3-turbo');
        fd.append('response_format', 'json');
        fd.append('language', srcLang);

        const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + GROQ_KEY },
          body: fd
        });

        if (!r.ok) {
          const t = await r.text();
          cap('⚠ Groq ' + r.status + ': ' + t.substring(0, 60));
          return;
        }

        const d = await r.json();
        let t = (d.text || '').trim();
        
        if (t.length > 1) {
          if (tgtLang) {
            // Dịch sang ngôn ngữ đích
            const trRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcLang}&tl=${tgtLang}&dt=t&q=` + encodeURIComponent(t));
            const trData = await trRes.json();
            let translated = '';
            if (trData && trData[0]) {
              trData[0].forEach(part => { if (part[0]) translated += part[0]; });
            }
            if (translated) {
              t = translated + '\n\n---\n' + t;
            }
          }
          cap(t);
        }
      } catch (e) {
        cap('❌ ' + e.message);
      }
    }, 3000);

  } catch (e) {
    cap('❌ Audio: ' + e.message);
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
  return new Blob([b], { type: 'audio/wav' });
}

function cap(t) {
  chrome.runtime.sendMessage({ action: '_c', t });
}
