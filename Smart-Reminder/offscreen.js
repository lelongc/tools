// Listen for messages from background.js to play sound
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'play_sound') {
    playTingSound();
    sendResponse({ success: true });
  }
});

function playTingSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create an oscillator for the "ting" sound
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1); 
  
  // Envelope
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);
}
