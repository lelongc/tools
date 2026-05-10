// caption.js — Content Script (chạy 1 lần, giữ state liên tục)
(function () {
  'use strict';

  let pop, box;
  let dx = 0, dy = 0, sx, sy, dragging = false;

  function ensure() {
    if (document.getElementById('lc-pop')) return;

    // Popover container — hiện trên cả fullscreen
    pop = document.createElement('div');
    pop.id = 'lc-pop';
    pop.setAttribute('popover', 'manual');

    box = document.createElement('div');
    box.id = 'lc-box';
    box.textContent = '';

    pop.appendChild(box);
    document.body.appendChild(pop);

    // === Drag ===
    box.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
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
      pop.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        box.style.cursor = 'grab';
      }
    });

    // === Fullscreen sync ===
    document.addEventListener('fullscreenchange', () => {
      try {
        if (pop.matches(':popover-open')) {
          pop.hidePopover();
          pop.showPopover();
        }
      } catch (_) {}
    });
  }

  // === Typewriter Effect ===
  let typeTimer;
  function typewrite(text) {
    ensure();
    pop = document.getElementById('lc-pop');
    box = document.getElementById('lc-box');

    // Hiện popover
    try {
      if (!pop.matches(':popover-open')) pop.showPopover();
    } catch (_) {}

    // Dừng typewriter cũ
    clearInterval(typeTimer);

    const chunks = text.match(/(\S+|\s+)/g) || [];
    let i = 0;
    box.textContent = '';

    // Hiện từng phần, tốc độ nhanh hơn xíu (50ms)
    typeTimer = setInterval(() => {
      if (i >= chunks.length) {
        clearInterval(typeTimer);
        return;
      }
      box.textContent += chunks[i];
      i++;
    }, 40);
  }

  // === Lắng nghe caption từ background ===
  chrome.runtime.onMessage.addListener((m, sender, reply) => {
    if (m.action === 'show') {
      typewrite(m.text);
      reply({ ok: 1 });
    }
    return true;
  });
})();
