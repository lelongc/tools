const fs = require('fs');

const ROWS = 30;
const COLS = 650;
const FLOOR_ROW = 24;

let map = [];
for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
        // Ceiling and absolute floor
        if (r === 0 || r === ROWS - 1) {
            row.push(1);
        }
        // General floor from ROW 24 down
        else if (r >= FLOOR_ROW) {
            row.push(1);
        } else {
            row.push(0);
        }
    }
    map.push(row);
}

function drawPlatform(colStart, colEnd, row, type = 1) {
    for (let c = colStart; c <= colEnd; c++) {
        if (c >= 0 && c < COLS && row >= 0 && row < ROWS) {
            map[row][c] = type;
        }
    }
}

function drawWall(col, rowStart, rowEnd, type = 1) {
    for (let r = rowStart; r <= rowEnd; r++) {
        if (col >= 0 && col < COLS && r >= 0 && r < ROWS) {
            map[r][col] = type;
        }
    }
}

function drawAcidPool(colStart, colEnd) {
    for (let c = colStart; c <= colEnd; c++) {
        map[FLOOR_ROW][c] = 4; // Acid
        map[FLOOR_ROW+1][c] = 4;
        map[FLOOR_ROW-1][c] = 0; // Clear above
    }
}

function drawPit(colStart, colEnd) {
    for (let c = colStart; c <= colEnd; c++) {
        for(let r = FLOOR_ROW; r < ROWS-1; r++) {
            map[r][c] = 0; // Empty pit
        }
    }
}

// ======================================
// ACT 1: 0 - 179 (Cyber Lab)
// ======================================
// Room 1-2 (x=1000): col 31
drawPlatform(35, 38, 20); // Under mem_01 (x=1200, y=720 -> col 37, row 22)

// Room 1-4 Save Point (x=2500): col 78 - flat floor

// Room 1-8 (x=4800): col 150
// mem_02 (x=4900, y=600 -> col 153, row 18)
drawPlatform(151, 155, 20); // jump platform
drawPlatform(152, 154, 18); // higher platform for mem_02

// Boss Warden (x=5400): col 168
// Flat arena

// ======================================
// ACT 2: 180 - 359 (Toxic Depths)
// ======================================
drawWall(180, 10, FLOOR_ROW);
map[23][180] = 0; map[22][180] = 0; // gap

drawAcidPool(190, 195);
drawPlatform(192, 193, 20);

// Save point (x=7200): col 225
drawWall(210, 15, FLOOR_ROW, 1);
map[23][210] = 0; map[22][210] = 0; // dash gap

// mem_03 (x=7500, y=400 -> col 234, row 12)
drawPlatform(232, 236, 18);
drawPlatform(233, 235, 15); // steps to mem_03

drawAcidPool(250, 260);
map[22][252] = 2; map[23][252] = 1; // floating bounce pad

drawAcidPool(280, 295);
for(let i=282; i<295; i+=4) {
    drawPlatform(i, i+1, 20, 6); // unstable blocks over acid
}

// mem_04 (x=10500, y=500 -> col 328, row 15)
drawWall(310, 10, FLOOR_ROW, 5); // slime wall
drawWall(320, 10, 20, 5); // slime wall
drawPlatform(326, 330, 18); // under mem_04

// Boss Mother Vine (x=11200): col 350
drawPlatform(348, 352, 18); // platform for raining acid phase

// ======================================
// ACT 3: 360 - 539 (Void Core)
// ======================================
// Laser Corridor is handled in GameScene.js logic

drawPit(370, 380);
drawPlatform(373, 376, 20);

drawPit(390, 400);
drawPlatform(392, 394, 20, 6);
drawPlatform(398, 400, 15, 6);

// Save point (x=13000): col 406 - safe zone

// mem_05 (x=13500, y=200 -> col 421, row 6)
// We need tall platforms or wall jumps
drawWall(415, 10, FLOOR_ROW, 5);
drawWall(425, 10, FLOOR_ROW, 5);
drawPlatform(420, 422, 10); // under mem_05

// Maze (x=15200): col 475
for(let i=460; i<490; i+=10) {
    drawWall(i, 15, FLOOR_ROW);
    map[23][i] = 0; map[22][i] = 0;
    map[16][i] = 0; map[15][i] = 0;
}

// mem_07 (x=15500, y=400 -> col 484, row 12)
drawPlatform(482, 486, 14);

drawPit(500, 510);
drawPlatform(502, 504, 20, 3); // ice
drawPlatform(506, 508, 16, 3);

// Boss Archive Keeper (x=16000): col 500? Wait, x=16000 is col 500. Boss spawn is at 16000.
// Let's ensure 495-515 is mostly flat or has some nice platforms
// I'll overwrite pit 500-510 with flat for boss
for (let c = 495; c <= 515; c++) {
    map[FLOOR_ROW][c] = 1;
    for(let r = FLOOR_ROW+1; r < ROWS-1; r++) { map[r][c] = 1; }
}
drawPlatform(498, 502, 18);
drawPlatform(508, 512, 18);

// ======================================
// ACT 4: 540 - 649 (Central Core)
// ======================================
for(let i=540; i<580; i++) {
    map[10][i] = 1; // low ceiling
    if(i % 15 === 0) drawWall(i, 10, 18);
}

// Save point (x=18000): col 562

// mem_08 (x=18500, y=750 -> col 578, row 23)
// Flat

// Lily's Toy (x=19360 -> col 605, row 14)
drawWall(602, 10, 24);
drawWall(608, 10, 24);
drawPlatform(602, 608, 10);
drawPlatform(602, 608, 16);
map[15][602] = 0; map[14][602] = 0; // entry hole

// Final Boss Arena (x=20000): col 625-649
// Flat arena

let mapStr = "export const map = [\n";
for (let r = 0; r < ROWS; r++) {
    mapStr += "    [" + map[r].join(",") + "],\n";
}
mapStr += "];\n";

const worldPath = 'd:/folder/tools/3d/viewer/js/world.js?v=1783257459';
let worldContent = fs.readFileSync(worldPath, 'utf8');
const regex = /export const map = \[\s*(?:\[.*?\]\s*,?\s*)*\];/;
worldContent = worldContent.replace(regex, mapStr.trim());
fs.writeFileSync(worldPath, worldContent);
console.log("Map generated beautifully!");
