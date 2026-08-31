// =========================================================================
// GAME ASSET & ANIMATION PIPELINE STUDIO PRO - JAVASCRIPT CONTROLLER
// =========================================================================

class AssetStudioApp {
    constructor() {
        this.activeTab = 'tab-planner';

        // Games & Scenario State
        this.gamesList = [];
        this.activeGame = null;
        this.filterCat = 'all';
        this.filterFmt = 'all';

        // Video Processor State
        this.selectedVideoFile = null;
        this.videoFrameCount = 8;
        this.extractedFrames = [];
        this.videoAnimInterval = null;
        this.videoAnimIdx = 0;
        this.videoFps = 10;

        // Slicer State
        this.slicerImg = null;
        this.slicerScale = 1.0;
        this.sliceBoxes = [];
        this.selectedBoxIndex = 0;
        this.selectedBoxIndices = new Set([0]);
        this.slicedCanvases = [];
        this.slicerAnimInterval = null;
        this.slicerAnimIdx = 0;
        this.slicerFps = 10;
        this.sliceMode = 'grid';
        this.lockAspectRatio = false;
        this.isDraggingBox = false;
        this.isMovingSelectedBox = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        // Studio State
        this.canvasSize = 256;
        this.activeTool = 'pen';
        this.currentColor = '#00f0ff';
        this.isDrawing = false;
        this.currentClipName = 'attack';
        this.activeFrameIndex = 0;
        this.clips = {
            idle:   { frames: [], loop: true,  speed: 6  },
            walk:   { frames: [], loop: true,  speed: 8  },
            run:    { frames: [], loop: true,  speed: 10 },
            jump:   { frames: [], loop: false, speed: 8  },
            fall:   { frames: [], loop: false, speed: 6  },
            attack: { frames: [], loop: false, speed: 10 },
            hurt:   { frames: [], loop: false, speed: 6  },
            death:  { frames: [], loop: false, speed: 6  }
        };
        this.animPlaying = true;
        this.animInterval = null;
        this.animFrameIdx = 0;
        this.animFps = 10;

        this.init();
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    init() {
        this.initNavigation();
        this.initWebSocket();
        this.initGamePlanner();
        this.initVideoProcessor();
        this.initSlicer();
        this.initStudio();
        this.initLibrary();

        this.loadGamesFromServer();
    }

    initNavigation() {
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                this.switchTab(target);
            });
        });

        document.getElementById('btnTopSyncGodot')?.addEventListener('click', () => this.exportStudioToGodot());

        // Guide Modal Events
        const guideModal = document.getElementById('guideModal');
        const openGuide = () => { if (guideModal) guideModal.style.display = 'flex'; };
        const closeGuide = () => { if (guideModal) guideModal.style.display = 'none'; };

        document.getElementById('btnOpenGuideModal')?.addEventListener('click', openGuide);
        document.getElementById('btnQuickOpenGuide')?.addEventListener('click', openGuide);
        document.getElementById('btnCloseGuideModal')?.addEventListener('click', closeGuide);
        document.getElementById('btnCloseGuideModalFooter')?.addEventListener('click', closeGuide);

        // Guide Sub-Tabs Switcher
        document.querySelectorAll('.guide-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-guide-tab');
                document.querySelectorAll('.guide-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
                document.querySelectorAll('.guide-tab-content').forEach(c => c.classList.toggle('active', c.id === target));
            });
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        document.querySelectorAll('.nav-tab-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
        });
        document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.id === tabId);
        });

        if (tabId === 'tab-library') this.loadLibraryAssets();
        if (tabId === 'tab-studio') this.renderStudio();
    }

    initWebSocket() {
        const wsUrl = `ws://${window.location.host}/ws`;
        let ws;
        const connect = () => {
            ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                const stat = document.getElementById('wsStatusText');
                if (stat) stat.innerText = "AI CO-PILOT: KẾT NỐI";
            };
            ws.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.type === 'GAME_CREATED_OR_UPDATED' || data.type === 'GAMES_LIST_UPDATED' || data.type === 'ASSET_ADDED_TO_GAME' || data.type === 'GAME_ASSET_DELETED' || data.type === 'ACTIVE_GAME_CHANGED') {
                        this.loadGamesFromServer();
                        this.showToast("✨ Dữ liệu game đã được đồng bộ với AI!");
                    }
                } catch(err) {}
            };
            ws.onclose = () => {
                const stat = document.getElementById('wsStatusText');
                if (stat) stat.innerText = "AI CO-PILOT: MẤT KẾT NỐI";
                setTimeout(connect, 2500);
            };
        };
        connect();
    }

    showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        container.appendChild(t);
        setTimeout(() => { t.remove(); }, 3500);
    }

    // =========================================================================
    // 1. GAME PROJECTS & ASSET PLANNER MODULE
    // =========================================================================
    initGamePlanner() {
        // Game Selector Change
        document.getElementById('gameProjectSelect')?.addEventListener('change', async (e) => {
            const gameId = e.target.value;
            if (!gameId) return;
            const formData = new FormData();
            formData.append('game_id', gameId);
            await fetch('/api/games/set_active', { method: 'POST', body: formData });
            this.loadGamesFromServer();
        });

        // Toggle Story Body
        document.getElementById('btnToggleStoryBody')?.addEventListener('click', () => {
            const body = document.getElementById('storyPanelBody');
            const btn = document.getElementById('btnToggleStoryBody');
            if (body.style.display === 'none') {
                body.style.display = 'flex';
                btn.innerText = 'Thu gọn ▲';
            } else {
                body.style.display = 'none';
                btn.innerText = 'Mở rộng ▼';
            }
        });

        // Category Filters
        document.querySelectorAll('[data-filter-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter-cat]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterCat = btn.getAttribute('data-filter-cat');
                this.renderActiveGameAssets();
            });
        });

        // Format Filters
        document.querySelectorAll('[data-filter-fmt]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter-fmt]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterFmt = btn.getAttribute('data-filter-fmt');
                this.renderActiveGameAssets();
            });
        });

        // New Game Modal triggers
        const gameModal = document.getElementById('newGameModal');
        document.getElementById('btnOpenNewGameModal')?.addEventListener('click', () => { gameModal.style.display = 'flex'; });
        document.getElementById('btnCloseGameModal')?.addEventListener('click', () => { gameModal.style.display = 'none'; });
        document.getElementById('btnCancelGameModal')?.addEventListener('click', () => { gameModal.style.display = 'none'; });
        document.getElementById('btnAnalyzeAndCreateGame')?.addEventListener('click', () => this.analyzeAndCreateGameFromModal());

        // Delete Game
        document.getElementById('btnDeleteCurrentGame')?.addEventListener('click', () => this.deleteCurrentGame());

        // Add Asset to Game Modal triggers
        const planModal = document.getElementById('newPlanModal');
        document.getElementById('btnOpenNewPlanModal')?.addEventListener('click', () => { planModal.style.display = 'flex'; });
        document.getElementById('btnClosePlanModal')?.addEventListener('click', () => { planModal.style.display = 'none'; });
        document.getElementById('btnCancelPlanModal')?.addEventListener('click', () => { planModal.style.display = 'none'; });
        document.getElementById('btnSaveNewPlan')?.addEventListener('click', () => this.saveNewAssetToActiveGame());
    }

    async loadGamesFromServer() {
        try {
            const res = await fetch('/api/games/list');
            const data = await res.json();
            this.gamesList = data.games || [];
            const activeId = data.active_game_id || (this.gamesList.length ? this.gamesList[0].id : '');

            // Populate Game Dropdown
            const select = document.getElementById('gameProjectSelect');
            if (select) {
                select.innerHTML = '';
                this.gamesList.forEach(g => {
                    const opt = document.createElement('option');
                    opt.value = g.id;
                    opt.innerText = `🎮 ${g.title} (${(g.assets || []).length} assets)`;
                    if (g.id === activeId) opt.selected = true;
                    select.appendChild(opt);
                });
            }

            this.activeGame = this.gamesList.find(g => g.id === activeId) || this.gamesList[0] || null;
            this.renderActiveGameStory();
            this.renderActiveGameAssets();
        } catch(e) {
            console.error("Error loading games:", e);
        }
    }

    renderActiveGameStory() {
        if (!this.activeGame) return;
        const g = this.activeGame;

        document.getElementById('gameGenreTag').innerText = g.genre || '2D Action';
        document.getElementById('gameStyleTag').innerText = g.art_style || '16-Bit Pixel';
        document.getElementById('gameAssetCountTag').innerText = `${(g.assets || []).length} Asset`;

        const story = g.full_story || {};
        document.getElementById('storySynopsisText').innerText = story.synopsis || g.raw_input_story || 'Chưa có tóm tắt.';
        document.getElementById('storyProtagonistText').innerText = story.protagonist || '—';
        document.getElementById('storyAntagonistsText').innerText = story.antagonists || '—';
        document.getElementById('storyEnvironmentText').innerText = story.environment || '—';
        document.getElementById('storyGameplayText').innerText = story.gameplay_elements || '—';
    }

    renderActiveGameAssets() {
        const grid = document.getElementById('plannerCardsGrid');
        if (!grid) return;

        if (!this.activeGame || !this.activeGame.assets || !this.activeGame.assets.length) {
            grid.innerHTML = '<div class="empty-state">Dự án game này chưa có Asset nào. Bấm "➕ Thêm Asset Vào Game" hoặc tạo game mới để AI đề xuất!</div>';
            return;
        }

        let filtered = this.activeGame.assets;
        if (this.filterCat !== 'all') {
            filtered = filtered.filter(p => p.category === this.filterCat);
        }
        if (this.filterFmt !== 'all') {
            filtered = filtered.filter(p => p.format === this.filterFmt);
        }

        if (!filtered.length) {
            grid.innerHTML = '<div class="empty-state">Không có Asset nào phù hợp bộ lọc.</div>';
            return;
        }

        grid.innerHTML = '';
        filtered.forEach(p => {
            const isVideo = (p.format === 'video');
            const card = document.createElement('div');
            card.className = 'plan-card';

            const animsHtml = (p.animations || []).map(a => `<span class="anim-tag-pill">${a}</span>`).join('');
            const promptText = isVideo ? (p.prompt_video || p.prompt_image || '') : (p.prompt_image || p.prompt_video || '');

            card.innerHTML = `
                <div class="plan-card-header">
                    <div>
                        <div class="plan-card-title">${p.name}</div>
                        <span style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">${p.category}</span>
                    </div>
                    <span class="plan-format-badge ${isVideo ? 'badge-video' : 'badge-image'}">
                        ${isVideo ? '🎬 VIDEO AI (2-3s)' : '🖼️ ẢNH SHEET'}
                    </span>
                </div>
                <div class="plan-reason-box">
                    💡 <b>Lý do chọn:</b> ${p.format_reason || (isVideo ? 'Cần chuyển động liên tục mượt mà' : 'Hình ảnh tĩnh / icon rõ nét')}
                </div>
                <div style="font-size:10px; font-weight:700; color:var(--text-muted);">CÁC ANIMATION CẦN CÓ:</div>
                <div class="plan-anims-row">${animsHtml}</div>
                <div style="font-size:10px; font-weight:700; color:var(--text-muted);">PROMPT AI KHUYẾN NGHỊ:</div>
                <div class="plan-prompt-box">${promptText}</div>
                <div class="plan-card-footer">
                    <button class="btn btn-secondary btn-xs btn-copy-prompt">📋 Copy Prompt</button>
                    <button class="btn btn-primary btn-xs btn-use-plan">⚡ Dùng Trong Tool ➔</button>
                    <button class="btn btn-secondary btn-xs btn-delete-asset" title="Xóa Asset">🗑️</button>
                </div>
            `;

            card.querySelector('.btn-copy-prompt').addEventListener('click', () => {
                navigator.clipboard.writeText(promptText);
                this.showToast(`📋 Đã copy prompt: ${p.name}!`);
            });

            card.querySelector('.btn-use-plan').addEventListener('click', () => {
                if (isVideo) {
                    this.switchTab('tab-video');
                    this.showToast(`🎬 Đã chuyển sang Xử Lý Video cho: ${p.name}`);
                } else {
                    this.switchTab('tab-slicer');
                    this.showToast(`✂️ Đã chuyển sang Cắt Ảnh cho: ${p.name}`);
                }
            });

            card.querySelector('.btn-delete-asset').addEventListener('click', async () => {
                if (confirm(`Xóa Asset "${p.name}" khỏi game?`)) {
                    await fetch(`/api/games/${this.activeGame.id}/asset/${p.id}`, { method: 'DELETE' });
                    this.loadGamesFromServer();
                }
            });

            grid.appendChild(card);
        });
    }

    async analyzeAndCreateGameFromModal() {
        const title = document.getElementById('modalGameTitle').value.trim();
        if (!title) { this.showToast("⚠️ Nhập tên game!"); return; }

        const genre = document.getElementById('modalGameGenre').value;
        const art_style = document.getElementById('modalGameArtStyle').value;
        const raw_story = document.getElementById('modalGameRawStory').value.trim();

        const btn = document.getElementById('btnAnalyzeAndCreateGame');
        btn.innerText = "⏳ AI Đang Phân Tích Cốt Truyện & Lập Kế Hoạch Asset...";
        btn.disabled = true;

        try {
            const res = await fetch('/api/games/analyze_and_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, genre, art_style, raw_story })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                document.getElementById('newGameModal').style.display = 'none';
                this.showToast(`🎮 Đã tạo dự án game "${title}" với ${data.game.assets.length} Asset được lập plan sẵn!`);
                this.loadGamesFromServer();
            }
        } catch(e) {
            this.showToast("⚠️ Lỗi tạo game: " + e.message);
        } finally {
            btn.innerText = "🪄 AI Phân Tích Cốt Truyện & Tạo Toàn Bộ Asset Plan ➔";
            btn.disabled = false;
        }
    }

    async saveNewAssetToActiveGame() {
        if (!this.activeGame) { this.showToast("⚠️ Chưa chọn game!"); return; }

        const name = document.getElementById('modalPlanName').value.trim();
        if (!name) { this.showToast("⚠️ Nhập tên asset!"); return; }

        const category = document.getElementById('modalPlanCategory').value;
        const format = document.getElementById('modalPlanFormat').value;
        const format_reason = document.getElementById('modalPlanReason').value.trim();
        const prompt_video = document.getElementById('modalPlanPromptVideo').value.trim();
        const prompt_image = document.getElementById('modalPlanPromptImage').value.trim();

        const planObj = {
            name, category, format, format_reason,
            prompt_video, prompt_image,
            priority: 'Cao', status: 'pending',
            animations: ['idle', 'run', 'attack', 'hurt', 'death']
        };

        const formData = new FormData();
        formData.append('game_id', this.activeGame.id);
        formData.append('plan_json', JSON.stringify(planObj));

        try {
            await fetch('/api/games/add_asset', { method: 'POST', body: formData });
            document.getElementById('newPlanModal').style.display = 'none';
            this.showToast(`✨ Đã thêm Asset "${name}" vào game!`);
            this.loadGamesFromServer();
        } catch(e) {
            this.showToast("⚠️ Lỗi: " + e.message);
        }
    }

    async deleteCurrentGame() {
        if (!this.activeGame) return;
        if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ dự án Game "${this.activeGame.title}"?`)) {
            await fetch(`/api/games/${this.activeGame.id}`, { method: 'DELETE' });
            this.showToast("🗑️ Đã xóa dự án game.");
            this.loadGamesFromServer();
        }
    }

    // =========================================================================
    // 2. VIDEO FRAME PROCESSOR MODULE
    // =========================================================================
    initVideoProcessor() {
        const dropZone = document.getElementById('videoDropZone');
        const fileInput = document.getElementById('videoFileInput');
        const player = document.getElementById('sourceVideoPlayer');

        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-cyan)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border-highlight)'; });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--border-highlight)';
            if (e.dataTransfer.files.length) this.loadVideoFile(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) this.loadVideoFile(e.target.files[0]);
        });

        document.querySelectorAll('.btn-toggle[data-frames]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-toggle[data-frames]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.videoFrameCount = parseInt(btn.getAttribute('data-frames'));
            });
        });

        document.getElementById('bgToleranceSlider')?.addEventListener('input', (e) => {
            document.getElementById('bgToleranceVal').innerText = e.target.value;
        });

        document.getElementById('btnExtractVideoFrames')?.addEventListener('click', () => this.extractFramesFromVideo());
        document.getElementById('btnSendExtractedToStudio')?.addEventListener('click', () => this.sendExtractedVideoToStudio());

        document.getElementById('videoFpsSlider')?.addEventListener('input', (e) => {
            this.videoFps = parseInt(e.target.value);
            document.getElementById('videoFpsVal').innerText = `${this.videoFps} FPS`;
            this.startVideoAnimationPreview();
        });
    }

    loadVideoFile(file) {
        this.selectedVideoFile = file;
        const player = document.getElementById('sourceVideoPlayer');
        const url = URL.createObjectURL(file);
        player.src = url;
        player.onloadedmetadata = () => {
            const dur = player.duration.toFixed(2);
            document.getElementById('videoDurationInfo').innerText = `Thời lượng: ${dur}s | ${player.videoWidth}×${player.videoHeight}px`;
            document.getElementById('videoEndSec').value = Math.min(1.2, player.duration).toFixed(2);
            this.showToast(`🎬 Đã nạp video: ${file.name} (${dur}s)`);
        };
    }

    async extractFramesFromVideo() {
        if (!this.selectedVideoFile) {
            this.showToast("⚠️ Hãy nạp file Video trước!");
            return;
        }

        const startSec = parseFloat(document.getElementById('videoStartSec').value) || 0.0;
        const endSec = parseFloat(document.getElementById('videoEndSec').value) || 0.0;
        const bgRemoval = document.getElementById('videoBgRemovalMode').value;
        const tolerance = parseInt(document.getElementById('bgToleranceSlider').value) || 35;
        const targetSize = parseInt(document.getElementById('videoTargetSize').value) || 256;
        const pixelate = document.getElementById('chkVideoPixelate').checked;

        const btn = document.getElementById('btnExtractVideoFrames');
        btn.innerText = "⏳ Đang Bóc Frame..."; btn.disabled = true;

        const formData = new FormData();
        formData.append('video', this.selectedVideoFile);
        formData.append('start_sec', startSec);
        formData.append('end_sec', endSec);
        formData.append('frame_count', this.videoFrameCount);
        formData.append('bg_removal', bgRemoval);
        formData.append('tolerance', tolerance);
        formData.append('target_size', targetSize);
        formData.append('pixelate', pixelate);

        try {
            const res = await fetch('/api/process/video_file', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'ok' && data.frames) {
                this.extractedFrames = data.frames;
                document.getElementById('videoExtractedCountBadge').innerText = data.frames.length;
                this.renderExtractedVideoFrames();
                this.startVideoAnimationPreview();
                this.showToast(`✨ Đã bóc tách thành công ${data.frames.length} frame từ video!`);
            } else {
                this.showToast("⚠️ " + (data.detail || "Lỗi xử lý video"));
            }
        } catch(e) {
            this.showToast("⚠️ Lỗi bóc frame: " + e.message);
        } finally {
            btn.innerText = "⚡ Bóc Tách Frame Ngay ➔"; btn.disabled = false;
        }
    }

    renderExtractedVideoFrames() {
        const list = document.getElementById('extractedFramesList');
        if (!list) return;
        list.innerHTML = '';

        this.extractedFrames.forEach((b64, idx) => {
            const card = document.createElement('div');
            card.className = 'frame-card';
            card.innerHTML = `<img src="${b64}" style="width:70px; height:70px; object-fit:contain; background:#000; border-radius:3px;"><span class="frame-card-idx">#${idx}</span>`;
            list.appendChild(card);
        });
    }

    startVideoAnimationPreview() {
        if (this.videoAnimInterval) clearInterval(this.videoAnimInterval);
        if (!this.extractedFrames.length) return;

        const canvas = document.getElementById('videoMiniPreviewCanvas');
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const imgs = this.extractedFrames.map(b64 => {
            const img = new Image();
            img.src = b64;
            return img;
        });

        this.videoAnimIdx = 0;
        this.videoAnimInterval = setInterval(() => {
            if (!imgs.length) return;
            const img = imgs[this.videoAnimIdx];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (img.complete) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            this.videoAnimIdx = (this.videoAnimIdx + 1) % imgs.length;
        }, 1000 / this.videoFps);
    }

    sendExtractedVideoToStudio() {
        if (!this.extractedFrames.length) {
            this.showToast("⚠️ Chưa có frame nào!");
            return;
        }

        const clip = this.clips[this.currentClipName];
        clip.frames = [];

        let loaded = 0;
        this.extractedFrames.forEach((b64, idx) => {
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = 256; c.height = 256;
                const ctx = c.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0, 256, 256);
                clip.frames[idx] = { canvas: c, hitbox: null, hurtbox: null };
                loaded++;
                if (loaded === this.extractedFrames.length) {
                    this.activeFrameIndex = 0;
                    this.switchTab('tab-studio');
                    this.showToast(`✨ Đã nạp ${loaded} frame video vào Studio!`);
                }
            };
            img.src = b64;
        });
    }

    // =========================================================================
    // 3. SPRITE SLICER MODULE
    // =========================================================================
    initSlicer() {
        this.slicerCanvas = document.getElementById('slicerCanvas');
        this.slicerOverlayCanvas = document.getElementById('slicerOverlayCanvas');
        if (!this.slicerCanvas || !this.slicerOverlayCanvas) return;

        this.slicerCtx = this.slicerCanvas.getContext('2d');
        this.slicerOverlayCtx = this.slicerOverlayCanvas.getContext('2d');
        this.slicerMiniCanvas = document.getElementById('slicerMiniPreview');
        this.slicerMiniCtx = this.slicerMiniCanvas.getContext('2d');

        const dropZone = document.getElementById('slicerDropZone');
        const fileInput = document.getElementById('slicerFileInput');

        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-cyan)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border-highlight)'; });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--border-highlight)';
            if (e.dataTransfer.files.length) this.loadSlicerFile(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) this.loadSlicerFile(e.target.files[0]);
        });

        document.getElementById('modeGrid')?.addEventListener('click', () => this.setSliceMode('grid'));
        document.getElementById('modeAutoDetect')?.addEventListener('click', () => this.setSliceMode('autodetect'));
        document.getElementById('modeManual')?.addEventListener('click', () => this.setSliceMode('manual'));
        document.getElementById('btnApplyGridSlice')?.addEventListener('click', () => this.applyGridSlice());

        document.getElementById('btnAutoAlignFeet')?.addEventListener('click', () => this.autoAlignAllFeet());
        document.getElementById('btnAutoCenterHoriz')?.addEventListener('click', () => this.autoCenterAllHorizontally());
        document.getElementById('btnEqualizeBoxes')?.addEventListener('click', () => this.equalizeAllBoxSizes());
        document.getElementById('btnDeleteSelectedBox')?.addEventListener('click', () => this.deleteSelectedBox());
        document.getElementById('btnAddCustomBox')?.addEventListener('click', () => this.addCustomBox());

        document.getElementById('btnApplySizeSelected')?.addEventListener('click', () => this.applyFrameSize(false));
        document.getElementById('btnApplySizeAll')?.addEventListener('click', () => this.applyFrameSize(true));
        document.getElementById('btnSelectAllSlices')?.addEventListener('click', () => {
            this.sliceBoxes.forEach((_, i) => this.selectedBoxIndices.add(i));
            this.renderSlicerOverlay();
            this.extractSlicedFrames();
        });
        document.getElementById('btnDeselectAllSlices')?.addEventListener('click', () => {
            this.selectedBoxIndices.clear();
            this.selectedBoxIndices.add(this.selectedBoxIndex || 0);
            this.renderSlicerOverlay();
            this.extractSlicedFrames();
        });

        document.getElementById('btnSendSlicesToStudio')?.addEventListener('click', () => this.sendSlicesToStudio());
        document.getElementById('btnClearSlices')?.addEventListener('click', () => this.clearSlices());

        this.slicerOverlayCanvas.addEventListener('mousedown', (e) => this.onSlicerMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onSlicerMouseMove(e));
        window.addEventListener('mouseup', () => this.onSlicerMouseUp());

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
            document.getElementById('sheetSizeInfo').innerText = `${img.width}×${img.height}`;
            this.renderSlicer();
            this.applyGridSlice();
            this.showToast("📂 Đã nạp ảnh Spritesheet!");
        };
        img.src = src;
    }

    setSliceMode(mode) {
        this.sliceMode = mode;
        document.querySelectorAll('.slice-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === (mode === 'grid' ? 'modeGrid' : mode === 'autodetect' ? 'modeAutoDetect' : 'modeManual'));
        });
        document.getElementById('gridSettings').style.display = mode === 'grid' ? 'block' : 'none';
        if (mode === 'autodetect' && this.slicerImg) this.autoDetectSpriteIslands();
        else this.renderSlicerOverlay();
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

        this.sliceBoxes.forEach((b, idx) => {
            const isPrimary = idx === this.selectedBoxIndex;
            const isMultiSel = this.selectedBoxIndices && this.selectedBoxIndices.has(idx);

            if (isPrimary) {
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(255,215,0,0.25)';
            } else if (isMultiSel) {
                ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5; ctx.fillStyle = 'rgba(0,240,255,0.2)';
            } else {
                ctx.strokeStyle = 'rgba(0,240,255,0.4)'; ctx.lineWidth = 1.5; ctx.fillStyle = 'rgba(0,240,255,0.05)';
            }

            ctx.strokeRect(b.x, b.y, b.w, b.h);
            ctx.fillRect(b.x, b.y, b.w, b.h);

            ctx.fillStyle = isPrimary ? '#ffd700' : isMultiSel ? '#00f0ff' : 'rgba(0,240,255,0.7)';
            ctx.fillRect(b.x, b.y, 24, 14);
            ctx.fillStyle = '#000'; ctx.font = 'bold 10px sans-serif';
            ctx.fillText(idx.toString() + (isMultiSel && !isPrimary ? '✓' : ''), b.x + 4, b.y + 11);

            if (isPrimary) {
                const hs = 8;
                const handles = [
                    { x: b.x, y: b.y }, { x: b.x + b.w, y: b.y },
                    { x: b.x, y: b.y + b.h }, { x: b.x + b.w, y: b.y + b.h },
                    { x: b.x + b.w / 2, y: b.y }, { x: b.x + b.w / 2, y: b.y + b.h },
                    { x: b.x, y: b.y + b.h / 2 }, { x: b.x + b.w, y: b.y + b.h / 2 }
                ];
                handles.forEach(h => {
                    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
                    ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
                    ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
                });
            }
        });

        document.getElementById('sheetFrameCountInfo').innerText = `${this.sliceBoxes.length} khung`;
        document.getElementById('sliceCountBadge').innerText = this.sliceBoxes.length;
    }

    applyGridSlice() {
        if (!this.slicerImg) return;
        const cols = parseInt(document.getElementById('gridCols').value) || 4;
        const rows = parseInt(document.getElementById('gridRows').value) || 2;
        const cropBot = (parseInt(document.getElementById('gridCropBottom').value) || 0) / 100.0;

        const w = this.slicerImg.width, h = this.slicerImg.height;
        const cw = Math.floor(w / cols), rh = Math.floor(h / rows);
        const usefulH = Math.floor(rh * (1.0 - cropBot));

        this.sliceBoxes = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.sliceBoxes.push({ x: c * cw, y: r * rh, w: cw, h: usefulH });
            }
        }
        this.selectedBoxIndex = 0;
        this.selectedBoxIndices = new Set([0]);
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
    }

    extractSlicedFrames() {
        if (!this.slicerImg || !this.sliceBoxes.length) return;
        this.slicedCanvases = [];
        const list = document.getElementById('slicedFramesList');
        list.innerHTML = '';

        this.sliceBoxes.forEach((box, idx) => {
            const fc = document.createElement('canvas');
            fc.width = 256; fc.height = 256;
            const fctx = fc.getContext('2d');
            fctx.imageSmoothingEnabled = false;
            fctx.drawImage(this.slicerImg, box.x, box.y, box.w, box.h, 0, 0, 256, 256);
            this.slicedCanvases.push(fc);

            const isPrimary = (idx === this.selectedBoxIndex);
            const isMulti = this.selectedBoxIndices && this.selectedBoxIndices.has(idx);

            const card = document.createElement('div');
            card.className = `frame-card ${isPrimary ? 'selected-card' : ''} ${isMulti ? 'multi-selected' : ''}`;
            card.innerHTML = `<canvas width="70" height="70"></canvas><span class="frame-card-idx">#${idx}</span>`;
            const tc = card.querySelector('canvas');
            const tctx = tc.getContext('2d');
            tctx.imageSmoothingEnabled = false;
            tctx.drawImage(fc, 0, 0, 70, 70);

            card.addEventListener('click', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    if (this.selectedBoxIndices.has(idx)) {
                        if (this.selectedBoxIndices.size > 1) {
                            this.selectedBoxIndices.delete(idx);
                            this.selectedBoxIndex = Array.from(this.selectedBoxIndices)[0];
                        }
                    } else {
                        this.selectedBoxIndices.add(idx);
                        this.selectedBoxIndex = idx;
                    }
                } else {
                    this.selectedBoxIndices.clear();
                    this.selectedBoxIndices.add(idx);
                    this.selectedBoxIndex = idx;
                }
                this.renderSlicerOverlay();
                this.extractSlicedFrames();
            });
            list.appendChild(card);
        });

        this.startSlicerAnimation();
    }

    startSlicerAnimation() {
        if (this.slicerAnimInterval) clearInterval(this.slicerAnimInterval);
        if (!this.slicedCanvases.length) return;
        this.slicerAnimInterval = setInterval(() => {
            if (!this.slicedCanvases.length) return;
            const f = this.slicedCanvases[this.slicerAnimIdx];
            this.slicerMiniCtx.clearRect(0, 0, 160, 160);
            this.slicerMiniCtx.imageSmoothingEnabled = false;
            this.slicerMiniCtx.drawImage(f, 0, 0, 160, 160);
            this.slicerAnimIdx = (this.slicerAnimIdx + 1) % this.slicedCanvases.length;
        }, 1000 / this.slicerFps);
    }

    applyFrameSize(applyAll) {
        const w = parseInt(document.getElementById('frameSyncW').value) || 128;
        const h = parseInt(document.getElementById('frameSyncH').value) || 128;
        if (applyAll) {
            this.sliceBoxes.forEach(b => { b.w = w; b.h = h; });
            this.showToast(`📐 Đã đồng bộ kích thước ${w}×${h} cho tất cả ${this.sliceBoxes.length} khung!`);
        } else {
            this.selectedBoxIndices.forEach(idx => {
                if (this.sliceBoxes[idx]) { this.sliceBoxes[idx].w = w; this.sliceBoxes[idx].h = h; }
            });
            this.showToast(`📐 Đã áp dụng ${w}×${h} cho ${this.selectedBoxIndices.size} khung!`);
        }
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
    }

    nudgeSelectedBox(dx, dy) {
        if (!this.sliceBoxes.length) return;
        this.selectedBoxIndices.forEach(idx => {
            if (this.sliceBoxes[idx]) { this.sliceBoxes[idx].x += dx; this.sliceBoxes[idx].y += dy; }
        });
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
    }

    deleteSelectedBox() {
        if (!this.sliceBoxes.length) return;
        const toDel = Array.from(this.selectedBoxIndices).sort((a, b) => b - a);
        toDel.forEach(idx => {
            if (idx >= 0 && idx < this.sliceBoxes.length) this.sliceBoxes.splice(idx, 1);
        });
        this.selectedBoxIndex = Math.max(0, Math.min(this.selectedBoxIndex, this.sliceBoxes.length - 1));
        this.selectedBoxIndices = new Set([this.selectedBoxIndex]);
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast(`🗑️ Đã xóa ${toDel.length} khung!`);
    }

    addCustomBox() {
        if (!this.slicerImg) return;
        const w = parseInt(document.getElementById('frameSyncW').value) || 128;
        const h = parseInt(document.getElementById('frameSyncH').value) || 128;
        this.sliceBoxes.push({
            x: Math.floor(this.slicerImg.width / 2 - w / 2),
            y: Math.floor(this.slicerImg.height / 2 - h / 2),
            w, h
        });
        this.selectedBoxIndex = this.sliceBoxes.length - 1;
        this.selectedBoxIndices = new Set([this.selectedBoxIndex]);
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("➕ Thêm khung mới!");
    }

    equalizeAllBoxSizes() {
        if (!this.sliceBoxes.length) return;
        const t = this.sliceBoxes[this.selectedBoxIndex] || this.sliceBoxes[0];
        this.sliceBoxes.forEach(b => { b.w = t.w; b.h = t.h; });
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("📐 Đồng bộ kích thước!");
    }

    autoCenterAllHorizontally() {
        if (!this.slicerImg || !this.sliceBoxes.length) return;
        const sc = document.createElement('canvas');
        sc.width = this.slicerImg.width; sc.height = this.slicerImg.height;
        sc.getContext('2d').drawImage(this.slicerImg, 0, 0);
        const sctx = sc.getContext('2d');

        this.sliceBoxes.forEach(box => {
            const d = sctx.getImageData(box.x, box.y, box.w, box.h).data;
            let minX = box.w, maxX = 0;
            for (let y = 0; y < box.h; y++)
                for (let x = 0; x < box.w; x++)
                    if (d[(y * box.w + x) * 4 + 3] > 30) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
            if (minX < maxX) box.x += Math.round((minX + maxX) / 2 - box.w / 2);
        });
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("🎯 Căn giữa X!");
    }

    autoAlignAllFeet() {
        if (!this.slicerImg || !this.sliceBoxes.length) return;
        const sc = document.createElement('canvas');
        sc.width = this.slicerImg.width; sc.height = this.slicerImg.height;
        sc.getContext('2d').drawImage(this.slicerImg, 0, 0);
        const sctx = sc.getContext('2d');
        const gp = parseInt(document.getElementById('groundLineRange').value) / 100.0;

        this.sliceBoxes.forEach(box => {
            const d = sctx.getImageData(box.x, box.y, box.w, box.h).data;
            let maxY = 0;
            for (let y = 0; y < box.h; y++)
                for (let x = 0; x < box.w; x++)
                    if (d[(y * box.w + x) * 4 + 3] > 30 && y > maxY) maxY = y;
            if (maxY > 0) box.y += maxY - Math.round(box.h * gp);
        });
        this.renderSlicerOverlay();
        this.extractSlicedFrames();
        this.showToast("🦶 Căn đáy chân!");
    }

    autoDetectSpriteIslands() {
        if (!this.slicerImg) return;
        this.applyGridSlice();
        this.autoCenterAllHorizontally();
        this.autoAlignAllFeet();
        this.showToast("🪄 Tự động căn chỉnh hoàn tất!");
    }

    sendSlicesToStudio() {
        if (!this.slicedCanvases.length) { this.showToast("⚠️ Chưa có khung!"); return; }
        const clip = this.clips[this.currentClipName];
        clip.frames = this.slicedCanvases.map(c => ({ canvas: c, hitbox: null, hurtbox: null }));
        this.activeFrameIndex = 0;
        this.switchTab('tab-studio');
        this.showToast(`✨ Nạp ${clip.frames.length} frame → Studio!`);
    }

    clearSlices() {
        this.sliceBoxes = [];
        this.slicedCanvases = [];
        this.renderSlicerOverlay();
        document.getElementById('slicedFramesList').innerHTML = '<div class="empty-state">Đã xóa.</div>';
        if (this.slicerAnimInterval) clearInterval(this.slicerAnimInterval);
    }

    onSlicerMouseDown(e) {
        const rect = this.slicerOverlayCanvas.getBoundingClientRect();
        const sx = this.slicerOverlayCanvas.width / rect.width;
        const sy = this.slicerOverlayCanvas.height / rect.height;
        const curX = (e.clientX - rect.left) * sx;
        const curY = (e.clientY - rect.top) * sy;

        for (let i = this.sliceBoxes.length - 1; i >= 0; i--) {
            const b = this.sliceBoxes[i];
            if (curX >= b.x && curX <= b.x + b.w && curY >= b.y && curY <= b.y + b.h) {
                if (e.ctrlKey) {
                    if (this.selectedBoxIndices.has(i)) this.selectedBoxIndices.delete(i);
                    else this.selectedBoxIndices.add(i);
                } else {
                    this.selectedBoxIndices.clear();
                    this.selectedBoxIndices.add(i);
                    this.selectedBoxIndex = i;
                }
                this.isMovingSelectedBox = true;
                this.dragStartX = curX;
                this.dragStartY = curY;
                this.renderSlicerOverlay();
                this.extractSlicedFrames();
                return;
            }
        }
    }

    onSlicerMouseMove(e) {
        if (!this.isMovingSelectedBox) return;
        const rect = this.slicerOverlayCanvas.getBoundingClientRect();
        const sx = this.slicerOverlayCanvas.width / rect.width;
        const sy = this.slicerOverlayCanvas.height / rect.height;
        const curX = (e.clientX - rect.left) * sx;
        const curY = (e.clientY - rect.top) * sy;

        const dx = Math.round(curX - this.dragStartX);
        const dy = Math.round(curY - this.dragStartY);

        if (dx !== 0 || dy !== 0) {
            this.selectedBoxIndices.forEach(idx => {
                if (this.sliceBoxes[idx]) {
                    this.sliceBoxes[idx].x += dx;
                    this.sliceBoxes[idx].y += dy;
                }
            });
            this.dragStartX = curX;
            this.dragStartY = curY;
            this.renderSlicerOverlay();
        }
    }

    onSlicerMouseUp() {
        if (this.isMovingSelectedBox) {
            this.isMovingSelectedBox = false;
            this.extractSlicedFrames();
        }
    }

    // =========================================================================
    // 4. ANIMATION STUDIO MODULE
    // =========================================================================
    initStudio() {
        this.layerBase = document.getElementById('layerBase');
        this.layerOnion = document.getElementById('layerOnion');
        this.layerMask = document.getElementById('layerMask');
        this.layerGrid = document.getElementById('layerGrid');

        if (this.layerBase) {
            this.ctxBase = this.layerBase.getContext('2d');
            this.ctxOnion = this.layerOnion.getContext('2d');
            this.ctxMask = this.layerMask.getContext('2d');
            this.ctxGrid = this.layerGrid.getContext('2d');

            this.studioAnimCanvas = document.getElementById('studioAnimCanvas');
            this.studioAnimCtx = this.studioAnimCanvas.getContext('2d');

            document.getElementById('clipSelect')?.addEventListener('change', (e) => {
                this.currentClipName = e.target.value;
                this.activeFrameIndex = 0;
                this.renderStudio();
            });

            document.getElementById('btnTimelineAddFrame')?.addEventListener('click', () => this.addTimelineFrame());
            document.getElementById('btnTimelineDelFrame')?.addEventListener('click', () => this.delTimelineFrame());

            document.getElementById('btnPlayPause')?.addEventListener('click', () => {
                this.animPlaying = !this.animPlaying;
                document.getElementById('btnPlayPause').innerText = this.animPlaying ? '⏸️ Dừng' : '▶️ Phát';
            });

            document.getElementById('animFpsSlider')?.addEventListener('input', (e) => {
                this.animFps = parseInt(e.target.value);
                document.getElementById('animFpsText').innerText = `${this.animFps} FPS`;
            });

            document.getElementById('btnStudioSyncGodot')?.addEventListener('click', () => this.exportStudioToGodot());
            this.startStudioAnimationLoop();
        }
    }

    renderStudio() {
        const clip = this.clips[this.currentClipName];
        if (!clip || !clip.frames.length) {
            this.ctxBase.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.renderTimelineFilmstrip();
            return;
        }

        const f = clip.frames[this.activeFrameIndex];
        if (f) {
            this.ctxBase.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.ctxBase.imageSmoothingEnabled = false;
            this.ctxBase.drawImage(f.canvas, 0, 0, this.canvasSize, this.canvasSize);
        }
        this.renderTimelineFilmstrip();
    }

    renderTimelineFilmstrip() {
        const strip = document.getElementById('timelineFilmstrip');
        if (!strip) return;
        strip.innerHTML = '';
        const clip = this.clips[this.currentClipName];
        if (!clip) return;

        clip.frames.forEach((f, idx) => {
            const item = document.createElement('div');
            item.className = `timeline-frame-item ${idx === this.activeFrameIndex ? 'active' : ''}`;
            item.innerHTML = `<canvas width="58" height="58"></canvas><span style="position:absolute;bottom:1px;right:3px;font-size:8px;font-weight:800;color:var(--text-muted);">#${idx}</span>`;
            const tc = item.querySelector('canvas');
            const tctx = tc.getContext('2d');
            tctx.imageSmoothingEnabled = false;
            tctx.drawImage(f.canvas, 0, 0, 58, 58);

            item.addEventListener('click', () => {
                this.activeFrameIndex = idx;
                this.renderStudio();
            });
            strip.appendChild(item);
        });
    }

    addTimelineFrame() {
        const clip = this.clips[this.currentClipName];
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        clip.frames.push({ canvas: c, hitbox: null, hurtbox: null });
        this.activeFrameIndex = clip.frames.length - 1;
        this.renderStudio();
    }

    delTimelineFrame() {
        const clip = this.clips[this.currentClipName];
        if (!clip.frames.length) return;
        clip.frames.splice(this.activeFrameIndex, 1);
        this.activeFrameIndex = Math.max(0, this.activeFrameIndex - 1);
        this.renderStudio();
    }

    startStudioAnimationLoop() {
        if (this.animInterval) clearInterval(this.animInterval);
        this.animInterval = setInterval(() => {
            if (!this.animPlaying) return;
            const clip = this.clips[this.currentClipName];
            if (!clip || !clip.frames.length) return;

            const f = clip.frames[this.animFrameIdx];
            if (f && this.studioAnimCtx) {
                this.studioAnimCtx.clearRect(0, 0, 180, 180);
                this.studioAnimCtx.imageSmoothingEnabled = false;
                this.studioAnimCtx.drawImage(f.canvas, 0, 0, 180, 180);
            }
            this.animFrameIdx = (this.animFrameIdx + 1) % clip.frames.length;
        }, 1000 / this.animFps);
    }

    // =========================================================================
    // 5. GODOT & LIBRARY MODULE
    // =========================================================================
    initLibrary() {
        document.querySelectorAll('[data-lib-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-lib-cat]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadLibraryAssets(btn.getAttribute('data-lib-cat'));
            });
        });
    }

    async loadLibraryAssets(cat = 'all') {
        const grid = document.getElementById('libraryGrid');
        if (!grid) return;
        try {
            const res = await fetch('/api/library/assets');
            const data = await res.json();
            const list = data[cat] || [];
            if (!list.length) {
                grid.innerHTML = '<div class="empty-state">Kho asset trống.</div>';
                return;
            }
            grid.innerHTML = '';
            list.forEach(item => {
                const card = document.createElement('div');
                card.className = 'lib-asset-card';
                card.innerHTML = `
                    <img src="${item.thumb || item.spritesheet}" onerror="this.src='/favicon.ico'">
                    <div class="lib-asset-name">${item.name}</div>
                    <span style="font-size:9px;color:var(--text-muted);">${item.category}</span>
                `;
                card.addEventListener('click', () => {
                    if (item.spritesheet) {
                        this.loadSlicerImageSrc(item.spritesheet);
                        this.switchTab('tab-slicer');
                        this.showToast(`📂 Đã nạp ${item.name} vào Bàn Cắt!`);
                    }
                });
                grid.appendChild(card);
            });
        } catch(e) {
            console.error("Error loading library assets:", e);
        }
    }

    async exportStudioToGodot() {
        const defaultName = (this.activeGame ? this.activeGame.title : "hero_character").replace(/\s+/g, '_').toLowerCase();
        const assetName = prompt("Nhập tên Asset nhân vật / quái để xuất Godot:", defaultName);
        if (!assetName) return;

        const clipsData = {};
        for (const [key, clip] of Object.entries(this.clips)) {
            if (clip.frames.length > 0) {
                clipsData[key] = clip.frames.map(f => f.canvas.toDataURL('image/png'));
            }
        }

        if (Object.keys(clipsData).length === 0) {
            this.showToast("⚠️ Chưa có frame nào trong Studio để xuất!");
            return;
        }

        try {
            const res = await fetch('/api/godot/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    asset_name: assetName,
                    category: 'characters',
                    clips: clipsData
                })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                this.showToast(`🚀 Đã xuất thành công sang Godot (.tres) & Kho Asset!`);
            }
        } catch(e) {
            this.showToast("⚠️ Lỗi xuất Godot: " + e.message);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.studioApp = new AssetStudioApp();
});
