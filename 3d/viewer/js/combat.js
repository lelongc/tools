import { keys, isBuffered, consumeBuffer } from './input.js';
import { addParticle } from './effects.js';
import { getCollision, getTileType, TILE_SIZE } from './world.js';
import { getPlayerColorRgba } from './player.js';

export const lightningSlashImg = new Image();
lightningSlashImg.src = 'assets/lightining1-Sheet.png'; // 384x64 (6 frames)

export const lightningImpactImg = new Image();
lightningImpactImg.src = 'assets/lightining5-Sheet.png'; // 448x64 (7 frames)

function createTintedImage(src, r, g, b) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.complete = true; // duck-typing so player.js knows it's ready
        canvas.naturalWidth = img.width;
    };
    img.src = src;
    return canvas;
}

export const orbImg = createTintedImage('assets/circle_05.png', 0, 255, 255);
export const spark1Img = createTintedImage('assets/spark_04.png', 0, 255, 255);
export const spark2Img = createTintedImage('assets/spark_07.png', 0, 255, 255);


export const combatState = {
    hp: 100,
    energy: 100,
    maxEnergy: 100,
    
    isAttacking: false,
    attackTime: 0,
    attackDuration: 0.15,
    attackCooldown: 0,
    comboStep: 0,
    comboWindow: 0,
    
    isCharging: false,
    chargeTime: 0,
    chargeDuration: 0.5, // Reduced from 0.8s to make it easier/faster to charge
    chargeLevel: 1,
    lastChargeRatio: 0,
    
    isDashStriking: false,
    dashStrikeTime: 0,
    dashStrikeCooldown: 0,
    dashStrikeMaxCooldown: 0.4,
    
    isGroundSmashing: false,
    smashPhase: 0, // 0 = None, 1 = Leap, 2 = Float/Anticipation, 3 = Slam
    smashTimer: 0,
    smashCooldown: 0,
    smashMaxCooldown: 1.8,
    
    isLowSweeping: false,
    lowSweepTime: 0,
    lowSweepCooldown: 0,
    lowSweepMaxCooldown: 0.6,
    
    isBioDrilling: false,
    bioDrillTime: 0,
    bioDrillCooldown: 0,
    bioDrillMaxCooldown: 1.0,
    
    isUpSlashing: false,
    upSlashTime: 0,
    upSlashCooldown: 0,
    upSlashMaxCooldown: 0.4,
    
    isPogoSlashing: false,
    pogoSlashTime: 0,
    pogoSlashCooldown: 0,
    pogoSlashMaxCooldown: 0.3,
    
    isRisingBlast: false,
    risingBlastTime: 0,
    risingBlastCooldown: 0,
    risingBlastMaxCooldown: 1.0,
    
    isLightningNova: false,
    lightningNovaTime: 0,
    lightningNovaCooldown: 0,
    lightningNovaMaxCooldown: 0.8,
    
    isReleasingBeam: false,
    beamTime: 0,
    beamX: 0,
    beamY: 0,
    beamFacingRight: true,
    
    activeProjectiles: [], // Store active spell projectiles (Plasma Orb, Acid Volley, EMP Shockwaves)
    
    hitbox: { x: 0, y: 0, width: 40, height: 40 }
};

export function releaseChargeAttack(player) {
    combatState.isCharging = false;
    // Remove isDashStriking entirely
    combatState.isDashStriking = false; 
    
    const chargeTime = combatState.chargeTime;
    combatState.chargeTime = 0; // RESET CHARGE TIME!
    let level = 1;
    let cameraShake = 5;
    let beamDuration = 0.15;
    let recoilSpeed = 100;
    
    if (chargeTime >= combatState.chargeDuration - 0.05) { // max charge
        level = 3;
        cameraShake = 25;
        beamDuration = 0.35;
        recoilSpeed = 400; // Big recoil
        combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 40);
    } else if (chargeTime >= combatState.chargeDuration * 0.4) {
        level = 2;
        cameraShake = 12;
        beamDuration = 0.22;
        recoilSpeed = 200; // Mid recoil
        combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 20);
    } else {
        combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 5);
    }
    
    combatState.chargeLevel = level;
    combatState.lastChargeRatio = chargeTime / combatState.chargeDuration;
    
    // We are no longer dashing, but we do need a cooldown for skill K
    combatState.dashStrikeCooldown = 0.8;
    combatState.dashStrikeMaxCooldown = 0.8;
    
    combatState.isReleasingBeam = true;
    combatState.beamTime = beamDuration;
    combatState.beamX = player.x + player.width/2;
    combatState.beamY = player.y + player.height/2; 
    combatState.beamFacingRight = player.facingRight;
    
    // Apply recoil
    player.vx = player.facingRight ? -recoilSpeed : recoilSpeed;
    player.vy = -50; // slight lift
    
    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: cameraShake}}));
    
    // Shockwave rings
    addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, player.color, 0.35, 'ring', level === 3 ? 35 : 18);
    if (level === 3) {
        addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#ffffff', 0.25, 'ring', 10);
    }
    
    // High-quality textured sparks and stars shooting OUTWARD with the beam
    const texSparkCount = level === 3 ? 24 : (level === 2 ? 14 : 5);
    const particleSpeed = level === 3 ? 800 : (level === 2 ? 550 : 350);
    for (let i = 0; i < texSparkCount; i++) {
        addParticle(
            player.x + player.width/2 + (player.facingRight ? 20 : -20),
            player.y + player.height/2,
            (player.facingRight ? 1 : -1) * (particleSpeed * 0.5 + Math.random() * particleSpeed),
            (Math.random() - 0.5) * particleSpeed * 0.3,
            level === 3 ? '#ffffff' : player.color,
            0.55,
            Math.random() < 0.55 ? 'tex_star' : 'tex_spark',
            level === 3 ? 24 + Math.random() * 12 : 14 + Math.random() * 8
        );
    }
    
    // Textured smoke clouds at the muzzle
    const smokeCount = level === 3 ? 12 : (level === 2 ? 6 : 2);
    for (let i = 0; i < smokeCount; i++) {
        addParticle(
            player.x + player.width/2 + (player.facingRight ? 30 : -30),
            player.y + player.height/2,
            (player.facingRight ? 1 : -1) * 150 + (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 150,
            'rgba(0, 230, 255, 0.45)',
            0.75,
            'tex_smoke',
            level === 3 ? 30 + Math.random() * 15 : 20 + Math.random() * 10
        );
    }
}

