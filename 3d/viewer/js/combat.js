import { keys } from './input.js';
import { addParticle } from './effects.js';
import { getCollision, TILE_SIZE } from './world.js';

export const iceSlashImg = new Image();
iceSlashImg.src = 'assets/slash_ice_128.png';

export const iceImpactImg = new Image();
iceImpactImg.src = 'assets/impact_ice_128.png';

export const lightning1Img = new Image();
lightning1Img.src = 'assets/lightining1-Sheet.png';

export const lightning5Img = new Image();
lightning5Img.src = 'assets/lightining5-Sheet.png';

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
    
    isCharging: false,
    chargeTime: 0,
    chargeDuration: 0.8,
    isReleasingBeam: false,
    beamTime: 0,
    beamDuration: 0.2,
    chargeLevel: 1, // 1 = Short, 2 = Medium, 3 = Max
    
    hitbox: { x: 0, y: 0, width: 40, height: 40 }
};

export function releaseChargeAttack(player) {
    combatState.isCharging = false;
    combatState.isDashStriking = true;
    
    const chargeTime = combatState.chargeTime;
    let level = 1;
    let cameraShake = 4;
    let beamDuration = 0.15;
    let dashSpeed = 1000;
    
    if (chargeTime >= 0.7) {
        level = 3;
        cameraShake = 25;
        beamDuration = 0.35;
        dashSpeed = 2000; // Ultra fast lightning warp
    } else if (chargeTime >= 0.3) {
        level = 2;
        cameraShake = 12;
        beamDuration = 0.22;
        dashSpeed = 1400;
    }
    
    combatState.chargeLevel = level;
    combatState.lastChargeRatio = chargeTime / combatState.chargeDuration;
    
    combatState.dashStrikeTime = level === 3 ? 0.3 : 0.2;
    combatState.dashStrikeCooldown = 1.4;
    
    combatState.isReleasingBeam = true;
    combatState.beamTime = beamDuration;
    
    player.vx = player.facingRight ? dashSpeed : -dashSpeed;
    player.vy = 0;
    
    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: cameraShake}}));
    
    // Shockwave rings
    addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#00ffff', 0.35, 'ring', level === 3 ? 35 : 18);
    if (level === 3) {
        addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#ffffff', 0.25, 'ring', 10);
    }
    
    // High-quality textured sparks and stars
    const texSparkCount = level === 3 ? 24 : (level === 2 ? 14 : 5);
    const particleSpeed = level === 3 ? 800 : (level === 2 ? 550 : 350);
    for (let i = 0; i < texSparkCount; i++) {
        addParticle(
            player.x + player.width/2,
            player.y + player.height/2,
            (Math.random() - 0.5) * particleSpeed,
            (Math.random() - 0.5) * particleSpeed,
            level === 3 ? '#ffffff' : '#00ffff',
            0.55,
            Math.random() < 0.55 ? 'tex_star' : 'tex_spark',
            level === 3 ? 24 + Math.random() * 12 : 14 + Math.random() * 8
        );
    }
    
    // Textured smoke clouds
    const smokeCount = level === 3 ? 12 : (level === 2 ? 6 : 2);
    for (let i = 0; i < smokeCount; i++) {
        addParticle(
            player.x + player.width/2,
            player.y + player.height/2,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            'rgba(0, 230, 255, 0.45)',
            0.75,
            'tex_smoke',
            level === 3 ? 30 + Math.random() * 15 : 20 + Math.random() * 10
        );
    }
    
    combatState.chargeTime = 0;
}

