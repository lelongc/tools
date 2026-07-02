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
    color: '#00ffff', // Cyan
    animState: 'idle',
    animTime: 0,
    scaleX: 1,
    scaleY: 1
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
        
        // Get tile directly below player for friction
        const groundTile = getCollision(player.x + 5, player.y + player.height + 1, player.width - 10, 1);
        const friction = groundTile === 3 ? 1.5 : 15; // 3 is Ice block

        // Smooth acceleration/friction
        player.vx += (targetVx - player.vx) * friction * dt;

        // Apply Gravity
        player.vy += player.gravity * dt;
        // Terminal velocity
        if (player.vy > 800) player.vy = 800; 

        // Jumping
        if (keys.jumpPressed && player.isGrounded) {
            player.vy = player.jumpForce;
            player.isGrounded = false;
            
            // Jump stretch (anticipation & launch)
            player.scaleX = 0.6;
            player.scaleY = 1.4;

            // Jump dust
            for(let i=0; i<5; i++) {
                addParticle(player.x + player.width/2, player.y + player.height, 
                            (Math.random()-0.5)*100, -Math.random()*50, 'rgba(0, 255, 255, 0.5)', 0.3);
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
            player.vx = player.facingRight ? 800 : -800;
            player.vy = 0; // Reset vertical velocity for clean horizontal dash
            
            // Dash stretch effect
            player.scaleX = 1.6;
            player.scaleY = 0.5;

            // Dash blast particles
            for(let i=0; i<15; i++) {
                addParticle(player.x + player.width/2, player.y + player.height/2, 
                            (Math.random()-0.5)*300 - player.vx*0.5, (Math.random()-0.5)*100, 'rgba(0, 255, 255, 0.8)', 0.5);
            }
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

    const wasGrounded = player.isGrounded;
    // Move Y and resolve collisions
    player.y += player.vy * dt;
    player.isGrounded = false;
    const collY = getCollision(player.x, player.y, player.width, player.height);
    if (collY) {
        if (player.vy > 0) { // Falling down
            if (collY === 2) {
                // Bounce Pad!
                player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.01;
                player.vy = -1000; // Launch player up
                player.scaleX = 0.4; // Extreme stretch
                player.scaleY = 1.8;
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 12}}));
            } else {
                // Normal Ground
                player.y = Math.floor((player.y + player.height) / TILE_SIZE) * TILE_SIZE - player.height - 0.01;
                player.isGrounded = true;
                
                // Landing Splash Dust & Squash
                if (!wasGrounded) {
                    player.scaleX = 1.3;
                    player.scaleY = 0.7;
                    
                    // Only shake camera on very hard landings (high velocity)
                    if (player.vy > 600) {
                        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 5}}));
                    }

                    for(let i=0; i<8; i++) {
                        addParticle(player.x + player.width/2, player.y + player.height, 
                                    (Math.random()-0.5)*150, -Math.random()*60, 'rgba(0, 255, 255, 0.4)', 0.4);
                    }
                }
            }
        } else if (player.vy < 0) { // Hitting head
            player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE + 0.01;
            player.vy = 0;
        }
        
        if (collY !== 2 && player.vy > 0) {
            player.vy = 0;
        }
    }

    // Run Dust
    if (player.isGrounded && Math.abs(player.vx) > 50 && Math.random() < 15 * dt) {
        addParticle(player.x + player.width/2, player.y + player.height, 
                    -player.vx * 0.2 + (Math.random()-0.5)*20, -Math.random()*30, 'rgba(0, 255, 255, 0.2)', 0.3);
    }

    // Animation State Machine
    player.animTime += dt;
    if (!player.isGrounded) {
        if (player.vy < 0) {
            player.animState = 'jump';
            // Stretch when jumping up
            player.scaleX += (0.8 - player.scaleX) * 15 * dt;
            player.scaleY += (1.2 - player.scaleY) * 15 * dt;
        } else {
            player.animState = 'fall';
            player.scaleX += (0.9 - player.scaleX) * 10 * dt;
            player.scaleY += (1.1 - player.scaleY) * 10 * dt;
        }
    } else if (Math.abs(player.vx) > 10) {
        player.animState = 'run';
        player.scaleX += (1 - player.scaleX) * 20 * dt;
        player.scaleY += (1 - player.scaleY) * 20 * dt;
    } else {
        player.animState = 'idle';
        player.scaleX += (1 - player.scaleX) * 10 * dt;
        player.scaleY += (1 - player.scaleY) * 10 * dt;
    }
}