export function releaseBioDrill(player) {
    const chargeTime = combatState.chargeTime;
    combatState.isCharging = false;
    combatState.chargeTime = 0;
    
    let level = 1;
    let drillSpeed = 500;
    let drillTime = 0.25;
    let cameraShake = 5;
    
    if (chargeTime >= combatState.chargeDuration - 0.05) {
        level = 3;
        drillSpeed = 1300;
        drillTime = 0.45;
        cameraShake = 20;
    } else if (chargeTime >= combatState.chargeDuration * 0.4) {
        level = 2;
        drillSpeed = 800;
        drillTime = 0.35;
        cameraShake = 12;
    }
    
    combatState.isBioDrilling = true;
    combatState.bioDrillTime = drillTime;
    combatState.bioDrillCooldown = 1.0;
    combatState.bioDrillMaxCooldown = 1.0;
    if (window.triggerViolentDialogue) window.triggerViolentDialogue();
    
    // Pierce forward super fast depending on level
    player.vx = player.facingRight ? drillSpeed : -drillSpeed;
    player.vy = 0; // Freeze vertical movement
    
    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: cameraShake}}));
    
    // Visual burst
    addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, player.color, 0.4, 'ring', 40);
    
    for (let i = 0; i < 15; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 200 + Math.random() * 300;
        addParticle(
            player.x + player.width/2,
            player.y + player.height/2,
            Math.cos(ang) * spd,
            Math.sin(ang) * spd,
            player.color,
            0.5,
            'tex_spark',
            12 + Math.random() * 10
        );
    }
}

