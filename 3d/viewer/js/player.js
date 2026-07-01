import { keys, resetInputPresses } from './input.js';
import { getCollision, TILE_SIZE } from './world.js';

export const player = {
    x: 64,
    y: 100,
    width: 20,
    height: 28,
    vx: 0,
    vy: 0,
    speed: 250,
    jumpForce: -450,
    gravity: 1200,
    isGrounded: false,
    facingRight: true,
    dashCooldown: 0,
    isDashing: false,
    dashTime: 0,
    color: '#fff'
};

export function updatePlayer(dt, addParticle) {
    if (player.isDashing) {
        player.dashTime -= dt;
        player.vy = 0; // Freeze gravity during dash
        
        // Spawn dash particles
        addParticle(player.x + player.width/2, player.y + player.height/2, 
                    player.facingRight ? -100 : 100, 0, '#fff', 0.2);

        if (player.dashTime <= 0) {
            player.isDashing = false;
        }
    } else {
        // Horizontal Movement
        let targetVx = 0;
        if (keys.left) {
            targetVx = -player.speed;
            player.facingRight = false;
        }
        if (keys.right) {
            targetVx = player.speed;
            player.facingRight = true;
        }
        
        // Smooth acceleration/friction
        player.vx += (targetVx - player.vx) * 15 * dt;

        // Apply Gravity
        player.vy += player.gravity * dt;
        // Terminal velocity
        if (player.vy > 800) player.vy = 800; 

        // Jumping
        if (keys.jumpPressed && player.isGrounded) {
            player.vy = player.jumpForce;
            player.isGrounded = false;
            // Jump dust
            for(let i=0; i<5; i++) {
                addParticle(player.x + player.width/2, player.y + player.height, 
                            (Math.random()-0.5)*100, -Math.random()*50, '#888', 0.3);
            }
        }

        // Variable jump height (release jump early to short hop)
        if (!keys.jump && player.vy < 0) {
            player.vy *= 0.5;
        }

        // Dashing
        if (player.dashCooldown > 0) player.dashCooldown -= dt;
        if (keys.dashPressed && player.dashCooldown <= 0) {
            player.isDashing = true;
            player.dashTime = 0.15; // 150ms dash
            player.dashCooldown = 1.0; // 1s cooldown
            player.vx = player.facingRight ? 600 : -600;
        }
    }

    // Move X and resolve collisions
    player.x += player.vx * dt;
    if (getCollision(player.x, player.y, player.width, player.height)) {
        // Snap to grid
        if (player.vx > 0) {
            player.x = Math.floor((player.x + player.width) / TILE_SIZE) * TILE_SIZE - player.width - 0.01;
        } else if (player.vx < 0) {
            player.x = Math.floor(player.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.01;
        }
        player.vx = 0;
    }

    // Move Y and resolve collisions
    player.y += player.vy * dt;
    player.isGrounded = false;
    if (getCollision(player.x, player.y, player.width, player.height)) {
        if (player.vy > 0) { // Falling down
            player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.01;
            player.isGrounded = true;
        } else if (player.vy < 0) { // Hitting head
            player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.01;
        }
        player.vy = 0;
    }
}

export function drawPlayer(ctx, camera) {
    const drawX = player.x - camera.x;
    const drawY = player.y - camera.y;

    // Draw Knight body
    ctx.fillStyle = player.color;
    // Tiny little horns/ears
    ctx.fillRect(drawX, drawY - 6, 4, 6);
    ctx.fillRect(drawX + player.width - 4, drawY - 6, 4, 6);
    
    ctx.fillRect(drawX, drawY, player.width, player.height);

    // Draw Cloak
    ctx.fillStyle = '#555';
    ctx.fillRect(drawX + 2, drawY + player.height/2, player.width - 4, player.height/2 + 2);

    // Draw eyes
    ctx.fillStyle = '#000';
    if (player.facingRight) {
        ctx.fillRect(drawX + 12, drawY + 6, 4, 6);
    } else {
        ctx.fillRect(drawX + 4, drawY + 6, 4, 6);
    }
}
