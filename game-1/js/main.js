// Binding giữa giao diện HTML (Lobby) và Hệ thống Mạng (PeerJS)

document.addEventListener('DOMContentLoaded', () => {
    const btnCreate = document.getElementById('btn-create');
    const btnJoin = document.getElementById('btn-join');
    const btnStart = document.getElementById('btn-start');
    const btnLeave = document.getElementById('btn-leave');
    const btnCopy = document.getElementById('btn-copy');
    
    const usernameInput = document.getElementById('username-input');
    const roomInput = document.getElementById('room-input');
    const roomCodeDisplay = document.getElementById('room-code-display');
    const playerList = document.getElementById('player-list');
    const playerCount = document.getElementById('player-count');
    const statusMessage = document.getElementById('status-message');

    const mainMenu = document.getElementById('main-menu');
    const roomLobby = document.getElementById('room-lobby');

    // Tự động sinh tên ngẫu nhiên cho người chơi
    usernameInput.value = 'Player_' + Math.floor(100 + Math.random() * 900);

    // Kiểm tra xem có phòng trên URL tham số không (ví dụ: ?room=ABCDE)
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
        roomInput.value = roomParam.toUpperCase();
    }

    // 1. Cập nhật Status UI
    network.onStatus = (msg) => {
        statusMessage.textContent = msg;
    };

    // 2. Cập nhật Danh Sách Người Chơi
    network.onPlayerListUpdate = (players) => {
        playerList.innerHTML = '';
        playerCount.textContent = players.length;

        players.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p.name;
            li.style.borderLeft = `4px solid ${p.color}`;
            
            if (p.isHost) {
                li.classList.add('host');
            }
            if (p.id === network.myId) {
                li.classList.add('me');
                li.textContent += ' (Bạn)';
            }
            playerList.appendChild(li);
        });

        // Chỉ hiển thị nút Start Game nếu là Host và có từ 2 người chơi trở lên
        if (network.isHost && players.length >= 2) {
            btnStart.classList.remove('hidden');
        } else {
            btnStart.classList.add('hidden');
        }
    };

    // 3. Sự kiện Bắt Đầu Game
    network.onGameStartTrigger = (slasherId) => {
        statusMessage.textContent = 'Trận đấu bắt đầu!';
        startPhaserGame(); // Hàm từ game.js
    };

    // Bấm Tạo phòng
    btnCreate.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Vui lòng nhập tên!');
            return;
        }

        network.init(username, () => {
            network.createRoom();
            mainMenu.classList.add('hidden');
            roomLobby.classList.remove('hidden');
        });
    });

    // Bấm Vào phòng
    btnJoin.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const code = roomInput.value.trim();

        if (!username) {
            alert('Vui lòng nhập tên!');
            return;
        }
        if (!code || code.length !== 5) {
            alert('Mã phòng phải có đúng 5 ký tự!');
            return;
        }

        network.init(username, () => {
            network.joinRoom(code);
            mainMenu.classList.add('hidden');
            roomLobby.classList.remove('hidden');
            roomCodeDisplay.textContent = code.toUpperCase();
        });
    });

    // Host bấm Bắt đầu
    btnStart.addEventListener('click', () => {
        network.startGame();
    });

    // Bấm Rời phòng
    btnLeave.addEventListener('click', () => {
        network.leaveRoom();
    });

    // Bấm sao chép link phòng
    btnCopy.addEventListener('click', () => {
        const code = network.roomCode || roomInput.value.trim();
        if (!code) return;

        const shareUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            btnCopy.textContent = 'Đã sao chép!';
            setTimeout(() => {
                btnCopy.textContent = 'Sao chép link';
            }, 2000);
        }).catch(err => {
            console.error('Không thể sao chép link:', err);
        });
    });
});
