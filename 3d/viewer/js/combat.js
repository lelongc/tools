import { keys } from './input.js';
import { addParticle } from './effects.js';
import { getCollision, TILE_SIZE } from './world.js';

export const combatState = {
    isAttacking: false,
    attackTime: 0,
    attackDuration: 0.15,
    attackCooldown: 0,
    comboStep: 0,
    comboWindow: 0,
    
    isDashStriking: false,
    dashStrikeTime: 0,
    dashStrikeCooldown: 0,
    
    isGroundSmashing: false,
    smashCooldown: 0,
    
    hitbox: { x: 0, y: 0, width: 40, height: 40 }
};

export function updateCombat(player, dt) {
    // Cooldowns
    if (combatState.attackCooldown > 0) combatState.attackCooldown -= dt;
    if (combatState.comboWindow > 0) combatState.comboWindow -= dt;
    if (combatState.dashStrikeCooldown > 0) combatState.dashStrikeCooldown -= dt;
    if (combatState.smashCooldown > 0) combatState.smashCooldown -= dt;

    if (combatState.comboWindow <= 0 && !combatState.isAttacking) {
        combatState.comboStep = 0; // Reset combo if window expires
    }

    // SKILL 1: Normal Attack Combo (J)
    if (keys.skill1Pressed && combatState.attackCooldown <= 0 && !combatState.isAttacking && !combatState.isDashStriking && !combatState.isGroundSmashing) {
        combatState.isAttacking = true;
        combatState.comboStep++;
        if (combatState.comboStep > 3) combatState.comboStep = 1;
        
        combatState.attackTime = combatState.attackDuration;
        // Hit 3 is slower but stronger
        if (combatState.comboStep === 3) {
            combatState.attackTime = 0.25;
            combatState.attackCooldown = 0.5;
            player.vx += player.facingRight ? 300 : -300; // Lunge forward
        } else {
            combatState.attackCooldown = 0.2;
            player.vx += player.facingRight ? 100 : -100;
        }
        
        combatState.comboWindow = 0.6; // Time to press next hit
    }

    // SKILL 2: Dash Strike (K)
    if (keys.skill2Pressed && combatState.dashStrikeCooldown <= 0 && !combatState.isDashStriking && !combatState.isGroundSmashing) {
        combatState.isDashStriking = true;
        combatState.dashStrikeTime = 0.2; // 200ms dash
        combatState.dashStrikeCooldown = 1.5;
        player.vy = 0; // Suspend in air
    }

    // SKILL 3: Ground Smash (L in air)
    if (keys.skill3Pressed && !player.isGrounded && combatState.smashCooldown <= 0 && !combatState.isGroundSmashing) {
        combatState.isGroundSmashing = true;
        player.vx = 0;
        player.vy = -300; // Slight hop before smash
    }

    // --- EXECUTE SKILLS ---

    // Execute Skill 1 (Combo)
    if (combatState.isAttacking) {
        combatState.attackTime -= dt;
        
        combatState.hitbox.y = player.y - 10;
        if (player.facingRight) {
            combatState.hitbox.x = player.x + player.width;
        } else {
            combatState.hitbox.x = player.x - combatState.hitbox.width;
        }

        // Sword particles
        const color = combatState.comboStep === 3 ? 'rgba(255, 50, 200, 0.8)' : 'rgba(0, 255, 255, 0.8)';
        addParticle(
            combatState.hitbox.x + Math.random() * combatState.hitbox.width,
            combatState.hitbox.y + Math.random() * combatState.hitbox.height,
            player.facingRight ? 300 : -300,
            (Math.random() - 0.5) * 100,
            color,
            0.15
        );

        if (combatState.attackTime <= 0) {
            combatState.isAttacking = false;
        }
    }

    // Execute Skill 2 (Dash Strike)
    if (combatState.isDashStriking) {
        combatState.dashStrikeTime -= dt;
        player.vx = player.facingRight ? 1200 : -1200;
        player.vy = 0; // Ignore gravity
        
        player.scaleX = 2.0; // Extreme stretch
        player.scaleY = 0.3;

        addParticle(
            player.x + player.width/2,
            player.y + player.height/2,
            (Math.random() - 0.5) * 500 - player.vx * 0.5,
            (Math.random() - 0.5) * 50,
            'rgba(255, 255, 0, 0.8)',
            0.4
        );

        if (combatState.dashStrikeTime <= 0) {
            combatState.isDashStriking = false;
            player.vx = player.facingRight ? 300 : -300; // Residual momentum
        }
    }

    // Execute Skill 3 (Ground Smash)
    if (combatState.isGroundSmashing) {
        if (player.vy >= 0) {
            player.vy = 1500; // Slam down super fast
            player.scaleX = 0.5;
            player.scaleY = 2.0;
            
            // Trail going down
            addParticle(player.x + player.width/2, player.y, (Math.random()-0.5)*100, -500, 'rgba(255, 100, 0, 0.8)', 0.5);
        }
        
        // If hit ground
        if (player.isGrounded || getCollision(player.x, player.y + 5, player.width, player.height)) {
            combatState.isGroundSmashing = false;
            combatState.smashCooldown = 2.0;
            
            // SHOCKWAVE EFFECT
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 20}}));
            
            for(let i=0; i<30; i++) {
                addParticle(player.x + player.width/2, player.y + player.height, 
                            (Math.random()-0.5)*800, -Math.random()*400, 'rgba(255, 100, 0, 1)', 0.8);
            }
        }
    }
}

