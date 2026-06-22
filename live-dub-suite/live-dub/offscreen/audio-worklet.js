class PcmCaptureProcessor extends AudioWorkletProcessor {
  process(r) {
    const e = r[0];
    if (!e || 0 === e.length) return !0;
    const t = e[0] ? e[0].length : 0;
    if (0 === t) return !0;
    const s = new Float32Array(t),
      o = e.length;
    for (let r = 0; r < o; r++) {
      const o = e[r];
      if (o) for (let r = 0; r < t; r++) s[r] += o[r];
    }
    if (o > 1) for (let r = 0; r < t; r++) s[r] /= o;
    return (this.port.postMessage(s, [s.buffer]), !0);
  }
}
registerProcessor("pcm-capture", PcmCaptureProcessor);
