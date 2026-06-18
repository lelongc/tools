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
    // Lưu ý: Không connect processor ra destination để tránh bị vọng âm 2 lần, 
    // vì tab audio tự nó vẫn đang phát ra loa (trừ khi mình connect để route lại).
    // Tab Capture đã tự động lấy tiếng rồi. Nhưng source.connect(processor) vẫn xử lý âm thanh.
    // Thực tế với tabCapture, nếu không nối ra destination thì có thể tiếng gốc bị tắt.
    // Để giữ tiếng gốc, ta nối thêm:
    source.connect(audioCtx.destination);
    
  } catch (err) {
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
