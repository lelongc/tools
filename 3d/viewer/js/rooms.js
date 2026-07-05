// Định nghĩa cấu trúc từng phòng cho ACT 1 (Khu Cách Ly)
// Kích thước: mỗi tile = 32px. 19 dòng x N cột.
// Row 0 = trần, Row 18 = sàn. Player đi trên sàn row 18 (body ở row 17).
// Doors: y=17, height=3 → mở rows 17,16,15 để player đi qua được.

// ====== MAP PARSER ======
// Legend: # = Solid(1), ^ = Bounce(2), I = Ice(3), ~ = Acid(4), S = Slime(5), U = Unstable(6), . = Empty(0)
export function createRoomFromString(strMap) {
    const map = [];
    const lines = strMap.trim().split('\n');
    for (let r = 0; r < lines.length; r++) {
        const row = [];
        const line = lines[r].trim();
        if (!line) continue;
        for (let c = 0; c < line.length; c++) {
            const char = line[c];
            if (char === '#') row.push(1);
            else if (char === '^') row.push(2);
            else if (char === 'I') row.push(3);
            else if (char === '~') row.push(4);
            else if (char === 'S') row.push(5);
            else if (char === 'U') row.push(6);
            else row.push(0);
        }
        map.push(row);
    }
    return map;
}

// Tạo phòng hộp trống (dùng cho rooms 1-4 tới 1-9)
function createEmptyRoom(widthTiles, heightTiles) {
    const map = [];
    for (let r = 0; r < heightTiles; r++) {
        const row = [];
        for (let c = 0; c < widthTiles; c++) {
            if (r === 0 || r === heightTiles - 1 || c === 0 || c === widthTiles - 1) {
                row.push(1);
            } else {
                row.push(0);
            }
        }
        map.push(row);
    }
    return map;
}

// ============================
// MAP STRINGS (mỗi row PHẢI đúng width ký tự, tổng 19 rows)
// ============================

// Room 1-1: Tutorial (50 wide x 19 rows) — Phòng hộp đơn giản
// Row 18 = sàn cứng. Cửa phải ở col 49, rows 15-17 được đục.
const map1_1 = `
##################################################
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
#................................................#
##################################################
`;

// Room 1-2: Hành Lang Vỡ (75 wide x 19 rows)
// Sàn row 18 = solid với 3 hố acid nhỏ
// Có 2 platform lơ lửng ở row 8 và row 11
// Floor: ##########(10) ~~~~~~(6) ##################(18) ~~~~~~~(7) #################(17) ~~~~~~~(7) ##########(10) = 75
const map1_2 = `
###########################################################################
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.................................................######..................#
#.........................................................................#
#.........................................................................#
#........................######...........................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
##########~~~~~~##################~~~~~~~#################~~~~~~~##########
`;

// Room 1-3: Phòng Thí Nghiệm (75 wide x 19 rows)
// Sàn row 18 = solid với 4 hố acid nhỏ hơn
// Platform cho spitter ở row 8 (cols 29-34) và row 10 (cols 49-54)
// Platform thấp ở row 13 (cols 14-19)
// Floor: ########(8) ~~~~~~(6) #########(9) ~~~~~~(6) #########(9) ~~~~~~(6) #########(9) ~~~~~~(6) ################(16) = 75
const map1_3 = `
###########################################################################
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#............................######.......................................#
#.........................................................................#
#................................................######...................#
#.........................................................................#
#.........................................................................#
#.............######......................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
#.........................................................................#
########~~~~~~#########~~~~~~#########~~~~~~#########~~~~~~################
`;