export function updateCombat(player, dt) {
    // Cooldowns
    if (combatState.attackCooldown > 0) combatState.attackCooldown -= dt;
    if (combatState.comboWindow > 0) combatState.comboWindow -= dt;
    if (combatState.dashStrikeCooldown > 0) combatState.dashStrikeCooldown -= dt;
    if (combatState.smashCooldown > 0) combatState.smashCooldown -= dt;

    if (combatState.comboWindow <= 0 && !combatState.isAttacking) {
        combatState.comboStep = 0; // Reset combo if window expires
    }

    const attackTriggered = keys.skill1Pressed || keys.attackPressed;

    // SKILL 2: Lightning Charge-up Slash (K) - Triggered by holding K
    if (keys.skill2 && combatState.dashStrikeCooldown <= 0 && !combatState.isDashStriking && !combatState.isGroundSmashing && !combatState.isAttacking) {
        if (!combatState.isCharging) {
            combatState.isCharging = true;
            combatState.chargeTime = 0;
        }
        
        combatState.chargeTime += dt;
        player.vx = 0;
        player.vy = 0; // Stay suspended while charging
        
        const curTime = combatState.chargeTime;
        let sparkChance = 0.3;
        let sparkColor = 'rgba(0, 200, 255, 0.7)';
        
        if (curTime >= 0.7) {
            sparkChance = 0.8;
            sparkColor = '#ffffff'; // White electricity for max charge
            if (Math.random() < 0.25) {
                // Subtle camera hum during max charge
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 2.2}}));
            }
        } else if (curTime >= 0.3) {
            sparkChance = 0.55;
            sparkColor = '#00ffff';
        }
        
        // Pull electricity inward (Using glowing stars!)
        if (Math.random() < sparkChance) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 45 + Math.random() * 35;
            const sx = player.x + player.width/2 + Math.cos(angle) * dist;
            const sy = player.y + player.height/2 + Math.sin(angle) * dist;
            const vx = (player.x + player.width/2 - sx) * (5 + curTime * 3.5);
            const vy = (player.y + player.height/2 - sy) * (5 + curTime * 3.5);
            addParticle(sx, sy, vx, vy, sparkColor, 0.35, 'tex_star', 12 + Math.random() * 8);
        }

        if (combatState.chargeTime >= combatState.chargeDuration) {
            releaseChargeAttack(player);
        }
    } else if (combatState.isCharging) {
        // Released key before full charge
        releaseChargeAttack(player);
    }

    // SKILL 3: Ground Smash (Triggered by holding Down + Attack in mid-air, or pressing L)
    if ((keys.skill3Pressed || (!player.isGrounded && keys.down && attackTriggered)) && combatState.smashCooldown <= 0 && !combatState.isGroundSmashing && !combatState.isDashStriking) {
        combatState.isGroundSmashing = true;
        player.vx = 0;
        player.vy = -300; // Slight hop before smash
    }

    // SKILL 1: Normal Attack Combo (J or I on ground, or normal air attack if no Down held)
    if (attackTriggered && combatState.attackCooldown <= 0 && !combatState.isAttacking && !combatState.isDashStriking && !combatState.isGroundSmashing && !combatState.isCharging) {
        combatState.isAttacking = true;
        combatState.comboStep++;
        if (combatState.comboStep > 3) combatState.comboStep = 1;
        
        combatState.attackTime = combatState.attackDuration;
        
        // Air attack vs Ground Combo
        if (!player.isGrounded) {
            combatState.comboStep = 1; // No combo chain in air
            combatState.attackCooldown = 0.25;
        } else {
            if (combatState.comboStep === 3) {
                combatState.attackTime = 0.25;
                combatState.attackCooldown = 0.5;
                player.vx += player.facingRight ? 300 : -300; // Lunge
            } else {
                combatState.attackCooldown = 0.2;
                player.vx += player.facingRight ? 100 : -100;
            }
        }
        combatState.comboWindow = 0.6;
    }

    // --- EXECUTE SKILLS ---

    // Update Laser Beam duration
    if (combatState.isReleasingBeam) {
        combatState.beamTime -= dt;
        if (combatState.beamTime <= 0) {
            combatState.isReleasingBeam = false;
        }
    }

    // Execute Skill 1 (Combo)
    if (combatState.isAttacking) {
        combatState.attackTime -= dt;
        combatState.hitbox.y = player.y - 10;
        if (player.facingRight) {
            combatState.hitbox.x = player.x + player.width;
        } else {
            combatState.hitbox.x = player.x - combatState.hitbox.width;
        }

        addParticle(
            combatState.hitbox.x + Math.random() * combatState.hitbox.width,
            combatState.hitbox.y + Math.random() * combatState.hitbox.height,
            (player.facingRight ? 200 : -200) + (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            '#00ffff',
            0.3,
            'tex_star',
            12 + Math.random() * 8
        );

        if (combatState.attackTime <= 0) {
            combatState.isAttacking = false;
        }
    }

    // Execute Skill 2 (Dash Strike - Lightning speed)
    if (combatState.isDashStriking) {
        combatState.dashStrikeTime -= dt;
        player.vx = player.facingRight ? 1800 : -1800; // Super fast dash!
        player.vy = 0;
        
        player.scaleX = 2.2; // Extra stretch
        player.scaleY = 0.2;

        // Spark trail
        addParticle(
            player.x + player.width/2,
            player.y + player.height/2,
            (Math.random() - 0.5) * 400 - player.vx * 0.3,
            (Math.random() - 0.5) * 200,
            'rgba(0, 255, 255, 0.9)',
            0.35,
            'spark',
            3
        );

        if (combatState.dashStrikeTime <= 0) {
            combatState.isDashStriking = false;
            player.vx = player.facingRight ? 400 : -400; // Keep momentum
        }
    }

    // Execute Skill 3 (Ground Smash)
    if (combatState.isGroundSmashing) {
        if (player.vy >= 0) {
            player.vy = 1500; // Slam down super fast
            player.scaleX = 0.5;
            player.scaleY = 2.0;
            
            // Trail going down (textured sparks)
            addParticle(player.x + player.width/2, player.y, (Math.random()-0.5)*150, -300, 'rgba(255, 120, 0, 0.8)', 0.45, 'tex_spark', 15);
        }
        
        // If hit ground
        if (player.isGrounded || getCollision(player.x, player.y + 5, player.width, player.height)) {
            combatState.isGroundSmashing = false;
            combatState.smashCooldown = 2.0;
            
            // SHOCKWAVE EFFECT
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 20}}));
            
            // Neon Orange expand shockwave ring!
            addParticle(player.x + player.width/2, player.y + player.height, 0, 0, 'rgba(255, 100, 0, 1)', 0.45, 'ring', 45);
            
            // Dusty orange smoke rising
            for(let i=0; i<15; i++) {
                addParticle(
                    player.x + player.width/2,
                    player.y + player.height,
                    (Math.random()-0.5)*250,
                    -120 - Math.random()*200,
                    'rgba(255, 90, 0, 0.35)',
                    0.85,
                    'tex_smoke',
                    35 + Math.random()*20
                );
            }
            
            // Glowing fire embers
            for(let i=0; i<18; i++) {
                addParticle(
                    player.x + player.width/2,
                    player.y + player.height,
                    (Math.random()-0.5)*600,
                    -200 - Math.random()*400,
                    'rgba(255, 160, 0, 0.95)',
                    0.6,
                    'tex_star',
                    16 + Math.random()*8
                );
            }
        }
    }
}

export function drawCombat(ctx, camera, player) {
    // Combat visuals (tentacles, drill) are drawn directly in player.js
    // inside the skeletal transform loop to ensure seamless animation and head anchoring.
}
