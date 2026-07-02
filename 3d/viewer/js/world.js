export const TILE_SIZE = 32;

export const tilesetImg = new Image();
tilesetImg.src = 'assets/tileset_pro.png';

// 0 = empty
// 1 = solid ground/wall (Normal grip)
// 2 = bouncy pad (Spring)
// 3 = ice block (Slippery)
export const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,3,3,3,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,2,2,0,0,0,0,0,0,0,0,1,1,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,2,2,0,0,1,1,1,1],
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
                    
                    if (tile === 1) { // Normal Ground (Neon Cyan)
                        if (tilesetImg.complete && tilesetImg.naturalWidth > 0) {
                            // Map the block to a section of the AI image
                            const tx = (col * TILE_SIZE * 2) % (tilesetImg.naturalWidth - TILE_SIZE);
                            const ty = (row * TILE_SIZE * 2) % (tilesetImg.naturalHeight - TILE_SIZE);
                            ctx.drawImage(tilesetImg, tx, ty, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
                            
                            // Blend it with neon vector aesthetic
                            ctx.fillStyle = 'rgba(0, 20, 30, 0.5)';
                            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                            ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
                        } else {
                            // Fallback procedural
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = 'rgba(0, 200, 255, 0.5)';
                            ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
                            ctx.fillStyle = 'rgba(0, 20, 30, 0.8)';
                            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
                        }
                        
                        // Procedural Vines on ceilings (if space below is empty)
                        if (row < map.length - 1 && map[row+1][col] === 0) {
                            const vineLength = 15 + ((col * 17) % 20);
                            let sway = Math.sin(time * 2 + col) * 5;
                            
                            // Player interaction sway
                            if (camera.player) {
                                const p = camera.player;
                                const dx = (x + TILE_SIZE/2) - (p.x + p.width/2);
                                const dy = (y + TILE_SIZE + vineLength) - (p.y + p.height/2);
                                const dist = Math.sqrt(dx*dx + dy*dy);
                                
                                if (dist < 50) {
                                    sway += p.vx * 0.05 * (1 - dist/50);
                                }
                            }

                            ctx.beginPath();
                            ctx.moveTo(x + TILE_SIZE/2, y + TILE_SIZE);
                            ctx.quadraticCurveTo(x + TILE_SIZE/2 + sway, y + TILE_SIZE + vineLength/2, x + TILE_SIZE/2 + sway * 1.5, y + TILE_SIZE + vineLength);
                            ctx.strokeStyle = 'rgba(0, 255, 200, 0.6)';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            
                            // Vine tip glow
                            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
                            ctx.beginPath();
                            ctx.arc(x + TILE_SIZE/2 + sway * 1.5, y + TILE_SIZE + vineLength, 2, 0, Math.PI*2);
                            ctx.fill();
                        }
                    } 
                    else if (tile === 2) { // Bouncy Pad (Neon Green/Yellow)
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = 'rgba(100, 255, 100, 0.8)';
                        ctx.strokeStyle = 'rgba(100, 255, 100, 1)';
                        ctx.lineWidth = 3;
                        
                        // Draw spring pad base
                        ctx.strokeRect(x + 4, y + TILE_SIZE/2, TILE_SIZE - 8, TILE_SIZE/2);
                        
                        // Draw spring coils
                        ctx.beginPath();
                        ctx.moveTo(x + 8, y + TILE_SIZE/2);
                        ctx.lineTo(x + TILE_SIZE - 8, y + 8);
                        ctx.moveTo(x + 8, y + 8);
                        ctx.lineTo(x + TILE_SIZE - 8, y + TILE_SIZE/2);
                        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                        ctx.stroke();
                        
                        ctx.fillStyle = 'rgba(20, 50, 20, 0.8)';
                        ctx.fillRect(x + 4, y + TILE_SIZE/2, TILE_SIZE - 8, TILE_SIZE/2);
                    }
                    else if (tile === 3) { // Ice Block (Glass/Blue)
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = 'rgba(200, 200, 255, 0.5)';
                        ctx.strokeStyle = 'rgba(200, 200, 255, 0.9)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
                        
                        // Glass reflection lines
                        ctx.beginPath();
                        ctx.moveTo(x + 4, y + TILE_SIZE - 4);
                        ctx.lineTo(x + TILE_SIZE - 4, y + 4);
                        ctx.moveTo(x + TILE_SIZE/2, y + TILE_SIZE - 4);
                        ctx.lineTo(x + TILE_SIZE - 4, y + TILE_SIZE/2);
                        ctx.stroke();
                        
                        ctx.fillStyle = 'rgba(150, 200, 255, 0.2)';
                        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
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