export function updateCombat(player, dt) {
    // Cooldowns
    if (combatState.attackCooldown > 0) combatState.attackCooldown -= dt;
    if (combatState.comboWindow > 0) combatState.comboWindow -= dt;
    if (combatState.dashStrikeCooldown > 0) combatState.dashStrikeCooldown -= dt;
    if (combatState.smashCooldown > 0) combatState.smashCooldown -= dt;
    if (combatState.lowSweepCooldown > 0) combatState.lowSweepCooldown -= dt;
    if (combatState.bioDrillCooldown > 0) combatState.bioDrillCooldown -= dt;
    if (combatState.upSlashCooldown > 0) combatState.upSlashCooldown -= dt;
    if (combatState.pogoSlashCooldown > 0) combatState.pogoSlashCooldown -= dt;
    if (combatState.risingBlastCooldown > 0) combatState.risingBlastCooldown -= dt;
    if (combatState.lightningNovaCooldown > 0) combatState.lightningNovaCooldown -= dt;

    if (combatState.comboWindow <= 0 && !combatState.isAttacking) {
        combatState.comboStep = 0;
    }

    const isBusy = combatState.isAttacking || combatState.isDashStriking || combatState.isGroundSmashing || combatState.isLowSweeping || combatState.isBioDrilling || combatState.isUpSlashing || combatState.isPogoSlashing || combatState.isRisingBlast || combatState.isLightningNova;

    // SKILL 2: Charge Slash / Bio-Drill (K)
    if (keys.skill2 && !isBusy && combatState.dashStrikeCooldown <= 0) {
        // If bio form, only allow if drill is unlocked
        if (player.form === 'bio' && !window.drillUnlocked) return;
        
        // Bio form takes twice as long to charge
        combatState.chargeDuration = player.form === 'cyber' ? 0.5 : 1.0;
        
        combatState.isCharging = true;
        combatState.chargeTime += dt;
        
        const curTime = combatState.chargeTime;
        let sparkChance = 0;
        let sparkColor = player.color;
        
        if (curTime >= combatState.chargeDuration) {
            sparkChance = 0.8;
            sparkColor = '#ffffff'; // White electricity for max charge
            if (Math.random() < 0.25) {
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 2.2}}));
            }
        } else if (curTime >= 0.3) {
            sparkChance = 0.55;
            sparkColor = player.color;
        }
        
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
            if (player.form === 'cyber') releaseChargeAttack(player);
            else releaseBioDrill(player);
        }
    } else if (combatState.isCharging) {
        if (player.form === 'cyber') releaseChargeAttack(player);
        else releaseBioDrill(player);
    }

    // Prepare Skill Triggers & Buffer Flags
    const wantSkill4 = keys.skill4Pressed || isBuffered('skill4');
    const wantSkill3 = keys.skill3Pressed || isBuffered('skill3');
    const wantSkill1 = keys.skill1Pressed || isBuffered('skill1');
    const wantHeal = keys.healPressed || isBuffered('heal');

    // REBOOT: Heal 1 HP (Q)
    if (wantHeal && combatState.hp < 100 && combatState.energy >= 50 && !isBusy) {
        combatState.energy -= 50;
        combatState.hp = Math.min(100, combatState.hp + 20); // Each Core is 20 HP in legacy, or 1 "Core"
        consumeBuffer('heal');
        
        // Massive Knockback Shockwave
        addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#ffffff', 0.6, 'ring', 120);
        addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, player.color, 0.4, 'ring', 180);
        
        // Pushback any enemies (we'll simulate Screen Shake for now)
        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 10}}));
        if (window.triggerHitStop) window.triggerHitStop(0.1); // Long stop for impact
        
        // Particle burst
        for(let i=0; i<20; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = 300 + Math.random() * 300;
            addParticle(player.x + player.width/2, player.y + player.height/2, Math.cos(a)*s, Math.sin(a)*s, player.color, 0.5, 'tex_star', 15);
        }
    }

    // SKILL 4: Form Switch (I) - Bio/Cyber Toggle
    if (wantSkill4 && !isBusy && !combatState.isCharging) {
        // Toggle Form
        player.form = (player.form === 'cyber') ? 'bio' : 'cyber';
        player.color = (player.form === 'cyber') ? '#00ffff' : '#44ff44';
        
        // Form Switch Effects
        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 8}}));
        if (window.triggerHitStop) window.triggerHitStop(0.05); // Mini pause for impact
        
        // Transformation Burst (No rings)
        for (let i = 0; i < 20; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 200 + Math.random() * 300;
            addParticle(
                player.x + player.width/2,
                player.y + player.height/2,
                Math.cos(ang) * spd,
                Math.sin(ang) * spd,
                player.color,
                0.6,
                (player.form === 'cyber') ? 'tex_spark' : 'tex_star',
                12 + Math.random() * 10
            );
        }
        
        consumeBuffer('skill4');
    }
    
    // SKILL 3: Spell Casting (L)
    else if (wantSkill3 && !isBusy && !combatState.isCharging && combatState.energy >= 33) {
        if (player.form === 'cyber') {
            if (keys.down) {
                // CYBER FORM: EMP Stomp (S + L)
                if (combatState.smashCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isGroundSmashing = true; 
                    combatState.smashState = 'rise';
                    combatState.smashTime = 0.2;
                    combatState.smashCooldown = 1.0;
                    combatState.smashMaxCooldown = 1.0;
                    player.vx = 0;
                    player.vy = -300; 
                    consumeBuffer('skill3');
                }
            } else if (keys.up) {
                // CYBER FORM: Lightning Nova (W + L)
                if (combatState.lightningNovaCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isLightningNova = true;
                    combatState.lightningNovaTime = 0.3;
                    combatState.lightningNovaCooldown = 3.0;
                    combatState.lightningNovaMaxCooldown = 3.0;
                    player.vx *= 0.2; 
                    player.vy = -100; 
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 12}}));
                    consumeBuffer('skill3');
                    addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, player.color, 0.4, 'ring', 60);
                    addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#ffffff', 0.25, 'ring', 25);
                    for (let i = 0; i < 16; i++) {
                        const ang = (i / 16) * Math.PI * 2;
                        const spd = 400 + Math.random() * 200;
                        addParticle(player.x + player.width/2, player.y + player.height/2, Math.cos(ang) * spd, Math.sin(ang) * spd, player.color, 0.35, 'tex_star', 16 + Math.random() * 8);
                    }
                }
            } else {
                // CYBER FORM: Plasma Orb (Neutral L)
                if (combatState.attackCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isAttacking = true;
                    combatState.attackTime = 0.2;
                    combatState.attackCooldown = 0.5;
                    player.vx -= player.facingRight ? 100 : -100; 
                    
                    combatState.activeProjectiles.push({
                        type: 'plasma_orb',
                        x: player.x + player.width/2 + (player.facingRight ? 20 : -20),
                        y: player.y + player.height/2,
                        vx: player.facingRight ? 800 : -800,
                        vy: 0,
                        life: 1.5,
                        color: player.color
                    });
                    
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 5}}));
                    consumeBuffer('skill3');
                }
            }
        } else {
            // BIO FORM: Directional Spells
            if (keys.down) {
                // BIO FORM: Ground Smash (Desolate Dive)
                if (combatState.smashCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isGroundSmashing = true;
                    combatState.smashState = 'rise';
                    combatState.smashTime = 0.2; 
                    combatState.smashCooldown = 1.0;
                    combatState.smashMaxCooldown = 1.0;
                    if (window.triggerViolentDialogue) window.triggerViolentDialogue();
                    player.vx = 0;
                    player.vy = -400; 
                    consumeBuffer('skill3');
                }
            } else if (keys.up) {
                // BIO FORM: Rising Blast (Abyss Shriek)
                if (combatState.risingBlastCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isRisingBlast = true;
                    combatState.risingBlastTime = 0.4;
                    combatState.risingBlastCooldown = 1.5;
                    combatState.risingBlastMaxCooldown = 1.5;
                    player.vx = 0;
                    player.vy = 0; 
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 15}}));
                    addParticle(player.x + player.width/2, player.y + player.height, 0, 0, player.color, 0.5, 'ring', 80);
                    consumeBuffer('skill3');
                }
            } else {
                // BIO FORM: Acid Volley (Neutral L)
                if (combatState.attackCooldown <= 0) {
                    combatState.energy -= 33;
                    combatState.isAttacking = true;
                    combatState.attackTime = 0.25;
                    combatState.attackCooldown = 0.6;
                    player.vx -= player.facingRight ? 150 : -150; 
                    
                    for (let i = -1; i <= 1; i++) {
                        combatState.activeProjectiles.push({
                            type: 'acid_orb',
                            x: player.x + player.width/2 + (player.facingRight ? 20 : -20),
                            y: player.y + player.height/2,
                            vx: (player.facingRight ? 600 : -600) + Math.random()*100 - 50,
                            vy: i * 150 - 150, // Arc upwards and spread
                            life: 2.0,
                            color: player.color
                        });
                    }
                    
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 8}}));
                    consumeBuffer('skill3');
                }
            }
        }
    }
    
    // SKILL 1: Light Attack combos (J) - Nail
    else if (wantSkill1 && !isBusy && !combatState.isCharging) {
        if (keys.down) {
            if (player.isGrounded) {
                // Ground S + J: Low Sweep
                if (combatState.lowSweepCooldown <= 0) {
                    combatState.isLowSweeping = true;
                    combatState.lowSweepTime = 0.25;
                    combatState.lowSweepCooldown = 0.3;
                    combatState.lowSweepMaxCooldown = 0.3;
                    player.vx = player.facingRight ? 250 : -250; 
                    combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 8);
                    consumeBuffer('skill1');
                }
            } else {
                // Air S + J: Pogo Strike
                if (combatState.pogoSlashCooldown <= 0) {
                    combatState.isPogoSlashing = true;
                    combatState.pogoSlashTime = 0.2;
                    combatState.pogoSlashCooldown = 0.25;
                    combatState.pogoSlashMaxCooldown = 0.25;
                    player.vy = -100; // Slight stall to hit
                    combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 8);
                    consumeBuffer('skill1');
                }
            }
        } else if (keys.up) {
            // W + J: Up Slash
            if (combatState.upSlashCooldown <= 0) {
                combatState.isUpSlashing = true;
                combatState.upSlashTime = 0.2;
                combatState.upSlashCooldown = 0.25;
                combatState.upSlashMaxCooldown = 0.25;
                if (!player.isGrounded) player.vy = -150; // Air stall
                combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 8);
                consumeBuffer('skill1');
            }
        } else {
            // Neutral J: Normal Attack Combo
            if (combatState.attackCooldown <= 0) {
                combatState.isAttacking = true;
                combatState.comboStep++;
                if (combatState.comboStep > 3) combatState.comboStep = 1;
                
                combatState.attackTime = combatState.attackDuration;
                combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 10);
                
                if (!player.isGrounded) {
                    combatState.comboStep = 1; 
                    combatState.attackCooldown = 0.2;
                } else {
                    if (combatState.comboStep === 3) {
                        combatState.attackTime = 0.25;
                        combatState.attackCooldown = 0.3;
                        player.vx += player.facingRight ? 300 : -300;
                    } else {
                        combatState.attackCooldown = 0.15;
                        player.vx += player.facingRight ? 100 : -100;
                    }
                }
                combatState.comboWindow = 0.6;
                consumeBuffer('skill1');
            }
        }
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
            player.color,
            0.3,
            'tex_star',
            12 + Math.random() * 8
        );

        if (combatState.attackTime <= 0) {
            combatState.isAttacking = false;
        }
    }

    // Execute Skill 3 (Lightning Nova)
    if (combatState.isLightningNova) {
        combatState.lightningNovaTime -= dt;
        player.scaleX = 1.4;
        player.scaleY = 1.4;
        
        if (Math.random() < 0.8) {
            addParticle(
                player.x + player.width/2 + (Math.random() - 0.5) * 40,
                player.y + player.height/2 + (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 150,
                (Math.random() - 0.5) * 150,
                getPlayerColorRgba(0.8),
                0.2,
                'spark',
                4
            );
        }
        
        if (combatState.lightningNovaTime <= 0) {
            combatState.isLightningNova = false;
        }
    }

    // (Old Dash Strike logic was here, removed because Laser Beam is now static)

    // Execute Low Sweep (S + J)
    if (combatState.isLowSweeping) {
        combatState.lowSweepTime -= dt;
        player.scaleX = 1.4;
        player.scaleY = 0.5; // Flattened body
        
        if (Math.random() < 0.6) {
            addParticle(
                player.x + (player.facingRight ? player.width : 0),
                player.y + player.height,
                player.facingRight ? 400 : -400,
                -100 - Math.random() * 100,
                player.color,
                0.3,
                'tex_spark',
                15
            );
        }
        
        if (combatState.lowSweepTime <= 0) {
            combatState.isLowSweeping = false;
        }
    }

    // (BioDrill removed)

    // Execute Up Slash (W + J)
    if (combatState.isUpSlashing) {
        combatState.upSlashTime -= dt;
        player.scaleX = 0.8;
        player.scaleY = 1.3;
        if (combatState.upSlashTime <= 0) combatState.isUpSlashing = false;
    }

    // Execute Pogo Strike (Air S + J)
    if (combatState.isPogoSlashing) {
        combatState.pogoSlashTime -= dt;
        player.scaleX = 0.7;
        player.scaleY = 1.4;
        
        // Pogo Hit Detection
        // Check a 40x20 area right below the player
        const hitTop = Math.floor((player.y + player.height) / TILE_SIZE);
        const hitBottom = Math.floor((player.y + player.height + 20) / TILE_SIZE);
        const hitLeft = Math.floor((player.x) / TILE_SIZE);
        const hitRight = Math.floor((player.x + player.width) / TILE_SIZE);
        
        let pogoSuccess = false;
        
        for (let r = hitTop; r <= hitBottom; r++) {
            for (let c = hitLeft; c <= hitRight; c++) {
                // We use a custom helper here because getCollision ignores acid
                const tx = c * TILE_SIZE;
                const ty = r * TILE_SIZE;
                const t = getTileType(tx, ty);
                
                // If hitting Bounce Pad (2) or Acid (4) or any solid ground (1, 3, 5, 6)
                if (t >= 1 && t <= 6) {
                    pogoSuccess = true;
                    break;
                }
            }
            if (pogoSuccess) break;
        }

        if (pogoSuccess) {
            // BOUNCE!
            player.vy = -800; // Big bounce upward
            player.dashCooldown = 0; // Reset dash
            combatState.dashStrikeCooldown = 0; // Reset K
            player.isPogoBouncing = 0.2; // Invulnerability frames for acid/spikes
            
            // Generate over-the-top particles
            for (let i = 0; i < 15; i++) {
                addParticle(player.x + player.width/2, player.y + player.height, (Math.random()-0.5)*300, 100 + Math.random()*200, player.color, 0.5, 'tex_spark', 15);
            }
            
            // Hit Stop for juice!
            if (window.triggerHitStop) window.triggerHitStop(0.05);
            
            // Gain Overdrive!
            combatState.energy = Math.min(combatState.maxEnergy, combatState.energy + 10);
            
            combatState.isPogoSlashing = false;
            combatState.pogoSlashTime = 0;
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 8}}));
        } else {
            // Visual trail while falling
            if (Math.random() < 0.5) {
                addParticle(player.x + player.width/2, player.y + player.height, (Math.random()-0.5)*100, 300, player.color, 0.2, 'tex_spark', 10);
            }
        }

        if (combatState.pogoSlashTime <= 0) combatState.isPogoSlashing = false;
    }

    // Execute Bio-Drill
    if (combatState.isBioDrilling) {
        combatState.bioDrillTime -= dt;
        player.vy = 0; // Freeze gravity
        // Drill particles
        addParticle(player.x + (player.facingRight ? player.width : 0), player.y + player.height/2 + (Math.random()-0.5)*20, (player.facingRight ? -200 : 200), (Math.random()-0.5)*100, player.color, 0.4, 'tex_spark', 15);
        
        // Drop electric trail
        if (Math.random() < 0.3) {
            combatState.activeProjectiles.push({
                type: 'bio_trail',
                x: player.x + player.width/2 + (Math.random() - 0.5) * 40,
                y: player.y + player.height - 5,
                vx: 0,
                vy: 0,
                life: 3.0,
                color: player.color
            });
        }
        
        if (combatState.bioDrillTime <= 0) combatState.isBioDrilling = false;
    }

    // Execute Ground Smash (Desolate Dive) / EMP Stomp
    if (combatState.isGroundSmashing) {
        if (combatState.smashState === 'rise') {
            combatState.smashTime -= dt;
            player.vx = 0;
            if (combatState.smashTime <= 0) {
                combatState.smashState = 'fall';
                player.vy = 1200; // Slam down fast!
            }
        } else if (combatState.smashState === 'fall') {
            player.vx = 0; // Lock horizontal
            if (player.isGrounded) {
                combatState.isGroundSmashing = false;
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 25}}));
                if (window.triggerHitStop) window.triggerHitStop(0.1);
                
                if (player.form === 'cyber') {
                    // EMP Stomp: Spawn floor shockwaves
                    combatState.activeProjectiles.push({
                        type: 'emp_shockwave', x: player.x, y: player.y + player.height - 20, vx: -600, vy: 0, life: 1.0, color: player.color
                    });
                    combatState.activeProjectiles.push({
                        type: 'emp_shockwave', x: player.x + player.width, y: player.y + player.height - 20, vx: 600, vy: 0, life: 1.0, color: player.color
                    });
                    addParticle(player.x + player.width/2, player.y + player.height, 0, 0, player.color, 0.4, 'ring', 100);
                } else {
                    // Bio Ground Smash: Toxic Electric Field
                    combatState.activeProjectiles.push({
                        type: 'bio_shockwave', 
                        x: player.x + player.width/2, 
                        y: player.y + player.height, 
                        vx: 0, 
                        vy: 0, 
                        life: 2.5, // Lasts for a while
                        color: player.color,
                        radius: 120
                    });
                    if (window.GlitchSystem) window.GlitchSystem.trigger(300);
                    for (let i = 0; i < 20; i++) {
                        addParticle(player.x + player.width/2, player.y + player.height, (Math.random()-0.5)*800, -100 - Math.random()*300, player.color, 0.5, 'tex_spark', 20);
                    }
                }
            }
        }
    }

    // Execute Rising Blast (Abyss Shriek)
    if (combatState.isRisingBlast) {
        combatState.risingBlastTime -= dt;
        player.vx = 0;
        player.vy = 0; // Freeze mid-air
        // Upward beam particles
        addParticle(player.x + player.width/2 + (Math.random()-0.5)*30, player.y + player.height, 0, -500 - Math.random()*300, player.color, 0.5, 'tex_spark', 20);
        
        if (combatState.risingBlastTime <= 0) combatState.isRisingBlast = false;
    }

    // Update Projectiles
    for (let i = combatState.activeProjectiles.length - 1; i >= 0; i--) {
        const p = combatState.activeProjectiles[i];
        p.life -= dt;
        if (p.life <= 0) {
            combatState.activeProjectiles.splice(i, 1);
            continue;
        }
        
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        
        // Arc physics for acid volley
        if (p.type === 'acid_orb') {
            p.vy += 800 * dt; // Gravity
            addParticle(p.x, p.y, (Math.random()-0.5)*50, (Math.random()-0.5)*50, p.color, 0.3, 'tex_spark', 8);
            
            // Check collision with player
            if (p.x > player.x && p.x < player.x + player.width && p.y > player.y && p.y < player.y + player.height) {
                if (combatState.hp > 0 && !combatState.isDashing && combatState.invulnTime <= 0) {
                    combatState.hp -= 3;
                    combatState.invulnTime = 1.0;
                    if (window.triggerDamageDialogue) window.triggerDamageDialogue();
                    player.vx = p.vx > 0 ? 300 : -300;
                    player.vy = -200;
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 5}}));
                    for (let i = 0; i < 5; i++) {
                        addParticle(player.x + player.width/2, player.y + player.height/2, (Math.random() - 0.5) * 100, -Math.random() * 200, '#ff0000', 0.5, 'pixel', 6);
                    }
                }
                combatState.activeProjectiles.splice(i, 1);
                continue;
            }
        } else if (p.type === 'plasma_orb') {
            addParticle(p.x, p.y, (Math.random()-0.5)*100, (Math.random()-0.5)*100, p.color, 0.4, 'ring', 12);
        } else if (p.type === 'emp_shockwave') {
            addParticle(p.x, p.y, 0, -Math.random()*200, p.color, 0.3, 'tex_spark', 15);
        }
        
        // Simple Wall Collision for Plasma Orb & Acid Volley
        if (p.type === 'plasma_orb' || p.type === 'acid_orb') {
            if (getCollision(p.x, p.y, 1, 1)) {
                // Explode
                for (let k = 0; k < 10; k++) {
                    addParticle(p.x, p.y, (Math.random()-0.5)*200, (Math.random()-0.5)*200, p.color, 0.4, 'tex_spark', 15);
                }
                
                if (p.type === 'acid_orb') {
                    // Spawn a small toxic electric puddle!
                    combatState.activeProjectiles.push({
                        type: 'bio_shockwave', 
                        x: p.x, 
                        y: p.y, 
                        vx: 0, 
                        vy: 0, 
                        life: 2.0, 
                        color: p.color,
                        radius: 60 // smaller than ground smash
                    });
                }
                
                combatState.activeProjectiles.splice(i, 1);
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 3}}));
                continue;
            }
        }
    }
}

