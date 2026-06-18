let audioCtx;
let ws;
let mediaStream;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.target !== 'offscreen') return;

  if (msg.type === 'start-recording') {
    startRecording(msg.streamId);
  } else if (msg.type === 'stop-recording') {
    stopRecording();
  }
});

async function startRecording(streamId) {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });

    audioCtx = new AudioContext({ sampleRate: 16000 });
    await audioCtx.audioWorklet.addModule('processor.js');

    const source = audioCtx.createMediaStreamSource(mediaStream);
    const processor = new AudioWorkletNode(audioCtx, 'audio-processor');

    ws = new WebSocket('ws://localhost:8765');
    ws.binaryType = "arraybuffer";
    
    ws.onerror = (err) => {
      chrome.runtime.sendMessage({ type: "subtitle", text: "Lỗi kết nối tới Server. Hãy chắc chắn bạn đang chạy cửa sổ đen python server.py!" });
    };

    ws.onclose = () => {
      chrome.runtime.sendMessage({ type: "subtitle", text: "Kết nối tới Server bị đóng." });
    };

    ws.onmessage = (event) => {
      // Nhận phụ đề từ server, gửi lại background
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "subtitle") {
            chrome.runtime.sendMessage({ type: "subtitle", text: data.text });
          }
        } catch(e) {}
      }
    };

    processor.port.onmessage = (event) => {
      // event.data là Float32Array PCM data
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(event.data);
      }
    };

    source.connect(processor);
    source.connect(audioCtx.destination);
    
    chrome.runtime.sendMessage({ type: "subtitle", text: "Kết nối thành công! Vui lòng chờ vài giây để AI bắt đầu dịch..." });
  } catch (err) {
    chrome.runtime.sendMessage({ type: "subtitle", text: "Lỗi Offscreen: " + err.message });
    console.error("Lỗi:", err);
  }
}

function stopRecording() {
  if (ws) ws.close();
  if (audioCtx) audioCtx.close();
  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop());
  }
}
