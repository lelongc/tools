let audioCtx;
let ws;
let mediaStream;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 15;

let sourceLanguage = "en";

function connectWebSocket(processor) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    chrome.runtime.sendMessage({ type: "subtitle", text: "Lỗi: Không thể kết nối tới Server AI (Quá thời gian chờ). Có thể mô hình đang tải hoặc Server bị lỗi." });
    return;
  }
  
  if (reconnectAttempts === 0) {
    chrome.runtime.sendMessage({ type: "subtitle", text: "Đang chờ Server AI khởi động..." });
  }

  ws = new WebSocket('ws://localhost:8765');
  ws.binaryType = "arraybuffer";
  
  ws.onopen = () => {
    reconnectAttempts = 0;
    // Send configuration before audio
    ws.send(JSON.stringify({ type: "config", sourceLang: sourceLanguage }));
    chrome.runtime.sendMessage({ type: "subtitle", text: `Kết nối AI thành công! Đang nghe tiếng ${sourceLanguage === 'ja' ? 'Nhật' : 'Anh'}...` });
  };

  ws.onerror = (err) => {
    // Không làm gì, để onclose lo việc kết nối lại
  };

  ws.onclose = () => {
    reconnectAttempts++;
    setTimeout(() => {
      connectWebSocket(processor);
    }, 1000);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "subtitle") {
        chrome.runtime.sendMessage({ type: "subtitle", text: data.text });
      }
    } catch(e) {}
  };

  processor.port.onmessage = (event) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(event.data);
    }
  };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.target !== 'offscreen') return;

  if (msg.type === 'start-recording') {
    sourceLanguage = msg.sourceLang || "en";
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
    const source = audioCtx.createMediaStreamSource(mediaStream);
    
    await audioCtx.audioWorklet.addModule('processor.js');
    const processor = new AudioWorkletNode(audioCtx, 'audio-processor');

    connectWebSocket(processor);

    source.connect(processor);
    source.connect(audioCtx.destination);
    
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
