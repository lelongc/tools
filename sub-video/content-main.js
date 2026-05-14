// content-main.js — Inject into MAIN world to intercept HLS segments
(function() {
  if (window.__lc_injected) return;
  window.__lc_injected = true;
  window.__lc_active = false;

  console.log('[LC Main] Sniffer injected into MAIN world.');

  // Listen for toggle from isolated world
  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    if (e.data && e.data.type === 'LC_TOGGLE') {
      window.__lc_active = e.data.state;
      console.log('[LC Main] Sniffer Active:', window.__lc_active);
    }
  });

  function getEstimatedStart() {
    const v = document.querySelector('video');
    return v ? v.currentTime : 0;
  }

  // THE ULTIMATE SNIFFER: Intercept SourceBuffer.appendBuffer
  // Bắt dữ liệu trực tiếp từ "vòi" trước khi đổ vào trình phát
  const origAppend = SourceBuffer.prototype.appendBuffer;
  SourceBuffer.prototype.appendBuffer = function(buffer) {
    if (window.__lc_active) {
      handleSourceBuffer(this, buffer);
    }
    return origAppend.call(this, buffer);
  };

  let bufferHeaders = new Map(); 

  function handleSourceBuffer(sb, buffer) {
    // Thường thì 1-2 lần append đầu tiên là Header (Init Segment)
    if (!bufferHeaders.has(sb)) {
      console.log('[LC Main] Đã bắt được Header của Stream');
      bufferHeaders.set(sb, buffer);
      return;
    }

    const header = bufferHeaders.get(sb);
    const combined = new Uint8Array(header.byteLength + buffer.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(buffer), header.byteLength);

    const estimatedStart = getEstimatedStart();
    window.postMessage({ 
      type: 'LC_SEGMENT', 
      url: 'sourcebuffer_chunk', 
      buffer: combined.buffer, 
      estimatedStart 
    }, '*');
  }

})();