// ============================
// ROOM DEFINITIONS
// ============================
// TẤT CẢ doors dùng y=17, height=3 → đục rows 17,16,15 → player ở row 17 đi qua được
const rooms = {
    '1-1': {
        id: '1-1',
        name: 'Phòng Tỉnh Giấc',
        width: 50,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createRoomFromString(map1_1),
        doors: [
            { x: 49, y: 17, toRoom: '1-2', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [],
        dialogue: [
            { type: 'onEnter', text: "...Anh ơi? Anh nghe em nói không? Đừng sợ. Hệ thống thần kinh đang khởi động lại... Cử động thử đi anh.", avatar: 'normal' },
            { type: 'onMove', text: "Tốt lắm. Cơ thể mới đang phản hồi tốt. Anh thật tuyệt vời.", avatar: 'normal' }
        ]
    },
    '1-2': {
        id: '1-2',
        name: 'Hành Lang Vỡ',
        width: 75,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createRoomFromString(map1_2),
        doors: [
            { x: 0, y: 17, toRoom: '1-1', toX: 47, toY: 17, width: 1, height: 3 },
            { x: 74, y: 17, toRoom: '1-3', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'crawler', x: 20 * 32, y: 16 * 32 },
            { type: 'crawler', x: 50 * 32, y: 16 * 32 }
        ],
        dialogue: [
            { type: 'onEnter', text: "Cẩn thận anh! Có sinh vật đột biến phía trước. Hãy dùng cánh tay để tự vệ - nhấn J để chém. Đừng rơi xuống hố acid!", avatar: 'normal' },
            { type: 'onEnemyKill', text: "Giỏi lắm anh yêu! Xé xác chúng ra! ...À, ý em là, anh tự vệ rất tốt.", avatar: 'normal' }
        ]
    },
    '1-3': {
        id: '1-3',
        name: 'Phòng Thí Nghiệm Bỏ Hoang',
        width: 75,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createRoomFromString(map1_3),
        doors: [
            { x: 0, y: 17, toRoom: '1-2', toX: 72, toY: 17, width: 1, height: 3 },
            { x: 74, y: 17, toRoom: '1-4', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'crawler', x: 5 * 32, y: 16 * 32 },
            { type: 'spitter', x: 32 * 32, y: 7 * 32 },
            { type: 'spitter', x: 52 * 32, y: 9 * 32 }
        ],
        dialogue: [
            { type: 'onEnter', text: "Khu vực này từng là nơi em làm việc... Trước khi mọi thứ sụp đổ. Đừng nhìn vào những bức ảnh đó, anh. Chúng không quan trọng nữa.", avatar: 'worried' }
        ]
    },
    '1-4': {
        id: '1-4',
        name: 'Trạm Lưu Trữ Đầu Tiên',
        width: 25,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createEmptyRoom(25, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-3', toX: 72, toY: 17, width: 1, height: 3 },
            { x: 24, y: 17, toRoom: '1-5', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [],
        dialogue: [
            { type: 'onEnter', text: "Đây là Trạm Lưu Trữ. Anh có thể nghỉ ngơi ở đây. Em sẽ luôn ở bên cạnh anh... Luôn luôn.", avatar: 'normal' }
        ]
    },
    '1-5': {
        id: '1-5',
        name: 'Hành Lang Cách Ly 1',
        width: 50,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createEmptyRoom(50, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-4', toX: 22, toY: 17, width: 1, height: 3 },
            { x: 49, y: 17, toRoom: '1-6', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'spitter', x: 800, y: 500 },
            { type: 'crawler', x: 1000, y: 500 }
        ],
        dialogue: []
    },
    '1-6': {
        id: '1-6',
        name: 'Hành Lang Cách Ly 2',
        width: 50,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createEmptyRoom(50, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-5', toX: 47, toY: 17, width: 1, height: 3 },
            { x: 49, y: 17, toRoom: '1-7', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'crawler', x: 600, y: 500 },
            { type: 'crawler', x: 800, y: 500 },
            { type: 'spitter', x: 1200, y: 500 }
        ],
        dialogue: [
            { type: 'onDamage', text: "Anh bị thương rồi! Đau không anh? Em xin lỗi... Em đã nên thiết kế cơ thể anh tốt hơn... Em sẽ bù đắp cho anh.", avatar: 'worried' }
        ]
    },
    '1-7': {
        id: '1-7',
        name: 'Hành Lang Cách Ly 3',
        width: 50,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createEmptyRoom(50, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-6', toX: 47, toY: 17, width: 1, height: 3 },
            { x: 49, y: 17, toRoom: '1-8', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'spitter', x: 700, y: 500 },
            { type: 'spitter', x: 1100, y: 500 }
        ],
        dialogue: [
            { type: 'onIdle15s', text: "Anh ơi? Sao anh dừng lại? Đừng suy nghĩ nhiều... Cứ đi tiếp đi anh. Em đang chờ anh mà.", avatar: 'normal' }
        ]
    },
    '1-8': {
        id: '1-8',
        name: 'Hành Lang Cách Ly 4',
        width: 75,
        height: 19,
        bgm: 'bgm_quarantine',
        map: createEmptyRoom(75, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-7', toX: 47, toY: 17, width: 1, height: 3 },
            { x: 74, y: 17, toRoom: '1-9', toX: 2, toY: 17, width: 1, height: 3 }
        ],
        spawns: [
            { type: 'floater', x: 800, y: 300 },
            { type: 'crawler', x: 1200, y: 500 },
            { type: 'spitter', x: 1600, y: 500 }
        ],
        dialogue: []
    },
    '1-9': {
        id: '1-9',
        name: 'Phòng Boss - Warden',
        width: 50,
        height: 19,
        bgm: 'bgm_boss',
        map: createEmptyRoom(50, 19),
        doors: [
            { x: 0, y: 17, toRoom: '1-8', toX: 72, toY: 17, width: 1, height: 3 }
            // No exit door until boss is dead
        ],
        spawns: [
            { type: 'warden', x: 1000, y: 500 }
        ],
        dialogue: [
            { type: 'onEnter', text: "Cái robot đó... Nó là hệ thống an ninh cũ, đã hóa điên. Tiêu diệt nó đi anh. Đừng để nó ngăn cản chúng ta.", avatar: 'angry' }
        ]
    }
};

// ============================
// ĐỤC LỖ CỬA — mở tường tại vị trí door để player đi qua
// ============================
for (const roomId in rooms) {
    const room = rooms[roomId];
    for (const door of room.doors) {
        for (let dy = 0; dy < door.height; dy++) {
            const row = door.y - dy;
            if (row >= 0 && row < room.map.length && door.x >= 0 && door.x < room.map[row].length) {
                room.map[row][door.x] = 0;
            }
        }
    }
}

// Thêm platform cho phòng Boss 1-9
rooms['1-9'].map[12][15] = 1;
rooms['1-9'].map[12][16] = 1;
rooms['1-9'].map[12][17] = 1;
rooms['1-9'].map[12][18] = 1;

rooms['1-9'].map[12][35] = 1;
rooms['1-9'].map[12][36] = 1;
rooms['1-9'].map[12][37] = 1;
rooms['1-9'].map[12][38] = 1;

export { rooms };
