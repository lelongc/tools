// 2D ASSET STUDIO & AI PRO ANIMATION ENGINE CLIENT

class StudioApp {
    constructor() {
        this.canvasSize = 256;
        this.currentTool = 'pen';
        this.primaryColor = '#00f0ff';
        this.brushSize = 4;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Multi-Clip Animation Engine
        this.currentClipName = 'attack';
        this.clips = {
            attack: { name: "Attack_Combo", fps: 10, frames: [] },
            run: { name: "Run_Cycle", fps: 12, frames: [] },
            idle: { name: "Idle_Stance", fps: 6, frames: [] },
            hurt: { name: "Hurt_React", fps: 8, frames: [] },
            death: { name: "Death_Knockout", fps: 8, frames: [] }
        };
        this.activeFrameIndex = 0;
        this.activeLayerIndex = 0;
        
        // Onion Skin & Hitbox
        this.onionSkinEnabled = false;
        this.hitboxEditorMode = false;
        this.showGrid = true;
        this.gridSize = 32;
        
        // Box drag coords for hitbox
        this.boxStartX = 0;
        this.boxStartY = 0;
        
        // Realtime Animation Loop
        this.previewFrameIdx = 0;
        this.previewTimer = null;
        this.isPlaying = true;
        
        // Undo / Redo History Stack
        this.undoStack = [];
        this.redoStack = [];

        this.initDOM();
        this.initClipsDefault();
        this.initEventListeners();
        this.initWebSocket();
        this.renderTimeline();
        this.startPreviewLoop();
        this.drawGrid();
        
        // Show welcome guide toast
        setTimeout(() => {
            this.showToast("💡 Mẹo: Bấm '❓ Hướng Dẫn Dùng' hoặc '📚 Kho Asset' để bắt đầu!");
        }, 500);
    }

    initDOM() {
        this.wrapper = document.getElementById('canvasWrapper');
        this.gridCanvas = document.getElementById('gridCanvas');
        this.gridCtx = this.gridCanvas.getContext('2d');
        this.onionCanvas = document.getElementById('onionCanvas');
        this.onionCtx = this.onionCanvas.getContext('2d');
        this.maskCanvas = document.getElementById('maskLayer');
        this.maskCtx = this.maskCanvas.getContext('2d');
        this.hitboxCanvas = document.getElementById('hitboxCanvas');
        this.hitboxCtx = this.hitboxCanvas.getContext('2d');
        
        this.animCanvas = document.getElementById('animPreviewCanvas');
        this.animCtx = this.animCanvas.getContext('2d');
        
        this.hudCursor = document.getElementById('hudCursorPos');
        this.hudFrame = document.getElementById('hudFrameIndex');
        this.brushSizeVal = document.getElementById('brushSizeVal');
        this.primaryColorInput = document.getElementById('primaryColor');
        this.colorPickerWrapper = document.getElementById('colorPickerWrapper');
        this.layersListContainer = document.getElementById('layersList');
        this.filmstripContainer = document.getElementById('timelineFilmstrip');
        this.clipSelect = document.getElementById('clipSelect');
    }

    initClipsDefault() {
        // Tạo mặc định 4 frames cho Attack clip
        for (const k in this.clips) {
            const count = (k === 'hurt') ? 2 : 4;
            for (let f = 0; f < count; f++) {
                const c = document.createElement('canvas');
                c.width = this.canvasSize;
                c.height = this.canvasSize;
                this.clips[k].frames.push({
                    canvas: c,
                    hitbox: null,
                    hurtbox: { x: 96, y: 64, w: 64, h: 128 }
                });
            }
        }
        this.loadCurrentFrame();
    }

    loadCurrentFrame() {
        const clip = this.clips[this.currentClipName];
        if (!clip || clip.frames.length === 0) return;
        
        if (this.activeFrameIndex >= clip.frames.length) {
            this.activeFrameIndex = clip.frames.length - 1;
        }

        const frameData = clip.frames[this.activeFrameIndex];
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        ctx.drawImage(frameData.canvas, 0, 0);

        this.hudFrame.innerText = `Frame: ${this.activeFrameIndex + 1} / ${clip.frames.length}`;
        this.updateOnionSkin();
        this.drawHitboxOverlay();
        this.renderTimeline();
    }

