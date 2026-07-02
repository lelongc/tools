import { drawWorld, map, TILE_SIZE } from './world.js';
import { player, updatePlayer, drawPlayer } from './player.js';
import { updateCombat, drawCombat } from './combat.js';
import { updateAndDrawParticles, addParticle } from './effects.js';
import { resetInputPresses } from './input.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height, player: null };
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
    camera.player = player;
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
let shakeTime = 0;
let shakeIntensity = 0;

window.addEventListener('cameraShake', (e) => {
    shakeTime = 0.2; // 200ms shake
    shakeIntensity = e.detail.intensity || 5;
});

function draw(dt) {
    if (shakeTime > 0) {
        shakeTime -= dt;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        ctx.save();
        ctx.translate(shakeX, shakeY);
    }

    // Draw pure black space
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural Cyber Grid Background
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 150, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // Grid size and parallax offset
    const gridSize = 64;
    const offsetX = -(camera.x * 0.2) % gridSize;
    const offsetY = -(camera.y * 0.2) % gridSize;
    
    ctx.beginPath();
    // Vertical lines
    for (let x = offsetX - gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    // Horizontal lines
    for (let y = offsetY - gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    // Floating abstract geometry (Far parallax layer)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        const floatX = ((i * 300 - camera.x * 0.05) % (canvas.width + 200) + (canvas.width + 200)) % (canvas.width + 200) - 100;
        const floatY = canvas.height/2 + Math.sin(Date.now()/2000 + i) * 100 - camera.y * 0.05;
        
        ctx.save();
        ctx.translate(floatX, floatY);
        ctx.rotate(Date.now()/5000 + i);
        ctx.beginPath();
        ctx.moveTo(-50, -50);
        ctx.lineTo(50, -50);
        ctx.lineTo(0, 50);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    
    ctx.restore();

    drawWorld(ctx, camera);
    updateAndDrawParticles(ctx, camera, dt);
    drawPlayer(ctx, camera);
    drawCombat(ctx, camera, player);

    if (shakeTime > 0) {
        ctx.restore();
    }
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
