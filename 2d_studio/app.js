// 2D ASSET STUDIO & AI CO-PILOT CLIENT LOGIC

class StudioApp {
    constructor() {
        this.canvasWidth = 512;
        this.canvasHeight = 512;
        this.layers = [];
        this.activeLayerIndex = 0;
        this.currentTool = 'pen';
        this.primaryColor = '#00f0ff';
        this.brushSize = 4;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.showGrid = true;
        this.gridSize = 64;
        
        // Animation
        this.animFrames = [];
        this.animCurrentFrame = 0;
        this.animFps = 12;
        this.animIsPlaying = true;
        this.animTimer = null;
        
        // History for Undo
        this.history = [];
        
        // WebSocket connection to MCP Server
        this.ws = null;

        this.initDOM();
        this.initLayers();
        this.initEventListeners();
        this.initWebSocket();
        this.startAnimLoop();
        this.drawGrid();
    }

    initDOM() {
        this.wrapper = document.getElementById('canvasWrapper');
        this.gridCanvas = document.getElementById('gridCanvas');
        this.gridCtx = this.gridCanvas.getContext('2d');
        this.maskCanvas = document.getElementById('maskLayer');
        this.maskCtx = this.maskCanvas.getContext('2d');
        this.animCanvas = document.getElementById('animPreviewCanvas');
        this.animCtx = this.animCanvas.getContext('2d');
        
        this.hudCursor = document.getElementById('hudCursorPos');
        this.brushSizeVal = document.getElementById('brushSizeVal');
        this.primaryColorInput = document.getElementById('primaryColor');
        this.colorPickerWrapper = document.getElementById('colorPickerWrapper');
        this.layersListContainer = document.getElementById('layersList');
    }