    saveCurrentFrameCanvas() {
        const clip = this.clips[this.currentClipName];
        if (!clip || !clip.frames[this.activeFrameIndex]) return;
        const frameData = clip.frames[this.activeFrameIndex];
        const baseLayer = document.getElementById('layer0');
        const fctx = frameData.canvas.getContext('2d');
        fctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        fctx.drawImage(baseLayer, 0, 0);
    }

    initEventListeners() {
        // Tool Selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
            });
        });

        // Color & Brush Size
        this.primaryColorInput.addEventListener('input', (e) => {
            this.primaryColor = e.target.value;
            this.colorPickerWrapper.style.backgroundColor = this.primaryColor;
        });

        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            this.brushSizeVal.innerText = `${this.brushSize}px`;
        });

        // Clip Dropdown
        this.clipSelect.addEventListener('change', (e) => {
            this.saveCurrentFrameCanvas();
            this.currentClipName = e.target.value;
            this.activeFrameIndex = 0;
            const clip = this.clips[this.currentClipName];
            document.getElementById('animPreviewClipName').innerText = `${clip.name} (${clip.frames.length}f)`;
            document.getElementById('timelineFpsSlider').value = clip.fps;
            document.getElementById('timelineFpsVal').innerText = `${clip.fps} FPS`;
            this.loadCurrentFrame();
        });

        // Onion Skin Toggle
        const btnOnion = document.getElementById('btnToggleOnion');
        btnOnion.addEventListener('click', () => {
            this.onionSkinEnabled = !this.onionSkinEnabled;
            btnOnion.innerText = this.onionSkinEnabled ? "🧅 Onion Skin (BẬT)" : "🧅 Onion Skin (TẮT)";
            btnOnion.style.color = this.onionSkinEnabled ? "var(--accent-cyan)" : "var(--text-main)";
            this.updateOnionSkin();
        });

        // Hitbox Editor Toggle
        const btnHitbox = document.getElementById('btnToggleHitbox');
        if (btnHitbox) {
            btnHitbox.addEventListener('click', () => {
                this.hitboxEditorMode = !this.hitboxEditorMode;
                btnHitbox.innerText = this.hitboxEditorMode ? "🎯 Hitbox Editor (BẬT)" : "🎯 Hitbox Editor (TẮT)";
                btnHitbox.style.color = this.hitboxEditorMode ? "var(--accent-cyan)" : "var(--text-main)";
                
                if (this.hitboxEditorMode) {
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                    const hbBtn = document.querySelector('[data-tool="hitbox_box"]');
                    if (hbBtn) hbBtn.classList.add('active');
                    this.currentTool = 'hitbox_box';
                } else {
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                    const pBtn = document.querySelector('[data-tool="pen"]');
                    if (pBtn) pBtn.classList.add('active');
                    this.currentTool = 'pen';
                }
            });
        }

        // Grid Toggle
        document.getElementById('btnToggleGrid').addEventListener('click', () => {
            this.showGrid = !this.showGrid;
            this.drawGrid();
        });

        // Timeline Frame Buttons
        document.getElementById('btnAddFrame').addEventListener('click', () => this.addEmptyFrame());
        document.getElementById('btnDuplicateFrame').addEventListener('click', () => this.duplicateCurrentFrame());
        document.getElementById('btnFlipH').addEventListener('click', () => this.flipHorizontal());
        document.getElementById('btnDeleteFrame').addEventListener('click', () => this.deleteCurrentFrame());

        // Timeline Play / Pause & FPS
        document.getElementById('btnTimelinePlay').addEventListener('click', (e) => {
            this.isPlaying = !this.isPlaying;
            e.target.innerText = this.isPlaying ? "⏸ Dừng" : "▶ Phát";
        });

        const fpsSlider = document.getElementById('timelineFpsSlider');
        const fpsVal = document.getElementById('timelineFpsVal');
        fpsSlider.addEventListener('input', (e) => {
            const clip = this.clips[this.currentClipName];
            clip.fps = parseInt(e.target.value);
            fpsVal.innerText = `${clip.fps} FPS`;
            this.startPreviewLoop();
        });

        // Canvas Mouse Drawing
        this.wrapper.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());

        // AI Buttons
        document.getElementById('btnSendAICommand').addEventListener('click', () => this.sendAICommand());
        const chipV8 = document.getElementById('chipValkyrie8F');
        if (chipV8) chipV8.addEventListener('click', () => this.loadAssetFromLibrary('characters', 'cyber_valkyrie_8f'));
        const chipSM = document.getElementById('chipSwordmaster');
        if (chipSM) chipSM.addEventListener('click', () => this.loadAssetFromLibrary('characters', 'female_swordmaster'));
        document.getElementById('chipFullHero').addEventListener('click', () => this.executeQuickAction('full_hero_pack'));
        document.getElementById('chipFullBoss').addEventListener('click', () => this.executeQuickAction('full_boss_pack'));
        document.getElementById('chipRenderSketch').addEventListener('click', () => this.executeQuickAction('render_sketch'));
        document.getElementById('chipInbetween').addEventListener('click', () => this.executeQuickAction('inbetween'));
        document.getElementById('chipSlashTrail').addEventListener('click', () => this.executeQuickAction('slash_trail'));
        document.getElementById('chipCleanAlpha').addEventListener('click', () => this.executeQuickAction('remove_bg'));

        // Godot Sync
        document.getElementById('btnSyncGodot').addEventListener('click', () => this.syncAllClipsToGodot());

        // Undo / Redo Buttons
        document.getElementById('btnUndo').addEventListener('click', () => this.undo());
        const btnRedo = document.getElementById('btnRedo');
        if (btnRedo) btnRedo.addEventListener('click', () => this.redo());

        // Help Guide Modal
        const helpModal = document.getElementById('helpModal');
        const btnHelp = document.getElementById('btnHelpGuide');
        const btnCloseHelp = document.getElementById('btnCloseHelp');
        if (btnHelp) btnHelp.addEventListener('click', () => { helpModal.style.display = 'flex'; });
        if (btnCloseHelp) btnCloseHelp.addEventListener('click', () => { helpModal.style.display = 'none'; });

        // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Space, P, E, B, M)
        window.addEventListener('keydown', (e) => {
            const isTyping = (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT');
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.redo();
                } else {
                    this.undo();
                }
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                this.redo();
                return;
            }
            if (isTyping) return;

            if (e.key === ' ') {
                e.preventDefault();
                this.isPlaying = !this.isPlaying;
                document.getElementById('btnTimelinePlay').innerText = this.isPlaying ? "⏸ Dừng" : "▶ Phát";
                this.showToast(this.isPlaying ? "▶ Đang phát animation" : "⏸ Đã dừng animation");
            } else if (e.key.toLowerCase() === 'p') {
                this.selectTool('pen');
                this.showToast("✏️ Chọn Bút vẽ (P)");
            } else if (e.key.toLowerCase() === 'e') {
                this.selectTool('eraser');
                this.showToast("🧽 Chọn Tẩy xóa nền (E)");
            } else if (e.key.toLowerCase() === 'b') {
                this.selectTool('bucket');
                this.showToast("🪣 Chọn Đổ màu (B)");
            } else if (e.key.toLowerCase() === 'm') {
                this.selectTool('inpaint');
                this.showToast("🖌️ Chọn Cọ Mask AI (M)");
            }
        });

        // Asset Library Modal
        this.libraryModal = document.getElementById('libraryModal');
        this.libraryGrid = document.getElementById('libraryGrid');
        this.currentLibCat = 'characters';
        this.cachedCatalog = null;

        document.getElementById('btnOpenLibrary').addEventListener('click', () => this.openLibrary());
        document.getElementById('btnCloseLibrary').addEventListener('click', () => this.closeLibrary());

        document.querySelectorAll('.lib-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lib-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLibCat = btn.dataset.cat;
                this.renderLibraryGrid();
            });
        });
    }

    selectTool(toolName) {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-tool="${toolName}"]`);
        if (btn) btn.classList.add('active');
        this.currentTool = toolName;
    }

    showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2100);
    }

    pushUndoState() {
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d');
        const snapshot = ctx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.undoStack.push(snapshot);
        if (this.undoStack.length > 30) this.undoStack.shift();
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) {
            this.showToast("⚠️ Không còn nét nào để hoàn tác");
            return;
        }
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d');
        const currentSnap = ctx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.redoStack.push(currentSnap);
        
        const prevSnap = this.undoStack.pop();
        ctx.putImageData(prevSnap, 0, 0);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
        this.showToast("↩️ Đã hoàn tác (Ctrl+Z)");
    }

    redo() {
        if (this.redoStack.length === 0) {
            this.showToast("⚠️ Không còn nét nào để làm lại");
            return;
        }
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d');
        const currentSnap = ctx.getImageData(0, 0, this.canvasSize, this.canvasSize);
        this.undoStack.push(currentSnap);
        
        const nextSnap = this.redoStack.pop();
        ctx.putImageData(nextSnap, 0, 0);
        this.saveCurrentFrameCanvas();
        this.renderTimeline();
        this.showToast("↪️ Đã làm lại (Ctrl+Y)");
    }

    async openLibrary() {
        this.libraryModal.style.display = 'flex';
        if (!this.cachedCatalog) {
            const res = await fetch('http://localhost:8765/api/library/assets');
            const data = await res.json();
            this.cachedCatalog = data.catalog || {};
        }
        this.renderLibraryGrid();
    }

    closeLibrary() {
        this.libraryModal.style.display = 'none';
    }

    renderLibraryGrid() {
        if (!this.cachedCatalog) return;
        this.libraryGrid.innerHTML = '';
        const items = this.cachedCatalog[this.currentLibCat] || [];

        if (items.length === 0) {
            this.libraryGrid.innerHTML = '<div style="color: var(--text-muted); font-size: 13px;">Không có asset nào trong danh mục này.</div>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'asset-card';
            card.innerHTML = `
                <div class="asset-thumb-container">
                    <img class="asset-thumb-img" src="${item.thumb || ''}" alt="${item.name}">
                </div>
                <div class="asset-info">
                    <span class="asset-title">${item.name}</span>
                    <span class="asset-desc">${item.description || item.id}</span>
                </div>
                <div class="asset-actions">
                    <button class="btn-card-load">✏️ Nạp Vào Sửa</button>
                    <button class="btn-card-export">🚀 Vào Godot</button>
                </div>
            `;

            card.querySelector('.btn-card-load').addEventListener('click', () => this.loadAssetFromLibrary(this.currentLibCat, item.id));
            card.querySelector('.btn-card-export').addEventListener('click', () => this.exportAssetFromLibrary(this.currentLibCat, item.id));

            this.libraryGrid.appendChild(card);
        });
    }

    async loadAssetFromLibrary(category, assetId) {
        try {
            const res = await fetch(`http://localhost:8765/api/library/load_asset?category=${category}&asset_id=${assetId}`);
            const data = await res.json();
            if (data.type === 'character' && data.clips) {
                this.loadFullClipSet(data.clips);
                this.closeLibrary();
                alert(`✨ Đã nạp trọn bộ Animation của [${assetId}] vào Studio!`);
            } else if (data.type === 'fx' && data.frames) {
                const clip = this.clips[this.currentClipName];
                clip.frames = [];
                data.frames.forEach(b64 => {
                    const c = document.createElement('canvas');
                    c.width = this.canvasSize;
                    c.height = this.canvasSize;
                    const ctx = c.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                        this.renderTimeline();
                    };
                    img.src = b64;
                    clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
                });
                this.activeFrameIndex = 0;
                this.loadCurrentFrame();
                this.closeLibrary();
                alert(`✨ Đã nạp hiệu ứng VFX [${assetId}] vào Clip hiện tại!`);
            } else if (data.type === 'single' && data.image) {
                this.applyRemoteFrame(data.image);
                this.closeLibrary();
                alert(`✨ Đã nạp hình ảnh [${assetId}] vào Canvas!`);
            }
        } catch (e) {
            alert("Lỗi nạp asset: " + e.message);
        }
    }

    async exportAssetFromLibrary(category, assetId) {
        try {
            const res = await fetch('http://localhost:8765/api/library/export_to_godot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, asset_id: assetId })
            });
            const data = await res.json();
            if (data.success) {
                alert(`🎉 ĐÃ XUẤT ASSET [${assetId}] VÀO GODOT 2D THÀNH CÔNG!\nThư mục: ${data.target_path}`);
            }
        } catch (e) {
            alert("Lỗi xuất asset: " + e.message);
        }
    }

    getCanvasCoords(e) {
        const rect = this.wrapper.getBoundingClientRect();
        const scaleX = this.canvasSize / rect.width;
        const scaleY = this.canvasSize / rect.height;
        return {
            x: Math.floor((e.clientX - rect.left) * scaleX),
            y: Math.floor((e.clientY - rect.top) * scaleY)
        };
    }

    onMouseDown(e) {
        const coords = this.getCanvasCoords(e);
        this.isDrawing = true;
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.boxStartX = coords.x;
        this.boxStartY = coords.y;

        if (this.currentTool !== 'picker') {
            this.pushUndoState();
        }

        if (this.currentTool === 'hitbox_box' || this.currentTool === 'hurtbox_box') {
            return;
        } else if (this.currentTool === 'bucket') {
            this.floodFill(coords.x, coords.y, this.primaryColor);
        } else if (this.currentTool === 'picker') {
            this.pickColor(coords.x, coords.y);
        } else {
            this.drawStroke(coords.x, coords.y, coords.x, coords.y);
        }
    }

    onMouseMove(e) {
        const coords = this.getCanvasCoords(e);
        if (coords.x >= 0 && coords.x < this.canvasSize && coords.y >= 0 && coords.y < this.canvasSize) {
            this.hudCursor.innerText = `X: ${coords.x}, Y: ${coords.y}`;
        }

        if (!this.isDrawing) return;

        if (this.currentTool === 'hitbox_box' || this.currentTool === 'hurtbox_box') {
            this.drawLiveBox(this.boxStartX, this.boxStartY, coords.x, coords.y);
            this.lastX = coords.x;
            this.lastY = coords.y;
            return;
        }

        this.drawStroke(this.lastX, this.lastY, coords.x, coords.y);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    onMouseUp() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        const clip = this.clips[this.currentClipName];
        const frameData = clip.frames[this.activeFrameIndex];

        if (this.currentTool === 'hitbox_box' || this.currentTool === 'hurtbox_box') {
            const bx = Math.min(this.boxStartX, this.lastX);
            const by = Math.min(this.boxStartY, this.lastY);
            const bw = Math.abs(this.lastX - this.boxStartX);
            const bh = Math.abs(this.lastY - this.boxStartY);
            if (bw > 4 && bh > 4) {
                if (this.currentTool === 'hitbox_box') {
                    frameData.hitbox = { x: bx, y: by, w: bw, h: bh };
                } else {
                    frameData.hurtbox = { x: bx, y: by, w: bw, h: bh };
                }
            }
            this.drawHitboxOverlay();
        }

        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    drawStroke(x0, y0, x1, y1) {
        if (this.currentTool === 'inpaint') {
            this.maskCtx.strokeStyle = '#ff007f';
            this.maskCtx.lineWidth = this.brushSize * 2;
            this.maskCtx.lineCap = 'round';
            this.maskCtx.beginPath();
            this.maskCtx.moveTo(x0, y0);
            this.maskCtx.lineTo(x1, y1);
            this.maskCtx.stroke();
            return;
        }

        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d');

        if (this.currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = this.primaryColor;
        }

        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    drawLiveBox(x0, y0, x1, y1) {
        this.hitboxCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.drawHitboxOverlay();
        this.hitboxCtx.strokeStyle = (this.currentTool === 'hitbox_box') ? '#ff3344' : '#00e676';
        this.hitboxCtx.lineWidth = 2;
        this.hitboxCtx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
    }

    drawHitboxOverlay() {
        this.hitboxCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        const clip = this.clips[this.currentClipName];
        if (!clip || !clip.frames[this.activeFrameIndex]) return;
        const f = clip.frames[this.activeFrameIndex];

        if (f.hurtbox) {
            this.hitboxCtx.strokeStyle = '#00e676';
            this.hitboxCtx.fillStyle = 'rgba(0, 230, 118, 0.15)';
            this.hitboxCtx.lineWidth = 2;
            this.hitboxCtx.fillRect(f.hurtbox.x, f.hurtbox.y, f.hurtbox.w, f.hurtbox.h);
            this.hitboxCtx.strokeRect(f.hurtbox.x, f.hurtbox.y, f.hurtbox.w, f.hurtbox.h);
        }

        if (f.hitbox) {
            this.hitboxCtx.strokeStyle = '#ff3344';
            this.hitboxCtx.fillStyle = 'rgba(255, 51, 68, 0.2)';
            this.hitboxCtx.lineWidth = 2;
            this.hitboxCtx.fillRect(f.hitbox.x, f.hitbox.y, f.hitbox.w, f.hitbox.h);
            this.hitboxCtx.strokeRect(f.hitbox.x, f.hitbox.y, f.hitbox.w, f.hitbox.h);
        }
    }

    updateOnionSkin() {
        this.onionCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        if (!this.onionSkinEnabled) return;

        const clip = this.clips[this.currentClipName];
        if (this.activeFrameIndex > 0) {
            const prevFrame = clip.frames[this.activeFrameIndex - 1];
            this.onionCtx.globalAlpha = 0.4;
            this.onionCtx.drawImage(prevFrame.canvas, 0, 0);
        }
    }

    drawGrid() {
        this.gridCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        if (!this.showGrid) return;
        this.gridCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        this.gridCtx.lineWidth = 1;

        for (let x = 0; x <= this.canvasSize; x += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.canvasSize);
            this.gridCtx.stroke();
        }
        for (let y = 0; y <= this.canvasSize; y += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.canvasSize, y);
            this.gridCtx.stroke();
        }
    }

    // TIMELINE MANAGEMENT
    renderTimeline() {
        this.filmstripContainer.innerHTML = '';
        const clip = this.clips[this.currentClipName];
        if (!clip) return;

        clip.frames.forEach((f, idx) => {
            const card = document.createElement('div');
            card.className = `frame-card ${idx === this.activeFrameIndex ? 'active' : ''}`;
            
            const thumb = document.createElement('canvas');
            thumb.className = 'frame-card-canvas';
            thumb.width = 42;
            thumb.height = 42;
            const tctx = thumb.getContext('2d');
            tctx.drawImage(f.canvas, 0, 0, this.canvasSize, this.canvasSize, 0, 0, 42, 42);

            const label = document.createElement('span');
            label.className = 'frame-card-idx';
            label.innerText = `${idx + 1}`;

            card.appendChild(thumb);
            card.appendChild(label);
            card.addEventListener('click', () => {
                this.saveCurrentFrameCanvas();
                this.activeFrameIndex = idx;
                this.loadCurrentFrame();
            });

            this.filmstripContainer.appendChild(card);
        });
    }

    addEmptyFrame() {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        clip.frames.push({ canvas: c, hitbox: null, hurtbox: { x: 96, y: 64, w: 64, h: 128 } });
        this.activeFrameIndex = clip.frames.length - 1;
        this.loadCurrentFrame();
    }

    duplicateCurrentFrame() {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const cur = clip.frames[this.activeFrameIndex];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        const ctx = c.getContext('2d');
        ctx.drawImage(cur.canvas, 0, 0);

        clip.frames.splice(this.activeFrameIndex + 1, 0, {
            canvas: c,
            hitbox: cur.hitbox ? { ...cur.hitbox } : null,
            hurtbox: cur.hurtbox ? { ...cur.hurtbox } : null
        });
        this.activeFrameIndex += 1;
        this.loadCurrentFrame();
    }

    flipHorizontal() {
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d');
        const temp = document.createElement('canvas');
        temp.width = this.canvasSize;
        temp.height = this.canvasSize;
        const tctx = temp.getContext('2d');
        tctx.drawImage(baseLayer, 0, 0);

        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        ctx.save();
        ctx.translate(this.canvasSize, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(temp, 0, 0);
        ctx.restore();

        this.saveCurrentFrameCanvas();
        this.renderTimeline();
    }

    deleteCurrentFrame() {
        const clip = this.clips[this.currentClipName];
        if (clip.frames.length <= 1) return;
        clip.frames.splice(this.activeFrameIndex, 1);
        this.activeFrameIndex = Math.max(0, this.activeFrameIndex - 1);
        this.loadCurrentFrame();
    }

    startPreviewLoop() {
        if (this.previewTimer) clearInterval(this.previewTimer);
        const clip = this.clips[this.currentClipName];
        const fps = clip ? clip.fps : 10;

        this.previewTimer = setInterval(() => {
            if (!this.isPlaying) return;
            const curClip = this.clips[this.currentClipName];
            if (!curClip || curClip.frames.length === 0) return;

            this.previewFrameIdx = (this.previewFrameIdx + 1) % curClip.frames.length;
            const f = curClip.frames[this.previewFrameIdx];
            if (f) {
                this.animCtx.clearRect(0, 0, 128, 128);
                this.animCtx.drawImage(f.canvas, 0, 0, this.canvasSize, this.canvasSize, 0, 0, 128, 128);
            }
        }, 1000 / fps);
    }

    // WEBSOCKET & REST API
    initWebSocket() {
        try {
            this.ws = new WebSocket('ws://localhost:8765/ws');
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'APPLY_FRAME') {
                    this.applyRemoteFrame(msg.imageData);
                } else if (msg.type === 'ADD_FRAME') {
                    this.addRemoteFrame(msg.imageData);
                } else if (msg.type === 'LOAD_CLIP_SET') {
                    this.loadFullClipSet(msg.clips);
                }
            };
        } catch (e) {
            console.log("WebSocket:", e);
        }
    }

    applyRemoteFrame(base64Data) {
        const img = new Image();
        img.onload = () => {
            const baseLayer = document.getElementById('layer0');
            const ctx = baseLayer.getContext('2d');
            ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            ctx.drawImage(img, 0, 0, this.canvasSize, this.canvasSize);
            this.saveCurrentFrameCanvas();
            this.maskCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.renderTimeline();
        };
        img.src = base64Data;
    }

    addRemoteFrame(base64Data) {
        this.saveCurrentFrameCanvas();
        const clip = this.clips[this.currentClipName];
        const c = document.createElement('canvas');
        c.width = this.canvasSize;
        c.height = this.canvasSize;
        const ctx = c.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
            this.activeFrameIndex = clip.frames.length - 1;
            this.loadCurrentFrame();
            this.showToast(`✨ Đã thêm Frame mới (Tổng: ${clip.frames.length} frames)!`);
        };
        img.src = base64Data;
    }

    async sendAICommand() {
        const promptInput = document.getElementById('aiPromptInput');
        const prompt = promptInput.value.trim();
        if (!prompt) {
            this.showToast("⚠️ Vui lòng nhập lệnh cho AI trước khi gửi!");
            return;
        }

        const btn = document.getElementById('btnSendAICommand');
        btn.innerText = "⏳ AI Đang Xử Lý...";
        btn.disabled = true;

        const baseLayer = document.getElementById('layer0');
        try {
            const res = await fetch('http://localhost:8765/api/ai/inpaint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    image: baseLayer.toDataURL(),
                    mask: this.maskCanvas.toDataURL()
                })
            });
            const data = await res.json();
            if (data.type === 'ADD_FRAME') {
                this.addRemoteFrame(data.image);
            } else if (data.image) {
                this.pushUndoState();
                this.applyRemoteFrame(data.image);
                this.showToast("✨ AI đã xử lý yêu cầu thành công!");
            } else if (data.error) {
                this.showToast("⚠️ " + data.error);
            }
        } catch (e) {
            this.showToast("⚠️ Lỗi AI: " + e.message);
        } finally {
            btn.innerText = "✨ Gửi Lệnh Cho AI Thực Hiện";
            btn.disabled = false;
        }
    }

    async executeQuickAction(actionType) {
        const baseLayer = document.getElementById('layer0');
        try {
            const res = await fetch(`http://localhost:8765/api/ai/quick_action?action=${actionType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: baseLayer.toDataURL() })
            });
            const data = await res.json();
            if (data.image) {
                this.pushUndoState();
                this.applyRemoteFrame(data.image);
                this.showToast("✨ Đã áp dụng hành động nhanh!");
            } else if (data.clips) {
                this.loadFullClipSet(data.clips);
                this.showToast("✨ Đã tải trọn bộ Animation mới!");
            }
        } catch (e) {
            this.showToast("⚠️ Lỗi: " + e.message);
        }
    }

    loadFullClipSet(clipData) {
        for (const k in clipData) {
            if (this.clips[k]) {
                this.clips[k].frames = [];
                clipData[k].forEach(b64 => {
                    const c = document.createElement('canvas');
                    c.width = this.canvasSize;
                    c.height = this.canvasSize;
                    const ctx = c.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, this.canvasSize, this.canvasSize);
                        this.renderTimeline();
                    };
                    img.src = b64;
                    this.clips[k].frames.push({ canvas: c, hitbox: null, hurtbox: { x: 96, y: 64, w: 64, h: 128 } });
                });
            }
        }
        this.loadCurrentFrame();
    }

    async syncAllClipsToGodot() {
        this.saveCurrentFrameCanvas();
        const exportData = {};
        for (const k in this.clips) {
            exportData[k] = this.clips[k].frames.map(f => f.canvas.toDataURL());
        }

        const res = await fetch('http://localhost:8765/api/godot/sync_full_character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                character_name: "Hero_Knight_2D",
                clips: exportData
            })
        });
        const data = await res.json();
        if (data.success) {
            alert("🎉 ĐÃ XUẤT TRỌN BỘ NHÂN VẬT VÀO GODOT 2D THÀNH CÔNG!\nSpriteFrames và Scene đã sẵn sàng.");
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new StudioApp();
});
