import { drawWorld, map, TILE_SIZE } from './world.js';
import { player, updatePlayer, drawPlayer } from './player.js';
import { updateCombat, drawCombat } from './combat.js';
import { updateAndDrawParticles, addParticle } from './effects.js';
import { resetInputPresses } from './input.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };
let lastTime = 0;

// Add some ambient dust particles to the background
function spawnAmbientDust(dt) {
    if (Math.random() < 10 * dt) { // Spawn rate
        addParticle(
            camera.x + Math.random() * camera.width,
            camera.y + Math.random() * camera.height,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            'rgba(255, 255, 255, 0.3)',
            Math.random() * 2 + 1
        );
    }
}

function update(dt) {
    updatePlayer(dt, addParticle);
    updateCombat(player, dt);
    spawnAmbientDust(dt);

    // Smooth Camera Follow
    const targetCamX = player.x + player.width / 2 - camera.width / 2;
    const targetCamY = player.y + player.height / 2 - camera.height / 2;
    camera.x += (targetCamX - camera.x) * 5 * dt;
    camera.y += (targetCamY - camera.y) * 5 * dt;

    // Clamp camera
    const mapPixelWidth = map[0].length * TILE_SIZE;
    const mapPixelHeight = map.length * TILE_SIZE;
    if (camera.x < 0) camera.x = 0;
    if (camera.y < 0) camera.y = 0;
    if (camera.x > mapPixelWidth - camera.width) camera.x = mapPixelWidth - camera.width;
    if (camera.y > mapPixelHeight - camera.height) camera.y = mapPixelHeight - camera.height;

    // Clear one-frame input presses
    resetInputPresses();
}

function draw(dt) {
    // Fill deep dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorld(ctx, camera);
    updateAndDrawParticles(ctx, camera, dt);
    drawPlayer(ctx, camera);
    drawCombat(ctx, camera);
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (dt < 0.1) { // Prevent huge jumps
        update(dt);
        draw(dt);
    }
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