    initLayers() {
        const baseLayer = document.getElementById('layer0');
        const ctx = baseLayer.getContext('2d', { willReadFrequently: true });
        this.layers = [{
            name: "Layer 1 (Gốc)",
            canvas: baseLayer,
            ctx: ctx,
            visible: true
        }];
        this.activeLayerIndex = 0;
        this.saveHistory();
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

        const sizeSlider = document.getElementById('brushSize');
        sizeSlider.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            this.brushSizeVal.innerText = `${this.brushSize}px`;
        });

        // Canvas Mouse Events
        this.wrapper.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());

        // Grid Toggle
        document.getElementById('btnToggleGrid').addEventListener('click', () => {
            this.showGrid = !this.showGrid;
            this.drawGrid();
        });

        // Undo
        document.getElementById('btnUndo').addEventListener('click', () => this.undo());

        // Add Layer
        document.getElementById('btnAddLayer').addEventListener('click', () => this.addLayer());

        // Import Image File
        const fileIn = document.getElementById('fileInput');
        document.getElementById('btnImportImg').addEventListener('click', () => fileIn.click());
        fileIn.addEventListener('change', (e) => this.importImage(e.target.files[0]));

        // Sync to Godot
        document.getElementById('btnSyncGodot').addEventListener('click', () => this.syncToGodot());

        // AI Prompt Send
        document.getElementById('btnSendAICommand').addEventListener('click', () => this.sendAICommand());

        // Quick AI Action Chips
        document.getElementById('chipRemoveBg').addEventListener('click', () => this.executeQuickAction('remove_bg'));
        document.getElementById('chipSlashFx').addEventListener('click', () => this.executeQuickAction('slash_fx'));
        document.getElementById('chipRunFrames').addEventListener('click', () => this.executeQuickAction('run_frames'));
        document.getElementById('chipHitSpark').addEventListener('click', () => this.executeQuickAction('hit_spark'));
        document.getElementById('chipKnightHero').addEventListener('click', () => this.executeQuickAction('knight_hero'));
        document.getElementById('chipBossTitan').addEventListener('click', () => this.executeQuickAction('boss_titan'));

        // Animation Controls
        const fpsSlider = document.getElementById('animFpsSlider');
        const fpsLabel = document.getElementById('animFpsLabel');
        fpsSlider.addEventListener('input', (e) => {
            this.animFps = parseInt(e.target.value);
            fpsLabel.innerText = `${this.animFps} FPS`;
            this.startAnimLoop();
        });

        document.getElementById('btnAnimPlayPause').addEventListener('click', (e) => {
            this.animIsPlaying = !this.animIsPlaying;
            e.target.innerText = this.animIsPlaying ? "⏸ Dừng" : "▶ Phát";
        });
    }

    getCanvasCoords(e) {
        const rect = this.wrapper.getBoundingClientRect();
        const scaleX = this.canvasWidth / rect.width;
        const scaleY = this.canvasHeight / rect.height;
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

        if (this.currentTool === 'bucket') {
            this.floodFill(coords.x, coords.y, this.primaryColor);
            this.saveHistory();
            this.updateAnimFrames();
        } else if (this.currentTool === 'picker') {
            this.pickColor(coords.x, coords.y);
        } else {
            this.drawStroke(coords.x, coords.y, coords.x, coords.y);
        }
    }

    onMouseMove(e) {
        const coords = this.getCanvasCoords(e);
        if (coords.x >= 0 && coords.x < this.canvasWidth && coords.y >= 0 && coords.y < this.canvasHeight) {
            this.hudCursor.innerText = `X: ${coords.x}, Y: ${coords.y}`;
        }

        if (!this.isDrawing) return;

        this.drawStroke(this.lastX, this.lastY, coords.x, coords.y);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    onMouseUp() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.saveHistory();
            this.updateAnimFrames();
            this.notifyServerCanvasUpdated();
        }
    }

    drawStroke(x0, y0, x1, y1) {
        if (this.currentTool === 'inpaint') {
            // Paint on Mask Layer
            this.maskCtx.strokeStyle = '#ff007f';
            this.maskCtx.lineWidth = this.brushSize * 2;
            this.maskCtx.lineCap = 'round';
            this.maskCtx.lineJoin = 'round';
            this.maskCtx.beginPath();
            this.maskCtx.moveTo(x0, y0);
            this.maskCtx.lineTo(x1, y1);
            this.maskCtx.stroke();
            return;
        }

        const active = this.layers[this.activeLayerIndex];
        if (!active || !active.visible) return;

        const ctx = active.ctx;
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

    drawGrid() {
        this.gridCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (!this.showGrid) return;

        this.gridCtx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
        this.gridCtx.lineWidth = 1;

        for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.canvasHeight);
            this.gridCtx.stroke();
        }

        for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.canvasWidth, y);
            this.gridCtx.stroke();
        }
    }

    floodFill(startX, startY, fillHex) {
        const active = this.layers[this.activeLayerIndex];
        if (!active) return;
        const ctx = active.ctx;
        const imgData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imgData.data;

        const startPos = (startY * this.canvasWidth + startX) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];
        const startA = data[startPos + 3];

        const fillColor = this.hexToRgba(fillHex);
        if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b && startA === fillColor.a) {
            return;
        }

        const pixelStack = [[startX, startY]];
        while (pixelStack.length > 0) {
            const [x, y] = pixelStack.pop();
            if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) continue;

            const pos = (y * this.canvasWidth + x) * 4;
            if (data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB && data[pos + 3] === startA) {
                data[pos] = fillColor.r;
                data[pos + 1] = fillColor.g;
                data[pos + 2] = fillColor.b;
                data[pos + 3] = fillColor.a;

                pixelStack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    pickColor(x, y) {
        const active = this.layers[this.activeLayerIndex];
        if (!active) return;
        const p = active.ctx.getImageData(x, y, 1, 1).data;
        const hex = "#" + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1);
        this.primaryColor = hex;
        this.primaryColorInput.value = hex;
        this.colorPickerWrapper.style.backgroundColor = hex;
    }

    hexToRgba(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: 255
        } : { r: 0, g: 0, b: 0, a: 255 };
    }

    addLayer() {
        const idx = this.layers.length;
        const canvas = document.createElement('canvas');
        canvas.id = `layer${idx}`;
        canvas.className = 'canvas-layer';
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.wrapper.insertBefore(canvas, this.maskCanvas);

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.layers.push({
            name: `Layer ${idx + 1}`,
            canvas: canvas,
            ctx: ctx,
            visible: true
        });
        this.activeLayerIndex = idx;
        this.renderLayersUI();
    }

    renderLayersUI() {
        this.layersListContainer.innerHTML = '';
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const l = this.layers[i];
            const div = document.createElement('div');
            div.className = `layer-item ${i === this.activeLayerIndex ? 'active' : ''}`;
            div.innerHTML = `
                <span>${l.visible ? '👁️' : '🙈'} ${l.name}</span>
                <div class="layer-actions">
                    <span class="btn-del-layer" title="Xóa">🗑️</span>
                </div>
            `;
            div.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-del-layer')) {
                    if (this.layers.length > 1) {
                        l.canvas.remove();
                        this.layers.splice(i, 1);
                        this.activeLayerIndex = Math.max(0, this.layers.length - 1);
                        this.renderLayersUI();
                    }
                    return;
                }
                this.activeLayerIndex = i;
                this.renderLayersUI();
            });
            this.layersListContainer.appendChild(div);
        }
    }

    saveHistory() {
        const composite = this.getCompositeCanvas();
        this.history.push(composite.toDataURL());
        if (this.history.length > 20) this.history.shift();
    }

    undo() {
        if (this.history.length > 1) {
            this.history.pop();
            const prev = this.history[this.history.length - 1];
            const img = new Image();
            img.onload = () => {
                const active = this.layers[this.activeLayerIndex];
                if (active) {
                    active.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    active.ctx.drawImage(img, 0, 0);
                    this.updateAnimFrames();
                }
            };
            img.src = prev;
        }
    }

    getCompositeCanvas() {
        const c = document.createElement('canvas');
        c.width = this.canvasWidth;
        c.height = this.canvasHeight;
        const ctx = c.getContext('2d');
        for (const l of this.layers) {
            if (l.visible) {
                ctx.drawImage(l.canvas, 0, 0);
            }
        }
        return c;
    }

    importImage(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const active = this.layers[this.activeLayerIndex];
                if (active) {
                    active.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    active.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
                    this.saveHistory();
                    this.updateAnimFrames();
                    this.notifyServerCanvasUpdated();
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ANIMATION SLICER & PREVIEW
    updateAnimFrames() {
        const comp = this.getCompositeCanvas();
        this.animFrames = [];
        const frameSize = 128;
        const cols = this.canvasWidth / frameSize;
        const rows = this.canvasHeight / frameSize;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const fc = document.createElement('canvas');
                fc.width = frameSize;
                fc.height = frameSize;
                const fctx = fc.getContext('2d');
                fctx.drawImage(comp, c * frameSize, r * frameSize, frameSize, frameSize, 0, 0, frameSize, frameSize);
                
                // Kiểm tra frame có chứa pixel không
                const p = fctx.getImageData(0, 0, frameSize, frameSize).data;
                let hasPixel = false;
                for (let i = 3; i < p.length; i += 4) {
                    if (p[i] > 10) { hasPixel = true; break; }
                }
                if (hasPixel) {
                    this.animFrames.push(fc);
                }
            }
        }
    }

    startAnimLoop() {
        if (this.animTimer) clearInterval(this.animTimer);
        this.animTimer = setInterval(() => {
            if (!this.animIsPlaying || this.animFrames.length === 0) return;
            this.animCurrentFrame = (this.animCurrentFrame + 1) % this.animFrames.length;
            const f = this.animFrames[this.animCurrentFrame];
            if (f) {
                this.animCtx.clearRect(0, 0, 128, 128);
                this.animCtx.drawImage(f, 0, 0);
            }
        }, 1000 / this.animFps);
    }

    // WEBSOCKET & REST API
    initWebSocket() {
        try {
            this.ws = new WebSocket('ws://localhost:8765/ws');
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'APPLY_IMAGE') {
                    this.applyRemoteImage(msg.imageData);
                } else if (msg.type === 'ADD_STROKE') {
                    this.drawRemoteStroke(msg);
                }
            };
        } catch (e) {
            console.log("WebSocket chưa kết nối:", e);
        }
    }

    applyRemoteImage(base64Data) {
        const img = new Image();
        img.onload = () => {
            const active = this.layers[this.activeLayerIndex];
            if (active) {
                active.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                active.ctx.drawImage(img, 0, 0);
                this.maskCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.saveHistory();
                this.updateAnimFrames();
            }
        };
        img.src = base64Data;
    }

    notifyServerCanvasUpdated() {
        const comp = this.getCompositeCanvas();
        fetch('http://localhost:8765/api/canvas/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: comp.toDataURL(),
                mask: this.maskCanvas.toDataURL()
            })
        }).catch(err => console.log("Lỗi sync server:", err));
    }

    async sendAICommand() {
        const prompt = document.getElementById('aiPromptInput').value.trim();
        if (!prompt) return;

        const btn = document.getElementById('btnSendAICommand');
        btn.innerText = "⏳ Đang Xử Lý...";
        btn.disabled = true;

        const comp = this.getCompositeCanvas();
        try {
            const res = await fetch('http://localhost:8765/api/ai/inpaint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    image: comp.toDataURL(),
                    mask: this.maskCanvas.toDataURL()
                })
            });
            const data = await res.json();
            if (data.image) {
                this.applyRemoteImage(data.image);
            }
        } catch (e) {
            alert("Lỗi gọi AI: " + e.message);
        } finally {
            btn.innerText = "✨ Gửi Lệnh Cho AI Co-Pilot";
            btn.disabled = false;
        }
    }

    async executeQuickAction(actionType) {
        const comp = this.getCompositeCanvas();
        const res = await fetch(`http://localhost:8765/api/ai/quick_action?action=${actionType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: comp.toDataURL() })
        });
        const data = await res.json();
        if (data.image) {
            this.applyRemoteImage(data.image);
        }
    }

    async syncToGodot() {
        const comp = this.getCompositeCanvas();
        const res = await fetch('http://localhost:8765/api/godot/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: comp.toDataURL(),
                name: "hero_brawler_2d",
                frame_width: 128,
                frame_height: 128
            })
        });
        const data = await res.json();
        if (data.success) {
            alert("🎉 Đã xuất thành công vào Godot 2D!\nĐường dẫn: " + data.saved_path);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new StudioApp();
});
