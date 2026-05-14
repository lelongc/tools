// caption.js — Content Script (persistent, inject-safe)
(function () {
  'use strict';

  // ── Build / ensure DOM ───────────────────────────────────────────
  function ensure() {
    if (document.getElementById('lc-pop')) return;

    const pop = document.createElement('div');
    pop.id = 'lc-pop';
    pop.setAttribute('popover', 'manual');

    // Box wrapper (drag handle)
    const box = document.createElement('div');
    box.id = 'lc-box';

    // Dòng dịch (tiếng Việt, v.v.)
    const translated = document.createElement('div');
    translated.id = 'lc-translated';

    // Dòng gốc (tiếng Anh / Nhật)
    const original = document.createElement('div');
    original.id = 'lc-original';

    box.appendChild(translated);
    box.appendChild(original);
    pop.appendChild(box);
    document.body.appendChild(pop);

    // ── Drag ────────────────────────────────────────────────────────
    let dx = 0, dy = 0, sx = 0, sy = 0, dragging = false;
    box.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      dragging = true;
      sx = e.clientX - dx;
      sy = e.clientY - dy;
      box.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      e.preventDefault();
      dx = e.clientX - sx;
      dy = e.clientY - sy;
      pop.style.left = 'auto';
      pop.style.bottom = 'auto';
      pop.style.transform = `translateX(-50%) translate(${dx}px,${dy}px)`;
    });
    document.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; box.style.cursor = 'grab'; }
    });

    // ── Fullscreen sync ──────────────────────────────────────────────
    document.addEventListener('fullscreenchange', () => {
      try {
        if (pop.matches(':popover-open')) { pop.hidePopover(); pop.showPopover(); }
      } catch (_) {}
    });
  }

  // ── Typewriter ────────────────────────────────────────────────────
  let timer;

  function typewrite(el, text, onDone) {
    el.classList.add('typing');
    const tokens = text.match(/(\S+|\s+)/g) || [];
    let i = 0;
    el.textContent = '';
    const tick = setInterval(() => {
      if (i >= tokens.length) {
        clearInterval(tick);
        el.classList.remove('typing');
        if (onDone) onDone();
        return;
      }
      el.textContent += tokens[i++];
    }, 35);
    return tick;
  }

  function show(text) {
    ensure();
    const pop        = document.getElementById('lc-pop');
    const box        = document.getElementById('lc-box');
    const transEl    = document.getElementById('lc-translated');
    const origEl     = document.getElementById('lc-original');

    // Hiện popover
    try { if (!pop.matches(':popover-open')) pop.showPopover(); } catch (_) {}

    // Dừng typewriter cũ
    clearInterval(timer);
    transEl.classList.remove('typing');
    origEl.classList.remove('typing');

    // Phân tách bản dịch / bản gốc theo separator '─────'
    const SEP = '─────';
    const sepIdx = text.indexOf(SEP);

    if (sepIdx !== -1) {
      // Có 2 dòng
      const translatedText = text.substring(0, sepIdx).trim();
      const originalText   = text.substring(sepIdx + SEP.length).trim();

      box.classList.remove('single');
      transEl.style.display = '';
      origEl.style.display  = '';

      // Gõ bản dịch trước → sau đó gõ bản gốc
      typewrite(transEl, translatedText, () => {
        timer = typewrite(origEl, originalText);
      });
    } else {
      // Chỉ có 1 dòng (không dịch, hoặc là thông báo hệ thống)
      box.classList.add('single');
      transEl.style.display = 'none';
      origEl.style.display  = '';

      timer = typewrite(origEl, text);
    }
  }

  // ── Message listener ──────────────────────────────────────────────
  const handler = (m, _sender, reply) => {
    if (m.action === 'show') {
      show(m.text);
      reply && reply({ ok: 1 });
    } else if (m.action === 'hide') {
      clearInterval(timer);
      const pop = document.getElementById('lc-pop');
      try { if (pop && pop.matches(':popover-open')) pop.hidePopover(); } catch (_) {}
      reply && reply({ ok: 1 });
    }
    return true;
  };

  if (window.__lc_handler) {
    chrome.runtime.onMessage.removeListener(window.__lc_handler);
  }
  window.__lc_handler = handler;
  chrome.runtime.onMessage.addListener(handler);
})();
