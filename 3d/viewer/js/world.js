export const TILE_SIZE = 32;

// 0 = empty, 1 = solid ground/wall
export const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export function drawWorld(ctx, camera) {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            const x = col * TILE_SIZE - camera.x;
            const y = row * TILE_SIZE - camera.y;

            if (x > -TILE_SIZE && x < ctx.canvas.width &&
                y > -TILE_SIZE && y < ctx.canvas.height) {
                
                if (tile === 1) {
                    ctx.fillStyle = '#222'; // Dark underground rock
                    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                    // Add subtle texture
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fillRect(x + 4, y + 4, TILE_SIZE-8, TILE_SIZE-8);
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
                return true; 
            }
            if (map[row][col] === 1) {
                return true;
            }
        }
    }
    return false;
}
