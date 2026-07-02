import { keys, resetInputPresses } from './input.js';
import { getCollision, TILE_SIZE } from './world.js';
import { combatState, lightningSlashImg, lightningImpactImg } from './combat.js';

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

        // Hover Mechanics
        if (player.isGrounded) {
            player.hoverTimer = 1.0; // 1 second max
            player.canHover = true;
            player.isHovering = false;
        }

        if (!player.isGrounded && keys.up && player.hoverTimer > 0 && player.canHover) {
            player.isHovering = true;
            player.hoverTimer -= dt;
            player.vy = 0; // Lock vertical movement
            
            // Hover thruster particles
            if (Math.random() < 0.5) {
                addParticle(player.x + player.width/2 + (Math.random()-0.5)*12, player.y + player.height, 
                            (Math.random()-0.5)*30, 80 + Math.random()*60, 'rgba(0, 255, 255, 0.9)', 0.25, 'spark');
            }
        } else {
            player.isHovering = false;
            // Cannot hover multiple times in one jump
            if (!player.isGrounded && !keys.up && player.hoverTimer < 1.0) {
                player.canHover = false;
            }
        }

        // Apply Gravity only if not hovering or dashing
        if (!player.isHovering && !player.isDashing) {
            player.vy += player.gravity * dt;
        }
        
        // Wall Slide Logic
        player.isWallSliding = false;
        if (!player.isGrounded && player.vy > 0 && !player.isHovering) {
            const isPushingLeft = keys.left && getCollision(player.x - 2, player.y, player.width, player.height);
            const isPushingRight = keys.right && getCollision(player.x + 2, player.y, player.width, player.height);
            
            if (isPushingLeft || isPushingRight) {
                player.isWallSliding = true;
                if (player.vy > 80) player.vy = 80; // Slow down descent
                
                // Slide sparks
                if (Math.random() < 0.4) {
                    const px = isPushingLeft ? player.x : player.x + player.width;
                    addParticle(px, player.y + player.height/2 + (Math.random()-0.5)*10, 
                                isPushingLeft ? 40 : -40, -60, 'rgba(0, 255, 255, 0.8)', 0.25, 'spark');
                }
            }
        }

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

    // Draw Static Combat Effects (like Bio-Drill aura) that shouldn't squash, stretch or rotate
    if (combatState.isBioDrilling) {
        ctx.save();
        // Translate to player center (including breathing bounce)
        const bounceVal = Math.sin(player.animTime * 3) * 2;
        ctx.translate(0, -player.height/2 + bounceVal);
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = '#00ffff'; // Synced Cyan color
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        
        const auraRadius = 14;
        
        // Draw static synced cyan electric ring
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw crackling sparks (static angles with random jiggle so they don't rotate)
        ctx.lineWidth = 0.8;
        const sparkCount = 5;
        for (let i = 0; i < sparkCount; i++) {
            const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const startX = Math.cos(angle) * auraRadius;
            const startY = Math.sin(angle) * auraRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // Draw a tiny 3-step zig-zag
            let curX = startX;
            let curY = startY;
            const steps = 3;
            const zapLength = 5;
            for (let s = 0; s < steps; s++) {
                const tangentAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 1.5;
                const dist = (zapLength / steps) + (Math.random() * 1.5);
                curX += Math.cos(tangentAngle) * dist;
                curY += Math.sin(tangentAngle) * dist;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    // Apply Squash & Stretch
    ctx.scale(player.scaleX, player.scaleY);

    // Draw Charge Aura (K hold)
    if (combatState.isCharging) {
        const tTime = player.animTime;
        // Determine charge level from time (since chargeLevel updates in combat.js)
        let lvl = 1;
        if (combatState.chargeTime >= 0.7) lvl = 3;
        else if (combatState.chargeTime >= 0.3) lvl = 2;

        const radius = lvl === 3 ? 35 : (lvl === 2 ? 25 : 18);
        const color = lvl === 3 ? '#ffffff' : '#00ffff';
        const pulse = Math.sin(tTime * (lvl === 3 ? 40 : 20)) * 5;
        
        ctx.save();
        ctx.translate(0, -player.height/2);
        ctx.beginPath();
        ctx.arc(0, 0, radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = lvl === 3 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.15)';
        ctx.fill();
        
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.setLineDash([5 + Math.random()*10, 5 + Math.random()*10]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Random electric jitter points inside aura
        for (let i = 0; i < (lvl === 3 ? 3 : 1); i++) {
            if (Math.random() < 0.7) {
                ctx.beginPath();
                ctx.moveTo((Math.random()-0.5)*radius*1.5, (Math.random()-0.5)*radius*1.5);
                ctx.lineTo((Math.random()-0.5)*radius*1.5, (Math.random()-0.5)*radius*1.5);
                ctx.strokeStyle = color;
                ctx.lineWidth = Math.random() * 2;
                ctx.stroke();
            }
        }
        ctx.restore();
    }

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
    } else if (combatState.isBioDrilling) {
        bodyRot = 0.15; // Slight forward lean, no spin
    } else if (isAirborne) {
        bodyRot = player.vy * 0.0003; // Slight vertical velocity lean, no spin flips
    } else if (isRunning) {
        bounceY = Math.abs(Math.sin(t * 15)) * -4;
        bodyRot = Math.sin(t * 15) * 0.1;
    } else {
        bounceY = Math.sin(t * 3) * 2; // Idle breathing
    }

    ctx.translate(0, -player.height/2 + bounceY);
    ctx.rotate(bodyRot);

    // Draw Back Legs (Redesigned as slowly wiggling tentacles)
    const drawLegTentacle = (startX, startY, endX, endY, thickness, wigglePhase) => {
        const segments = 6;
        const pts = [{ x: startX, y: startY }];
        for (let i = 1; i <= segments; i++) {
            const tVal = i / segments;
            const targetX = startX + (endX - startX) * tVal;
            const targetY = startY + (endY - startY) * tVal;
            
            // Slow organic wiggle
            const wiggle = Math.sin(t * 3.5 + tVal * 3 + wigglePhase) * (3 * tVal);
            
            const dx = endX - startX;
            const dy = endY - startY;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            pts.push({
                x: targetX + (-dy / len) * wiggle,
                y: targetY + (dx / len) * wiggle
            });
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        
        // Cyan outer glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ffff';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // White core
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.35;
        ctx.stroke();
        ctx.restore();
    };

    let legAngle1 = isRunning ? Math.sin(t * 10) * 0.5 : (isAirborne ? 0.3 : 0.2);
    let legAngle2 = isRunning ? Math.sin(t * 10 + Math.PI) * 0.5 : (isAirborne ? -0.2 : -0.2);
    
    drawLegTentacle(0, 0, -10 + Math.sin(legAngle1)*10, 15 + Math.cos(legAngle1)*5, 2.5, 0);
    drawLegTentacle(0, 0, 10 + Math.sin(legAngle2)*10, 15 + Math.cos(legAngle2)*5, 2.5, Math.PI);

    // Body Shape (Insectoid Carapace) - Redesigned as a bundle of morphing bio-tentacles/wires!
    const drawMorphingStrand = (startX, startY, destX, destY, thickness, wigglePhase) => {
        const segments = 10;
        const pts = [{ x: startX, y: startY }];
        
        for (let i = 1; i <= segments; i++) {
            const tVal = i / segments;
            const targetX = startX + (destX - startX) * tVal;
            const targetY = startY + (destY - startY) * tVal;
            
            // Wiggle frequency/amplitude morphs during attacks (slowed down from 25 to 5.5)
            const isAttackingState = combatState.isBioDrilling || combatState.isGroundSmashing || combatState.isRisingBlast || combatState.isAttacking;
            const wiggleAmp = isAttackingState ? 6 : 2;
            const wiggle = Math.sin(t * 5.5 + tVal * 4 + wigglePhase) * (wiggleAmp * tVal);
            
            const dx = destX - startX;
            const dy = destY - startY;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            pts.push({
                x: targetX + (-dy / len) * wiggle,
                y: targetY + (dx / len) * wiggle
            });
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        
        // Cyan outer glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // White inner core
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.35;
        ctx.stroke();
        ctx.restore();
    };

    // Base endpoints (starts: sx, sy, ends: ex, ey) for the 6 primary body strands
    const bases = [
        { sx: -8, sy: -12, ex: -14, ey: -15, thickness: 3.5 },
        { sx: -8, sy: -4,  ex: -16, ey: -5,  thickness: 3.0 },
        { sx: -6, sy: 6,   ex: -13, ey: 7,   thickness: 2.5 },
        { sx: 6,  sy: -10, ex: 14,  ey: -7,  thickness: 3.0 },
        { sx: 6,  sy: 0,   ex: 15,  ey: 1,   thickness: 2.5 },
        { sx: 0,  sy: 10,  ex: 2,   ey: 14,  thickness: 2.0 }
    ];

    for (let k = 0; k < bases.length; k++) {
        const base = bases[k];
        let sx = base.sx;
        let sy = base.sy;
        let tx = base.ex;
        let ty = base.ey;
        let p = 0; // Morph progress
        
        if (combatState.isCharging) {
            p = Math.max(0, Math.min(1.0, combatState.chargeTime / 0.25));
            const lvl = combatState.chargeLevel || 1;
            const outerRadius = (lvl === 3 ? 30 : (lvl === 2 ? 22 : 16)) + Math.sin(t * 15) * 2;
            const innerRadius = 5;
            
            // Orbiting angle (spinning the entire tentacles around the body center)
            const orbitAngle = t * 15 + (k / bases.length) * Math.PI * 2;
            
            const targetSx = Math.cos(orbitAngle) * innerRadius;
            const targetSy = Math.sin(orbitAngle) * innerRadius;
            sx = base.sx + (targetSx - base.sx) * p;
            sy = base.sy + (targetSy - base.sy) * p;
            
            // Curve the outer ends forward along orbit to create a vortex loop (+0.8 rad)
            const targetEx = Math.cos(orbitAngle + 0.8) * outerRadius;
            const targetEy = Math.sin(orbitAngle + 0.8) * outerRadius;
            tx = base.ex + (targetEx - base.ex) * p;
            ty = base.ey + (targetEy - base.ey) * p;
        } else if (combatState.isBioDrilling) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.bioDrillTime / 0.35)));
            // Helix wrapping forward
            const windAngle = k * Math.PI / 2 + t * 40;
            const targetX = 50 + k * 4;
            const targetY = Math.sin(windAngle) * 6;
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isGroundSmashing) {
            p = 1.0;
            const phase = combatState.smashPhase || 2;
            let targetX, targetY;
            if (phase === 1 || phase === 2) {
                targetX = (k - 2.5) * 12;
                targetY = -70;
            } else {
                targetX = (k - 2.5) * 4;
                targetY = 70;
            }
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isRisingBlast) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.risingBlastTime / 0.35)));
            const targetX = (k - 2.5) * 15;
            const targetY = -130;
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isLowSweeping) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.lowSweepTime / 0.25)));
            const targetX = 85 + k * 4;
            const targetY = 12 + (k - 2.5) * 2;
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isUpSlashing) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.upSlashTime / 0.2)));
            const targetX = 40 + (k - 2.5) * 8;
            const targetY = -90;
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isPogoSlashing) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.pogoSlashTime / 0.2)));
            const targetX = (k - 2.5) * 4;
            const targetY = 90;
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        } else if (combatState.isAttacking) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.attackTime / (combatState.comboStep === 3 ? 0.25 : 0.15))));
            let targetX, targetY;
            if (combatState.comboStep === 1) {
                targetX = 65; targetY = -12;
            } else if (combatState.comboStep === 2) {
                targetX = 55; targetY = 15;
            } else {
                targetX = 80; targetY = 0;
            }
            tx = base.ex + (targetX - base.ex) * p;
            ty = base.ey + (targetY - base.ey) * p;
        }
        
        // Add organic jiggle to the resting state (when morph progress p is 0)
        if (p === 0) {
            tx = base.ex + Math.sin(t * 3.5 + k * 1.5) * 2.5;
            ty = base.ey + Math.cos(t * 3.5 + k * 1.5) * 2.5;
        }
        
        drawMorphingStrand(sx, sy, tx, ty, base.thickness, k);
    }

    // Head
    ctx.save();
    ctx.translate(5, -12);
    let headRot = isRunning ? 0.2 : (isAirborne ? -0.1 : Math.sin(t * 3) * 0.05);
    ctx.rotate(headRot);
    
    // Draw head as concentric glowing nerve rings
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 6 - i * 1.5, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();

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
    
    // Sprite Drawing Helpers for VFX
    const drawSlashSprite = (pt, angle, size, prog) => {
        if (!lightningSlashImg.complete || lightningSlashImg.naturalWidth <= 0 || size <= 0) return;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        
        const frameIdx = Math.max(0, Math.min(5, Math.floor(prog * 6)));
        try { ctx.drawImage(lightningSlashImg, frameIdx * 64, 0, 64, 64, -size/2, -size/2, size, size); } catch(e) {}
        ctx.restore();
    };

    const drawImpactSprite = (pt, size, prog) => {
        if (!lightningImpactImg.complete || lightningImpactImg.naturalWidth <= 0 || prog < 0.5 || size <= 0) return;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        
        const animProg = Math.max(0, Math.min(1.0, (prog - 0.5) / 0.5));
        const frameIdx = Math.max(0, Math.min(6, Math.floor(animProg * 7)));
        try { ctx.drawImage(lightningImpactImg, frameIdx * 64, 0, 64, 64, -size/2, -size/2, size, size); } catch(e) {}
        ctx.restore();
    };

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
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                pts.push({
                    x: targetX + (-dy / len) * wiggle,
                    y: targetY + (dx / len) * wiggle
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness * Math.max(0.1, 1 - progressVal * 0.5);
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
            
            for (let i = 2; i < pts.length; i += 2) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, (thickness * 0.4) * (1 - (i/pts.length) * 0.4), 0, Math.PI * 2);
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#ffffff';
                ctx.fillStyle = '#ffffff'; 
                ctx.fill();
                ctx.restore();
            }
            return pts[pts.length - 1]; 
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
        // Dash Strike: spiral drill tentacles emerging from the head antenna
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
            return pts[pts.length - 1]; // Return tip
        };

        let mainTip = null;
        for (let k = 0; k < 6; k++) {
            const spreadY = Math.sin(t * 30 + k) * 25;
            const spreadX = Math.cos(t * 30 + k) * 8;
            const tip = drawHeadSpaceTentacle(-2, -5, 140 + spreadX, spreadY, 4, k);
            if (k === 3) mainTip = tip;
        }
        if (mainTip) {
            // Constant electric drill tip
            const drillProg = (t * 4) % 1.0; 
            drawImpactSprite(mainTip, 160, drillProg);
        }
    } else if (combatState.isBioDrilling) {
        // Bio-Drill (Neutral I): helix tentacles wrapping player body to form a tight, clean drill
        const drawSpiralDrillTentacle = (radius, wigglePhase, thickness) => {
            const segments = 12;
            const pts = [];
            for (let i = 0; i <= segments; i++) {
                const tVal = i / segments;
                // Compact drill shell tight to the body (from X=-12 to X=42)
                const startX = -12;
                const endX = 42;
                const x = startX + (endX - startX) * tVal;
                
                const windAngle = tVal * Math.PI * 5 + t * 40 + wigglePhase;
                const taper = Math.sin(tVal * Math.PI / 2);
                const curRadius = radius * (1.0 - taper);
                const y = Math.sin(windAngle) * curRadius; // FIXED: no double offset!
                pts.push({ x, y });
            }
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            
            // Pure Cyan Outer Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            return pts[pts.length - 1];
        };

        let mainTip = null;
        for (let k = 0; k < 4; k++) {
            const phaseShift = (k / 4) * Math.PI * 2;
            const tip = drawSpiralDrillTentacle(11, phaseShift, 2.5 - k * 0.4); // smaller radius (11) and thinner tentacles
            if (k === 0) mainTip = tip;
        }



        if (mainTip) {
            const drillProg = (t * 6) % 1.0;
            drawImpactSprite(mainTip, 90, drillProg); // reduced size from 150 to 90
        }
    } else if (combatState.isLowSweeping || combatState.isUpSlashing || combatState.isPogoSlashing || combatState.isRisingBlast) {
        // Shared generic tentacle drawing for Hollow Knight matrix skills
        const drawTentacle = (startX, startY, endX, endY, thickness, wigglePhase) => {
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
                pts.push({
                    x: targetX + (-dy / len) * wiggle,
                    y: targetY + (dx / len) * wiggle
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            
            // Cyan outer glow
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            // White core path to make it pop and look premium!
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = thickness * 0.35;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();

            return pts[pts.length - 1]; // Return tip
        };

        if (combatState.isLowSweeping) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.lowSweepTime / 0.25)));
            let mainTip;
            for (let k = 0; k < 5; k++) {
                const tip = drawTentacle(-2, 10, 110 + k*5, 20 + (k-2)*15, 6, k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, Math.PI / 8, 120, prog);
                drawImpactSprite(mainTip, 100, prog);
            }
        } else if (combatState.isUpSlashing) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.upSlashTime / 0.2)));
            let mainTip;
            for (let k = 0; k < 4; k++) {
                const tip = drawTentacle(-2, -5, 60 + (k-1.5)*30, -110 + Math.abs(k-1.5)*20, 6, k);
                if (k === 1) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, -Math.PI / 3, 150, prog); // Aiming upwards
                drawImpactSprite(mainTip, 120, prog);
            }
        } else if (combatState.isPogoSlashing) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.pogoSlashTime / 0.2)));
            let mainTip;
            for (let k = 0; k < 4; k++) {
                const tip = drawTentacle(-2, 10, (k-1.5)*15, 120, 7, k);
                if (k === 1) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, Math.PI / 2, 140, prog); // Aiming down
                drawImpactSprite(mainTip, 110, prog);
            }
        } else if (combatState.isRisingBlast) {
            const prog = Math.max(0, Math.min(1.0, 1 - (combatState.risingBlastTime / 0.35)));

            // 1. Draw 3 massive vertical lightning columns using the lightning sprite sheet FIRST (so tentacles show on top)
            if (lightningSlashImg.complete && lightningSlashImg.naturalWidth > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.shadowColor = '#00ffff';
                
                const cols = [-40, 0, 40];
                cols.forEach((colX, idx) => {
                    ctx.save();
                    ctx.translate(colX * (player.facingRight ? 1 : -1), -player.height/2 - 80);
                    ctx.rotate(-Math.PI / 2 + (Math.sin(t * 20 + idx) * 0.15));
                    
                    const frameW = 64;
                    const frameIdx = Math.floor(t * 25 + idx * 2) % 6;
                    const colLength = 220 + Math.sin(t * 30 + idx) * 30;
                    const colWidth = 70 + Math.random() * 20;
                    
                    ctx.shadowBlur = 25;
                    ctx.globalAlpha = 0.9;
                    try {
                        ctx.drawImage(lightningSlashImg, frameIdx * 64, 0, 64, 64, -colLength/2, -colWidth/2, colLength, colWidth);
                    } catch(e) {}
                    ctx.restore();
                });
                ctx.restore();
            }

            // 2. Draw expanding shockwave rings rising upwards SECOND
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#00ffff';
            
            const ringCount = 3;
            for (let r = 0; r < ringCount; r++) {
                const ringProg = (prog + r / ringCount) % 1.0;
                const radius = ringProg * 90;
                const alpha = 1.0 - ringProg;
                
                ctx.lineWidth = 3 * alpha;
                ctx.shadowBlur = 15 * alpha;
                ctx.globalAlpha = alpha;
                
                ctx.beginPath();
                ctx.ellipse(0, -player.height/2 - ringProg * 120, radius, radius * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // 3. Draw 7 wild tentacles shooting upwards and swaying aggressively THIRD (so they render on top of VFX)
            for (let k = 0; k < 7; k++) {
                const spreadX = (k - 3) * 30 * (player.facingRight ? 1 : -1);
                const length = 180 + Math.sin(t * 40 + k) * 30;
                drawTentacle(-2, -5, spreadX, -length, 7 - Math.abs(k - 3) * 0.8, k);
            }
        }
    } else if (combatState.isGroundSmashing) {
        const drawHeadSpaceTentacle = (startX, startY, endX, endY, thickness, wigglePhase) => {
            const segments = 10;
            const pts = [{ x: startX, y: startY }];
            for (let i = 1; i <= segments; i++) {
                const tVal = i / segments;
                const targetX = startX + (endX - startX) * tVal;
                const targetY = startY + (endY - startY) * tVal;
                
                const wiggleSpd = combatState.smashPhase === 3 ? 35 : 18;
                const wiggleAmp = combatState.smashPhase === 3 ? 6 : 12;
                const wiggle = Math.sin(t * wiggleSpd + tVal * 5 + wigglePhase) * (wiggleAmp * tVal);
                
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
            return pts[pts.length - 1]; // Return tip
        };

        const phase = combatState.smashPhase || 2;
        if (phase === 1 || phase === 2) {
            // Leap/Gather: 4 tentacles pointing UPWARDS to gather power from above
            let mainTip;
            for (let k = 0; k < 4; k++) {
                const spreadX = (k - 1.5) * 35;
                const length = 85 + Math.sin(t * 10 + k) * 15;
                const tip = drawHeadSpaceTentacle(-2, -5, spreadX, -length, 4.5, k);
                if (k === 1) mainTip = tip;
            }
            if (mainTip) {
                const prog = (t * 5) % 1.0;
                drawSlashSprite(mainTip, -Math.PI / 2, 120, prog); 
            }
        } else {
            // Slamming phase (Phase 3): Pointing DOWNWARDS wrapped together like a heavy drill spear!
            let mainTip;
            for (let k = 0; k < 4; k++) {
                const spreadX = (k - 1.5) * 8 + (Math.sin(t * 40 + k) * 4);
                const length = 110 + Math.cos(t * 40 + k) * 10;
                const thickness = 7 - Math.abs(k - 1.5) * 2;
                const tip = drawHeadSpaceTentacle(-2, -5, spreadX, length, thickness, k);
                if (k === 1) mainTip = tip;
            }
            if (mainTip) {
                const prog = (t * 8) % 1.0;
                drawSlashSprite(mainTip, Math.PI / 2, 170, prog); 
                drawImpactSprite(mainTip, 140, prog);
            }
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
        if (lightningImpactImg.complete && lightningImpactImg.naturalWidth > 0) {
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
                ctx.drawImage(lightningImpactImg, frameX, 0, 64, 64, -25, -25, 50, 50);
                ctx.restore();
            }
        }
    }
    
    ctx.restore();

    // Draw Front Legs (Redesigned as slowly wiggling tentacles)
    let legAngle3 = isRunning ? Math.sin(t * 10 + Math.PI/2) * 0.5 : (isAirborne ? 0.5 : 0);
    let legAngle4 = isRunning ? Math.sin(t * 10 + Math.PI*1.5) * 0.5 : (isAirborne ? -0.5 : 0.1);
    
    drawLegTentacle(2, 2, -8 + Math.sin(legAngle3)*10, 15 + Math.cos(legAngle3)*5, 2.2, Math.PI / 2);
    drawLegTentacle(2, 2, 12 + Math.sin(legAngle4)*10, 15 + Math.cos(legAngle4)*5, 2.2, Math.PI * 1.5);

    ctx.restore();
}
