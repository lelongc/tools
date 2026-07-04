export const TILE_SIZE = 32;

export const groundImg = new Image();
groundImg.src = 'assets/ground_block.png';

export const bounceImg = new Image();
bounceImg.src = 'assets/bounce_pad.png';

export const iceImg = new Image();
iceImg.src = 'assets/ice_block.png';

export const acidImg = new Image();
acidImg.src = 'assets/acid_pool.png';

export const slimeImg = new Image();
slimeImg.src = 'assets/slime_wall.png';

export const unstableImg = new Image();
unstableImg.src = 'assets/unstable_block.png';

// Tile Types:
// 0 = Empty
// 1 = Solid Ground (Cyber metal)
// 2 = Bouncy spring pad
// 3 = Ice block (Slippery)
// 4 = Acid pool (Damage on touch)
// 5 = Slime wall (Sticky wall-slide)
// 6 = Unstable block (Collapses after stepping)

// Zone boundaries (column ranges)
export function getZone(col) {
    if (col < 28) return 0; // Cyber Lab
    if (col < 56) return 1; // Toxic Depths
    return 2;               // Void Core
}

export const ZONE_NAMES = ['CYBER LAB', 'TOXIC DEPTHS', 'VOID CORE'];
export const ZONE_COLORS = [
    { primary: '#00ffff', bg: '#050520' },  // Cyan neon
    { primary: '#44ff44', bg: '#051005' },  // Toxic green
    { primary: '#cc44ff', bg: '#150520' },  // Void purple
];

// 80 columns × 30 rows
// Zone 1 (Cyber Lab): cols 0-27
// Zone 2 (Toxic Depths): cols 28-55
// Zone 3 (Void Core): cols 56-79
export const map = [
    // Row 0 - Top ceiling
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    // Row 1
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 2
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 3
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 4 - High platforms
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 5
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 6
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 7 - Zone 1 upper platforms
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,6,6,0,0,1],
    // Row 8
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 9
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],
    // Row 10
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,6,6,6,0,1],
    // Row 11
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,1],
    // Row 12 - Mid level
    [1,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 13
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    // Row 14
    [1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    // Row 15
    [1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 16
    [1,1,1,0,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 17 - Lower mid section
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,5,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,6,6,6,6,0,0,1],
    // Row 18
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 19
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 20
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 21
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],
    // Row 22
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,1],
    // Row 23
    [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 24
    [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 25 - Lower platforms  
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    // Row 26
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 27 - Near floor
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    // Row 28 - Ground floor
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    // Row 29 - Bottom wall
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Track unstable blocks for collapse/respawn
export const unstableBlocks = [];

// Initialize unstable block tracking
for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === 6) {
            unstableBlocks.push({
                row, col,
                state: 'solid',    // solid | shaking | gone
                timer: 0,
                shakeTime: 0.5,    // Time before collapse
                respawnTime: 3.0   // Time to respawn
            });
        }
    }
}

export function updateUnstableBlocks(dt) {
    for (const ub of unstableBlocks) {
        if (ub.state === 'shaking') {
            ub.timer -= dt;
            if (ub.timer <= 0) {
                ub.state = 'gone';
                ub.timer = ub.respawnTime;
                map[ub.row][ub.col] = 0; // Remove tile
            }
        } else if (ub.state === 'gone') {
            ub.timer -= dt;
            if (ub.timer <= 0) {
                ub.state = 'solid';
                map[ub.row][ub.col] = 6; // Restore tile
            }
        }
    }
}

export function triggerUnstable(row, col) {
    const ub = unstableBlocks.find(b => b.row === row && b.col === col && b.state === 'solid');
    if (ub) {
        ub.state = 'shaking';
        ub.timer = ub.shakeTime;
    }
}

export function getTileType(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return 1; // Out of bounds is solid
    }
    return map[row][col];
}

const tileImages = {
    1: groundImg,
    2: bounceImg,
    3: iceImg,
    4: acidImg,
    5: slimeImg,
    6: unstableImg
};

export function drawWorld(ctx, camera) {
    const time = Date.now() / 1000;

    // Only draw tiles visible on screen
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endCol = Math.min(map[0].length - 1, Math.floor((camera.x + 640) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endRow = Math.min(map.length - 1, Math.floor((camera.y + 480) / TILE_SIZE) + 1);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const tile = map[row][col];
            if (tile === 0) continue;

            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;

            const img = tileImages[tile];

            // Unstable block shaking effect
            let shakeX = 0, shakeY = 0;
            if (tile === 6) {
                const ub = unstableBlocks.find(b => b.row === row && b.col === col);
                if (ub && ub.state === 'shaking') {
                    shakeX = (Math.random() - 0.5) * 6;
                    shakeY = (Math.random() - 0.5) * 4;
                    // Flashing opacity
                    ctx.globalAlpha = 0.5 + Math.sin(time * 30) * 0.5;
                }
            }

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, x + shakeX, y + shakeY, TILE_SIZE, TILE_SIZE);
            } else {
                // Fallback colors
                const fallbackColors = { 1: '#222', 2: '#0f0', 3: '#00f', 4: '#0a0', 5: '#550', 6: '#a0a' };
                ctx.fillStyle = fallbackColors[tile] || '#222';
                ctx.fillRect(x + shakeX, y + shakeY, TILE_SIZE, TILE_SIZE);
            }

            // Reset alpha after unstable
            if (tile === 6) ctx.globalAlpha = 1.0;

            // Acid bubble animation
            if (tile === 4 && Math.random() < 0.02) {
                ctx.fillStyle = 'rgba(100, 255, 100, 0.6)';
                const bx = x + Math.random() * TILE_SIZE;
                const by = y + Math.random() * TILE_SIZE * 0.5;
                ctx.beginPath();
                ctx.arc(bx, by, 1 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// AABB collision detection returning detailed overlap info for platforming physics
export function getCollision(x, y, width, height) {
    const left = Math.floor(x / TILE_SIZE);
    const right = Math.floor((x + width - 0.01) / TILE_SIZE);
    const top = Math.floor(y / TILE_SIZE);
    const bottom = Math.floor((y + height - 0.01) / TILE_SIZE);

    for (let row = top; row <= bottom; row++) {
        for (let col = left; col <= right; col++) {
            if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
                return 1; 
            }
            const t = map[row][col];
            if (t !== 0 && t !== 4) { // Acid (4) is not solid - player falls through
                return t;
            }
        }
    }
    return 0;
}
