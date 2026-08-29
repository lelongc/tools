// =========================================================================
// 2D GAME STUDIO PRO & SMART SPRITESHEET SLICER (ADVANCED ALIGNMENT SUITE)
// =========================================================================

class StudioApp {
    constructor() {
        this.activeTab = 'tab-slicer';
        
        // Slicer State
        this.slicerImg = null;
        this.slicerScale = 1.0;
        this.sliceBoxes = []; // [{x, y, w, h}]
        this.selectedBoxIndex = 0;
        this.slicedCanvases = [];
        this.slicerAnimInterval = null;
        this.slicerAnimFrameIdx = 0;
        this.slicerFps = 10;
        this.sliceMode = 'grid'; // 'grid', 'autodetect', 'manual'
        
        // Slicer Drag / Resize State
        this.isDraggingBox = false;
        this.isMovingSelectedBox = false;
        this.isResizingHandle = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.currentDragBox = null;

        // Studio State
        this.canvasSize = 256;
        this.activeTool = 'pen';
        this.currentColor = '#00f0ff';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndo = 30;

        // Timeline & Clips
        this.currentClipName = 'attack';
        this.activeFrameIndex = 0;
        this.clips = {
            attack: { frames: [], loop: false, speed: 10 },
            idle: { frames: [], loop: true, speed: 6 },
            run: { frames: [], loop: true, speed: 10 },
            hurt: { frames: [], loop: false, speed: 6 },
            death: { frames: [], loop: false, speed: 6 }
        };

        // Animation Player
        this.animPlaying = true;
        this.animInterval = null;
        this.animFrameIdx = 0;
        this.animFps = 10;

        // AI Generator state
        this.selectedCategory = 'characters';

        this.init();
    }

    init() {
        this.initDOM();
        this.initTabs();
        this.initSlicer();
        this.initStudio();
        this.initGenerator();
        this.initLibrary();
        this.initWebSocket();
        this.startStudioAnimation();

        this.initDefaultFrames();
    }

    initDOM() {
        // Tab elements
        this.tabBtns = document.querySelectorAll('.nav-tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');

        // Slicer elements
        this.slicerCanvas = document.getElementById('slicerCanvas');
        this.slicerOverlayCanvas = document.getElementById('slicerOverlayCanvas');
        this.slicerCtx = this.slicerCanvas.getContext('2d');
        this.slicerOverlayCtx = this.slicerOverlayCanvas.getContext('2d');
        this.slicerWrapper = document.getElementById('slicerCanvasWrapper');
        this.slicerMiniPreview = document.getElementById('slicerMiniPreview');
        this.slicerMiniCtx = this.slicerMiniPreview.getContext('2d');

        // Studio elements
        this.layerBase = document.getElementById('layerBase');
        this.layerOnion = document.getElementById('layerOnion');
        this.layerMask = document.getElementById('layerMask');
        this.layerGrid = document.getElementById('layerGrid');
        this.baseCtx = this.layerBase.getContext('2d');
        this.onionCtx = this.layerOnion.getContext('2d');
        this.maskCtx = this.layerMask.getContext('2d');
        this.gridCtx = this.layerGrid.getContext('2d');
        this.studioWrapper = document.getElementById('studioCanvasWrapper');
        this.studioAnimCanvas = document.getElementById('studioAnimCanvas');
        this.studioAnimCtx = this.studioAnimCanvas.getContext('2d');
    }

    // =========================================================================
    // TABS MANAGEMENT
    // =========================================================================
    initTabs() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
        this.tabPanels.forEach(p => p.classList.toggle('active', p.id === tabId));

