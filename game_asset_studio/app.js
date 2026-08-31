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

        if (tabId === 'tab-video') this.updateTab2RefClipsList();
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

        // Global Collapse / Expand All Guides
        document.getElementById('btnCollapseAllSteps')?.addEventListener('click', () => {
            document.querySelectorAll('.step-guide-accordion').forEach(el => { el.open = false; });
            this.showToast('🔼 Đã gập toàn bộ hướng dẫn dài lại cho gọn!');
        });

        document.getElementById('btnExpandAllSteps')?.addEventListener('click', () => {
            document.querySelectorAll('.step-guide-accordion').forEach(el => { el.open = true; });
            this.showToast('🔽 Đã mở rộng toàn bộ hướng dẫn & thông số!');
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

            // Populate Video Target Asset Dropdown in Tab 2
            const videoAssetSelect = document.getElementById('videoTargetAssetSelect');
            if (videoAssetSelect && this.activeGame) {
                const prevVal = videoAssetSelect.value;
                videoAssetSelect.innerHTML = '';
                (this.activeGame.assets || []).forEach(a => {
                    const opt = document.createElement('option');
                    opt.value = a.id;
                    opt.innerText = `${a.name} [${a.category}]`;
                    videoAssetSelect.appendChild(opt);
                });
                if (prevVal && (this.activeGame.assets || []).some(a => a.id === prevVal)) {
                    videoAssetSelect.value = prevVal;
                }
                this.renderSavedClipsSummary();
            }

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

            const steps = p.pipeline_steps && p.pipeline_steps.length ? p.pipeline_steps : [
                {
                    step_name: isVideo ? "🎬 Video AI Prompt (I2V)" : "🖼️ Spritesheet Prompt",
                    tool_recommended: isVideo ? "Tencent HY Video 1.5 / Kling" : "ChatGPT / Midjourney",
                    purpose: p.format_reason || "Tạo asset chuẩn cho game",
                    prompt: isVideo ? (p.prompt_video || p.prompt_image || '') : (p.prompt_image || p.prompt_video || ''),
                    completed: false
                }
            ];

            const totalSteps = steps.length;
            const doneSteps = steps.filter(s => s.completed).length;
            const percent = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

            let statusBadgeHtml = `<span class="asset-status-badge status-pending">⚪ Chưa Có File (0/${totalSteps})</span>`;
            if (p.status === 'exported') {
                statusBadgeHtml = `<span class="asset-status-badge status-exported">🚀 Đã Xuất Godot</span>`;
            } else if (percent === 100) {
                statusBadgeHtml = `<span class="asset-status-badge status-ready">🟢 Sẵn Sàng (${doneSteps}/${totalSteps})</span>`;
            } else if (doneSteps > 0) {
                statusBadgeHtml = `<span class="asset-status-badge status-progress">🟡 Đang Làm (${doneSteps}/${totalSteps})</span>`;
            }

            let allPromptsJoined = steps.map((s, idx) => `--- ${s.step_name} ---\nTool: ${s.tool_recommended}\nPrompt: ${s.prompt}`).join('\n\n');

            let stepsHtml = steps.map((step, idx) => {
                const isStepVideo = step.step_name.includes('🎬') || step.step_name.toLowerCase().includes('video');
                const isStepBaseImg = step.step_name.includes('📸') || step.step_name.toLowerCase().includes('ảnh gốc') || step.step_name.toLowerCase().includes('base');
                const isPanorama = step.step_name.toLowerCase().includes('parallax') || step.step_name.toLowerCase().includes('tileset') || step.step_name.toLowerCase().includes('bối cảnh');
                
                // Extract animation clip name if formatted as [clip_name]
                const matchClip = step.step_name.match(/\[([a-zA-Z0-9_\-]+)\]/);
                const clipName = matchClip ? matchClip[1] : (isStepBaseImg ? 'base_texture' : 'sprite_sheet');

                let badgeClass = 'badge-sheet-step';
                let badgeText = '🖼️ ẢNH SHEET (T2I)';
                let ratioClass = 'ratio-image';
                let ratioText = '1:1 (Vuông - 1024x1024)';
                let durationText = 'Tĩnh (Ảnh)';
                let cameraText = 'Chính diện / Lưới 2D';
                let bgText = 'Trong suốt / Nền xanh';
                
                if (isStepVideo) {
                    badgeClass = 'badge-video-step';
                    badgeText = '🎬 VIDEO AI (I2V)';
                    ratioClass = 'ratio-video';
                    ratioText = '16:9 (Ngang - Chuẩn Video)';
                    durationText = '2.0s - 3.0s (1 chu kỳ)';
                    cameraText = 'Cố định góc ngang (Side View)';
                    bgText = '🟢 Phông Xanh Lá (Chroma Key)';
                } else if (isStepBaseImg) {
                    badgeClass = 'badge-image-step';
                    badgeText = '📸 ẢNH GỐC (T2I)';
                    ratioClass = 'ratio-image';
                    ratioText = '1:1 (Vuông - 1024x1024)';
                    durationText = 'Tĩnh (1 Dáng Duy Nhất)';
                    cameraText = 'Góc ngang toàn thân (Side Profile)';
                    bgText = '🟢 Phông Xanh Lá (Chroma Key)';
                } else if (isPanorama) {
                    ratioClass = 'ratio-panorama';
                    ratioText = '16:9 (Panorama 1920x1080)';
                    durationText = 'Tĩnh (Ghép Lớp Parallax)';
                }

                return `
                <div class="pipeline-step-item ${step.completed ? 'completed' : ''}" data-step-index="${idx}">
                    <!-- STEP HEADER ROW -->
                    <div class="step-top-row">
                        <label class="step-chk-label">
                            <input type="checkbox" class="step-checkbox" ${step.completed ? 'checked' : ''} data-step-idx="${idx}">
                            <span class="step-title-text">${step.step_name}</span>
                        </label>
                        <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
                            <span class="step-type-badge ${badgeClass}">${badgeText}</span>
                            <span class="ratio-pill ${ratioClass}">${ratioText.split(' ')[0]}</span>
                            <span class="tool-tag-pill">${step.tool_recommended}</span>
                            <div style="display:flex;align-items:center;gap:2px;margin-left:auto;">
                                <button class="btn btn-secondary btn-xs btn-step-up" data-step-idx="${idx}" data-asset-id="${p.id}" title="Chuyển Lên Trên" ${idx === 0 ? 'disabled' : ''} style="padding:1px 4px;">⬆️</button>
                                <button class="btn btn-secondary btn-xs btn-step-down" data-step-idx="${idx}" data-asset-id="${p.id}" title="Chuyển Xuống Dưới" ${idx === totalSteps - 1 ? 'disabled' : ''} style="padding:1px 4px;">⬇️</button>
                                <button class="btn btn-secondary btn-xs btn-edit-step" data-step-idx="${idx}" data-asset-id="${p.id}" title="Chỉnh Sửa Bước Này" style="padding:1px 4px;">✏️</button>
                                <button class="btn btn-secondary btn-xs btn-delete-step" data-step-idx="${idx}" data-asset-id="${p.id}" title="Xóa Bước Này" style="padding:1px 4px;">🗑️</button>
                            </div>
                        </div>
                    </div>

                    <!-- VIETNAMESE ACTION SUMMARY -->
                    <div style="font-size:10px;color:#e2e8f0;background:rgba(0,0,0,0.25);border-left:2px solid var(--accent-cyan);padding:4px 8px;border-radius:2px;">
                        🎭 <b>Hành động:</b> ${step.action_description_vi ? step.action_description_vi : step.purpose}
                    </div>

                    <!-- PROMPT SECTION (ALWAYS VISIBLE & PROMINENT) -->
                    <div class="step-prompt-row">
                        <div class="step-prompt-header">
                            <span style="font-size:9.5px;font-weight:900;color:var(--accent-cyan);letter-spacing:0.5px;">📋 PROMPT TẠO AI (${step.tool_recommended}):</span>
                            <button class="btn btn-secondary btn-xs btn-copy-step-prompt" data-prompt="${encodeURIComponent(step.prompt)}" title="Copy Prompt Bước Này" style="font-weight:800;background:var(--accent-cyan);color:#000;">
                                📋 Copy ${isStepVideo ? 'Video Prompt' : 'Prompt'}
                            </button>
                        </div>
                        <div class="step-prompt-code">${step.prompt}</div>
                    </div>

                    <!-- COLLAPSIBLE GUIDE: SPECS, RECIPE & CUT TIPS -->
                    <details class="step-guide-accordion">
                        <summary>💡 Xem Quy Trình 5 Bước & Mẹo Cắt Khung Hình Chuẩn</summary>
                        
                        <!-- DETAILED SPECIFICATION GRID -->
                        <div class="step-spec-grid" style="margin-top:6px;">
                            <div class="step-spec-item">
                                <span class="step-spec-label">🎯 Clip Godot:</span>
                                <span class="step-spec-value highlight-cyan">${clipName}</span>
                            </div>
                            <div class="step-spec-item">
                                <span class="step-spec-label">🛠️ Công Cụ AI:</span>
                                <span class="step-spec-value highlight-gold">${step.tool_recommended}</span>
                            </div>
                            <div class="step-spec-item">
                                <span class="step-spec-label">📐 Tỉ Lệ:</span>
                                <span class="step-spec-value">${ratioText}</span>
                            </div>
                            <div class="step-spec-item">
                                <span class="step-spec-label">⏱️ Thời Lượng:</span>
                                <span class="step-spec-value highlight-purple">${durationText}</span>
                            </div>
                            <div class="step-spec-item">
                                <span class="step-spec-label">🎥 Góc Máy:</span>
                                <span class="step-spec-value">${cameraText}</span>
                            </div>
                            <div class="step-spec-item">
                                <span class="step-spec-label">🟢 Phông Nền:</span>
                                <span class="step-spec-value highlight-green">${bgText}</span>
                            </div>
                        </div>

                        <!-- MOTION SCRIPT & CUTTING GUIDE -->
                        <div class="motion-guide-box" style="margin-top:6px;">
                            <div class="motion-cut-tip">
                                ✂️ <b>Cách Cắt Frame Chuẩn:</b> ${step.cut_guide_vi ? step.cut_guide_vi : 'Tua video đến đúng khoảnh khắc nhân vật bắt đầu thế (0.15s - 0.25s) ➔ Kết thúc khi hoàn thành động tác (0.9s - 1.2s).'}
                            </div>
                            ${step.negative_prompt ? `
                            <div class="negative-prompt-row">
                                <span>🚫 <b>Negative Prompt:</b> <code>${step.negative_prompt}</code></span>
                                <button class="btn btn-secondary btn-xs btn-copy-neg" data-neg="${encodeURIComponent(step.negative_prompt)}" title="Copy Negative Prompt">📋 Copy</button>
                            </div>` : ''}
                        </div>

                        <!-- STEP-BY-STEP RECIPE INSTRUCTION -->
                        <div class="step-recipe-box" style="margin-top:6px;">
                            <div class="step-recipe-title">
                                💡 <b>HƯỚNG DẪN THỰC HIỆN:</b>
                            </div>
                            <ol class="step-recipe-steps">
                                ${isStepVideo ? `
                                <li><b>1. Ảnh Đầu Vào:</b> Lưu file ảnh từ <i>Bước 1 (Ảnh Gốc Phông Xanh)</i> về máy.</li>
                                <li><b>2. Mở Công Cụ:</b> Vào <b>${step.tool_recommended}</b>, chọn chế độ <b>Image-to-Video (I2V)</b> ➔ Tải ảnh Bước 1 lên.</li>
                                <li><b>3. Cài Đặt:</b> Chọn tỉ lệ <b>16:9 (Ngang)</b>, thời lượng <b>2-3s</b>, mức độ chuyển động vừa phải.</li>
                                <li><b>4. Dán Prompt:</b> Copy đoạn Prompt tiếng Anh bên trên dán vào ô mô tả ➔ Bấm Generate Video.</li>
                                <li><b>5. Nạp Tool:</b> Tải video <code>.mp4</code> về ➔ Bấm <b>Nạp File Raw</b> bên dưới ➔ Bấm <b>⚡ Nạp Tab 2</b> để bóc 8 frame và xuất sang Godot!</li>
                                ` : (isStepBaseImg ? `
                                <li><b>1. Mở Công Cụ:</b> Mở <b>${step.tool_recommended}</b> (ChatGPT / Midjourney).</li>
                                <li><b>2. Cài Đặt:</b> Chọn tỉ lệ <b>1:1 (Vuông - 1024x1024)</b>.</li>
                                <li><b>3. Dán Prompt:</b> Copy Prompt bên trên để AI sinh ảnh nhân vật toàn thân nằm chính giữa trên nền xanh lá đồng màu.</li>
                                <li><b>4. Lưu File:</b> Tải ảnh về ➔ Nạp vào ô <b>Nạp File Raw</b> bên dưới để làm ảnh gốc cho tất cả các bước Video tiếp theo.</li>
                                ` : `
                                <li><b>1. Mở Công Cụ:</b> Mở <b>${step.tool_recommended}</b>.</li>
                                <li><b>2. Dán Prompt:</b> Copy Prompt bên trên để tạo ảnh spritesheet hoặc texture bối cảnh.</li>
                                <li><b>3. Nạp Tool:</b> Tải ảnh về ➔ Bấm <b>⚡ Nạp Tab 3 (Cắt Ảnh)</b> để chia lưới frame!</li>
                                `)}
                            </ol>
                        </div>
                    </details>

                    <!-- RAW ASSET UPLOAD & PROCESSING ROW -->
                    <div class="step-raw-row">
                        <div class="raw-status-chip ${step.raw_file_name ? 'has-file' : 'no-file'}">
                            ${step.raw_file_name ? `🟢 <b>Đã Có Raw:</b> ${step.raw_file_name}` : `⚪ <i>Chưa nạp file raw</i>`}
                        </div>
                        <div class="raw-action-buttons">
                            <input type="file" class="step-file-input" data-step-idx="${idx}" data-asset-id="${p.id}" accept="${isStepVideo ? 'video/*' : 'image/*'}" style="display:none;">
                            <button class="btn-upload-raw-step" data-step-idx="${idx}" title="Lưu file tải từ AI vào godot_demo/2/raw_assets/">
                                📁 ${step.raw_file_name ? 'Đổi File Raw' : 'Nạp File Raw'}
                            </button>
                            ${step.raw_file_url ? `
                            <button class="btn-process-raw-direct" data-url="${step.raw_file_url}" data-name="${p.name}" data-asset-id="${p.id}" data-clip-name="${clipName}" data-action-desc="${encodeURIComponent(step.action_description_vi || '')}" data-cut-guide="${encodeURIComponent(step.cut_guide_vi || '')}" data-is-video="${isStepVideo}">
                                ⚡ ${isStepVideo ? 'Nạp Tab 2 (Video)' : 'Nạp Tab 3 (Cắt Ảnh)'} ➔
                            </button>` : ''}
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            card.innerHTML = `
                <div class="plan-card-header">
                    <div>
                        <div class="plan-card-title">${p.name}</div>
                        <span class="plan-cat-label">${p.category}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px;">
                        <span class="plan-format-badge ${isVideo ? 'badge-video' : 'badge-image'}">
                            ${isVideo ? '🎬 VIDEO AI (I2V)' : '🖼️ ẢNH SHEET'}
                        </span>
                        <button class="btn-toggle-card-collapse" data-asset-id="${p.id}" title="Thu gọn / Mở rộng Asset này">▲ Thu Gọn</button>
                        <button class="btn btn-secondary btn-xs btn-edit-asset" data-asset-id="${p.id}" title="Sửa thông tin Asset">✏️ Sửa</button>
                        <button class="btn btn-secondary btn-xs btn-clone-asset" data-asset-id="${p.id}" title="Nhân bản Asset (Tạo Skin/Biến thể)">📋 Nhân Bản</button>
                    </div>
                </div>
                
                <div class="plan-status-row">
                    ${statusBadgeHtml}
                    <div class="asset-progress-track" title="Tiến độ: ${percent}%">
                        <div class="asset-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span style="font-size:10px;font-weight:800;color:var(--accent-cyan);font-family:monospace;">${percent}%</span>
                </div>

                <div class="plan-reason-box">
                    💡 <b>Quy Trình:</b> ${p.format_reason || (isVideo ? 'Tạo ảnh phông xanh ➔ Tạo video I2V ➔ Bóc 8 frame' : 'Tạo ảnh lưới ➔ Cắt frame')}
                </div>
                <div class="pipeline-steps-container">
                    <div class="pipeline-header-title">
                        <span>📋 QUY TRÌNH PROMPT & RAW FILES (${totalSteps} BƯỚC):</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span style="font-size:9px;color:var(--text-muted);">${doneSteps}/${totalSteps} Bước Xong</span>
                            <button class="btn btn-primary btn-xs btn-add-step" data-asset-id="${p.id}" style="padding:1px 6px;font-size:9px;">➕ Thêm Bước</button>
                        </div>
                    </div>
                    ${stepsHtml}
                </div>
                <div class="plan-card-footer">
                    <button class="btn btn-secondary btn-xs btn-copy-all-prompts">📑 Copy Trọn Bộ Prompt</button>
                    <button class="btn btn-primary btn-xs btn-use-plan">${isVideo ? '🎬 Sang Tab Video ➔' : '✂️ Sang Tab Cắt Ảnh ➔'}</button>
                    <button class="btn btn-secondary btn-xs btn-delete-asset" title="Xóa Asset">🗑️</button>
                </div>
            `;

            // Toggle Single Step Collapse
            card.querySelectorAll('.btn-toggle-step-collapse').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const stepItem = btn.closest('.pipeline-step-item');
                    if (stepItem) {
                        stepItem.classList.toggle('collapsed');
                        const isCol = stepItem.classList.contains('collapsed');
                        const icon = btn.querySelector('.collapse-icon');
                        if (icon) icon.innerText = isCol ? '▶ Mở Rộng' : '▼ Thu Gọn';
                    }
                });
            });

            // Toggle Card-Level Collapse (Asset Card)
            card.querySelector('.btn-toggle-card-collapse')?.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.toggle('card-collapsed');
                const isCol = card.classList.contains('card-collapsed');
                e.target.innerText = isCol ? '▶ Mở Rộng' : '▲ Thu Gọn';
            });

            // Copy Step Prompt Events
            card.querySelectorAll('.btn-copy-step-prompt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const promptText = decodeURIComponent(btn.getAttribute('data-prompt'));
                    navigator.clipboard.writeText(promptText);
                    this.showToast(`📋 Đã copy prompt bước này!`);
                });
            });

            // Edit Asset Event
            card.querySelectorAll('.btn-edit-asset').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openEditAssetModal(p);
                });
            });

            // Clone Asset Event
            card.querySelectorAll('.btn-clone-asset').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    this.showToast(`⏳ Đang nhân bản asset "${p.name}"...`);
                    const formData = new FormData();
                    formData.append('game_id', this.activeGame.id);
                    formData.append('asset_id', p.id);
                    await fetch('/api/games/clone_asset', { method: 'POST', body: formData });
                    this.showToast(`📋 Đã nhân bản thành công!`);
                    this.loadGamesFromServer();
                });
            });

            // Add Step Event
            card.querySelectorAll('.btn-add-step').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openStepModal(p.id, -1);
                });
            });

            // Edit Step Event
            card.querySelectorAll('.btn-edit-step').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const stepIdx = parseInt(btn.getAttribute('data-step-idx'));
                    this.openStepModal(p.id, stepIdx, p.pipeline_steps[stepIdx]);
                });
            });

            // Delete Step Event
            card.querySelectorAll('.btn-delete-step').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const stepIdx = parseInt(btn.getAttribute('data-step-idx'));
                    if (confirm(`Xóa bước #${stepIdx + 1} khỏi Asset "${p.name}"?`)) {
                        const formData = new FormData();
                        formData.append('game_id', this.activeGame.id);
                        formData.append('asset_id', p.id);
                        formData.append('step_index', stepIdx);
                        await fetch('/api/games/delete_step', { method: 'POST', body: formData });
                        this.showToast(`🗑️ Đã xóa bước!`);
                        this.loadGamesFromServer();
                    }
                });
            });

            // Reorder Step Events (Up / Down)
            card.querySelectorAll('.btn-step-up').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const stepIdx = parseInt(btn.getAttribute('data-step-idx'));
                    const formData = new FormData();
                    formData.append('game_id', this.activeGame.id);
                    formData.append('asset_id', p.id);
                    formData.append('step_index', stepIdx);
                    formData.append('direction', 'up');
                    await fetch('/api/games/reorder_step', { method: 'POST', body: formData });
                    this.loadGamesFromServer();
                });
            });

            card.querySelectorAll('.btn-step-down').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const stepIdx = parseInt(btn.getAttribute('data-step-idx'));
                    const formData = new FormData();
                    formData.append('game_id', this.activeGame.id);
                    formData.append('asset_id', p.id);
                    formData.append('step_index', stepIdx);
                    formData.append('direction', 'down');
                    await fetch('/api/games/reorder_step', { method: 'POST', body: formData });
                    this.loadGamesFromServer();
                });
            });

            // Checkbox Events
            card.querySelectorAll('.step-checkbox').forEach(chk => {
                chk.addEventListener('change', async (e) => {
                    const stepIdx = parseInt(e.target.getAttribute('data-step-idx'));
                    const stepItem = card.querySelectorAll('.pipeline-step-item')[stepIdx];
                    if (stepItem) {
                        stepItem.classList.toggle('completed', e.target.checked);
                    }
                    if (p.pipeline_steps && p.pipeline_steps[stepIdx]) {
                        p.pipeline_steps[stepIdx].completed = e.target.checked;
                    }
                    const formData = new FormData();
                    formData.append('game_id', this.activeGame.id);
                    formData.append('asset_id', p.id);
                    formData.append('step_index', stepIdx);
                    formData.append('completed', e.target.checked);
                    await fetch('/api/assets/toggle_step', { method: 'POST', body: formData });
                });
            });

            // Raw File Upload Buttons
            card.querySelectorAll('.btn-upload-raw-step').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const stepIdx = btn.getAttribute('data-step-idx');
                    const fileInput = card.querySelector(`.step-file-input[data-step-idx="${stepIdx}"]`);
                    if (fileInput) fileInput.click();
                });
            });

            // Handle File Input Change (Upload Raw File)
            card.querySelectorAll('.step-file-input').forEach(input => {
                input.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const stepIdx = e.target.getAttribute('data-step-idx');
                    
                    const formData = new FormData();
                    formData.append('game_id', this.activeGame.id);
                    formData.append('asset_id', p.id);
                    formData.append('step_index', stepIdx);
                    formData.append('file', file);

                    this.showToast(`⏳ Đang lưu file raw "${file.name}" vào godot_demo/2/raw_assets/...`);
                    try {
                        const res = await fetch('/api/assets/upload_raw', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.status === 'ok') {
                            this.showToast(`✅ Đã lưu file raw vào Git thư mục: raw_assets/!`);
                            this.loadGamesFromServer();
                        }
                    } catch(err) {
                        this.showToast(`⚠️ Lỗi upload raw file: ` + err.message);
                    }
                });
            });

            // Copy Negative Prompt Button
            card.querySelectorAll('.btn-copy-neg').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const neg = decodeURIComponent(btn.getAttribute('data-neg') || '');
                    navigator.clipboard.writeText(neg);
                    this.showToast(`📋 Đã copy Negative Prompt! Dán vào ô Negative/Chống lỗi của AI.`);
                });
            });

            // Direct Process Button (Send to Tab 2 or Tab 3)
            card.querySelectorAll('.btn-process-raw-direct').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const url = btn.getAttribute('data-url');
                    const isVid = btn.getAttribute('data-is-video') === 'true';
                    const assetId = btn.getAttribute('data-asset-id') || p.id;
                    const clipName = btn.getAttribute('data-clip-name') || 'action';
                    const actionDesc = decodeURIComponent(btn.getAttribute('data-action-desc') || '');
                    const cutGuide = decodeURIComponent(btn.getAttribute('data-cut-guide') || '');
                    
                    if (isVid) {
                        this.switchTab('tab-video');
                        this.showToast(`🎬 Đang nạp video raw vào bộ xử lý...`);
                        
                        // Set Target Asset in Tab 2
                        const assetSelect = document.getElementById('videoTargetAssetSelect');
                        if (assetSelect) assetSelect.value = assetId;

                        // Set Custom Clip Name in Tab 2
                        const clipNameInp = document.getElementById('videoCustomClipName');
                        if (clipNameInp) clipNameInp.value = clipName;

                        // Activate matching Preset Chip if exists
                        document.querySelectorAll('#videoActionPresetChips .clip-chip').forEach(chip => {
                            chip.classList.toggle('active', chip.getAttribute('data-clip') === clipName);
                        });

                        // Populate & Display Step Cutting Guide Box in Tab 2
                        const guideSec = document.getElementById('videoStepGuideSection');
                        const guideContent = document.getElementById('videoStepGuideContent');
                        if (guideSec && guideContent) {
                            guideContent.innerHTML = `
                                <div style="margin-bottom:3px;">🎯 <b>Clip Godot:</b> <span style="color:var(--accent-cyan);font-weight:900;">[${clipName}]</span></div>
                                ${actionDesc ? `<div style="margin-bottom:3px;">🎭 <b>Hành Động:</b> ${actionDesc}</div>` : ''}
                                ${cutGuide ? `<div style="color:#fef08a;">✂️ <b>Căn Cắt:</b> ${cutGuide}</div>` : ''}
                            `;
                            guideSec.style.display = 'block';
                        }

                        try {
                            const res = await fetch(url);
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            const blob = await res.blob();
                            const fileName = url.split('/').pop() || 'raw_video.mp4';
                            const file = new File([blob], fileName, { type: blob.type || 'video/mp4' });
                            this.loadVideoFile(file);
                            this.showToast(`🎬 Đã nạp video [${clipName}] vào Tab 2! Đọc Mẹo Bóc Frame để lấy nhịp chuẩn.`);
                        } catch(err) {
                            this.showToast(`⚠️ Không thể nạp video: ` + err.message);
                        }
                    } else {
                        this.switchTab('tab-slicer');
                        this.showToast(`✂️ Đang nạp ảnh raw vào bộ cắt sheet...`);
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            this.slicerImg = img;
                            this.renderSlicerCanvas();
                            this.showToast(`✂️ Đã nạp ảnh vào Tab 3! Bấm Chia Lưới để cắt.`);
                        };
                        img.src = url;
                    }
                });
            });

            // Copy All Prompts
            card.querySelector('.btn-copy-all-prompts').addEventListener('click', () => {
                navigator.clipboard.writeText(allPromptsJoined);
                this.showToast(`📑 Đã copy trọn bộ ${totalSteps} prompt của "${p.name}"!`);
            });

            // Navigate to Tab
            card.querySelector('.btn-use-plan').addEventListener('click', () => {
                if (isVideo) {
                    this.switchTab('tab-video');
                    this.showToast(`🎬 Đã chuyển sang Xử Lý Video cho: ${p.name}`);
                } else {
                    this.switchTab('tab-slicer');
                    this.showToast(`✂️ Đã chuyển sang Cắt Ảnh cho: ${p.name}`);
                }
            });

            // Delete Asset
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
    // MODAL HANDLERS FOR ASSET & STEP CRUD
    // =========================================================================
    openEditAssetModal(asset) {
        document.getElementById('editAssetId').value = asset.id;
        document.getElementById('editAssetName').value = asset.name || '';
        document.getElementById('editAssetCategory').value = asset.category || 'characters';
        document.getElementById('editAssetFormat').value = asset.format || 'video';
        document.getElementById('editAssetReason').value = asset.format_reason || '';
        document.getElementById('editAssetModal').style.display = 'flex';
    }

    async saveEditAsset() {
        const assetId = document.getElementById('editAssetId').value;
        const name = document.getElementById('editAssetName').value.trim();
        const category = document.getElementById('editAssetCategory').value;
        const format = document.getElementById('editAssetFormat').value;
        const format_reason = document.getElementById('editAssetReason').value.trim();

        if (!name) { this.showToast("⚠️ Nhập tên asset!"); return; }

        const patch = { name, category, format, format_reason };
        const formData = new FormData();
        formData.append('game_id', this.activeGame.id);
        formData.append('asset_id', assetId);
        formData.append('asset_json', JSON.stringify(patch));

        try {
            await fetch('/api/games/update_asset', { method: 'POST', body: formData });
            document.getElementById('editAssetModal').style.display = 'none';
            this.showToast(`✨ Đã cập nhật Asset "${name}"!`);
            this.loadGamesFromServer();
        } catch(e) {
            this.showToast("⚠️ Lỗi: " + e.message);
        }
    }

    openStepModal(assetId, stepIndex, stepData = null) {
        document.getElementById('stepModalAssetId').value = assetId;
        document.getElementById('stepModalIndex').value = stepIndex;

        if (stepIndex >= 0 && stepData) {
            document.getElementById('stepModalTitle').innerText = "✏️ Chỉnh Sửa Bước";
            document.getElementById('stepModalName').value = stepData.step_name || '';
            document.getElementById('stepModalTool').value = stepData.tool_recommended || '';
            document.getElementById('stepModalPurpose').value = stepData.purpose || '';
            document.getElementById('stepModalPrompt').value = stepData.prompt || '';
        } else {
            document.getElementById('stepModalTitle').innerText = "➕ Thêm Bước Prompt / Video Mới";
            document.getElementById('stepModalName').value = "🎬 Bước Mới: ";
            document.getElementById('stepModalTool').value = "Tencent HY Video 1.5 / Kling (I2V)";
            document.getElementById('stepModalPurpose').value = "Tạo chuyển động...";
            document.getElementById('stepModalPrompt').value = "";
        }
        document.getElementById('stepModal').style.display = 'flex';
    }

    async saveStepModal() {
        const assetId = document.getElementById('stepModalAssetId').value;
        const stepIndex = parseInt(document.getElementById('stepModalIndex').value);

        const step_name = document.getElementById('stepModalName').value.trim();
        const tool_recommended = document.getElementById('stepModalTool').value.trim();
        const purpose = document.getElementById('stepModalPurpose').value.trim();
        const prompt = document.getElementById('stepModalPrompt').value.trim();

        if (!step_name) { this.showToast("⚠️ Nhập tên bước!"); return; }

        const stepObj = {
            step_name,
            tool_recommended: tool_recommended || "ChatGPT",
            purpose: purpose || "Tạo tài nguyên",
            prompt: prompt || "",
            completed: false
        };

        const formData = new FormData();
        formData.append('game_id', this.activeGame.id);
        formData.append('asset_id', assetId);

        if (stepIndex >= 0) {
            formData.append('step_index', stepIndex);
            formData.append('step_json', JSON.stringify(stepObj));
            await fetch('/api/games/update_step', { method: 'POST', body: formData });
            this.showToast(`✨ Đã cập nhật bước!`);
        } else {
            formData.append('step_json', JSON.stringify(stepObj));
            await fetch('/api/games/add_step', { method: 'POST', body: formData });
            this.showToast(`✨ Đã thêm bước mới vào Asset!`);
        }

        document.getElementById('stepModal').style.display = 'none';
        this.loadGamesFromServer();
    }

    // =========================================================================
    // 2. VIDEO FRAME PROCESSOR MODULE & LOOP TOOLKIT
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

        // Collapsible Sidebar Sections
        document.querySelectorAll('.panel-section.collapsible-section .section-title').forEach(title => {
            title.addEventListener('click', () => {
                const section = title.closest('.panel-section');
                if (section) {
                    section.classList.toggle('section-collapsed');
                }
            });
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

        // Time Range Stepper & Fine-Tuning Buttons
        document.getElementById('btnStartMinus10')?.addEventListener('click', () => {
            const inp = document.getElementById('videoStartSec');
            inp.value = Math.max(0, parseFloat(inp.value) - 0.10).toFixed(2);
        });
        document.getElementById('btnStartMinus')?.addEventListener('click', () => {
            const inp = document.getElementById('videoStartSec');
            inp.value = Math.max(0, parseFloat(inp.value) - 0.05).toFixed(2);
        });
        document.getElementById('btnStartPlus')?.addEventListener('click', () => {
            const inp = document.getElementById('videoStartSec');
            inp.value = (parseFloat(inp.value) + 0.05).toFixed(2);
        });
        document.getElementById('btnStartPlus10')?.addEventListener('click', () => {
            const inp = document.getElementById('videoStartSec');
            inp.value = (parseFloat(inp.value) + 0.10).toFixed(2);
        });

        document.getElementById('btnEndMinus10')?.addEventListener('click', () => {
            const inp = document.getElementById('videoEndSec');
            inp.value = Math.max(0, parseFloat(inp.value) - 0.10).toFixed(2);
        });
        document.getElementById('btnEndMinus')?.addEventListener('click', () => {
            const inp = document.getElementById('videoEndSec');
            inp.value = Math.max(0, parseFloat(inp.value) - 0.05).toFixed(2);
        });
        document.getElementById('btnEndPlus')?.addEventListener('click', () => {
            const inp = document.getElementById('videoEndSec');
            inp.value = (parseFloat(inp.value) + 0.05).toFixed(2);
        });
        document.getElementById('btnEndPlus10')?.addEventListener('click', () => {
            const inp = document.getElementById('videoEndSec');
            inp.value = (parseFloat(inp.value) + 0.10).toFixed(2);
        });

        // Current Timestamp Grabbers
        document.getElementById('btnSetStartFromCurrent')?.addEventListener('click', () => {
            if (!player.src) { this.showToast("⚠️ Hãy nạp video trước!"); return; }
            const cur = player.currentTime || 0;
            document.getElementById('videoStartSec').value = cur.toFixed(2);
            this.showToast(`🟢 Đã đặt Bắt đầu = ${cur.toFixed(2)}s`);
        });

        document.getElementById('btnSetEndFromCurrent')?.addEventListener('click', () => {
            if (!player.src) { this.showToast("⚠️ Hãy nạp video trước!"); return; }
            const cur = player.currentTime || 0;
            document.getElementById('videoEndSec').value = cur.toFixed(2);
            this.showToast(`🔴 Đã đặt Kết thúc = ${cur.toFixed(2)}s`);
        });

        // Validate Input Values
        document.getElementById('videoStartSec')?.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value) || 0;
            if (val < 0) val = 0;
            e.target.value = val.toFixed(2);
        });
        document.getElementById('videoEndSec')?.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value) || 0;
            if (val < 0) val = 0;
            e.target.value = val.toFixed(2);
        });

        // Live Video Loop Player
        let videoLoopTimer = null;
        document.getElementById('btnTestVideoLoop')?.addEventListener('click', () => {
            if (!player.src) { this.showToast("⚠️ Nạp video trước!"); return; }
            const startSec = parseFloat(document.getElementById('videoStartSec').value) || 0;
            const endSec = parseFloat(document.getElementById('videoEndSec').value) || player.duration;
            
            player.currentTime = startSec;
            player.play();
            if (videoLoopTimer) clearInterval(videoLoopTimer);
            videoLoopTimer = setInterval(() => {
                if (player.currentTime >= endSec || player.currentTime < startSec) {
                    player.currentTime = startSec;
                }
            }, 30);
            this.showToast(`▶ Đang chạy thử đoạn loop [${startSec}s ➔ ${endSec}s]...`);
        });

        document.getElementById('btnStopVideoLoop')?.addEventListener('click', () => {
            if (videoLoopTimer) clearInterval(videoLoopTimer);
            player.pause();
            this.showToast("⏸ Đã dừng chạy thử loop.");
        });

        // Loop Toolkit Actions
        document.getElementById('btnMakePingPongLoop')?.addEventListener('click', () => {
            if (this.extractedFrames.length < 3) {
                this.showToast("⚠️ Cần ít nhất 3 frame để tạo Ping-Pong loop!");
                return;
            }
            const orig = [...this.extractedFrames];
            const middleRev = orig.slice(1, -1).reverse();
            this.extractedFrames = [...orig, ...middleRev];
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast(`🪃 Đã biến thành Ping-Pong Loop (${this.extractedFrames.length} frames)! Chuyển động lặp 2 chiều mượt 100%!`);
        });

        document.getElementById('btnInvertFrames')?.addEventListener('click', () => {
            if (!this.extractedFrames.length) return;
            this.extractedFrames.reverse();
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("🔄 Đã đảo ngược thứ tự frames!");
        });

        // LOOP REFINEMENT & DIRECTION TOOLKIT HANDLERS
        document.getElementById('btnFlipHorizontalFrames')?.addEventListener('click', async () => {
            if (!this.extractedFrames || !this.extractedFrames.length) return;
            const flipped = await Promise.all(this.extractedFrames.map(b64 => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        const c = document.createElement('canvas');
                        c.width = img.width;
                        c.height = img.height;
                        const ctx = c.getContext('2d');
                        ctx.imageSmoothingEnabled = false;
                        ctx.translate(c.width, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(img, 0, 0);
                        resolve(c.toDataURL('image/png'));
                    };
                    img.src = b64;
                });
            }));
            this.extractedFrames = flipped;
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("↔️ Đã lật ngang toàn bộ các frame (Đổi hướng Trái ↔ Phải)!");
        });

        document.getElementById('btnFlipVideoPlayer')?.addEventListener('click', () => {
            const player = document.getElementById('sourceVideoPlayer');
            if (!player) return;
            this.videoPlayerFlipped = !this.videoPlayerFlipped;
            player.style.transform = this.videoPlayerFlipped ? 'scaleX(-1)' : 'none';
            this.showToast(this.videoPlayerFlipped ? "↔️ Đã lật gương trình chiếu Video!" : "↔️ Đã trả về hướng video gốc!");
        });

        document.getElementById('btnInvertFrames')?.addEventListener('click', () => {
            if (!this.extractedFrames || !this.extractedFrames.length) return;
            this.extractedFrames.reverse();
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("🔄 Đã đảo ngược thứ tự các frame chuyển động (Chạy lùi)!");
        });

        document.getElementById('btnMakePingPongLoop')?.addEventListener('click', () => {
            if (!this.extractedFrames || this.extractedFrames.length <= 2) return;
            const rev = this.extractedFrames.slice(1, -1).reverse();
            this.extractedFrames = [...this.extractedFrames, ...rev];
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast(`🪃 Đã tạo Ping-Pong Loop 2 chiều (${this.extractedFrames.length} frames)!`);
        });

        document.getElementById('btnDupLastFrame')?.addEventListener('click', () => {
            if (!this.extractedFrames.length) return;
            this.extractedFrames.push(this.extractedFrames[this.extractedFrames.length - 1]);
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("📋 Đã nhân đôi frame cuối để giữ thế!");
        });

        document.getElementById('btnDeleteFirstFrame')?.addEventListener('click', () => {
            if (this.extractedFrames.length <= 1) return;
            this.extractedFrames.shift();
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("❌ Đã xóa frame 0 đầu tiên!");
        });

        document.getElementById('btnDeleteLastFrame')?.addEventListener('click', () => {
            if (this.extractedFrames.length <= 1) return;
            this.extractedFrames.pop();
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("❌ Đã xóa frame cuối cùng!");
        });

        document.getElementById('btnResetExtractedFrames')?.addEventListener('click', () => {
            if (!this.rawExtractedBackup || !this.rawExtractedBackup.length) return;
            this.extractedFrames = [...this.rawExtractedBackup];
            this.renderExtractedVideoFrames();
            this.startVideoAnimationPreview();
            this.showToast("🔄 Đã khôi phục lại các frame gốc ban đầu!");
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

        // Scale & Offset Controls
        document.getElementById('videoCharScaleSlider')?.addEventListener('input', (e) => {
            document.getElementById('videoCharScaleVal').innerText = `${e.target.value}%`;
        });

        document.getElementById('videoCharOffsetYSlider')?.addEventListener('input', (e) => {
            document.getElementById('videoCharOffsetYVal').innerText = `${e.target.value}px`;
        });

        // ANIMATION CLASSIFICATION & GODOT EXPORT CONTROLS
        document.querySelectorAll('.anim-chip-presets .chip-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.anim-chip-presets .chip-preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const clip = btn.getAttribute('data-clip');
                const input = document.getElementById('videoCustomClipName');
                if (input) input.value = clip;
                const label = document.getElementById('btnSaveClipNameLabel');
                if (label) label.innerText = clip;
                
                const chkLoop = document.getElementById('chkVideoClipLoop');
                if (chkLoop) {
                    const loopingActions = [
                        'idle', 'walk', 'run', 'hop_forward', 'hop_side',
                        'crouch', 'slide', 'victory_dance', 'prop_animated',
                        'water_flow', 'traffic_light'
                    ];
                    chkLoop.checked = loopingActions.includes(clip);
                }
            });
        });

        document.getElementById('videoCustomClipName')?.addEventListener('input', (e) => {
            const label = document.getElementById('btnSaveClipNameLabel');
            if (label) label.innerText = e.target.value || 'clip';
        });

        document.getElementById('videoTargetAssetSelect')?.addEventListener('change', () => {
            this.renderSavedClipsSummary();
            this.updateTab2RefClipsList();
        });

        // Tab 2 Live Reference Comparison
        document.getElementById('videoRefClipSelect')?.addEventListener('change', (e) => {
            const clipKey = e.target.value;
            const compareBox = document.getElementById('videoDualCompareBox');
            if (!clipKey) {
                if (compareBox) compareBox.style.display = 'none';
                if (this.tab2CompareInterval) clearInterval(this.tab2CompareInterval);
                return;
            }
            if (compareBox) compareBox.style.display = 'block';
            this.startTab2DualCompareLoop(clipKey);
        });

        this.tab2CompareGhost = false;
        document.getElementById('btnToggleGhostPreview')?.addEventListener('click', (e) => {
            this.tab2CompareGhost = !this.tab2CompareGhost;
            e.target.classList.toggle('active', this.tab2CompareGhost);
            e.target.innerText = this.tab2CompareGhost ? '🔲 Song Song' : '🧅 Lồng Mờ';
            const clipKey = document.getElementById('videoRefClipSelect')?.value;
            if (clipKey) this.startTab2DualCompareLoop(clipKey);
        });

        // Save Current Clip to Asset
        document.getElementById('btnSaveCurrentClip')?.addEventListener('click', () => {
            if (!this.extractedFrames || !this.extractedFrames.length) {
                this.showToast("⚠️ Chưa có frame nào được bóc tách!");
                return;
            }
            const assetSelect = document.getElementById('videoTargetAssetSelect');
            const assetId = assetSelect ? assetSelect.value : '';
            if (!assetId) {
                this.showToast("⚠️ Hãy chọn Nhân Vật / Asset đích!");
                return;
            }
            const clipName = (document.getElementById('videoCustomClipName')?.value || 'action').trim().toLowerCase().replace(/\s+/g, '_');
            const isLoop = document.getElementById('chkVideoClipLoop')?.checked || false;

            if (!this.assetClips) this.assetClips = {};
            if (!this.assetClips[assetId]) this.assetClips[assetId] = {};

            this.assetClips[assetId][clipName] = {
                frames: [...this.extractedFrames],
                loop: isLoop,
                speed: this.videoFps || 10
            };

            this.renderSavedClipsSummary();
            this.showToast(`💾 Đã lưu thành công clip [${clipName}] (${this.extractedFrames.length} frames) cho Asset!`);
        });

        // Export All Saved Clips of Asset Directly to Godot (.tres)
        document.getElementById('btnExportGodotDirect')?.addEventListener('click', async () => {
            const assetSelect = document.getElementById('videoTargetAssetSelect');
            const assetId = assetSelect ? assetSelect.value : '';
            const assetObj = (this.activeGame?.assets || []).find(a => a.id === assetId) || { name: 'character', category: 'characters' };

            // Auto sync active extracted frames into assetClips
            const currentClipName = (document.getElementById('videoCustomClipName')?.value || 'action').trim().toLowerCase().replace(/\s+/g, '_');
            if (this.extractedFrames && this.extractedFrames.length > 0) {
                if (!this.assetClips) this.assetClips = {};
                if (!this.assetClips[assetId]) this.assetClips[assetId] = {};
                this.assetClips[assetId][currentClipName] = {
                    frames: [...this.extractedFrames],
                    loop: document.getElementById('chkVideoClipLoop')?.checked || false,
                    speed: this.videoFps || 10
                };
            }

            let clipsToExport = {};
            if (this.assetClips && this.assetClips[assetId] && Object.keys(this.assetClips[assetId]).length > 0) {
                for (const [cName, cData] of Object.entries(this.assetClips[assetId])) {
                    clipsToExport[cName] = cData.frames;
                }
            } else if (this.extractedFrames && this.extractedFrames.length > 0) {
                clipsToExport[currentClipName] = this.extractedFrames;
            }

            if (Object.keys(clipsToExport).length === 0) {
                this.showToast("⚠️ Chưa có clip nào để xuất sang Godot!");
                return;
            }

            const btn = document.getElementById('btnExportGodotDirect');
            btn.innerText = "⏳ Đang Xuất Godot..."; btn.disabled = true;

            try {
                const res = await fetch('/api/godot/export', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        asset_name: assetObj.name,
                        category: assetObj.category || 'characters',
                        clips: clipsToExport
                    })
                });
                const data = await res.json();
                if (data.status === 'ok') {
                    this.showToast(`🚀 Đã xuất trọn bộ ${Object.keys(clipsToExport).length} animations sang Godot: res://assets/sprites/${assetObj.category}/${data.godot_dir.split('\\').pop()}/`);
                    // Update asset status
                    if (assetObj) assetObj.status = 'exported';
                    this.loadGamesFromServer();
                } else {
                    this.showToast("⚠️ Lỗi xuất Godot: " + (data.detail || "Không xác định"));
                }
            } catch(e) {
                this.showToast("⚠️ Lỗi xuất: " + e.message);
            } finally {
                btn.innerText = "🚀 Xuất Sang Godot (.tres)"; btn.disabled = false;
            }
        });

        // Modal Close Events
        document.getElementById('btnCloseEditAssetModal')?.addEventListener('click', () => document.getElementById('editAssetModal').style.display = 'none');
        document.getElementById('btnCancelEditAssetModal')?.addEventListener('click', () => document.getElementById('editAssetModal').style.display = 'none');
        document.getElementById('btnSaveEditAsset')?.addEventListener('click', () => this.saveEditAsset());

        document.getElementById('btnCloseStepModal')?.addEventListener('click', () => document.getElementById('stepModal').style.display = 'none');
        document.getElementById('btnCancelStepModal')?.addEventListener('click', () => document.getElementById('stepModal').style.display = 'none');
        document.getElementById('btnSaveStepModal')?.addEventListener('click', () => this.saveStepModal());
    }

    renderSavedClipsSummary() {
        const container = document.getElementById('savedClipsList');
        if (!container) return;
        const assetSelect = document.getElementById('videoTargetAssetSelect');
        const assetId = assetSelect ? assetSelect.value : '';

        if (!this.assetClips || !this.assetClips[assetId] || Object.keys(this.assetClips[assetId]).length === 0) {
            container.innerHTML = `<span style="font-size:10px;color:var(--text-muted);font-style:italic;">Chưa lưu clip nào cho asset này</span>`;
            return;
        }

        container.innerHTML = '';
        for (const [cName, cData] of Object.entries(this.assetClips[assetId])) {
            const pill = document.createElement('div');
            pill.className = 'saved-clip-pill';
            pill.innerHTML = `
                <span>🎬 <b>${cName}</b> (${cData.frames.length}F, ${cData.speed}FPS)</span>
                <span class="btn-del-clip" data-clip="${cName}" title="Xóa clip này">&times;</span>
            `;
            pill.querySelector('.btn-del-clip')?.addEventListener('click', (e) => {
                e.stopPropagation();
                delete this.assetClips[assetId][cName];
                this.renderSavedClipsSummary();
                this.showToast(`🗑️ Đã xóa clip [${cName}]`);
            });
            container.appendChild(pill);
        }
    }

    loadVideoFile(file) {
        if (!file) return;
        this.selectedVideoFile = file;
        const player = document.getElementById('sourceVideoPlayer');
        if (!player) return;

        const url = URL.createObjectURL(file);
        player.src = url;
        player.muted = true;
        player.loop = true;
        player.playsInline = true;

        player.onerror = (e) => {
            console.error("Video player error:", e);
            this.showToast(`⚠️ Không thể mở video "${file.name}".`);
        };

        player.onloadedmetadata = () => {
            const dur = player.duration || 0;
            const durStr = dur.toFixed(2);
            const durInfo = document.getElementById('videoDurationInfo');
            if (durInfo) durInfo.innerText = `Thời lượng: ${durStr}s | ${player.videoWidth}×${player.videoHeight}px`;

            const startInp = document.getElementById('videoStartSec');
            const endInp = document.getElementById('videoEndSec');
            if (startInp) {
                startInp.value = "0.00";
                startInp.max = dur;
            }
            if (endInp) {
                endInp.value = Math.min(dur, Math.max(0.5, Math.min(1.20, dur))).toFixed(2);
                endInp.max = dur;
            }

            player.play().catch(() => {});
            this.showToast(`🎬 Đã nạp video: ${file.name} (${durStr}s)`);
        };
        player.load();
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
        const aspectMode = document.getElementById('videoAspectMode')?.value || 'crop_character';
        const charScale = parseFloat(document.getElementById('videoCharScaleSlider')?.value) || 100.0;
        const offsetY = parseInt(document.getElementById('videoCharOffsetYSlider')?.value) || 0;
        const targetSize = parseInt(document.getElementById('videoTargetSize').value) || 256;
        const pixelate = document.getElementById('chkVideoPixelate').checked;
        const flipH = document.getElementById('chkVideoFlipH')?.checked || false;

        const btn = document.getElementById('btnExtractVideoFrames');
        btn.innerText = "⏳ Đang Bóc Frame..."; btn.disabled = true;

        const formData = new FormData();
        formData.append('video', this.selectedVideoFile);
        formData.append('start_sec', startSec);
        formData.append('end_sec', endSec);
        formData.append('frame_count', this.videoFrameCount);
        formData.append('bg_removal', bgRemoval);
        formData.append('tolerance', tolerance);
        formData.append('aspect_mode', aspectMode);
        formData.append('char_scale', charScale);
        formData.append('offset_y', offsetY);
        formData.append('target_size', targetSize);
        formData.append('pixelate', pixelate);
        formData.append('flip_h', flipH);

        try {
            const res = await fetch('/api/process/video_file', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.status === 'ok' && data.frames) {
                this.extractedFrames = data.frames;
                this.rawExtractedBackup = [...data.frames];

                if (document.getElementById('chkVideoReverseExtract')?.checked) {
                    this.extractedFrames.reverse();
                    this.rawExtractedBackup.reverse();
                }

                this.renderExtractedVideoFrames();
                this.startVideoAnimationPreview();

                // Auto update assetClips cache with latest frames
                const assetSelect = document.getElementById('videoTargetAssetSelect');
                const assetId = assetSelect ? assetSelect.value : '';
                const clipName = (document.getElementById('videoCustomClipName')?.value || 'action').trim().toLowerCase().replace(/\s+/g, '_');
                if (assetId) {
                    if (!this.assetClips) this.assetClips = {};
                    if (!this.assetClips[assetId]) this.assetClips[assetId] = {};
                    this.assetClips[assetId][clipName] = {
                        frames: [...this.extractedFrames],
                        loop: document.getElementById('chkVideoClipLoop')?.checked || false,
                        speed: this.videoFps || 10
                    };
                    this.renderSavedClipsSummary();
                }

                // Auto update reference comparison list and live compare loop
                await this.updateTab2RefClipsList();
                const refVal = document.getElementById('videoRefClipSelect')?.value;
                if (refVal) {
                    const compareBox = document.getElementById('videoDualCompareBox');
                    if (compareBox) compareBox.style.display = 'block';
                    this.startTab2DualCompareLoop(refVal);
                }

                this.showToast(`✨ Đã bóc tách thành công ${data.frames.length} frame (Scale: ${charScale}%)!`);
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

        document.getElementById('videoFrameCountLabel').innerText = `${this.extractedFrames.length} frame`;
        const countBadge = document.getElementById('videoExtractedCountBadge');
        if (countBadge) countBadge.innerText = this.extractedFrames.length;

        this.extractedFrames.forEach((b64, idx) => {
            const card = document.createElement('div');
            card.className = 'frame-action-card';
            card.innerHTML = `
                <img src="${b64}">
                <div class="frame-card-toolbar">
                    <button class="btn-shift-left" data-idx="${idx}" title="Chuyển sang trái" ${idx === 0 ? 'disabled' : ''}>◀</button>
                    <button class="btn-dup-frame" data-idx="${idx}" title="Nhân đôi frame này">📋</button>
                    <button class="btn-shift-right" data-idx="${idx}" title="Chuyển sang phải" ${idx === this.extractedFrames.length - 1 ? 'disabled' : ''}>▶</button>
                    <button class="btn-del-frame" data-idx="${idx}" title="Xóa frame này">❌</button>
                </div>
            `;

            // Frame Action Events
            card.querySelector('.btn-shift-left')?.addEventListener('click', () => {
                if (idx > 0) {
                    [this.extractedFrames[idx - 1], this.extractedFrames[idx]] = [this.extractedFrames[idx], this.extractedFrames[idx - 1]];
                    this.renderExtractedVideoFrames();
                    this.startVideoAnimationPreview();
                }
            });

            card.querySelector('.btn-shift-right')?.addEventListener('click', () => {
                if (idx < this.extractedFrames.length - 1) {
                    [this.extractedFrames[idx], this.extractedFrames[idx + 1]] = [this.extractedFrames[idx + 1], this.extractedFrames[idx]];
                    this.renderExtractedVideoFrames();
                    this.startVideoAnimationPreview();
                }
            });

            card.querySelector('.btn-dup-frame')?.addEventListener('click', () => {
                this.extractedFrames.splice(idx + 1, 0, this.extractedFrames[idx]);
                this.renderExtractedVideoFrames();
                this.startVideoAnimationPreview();
                this.showToast(`📋 Đã nhân đôi frame #${idx}!`);
            });

            card.querySelector('.btn-del-frame')?.addEventListener('click', () => {
                this.extractedFrames.splice(idx, 1);
                this.renderExtractedVideoFrames();
                this.startVideoAnimationPreview();
                this.showToast(`❌ Đã xóa frame #${idx}!`);
            });

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

        // Close Modal
        document.getElementById('btnCloseLibModal')?.addEventListener('click', () => this.closeLibraryAssetInspector());
        document.getElementById('btnCloseLibModalBtn')?.addEventListener('click', () => this.closeLibraryAssetInspector());

        // Inspector Tabs
        document.getElementById('tabBtnLibFrames')?.addEventListener('click', () => {
            document.getElementById('tabBtnLibFrames').classList.add('active');
            document.getElementById('tabBtnLibCompare')?.classList.remove('active');
            document.getElementById('tabBtnLibGodotTres').classList.remove('active');
            document.getElementById('libViewFrames').style.display = 'grid';
            document.getElementById('libViewCompare').style.display = 'none';
            document.getElementById('libViewGodotTres').style.display = 'none';
            if (this.libCompareInterval) clearInterval(this.libCompareInterval);
        });

        document.getElementById('tabBtnLibCompare')?.addEventListener('click', () => {
            document.getElementById('tabBtnLibCompare').classList.add('active');
            document.getElementById('tabBtnLibFrames').classList.remove('active');
            document.getElementById('tabBtnLibGodotTres').classList.remove('active');
            document.getElementById('libViewFrames').style.display = 'none';
            document.getElementById('libViewCompare').style.display = 'flex';
            document.getElementById('libViewGodotTres').style.display = 'none';
            this.setupLibCompareTab();
        });

        this.libCompareGhost = false;
        document.getElementById('btnLibCompareSideBySide')?.addEventListener('click', () => {
            this.libCompareGhost = false;
            document.getElementById('btnLibCompareSideBySide').classList.add('active');
            document.getElementById('btnLibCompareGhost').classList.remove('active');
            this.startLibDualCompareLoop();
        });

        document.getElementById('btnLibCompareGhost')?.addEventListener('click', () => {
            this.libCompareGhost = true;
            document.getElementById('btnLibCompareGhost').classList.add('active');
            document.getElementById('btnLibCompareSideBySide').classList.remove('active');
            this.startLibDualCompareLoop();
        });

        document.getElementById('libCompareClipA')?.addEventListener('change', () => this.startLibDualCompareLoop());
        document.getElementById('libCompareClipB')?.addEventListener('change', () => this.startLibDualCompareLoop());

        document.getElementById('tabBtnLibGodotTres')?.addEventListener('click', () => {
            document.getElementById('tabBtnLibGodotTres').classList.add('active');
            document.getElementById('tabBtnLibFrames').classList.remove('active');
            document.getElementById('tabBtnLibCompare')?.classList.remove('active');
            document.getElementById('libViewFrames').style.display = 'none';
            document.getElementById('libViewCompare').style.display = 'none';
            document.getElementById('libViewGodotTres').style.display = 'flex';
            if (this.libCompareInterval) clearInterval(this.libCompareInterval);
        });

        // Copy Buttons
        document.getElementById('btnCopyGodotPath')?.addEventListener('click', () => {
            const p = document.getElementById('libGodotResPath')?.innerText || '';
            navigator.clipboard.writeText(p);
            this.showToast(`📋 Đã copy đường dẫn Godot: ${p}`);
        });

        document.getElementById('btnCopyTresCode')?.addEventListener('click', () => {
            const code = document.getElementById('libTresCodeContent')?.innerText || '';
            navigator.clipboard.writeText(code);
            this.showToast(`📋 Đã copy mã nguồn file SpriteFrames (.tres)!`);
        });

        // Player Controls
        document.getElementById('btnLibPlayPause')?.addEventListener('click', () => {
            this.libAnimPlaying = !this.libAnimPlaying;
            document.getElementById('btnLibPlayPause').innerText = this.libAnimPlaying ? '⏸ Tạm Dừng' : '▶️ Phát';
        });

        document.getElementById('btnLibPrevFrame')?.addEventListener('click', () => {
            if (!this.libCurrentClipFrames || !this.libCurrentClipFrames.length) return;
            this.libAnimPlaying = false;
            document.getElementById('btnLibPlayPause').innerText = '▶️ Phát';
            this.libCurrentFrameIdx = (this.libCurrentFrameIdx - 1 + this.libCurrentClipFrames.length) % this.libCurrentClipFrames.length;
            this.drawLibAnimationFrame(this.libCurrentFrameIdx);
        });

        document.getElementById('btnLibNextFrame')?.addEventListener('click', () => {
            if (!this.libCurrentClipFrames || !this.libCurrentClipFrames.length) return;
            this.libAnimPlaying = false;
            document.getElementById('btnLibPlayPause').innerText = '▶️ Phát';
            this.libCurrentFrameIdx = (this.libCurrentFrameIdx + 1) % this.libCurrentClipFrames.length;
            this.drawLibAnimationFrame(this.libCurrentFrameIdx);
        });

        document.getElementById('libFpsSlider')?.addEventListener('input', (e) => {
            this.libAnimFps = parseInt(e.target.value) || 8;
            document.getElementById('libFpsVal').innerText = `${this.libAnimFps} FPS`;
            if (this.libCurrentClipFrames && this.libCurrentClipFrames.length) {
                const dur = (this.libCurrentClipFrames.length / this.libAnimFps).toFixed(2);
                document.getElementById('libDurationVal').innerText = `${dur}s`;
            }
            if (this.libAnimPlaying) {
                this.startLibAnimationLoop();
            }
        });

        // Clip Alignment & Ground Baseline Sliders
        const updateClipTransform = () => {
            const scale = document.getElementById('libClipScaleSlider')?.value || 100;
            const offY = document.getElementById('libClipOffsetYSlider')?.value || 0;
            const offX = document.getElementById('libClipOffsetXSlider')?.value || 0;
            const headY = document.getElementById('libHeadGuideYSlider')?.value || 60;
            const scaleVal = document.getElementById('libClipScaleVal');
            const offYVal = document.getElementById('libClipOffsetYVal');
            const offXVal = document.getElementById('libClipOffsetXVal');
            const headYVal = document.getElementById('libHeadGuideYVal');
            if (scaleVal) scaleVal.innerText = `${scale}%`;
            if (offYVal) offYVal.innerText = `${offY}px`;
            if (offXVal) offXVal.innerText = `${offX}px`;
            if (headYVal) headYVal.innerText = `${headY}px`;
            this.drawLibAnimationFrame(this.libCurrentFrameIdx);
        };

        document.getElementById('libClipScaleSlider')?.addEventListener('input', updateClipTransform);
        document.getElementById('libClipOffsetYSlider')?.addEventListener('input', updateClipTransform);
        document.getElementById('libClipOffsetXSlider')?.addEventListener('input', updateClipTransform);
        document.getElementById('libHeadGuideYSlider')?.addEventListener('input', updateClipTransform);
        document.getElementById('chkLibShowGuides')?.addEventListener('change', () => this.drawLibAnimationFrame(this.libCurrentFrameIdx));

        document.getElementById('btnResetClipTransform')?.addEventListener('click', () => {
            const sc = document.getElementById('libClipScaleSlider');
            const oy = document.getElementById('libClipOffsetYSlider');
            const ox = document.getElementById('libClipOffsetXSlider');
            const hy = document.getElementById('libHeadGuideYSlider');
            if (sc) sc.value = 100;
            if (oy) oy.value = 0;
            if (ox) ox.value = 0;
            if (hy) hy.value = 60;
            updateClipTransform();
        });

        document.getElementById('btnSaveClipTransform')?.addEventListener('click', () => this.saveCurrentClipAdjustment());
    }

    async loadLibraryAssets(cat = 'all') {
        const grid = document.getElementById('libraryGrid');
        if (!grid) return;
        try {
            const res = await fetch('/api/library/assets');
            const data = await res.json();
            const list = data[cat] || [];
            if (!list.length) {
                grid.innerHTML = '<div class="empty-state">Kho asset trống. Hãy xuất asset từ Tab 2 hoặc Tab 4!</div>';
                return;
            }
            grid.innerHTML = '';
            list.forEach(item => {
                const card = document.createElement('div');
                card.className = 'lib-asset-card';
                
                const clipKeys = Object.keys(item.clips || {});
                const clipPillsHtml = clipKeys.map(k => `<span class="lib-clip-pill">🎬 ${k} (${item.clips[k].length}F)</span>`).join('');

                card.innerHTML = `
                    <div class="lib-asset-thumb-box">
                        <img src="${item.thumb || item.spritesheet || '/favicon.ico'}" onerror="this.src='/favicon.ico'">
                        <div class="lib-hover-overlay">
                            <span>🔍 Xem & Chạy Thử Animation</span>
                        </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;">
                        <div class="lib-asset-name">${item.name}</div>
                        <span class="plan-cat-label" style="font-size:9px;">${item.category}</span>
                    </div>
                    <div class="lib-clip-pills-row">
                        ${clipPillsHtml || '<span style="font-size:9px;color:var(--text-muted);">Chưa có clip</span>'}
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:4px;border-top:1px solid var(--border-color);font-size:9px;color:var(--text-muted);">
                        <span>🚀 Godot Ready</span>
                        <span>${item.total_frames || 0} Frames</span>
                    </div>
                `;

                card.addEventListener('click', () => {
                    this.openLibraryAssetInspector(item);
                });
                grid.appendChild(card);
            });
        } catch(e) {
            console.error("Error loading library assets:", e);
        }
    }

    async openLibraryAssetInspector(item) {
        this.currentInspectedAsset = item;
        const modal = document.getElementById('libAssetModal');
        if (!modal) return;

        document.getElementById('libModalTitle').innerText = `🎬 ${item.name}`;
        document.getElementById('libModalCategory').innerText = item.category;
        document.getElementById('libModalFramesCount').innerText = `${item.total_frames || 0} Frames`;
        document.getElementById('libGodotResPath').innerText = item.godot_path || `res://assets/sprites/${item.category}/${item.id}/`;
        document.getElementById('libTresCodeContent').innerText = item.tres_code || '// Chưa có mã .tres';
        document.getElementById('libCreatedDate').innerText = `Xuất lúc: ${item.created_at || 'Mới xuất'}`;

        const clipButtonsList = document.getElementById('libClipButtonsList');
        clipButtonsList.innerHTML = '';

        const clips = item.clips || {};
        const clipKeys = Object.keys(clips);
        this.libLoadedClipImages = {};

        if (clipKeys.length === 0) {
            clipButtonsList.innerHTML = '<span style="font-size:10px;color:var(--text-muted);font-style:italic;">Chưa có animation clip nào</span>';
            modal.style.display = 'flex';
            return;
        }

        // Preload images for all clips
        for (const k of clipKeys) {
            this.libLoadedClipImages[k] = await Promise.all(clips[k].map(url => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(img);
                    img.src = url;
                });
            }));

            const btn = document.createElement('button');
            btn.className = `btn btn-secondary btn-xs ${k === clipKeys[0] ? 'active' : ''}`;
            btn.style.fontWeight = '800';
            btn.innerText = `🎬 ${k} (${clips[k].length}F)`;
            btn.addEventListener('click', () => {
                clipButtonsList.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectLibClip(k);
            });
            clipButtonsList.appendChild(btn);
        }

        modal.style.display = 'flex';
        this.selectLibClip(clipKeys[0]);
    }

    selectLibClip(clipKey) {
        this.activeLibClipKey = clipKey;
        this.libCurrentClipFrames = this.libLoadedClipImages[clipKey] || [];
        this.libCurrentFrameIdx = 0;
        this.libAnimPlaying = true;
        this.libAnimFps = (clipKey === 'attack' || clipKey === 'run' || clipKey === 'talon_kick') ? 10 : 8;
        
        const slider = document.getElementById('libFpsSlider');
        if (slider) slider.value = this.libAnimFps;
        document.getElementById('libFpsVal').innerText = `${this.libAnimFps} FPS`;

        // Reset transform sliders for new clip
        const sc = document.getElementById('libClipScaleSlider');
        const oy = document.getElementById('libClipOffsetYSlider');
        const ox = document.getElementById('libClipOffsetXSlider');
        if (sc) sc.value = 100;
        if (oy) oy.value = 0;
        if (ox) ox.value = 0;
        const scaleVal = document.getElementById('libClipScaleVal');
        const offYVal = document.getElementById('libClipOffsetYVal');
        const offXVal = document.getElementById('libClipOffsetXVal');
        if (scaleVal) scaleVal.innerText = `100%`;
        if (offYVal) offYVal.innerText = `0px`;
        if (offXVal) offXVal.innerText = `0px`;

        if (this.libCurrentClipFrames.length) {
            const dur = (this.libCurrentClipFrames.length / this.libAnimFps).toFixed(2);
            document.getElementById('libDurationVal').innerText = `${dur}s`;
        }

        document.getElementById('btnLibPlayPause').innerText = '⏸ Tạm Dừng';

        // Render Frame Filmstrip on right
        const frameList = document.getElementById('libViewFrames');
        frameList.innerHTML = '';
        document.getElementById('libFrameListCount').innerText = this.libCurrentClipFrames.length;

        this.libCurrentClipFrames.forEach((img, idx) => {
            const fCard = document.createElement('div');
            fCard.style.cssText = `
                background: #000; border: 1px solid var(--border-color); border-radius: 4px; padding: 4px;
                display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; transition: all 0.15s;
            `;
            fCard.innerHTML = `
                <img src="${img.src}" style="width: 100%; height: 60px; object-fit: contain; image-rendering: pixelated;">
                <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8.5px; color: var(--text-muted); font-family: monospace;">
                    <span>#${idx}</span>
                    <a href="${img.src}" download="${clipKey}_${idx}.png" onclick="event.stopPropagation();" style="color: var(--accent-cyan);" title="Tải ảnh này">💾</a>
                </div>
            `;
            fCard.addEventListener('click', () => {
                this.libAnimPlaying = false;
                document.getElementById('btnLibPlayPause').innerText = '▶️ Phát';
                this.libCurrentFrameIdx = idx;
                this.drawLibAnimationFrame(idx);
            });
            frameList.appendChild(fCard);
        });

        this.startLibAnimationLoop();
    }

    startLibAnimationLoop() {
        if (this.libAnimInterval) clearInterval(this.libAnimInterval);
        this.libAnimInterval = setInterval(() => {
            if (!this.libAnimPlaying || !this.libCurrentClipFrames || !this.libCurrentClipFrames.length) return;
            this.drawLibAnimationFrame(this.libCurrentFrameIdx);
            this.libCurrentFrameIdx = (this.libCurrentFrameIdx + 1) % this.libCurrentClipFrames.length;
        }, 1000 / (this.libAnimFps || 8));
    }

    drawLibAnimationFrame(idx) {
        const canvas = document.getElementById('libAnimCanvas');
        if (!canvas || !this.libCurrentClipFrames || !this.libCurrentClipFrames[idx]) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        const scale = (parseFloat(document.getElementById('libClipScaleSlider')?.value) || 100) / 100;
        const offX = parseInt(document.getElementById('libClipOffsetXSlider')?.value) || 0;
        const offY = parseInt(document.getElementById('libClipOffsetYSlider')?.value) || 0;
        const showGuides = document.getElementById('chkLibShowGuides')?.checked ?? true;

        const img = this.libCurrentClipFrames[idx];
        if (img && img.complete) {
            const dw = canvas.width * scale;
            const dh = canvas.height * scale;
            const dx = (canvas.width - dw) / 2 + offX;
            const dy = (canvas.height - dh) / 2 + offY;
            ctx.drawImage(img, dx, dy, dw, dh);
        }

        if (showGuides) {
            const headY = parseInt(document.getElementById('libHeadGuideYSlider')?.value) || 60;
            const bobRange = 18; // Head bobbing amplitude (Vùng nhấp nhô)

            // 1. Shaded Head Bobbing Zone
            ctx.fillStyle = 'rgba(74, 222, 128, 0.12)';
            ctx.fillRect(0, headY, canvas.width, bobRange);

            // 2. Top Peak Head Line (Green dashed)
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, headY); ctx.lineTo(canvas.width, headY);
            ctx.stroke();

            // 3. Lower Bobbing Bound (Green dotted)
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(0, headY + bobRange); ctx.lineTo(canvas.width, headY + bobRange);
            ctx.stroke();

            // 4. Ground Line at y = 215px (Red dashed)
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, 215); ctx.lineTo(canvas.width, 215);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = '#ef4444';
            ctx.font = '8px sans-serif';
            ctx.fillText('🔴 Chân tiếp đất (y=215)', 6, 211);

            ctx.fillStyle = '#4ade80';
            ctx.fillText(`🟢 Đỉnh cao (y=${headY})`, 6, headY - 4);
            ctx.fillStyle = 'rgba(74, 222, 128, 0.85)';
            ctx.fillText(`🌱 Vùng nhấp nhô (${headY}-${headY + bobRange}px)`, 6, headY + bobRange + 10);
        }

        const info = document.getElementById('libAnimInfo');
        if (info) {
            info.innerText = `Frame ${idx + 1}/${this.libCurrentClipFrames.length} (${this.activeLibClipKey})`;
        }
    }

    async saveCurrentClipAdjustment() {
        if (!this.currentInspectedAsset || !this.activeLibClipKey) return;
        const scale = (parseFloat(document.getElementById('libClipScaleSlider')?.value) || 100) / 100;
        const offX = parseInt(document.getElementById('libClipOffsetXSlider')?.value) || 0;
        const offY = parseInt(document.getElementById('libClipOffsetYSlider')?.value) || 0;

        if (scale === 1.0 && offX === 0 && offY === 0) {
            this.showToast("ℹ️ Tỉ lệ và vị trí chưa thay đổi (Scale: 100%, Offset: 0px).");
            return;
        }

        const btn = document.getElementById('btnSaveClipTransform');
        btn.innerText = "⏳ Đang Lưu..."; btn.disabled = true;

        try {
            const res = await fetch('/api/library/adjust_clip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: this.currentInspectedAsset.category || 'characters',
                    asset_id: this.currentInspectedAsset.id,
                    clip_key: this.activeLibClipKey,
                    scale: scale,
                    offset_x: offX,
                    offset_y: offY
                })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                // Reload images with new baked frames
                this.libLoadedClipImages[this.activeLibClipKey] = await Promise.all(data.frames.map(url => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(img);
                        img.src = url;
                    });
                }));
                this.libCurrentClipFrames = this.libLoadedClipImages[this.activeLibClipKey];

                // Reset sliders to 100% since new frames are now baked at 100%
                const sc = document.getElementById('libClipScaleSlider');
                const oy = document.getElementById('libClipOffsetYSlider');
                const ox = document.getElementById('libClipOffsetXSlider');
                if (sc) sc.value = 100;
                if (oy) oy.value = 0;
                if (ox) ox.value = 0;
                const scaleVal = document.getElementById('libClipScaleVal');
                const offYVal = document.getElementById('libClipOffsetYVal');
                const offXVal = document.getElementById('libClipOffsetXVal');
                if (scaleVal) scaleVal.innerText = `100%`;
                if (offYVal) offYVal.innerText = `0px`;
                if (offXVal) offXVal.innerText = `0px`;

                this.selectLibClip(this.activeLibClipKey);
                this.showToast(`✨ Đã lưu thành công tỉ lệ & chân tiếp đất mới cho [${this.activeLibClipKey}] sang Godot!`);
            } else {
                this.showToast("⚠️ " + (data.detail || "Lỗi lưu chỉnh sửa clip"));
            }
        } catch(e) {
            this.showToast("⚠️ Lỗi: " + e.message);
        } finally {
            btn.innerText = "💾 Lưu Đè Clip Này ➔"; btn.disabled = false;
        }
    }

    closeLibraryAssetInspector() {
        if (this.libAnimInterval) clearInterval(this.libAnimInterval);
        if (this.libCompareInterval) clearInterval(this.libCompareInterval);
        this.libAnimPlaying = false;
        const modal = document.getElementById('libAssetModal');
        if (modal) modal.style.display = 'none';
    }

    setupLibCompareTab() {
        if (!this.currentInspectedAsset) return;
        const clips = this.currentInspectedAsset.clips || {};
        const clipKeys = Object.keys(clips);
        const selA = document.getElementById('libCompareClipA');
        const selB = document.getElementById('libCompareClipB');
        if (!selA || !selB) return;

        selA.innerHTML = '';
        selB.innerHTML = '';
        clipKeys.forEach((k, idx) => {
            const optA = document.createElement('option');
            optA.value = k; optA.innerText = `🎬 ${k} (${clips[k].length}F)`;
            if (idx === 0) optA.selected = true;
            selA.appendChild(optA);

            const optB = document.createElement('option');
            optB.value = k; optB.innerText = `🎬 ${k} (${clips[k].length}F)`;
            if (idx === Math.min(1, clipKeys.length - 1)) optB.selected = true;
            selB.appendChild(optB);
        });

        this.startLibDualCompareLoop();
    }

    startLibDualCompareLoop() {
        if (this.libCompareInterval) clearInterval(this.libCompareInterval);
        const selA = document.getElementById('libCompareClipA');
        const selB = document.getElementById('libCompareClipB');
        if (!selA || !selB) return;

        const keyA = selA.value;
        const keyB = selB.value;
        const framesA = this.libLoadedClipImages[keyA] || [];
        const framesB = this.libLoadedClipImages[keyB] || [];

        const canvas = document.getElementById('libCompareCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let idx = 0;
        this.libCompareInterval = setInterval(() => {
            if (!framesA.length || !framesB.length) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const fA = framesA[idx % framesA.length];
            const fB = framesB[idx % framesB.length];

            const imgSize = 180;
            const imgY = 10;
            const headY = parseInt(document.getElementById('libHeadGuideYSlider')?.value) || 60;
            const groundY = imgY + imgSize * (215.0 / 256.0);  // = matching 215px on 256 frame
            const headPeakY = imgY + imgSize * (headY / 256.0); // = matching dynamic headY on 256 frame
            const headDipY = imgY + imgSize * ((headY + 18) / 256.0);  // = matching head bob dip on 256 frame

            // 1. Draw Shaded Head Bobbing Zone
            ctx.fillStyle = 'rgba(74, 222, 128, 0.12)';
            ctx.fillRect(0, headPeakY, canvas.width, headDipY - headPeakY);

            // 2. Draw Top Peak Head Line (Green dashed)
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, headPeakY); ctx.lineTo(canvas.width, headPeakY);
            ctx.stroke();

            // 3. Draw Lower Bobbing Line (Green dotted)
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(0, headDipY); ctx.lineTo(canvas.width, headDipY);
            ctx.stroke();

            // 4. Draw Ground Line (Red dashed)
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels
            ctx.fillStyle = '#ef4444';
            ctx.font = '8px sans-serif';
            ctx.fillText('🔴 Chân tiếp đất', 8, groundY - 3);

            ctx.fillStyle = '#4ade80';
            ctx.fillText('🟢 Đỉnh đầu', 8, headPeakY - 3);

            if (this.libCompareGhost) {
                // Ghost Overlay Mode
                const cx = (canvas.width - imgSize) / 2;
                if (fA && fA.complete) {
                    ctx.globalAlpha = 0.7;
                    ctx.drawImage(fA, cx, imgY, imgSize, imgSize);
                }
                if (fB && fB.complete) {
                    ctx.globalAlpha = 0.7;
                    ctx.drawImage(fB, cx, imgY, imgSize, imgSize);
                }
                ctx.globalAlpha = 1.0;
            } else {
                // Side by Side Mode
                const leftX = (canvas.width / 2 - imgSize) / 2;
                const rightX = canvas.width / 2 + (canvas.width / 2 - imgSize) / 2;

                // Left: Clip A
                if (fA && fA.complete) {
                    ctx.drawImage(fA, leftX, imgY, imgSize, imgSize);
                }
                // Middle Divider
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
                ctx.stroke();

                // Right: Clip B
                if (fB && fB.complete) {
                    ctx.drawImage(fB, rightX, imgY, imgSize, imgSize);
                }
            }

            const rulerInfo = document.getElementById('libCompareRulerInfo');
            if (rulerInfo) {
                rulerInfo.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span>📊 <b>[Clip A: ${keyA}]</b> vs <b>[Clip B: ${keyB}]</b></span>
                        <span>🔴 Đường đỏ: Vạch chân tiếp đất | 🟢 Đường xanh: Đỉnh đầu</span>
                    </div>
                    <div style="margin-top:3px;color:var(--text-muted);font-size:9.5px;">
                        💡 <b>Mẹo Cân Kích Thước:</b> Nếu thấy <b>${keyB}</b> bé hơn hoặc to hơn <b>${keyA}</b>, bạn chỉ cần vào lại <b>Tab 2 (Video)</b>, chỉnh thanh trượt <i>"Tỉ Lệ Thân Người (Scale)"</i> (ví dụ tăng lên 115% hoặc giảm xuống 85%) và bóc lại frame là 2 animation sẽ khít đều 100%!
                    </div>
                `;
            }

            idx++;
        }, 1000 / (this.libAnimFps || 8));
    }

    async updateTab2RefClipsList() {
        const select = document.getElementById('videoRefClipSelect');
        if (!select) return;
        
        const currentVal = select.value;
        select.innerHTML = '<option value="">(Chọn Clip để so kích thước)</option>';
        
        // 1. Fetch from server library
        try {
            const res = await fetch('/api/library/assets');
            const data = await res.json();
            const allItems = data.all || [];
            
            allItems.forEach(item => {
                const clips = item.clips || {};
                const clipKeys = Object.keys(clips);
                if (clipKeys.length > 0) {
                    const grp = document.createElement('optgroup');
                    grp.label = `📁 ${item.name}`;
                    clipKeys.forEach(cName => {
                        const opt = document.createElement('option');
                        opt.value = `server:${item.id}:${cName}`;
                        opt.innerText = `🎬 ${cName} (${clips[cName].length}F)`;
                        grp.appendChild(opt);
                    });
                    select.appendChild(grp);
                }
            });
        } catch(e) {
            console.error("Error fetching library clips for Tab 2 ref:", e);
        }

        // 2. Also add any local unsaved/saved clips in this.assetClips
        if (this.assetClips) {
            for (const [aId, clipsMap] of Object.entries(this.assetClips)) {
                const cKeys = Object.keys(clipsMap);
                if (cKeys.length > 0) {
                    const grp = document.createElement('optgroup');
                    grp.label = `💾 Đã lưu tạm: ${aId}`;
                    cKeys.forEach(cName => {
                        const opt = document.createElement('option');
                        opt.value = `local:${aId}:${cName}`;
                        opt.innerText = `⚡ ${cName} (${clipsMap[cName].frames.length}F)`;
                        grp.appendChild(opt);
                    });
                    select.appendChild(grp);
                }
            }
        }

        // Restore selection or auto-select 'walk' or first available clip
        if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
            select.value = currentVal;
        } else {
            const defaultOpt = Array.from(select.querySelectorAll('option')).find(o => o.value.includes('walk') || o.value.includes('idle') || o.value.includes('hop'));
            if (defaultOpt) {
                select.value = defaultOpt.value;
                const compareBox = document.getElementById('videoDualCompareBox');
                if (compareBox) compareBox.style.display = 'block';
                this.startTab2DualCompareLoop(defaultOpt.value);
            }
        }
    }

    async startTab2DualCompareLoop(clipVal) {
        if (this.tab2CompareInterval) clearInterval(this.tab2CompareInterval);
        const canvas = document.getElementById('videoDualCompareCanvas');
        if (!canvas || !clipVal) return;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let refFrames = [];
        try {
            if (clipVal.startsWith('local:')) {
                const parts = clipVal.split(':');
                const aId = parts[1];
                const cName = parts[2];
                const b64List = (this.assetClips[aId] && this.assetClips[aId][cName]) ? this.assetClips[aId][cName].frames : [];
                refFrames = await Promise.all(b64List.map(b64 => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(i); i.src = b64; })));
            } else if (clipVal.startsWith('server:')) {
                const parts = clipVal.split(':');
                const aId = parts[1];
                const cName = parts[2];
                const res = await fetch('/api/library/assets');
                const data = await res.json();
                const allItems = data.all || [];
                const targetObj = allItems.find(a => a.id === aId || a.name === aId);
                const urls = (targetObj && targetObj.clips && targetObj.clips[cName]) ? targetObj.clips[cName] : [];
                refFrames = await Promise.all(urls.map(u => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(i); i.src = u; })));
            }
        } catch(e) {
            console.error("Error loading refFrames for Tab 2 compare:", e);
        }

        if (!refFrames.length) {
            const infoEl = document.getElementById('videoDualCompareInfo');
            if (infoEl) infoEl.innerText = `⚠️ Chưa tải được frame mẫu`;
            return;
        }

        let curExtractedImgs = (this.extractedFrames || []).map(b64 => {
            const i = new Image(); i.src = b64; return i;
        });

        let idx = 0;
        this.tab2CompareInterval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const fExt = curExtractedImgs.length > 0 ? curExtractedImgs[idx % curExtractedImgs.length] : null;
            const fRef = refFrames[idx % refFrames.length];

            const imgSize = 110;
            const imgY = 8;
            const groundY = imgY + imgSize * (215.0 / 256.0);  // = 100.4px (matching 215px on 256 frame)
            const headPeakY = imgY + imgSize * (60.0 / 256.0); // = 33.8px (matching 60px on 256 frame)
            const headDipY = imgY + imgSize * (78.0 / 256.0);  // = 41.5px (matching 78px on 256 frame)

            // 1. Draw Head Bobbing Range (Vùng nhấp nhô đầu)
            ctx.fillStyle = 'rgba(74, 222, 128, 0.12)';
            ctx.fillRect(0, headPeakY, canvas.width, headDipY - headPeakY);

            // 2. Draw Top Peak Head Line (Green dashed)
            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(0, headPeakY); ctx.lineTo(canvas.width, headPeakY);
            ctx.stroke();

            // 3. Draw Lower Bobbing Line (Green dotted)
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(0, headDipY); ctx.lineTo(canvas.width, headDipY);
            ctx.stroke();

            // 4. Draw Ground Line (Red dashed)
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY);
            ctx.stroke();
            ctx.setLineDash([]);

            if (this.tab2CompareGhost) {
                // Ghost Overlay: Ref frame normal, Extracted frame tinted
                const cx = (canvas.width - imgSize) / 2;
                if (fRef && fRef.complete) {
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(fRef, cx, imgY, imgSize, imgSize);
                }
                if (fExt && fExt.complete) {
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(fExt, cx, imgY, imgSize, imgSize);
                }
                ctx.globalAlpha = 1.0;
            } else {
                // Side by Side
                const leftX = (128 - imgSize) / 2;
                const rightX = 128 + (128 - imgSize) / 2;

                // Left: Reference Frame (Clip đã có)
                if (fRef && fRef.complete) {
                    ctx.drawImage(fRef, leftX, imgY, imgSize, imgSize);
                }
                // Middle Divider
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(128, 0); ctx.lineTo(128, canvas.height);
                ctx.stroke();

                // Right: Extracted Frame (Đang bóc tách)
                if (fExt && fExt.complete) {
                    ctx.drawImage(fExt, rightX, imgY, imgSize, imgSize);
                } else {
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '10px sans-serif';
                    ctx.fillText('(Chưa bóc frame)', 140, 60);
                }
            }

            const infoEl = document.getElementById('videoDualCompareInfo');
            if (infoEl) {
                const cLabel = clipVal.split(':').pop();
                infoEl.innerHTML = `◀ Mẫu: <b>${cLabel}</b> | Đang bóc: <b>${this.extractedFrames ? this.extractedFrames.length : 0}F</b> ▶`;
            }

            idx++;
        }, 1000 / (this.videoFps || 10));
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
