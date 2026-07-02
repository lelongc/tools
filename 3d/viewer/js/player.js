import { keys, resetInputPresses } from './input.js';
import { getCollision, TILE_SIZE } from './world.js';
import { combatState, iceSlashImg, iceImpactImg, lightning5Img } from './combat.js';

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
    scaleY: 1,
    hasClippedJump: false
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
    } else if (combatState.isDashStriking) {
        // Dash Strike physics are completely managed in combat.js
    } else if (combatState.isGroundSmashing) {
        // Lock horizontal movement during ground smash (combat.js handles Y)
        player.vx = 0;
    } else if (combatState.isCharging) {
        // Lock player position during charging
        player.vx = 0;
        player.vy = 0;
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
        let friction = 15;
        if (groundTile === 3) {
            friction = 1.5; // Ice block
        } else if (!player.isGrounded) {
            friction = 5; // Air control (mượt mà hơn, giữ quán tính)
        }

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
            player.hasClippedJump = false; // Reset flag for variable jump
            
            // Jump stretch (anticipation & launch)
            player.scaleX = 0.6;
            player.scaleY = 1.4;

            // Jump dust
            for(let i=0; i<5; i++) {
                addParticle(player.x + player.width/2, player.y + player.height, 
                            (Math.random()-0.5)*100, -Math.random()*50, 'rgba(0, 255, 255, 0.5)', 0.3);
            }
        }

        // Variable jump height: if jump key is released while going up, reduce upward velocity gently once
        if (!keys.jump && player.vy < -100 && !player.hasClippedJump) {
            player.vy = -100; // Limit upward velocity to allow short hops mượt mà
            player.hasClippedJump = true;
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

    // Eye (Glowing bright) - changes color during charging (K)
    if (combatState.isCharging) {
        const cTime = combatState.chargeTime;
        const flash = Math.floor(t * 35) % 2 === 0;
        if (cTime >= 0.7) {
            // Level 3: Flashes violently between bright red and gold!
            ctx.fillStyle = flash ? '#ff003c' : '#ffd700';
            ctx.shadowColor = '#ff003c';
        } else if (cTime >= 0.3) {
            // Level 2: Blinks between orange and cyan!
            ctx.fillStyle = flash ? '#ff7700' : '#00ffff';
            ctx.shadowColor = '#ff7700';
        } else {
            // Level 1: Blinks between cyan and white!
            ctx.fillStyle = flash ? '#00ffff' : '#ffffff';
            ctx.shadowColor = '#00ffff';
        }
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = player.color;
    }
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(3, -1, 2, 3, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Antenna / Combat Tentacle (directly morphing the head antenna!)
    if (combatState.isAttacking) {
        // Draw the whipping tentacles starting from the antenna base (-2, -5)
        const progress = 1 - (combatState.attackTime / (combatState.comboStep === 3 ? 0.25 : 0.15));
        
        const drawHeadSpaceTentacle = (startX, startY, endX, endY, progressVal, thickness, wigglePhase) => {
            const segments = 10;
            const pts = [{ x: startX, y: startY }];
            
            const curEndX = startX + (endX - startX) * progressVal;
            const curEndY = startY + (endY - startY) * progressVal;
            
            for (let i = 1; i <= segments; i++) {
                const tVal = i / segments;
                const targetX = startX + (curEndX - startX) * tVal;
                const targetY = startY + (curEndY - startY) * tVal;
                
                const wiggle = Math.sin(t * 20 + tVal * 5 + wigglePhase) * (20 * tVal * progressVal);
                
                // Perpendicular vector for wiggle
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                const nx = -dy / len;
                const ny = dx / len;
                
                pts.push({
                    x: targetX + nx * wiggle,
                    y: targetY + ny * wiggle
                });
            }
            
            // Draw Main Tentacle Stem (Cyan matching player)
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness * Math.max(0.1, 1 - progressVal * 0.5);
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            // Draw organic glowing joints/nodes along the tentacle
            for (let i = 2; i < pts.length; i += 2) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, (thickness * 0.4) * (1 - (i/pts.length) * 0.4), 0, Math.PI * 2);
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#ffffff';
                ctx.fillStyle = '#ffffff'; // White glowing nodes inside cyan tentacle
                ctx.fill();
                ctx.restore();
            }
            
            return pts[pts.length - 1]; // Return the tip point
        };

        const drawSlashSprite = (pt, angle, size = 64) => {
            if (!iceSlashImg.complete || iceSlashImg.naturalWidth <= 0) return;
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(angle);
            
            // Calculate frame (16 frames spritesheet)
            const frameIdx = Math.floor(progress * 15);
            const frameW = 128;
            const frameX = frameIdx * frameW;
            
            // Render the transparent ice slash sprite centered
            ctx.drawImage(iceSlashImg, frameX, 0, 128, 128, -size/2, -size/2, size, size);
            ctx.restore();
        };

        const drawImpactSprite = (pt, size = 80) => {
            if (!iceImpactImg.complete || iceImpactImg.naturalWidth <= 0 || progress < 0.5) return;
            ctx.save();
            ctx.translate(pt.x, pt.y);
            
            // Map progress 0.5 -> 1.0 to frame index 0 -> 15
            const animProgress = (progress - 0.5) / 0.5;
            const frameIdx = Math.floor(animProgress * 15);
            const frameW = 128;
            const frameX = frameIdx * frameW;
            
            ctx.drawImage(iceImpactImg, frameX, 0, 128, 128, -size/2, -size/2, size, size);
            ctx.restore();
        };

        if (combatState.comboStep === 1) {
            // Whip 1: Forward and slightly up
            const tip1 = drawHeadSpaceTentacle(-2, -5, 80, -10, progress, 6, 0);
            const tip2 = drawHeadSpaceTentacle(-2, -5, 60, 20, progress, 4, 1);
            drawSlashSprite(tip1, -Math.PI / 8, 70);
            drawImpactSprite(tip1, 80);
        } else if (combatState.comboStep === 2) {
            // Whip 2: Forward and down
            const tip1 = drawHeadSpaceTentacle(-2, -5, 90, 25, progress, 7, 2);
            const tip2 = drawHeadSpaceTentacle(-2, -5, 70, -15, progress, 5, 3);
            drawSlashSprite(tip1, Math.PI / 6, 80);
            drawImpactSprite(tip1, 90);
        } else if (combatState.comboStep === 3) {
            // Whip 3: 5 cyan tentacles bursting forward!
            let mainTip = null;
            for (let k = 0; k < 5; k++) {
                const spreadY = (k - 2) * 20;
                const length = 120 + Math.random() * 30;
                const tip = drawHeadSpaceTentacle(-2, -5, length, spreadY, progress, 8 - Math.abs(k - 2), k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, 0, 120); // Massive pixel slash!
                drawImpactSprite(mainTip, 130);
            }
        }
    } else if (combatState.isDashStriking) {
        // Spiral drill tentacles emerging from the head antenna
        const drawHeadSpaceTentacle = (startX, startY, endX, endY, thickness, wigglePhase) => {
            const segments = 10;
            const pts = [{ x: startX, y: startY }];
            for (let i = 1; i <= segments; i++) {
                const tVal = i / segments;
                const targetX = startX + (endX - startX) * tVal;
                const targetY = startY + (endY - startY) * tVal;
                const wiggle = Math.sin(t * 30 + tVal * 5 + wigglePhase) * (15 * tVal);
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                const nx = -dy / len;
                const ny = dx / len;
                pts.push({
                    x: targetX + nx * wiggle,
                    y: targetY + ny * wiggle
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
        };

        for (let k = 0; k < 6; k++) {
            const spreadY = Math.sin(t * 30 + k) * 25;
            const spreadX = Math.cos(t * 30 + k) * 8;
            drawHeadSpaceTentacle(-2, -5, 140 + spreadX, spreadY, 4, k);
        }
    } else if (combatState.isGroundSmashing) {
        // Smash tentacles pointing upwards (Cyan color)
        const drawHeadSpaceTentacle = (startX, startY, endX, endY, thickness, wigglePhase) => {
            const segments = 10;
            const pts = [{ x: startX, y: startY }];
            for (let i = 1; i <= segments; i++) {
                const tVal = i / segments;
                const targetX = startX + (endX - startX) * tVal;
                const targetY = startY + (endY - startY) * tVal;
                const wiggle = Math.sin(t * 20 + tVal * 5 + wigglePhase) * (10 * tVal);
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                const nx = -dy / len;
                const ny = dx / len;
                pts.push({
                    x: targetX + nx * wiggle,
                    y: targetY + ny * wiggle
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
        };

        for (let k = 0; k < 4; k++) {
            const spreadX = (k - 1.5) * 35;
            const length = 90 + Math.random() * 30;
            drawHeadSpaceTentacle(-2, -5, spreadX, -length, 5, k);
        }
    } else {
        // Draw normal idle antenna
        ctx.beginPath();
        ctx.moveTo(-2, -5);
        ctx.quadraticCurveTo(-6, -12, Math.sin(t * 5) * 3, -16);
        ctx.stroke();
    }

    // Draw Laser Beam (if active) from head antenna base
    if (combatState.isReleasingBeam) {
        ctx.save();
        ctx.translate(-2, -5);
        const lvl = combatState.chargeLevel || 1;
        const thickness = lvl === 3 ? 32 : (lvl === 2 ? 18 : 8);
        const color = lvl === 3 ? 'rgba(0, 255, 255, 0.95)' : (lvl === 2 ? 'rgba(0, 240, 255, 0.85)' : 'rgba(0, 200, 255, 0.7)');
        
        ctx.shadowBlur = lvl === 3 ? 40 : 25;
        ctx.shadowColor = '#00ffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(600, 0); // screen filling beam
        ctx.stroke();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.35;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(600, 0);
        ctx.stroke();
        
        // Draw secondary branches shooting off the main laser beam at Level 3!
        if (lvl === 3) {
            for (let b = 0; b < 4; b++) {
                const bx = 80 + Math.random() * 400;
                const by = (Math.random() - 0.5) * 60;
                ctx.beginPath();
                ctx.moveTo(bx - 40, 0);
                ctx.quadraticCurveTo(bx - 20, by, bx, 0);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.lineWidth = 1.8;
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // Draw Lightning Trail (Procedural Branching Lightning)
    if (combatState.isDashStriking) {
        const drawProceduralLightning = (sx, sy, ex, ey, disp, branches, thickness = 3.5) => {
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const pts = [{ x: sx, y: sy }];
            const dx = ex - sx;
            const dy = ey - sy;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            const steps = Math.floor(dist / 12);
            
            for (let i = 1; i < steps; i++) {
                const tVal = i / steps;
                const tx = sx + dx * tVal;
                const ty = sy + dy * tVal;
                
                const nx = -dy / dist;
                const ny = dx / dist;
                const offset = (Math.random() - 0.5) * disp;
                
                const px = tx + nx * offset;
                const py = ty + ny * offset;
                pts.push({ x: px, y: py });
                
                // Spawn small branching lightning bolts
                if (branches > 0 && Math.random() < 0.12 && i < steps - 2) {
                    const bx = px + (Math.random() * 30 - 15) + (dx / steps) * 2;
                    const by = py + (Math.random() * 30 - 15) + (dy / steps) * 2;
                    drawProceduralLightning(px, py, bx, by, disp * 0.5, branches - 1, thickness * 0.6);
                }
            }
            pts.push({ x: ex, y: ey });
            
            // Outer glow path
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.stroke();
            
            // Inner white core path
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = thickness * 0.35;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();
        };

        const lvl = combatState.chargeLevel || 1;
        const trailCount = lvl === 3 ? 5 : (lvl === 2 ? 3 : 1);
        const disp = lvl === 3 ? 16 : (lvl === 2 ? 11 : 6);
        const lengthMultiplier = lvl === 3 ? 1.6 : (lvl === 2 ? 1.1 : 0.8);
        const thickness = lvl === 3 ? 5.5 : (lvl === 2 ? 3.5 : 2.0);
        
        for (let j = 0; j < trailCount; j++) {
            const startOffset = -10 + j * 4;
            const endOffsetX = (-120 - Math.random() * 50) * lengthMultiplier;
            const endOffsetY = (j - (trailCount - 1) / 2) * 16 + (Math.random() - 0.5) * 15;
            
            drawProceduralLightning(-2, -5 + startOffset, endOffsetX, endOffsetY, disp, lvl === 3 ? 2 : 1, thickness);
        }

        // Draw animated pixel-art lightning sprites from assets!
        if (lightning5Img.complete && lightning5Img.naturalWidth > 0) {
            const spriteCount = lvl === 3 ? 4 : (lvl === 2 ? 2 : 1);
            for (let d = 0; d < spriteCount; d++) {
                ctx.save();
                const offsetX = -45 - d * 40;
                const offsetY = (d - (spriteCount - 1) / 2) * 14 + (Math.sin(t * 15 + d) * 8);
                ctx.translate(offsetX, offsetY);
                
                // Align with movement axis & small random tilt
                ctx.rotate((Math.random() - 0.5) * 0.25);
                
                const frameW = 64; // image is 448x64 (7 frames)
                const frameIdx = Math.floor(t * 24 + d * 3) % 7;
                const frameX = frameIdx * frameW;
                
                ctx.globalAlpha = 0.9;
                ctx.drawImage(lightning5Img, frameX, 0, 64, 64, -25, -25, 50, 50);
                ctx.restore();
            }
        }
    }
    
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
