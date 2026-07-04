import { keys, resetInputPresses } from './input.js?v=17';
import { getCollision, TILE_SIZE } from './world.js?v=17';
import { combatState, lightningSlashImg, lightningImpactImg, orbImg, spark1Img, spark2Img } from './combat.js?v=17';
import { addParticle } from './effects.js?v=17';

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
    } else if (combatState.isDashStriking || combatState.isBioDrilling || combatState.isRisingBlast || combatState.isUpSlashing || combatState.isLowSweeping) {
        // Physics for these hard-commit skills are completely managed in combat.js
    } else if (combatState.isGroundSmashing) {
        // Lock horizontal movement during ground smash (combat.js handles Y)
        player.vx = 0;
    } else {
        if (player.wallJumpTimer > 0) {
            player.wallJumpTimer -= dt;
            // Retain momentum, ignore input
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
        }

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
            const leftTile = keys.left ? getCollision(player.x - 2, player.y, player.width, player.height) : 0;
            const rightTile = keys.right ? getCollision(player.x + 2, player.y, player.width, player.height) : 0;
            
            const wallTile = leftTile || rightTile;
            if (wallTile) {
                player.isWallSliding = true;
                
                // Slime (5) is sticky, Ice (3) is slippery, default is 80
                const slideSpeed = (wallTile === 5) ? 30 : (wallTile === 3) ? 200 : 80;
                
                if (player.vy > slideSpeed) player.vy = slideSpeed; // Slow down descent
                
                // Slide sparks
                if (Math.random() < 0.4) {
                    const px = leftTile ? player.x : player.x + player.width;
                    const color = (wallTile === 5) ? 'rgba(100, 255, 100, 0.8)' : 'rgba(0, 255, 255, 0.8)';
                    addParticle(px, player.y + player.height/2 + (Math.random()-0.5)*10, 
                                leftTile ? 40 : -40, -60, color, 0.25, 'spark');
                }
            }
        }

        // Terminal velocity
        if (player.vy > 800) player.vy = 800;

        // Jumping and Wall Jumping
        if (keys.jumpPressed) {
            if (player.isWallSliding) {
                // Wall jump
                player.vy = player.jumpForce * 1.2;
                player.vx = player.facingRight ? -450 : 450;
                player.wallJumpTimer = 0.25; // Disable input briefly to escape wall
                
                // Jump stretch
                player.scaleX = 0.6;
                player.scaleY = 1.4;

                // Wall jump dust
                const dustX = player.facingRight ? player.x + player.width : player.x;
                for(let i=0; i<8; i++) {
                    addParticle(dustX, player.y + player.height/2, (Math.random()-0.5)*150, (Math.random()-0.5)*100, '#ffffff', 0.5, 'ring', 25);
                }
            } else if (player.isGrounded) {
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

    // We let Phaser Arcade Physics handle X and Y movements and tile collisions!
    // We only process landing squash/stretch and landing particles here.
    if (player.isGrounded && !player.wasGroundedLastFrame) {
        player.scaleX = 1.3;
        player.scaleY = 0.7;
        
        // Hard landing shake
        if (player.vy > 600) {
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 5}}));
        }

        for (let i = 0; i < 8; i++) {
            addParticle(player.x + player.width/2, player.y + player.height, 
                        (Math.random() - 0.5) * 150, -Math.random() * 60, 'rgba(0, 255, 255, 0.4)', 0.4);
        }
    }
    player.wasGroundedLastFrame = player.isGrounded;

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

    // Hide character body during Bio-Drill so the drill IS the character
    let charAlpha = 1.0;
    if (combatState.isBioDrilling) {
        const prog = Math.max(0, Math.min(1.0, 1 - (combatState.bioDrillTime / 0.35)));
        if (prog < 0.1) charAlpha = 1.0 - (prog / 0.1); 
        else if (prog > 0.8) charAlpha = (prog - 0.8) / 0.2; 
        else charAlpha = 0.0;
    }
    ctx.globalAlpha = charAlpha;

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
        ctx.lineCap = 'round';
        
        // Layered Glow
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
        ctx.lineWidth = thickness * 2.5;
        ctx.stroke();
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = thickness;
        ctx.stroke();
        
        // White core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.35;
        ctx.stroke();
        ctx.restore();
    };

    const getLegMorphCoords = (j, defaultSx, defaultSy, defaultEx, defaultEy) => {
        let sx = defaultSx;
        let sy = defaultSy;
        let tx = defaultEx;
        let ty = defaultEy;
        let p = 0;
        
        if (combatState.isCharging) {
            p = Math.max(0, Math.min(1.0, combatState.chargeTime / 0.25));
            const lvl = combatState.chargeLevel || 1;
            const outerRadius = (lvl === 3 ? 30 : (lvl === 2 ? 22 : 16)) + Math.sin(t * 15) * 2;
            const innerRadius = 5;
            
            // Orbit as indices 6, 7, 8, 9 (joining the 6 body strands to form a 10-tentacle vortex!)
            const k = 6 + j;
            const orbitAngle = t * 15 + (k / 10) * Math.PI * 2;
            
            const targetSx = Math.cos(orbitAngle) * innerRadius;
            const targetSy = Math.sin(orbitAngle) * innerRadius;
            sx = defaultSx + (targetSx - defaultSx) * p;
            sy = defaultSy + (targetSy - defaultSy) * p;
            
            const targetEx = Math.cos(orbitAngle + 0.8) * outerRadius;
            const targetEy = Math.sin(orbitAngle + 0.8) * outerRadius;
            tx = defaultEx + (targetEx - defaultEx) * p;
            ty = defaultEy + (targetEy - defaultEy) * p;
        } else if (combatState.isBioDrilling) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.bioDrillTime / 0.35)));
            // Stretch forward into drill helix
            const windAngle = j * Math.PI / 2 + t * 40;
            const targetX = 45 + j * 5;
            const targetY = Math.sin(windAngle) * 5;
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isGroundSmashing) {
            p = 1.0;
            const phase = combatState.smashPhase || 2;
            let targetX, targetY;
            if (phase === 1 || phase === 2) {
                targetX = (j - 1.5) * 15;
                targetY = -65;
            } else {
                targetX = (j - 1.5) * 4;
                targetY = 65;
            }
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isRisingBlast) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.risingBlastTime / 0.35)));
            const targetX = (j - 1.5) * 20;
            const targetY = -120;
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isLowSweeping) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.lowSweepTime / 0.25)));
            const targetX = 75 + j * 6;
            const targetY = 12 + (j - 1.5) * 2;
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isUpSlashing) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.upSlashTime / 0.2)));
            const targetX = 35 + (j - 1.5) * 10;
            const targetY = -85;
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isPogoSlashing) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.pogoSlashTime / 0.2)));
            const targetX = (j - 1.5) * 6;
            const targetY = 85;
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        } else if (combatState.isAttacking) {
            p = Math.max(0, Math.min(1.0, 1 - (combatState.attackTime / (combatState.comboStep === 3 ? 0.25 : 0.15))));
            let targetX, targetY;
            if (combatState.comboStep === 1) {
                targetX = 60; targetY = -5;
            } else if (combatState.comboStep === 2) {
                targetX = 50; targetY = 12;
            } else {
                targetX = 75; targetY = 0;
            }
            tx = defaultEx + (targetX - defaultEx) * p;
            ty = defaultEy + (targetY - defaultEy) * p;
        }
        
        return { sx, sy, tx, ty };
    };

    let legAngle1 = isRunning ? Math.sin(t * 10) * 0.5 : (isAirborne ? 0.3 : 0.2);
    let legAngle2 = isRunning ? Math.sin(t * 10 + Math.PI) * 0.5 : (isAirborne ? -0.2 : -0.2);
    
    const leg1Coords = getLegMorphCoords(0, 0, 0, -10 + Math.sin(legAngle1)*10, 15 + Math.cos(legAngle1)*5);
    const leg2Coords = getLegMorphCoords(1, 0, 0, 10 + Math.sin(legAngle2)*10, 15 + Math.cos(legAngle2)*5);
    
    drawLegTentacle(leg1Coords.sx, leg1Coords.sy, leg1Coords.tx, leg1Coords.ty, 2.5, 0);
    drawLegTentacle(leg2Coords.sx, leg2Coords.sy, leg2Coords.tx, leg2Coords.ty, 2.5, Math.PI);

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
        ctx.lineCap = 'round';
        
        // Layered Glow
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
        ctx.lineWidth = thickness * 2.8;
        ctx.stroke();
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = thickness;
        ctx.stroke();
        
        // White inner core
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
            // Morph the body into the flat base of the drill (character turns into the drill!)
            const targetX = 0; 
            const targetY = (k - 2.5) * 12; // Spread vertically at the back of the drill
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

    // Head - centered during charging K
    ctx.save();
    if (combatState.isCharging) {
        ctx.translate(0, 0); // Put head at the exact center of the charging vortex!
    } else {
        ctx.translate(5, -12);
    }
    let headRot = combatState.isCharging ? 0 : (isRunning ? 0.2 : (isAirborne ? -0.1 : Math.sin(t * 3) * 0.05));
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

    // Eye (Glowing bright) - changes color during charging (K) - Cyan and White only!
    if (combatState.isCharging) {
        const cTime = combatState.chargeTime;
        const flash = Math.floor(t * 35) % 2 === 0;
        if (cTime >= 0.7) {
            // Level 3: Flashes violently between bright cyan and white!
            ctx.fillStyle = flash ? '#00ffff' : '#ffffff';
            ctx.shadowColor = '#00ffff';
        } else if (cTime >= 0.3) {
            // Level 2: Blinks between cyan and deep blue!
            ctx.fillStyle = flash ? '#00ffff' : '#0077ff';
            ctx.shadowColor = '#00ffff';
        } else {
            // Level 1: Blinks between cyan and white!
            ctx.fillStyle = flash ? '#00ffff' : '#ffffff';
            ctx.shadowColor = '#00ffff';
        }
    } else {
        ctx.fillStyle = '#ffffff';
    }
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2); // Perfect circle in the center of the head!
    ctx.fill();
    
    // Sprite Drawing Helpers for VFX (with 100% Procedural Vector Fallbacks)
    const drawSlashSprite = (pt, angle, size, prog) => {
        if (!pt || size <= 0) return;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);
        
        const activeProg = (prog !== undefined) ? prog : 0.8;
        
        if (lightningSlashImg.complete && lightningSlashImg.naturalWidth > 0) {
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.65;
            const frameIdx = Math.max(0, Math.min(5, Math.floor(activeProg * 6)));
            try { ctx.drawImage(lightningSlashImg, frameIdx * 64, 0, 64, 64, -size/2, -size/2, size, size); } catch(e) {}
            ctx.restore();
            return;
        }

        // Procedural Vector Fallback: Chaotic Jittery Lightning Slash
        ctx.globalAlpha = 0.85 * (1 - activeProg * 0.5);
        
        const drawArc = (lineWidth, style) => {
            ctx.strokeStyle = style;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            // Draw a jagged arc (chaotic lightning curve)
            const segments = 6;
            const startAngle = -Math.PI * 0.4;
            const endAngle = Math.PI * 0.4;
            
            for (let i = 0; i <= segments; i++) {
                const tSegment = i / segments;
                const a = startAngle + (endAngle - startAngle) * tSegment;
                // Add random jitter to radius based on progress and noise
                const jitter = (Math.random() - 0.5) * size * 0.25;
                const r = (size * 0.5) + jitter;
                
                const px = Math.cos(a) * r;
                const py = Math.sin(a) * r;
                
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
        };

        // Layer 1: Outer glow
        drawArc(size * 0.4, 'rgba(0, 255, 255, 0.2)');
        // Layer 2: Mid glow
        drawArc(size * 0.2, 'rgba(0, 255, 255, 0.7)');
        // Layer 3: Core (white)
        drawArc(size * 0.05, '#ffffff');
        ctx.restore();
    };

    const drawImpactSprite = (pt, size, prog) => {
        const activeProg = (prog !== undefined) ? prog : 0.8;
        if (!pt || activeProg < 0.4 || size <= 0) return;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        
        if (lightningImpactImg.complete && lightningImpactImg.naturalWidth > 0) {
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.6;
            const animProg = Math.max(0, Math.min(1.0, (activeProg - 0.4) / 0.6));
            const frameIdx = Math.max(0, Math.min(6, Math.floor(animProg * 7)));
            try { ctx.drawImage(lightningImpactImg, frameIdx * 64, 0, 64, 64, -size/2, -size/2, size, size); } catch(e) {}
            ctx.restore();
            return;
        }

        // Procedural Vector Fallback: Electric Starburst Burst
        ctx.globalAlpha = 0.8;
        
        const drawBurst = (lineWidth, style) => {
            ctx.strokeStyle = style;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            // Random chaotic lines shooting outwards
            const linesCount = 8;
            for (let i = 0; i < linesCount; i++) {
                // Randomize angle slightly
                const a = (i / linesCount) * Math.PI * 2 + activeProg * 5 + (Math.random() - 0.5);
                // Randomize length
                const r = size * 0.2 + Math.random() * (size * 0.3);
                
                ctx.moveTo(0, 0);
                // Draw jagged lightning line
                const midX = Math.cos(a) * r * 0.5 + (Math.random()-0.5) * size * 0.1;
                const midY = Math.sin(a) * r * 0.5 + (Math.random()-0.5) * size * 0.1;
                ctx.lineTo(midX, midY);
                ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.stroke();
        };

        // Layer 1: Outer glow
        drawBurst(10, 'rgba(0, 255, 255, 0.2)');
        // Layer 2: Mid glow
        drawBurst(4, 'rgba(0, 255, 255, 0.6)');
        // Layer 3: Core
        drawBurst(1.5, 'rgba(255, 255, 255, 1)');
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.1 * Math.random(), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    };

    // Helper: Draw a procedural zigzag lightning bolt
    const drawLightningBolt = (x1, y1, x2, y2, segments, prog) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx*dx + dy*dy);
        const pts = [{x: x1, y: y1}];
        
        for (let i = 1; i < segments; i++) {
            const tVal = i / segments;
            // Removed (1 - prog) so the lightning is ALWAYS jagged and chaotic!
            const jitter = (Math.random() - 0.5) * (length * 0.15);
            pts.push({
                x: x1 + dx * tVal - (dy/length) * jitter,
                y: y1 + dy * tVal + (dx/length) * jitter
            });
        }
        pts.push({x: x2, y: y2});

        const fade = Math.min(1.0, (1 - prog) * 2);
        
        const strokeBolt = (lineWidth, style) => {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i <= segments; i++) {
                ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.lineJoin = 'miter';
            ctx.strokeStyle = style;
            ctx.lineWidth = lineWidth * (1 - prog + 0.2); // keep it slightly thick even at end
            ctx.stroke();
        };

        strokeBolt(8, `rgba(0, 255, 255, ${0.3 * fade})`);
        strokeBolt(4, `rgba(0, 255, 255, ${0.8 * fade})`);
        strokeBolt(1.5, `rgba(255, 255, 255, ${1.0 * fade})`);
    };

    // Antenna / Combat Tentacles (always visible!)
    const drawHeadSpaceTentacle = (startX, startY, endX, endY, progressVal, thickness, wigglePhase) => {
        const segments = 10;
        const pts = [{ x: startX, y: startY }];
        
        const curEndX = startX + (endX - startX) * progressVal;
        const curEndY = startY + (endY - startY) * progressVal;
        
        for (let i = 1; i <= segments; i++) {
            const tVal = i / segments;
            const targetX = startX + (curEndX - startX) * tVal;
            const targetY = startY + (curEndY - startY) * tVal;
            
            const wiggleAmp = combatState.isAttacking ? 20 : (combatState.isCharging ? 10 : 5);
            const wiggleSpeed = combatState.isAttacking ? 20 : (combatState.isCharging ? 30 : 5);
            const wiggle = Math.sin(t * wiggleSpeed + tVal * 5 + wigglePhase) * (wiggleAmp * tVal * progressVal);
            
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
        ctx.lineCap = 'round';
        // Make thickness jagged during charging to look less flat
        if (combatState.isCharging) {
            ctx.setLineDash([2, 2]);
        }
        
        const curThickness = thickness * Math.max(0.1, 1 - progressVal * 0.5);
        
        // Layered neon glow
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
        ctx.lineWidth = curThickness * 2.5;
        ctx.stroke();
        
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = curThickness;
        ctx.stroke();
        ctx.restore();
        
        for (let i = 2; i < pts.length; i += 2) {
            const nodeRadius = (thickness * 0.4) * (1 - (i/pts.length) * 0.4);
            ctx.save();
            ctx.beginPath();
            
            // Cyan glow circle
            ctx.fillStyle = 'rgba(0, 255, 255, 0.45)';
            ctx.arc(pts[i].x, pts[i].y, nodeRadius * 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // White core circle
            ctx.beginPath();
            ctx.fillStyle = '#ffffff'; 
            ctx.arc(pts[i].x, pts[i].y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        return pts[pts.length - 1]; 
    };

    if (combatState.isAttacking || combatState.isLowSweeping || combatState.isUpSlashing || combatState.isPogoSlashing) {
        // Draw the whipping tentacles starting from the antenna base (-2, -5)
        let progress = 0;
        if (combatState.isAttacking) progress = 1 - (combatState.attackTime / (combatState.comboStep === 3 ? 0.25 : 0.15));
        else if (combatState.isLowSweeping) progress = 1 - (combatState.lowSweepTime / 0.25);
        else if (combatState.isUpSlashing) progress = 1 - (combatState.upSlashTime / 0.2);
        else if (combatState.isPogoSlashing) progress = 1 - (combatState.pogoSlashTime / 0.2);

        if (combatState.comboStep === 1) {
            const tip1 = drawHeadSpaceTentacle(-2, -5, 80, -10, progress, 6, 0);
            const tip2 = drawHeadSpaceTentacle(-2, -5, 60, 20, progress, 4, 1);
            drawSlashSprite(tip1, -Math.PI / 8, 30);
            drawImpactSprite(tip1, 35);
        } else if (combatState.comboStep === 2) {
            const tip1 = drawHeadSpaceTentacle(-2, -5, 90, 25, progress, 7, 2);
            const tip2 = drawHeadSpaceTentacle(-2, -5, 70, -15, progress, 5, 3);
            drawSlashSprite(tip1, Math.PI / 6, 35);
            drawImpactSprite(tip1, 40);
        } else if (combatState.comboStep === 3) {
            let mainTip = null;
            for (let k = 0; k < 5; k++) {
                const angle = -Math.PI/6 + (k/4) * Math.PI/3;
                const dist = 110 - Math.abs(k - 2) * 15;
                const tip = drawHeadSpaceTentacle(-2, -5, Math.cos(angle) * dist, Math.sin(angle) * dist, progress, 6 - Math.abs(k-2), k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, 0, 45);
                drawImpactSprite(mainTip, 60);
            }
        } else if (combatState.isLowSweeping) {
            let mainTip = null;
            for (let k = 0; k < 5; k++) {
                const angle = Math.PI/12 + (k/4) * Math.PI/4;
                const dist = 110 - Math.abs(k - 2) * 20;
                const tip = drawHeadSpaceTentacle(-2, -5, Math.cos(angle) * dist, Math.sin(angle) * dist, progress, 7 - Math.abs(k-2), k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, Math.PI / 6, 60);
                drawImpactSprite(mainTip, 80);
                if (Math.random() > 0.3) drawLightningBolt(-2, -5, mainTip.x, mainTip.y + 20, 8, progress);
            }
        } else if (combatState.isUpSlashing) {
            let mainTip = null;
            for (let k = 0; k < 5; k++) {
                const angle = -Math.PI/2 + (k/4) * Math.PI/3;
                const dist = 110 - Math.abs(k - 2) * 20;
                const tip = drawHeadSpaceTentacle(-2, -5, Math.cos(angle) * dist, Math.sin(angle) * dist, progress, 7 - Math.abs(k-2), k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, -Math.PI / 3, 60);
                drawImpactSprite(mainTip, 80);
                if (Math.random() > 0.3) drawLightningBolt(-2, -5, mainTip.x, mainTip.y - 40, 8, progress);
            }
        } else if (combatState.isPogoSlashing) {
            let mainTip = null;
            for (let k = 0; k < 5; k++) {
                const angle = Math.PI/2 - Math.PI/6 + (k/4) * Math.PI/3;
                const dist = 120 - Math.abs(k - 2) * 15;
                const tip = drawHeadSpaceTentacle(-2, -5, Math.cos(angle) * dist, Math.sin(angle) * dist, progress, 8 - Math.abs(k-2), k);
                if (k === 2) mainTip = tip;
            }
            if (mainTip) {
                drawSlashSprite(mainTip, Math.PI / 2, 70);
                drawImpactSprite(mainTip, 90);
                if (Math.random() > 0.3) drawLightningBolt(-2, -5, mainTip.x, mainTip.y + 40, 8, progress);
            }
        }
    } else if (combatState.isCharging) {
        // Spin tentacles around the head during charge K
        const chargeSpeed = t * (15 + combatState.chargeLevel * 10);
        for (let k = 0; k < 4; k++) {
            const angle = chargeSpeed + (k * Math.PI / 2);
            const dist = 25 + combatState.chargeLevel * 10;
            drawHeadSpaceTentacle(0, 0, Math.cos(angle) * dist, Math.sin(angle) * dist, 1.0, 3 + combatState.chargeLevel, k);
        }
    } else if (combatState.isDashing || player.isDashing) {
        // Fly backwards during dash
        for (let k = 0; k < 4; k++) {
            drawHeadSpaceTentacle(-2, -5, -60, -10 + (k-2)*15, 1.0, 4, k);
        }
    } else if (combatState.isBioDrilling) {
        // Head tentacles stream backwards like drill stabilizers/exhaust
        const prog = Math.max(0, Math.min(1.0, 1 - (combatState.bioDrillTime / 0.35)));
        const pullBack = -40 * prog;
        for (let k = 0; k < 4; k++) {
            drawHeadSpaceTentacle(-2, -5, pullBack, (k-1.5)*15, prog, 5, k);
        }
    } else {
        // Idle/Run state: Flowing gracefully backwards
        const idleFlow = isRunning ? -25 : -15;
        drawHeadSpaceTentacle(-2, -5, idleFlow, -15, 1.0, 4, 0);
        drawHeadSpaceTentacle(-2, -5, idleFlow + 5, -8, 1.0, 3, 1.5);
    }

    if (combatState.isDashStriking) {
        // Dash Strike: Multi-Layer Glow Vector + Trail
        ctx.save();
        ctx.translate(-2, -15); // Body center
        
        const prog = (t * 8) % 1.0;
        const drillW = 150; // Shorter and sharper
        const drillH = 40 + Math.sin(t * 60) * 8;
        
        // Speed lines for motion feel
        ctx.save();
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * (1 - prog)})`;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
            const lineY = (Math.random() - 0.5) * 80;
            const lineX = Math.random() * 200 - 100;
            ctx.moveTo(lineX, lineY);
            ctx.lineTo(lineX - 100 - Math.random() * 100, lineY);
        }
        ctx.stroke();
        ctx.restore();

        const drawCone = (scaleX, scaleY, alpha) => {
            ctx.beginPath();
            ctx.moveTo(-10 * scaleX, -drillH/2 * scaleY);
            ctx.bezierCurveTo(drillW*0.3 * scaleX, -drillH/4 * scaleY, drillW*0.6 * scaleX, -10 * scaleY, drillW * scaleX, 0);
            ctx.bezierCurveTo(drillW*0.6 * scaleX, 10 * scaleY, drillW*0.3 * scaleX, drillH/4 * scaleY, -10 * scaleX, drillH/2 * scaleY);
            ctx.closePath();
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.fill();
        };

        // Afterimage trail
        for (let trail = 1; trail <= 3; trail++) {
            ctx.save();
            ctx.translate(-trail * 30, 0);
            drawCone(1.0, 1.0, 0.1 / trail);
            ctx.restore();
        }

        // Layer 1: Outer glow
        drawCone(1.1, 1.2, 0.2);
        // Layer 2: Mid glow
        drawCone(1.0, 1.0, 0.5);
        
        // Layer 3: Core (white)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-10 * 0.8, -drillH/2 * 0.5);
        ctx.bezierCurveTo(drillW*0.3 * 0.8, -drillH/4 * 0.5, drillW*0.6 * 0.8, -10 * 0.5, drillW * 0.8, 0);
        ctx.bezierCurveTo(drillW*0.6 * 0.8, 10 * 0.5, drillW*0.3 * 0.8, drillH/4 * 0.5, -10 * 0.8, drillH/2 * 0.5);
        ctx.closePath();
        ctx.fill();
        
        // Draw energy rings wrapping around the dash
        for (let i = 0; i < 3; i++) {
            const ringProg = (prog + i/3) % 1.0;
            const ringX = ringProg * drillW * 0.8;
            const ringY = (1 - ringProg) * (drillH/2);
            
            const drawRing = (lineWidth, style) => {
                ctx.strokeStyle = style;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.ellipse(ringX, 0, 8, ringY, 0, 0, Math.PI * 2);
                ctx.stroke();
            };
            
            drawRing(8, `rgba(0, 255, 255, ${(1 - ringProg) * 0.3})`);
            drawRing(4, `rgba(0, 255, 255, ${1 - ringProg})`);
            drawRing(1.5, `rgba(255, 255, 255, ${1 - ringProg})`);
        }
        
        if (Math.random() > 0.5) addParticle(player.x + (player.facingRight ? drillW : -drillW), player.y - 15, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
        
        drawImpactSprite({x: drillW*0.9, y: 0}, 80, prog);
        ctx.restore();
    } else if (combatState.isBioDrilling) {
        // Bio-Drill (Neutral I): Solid Energy/Mechanical Drill
        const prog = Math.max(0, Math.min(1.0, 1 - (combatState.bioDrillTime / 0.35)));
        
        ctx.globalAlpha = 1.0; // Ensure the drill itself is fully visible!
        
        ctx.save();
        ctx.translate(-2, -15); // Center on body
        ctx.translate((Math.random()-0.5)*5, (Math.random()-0.5)*5); // Heavy shake
        
        const drillLen = 70; // Shortened drill bit
        const baseRad = 22; // Wide base at the back
        const spin = (t * 600) % 30; // Fast thread spinning
        
        // 1. Draw the main solid cone (Drill Bit)
        ctx.beginPath();
        ctx.moveTo(drillLen, 0);    // Tip (front)
        ctx.lineTo(0, -baseRad);    // Top base (back)
        ctx.lineTo(0, baseRad);     // Bottom base (back)
        ctx.closePath();
        
        // Gradient to make it look like a glowing metallic/energy cone
        const grad = ctx.createLinearGradient(0, -baseRad, 0, baseRad);
        grad.addColorStop(0, 'rgba(0, 255, 255, 0.6)');
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, 'rgba(0, 255, 255, 0.6)');
        ctx.fillStyle = grad;
        ctx.fill();
        
        // 2. Add diagonal drill threads wrapping around the cone
        ctx.save();
        // Clip to the cone shape so threads don't bleed out
        ctx.beginPath();
        ctx.moveTo(drillLen, 0); ctx.lineTo(0, -baseRad); ctx.lineTo(0, baseRad); ctx.closePath();
        ctx.clip();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        // Draw angled lines sweeping backwards to simulate rotation
        for (let x = -30; x < drillLen + 30; x += 25) {
            const threadX = x + spin; // Move threads to animate rotation
            ctx.moveTo(threadX, -baseRad);
            ctx.lineTo(threadX + 40, baseRad);
        }
        ctx.stroke();
        ctx.restore(); // End clip
        
        // 3. Draw Base Ring (Connecting the drill to the player)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, baseRad + 5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Sparks at the drill tip
        if (Math.random() > 0.3) addParticle(player.x + (player.facingRight ? drillLen : -drillLen), player.y - 15, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
        
        drawImpactSprite({x: drillLen, y: 0}, 60, (t * 8) % 1.0);
        ctx.restore();
    } else if (combatState.isLowSweeping || combatState.isUpSlashing || combatState.isPogoSlashing || combatState.isRisingBlast) {

        if (combatState.isLowSweeping) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.lowSweepTime / 0.25)));
            
            // Giant lightning crack running across the ground
            ctx.save();
            ctx.translate(0, 15); // Feet
            for(let bolt=0; bolt<4; bolt++) { // More bolts, random lengths
                const len = (150 + Math.random() * 250) * prog; // Random length 150-400
                const yOffset = (Math.random()-0.5)*40; // Random Y spread
                drawLightningBolt(0, 0, len, yOffset, 6 + Math.random()*4, prog);
            }
            ctx.restore();
            
            if (Math.random() > 0.5) addParticle(player.x + (player.facingRight ? 100*prog : -100*prog), player.y + 15, (Math.random()-0.5)*50, (Math.random()-0.5)*50 - 50, 'rgba(200,200,200,0.5)', 0.6, 'tex_smoke', 20);
            
        } else if (combatState.isUpSlashing) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.upSlashTime / 0.2)));
            
            // Giant lightning strike shooting UPWARDS in a chaotic fan
            ctx.save();
            for(let bolt=0; bolt<4; bolt++) {
                const endX = (Math.random()-0.5)*250; // Random wide fan
                const endY = -(200 + Math.random()*200) * prog; // Random height
                drawLightningBolt(0, -20, endX, endY, 6 + Math.random()*4, prog);
            }
            ctx.restore();
            
            if (Math.random() > 0.3) addParticle(player.x + (Math.random()-0.5)*100, player.y - 100 * prog, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
            
        } else if (combatState.isPogoSlashing) {
            const prog = Math.max(0, Math.min(1, 1 - (combatState.pogoSlashTime / 0.2)));
            
            // Giant lightning strike shooting DOWNWARDS in a chaotic fan
            ctx.save();
            for(let bolt=0; bolt<4; bolt++) {
                const endX = (Math.random()-0.5)*250; // Random wide fan
                const endY = (200 + Math.random()*200) * prog; // Random depth
                drawLightningBolt(0, 20, endX, endY, 6 + Math.random()*4, prog);
            }
            ctx.restore();
            
            if (Math.random() > 0.5) addParticle(player.x + (Math.random()-0.5)*50, player.y + 20 + 100 * prog, (Math.random()-0.5)*50, (Math.random()-0.5)*50 - 50, 'rgba(200,200,200,0.5)', 0.6, 'tex_smoke', 20);
            
        } else if (combatState.isRisingBlast) {
            const prog = Math.max(0, Math.min(1.0, 1 - (combatState.risingBlastTime / 0.35)));

            // Multi-Layer Glow Lightning Pillars
            ctx.save();
            
            const cols = [-90, -45, 0, 45, 90];
            cols.forEach((colX, idx) => {
                ctx.save();
                ctx.translate(colX, 20); // Base at feet
                
                const fadeAlpha = Math.min(1.0, (1 - prog) * 2.0);
                
                if (fadeAlpha > 0) {
                    const colHeight = 350 + Math.random() * 50;
                    
                    // Draw 3 chaotic lightning bolts per pillar!
                    for(let bolt = 0; bolt < 3; bolt++) {
                        const startX = colX + (Math.random()-0.5)*30;
                        const endX = colX + (Math.random()-0.5)*30;
                        drawLightningBolt(startX, 0, endX, -colHeight, 10, prog);
                    }
                    
                    // Base impact circle
                    ctx.fillStyle = `rgba(0, 255, 255, ${(1 - prog)})`;
                    ctx.beginPath();
                    ctx.ellipse(colX, 0, 30 * (1 - prog), 10 * (1 - prog), 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    if (Math.random() > 0.6) addParticle(player.x + (player.facingRight ? colX : -colX), player.y + 20, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
                }
                
                ctx.restore();
            });
            ctx.restore();

            // Draw expanding shockwave rings (Multi-Layer)
            ctx.save();
            
            const ringCount = 3;
            for (let r = 0; r < ringCount; r++) {
                const ringProg = (prog + r / ringCount) % 1.0;
                const radius = ringProg * 120;
                const alpha = 1.0 - ringProg;
                
                const drawShockwaveRing = (lineWidth, style) => {
                    ctx.strokeStyle = style;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.ellipse(0, -player.height/2 - ringProg * 120, radius, radius * 0.4, 0, 0, Math.PI * 2);
                    ctx.stroke();
                };
                
                drawShockwaveRing(10, `rgba(0, 255, 255, ${alpha * 0.2})`);
                drawShockwaveRing(4, `rgba(0, 255, 255, ${alpha * 0.8})`);
                drawShockwaveRing(1.5, `rgba(255, 255, 255, ${alpha})`);
            }
            ctx.restore();
        }
    } else if (combatState.isLightningNova) {
        const prog = Math.max(0, Math.min(1.0, 1 - (combatState.lightningNovaTime / 0.3)));
        // Multi-Layer Glow Nova Burst with Zigzag Sét
        ctx.save();
        ctx.translate(-2, -15);
        
        const fadeAlpha = Math.min(1.0, (1 - prog) * 2.0); // fade out
        if (fadeAlpha > 0) {
            // Scales up aggressively
            const radius = 50 + prog * 400;
            
            const drawNovaArc = (lineWidth, style) => {
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI*2);
                ctx.strokeStyle = style;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            };
            
            // Shockwave ring instead of filled circle
            drawNovaArc(15, `rgba(0, 255, 255, ${0.2 * fadeAlpha})`);
            drawNovaArc(6, `rgba(0, 255, 255, ${0.6 * fadeAlpha})`);
            drawNovaArc(2, `rgba(255, 255, 255, ${1.0 * fadeAlpha})`);
            
            // 8 jagged zigzag lightning spikes
            for(let k=0; k<8; k++) {
                const angle = (k / 8) * Math.PI * 2 + t * 5;
                const spikeLen = radius + Math.sin(t*30 + k)*50;
                
                const endX = Math.cos(angle) * spikeLen;
                const endY = Math.sin(angle) * spikeLen;
                for(let bolt=0; bolt<3; bolt++) {
                    const boltEndX = endX + (Math.random()-0.5)*40;
                    const boltEndY = endY + (Math.random()-0.5)*40;
                    drawLightningBolt(0, 0, boltEndX, boltEndY, 6, prog);
                }
                
                if (Math.random() > 0.5) addParticle(player.x + endX, player.y - 15 + endY, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
                drawImpactSprite({x: endX, y: endY}, 60, prog);
            }
            
            // Electric arcs between spikes
            ctx.beginPath();
            for(let k=0; k<8; k+=2) {
                const angle1 = (k / 8) * Math.PI * 2 + t * 5;
                const angle2 = ((k+1) / 8) * Math.PI * 2 + t * 5;
                const r = radius * 0.7;
                ctx.moveTo(Math.cos(angle1) * r, Math.sin(angle1) * r);
                ctx.lineTo(Math.cos(angle2) * r, Math.sin(angle2) * r);
            }
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 * fadeAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();
    } else if (combatState.isGroundSmashing) {
        const prog = combatState.smashPhase === 3 ? 1.0 : Math.max(0, 1 - (combatState.smashCooldown / 1.5));
        
        ctx.save();
        ctx.translate(-2, -15);
        if (combatState.smashPhase === 1 || combatState.smashPhase === 2) {
            // Gathering power phase (floating) - Image-based Plasma Orb
            const orbRadius = 8; // SMALLER orb!
            const orbY = -35;
            
            // Draw tentacles holding the orb
            drawHeadSpaceTentacle(-2, -5, 10, -40, 1.0, 5, 0);
            drawHeadSpaceTentacle(-2, -5, -10, -40, 1.0, 5, 1);
            drawHeadSpaceTentacle(-2, -5, 0, -45, 1.0, 6, 2);
            
            ctx.globalCompositeOperation = 'screen';
            
            ctx.save();
            ctx.translate(0, orbY);
            
            // Soft Cyan Core Glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw spherical cage of electricity instead of solid orb!
            // Inner Core (Dense overlapping sparks)
            if (spark1Img && spark1Img.complete) {
                for(let k = 0; k < 3; k++) {
                    const s = 40 + Math.random() * 10; // Much larger!
                    ctx.save();
                    ctx.rotate(t * (10 + k * 5) + Math.random() * Math.PI * 2); // chaotic spin
                    ctx.globalAlpha = 0.7 + Math.random()*0.3;
                    try { ctx.drawImage(spark1Img, -s/2, -s/2, s, s); } catch(e) {}
                    ctx.restore();
                }
            }
            
            // Outer Chaotic Shell (Wild reaching sparks)
            if (spark2Img && spark2Img.complete) {
                for(let k = 0; k < 4; k++) {
                    const s = 60 + Math.random() * 20; // Massive!
                    ctx.save();
                    ctx.rotate(-t * (15 + k * 4) + Math.random() * Math.PI * 2); // extremely chaotic spin
                    ctx.globalAlpha = 0.5 + Math.random()*0.5;
                    try { ctx.drawImage(spark2Img, -s/2, -s/2, s, s); } catch(e) {}
                    ctx.restore();
                }
            }
            
            ctx.restore();
            ctx.globalCompositeOperation = 'source-over'; // Reset blending
        } else if (combatState.smashPhase === 3 && player.isGrounded) {
            // Screen Shake
            ctx.translate((Math.random()-0.5)*15, (Math.random()-0.5)*15);
            
            // Proper 2D game ground smash impact (Multi-Layer)
            ctx.save();
            ctx.translate(0, 15); // Feet level
            
            const timeActive = 1.5 - combatState.smashCooldown;
            const animDuration = 0.5;
            const animProg = Math.max(0, Math.min(1.0, timeActive / animDuration));
            
            const radius = 100 + animProg * 400; // Scales up aggressively
            const fadeAlpha = Math.min(1.0, (animDuration - timeActive) * 2.0); // fade out
            
            if (fadeAlpha > 0) {
                // Ground Cracks
                ctx.save();
                ctx.scale(1, 0.4);
                ctx.strokeStyle = `rgba(0, 255, 255, ${fadeAlpha})`;
                ctx.lineWidth = 4;
                for (let c = 0; c < 5; c++) {
                    const angle = (c / 5) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle)*radius, Math.sin(angle)*radius);
                    ctx.stroke();
                }
                
                // Draw squashed crater on the ground (Perspective)
                const drawCrater = (scale, style) => {
                    ctx.beginPath();
                    ctx.arc(0, 0, radius * scale, 0, Math.PI*2);
                    ctx.fillStyle = style;
                    ctx.fill();
                };
                
                drawCrater(1.0, `rgba(0, 255, 255, ${0.15 * fadeAlpha})`);
                drawCrater(0.6, `rgba(0, 255, 255, ${0.6 * fadeAlpha})`);
                drawCrater(0.3, `rgba(255, 255, 255, ${1.0 * fadeAlpha})`);
                
                ctx.restore();
            }
            
            // Ground glowing crater (ellipse) static multi-layer
            const craterW = 400 + Math.random()*20;
            const craterH = 60 + Math.random()*10;
            
            const drawEllipseCrater = (wScale, hScale, style) => {
                ctx.fillStyle = style;
                ctx.beginPath();
                ctx.ellipse(0, 0, craterW * wScale, craterH * hScale, 0, 0, Math.PI*2);
                ctx.fill();
            };
            
            drawEllipseCrater(0.7, 0.7, `rgba(0, 255, 255, ${0.2 * fadeAlpha})`);
            drawEllipseCrater(0.5, 0.5, `rgba(0, 255, 255, ${0.6 * fadeAlpha})`);
            drawEllipseCrater(0.25, 0.25, `rgba(255, 255, 255, ${1.0 * fadeAlpha})`);
            
            // Lightning Pillar of energy shooting up from impact
            const pillarH = 400 * Math.max(0, Math.min(1, 1.5 - combatState.smashCooldown));
            for(let bolt = 0; bolt < 4; bolt++) {
                const boltStartX = (Math.random()-0.5)*40;
                const boltEndX = (Math.random()-0.5)*60;
                drawLightningBolt(boltStartX, 0, boltEndX, -pillarH, 10, animProg);
            }
            
            // Debris Particles
            if (animProg < 0.2) {
                for(let i=0; i<3; i++) {
                    addParticle(player.x + (Math.random()-0.5)*100, player.y + 15, (Math.random()-0.5)*50, (Math.random()-0.5)*50 - 50, 'rgba(200,200,200,0.5)', 0.6, 'tex_smoke', 20);
                    addParticle(player.x + (Math.random()-0.5)*50, player.y + 15, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
                }
            }
            
            // Impact sparks
            drawImpactSprite({x: 0, y: 0}, 150, (t*5)%1.0);
            
            ctx.restore();
        }
        ctx.restore();
    } else if (combatState.isCharging) {
        // Spin the head tentacles around the head center (which is 0,0 during charging)!
        const lvl = combatState.chargeLevel || 1;
        const antennaCount = lvl === 3 ? 3 : 2;
        const length = 18 + (lvl * 4);
        
        for (let a = 0; a < antennaCount; a++) {
            const angle = t * 24 + (a / antennaCount) * Math.PI * 2;
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 0); // starts at head center (0,0)
            
            // Draw a nice wavy tentacle coiling outwards
            const pts = [{ x: 0, y: 0 }];
            const targetX = Math.cos(angle) * length;
            const targetY = Math.sin(angle) * length;
            
            const segments = 6;
            for (let i = 1; i <= segments; i++) {
                const tVal = i / segments;
                const tx = targetX * tVal;
                const ty = targetY * tVal;
                const wiggle = Math.sin(t * 30 + tVal * 4 + a) * (4 * tVal);
                
                const dx = targetX;
                const dy = targetY;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                pts.push({
                    x: tx + (-dy / len) * wiggle,
                    y: ty + (dx / len) * wiggle
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            
            ctx.save();
            ctx.lineCap = 'round';
            // Layered neon glow
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
            ctx.lineWidth = 1.8 * 2.5;
            ctx.stroke();
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.restore();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.restore();
        }
    }

    if (combatState.isReleasingBeam) {
        ctx.save();
        
        // Translate to the "eye" position relative to the feet
        ctx.translate(-2, -15);
        
        const lvl = combatState.chargeLevel || 1;
        const maxDuration = lvl === 3 ? 0.35 : (lvl === 2 ? 0.22 : 0.15);
        const prog = Math.max(0, Math.min(1.0, combatState.beamTime / maxDuration));
        
        // Intense screen shake based on beam power and progress
        const shakeMag = (lvl === 3 ? 6 : 3) * prog;
        ctx.translate((Math.random()-0.5)*shakeMag, (Math.random()-0.5)*shakeMag);

        const baseThickness = lvl === 3 ? 140 : (lvl === 2 ? 90 : 50);
        
        // Pulse and jitter the thickness
        const pulse = 1.0 + Math.sin(t * 50) * 0.15 + (Math.random() * 0.2);
        const curThickness = baseThickness * prog * pulse;
        
        // Stretch the beam length rapidly at the start, then hold
        const beamLength = 100 + (1 - Math.pow(prog, 3)) * 800;

        // 100% Vector Laser Beam (Replaces heavy 670KB image)
        ctx.save();
        
        const drawLaserLayer = (scaleY, color, alphaScale) => {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(1.0, prog * alphaScale);
            ctx.beginPath();
            ctx.rect(0, (-curThickness * scaleY) / 2, beamLength, curThickness * scaleY);
            ctx.fill();
        };

        // Layer 1: Outer cyan glow
        drawLaserLayer(1.5, '#00ffff', 0.2);
        // Layer 2: Mid cyan core
        drawLaserLayer(0.8, '#00ffff', 0.6);
        // Layer 3: Inner white core
        if (lvl >= 2) drawLaserLayer(0.3, '#ffffff', 1.0);

        // Add Noise/Jitter edges to simulate plasma
        ctx.globalAlpha = prog * 0.8;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let ix = 0; ix < beamLength; ix += 30) {
            const jitterY = (Math.random() - 0.5) * curThickness * 1.2;
            ctx.lineTo(ix, jitterY);
        }
        ctx.stroke();
        
        // Impact Burst at the end of the beam
        if (prog > 0.5) {
            ctx.save();
            ctx.translate(beamLength, 0);
            
            const impactRad = curThickness * (Math.random() * 0.5 + 0.8);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, impactRad);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#00ffff');
            grad.addColorStop(1, 'rgba(0, 255, 255, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, impactRad, 0, Math.PI * 2);
            ctx.fill();
            
            // Beam Particles
            for(let p=0; p<2; p++) {
                addParticle(player.x + (player.facingRight ? beamLength : -beamLength), player.y - 15 + (Math.random()-0.5)*curThickness, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15);
            }
            ctx.restore();
        }
        
        ctx.restore();
        
        // Muzzle Flash / Energy Orb at the eye
        const flashRadius = (lvl === 3 ? 60 : 35) * prog * (1.0 + Math.random() * 0.3);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flashRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#00ffff');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, flashRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Draw Lightning Trail (Fast Non-Recursive Procedural Lightning)
    if (combatState.isDashStriking) {
        const drawFastLightning = (sx, sy, ex, ey, disp, thickness = 3.5) => {
            if (thickness < 0.5) return;
            const dx = ex - sx;
            const dy = ey - sy;
            const length = Math.sqrt(dx*dx + dy*dy);
            if (length < 5) return;

            const steps = Math.min(Math.floor(length / 25), 8); // Minimum steps
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            
            for (let i = 1; i < steps; i++) {
                const tVal = i / steps;
                const tx = sx + dx * tVal;
                const ty = sy + dy * tVal;
                
                const nx = -dy / length;
                const ny = dx / length;
                const offset = (Math.random() - 0.5) * disp;
                
                ctx.lineTo(tx + nx * offset, ty + ny * offset);
            }
            ctx.lineTo(ex, ey);
            
            // Fast double stroke for glow
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.lineWidth = thickness * 2.5;
            ctx.stroke();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = thickness * 0.5;
            ctx.stroke();
            ctx.restore();
        };

        const lvl = combatState.chargeLevel || 1;
        const trailCount = lvl === 3 ? 3 : (lvl === 2 ? 2 : 1);
        const disp = lvl === 3 ? 12 : 8;
        const lengthMultiplier = lvl === 3 ? 1.5 : 1.0;
        const thickness = lvl === 3 ? 4 : 2;
        
        for (let j = 0; j < trailCount; j++) {
            const startOffset = -10 + j * 4;
            const endOffsetX = (-120 - Math.random() * 50) * lengthMultiplier;
            const endOffsetY = (j - (trailCount - 1) / 2) * 16 + (Math.random() - 0.5) * 15;
            
            drawFastLightning(-2, -5 + startOffset, endOffsetX, endOffsetY, disp, thickness);
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

    // Draw Front Legs (Redesigned as slowly wiggling tentacles, participating in morphs!)
    let legAngle3 = isRunning ? Math.sin(t * 10 + Math.PI/2) * 0.5 : (isAirborne ? 0.5 : 0);
    let legAngle4 = isRunning ? Math.sin(t * 10 + Math.PI*1.5) * 0.5 : (isAirborne ? -0.5 : 0.1);
    
    const leg3Coords = getLegMorphCoords(2, 2, 2, -8 + Math.sin(legAngle3)*10, 15 + Math.cos(legAngle3)*5);
    const leg4Coords = getLegMorphCoords(3, 2, 2, 12 + Math.sin(legAngle4)*10, 15 + Math.cos(legAngle4)*5);
    
    drawLegTentacle(leg3Coords.sx, leg3Coords.sy, leg3Coords.tx, leg3Coords.ty, 2.2, Math.PI / 2);
    drawLegTentacle(leg4Coords.sx, leg4Coords.sy, leg4Coords.tx, leg4Coords.ty, 2.2, Math.PI * 1.5);
    
    ctx.globalAlpha = 1.0; // Reset alpha to normal at the end of drawPlayer

    ctx.restore();
}
