// Game Logic chính sử dụng Phaser 3
let gameInstance = null;

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.players = {}; // Group hiển thị (Graphics/Sprites)
        this.playerNames = {}; // Group text hiển thị tên
        this.walls = null; // Vật cản vật lý (Chỉ Host xử lý)

        // Trạng thái game nhận từ server
        this.timer = 0;
        this.isDark = false;
        this.isGameRunning = false;
        this.slasherId = '';

        // Hệ thống bóng tối (Fog of War)
        this.darkOverlay = null;
        this.maskGraphics = null;
        this.mask = null;

        // Lưu trữ phím nhấn của Client
        this.keys = null;

        // Khởi tạo phím đảo (Wrong Way)
        this.keyMap = { up: 'up', down: 'down', left: 'left', right: 'right' };
        this.hasShuffledThisCycle = false;
    }

    preload() {
        // Tạo texture tạm thời cho người chơi và tường để không cần load file hình ảnh
        // Tránh lỗi thiếu asset

        // 1. Tạo texture vòng tròn cho người chơi
        const playerCanvas = document.createElement('canvas');
        playerCanvas.width = 32;
        playerCanvas.height = 32;
        const ctx = playerCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        this.textures.addCanvas('player_base', playerCanvas);

        // Synthesize simple audio effects using Web Audio API
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // 1. Vẽ nền lưới Neon sang chảnh
        this.add.grid(width / 2, height / 2, width, height, 40, 40, 0x111625, 0.5, 0x1d2737, 0.2);

        // 2. Tạo Group vật cản (Chỉ dùng vật lý ở Host)
        this.physics.world.setBounds(0, 0, width, height);
        this.walls = this.physics.add.staticGroup();

        // Vẽ một vài bức tường trong map
        this.createWall(200, 150, 400, 30);
        this.createWall(150, 300, 30, 200);
        this.createWall(650, 300, 30, 200);
        this.createWall(400, 450, 300, 30);

        // 3. Khởi tạo phím bấm
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // 4. Thiết lập hệ thống Bóng Tối (Fog of War)
        // Tạo một lớp phủ màu đen toàn màn hình
        this.darkOverlay = this.add.graphics();
        this.darkOverlay.fillStyle(0x020205, 0.99); // Rất tối
        this.darkOverlay.fillRect(0, 0, width, height);
        this.darkOverlay.setDepth(100); // Đảm bảo đè lên mọi thứ
        this.darkOverlay.setVisible(false);

        // Tạo mặt nạ (Mask) để đục lỗ ánh sáng xung quanh người chơi
        this.maskGraphics = this.make.graphics();
        this.mask = this.maskGraphics.createGeometryMask();
        this.mask.setInvert(true); // Invert: phần vẽ hình tròn sẽ được đục lỗ (sáng), phần còn lại tối
        this.darkOverlay.setMask(this.mask);

        // 5. Text hiển thị thời gian / thông báo
        this.timerText = this.add.text(width / 2, 30, 'ĐỢI START...', {
            fontFamily: 'Outfit, Arial',
            fontSize: '24px',
            fontWeight: '800',
            fill: '#00f0ff'
        }).setOrigin(0.5).setDepth(200);

        this.statusText = this.add.text(width / 2, height / 2, '', {
            fontFamily: 'Outfit, Arial',
            fontSize: '48px',
            fontWeight: '800',
            fill: '#ff3838'
        }).setOrigin(0.5).setDepth(200).setVisible(false);

        // 6. Nhận dữ liệu mạng
        network.onStateUpdate = (state) => this.onNetworkStateUpdate(state);

        // Spawns người chơi ban đầu
        this.syncPlayers(network.players);
        this.isGameRunning = true;

        // Nếu là Host, chạy game loop tính toán
        if (network.isHost) {
            this.hostTimer = 0;
            this.hostLightCycle = 'light'; // 'light' hoặc 'dark'
            this.hostCycleTimer = 3; // Bắt đầu bằng 3s sáng

            // Xử lý va chạm giữa các người chơi (để Sát Thủ chém)
            this.physics.add.collider(this.playersGroup, this.walls);
        }
    }

    createWall(x, y, w, h) {
        // Vẽ tường neon
        let wallGraphic = this.add.graphics();
        wallGraphic.fillStyle(0x1a2230, 1);
        wallGraphic.fillRect(x - w / 2, y - h / 2, w, h);

        // Viền neon phát sáng
        wallGraphic.lineStyle(2, 0x242f41, 1);
        wallGraphic.strokeRect(x - w / 2, y - h / 2, w, h);
        wallGraphic.setDepth(5);

        // Add vật lý static
        const wall = this.walls.create(x, y);
        wall.setDisplaySize(w, h);
        wall.refreshBody();
        wall.setVisible(false); // Ẩn sprite mặc định của phaser, chỉ dùng graphic vẽ ở trên
    }

    // Đồng bộ người chơi từ dữ liệu phòng chờ
    syncPlayers(networkPlayers) {
        // Tạo group vật lý cho người chơi (chỉ có tác dụng ở Host, Client chỉ hiển thị)
        this.playersGroup = this.physics.add.group();

        Object.values(networkPlayers).forEach(p => {
            // Tạo sprite người chơi
            const playerSprite = this.physics.add.sprite(p.x, p.y, 'player_base');
            playerSprite.setTint(this.colorToHex(p.color));
            playerSprite.setCollideWorldBounds(true);
            playerSprite.setCircle(14, 2, 2);
            playerSprite.setDepth(10);

            this.playersGroup.add(playerSprite);
            this.players[p.id] = playerSprite;

            // Tạo text tên người chơi
            const nameText = this.add.text(p.x, p.y - 25, p.name, {
                fontFamily: 'Outfit, Arial',
                fontSize: '12px',
                fontWeight: '600',
                fill: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5).setDepth(15);

            this.playerNames[p.id] = nameText;
        });
    }

    colorToHex(colorStr) {
        return parseInt(colorStr.replace('#', '0x'));
    }

    // Xáo phím điều khiển ngẫu nhiên (Wrong Way)
    shuffleControls() {
        const actions = ['up', 'down', 'left', 'right'];
        const keys = ['up', 'down', 'left', 'right'];

        // Fisher-Yates shuffle để hoán đổi ngẫu nhiên các hướng
        for (let i = actions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [actions[i], actions[j]] = [actions[j], actions[i]];
        }

        this.keyMap = {};
        for (let i = 0; i < keys.length; i++) {
            this.keyMap[keys[i]] = actions[i];
        }

        console.log("Phím điều khiển bị xáo:", this.keyMap);
    }

    // Đưa phím điều khiển về bình thường
    resetControls() {
        this.keyMap = { up: 'up', down: 'down', left: 'left', right: 'right' };
        console.log("Phím điều khiển đã reset về mặc định.");
    }

    // Đọc input vật lý và map theo keyMap hiện tại
    getMappedInputs() {
        const inputs = { up: false, down: false, left: false, right: false };

        if (this.keys.up.isDown) inputs[this.keyMap.up] = true;
        if (this.keys.down.isDown) inputs[this.keyMap.down] = true;
        if (this.keys.left.isDown) inputs[this.keyMap.left] = true;
        if (this.keys.right.isDown) inputs[this.keyMap.right] = true;

        return inputs;
    }

    update(time, delta) {
        if (!this.isGameRunning) return;

        // 1. Client: Gửi input hiện tại tới Host (áp dụng map phím đảo)
        if (!network.isHost && network.conn) {
            const inputKeys = this.getMappedInputs();
            network.sendToHost({
                type: 'input',
                keys: inputKeys
            });
        }

        // 2. Host: Xử lý di chuyển vật lý và game loop
        if (network.isHost) {
            this.updateHostGameLoop(delta);
        }

        // 3. Cập nhật hệ thống Bóng Tối (Fog of War) cục bộ
        this.updateFogOfWar();
    }

    // Host xử lý input từ client
    handlePlayerInput(playerId, keys) {
        const pSprite = this.players[playerId];
        if (!pSprite || network.players[playerId].isDead) return;

        const speed = 180;
        let vx = 0;
        let vy = 0;

        if (keys.left) vx = -speed;
        else if (keys.right) vx = speed;

        if (keys.up) vy = -speed;
        else if (keys.down) vy = speed;

        // Đi chéo không bị nhanh hơn
        if (vx !== 0 && vy !== 0) {
            vx *= 0.7071;
            vy *= 0.7071;
        }

        pSprite.setVelocity(vx, vy);

        // Lưu x, y mới vào network state để broadcast
        network.players[playerId].x = pSprite.x;
        network.players[playerId].y = pSprite.y;
    }

    // Host chạy logic vòng lặp game
    updateHostGameLoop(delta) {
        // Cập nhật vị trí của chính Host (áp dụng map phím đảo nếu đang tối)
        const hostInput = this.getMappedInputs();
        this.handlePlayerInput(network.myId, hostInput);

        // Đếm ngược thời gian cycle sáng/tối
        this.hostCycleTimer -= delta / 1000;
        if (this.hostCycleTimer <= 0) {
            if (this.hostLightCycle === 'light') {
                this.hostLightCycle = 'dark';
                this.hostCycleTimer = 10; // Tắt đèn 10 giây
                this.playSynthSound(150, 0.4, 'sawtooth'); // Âm thanh tắt đèn bùng nổ
            } else {
                this.hostLightCycle = 'light';
                this.hostCycleTimer = 3; // Sáng đèn 3 giây
                this.playSynthSound(440, 0.2, 'sine'); // Âm thanh sáng đèn
            }
        }

        // Host kiểm tra va chạm giữa Sát Thủ và Con Mồi
        const playersList = Object.values(network.players);
        const slasher = playersList.find(p => p.isSlasher);

        if (slasher && !slasher.isDead) {
            playersList.forEach(victim => {
                if (victim.id !== slasher.id && !victim.isDead) {
                    const dist = Phaser.Math.Distance.Between(slasher.x, slasher.y, victim.x, victim.y);
                    if (dist < 28) { // Khoảng cách chạm nhau
                        victim.isDead = true;
                        this.playSynthSound(80, 0.5, 'square'); // Kêu cứu/chết
                        // Tạo vụ nổ hiệu ứng nhỏ tại chỗ chết
                        this.broadcastElimination(victim.id);
                    }
                }
            });
        }

        // Kiểm tra xem Game Over chưa
        const aliveSurvivors = playersList.filter(p => !p.isSlasher && !p.isDead);
        let gameOver = false;
        let winnerText = '';

        if (aliveSurvivors.length === 0) {
            gameOver = true;
            winnerText = 'SÁT THỦ THẮNG!';
        }

        // Phát sóng trạng thái mới tới toàn bộ client
        network.broadcast({
            type: 'state_update',
            players: network.players,
            timer: Math.ceil(this.hostCycleTimer),
            isDark: this.hostLightCycle === 'dark',
            gameOver: gameOver,
            winnerText: winnerText
        });

        // Xử lý Host cục bộ
        this.onNetworkStateUpdate({
            players: network.players,
            timer: Math.ceil(this.hostCycleTimer),
            isDark: this.hostLightCycle === 'dark',
            gameOver: gameOver,
            winnerText: winnerText
        });
    }

    // Phát hiện người chơi chết
    broadcastElimination(victimId) {
        network.broadcast({
            type: 'eliminated',
            victimId: victimId
        });
    }

    // Nhận dữ liệu đồng bộ mạng và cập nhật hiển thị
    onNetworkStateUpdate(state) {
        this.timer = state.timer;
        this.isDark = state.isDark;

        // Cập nhật vị trí của tất cả người chơi
        Object.keys(state.players).forEach(id => {
            const pData = state.players[id];
            const pSprite = this.players[id];
            const pText = this.playerNames[id];

            if (pSprite && pText) {
                // Di chuyển mượt (nếu là client, lerp nhẹ hoặc set thẳng tọa độ)
                if (id !== network.myId || !network.isHost) {
                    pSprite.x = pData.x;
                    pSprite.y = pData.y;
                }
                pText.x = pSprite.x;
                pText.y = pSprite.y - 25;

                // Nếu chết thì ẩn đi hoặc chuyển thành bóng ma
                if (pData.isDead) {
                    pSprite.setAlpha(0.2); // Thành ma mờ mờ
                    pText.setAlpha(0.2);
                } else {
                    pSprite.setAlpha(1);
                    pText.setAlpha(1);
                }

                // Tô màu đỏ nổi bật cho Sát Thủ (chỉ hiện khi Đèn Sáng)
                if (pData.isSlasher && !this.isDark) {
                    pSprite.setTint(0xff3838); // Màu đỏ sát thủ
                } else {
                    pSprite.setTint(this.colorToHex(pData.color));
                }
            }
        });

        // Cập nhật text trạng thái đèn và xử lý xáo phím cục bộ
        if (this.isDark) {
            this.timerText.setText(`BÓNG TỐI: ${this.timer}s`);
            this.timerText.setColor('#ff3838');
            this.darkOverlay.setVisible(true);

            // Bắt đầu chu kỳ xáo phím khi trời tối
            if (!this.hasShuffledThisCycle) {
                this.shuffleControls();
                this.hasShuffledThisCycle = true;

                // Hiển thị text cảnh báo xáo phím
                this.timerText.setText(`BÓNG TỐI: ${this.timer}s (ĐẢO PHÍM!)`);
                this.playSynthSound(300, 0.15, 'sawtooth'); // Âm thanh cảnh báo đảo phím phụ
            }
        } else {
            this.timerText.setText(`ĐÈN SÁNG: ${this.timer}s`);
            this.timerText.setColor('#00f0ff');
            this.darkOverlay.setVisible(false);

            // Reset phím về bình thường khi đèn sáng
            if (this.hasShuffledThisCycle) {
                this.resetControls();
                this.hasShuffledThisCycle = false;
            }
        }

        // Xử lý kết thúc game
        if (state.gameOver) {
            this.isGameRunning = false;
            this.statusText.setText(state.winnerText);
            this.statusText.setVisible(true);
            this.playSynthSound(600, 0.8, 'sine'); // Còi kết thúc ván

            // Đưa về lobby sau 5 giây
            this.time.delayedCall(5000, () => {
                this.statusText.setVisible(false);
                network.handleDisconnect();
            });
        }
    }

    // Vẽ mặt nạ đục lỗ ánh sáng xung quanh người chơi
    updateFogOfWar() {
        if (!this.isDark || !this.isGameRunning) return;

        this.maskGraphics.clear();

        // Lấy thông tin người chơi của tab này
        const myPlayer = this.players[network.myId];
        if (myPlayer) {
            // Vẽ vòng tròn sáng xung quanh mình (bán kính 120px)
            const radius = network.players[network.myId].isDead ? 200 : 100; // Ma nhìn rộng hơn
            this.maskGraphics.fillStyle(0xffffff);
            this.maskGraphics.fillCircle(myPlayer.x, myPlayer.y, radius);
        }
    }

    // Tạo âm thanh Synth retro (Không cần file nhạc)
    playSynthSound(frequency, duration, type = 'sine') {
        try {
            const osc = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            // Giảm dần âm lượng về 0 (decay)
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            console.log('Không thể phát âm thanh synth:', e);
        }
    }
}

// Hàm khởi tạo game khi bấm start
function startPhaserGame() {
    // Ẩn Lobby UI
    document.getElementById('lobby-container').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: [GameScene]
    };

    if (gameInstance) {
        gameInstance.destroy(true);
    }
    gameInstance = new Phaser.Game(config);
}