export function drawCombat(ctx, camera, player) {
    if (!player) return;
    const time = Date.now() / 1000;
    
    // Helper to draw a procedural tentacle
    const drawTentacle = (startX, startY, endX, endY, progress, thickness, color, wigglePhase) => {
        const segments = 10;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        let prevX = startX;
        let prevY = startY;
        
        // Progress affects how far the tentacle extends
        const curEndX = startX + (endX - startX) * progress;
        const curEndY = startY + (endY - startY) * progress;
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const targetX = startX + (curEndX - startX) * t;
            const targetY = startY + (curEndY - startY) * t;
            
            // Add sine wave wiggle that increases towards the tip
            const wiggle = Math.sin(time * 20 + t * 5 + wigglePhase) * (20 * t * progress);
            
            // Perpendicular vector for wiggle
            const dx = endX - startX;
            const dy = endY - startY;
            const len = Math.sqrt(dx*dx + dy*dy);
            const nx = -dy / len;
            const ny = dx / len;
            
            const px = targetX + nx * wiggle;
            const py = targetY + ny * wiggle;
            
            ctx.lineTo(px, py);
        }
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness * Math.max(0.1, 1 - progress*0.5); // taper off
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    if (combatState.isAttacking) {
        const pX = player.x + player.width/2 - camera.x;
        const pY = player.y + player.height/2 - camera.y;
        const dir = player.facingRight ? 1 : -1;
        const progress = 1 - (combatState.attackTime / (combatState.comboStep === 3 ? 0.25 : 0.15));
        
        if (combatState.comboStep === 1) {
            // Whip forward and slightly up
            drawTentacle(pX, pY, pX + 80 * dir, pY - 30, progress, 6, 'rgba(0, 255, 255, 1)', 0);
            drawTentacle(pX, pY, pX + 60 * dir, pY + 10, progress, 4, 'rgba(0, 200, 255, 0.8)', 1);
        } else if (combatState.comboStep === 2) {
            // Whip forward and down
            drawTentacle(pX, pY, pX + 90 * dir, pY + 40, progress, 7, 'rgba(0, 255, 255, 1)', 2);
            drawTentacle(pX, pY, pX + 70 * dir, pY, progress, 5, 'rgba(0, 200, 255, 0.8)', 3);
        } else if (combatState.comboStep === 3) {
            // Big piercing magenta bundle of tentacles
            for(let k=0; k<5; k++) {
                const spreadY = (k - 2) * 20;
                const length = 120 + Math.random()*30;
                drawTentacle(pX, pY, pX + length * dir, pY + spreadY, progress, 8 - Math.abs(k-2), 'rgba(255, 50, 200, 1)', k);
            }
        }
    }

    if (combatState.isDashStriking) {
        // Tentacle Drill during dash
        const pX = player.x + player.width/2 - camera.x;
        const pY = player.y + player.height/2 - camera.y;
        const dir = player.facingRight ? 1 : -1;
        
        for(let k=0; k<6; k++) {
            const spreadY = Math.sin(time * 30 + k) * 30; // Spiral effect
            const spreadX = Math.cos(time * 30 + k) * 10;
            drawTentacle(pX - 50*dir, pY, pX + 150 * dir + spreadX, pY + spreadY, 1, 5, 'rgba(255, 255, 0, 1)', k);
        }
    }

    if (combatState.isGroundSmashing) {
        // Tentacles bursting upwards while falling
        const pX = player.x + player.width/2 - camera.x;
        const pY = player.y + player.height/2 - camera.y;
        
        for(let k=0; k<4; k++) {
            const spreadX = (k - 1.5) * 40;
            const length = 100 + Math.random()*50;
            // Draw tentacles trailing upwards
            drawTentacle(pX, pY, pX + spreadX, pY - length, 1, 6, 'rgba(255, 100, 0, 1)', k);
        }
    }
}
