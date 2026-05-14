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
    if (!v) return 0;
    // Assume the segment being fetched is appended to the END of the current buffer
    if (v.buffered.length > 0) {
      return v.buffered.end(v.buffered.length - 1);
    }
    return v.currentTime;
  }

  function isVideoSegment(url) {
    if (!url) return false;
    // .ts or .m4s or paths containing /segment/
    if (url.includes('.ts') || url.includes('.m4s') || url.includes('/seg-') || url.includes('/segment')) return true;
    return false;
  }

  // Intercept Fetch
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const res = await origFetch.apply(this, args);
    
    if (!window.__lc_active) return res;

    const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) ? args[0].url : '';
    if (isVideoSegment(url)) {
      const estimatedStart = getEstimatedStart();
      const clone = res.clone();
      clone.arrayBuffer().then(buf => {
        window.postMessage({ type: 'LC_SEGMENT', url, buffer: buf, estimatedStart }, '*');
      }).catch(()=>{});
    }
    return res;
  };

  // Intercept XMLHttpRequest (hls.js mostly uses this)
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._lc_url = typeof url === 'string' ? url : url.toString();
    return origOpen.call(this, method, url, ...rest);
  };
  
  XMLHttpRequest.prototype.send = function(...args) {
    if (window.__lc_active && isVideoSegment(this._lc_url)) {
      const estimatedStart = getEstimatedStart();
      this.addEventListener('load', function() {
        try {
          if (this.responseType === 'arraybuffer' && this.response) {
            // Copy buffer to avoid transfer issues
            const bufCopy = this.response.slice(0);
            window.postMessage({ type: 'LC_SEGMENT', url: this._lc_url, buffer: bufCopy, estimatedStart }, '*');
          } else if (this.responseType === 'blob' && this.response) {
            this.response.arrayBuffer().then(buf => {
              window.postMessage({ type: 'LC_SEGMENT', url: this._lc_url, buffer: buf, estimatedStart }, '*');
            });
          }
        } catch(e) {}
      });
    }
    return origSend.apply(this, args);
  };

})();
