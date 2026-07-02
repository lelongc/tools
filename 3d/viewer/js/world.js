export const TILE_SIZE = 32;

export const groundImg = new Image();
groundImg.src = 'assets/ground_block.png';

export const bounceImg = new Image();
bounceImg.src = 'assets/bounce_pad.png';

export const iceImg = new Image();
iceImg.src = 'assets/ice_block.png';

// 0 = empty
// 1 = solid ground/wall (Normal grip)
// 2 = bouncy pad (Spring)
// 3 = ice block (Slippery)
// 0 = Empty
// 1 = Solid Ground (Neon Cyan textured)
// 2 = Bouncy spring pad (Neon Green)
// 3 = Ice block (Neon Blue slippery)
export const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,3,3,1],
    [1,0,0,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1],
    [1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1],
    [1,1,1,0,2,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,1,1,1,1,2,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export function getTileType(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return 1; // Out of bounds is solid
    }
    return map[row][col];
}

export function drawWorld(ctx, camera) {
    const time = Date.now() / 1000;

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;

            if (x > -TILE_SIZE && x < ctx.canvas.width &&
                y > -TILE_SIZE && y < ctx.canvas.height) {
                
                if (tile !== 0) {
                    ctx.save();
                    
                    if (tile === 1) {
                        // Ground Block
                        if (groundImg.complete && groundImg.naturalWidth > 0) {
                            ctx.drawImage(groundImg, x, y, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#222';
                            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                        }
                    } else if (tile === 2) {
                        // Bounce Pad
                        if (bounceImg.complete && bounceImg.naturalWidth > 0) {
                            ctx.drawImage(bounceImg, x, y, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#0f0';
                            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                        }
                    } else if (tile === 3) {
                        // Ice Block
                        if (iceImg.complete && iceImg.naturalWidth > 0) {
                            ctx.drawImage(iceImg, x, y, TILE_SIZE, TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#00f';
                            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                        }
                    }
                    
                    ctx.restore();
                }
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
            if (map[row][col] !== 0) {
                return map[row][col];
            }
        }
    }
    return 0;
}