export function drawPlayer(ctx, camera) {
    const drawX = player.x + player.width/2 - camera.x;
    const drawY = player.y + player.height - camera.y;

    ctx.save();
    
    // Move origin to player's feet for squash/stretch from bottom
    ctx.translate(drawX, drawY);

    if (!player.facingRight) {
        ctx.scale(-1, 1);
    }

    // Apply Squash & Stretch
    ctx.scale(player.scaleX, player.scaleY);

    // DRAW PROCEDURAL SKELETAL BIO-PROBE
    const t = player.animTime;
    const isRunning = player.animState === 'run';
    const isAirborne = player.animState === 'jump' || player.animState === 'fall';
    
    // Core body (Thorax)
    ctx.fillStyle = 'rgba(0, 50, 50, 0.8)'; // Dark inner body
    ctx.strokeStyle = player.color; // Cyan glowing bone
    ctx.lineWidth = 2;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 10;
    
    // Calculate bounce offset and body rotation
    let bounceY = 0;
    let bodyRot = 0;
    
    if (player.isDashing) {
        bodyRot = Math.PI / 4; // Lean forward when dashing
    } else if (isAirborne) {
        if (keys.jump && player.vy < -200) {
            // Front flip when holding jump button (high jump)
            bodyRot = t * 15;
        } else {
            // Normal jump lean
            bodyRot = player.vy * 0.0005;
        }
    } else if (isRunning) {
        bounceY = Math.abs(Math.sin(t * 15)) * -4;
        bodyRot = Math.sin(t * 15) * 0.1;
    } else {
        bounceY = Math.sin(t * 3) * 2; // Idle breathing
    }

    ctx.translate(0, -player.height/2 + bounceY);
    ctx.rotate(bodyRot);

    // Draw Back Legs
    ctx.beginPath();
    let legAngle1 = isRunning ? Math.sin(t * 15) * 0.5 : (isAirborne ? 0.3 : 0.2);
    let legAngle2 = isRunning ? Math.sin(t * 15 + Math.PI) * 0.5 : (isAirborne ? -0.2 : -0.2);
    
    // Leg 1
    ctx.moveTo(0, 0);
    ctx.lineTo(-10 + Math.sin(legAngle1)*10, 15 + Math.cos(legAngle1)*5);
    // Leg 2
    ctx.moveTo(0, 0);
    ctx.lineTo(10 + Math.sin(legAngle2)*10, 15 + Math.cos(legAngle2)*5);
    ctx.stroke();

    // Body Shape (Insectoid Carapace)
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 14, Math.PI/8, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.save();
    ctx.translate(5, -12);
    let headRot = isRunning ? 0.2 : (isAirborne ? -0.1 : Math.sin(t * 3) * 0.05);
    ctx.rotate(headRot);
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // Eye (Glowing bright)
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(3, -1, 2, 3, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Antenna
    ctx.beginPath();
    ctx.moveTo(-2, -5);
    ctx.quadraticCurveTo(-6, -12, Math.sin(t * 5)*3, -16);
    ctx.stroke();
    
    ctx.restore();

    // Draw Front Legs
    ctx.beginPath();
    let legAngle3 = isRunning ? Math.sin(t * 15 + Math.PI/2) * 0.5 : (isAirborne ? 0.5 : 0);
    let legAngle4 = isRunning ? Math.sin(t * 15 + Math.PI*1.5) * 0.5 : (isAirborne ? -0.5 : 0.1);
    
    // Leg 3
    ctx.moveTo(2, 2);
    ctx.lineTo(-8 + Math.sin(legAngle3)*10, 15 + Math.cos(legAngle3)*5);
    // Leg 4
    ctx.moveTo(2, 2);
    ctx.lineTo(12 + Math.sin(legAngle4)*10, 15 + Math.cos(legAngle4)*5);
    ctx.stroke();

    ctx.restore();
}