export function drawCombat(ctx, camera, player) {
    if (combatState.isLightningNova) {
        ctx.save();
        ctx.translate(player.x + player.width/2 - camera.x, player.y + player.height/2 - camera.y);
        const prog = 1.0 - (combatState.lightningNovaTime / 0.3); // 0 to 1
        
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 15 * (1 - prog);
        ctx.globalAlpha = 1 - prog;
        ctx.beginPath();
        ctx.arc(0, 0, 50 + prog * 300, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner flash
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 100 * (1-prog), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    if (combatState.isRisingBlast) {
        ctx.save();
        ctx.translate(player.x + player.width/2 - camera.x, player.y + player.height - camera.y);
        const prog = 1.0 - (combatState.risingBlastTime / 0.4);
        
        const w = 150 + Math.random() * 50;
        const h = 800 * prog; // shoots up
        
        // Huge pillar of energy
        const grad = ctx.createLinearGradient(0, 0, 0, -h);
        grad.addColorStop(0, player.color);
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.globalAlpha = 1 - Math.pow(prog, 3);
        ctx.beginPath();
        ctx.rect(-w/2, 0, w, -h);
        ctx.fill();
        
        // Core beam
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(-w/4, 0, w/2, -h);
        ctx.fill();
        ctx.restore();
    }

    if (combatState.isGroundSmashing) {
        ctx.save();
        if (combatState.smashState === 'rise') {
            // Draw anticipation gathering energy orb higher up near the tentacles
            ctx.translate(player.x + player.width/2 - camera.x, player.y - 70 - camera.y);
            const prog = 1.0 - (combatState.smashTime / 0.2); // 0 to 1
            const rad = prog * 40;
            
            // Draw electric rings instead of radial gradient
            ctx.strokeStyle = player.color;
            ctx.lineWidth = 2;
            for(let r=0; r<2; r++) {
                ctx.beginPath();
                for(let i=0; i<=10; i++) {
                    const angle = (i/10) * Math.PI * 2;
                    const rjitter = rad * (0.8 + Math.random()*0.4);
                    if(i===0) ctx.moveTo(Math.cos(angle)*rjitter, Math.sin(angle)*rjitter);
                    else ctx.lineTo(Math.cos(angle)*rjitter, Math.sin(angle)*rjitter);
                }
                ctx.closePath();
                ctx.stroke();
            }
            
            // Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Gathering energy lines
            ctx.strokeStyle = player.color;
            ctx.lineWidth = 2;
            for(let i=0; i<4; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 * (1-prog);
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle)*dist, Math.sin(angle)*dist);
                ctx.lineTo(0,0);
                ctx.stroke();
            }
        } else if (combatState.smashState === 'fall') {
            // Draw falling speed lines instead of a solid triangle
            ctx.translate(player.x + player.width/2 - camera.x, player.y + player.height/2 - camera.y);
            ctx.strokeStyle = player.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                const offsetX = (Math.random()-0.5) * player.width;
                ctx.moveTo(offsetX, 20);
                ctx.lineTo(offsetX, -100 - Math.random()*100);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    // Render World-Space Laser Beam (Detached from player motion)
    if (combatState.isReleasingBeam) {
        ctx.save();
        
        // Translate to the world position where the beam was fired, then apply camera offset
        const drawX = combatState.beamX - camera.x;
        const drawY = combatState.beamY - camera.y;
        ctx.translate(drawX, drawY);
        
        if (!combatState.beamFacingRight) {
            ctx.scale(-1, 1);
        }
        
        const lvl = combatState.chargeLevel || 1;
        const maxDuration = lvl === 3 ? 0.35 : (lvl === 2 ? 0.22 : 0.15);
        const prog = Math.max(0, Math.min(1.0, combatState.beamTime / maxDuration));
        
        // Intense screen shake based on beam power and progress
        const shakeMag = (lvl === 3 ? 6 : 3) * prog;
        ctx.translate((Math.random()-0.5)*shakeMag, (Math.random()-0.5)*shakeMag);

        const baseThickness = lvl === 3 ? 140 : (lvl === 2 ? 90 : 50);
        
        // Pulse and jitter the thickness
        const pulse = 1.0 + Math.sin(Date.now() * 0.05) * 0.15 + (Math.random() * 0.2);
        const curThickness = baseThickness * prog * pulse;
        
        // Massive beam length that spans the whole screen width instantly!
        const beamLength = 1200;

        // 100% Vector Laser Beam
        const drawLaserLayer = (scaleY, color, alphaScale) => {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.min(1.0, prog * alphaScale);
            ctx.beginPath();
            ctx.rect(0, (-curThickness * scaleY) / 2, beamLength, curThickness * scaleY);
            ctx.fill();
        };

        // Layer 1: Outer cyan glow
        drawLaserLayer(1.5, player.color, 0.2);
        // Layer 2: Mid cyan core
        drawLaserLayer(0.8, player.color, 0.6);
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
        
        // Impact Burst at the end of the beam (Simulated far away)
        if (prog > 0.5) {
            ctx.save();
            ctx.translate(640, 0); // Burst at the edge of the screen!
            
            const impactRad = curThickness * (Math.random() * 0.5 + 0.8);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, impactRad);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, player.color);
            grad.addColorStop(1, getPlayerColorRgba(0));
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, impactRad, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Muzzle Flash / Energy Orb at the origin
        const flashRadius = (lvl === 3 ? 60 : 35) * prog * (1.0 + Math.random() * 0.3);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flashRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, player.color);
        gradient.addColorStop(1, getPlayerColorRgba(0));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, flashRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Render Projectiles
    for (const p of combatState.activeProjectiles) {
        ctx.save();
        const drawX = p.x - camera.x;
        const drawY = p.y - camera.y;
        ctx.translate(drawX, drawY);
        
        if (p.type === 'plasma_orb') {
            const rad = 30 + Math.sin(Date.now() * 0.02) * 5; // Pulsing
            
            // Draw electric rings instead of radial gradient to avoid square artifact
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3;
            for(let r=0; r<3; r++) {
                ctx.beginPath();
                for(let i=0; i<=12; i++) {
                    const angle = (i/12) * Math.PI * 2;
                    const rjitter = rad * (0.7 + Math.random()*0.5);
                    if(i===0) ctx.moveTo(Math.cos(angle)*rjitter, Math.sin(angle)*rjitter);
                    else ctx.lineTo(Math.cos(angle)*rjitter, Math.sin(angle)*rjitter);
                }
                ctx.closePath();
                ctx.stroke();
            }
            
            // Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (p.type === 'bio_trail') {
            // Static electric trail on ground
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2 + Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(-5, (Math.random()-0.5)*15);
            ctx.lineTo(5, (Math.random()-0.5)*15);
            ctx.lineTo(15, 0);
            ctx.stroke();
            
            // Tiny sparks
            ctx.fillStyle = '#ffffff';
            if (Math.random() > 0.5) {
                ctx.fillRect((Math.random()-0.5)*20, (Math.random()-0.5)*10, 2, 2);
            }
        } else if (p.type === 'acid_orb') {
            // Draw a teardrop shape pointing to velocity
            const angle = Math.atan2(p.vy, p.vx);
            ctx.rotate(angle);
            
            const w = 30;
            const h = 15;
            
            // Acid trail glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            // Teardrop path
            ctx.moveTo(w/2, 0); // tip
            ctx.quadraticCurveTo(0, -h, -w/2, -h/2);
            ctx.arc(-w/2, 0, h/2, -Math.PI/2, Math.PI/2, true);
            ctx.quadraticCurveTo(0, h, w/2, 0);
            ctx.fill();
            
            // Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-w/2 + 2, 0, h/4, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (p.type === 'emp_shockwave') {
            const h = 120 + Math.random() * 20;
            const w = 60;
            
            // Draw a lightning-like jagged wave moving across the floor
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.globalAlpha = Math.min(1, p.life * 2); // Fade out at end
            
            // Outer glow
            ctx.shadowBlur = 25;
            ctx.shadowColor = p.color;
            
            ctx.beginPath();
            let curX = 0;
            let curY = 0; // Floor level
            ctx.moveTo(curX, curY);
            for(let steps=0; steps < 5; steps++) {
                curX += (Math.random()-0.5) * w;
                curY -= h/5;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
            ctx.shadowBlur = 0; 
            
            // Electric base sparks (instead of flat gradient)
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3;
            for(let b=0; b<3; b++) {
                ctx.beginPath();
                let bx = (Math.random()-0.5) * 80;
                let by = (Math.random()-0.5) * 80;
                ctx.moveTo(bx, by);
                for(let steps=0; steps < 3; steps++) {
                    bx += (Math.random()-0.5) * 40;
                    by += (Math.random()-0.5) * 40;
                    ctx.lineTo(bx, by);
                }
                ctx.stroke();
            }
        } else if (p.type === 'bio_shockwave') {
            const rad = p.radius || 120;
            const progFade = Math.min(1.0, p.life * 2); // Fade out at the end
            
            ctx.globalAlpha = progFade;
            
            // Draw chaotic green electricity arcing in a sphere (no flat puddle!)
            ctx.strokeStyle = p.color; // Base color
            ctx.lineWidth = 2 + Math.random() * 2;
            
            const numBolts = 8; // Dense sparking intensity
            for(let b=0; b<numBolts; b++) {
                ctx.beginPath();
                // Start randomly inside a spherical radius
                let curX = (Math.random()-0.5) * rad;
                let curY = (Math.random()-0.5) * rad;
                ctx.moveTo(curX, curY);
                for(let steps=0; steps < 4; steps++) {
                    curX += (Math.random()-0.5) * rad * 0.7;
                    curY += (Math.random()-0.5) * rad * 0.7; // Arcs shoot in all directions!
                    ctx.lineTo(curX, curY);
                }
                ctx.stroke();
            }
            
            // Add a few intense white core bolts
            ctx.strokeStyle = '#ffffff'; 
            ctx.lineWidth = 3;
            for(let b=0; b<3; b++) {
                ctx.beginPath();
                let curX = (Math.random()-0.5) * (rad*0.5);
                let curY = (Math.random()-0.5) * (rad*0.5);
                ctx.moveTo(curX, curY);
                for(let steps=0; steps < 3; steps++) {
                    curX += (Math.random()-0.5) * rad * 0.5;
                    curY += (Math.random()-0.5) * rad * 0.5;
                    ctx.lineTo(curX, curY);
                }
                ctx.stroke();
            }
        }
        ctx.restore();
    }
}