        if (tabId === 'tab-studio') {
            this.loadCurrentFrame();
            this.renderTimeline();
            this.renderStudioGrid();
        } else if (tabId === 'tab-library') {
            this.loadLibraryCatalog();
        }
    }

    // =========================================================================
    // TAB 1: SMART SPRITESHEET SLICER WITH ADVANCED ALIGNMENT
    // =========================================================================
    initSlicer() {
        const fileInput = document.getElementById('slicerFileInput');
        const dropZone = document.getElementById('slicerDropZone');

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.loadSlicerFile(e.target.files[0]);
            }
        });

        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-cyan)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                this.loadSlicerFile(e.dataTransfer.files[0]);
            }
        });

        // Mode buttons
        document.getElementById('modeGrid').addEventListener('click', () => this.setSliceMode('grid'));
        document.getElementById('modeAutoDetect').addEventListener('click', () => this.setSliceMode('autodetect'));
        document.getElementById('modeManual').addEventListener('click', () => this.setSliceMode('manual'));

        document.getElementById('btnApplyGridSlice').addEventListener('click', () => this.applyGridSlice());
        document.getElementById('btnSendSlicesToStudio').addEventListener('click', () => this.sendSlicesToStudio());
        document.getElementById('btnClearSlices').addEventListener('click', () => this.clearSlices());

        // Smart Alignment Buttons
        document.getElementById('btnAutoAlignFeet').addEventListener('click', () => this.autoAlignAllFeet());
        document.getElementById('btnAutoCenterHoriz').addEventListener('click', () => this.autoCenterAllHorizontally());
        document.getElementById('btnEqualizeBoxes').addEventListener('click', () => this.equalizeAllBoxSizes());
        document.getElementById('btnDeleteSelectedBox').addEventListener('click', () => this.deleteSelectedBox());
        document.getElementById('btnAddCustomBox').addEventListener('click', () => this.addCustomBox());

        // Zoom controls
        document.getElementById('btnSlicerZoomIn').addEventListener('click', () => this.zoomSlicer(1.2));
        document.getElementById('btnSlicerZoomOut').addEventListener('click', () => this.zoomSlicer(0.8));
        document.getElementById('btnSlicerResetZoom').addEventListener('click', () => { this.slicerScale = 1.0; this.renderSlicer(); });

        // FPS slider
        const fpsSlider = document.getElementById('slicerFpsSlider');
        fpsSlider.addEventListener('input', (e) => {
            this.slicerFps = parseInt(e.target.value);
            document.getElementById('slicerFpsVal').innerText = `${this.slicerFps} FPS`;
            this.startSlicerAnimation();
        });

        // Ground line
        document.getElementById('chkShowGroundLine').addEventListener('change', () => this.renderSlicerOverlay());
        document.getElementById('groundLineRange').addEventListener('input', (e) => {
            document.getElementById('groundLineVal').innerText = `${e.target.value}%`;
            this.renderSlicerOverlay();
        });

        // Overlay Mouse events for box selection & manipulation
        this.slicerOverlayCanvas.addEventListener('mousedown', (e) => this.onSlicerMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onSlicerMouseMove(e));
        window.addEventListener('mouseup', () => this.onSlicerMouseUp());

        // Keyboard arrow nudging for selected box
        window.addEventListener('keydown', (e) => {
            if (this.activeTab !== 'tab-slicer' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const step = e.shiftKey ? 5 : 1;
            if (e.key === 'ArrowUp') { e.preventDefault(); this.nudgeSelectedBox(0, -step); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); this.nudgeSelectedBox(0, step); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); this.nudgeSelectedBox(-step, 0); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); this.nudgeSelectedBox(step, 0); }
            else if (e.key === 'Delete' || e.key === 'Backspace') { this.deleteSelectedBox(); }
        });
    }

    setSliceMode(mode) {
        this.sliceMode = mode;
        document.querySelectorAll('.slice-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === (mode === 'grid' ? 'modeGrid' : mode === 'autodetect' ? 'modeAutoDetect' : 'modeManual'));
        });
        document.getElementById('gridSettings').style.display = mode === 'grid' ? 'block' : 'none';

        if (mode === 'autodetect' && this.slicerImg) {
            this.autoDetectSpriteIslands();
        } else {
            this.renderSlicerOverlay();
        }
    }

    loadSlicerFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => this.loadSlicerImageSrc(e.target.result);
        reader.readAsDataURL(file);
    }

    loadSlicerImageSrc(src) {
        const img = new Image();
        img.onload = () => {
            this.slicerImg = img;
            this.slicerCanvas.width = img.width;
            this.slicerCanvas.height = img.height;
            this.slicerOverlayCanvas.width = img.width;
            this.slicerOverlayCanvas.height = img.height;

            document.getElementById('sheetSizeInfo').innerText = `Kích Thước: ${img.width}x${img.height}`;
            this.renderSlicer();
            this.applyGridSlice();
            this.showToast("📂 Đã nạp Spritesheet thành công!");
        };
        img.src = src;
    }

    zoomSlicer(factor) {
        this.slicerScale = Math.max(0.2, Math.min(4.0, this.slicerScale * factor));
        this.renderSlicer();
    }

    renderSlicer() {
        if (!this.slicerImg) return;
        this.slicerCanvas.style.transform = `scale(${this.slicerScale})`;
        this.slicerOverlayCanvas.style.transform = `scale(${this.slicerScale})`;
        this.slicerCtx.clearRect(0, 0, this.slicerCanvas.width, this.slicerCanvas.height);
        this.slicerCtx.drawImage(this.slicerImg, 0, 0);
        this.renderSlicerOverlay();
    }

    renderSlicerOverlay() {
        if (!this.slicerOverlayCanvas) return;
        const ctx = this.slicerOverlayCtx;
        ctx.clearRect(0, 0, this.slicerOverlayCanvas.width, this.slicerOverlayCanvas.height);

        const showGround = document.getElementById('chkShowGroundLine').checked;
        const groundPct = parseInt(document.getElementById('groundLineRange').value) / 100.0;

        // Draw bounding boxes
        this.sliceBoxes.forEach((b, idx) => {
            const isSelected = idx === this.selectedBoxIndex;
            ctx.strokeStyle = isSelected ? '#ffd700' : '#00f0ff';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeRect(b.x, b.y, b.w, b.h);

            ctx.fillStyle = isSelected ? 'rgba(255, 215, 0, 0.25)' : 'rgba(0, 240, 255, 0.12)';
            ctx.fillRect(b.x, b.y, b.w, b.h);

            // Index badge
            ctx.fillStyle = isSelected ? '#ffd700' : '#00f0ff';
            ctx.fillRect(b.x, b.y, 24, 16);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(idx.toString(), b.x + 6, b.y + 12);

            // If selected, draw 8 resize handles
            if (isSelected) {
                const hs = 8;
                const handles = [
                    { x: b.x, y: b.y },
                    { x: b.x + b.w, y: b.y },
                    { x: b.x, y: b.y + b.h },
                    { x: b.x + b.w, y: b.y + b.h },
                    { x: b.x + b.w/2, y: b.y },
                    { x: b.x + b.w/2, y: b.y + b.h },
                    { x: b.x, y: b.y + b.h/2 },
                    { x: b.x + b.w, y: b.y + b.h/2 }
                ];
                handles.forEach(h => {
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
                    ctx.fillRect(h.x - hs/2, h.y - hs/2, hs, hs);
                    ctx.strokeRect(h.x - hs/2, h.y - hs/2, hs, hs);
                });
            }

            // Ground line inside box
            if (showGround) {
                const gy = b.y + b.h * groundPct;
                ctx.strokeStyle = '#ff007f';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 2]);
                ctx.beginPath();
                ctx.moveTo(b.x, gy);
                ctx.lineTo(b.x + b.w, gy);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        // Draw active drag box if manual
        if (this.isDraggingBox && this.currentDragBox) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 3]);
            ctx.strokeRect(this.currentDragBox.x, this.currentDragBox.y, this.currentDragBox.w, this.currentDragBox.h);
            ctx.setLineDash([]);
        }

        document.getElementById('sheetFrameCountInfo').innerText = `Đã cắt: ${this.sliceBoxes.length} khung`;
        document.getElementById('sliceCountBadge').innerText = this.sliceBoxes.length;
        const selInfo = document.getElementById('selectedBoxInfo');
        if (selInfo) {
            selInfo.innerText = this.sliceBoxes.length > 0 ? `Đang chọn: Khung ${this.selectedBoxIndex}` : 'Chưa chọn';
        }
    }

    applyGridSlice() {
        if (!this.slicerImg) return;
        const cols = parseInt(document.getElementById('gridCols').value) || 4;
        const rows = parseInt(document.getElementById('gridRows').value) || 2;
        const cropBottomPct = (parseInt(document.getElementById('gridCropBottom').value) || 0) / 100.0;

        const w = this.slicerImg.width;
        const h = this.slicerImg.height;
        const cw = Math.floor(w / cols);
        const rh = Math.floor(h / rows);
        const usefulH = Math.floor(rh * (1.0 - cropBottomPct));

        this.sliceBoxes = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.sliceBoxes.push({
                    x: c * cw,
                    y: r * rh,
                    w: cw,
                    h: usefulH
                });
            }
        }

        this.selectedBoxIndex = 0;
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
    }

    nudgeSelectedBox(dx, dy) {
        if (this.sliceBoxes.length === 0 || this.selectedBoxIndex < 0 || this.selectedBoxIndex >= this.sliceBoxes.length) return;
        const b = this.sliceBoxes[this.selectedBoxIndex];
        b.x += dx;
        b.y += dy;
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
    }

    deleteSelectedBox() {
        if (this.sliceBoxes.length === 0) return;
        this.sliceBoxes.splice(this.selectedBoxIndex, 1);
        this.selectedBoxIndex = Math.max(0, this.selectedBoxIndex - 1);
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("🗑️ Đã xóa khung được chọn!");
    }

    addCustomBox() {
        if (!this.slicerImg) return;
        const cw = 160, ch = 160;
        this.sliceBoxes.push({
            x: Math.floor(this.slicerImg.width / 2 - cw / 2),
            y: Math.floor(this.slicerImg.height / 2 - ch / 2),
            w: cw,
            h: ch
        });
        this.selectedBoxIndex = this.sliceBoxes.length - 1;
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("➕ Đã thêm khung mới!");
    }

    equalizeAllBoxSizes() {
        if (this.sliceBoxes.length === 0) return;
        const target = this.sliceBoxes[this.selectedBoxIndex] || this.sliceBoxes[0];
        this.sliceBoxes.forEach(b => {
            b.w = target.w;
            b.h = target.h;
        });
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("📐 Đã đồng bộ kích thước tất cả các khung!");
    }

    autoCenterAllHorizontally() {
        if (!this.slicerImg || this.sliceBoxes.length === 0) return;
        const scanCanvas = document.createElement('canvas');
        scanCanvas.width = this.slicerImg.width;
        scanCanvas.height = this.slicerImg.height;
        const sctx = scanCanvas.getContext('2d');
        sctx.drawImage(this.slicerImg, 0, 0);

        this.sliceBoxes.forEach(box => {
            const imgData = sctx.getImageData(box.x, box.y, box.w, box.h).data;
            let minX = box.w, maxX = 0;
            for (let y = 0; y < box.h; y++) {
                for (let x = 0; x < box.w; x++) {
                    const alpha = imgData[(y * box.w + x) * 4 + 3];
                    if (alpha > 30) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                    }
                }
            }
            if (minX < maxX) {
                const spriteCenterInside = (minX + maxX) / 2;
                const shift = Math.round(spriteCenterInside - box.w / 2);
                box.x += shift;
            }
        });

        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("🎯 Đã tự động căn giữa trục ngang tất cả các frame!");
    }

    autoAlignAllFeet() {
        if (!this.slicerImg || this.sliceBoxes.length === 0) return;
        const scanCanvas = document.createElement('canvas');
        scanCanvas.width = this.slicerImg.width;
        scanCanvas.height = this.slicerImg.height;
        const sctx = scanCanvas.getContext('2d');
        sctx.drawImage(this.slicerImg, 0, 0);

        const targetGroundPct = parseInt(document.getElementById('groundLineRange').value) / 100.0;

        this.sliceBoxes.forEach(box => {
            const imgData = sctx.getImageData(box.x, box.y, box.w, box.h).data;
            let maxY = 0;
            for (let y = 0; y < box.h; y++) {
                for (let x = 0; x < box.w; x++) {
                    const alpha = imgData[(y * box.w + x) * 4 + 3];
                    if (alpha > 30) {
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (maxY > 0) {
                const desiredGroundY = Math.round(box.h * targetGroundPct);
                const shiftY = maxY - desiredGroundY;
                box.y += shiftY;
            }
        });

        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("🦶 Đã căn chỉnh mọi chân chạm đúng đường tiếp đất!");
    }

    autoDetectSpriteIslands() {
        if (!this.slicerImg) return;
        this.applyGridSlice();
        this.autoCenterAllHorizontally();
        this.autoAlignAllFeet();
        this.showToast("🪄 Tự động nhận diện và căn chỉnh hoàn hảo!");
    }

    extractSlicedFrames() {
        if (!this.slicerImg || this.sliceBoxes.length === 0) return;
        this.slicedCanvases = [];
        const listContainer = document.getElementById('slicedFramesList');
        listContainer.innerHTML = '';

        this.sliceBoxes.forEach((box, idx) => {
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = 256;
            frameCanvas.height = 256;
            const fctx = frameCanvas.getContext('2d');
            fctx.imageSmoothingEnabled = false;

            fctx.drawImage(this.slicerImg, box.x, box.y, box.w, box.h, 0, 0, 256, 256);
            this.slicedCanvases.push(frameCanvas);

            const card = document.createElement('div');
            card.className = `frame-card ${idx === this.selectedBoxIndex ? 'selected-card' : ''}`;
            card.innerHTML = `
                <canvas width="80" height="80"></canvas>
                <span class="frame-card-idx">Frame ${idx}</span>
            `;
            const thumbCanvas = card.querySelector('canvas');
            const tctx = thumbCanvas.getContext('2d');
            tctx.imageSmoothingEnabled = false;
            tctx.drawImage(frameCanvas, 0, 0, 80, 80);

            card.addEventListener('click', () => {
                this.selectedBoxIndex = idx;
                this.renderSlicerOverlay();
                this.extractSlicedFrames();
            });

            listContainer.appendChild(card);
        });

        this.startSlicerAnimation();
    }

    startSlicerAnimation() {
        if (this.slicerAnimInterval) clearInterval(this.slicerAnimInterval);
        if (this.slicedCanvases.length === 0) return;

        this.slicerAnimInterval = setInterval(() => {
            if (this.slicedCanvases.length === 0) return;
            const frame = this.slicedCanvases[this.slicerAnimFrameIdx];
            this.slicerMiniCtx.clearRect(0, 0, 160, 160);
            this.slicerMiniCtx.imageSmoothingEnabled = false;
            this.slicerMiniCtx.drawImage(frame, 0, 0, 160, 160);

            this.slicerAnimFrameIdx = (this.slicerAnimFrameIdx + 1) % this.slicedCanvases.length;
        }, 1000 / this.slicerFps);
    }

    sendSlicesToStudio() {
        if (this.slicedCanvases.length === 0) {
            this.showToast("⚠️ Chưa có khung hình nào được cắt!");
            return;
        }

        const clip = this.clips[this.currentClipName];
        clip.frames = [];

        this.slicedCanvases.forEach(c => {
            clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
        });

        this.activeFrameIndex = 0;
        this.switchTab('tab-studio');
        this.showToast(`✨ Đã nạp thành công ${clip.frames.length} frame vào Studio!`);
    }

    clearSlices() {
        this.sliceBoxes = [];
        this.slicedCanvases = [];
        this.renderSlicerOverlay();
        document.getElementById('slicedFramesList').innerHTML = '<div class="empty-state">Đã xóa các khung chọn.</div>';
        if (this.slicerAnimInterval) clearInterval(this.slicerAnimInterval);
        this.slicerMiniCtx.clearRect(0, 0, 160, 160);
    }

    onSlicerMouseDown(e) {
        const rect = this.slicerOverlayCanvas.getBoundingClientRect();
        const curX = (e.clientX - rect.left) / this.slicerScale;
        const curY = (e.clientY - rect.top) / this.slicerScale;

        // Check if clicked on a resize handle of the currently selected box
        const hs = 10;
        if (this.selectedBoxIndex >= 0 && this.selectedBoxIndex < this.sliceBoxes.length) {
            const b = this.sliceBoxes[this.selectedBoxIndex];
            const handles = [
                { name: 'tl', x: b.x, y: b.y },
                { name: 'tr', x: b.x + b.w, y: b.y },
                { name: 'bl', x: b.x, y: b.y + b.h },
                { name: 'br', x: b.x + b.w, y: b.y + b.h },
                { name: 't',  x: b.x + b.w/2, y: b.y },
                { name: 'b',  x: b.x + b.w/2, y: b.y + b.h },
                { name: 'l',  x: b.x, y: b.y + b.h/2 },
                { name: 'r',  x: b.x + b.w, y: b.y + b.h/2 }
            ];

            for (const h of handles) {
                if (Math.abs(curX - h.x) <= hs && Math.abs(curY - h.y) <= hs) {
                    this.isResizingHandle = h.name;
                    this.dragStartX = curX;
                    this.dragStartY = curY;
                    this.initialBoxState = { ...b };
                    return;
                }
            }
        }

        // Check if clicked inside an existing box to move it
        for (let i = this.sliceBoxes.length - 1; i >= 0; i--) {
            const b = this.sliceBoxes[i];
            if (curX >= b.x && curX <= b.x + b.w && curY >= b.y && curY <= b.y + b.h) {
                this.selectedBoxIndex = i;
                this.isMovingSelectedBox = true;
                this.dragStartX = curX - b.x;
                this.dragStartY = curY - b.y;
                this.renderSlicerOverlay();
                return;
            }
        }

        if (this.sliceMode === 'manual') {
            this.isDraggingBox = true;
            this.dragStartX = curX;
            this.dragStartY = curY;
            this.currentDragBox = { x: curX, y: curY, w: 0, h: 0 };
        }
    }

    onSlicerMouseMove(e) {
        const rect = this.slicerOverlayCanvas.getBoundingClientRect();
        const curX = (e.clientX - rect.left) / this.slicerScale;
        const curY = (e.clientY - rect.top) / this.slicerScale;

        // Handle Resizing
        if (this.isResizingHandle && this.selectedBoxIndex >= 0 && this.initialBoxState) {
            const b = this.sliceBoxes[this.selectedBoxIndex];
            const init = this.initialBoxState;
            const dx = Math.round(curX - this.dragStartX);
            const dy = Math.round(curY - this.dragStartY);

            if (this.isResizingHandle === 'br') {
                b.w = Math.max(10, init.w + dx);
                b.h = Math.max(10, init.h + dy);
            } else if (this.isResizingHandle === 'bl') {
                b.x = init.x + dx;
                b.w = Math.max(10, init.w - dx);
                b.h = Math.max(10, init.h + dy);
            } else if (this.isResizingHandle === 'tr') {
                b.y = init.y + dy;
                b.w = Math.max(10, init.w + dx);
                b.h = Math.max(10, init.h - dy);
            } else if (this.isResizingHandle === 'tl') {
                b.x = init.x + dx;
                b.y = init.y + dy;
                b.w = Math.max(10, init.w - dx);
                b.h = Math.max(10, init.h - dy);
            } else if (this.isResizingHandle === 'r') {
                b.w = Math.max(10, init.w + dx);
            } else if (this.isResizingHandle === 'l') {
                b.x = init.x + dx;
                b.w = Math.max(10, init.w - dx);
            } else if (this.isResizingHandle === 'b') {
                b.h = Math.max(10, init.h + dy);
            } else if (this.isResizingHandle === 't') {
                b.y = init.y + dy;
                b.h = Math.max(10, init.h - dy);
            }

            this.renderSlicerOverlay();
            return;
        }

        // Handle Moving
        if (this.isMovingSelectedBox && this.sliceBoxes[this.selectedBoxIndex]) {
            const b = this.sliceBoxes[this.selectedBoxIndex];
            b.x = Math.round(curX - this.dragStartX);
            b.y = Math.round(curY - this.dragStartY);
            this.renderSlicerOverlay();
            return;
        }

        // Handle Manual Drag
        if (this.isDraggingBox && this.currentDragBox && this.sliceMode === 'manual') {
            this.currentDragBox.x = Math.min(this.dragStartX, curX);
            this.currentDragBox.y = Math.min(this.dragStartY, curY);
            this.currentDragBox.w = Math.abs(curX - this.dragStartX);
            this.currentDragBox.h = Math.abs(curY - this.dragStartY);
            this.renderSlicerOverlay();
        }
    }

    onSlicerMouseUp() {
        if (this.isResizingHandle) {
            this.isResizingHandle = null;
            this.initialBoxState = null;
            this.extractSlicedFrames();
        }
        if (this.isMovingSelectedBox) {
            this.isMovingSelectedBox = false;
            this.extractSlicedFrames();
        }
        if (this.isDraggingBox && this.sliceMode === 'manual') {
            this.isDraggingBox = false;
            if (this.currentDragBox && this.currentDragBox.w > 10 && this.currentDragBox.h > 10) {
                this.sliceBoxes.push({ ...this.currentDragBox });
                this.selectedBoxIndex = this.sliceBoxes.length - 1;
                this.extractSlicedFrames();
            }
            this.currentDragBox = null;
            this.renderSlicerOverlay();
        }
    }

    // =========================================================================
    // TAB 2: PIXEL STUDIO & ADVANCED FRAME ALIGNMENT
    // =========================================================================
    initStudio() {
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTool = btn.getAttribute('data-tool');
            });
        });

        // Color picker & swatches
        const cp = document.getElementById('studioColorPicker');
        cp.addEventListener('input', (e) => this.currentColor = e.target.value);
        document.querySelectorAll('.swatch').forEach(sw => {
            sw.addEventListener('click', () => {
                this.currentColor = sw.getAttribute('data-col');
                cp.value = this.currentColor;
            });
        });

        // Nudge controls
        document.getElementById('btnNudgeUp').addEventListener('click', () => this.nudgeStudioFrame(0, -1));
        document.getElementById('btnNudgeDown').addEventListener('click', () => this.nudgeStudioFrame(0, 1));
        document.getElementById('btnNudgeLeft').addEventListener('click', () => this.nudgeStudioFrame(-1, 0));
        document.getElementById('btnNudgeRight').addEventListener('click', () => this.nudgeStudioFrame(1, 0));

        document.getElementById('btnStudioCenterAll').addEventListener('click', () => this.studioCenterAllFrames());
        document.getElementById('btnStudioGroundAll').addEventListener('click', () => this.studioGroundAllFrames());

        // Grid & Onion toggles
        document.getElementById('chkStudioGrid').addEventListener('change', () => this.renderStudioGrid());
        document.getElementById('chkOnionSkin').addEventListener('change', () => this.loadCurrentFrame());

        // Undo / Redo & Shortcuts
        document.getElementById('btnStudioUndo').addEventListener('click', () => this.undo());
        document.getElementById('btnStudioRedo').addEventListener('click', () => this.redo());
        document.getElementById('btnStudioDuplicate').addEventListener('click', () => this.duplicateCurrentFrame());
        document.getElementById('btnStudioClear').addEventListener('click', () => this.clearCurrentFrame());

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (this.activeTab === 'tab-studio') {
                const step = e.shiftKey ? 5 : 1;
                if (e.key === 'ArrowUp') { e.preventDefault(); this.nudgeStudioFrame(0, -step); }
                else if (e.key === 'ArrowDown') { e.preventDefault(); this.nudgeStudioFrame(0, step); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); this.nudgeStudioFrame(-step, 0); }
                else if (e.key === 'ArrowRight') { e.preventDefault(); this.nudgeStudioFrame(step, 0); }
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); this.undo(); }
            else if (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); this.redo(); }
            else if (e.key.toLowerCase() === 'p') this.selectTool('pen');
            else if (e.key.toLowerCase() === 'e') this.selectTool('eraser');
            else if (e.key.toLowerCase() === 'b') this.selectTool('bucket');
            else if (e.key.toLowerCase() === 'i') this.selectTool('eyedropper');
            else if (e.key.toLowerCase() === 'm') this.selectTool('inpaint_marker');
        });

        // Canvas drawing
        this.studioWrapper.addEventListener('mousedown', (e) => this.onStudioMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onStudioMouseMove(e));
        window.addEventListener('mouseup', () => this.onStudioMouseUp());

        // Timeline controls
        document.getElementById('clipSelect').addEventListener('change', (e) => {
            this.currentClipName = e.target.value;
            this.activeFrameIndex = 0;
            this.loadCurrentFrame();
            this.renderTimeline();
        });
        document.getElementById('btnTimelineAddFrame').addEventListener('click', () => this.addNewBlankFrame());
        document.getElementById('btnTimelineDelFrame').addEventListener('click', () => this.deleteCurrentFrame());

        // Animation Player controls
        document.getElementById('btnPlayPause').addEventListener('click', () => this.toggleAnimPlay());
        const animFpsSlider = document.getElementById('animFpsSlider');
        animFpsSlider.addEventListener('input', (e) => {
            this.animFps = parseInt(e.target.value);
            document.getElementById('animFpsText').innerText = `${this.animFps} FPS`;
            this.startStudioAnimation();
        });

        // AI Inpaint request
        document.getElementById('btnStudioSendAI').addEventListener('click', () => this.sendStudioAIInpaint());
        document.getElementById('btnStudioSyncGodot').addEventListener('click', () => this.syncAllClipsToGodot());
        document.getElementById('btnTopSyncGodot').addEventListener('click', () => this.syncAllClipsToGodot());
    }

    nudgeStudioFrame(dx, dy) {
        this.pushUndoState();
        const temp = document.createElement('canvas');
        temp.width = this.canvasSize;
        temp.height = this.canvasSize;
        temp.getContext('2d').drawImage(this.layerBase, 0, 0);

        this.baseCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.baseCtx.drawImage(temp, dx, dy);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    studioCenterAllFrames() {
        const clip = this.clips[this.currentClipName];
        if (!clip || clip.frames.length === 0) return;

        clip.frames.forEach(f => {
            const ctx = f.canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, this.canvasSize, this.canvasSize).data;
            let minX = this.canvasSize, maxX = 0;
            for (let y = 0; y < this.canvasSize; y++) {
                for (let x = 0; x < this.canvasSize; x++) {
                    if (data[(y * this.canvasSize + x) * 4 + 3] > 30) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                    }
                }
            }
            if (minX < maxX) {
                const curCenter = (minX + maxX) / 2;
                const shiftX = Math.round(this.canvasSize / 2 - curCenter);
                const temp = document.createElement('canvas');
                temp.width = this.canvasSize;
                temp.height = this.canvasSize;
                temp.getContext('2d').drawImage(f.canvas, 0, 0);
                ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
                ctx.drawImage(temp, shiftX, 0);
            }
        });

        this.loadCurrentFrame();
        this.renderTimeline();
        this.showToast("🎯 Đã căn giữa toàn bộ các Frame trong Clip!");
    }

    studioGroundAllFrames() {
        const clip = this.clips[this.currentClipName];
        if (!clip || clip.frames.length === 0) return;
        const targetGroundY = 220;

        clip.frames.forEach(f => {
            const ctx = f.canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, this.canvasSize, this.canvasSize).data;
            let maxY = 0;
            for (let y = 0; y < this.canvasSize; y++) {
                for (let x = 0; x < this.canvasSize; x++) {
                    if (data[(y * this.canvasSize + x) * 4 + 3] > 30) {
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (maxY > 0) {
                const shiftY = targetGroundY - maxY;
                const temp = document.createElement('canvas');
                temp.width = this.canvasSize;
                temp.height = this.canvasSize;
                temp.getContext('2d').drawImage(f.canvas, 0, 0);
                ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
                ctx.drawImage(temp, 0, shiftY);
            }
        });

        this.loadCurrentFrame();
        this.renderTimeline();
        this.showToast("🦶 Đã căn chân tiếp đất toàn bộ các Frame!");
    }

    renderStudioGrid() {
        this.gridCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        const show = document.getElementById('chkStudioGrid').checked;
        if (!show) return;

        this.gridCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.gridCtx.lineWidth = 1;

        // 32x32 Grid
        for (let i = 32; i < this.canvasSize; i += 32) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(i, 0);
            this.gridCtx.lineTo(i, this.canvasSize);
            this.gridCtx.stroke();

            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, i);
            this.gridCtx.lineTo(this.canvasSize, i);
            this.gridCtx.stroke();
        }

        // Center Crosshairs (Cyan & Pink)
        this.gridCtx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(this.canvasSize / 2, 0);
        this.gridCtx.lineTo(this.canvasSize / 2, this.canvasSize);
        this.gridCtx.stroke();

        this.gridCtx.strokeStyle = 'rgba(255, 0, 128, 0.4)';
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(0, 220); // Ground Line
        this.gridCtx.lineTo(this.canvasSize, 220);
        this.gridCtx.stroke();
    }

    selectTool(toolName) {
        this.activeTool = toolName;
        document.querySelectorAll('.tool-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tool') === toolName);
        });
    }

    initDefaultFrames() {
        const clip = this.clips[this.currentClipName];
        if (clip.frames.length === 0) {
            const c = document.createElement('canvas');
            c.width = this.canvasSize;
            c.height = this.canvasSize;
            clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
        }
        this.loadCurrentFrame();
        this.renderTimeline();
    }

    pushUndoState() {
        const snap = this.baseCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.undoStack.push(snap);
        if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) return;
        const cur = this.baseCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.redoStack.push(cur);
        const prev = this.undoStack.pop();
        this.baseCtx.putImageData(prev, 0, 0);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    redo() {
        if (this.redoStack.length === 0) return;
        const cur = this.baseCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.undoStack.push(cur);
        const next = this.redoStack.pop();
        this.baseCtx.putImageData(next, 0, 0);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    onStudioMouseDown(e) {
        this.pushUndoState();
        this.isDrawing = true;
        const pos = this.getStudioCanvasPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
        this.applyToolAction(pos.x, pos.y);
    }

    onStudioMouseMove(e) {
        if (!this.isDrawing) return;
        const pos = this.getStudioCanvasPos(e);
        this.applyToolLine(this.lastX, this.lastY, pos.x, pos.y);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    onStudioMouseUp() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveCurrentFrameCanvas();
            this.renderTimeline();
        }
    }

    getStudioCanvasPos(e) {
        const rect = this.layerBase.getBoundingClientRect();
        const scale = this.canvasSize / rect.width;
        return {
            x: Math.floor((e.clientX - rect.left) * scale),
            y: Math.floor((e.clientY - rect.top) * scale)
        };
    }

    applyToolAction(x, y) {
        if (x < 0 || x >= this.canvasSize || y < 0 || y >= this.canvasSize) return;

        if (this.activeTool === 'pen') {
            this.baseCtx.fillStyle = this.currentColor;
            this.baseCtx.fillRect(x, y, 2, 2);
        } else if (this.activeTool === 'eraser') {
            this.baseCtx.clearRect(x - 2, y - 2, 5, 5);
        } else if (this.activeTool === 'bucket') {
            this.floodFill(x, y, this.currentColor);
        } else if (this.activeTool === 'eyedropper') {
            const pixel = this.baseCtx.getImageData(x, y, 1, 1).data;
            if (pixel[3] > 0) {
                const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
                this.currentColor = hex;
                document.getElementById('studioColorPicker').value = hex;
            }
        } else if (this.activeTool === 'inpaint_marker') {
            this.maskCtx.fillStyle = 'rgba(255, 0, 128, 0.4)';
            this.maskCtx.beginPath();
            this.maskCtx.arc(x, y, 8, 0, Math.PI * 2);
            this.maskCtx.fill();
        }
    }

    applyToolLine(x0, y0, x1, y1) {
        const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            this.applyToolAction(x0, y0);
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    floodFill(startX, startY, fillColor) {
        const imgData = this.baseCtx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        const data = imgData.data;
        const targetOffset = (startY * this.canvasSize + startX) * 4;
        const tr = data[targetOffset], tg = data[targetOffset + 1], tb = data[targetOffset + 2], ta = data[targetOffset + 3];

        const tempCanvas = document.createElement('canvas');
        const tctx = tempCanvas.getContext('2d');
        tctx.fillStyle = fillColor;
        tctx.fillRect(0, 0, 1, 1);
        const fillP = tctx.getImageData(0, 0, 1, 1).data;

        if (tr === fillP[0] && tg === fillP[1] && tb === fillP[2] && ta === fillP[3]) return;

        const stack = [[startX, startY]];
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            if (x < 0 || x >= this.canvasSize || y < 0 || y >= this.canvasSize) continue;
            const idx = (y * this.canvasSize + x) * 4;

            if (data[idx] === tr && data[idx + 1] === tg && data[idx + 2] === tb && data[idx + 3] === ta) {
                data[idx] = fillP[0];
                data[idx + 1] = fillP[1];
                data[idx + 2] = fillP[2];
                data[idx + 3] = fillP[3];

                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        this.baseCtx.putImageData(imgData, 0, 0);
    }

    loadCurrentFrame() {
        const clip = this.clips[this.currentClipName];
        if (!clip || clip.frames.length === 0) return;
        const curFrame = clip.frames[this.activeFrameIndex];
        if (!curFrame) return;

        this.baseCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.baseCtx.drawImage(curFrame.canvas, 0, 0);
        this.maskCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Render onion skin of previous frame
        this.onionCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        const showOnion = document.getElementById('chkOnionSkin').checked;
        if (showOnion && this.activeFrameIndex > 0) {
            const prev = clip.frames[this.activeFrameIndex - 1];
            this.onionCtx.drawImage(prev.canvas, 0, 0);
        }
    }

    saveCurrentFrameCanvas() {
        const clip = this.clips[this.currentClipName];
        if (!clip || !clip.frames[this.activeFrameIndex]) return;
        const fctx = clip.frames[this.activeFrameIndex].canvas.getContext('2d');
        fctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        fctx.drawImage(this.layerBase, 0, 0);
    }

    renderTimeline() {
        const filmstrip = document.getElementById('timelineFilmstrip');
        filmstrip.innerHTML = '';
        const clip = this.clips[this.currentClipName];
        if (!clip) return;

        clip.frames.forEach((f, idx) => {
            const item = document.createElement('div');
            item.className = `timeline-frame-item ${idx === this.activeFrameIndex ? 'active' : ''}`;
            item.innerHTML = `
                <canvas width="64" height="64"></canvas>
                <span class="timeline-frame-num">${idx}</span>
            `;
            const c = item.querySelector('canvas');
            const ctx = c.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(f.canvas, 0, 0, 64, 64);

            item.addEventListener('click', () => {
                this.saveCurrentFrameCanvas();
                this.activeFrameIndex = idx;
                this.loadCurrentFrame();
                this.renderTimeline();
            });

            filmstrip.appendChild(item);
        });
    }

    addNewBlankFrame() {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
        this.activeFrameIndex = clip.frames.length - 1;
        this.loadCurrentFrame();
        this.renderTimeline();
    }

    duplicateCurrentFrame() {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const cur = clip.frames[this.activeFrameIndex];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        c.getContext('2d').drawImage(cur.canvas, 0, 0);
        clip.frames.splice(this.activeFrameIndex + 1, 0, { canvas: c, hitbox: null, hurtbox: null });
        this.activeFrameIndex++;
        this.loadCurrentFrame();
        this.renderTimeline();
        this.showToast("📋 Đã nhân bản Frame thành công!");
    }

    deleteCurrentFrame() {
        const clip = this.clips[this.currentClipName];
        if (clip.frames.length <= 1) {
            this.showToast("⚠️ Cần giữ lại ít nhất 1 Frame!");
            return;
        }
        clip.frames.splice(this.activeFrameIndex, 1);
        this.activeFrameIndex = Math.max(0, this.activeFrameIndex - 1);
        this.loadCurrentFrame();
        this.renderTimeline();
    }

    clearCurrentFrame() {
        this.pushUndoState();
        this.baseCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    toggleAnimPlay() {
        this.animPlaying = !this.animPlaying;
        document.getElementById('btnPlayPause').innerText = this.animPlaying ? '⏸️ Tạm dừng' : '▶️ Phát';
        if (this.animPlaying) this.startStudioAnimation();
        else if (this.animInterval) clearInterval(this.animInterval);
    }

    startStudioAnimation() {
        if (this.animInterval) clearInterval(this.animInterval);
        if (!this.animPlaying) return;

        this.animInterval = setInterval(() => {
            const clip = this.clips[this.currentClipName];
            if (!clip || clip.frames.length === 0) return;

            const frame = clip.frames[this.animFrameIdx];
            if (frame) {
                this.studioAnimCtx.clearRect(0, 0, 180, 180);
                this.studioAnimCtx.imageSmoothingEnabled = false;
                this.studioAnimCtx.drawImage(frame.canvas, 0, 0, 180, 180);
            }
            this.animFrameIdx = (this.animFrameIdx + 1) % clip.frames.length;
        }, 1000 / this.animFps);
    }

    async sendStudioAIInpaint() {
        const prompt = document.getElementById('studioAiPrompt').value.trim();
        if (!prompt) {
            this.showToast("⚠️ Vui lòng nhập mô tả cần AI sửa!");
            return;
        }

        const btn = document.getElementById('btnStudioSendAI');
        btn.innerText = "⏳ AI Đang Xử Lý...";
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:8765/api/ai/inpaint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    image: this.layerBase.toDataURL(),
                    mask: this.layerMask.toDataURL()
                })
            });
            const data = await res.json();
            if (data.type === 'ADD_FRAME') {
                this.addStudioRemoteFrame(data.image);
            } else if (data.image) {
                this.pushUndoState();
                this.applyStudioRemoteFrame(data.image);
                this.showToast("✨ AI đã xử lý vùng vẽ thành công!");
            }
        } catch (e) {
            this.showToast("⚠️ Lỗi AI: " + e.message);
        } finally {
            btn.innerText = "✨ Yêu Cầu AI Sửa Vùng Này";
            btn.disabled = false;
        }
    }

    applyStudioRemoteFrame(b64) {
        const img = new Image();
        img.onload = () => {
            this.baseCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.baseCtx.drawImage(img, 0, 0);
            this.maskCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.saveCurrentFrameCanvas();
            this.renderTimeline();
        };
        img.src = b64;
    }

    addStudioRemoteFrame(b64) {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        const img = new Image();
        img.onload = () => {
            c.getContext('2d').drawImage(img, 0, 0);
            clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
            this.activeFrameIndex = clip.frames.length - 1;
            this.loadCurrentFrame();
            this.renderTimeline();
            this.showToast(`✨ Đã thêm Frame mới (Tổng: ${clip.frames.length} frames)!`);
        };
        img.src = b64;
    }

    // =========================================================================
    // TAB 3: AI ASSET GENERATOR
    // =========================================================================
    initGenerator() {
        document.querySelectorAll('.cat-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedCategory = card.getAttribute('data-cat');
            });
        });

        document.querySelectorAll('.style-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const textarea = document.getElementById('genPromptInput');
                const style = chip.getAttribute('data-style');
                textarea.value += (textarea.value ? ', ' : '') + style;
            });
        });

        document.getElementById('btnGenerateAssetAI').addEventListener('click', () => this.generateAssetFromAI());
    }

    async generateAssetFromAI() {
        const prompt = document.getElementById('genPromptInput').value.trim();
        if (!prompt) {
            this.showToast("⚠️ Vui lòng nhập mô tả asset cần tạo!");
            return;
        }

        const btn = document.getElementById('btnGenerateAssetAI');
        btn.innerText = "⏳ AI Đang Sinh Ảnh...";
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:8765/api/ai/generate_full_asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: this.selectedCategory,
                    prompt: prompt
                })
            });
            const data = await res.json();
            if (data.image) {
                this.loadSlicerImageSrc(data.image);
                this.switchTab('tab-slicer');
                this.showToast("✨ AI đã tạo xong! Mời bạn xem và điều chỉnh cắt khung hình.");
            } else if (data.error) {
                this.showToast("⚠️ " + data.error);
            }
        } catch (e) {
            this.showToast("⚠️ Lỗi AI: " + e.message);
        } finally {
            btn.innerText = "✨ Gửi Yêu Cầu Cho AI Tạo Ngay ➔";
            btn.disabled = false;
        }
    }

    // =========================================================================
    // TAB 4: ASSET LIBRARY
    // =========================================================================
    initLibrary() {
        document.querySelectorAll('.lib-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lib-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterLibrary(btn.getAttribute('data-lib-cat'));
            });
        });
    }

    async loadLibraryCatalog() {
        try {
            const res = await fetch('http://localhost:8765/api/library/assets');
            const data = await res.json();
            this.renderLibraryGrid(data.catalog);
        } catch (e) {
            console.error("Library:", e);
        }
    }

    renderLibraryGrid(catalog) {
        const grid = document.getElementById('libraryCardsGrid');
        grid.innerHTML = '';

        for (const [catKey, items] of Object.entries(catalog)) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'library-card';
                card.setAttribute('data-category', catKey);
                card.innerHTML = `
                    <div class="library-thumb">
                        <img src="${item.thumb_url}" alt="${item.name}">
                    </div>
                    <div class="library-card-info">
                        <h4>${item.name}</h4>
                        <p>${item.description || ''}</p>
                    </div>
                    <div class="library-actions">
                        <button class="btn btn-primary btn-sm" style="flex:1;">✂️ Cắt Slices</button>
                        <button class="btn btn-godot btn-sm">🚀 Godot</button>
                    </div>
                `;

                card.querySelector('.btn-primary').addEventListener('click', () => {
                    this.loadSlicerImageSrc(item.thumb_url);
                    this.switchTab('tab-slicer');
                });

                grid.appendChild(card);
            });
        }
    }

    filterLibrary(cat) {
        document.querySelectorAll('.library-card').forEach(c => {
            c.style.display = (cat === 'all' || c.getAttribute('data-category') === cat) ? 'flex' : 'none';
        });
    }

    // =========================================================================
    // GODOT SYNC & WEBSOCKET
    // =========================================================================
    initWebSocket() {
        try {
            this.ws = new WebSocket('ws://localhost:8765/ws');
            this.ws.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                if (msg.type === 'APPLY_FRAME') {
                    this.applyStudioRemoteFrame(msg.imageData);
                } else if (msg.type === 'ADD_FRAME') {
                    this.addStudioRemoteFrame(msg.imageData);
                } else if (msg.type === 'LOAD_SPRITESHEET') {
                    this.loadSlicerImageSrc(msg.imageData);
                    this.switchTab('tab-slicer');
                }
            };
            this.ws.onopen = () => document.getElementById('wsStatusText').innerText = "AI CO-PILOT: SẴN SÀNG";
            this.ws.onclose = () => document.getElementById('wsStatusText').innerText = "MẤT KẾT NỐI AI";
        } catch (e) {
            console.log("WS error:", e);
        }
    }

    async syncAllClipsToGodot() {
        this.saveCurrentFrameCanvas();
        const exportData = {};
        for (const [clipName, clipObj] of Object.entries(this.clips)) {
            if (clipObj.frames.length > 0) {
                exportData[clipName] = clipObj.frames.map(f => f.canvas.toDataURL());
            }
        }

        try {
            const res = await fetch('http://localhost:8765/api/godot/sync_full_character', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    character_name: "custom_hero",
                    clips: exportData
                })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                this.showToast("🚀 Đã xuất trọn bộ vào Godot 2D thành công!");
            }
        } catch (e) {
            this.showToast("⚠️ Lỗi xuất Godot: " + e.message);
        }
    }

    showToast(msg) {
        const container = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3500);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.studioApp = new StudioApp();
});
