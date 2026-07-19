// Quản lý kết nối mạng PeerJS P2P cho BLACKOUT
class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null; // Kết nối tới Host (dành cho Client)
        this.connections = {}; // Danh sách kết nối của Host (key: peerId, value: connection)
        this.players = {}; // Metadata người chơi (key: peerId, value: {name, color, host, x, y, isDead, isSlasher})

        this.isHost = false;
        this.roomCode = '';
        this.myId = '';
        this.username = 'Player';

        // Callbacks từ UI / Game Scene
        this.onPlayerListUpdate = null;
        this.onGameStartTrigger = null;
        this.onStateUpdate = null;
        this.onStatus = null;
    }

    // Khởi tạo PeerJS
    init(username, callback) {
        this.username = username || 'Player';
        this.status('Đang kết nối tới server PeerJS...');

        // Tạo Peer mới
        this.peer = new Peer(null, {
            debug: 1 // Chỉ hiện lỗi
        });

        this.peer.on('open', (id) => {
            this.myId = id;
            this.status('Đã kết nối. Sẵn sàng tạo hoặc vào phòng.');
            if (callback) callback(id);
        });

        this.peer.on('error', (err) => {
            console.error('Lỗi PeerJS:', err);
            this.status('Lỗi kết nối: ' + err.type);
        });
    }

    // Host: Tạo phòng
    createRoom() {
        this.isHost = true;
        // Sử dụng 5 ký tự ngẫu nhiên làm mã phòng (chữ in hoa)
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        // Re-init Peer với ID cố định là mã phòng để dễ vào
        this.status('Đang tạo phòng ' + code + '...');

        if (this.peer) {
            this.peer.destroy();
        }

        this.peer = new Peer('BO-' + code, { debug: 1 });

        this.peer.on('open', (id) => {
            this.roomCode = code;
            this.myId = id;
            this.status('Phòng đã được tạo!');

            // Add bản thân vào danh sách player
            this.players[this.myId] = {
                id: this.myId,
                name: this.username,
                color: this.getRandomColor(),
                isHost: true,
                x: 400,
                y: 300,
                isDead: false,
                isSlasher: false
            };

            this.updateLobby();
            this.setupHostListeners();
        });

        this.peer.on('error', (err) => {
            if (err.type === 'unavailable-id') {
                // Trùng ID phòng, tạo lại
                this.createRoom();
            } else {
                this.status('Không thể tạo phòng: ' + err.message);
            }
        });
    }

    // Client: Vào phòng
    joinRoom(code) {
        this.isHost = false;
        this.roomCode = code.toUpperCase().trim();
        const targetId = 'BO-' + this.roomCode;

        this.status('Đang kết nối tới phòng ' + this.roomCode + '...');

        this.conn = this.peer.connect(targetId, {
            reliable: true
        });

        this.conn.on('open', () => {
            this.status('Đã kết nối tới phòng. Đang đăng ký thông tin...');
            // Gửi thông tin đăng ký cho Host
            this.sendToHost({
                type: 'join',
                name: this.username,
                color: this.getRandomColor()
            });
            this.setupClientListeners();
        });

        this.conn.on('error', (err) => {
            this.status('Lỗi kết nối phòng: ' + err.message);
        });

        this.conn.on('close', () => {
            this.status('Kết nối tới phòng đã bị ngắt.');
            this.handleDisconnect();
        });
    }

    // Host lắng nghe kết nối mới
    setupHostListeners() {
        this.peer.on('connection', (conn) => {
            const clientPeerId = conn.peer;
            this.connections[clientPeerId] = conn;

            conn.on('data', (data) => {
                this.handleDataFromClient(clientPeerId, data);
            });

            conn.on('close', () => {
                this.status('Người chơi ngắt kết nối: ' + (this.players[clientPeerId]?.name || clientPeerId));
                delete this.connections[clientPeerId];
                delete this.players[clientPeerId];
                this.updateLobby();
                this.broadcast({
                    type: 'lobby_update',
                    players: this.players
                });
            });
        });
    }

    // Client lắng nghe dữ liệu từ Host
    setupClientListeners() {
        this.conn.on('data', (data) => {
            this.handleDataFromHost(data);
        });
    }

    // Xử lý dữ liệu tại Host
    handleDataFromClient(playerId, data) {
        if (data.type === 'join') {
            // Giới hạn 8 người
            if (Object.keys(this.players).length >= 8) {
                this.connections[playerId].send({ type: 'error', message: 'Phòng đã đầy!' });
                this.connections[playerId].close();
                return;
            }

            // Lưu thông tin người chơi mới
            this.players[playerId] = {
                id: playerId,
                name: data.name,
                color: data.color,
                isHost: false,
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 400,
                isDead: false,
                isSlasher: false
            };

            this.status('Người chơi mới: ' + data.name);
            this.updateLobby();

            // Gửi danh sách người chơi mới cho tất cả mọi người
            this.broadcast({
                type: 'lobby_update',
                players: this.players
            });
        }
        else if (data.type === 'input') {
            // Client gửi phím bấm di chuyển
            if (gameInstance && gameInstance.scene.getScene('GameScene')) {
                gameInstance.scene.getScene('GameScene').handlePlayerInput(playerId, data.keys);
            }
        }
    }

    // Xử lý dữ liệu tại Client
    handleDataFromHost(data) {
        if (data.type === 'lobby_update') {
            this.players = data.players;
            this.updateLobby();
        }
        else if (data.type === 'start_game') {
            this.players = data.players;
            if (this.onGameStartTrigger) {
                this.onGameStartTrigger();
            }
        }
        else if (data.type === 'state_update') {
            if (this.onStateUpdate) {
                this.onStateUpdate(data);
            }
        }
        else if (data.type === 'trigger_shuffle') {
            if (gameInstance && gameInstance.scene.getScene('GameScene')) {
                gameInstance.scene.getScene('GameScene').handleShuffleTrigger();
            }
        }
        else if (data.type === 'error') {
            this.status(data.message);
            alert(data.message);
        }
    }

    // Bắt đầu game (Chỉ Host gọi)
    startGame() {
        if (!this.isHost) return;

        const playerIds = Object.keys(this.players);
        if (playerIds.length < 2) {
            alert('Cần ít nhất 2 người để chơi!');
            return;
        }

        // Chọn ngẫu nhiên 1 người làm Sát Thủ
        const slasherId = playerIds[Math.floor(Math.random() * playerIds.length)];

        // Reset trạng thái người chơi
        playerIds.forEach(id => {
            this.players[id].isDead = false;
            this.players[id].isSlasher = (id === slasherId);
            // Spawn ngẫu nhiên trong map
            this.players[id].x = 100 + Math.random() * 600;
            this.players[id].y = 100 + Math.random() * 400;
        });

        // Gửi lệnh start cho tất cả client
        this.broadcast({
            type: 'start_game',
            players: this.players,
            slasherId: slasherId
        });

        // Trigger local game start
        if (this.onGameStartTrigger) {
            this.onGameStartTrigger(slasherId);
        }
    }

    // Gửi data tới tất cả các clients (Host gọi)
    broadcast(data) {
        if (!this.isHost) return;
        Object.values(this.connections).forEach(conn => {
            if (conn.open) {
                conn.send(data);
            }
        });
    }

    // Gửi data tới Host (Client gọi)
    sendToHost(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    // Cập nhật giao diện phòng chờ
    updateLobby() {
        if (this.onPlayerListUpdate) {
            this.onPlayerListUpdate(Object.values(this.players));
        }
    }

    // In trạng thái ra UI
    status(msg) {
        console.log('[Network]', msg);
        if (this.onStatus) this.onStatus(msg);
    }

    // Thoát/Rời phòng
    leaveRoom() {
        if (this.conn) {
            this.conn.close();
        }
        if (this.peer) {
            this.peer.destroy();
        }
        this.handleDisconnect();
    }

    handleDisconnect() {
        this.isHost = false;
        this.roomCode = '';
        this.connections = {};
        this.players = {};
        this.conn = null;

        // Reset UI về Main Menu
        document.getElementById('room-lobby').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('lobby-container').classList.remove('hidden');

        // Reload lại Peer cho lượt chơi mới
        this.init(this.username);
    }

    // Sinh màu ngẫu nhiên cho nhân vật (màu Neon rực rỡ)
    getRandomColor() {
        const neonColors = [
            '#00f0ff', // Cyan
            '#39ff14', // Green
            '#ff00ff', // Pink
            '#ffff00', // Yellow
            '#ff3838', // Red
            '#ff9900', // Orange
            '#b026ff', // Violet
            '#ffffff'  // White
        ];
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
}

// Khởi tạo biến toàn cầu
const network = new NetworkManager();
