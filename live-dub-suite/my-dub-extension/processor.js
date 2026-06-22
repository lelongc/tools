class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 16000; // 1 giây tại 16000Hz (hoặc gửi nhỏ hơn tùy nhu cầu)
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0]; // Lấy kênh trái/mono
      
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.bytesWritten++] = channelData[i];
        if (this.bytesWritten >= this.bufferSize) {
          // Gửi buffer về main thread
          this.port.postMessage(this.buffer);
          // Reset buffer
          this.buffer = new Float32Array(this.bufferSize);
          this.bytesWritten = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
