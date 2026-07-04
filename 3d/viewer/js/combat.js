import { keys, isBuffered, consumeBuffer } from './input.js?v=17';
import { addParticle } from './effects.js?v=17';
import { getCollision, TILE_SIZE } from './world.js?v=17';

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
    smashPhase: 0, // 0 = None, 1 = Leap, 2 = Float/Anticipation, 3 = Slam
    smashTimer: 0,
    smashCooldown: 0,
    
    isLowSweeping: false,
    lowSweepTime: 0,
    lowSweepCooldown: 0,
    
    isBioDrilling: false,
    bioDrillTime: 0,
    bioDrillCooldown: 0,
    
    isUpSlashing: false,
    upSlashTime: 0,
    upSlashCooldown: 0,
    
    isPogoSlashing: false,
    pogoSlashTime: 0,
    pogoSlashCooldown: 0,
    
    isRisingBlast: false,
    risingBlastTime: 0,
    risingBlastCooldown: 0,
    
    isLightningNova: false,
    lightningNovaTime: 0,
    lightningNovaCooldown: 0,
    
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
    combatState.chargeTime = 0; // RESET CHARGE TIME!
    let level = 1;
    let cameraShake = 5;
    let beamDuration = 0.15;
    let dashSpeed = 600; // Base dash speed
    
    if (chargeTime >= 0.7) {
        level = 3;
        cameraShake = 25;
        beamDuration = 0.35;
        dashSpeed = 1200; // Fast lightning warp (lowered to prevent tunneling)
    } else if (chargeTime >= 0.3) {
        level = 2;
        cameraShake = 12;
        beamDuration = 0.22;
        dashSpeed = 900;
    }
    
    combatState.chargeLevel = level;
    combatState.lastChargeRatio = chargeTime / combatState.chargeDuration;
    
    combatState.dashStrikeTime = level === 3 ? 0.3 : 0.2;
    combatState.dashStrikeCooldown = 0.4;
    
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
    if (combatState.lowSweepCooldown > 0) combatState.lowSweepCooldown -= dt;
    if (combatState.bioDrillCooldown > 0) combatState.bioDrillCooldown -= dt;
    if (combatState.upSlashCooldown > 0) combatState.upSlashCooldown -= dt;
    if (combatState.pogoSlashCooldown > 0) combatState.pogoSlashCooldown -= dt;
    if (combatState.risingBlastCooldown > 0) combatState.risingBlastCooldown -= dt;

    if (combatState.comboWindow <= 0 && !combatState.isAttacking) {
        combatState.comboStep = 0;
    }

    const isBusy = combatState.isAttacking || combatState.isDashStriking || combatState.isGroundSmashing || combatState.isLowSweeping || combatState.isBioDrilling || combatState.isUpSlashing || combatState.isPogoSlashing || combatState.isRisingBlast;

    // SKILL 2: Charge Slash (K)
    if (keys.skill2 && !isBusy && combatState.dashStrikeCooldown <= 0) {
        combatState.isCharging = true;
        combatState.chargeTime += dt;
        
        const curTime = combatState.chargeTime;
        let sparkChance = 0;
        let sparkColor = '#00ffff';
        
        if (curTime >= combatState.chargeDuration) {
            sparkChance = 0.8;
            sparkColor = '#ffffff'; // White electricity for max charge
            if (Math.random() < 0.25) {
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 2.2}}));
            }
        } else if (curTime >= 0.3) {
            sparkChance = 0.55;
            sparkColor = '#00ffff';
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
            releaseChargeAttack(player);
        }
    } else if (combatState.isCharging) {
        releaseChargeAttack(player);
    }

    // Prepare Skill Triggers & Buffer Flags
    const wantSkill4 = keys.skill4Pressed || isBuffered('skill4');
    const wantSkill3 = keys.skill3Pressed || isBuffered('skill3');
    const wantSkill1 = keys.skill1Pressed || isBuffered('skill1');

    // SKILL 4: Heavy Attack combos (I) - Spells
    if (wantSkill4 && !isBusy && !combatState.isCharging) {
        if (keys.down) {
            // S + I: Ground Smash (Desolate Dive)
            if (combatState.smashCooldown <= 0) {
                combatState.isGroundSmashing = true;
                player.vx = 0;
                if (player.isGrounded) {
                    combatState.smashPhase = 1;
                    player.vy = -620; // Leap
                    player.isGrounded = false;
                } else {
                    combatState.smashPhase = 3; // Air Smash skips float, straight to drop!
                    player.vy = 1200; 
                }
                consumeBuffer('skill4');
            }
        } else if (keys.up) {
            // W + I: Rising Blast (Howling Wraiths)
            if (combatState.risingBlastCooldown <= 0) {
                combatState.isRisingBlast = true;
                combatState.risingBlastTime = 0.35;
                combatState.risingBlastCooldown = 1.0;
                player.vx = 0;
                player.vy = -200; // Small upward float
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 6}}));
                consumeBuffer('skill4');
            }
        } else {
            // Neutral I: Bio-Drill (Vengeful Spirit dash)
            if (combatState.bioDrillCooldown <= 0) {
                combatState.isBioDrilling = true;
                combatState.bioDrillTime = 0.35;
                combatState.bioDrillCooldown = 1.0;
                player.vx = player.facingRight ? 900 : -900;
                player.vy = 0; 
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 6}}));
                consumeBuffer('skill4');
            }
        }
    }
    
    // SKILL 3: Lightning Nova (L) - AOE Shockwave Burst
    else if (wantSkill3 && !isBusy && !combatState.isCharging) {
        if (combatState.lightningNovaCooldown <= 0) {
            combatState.isLightningNova = true;
            combatState.lightningNovaTime = 0.3;
            combatState.lightningNovaCooldown = 0.8;
            player.vx *= 0.2; // stall horizontal movement
            player.vy = -100; // slight air float
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 12}}));
            consumeBuffer('skill3');
            
            // Spawn 360-degree shockwave ring and particles
            addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#00ffff', 0.4, 'ring', 60);
            addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#ffffff', 0.25, 'ring', 25);
            for (let i = 0; i < 16; i++) {
                const ang = (i / 16) * Math.PI * 2;
                const spd = 400 + Math.random() * 200;
                addParticle(
                    player.x + player.width/2,
                    player.y + player.height/2,
                    Math.cos(ang) * spd,
                    Math.sin(ang) * spd,
                    '#00ffff',
                    0.35,
                    'tex_star',
                    16 + Math.random() * 8
                );
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
                    combatState.lowSweepCooldown = 0.6;
                    player.vx = player.facingRight ? 250 : -250; 
                    consumeBuffer('skill1');
                }
            } else {
                // Air S + J: Pogo Strike
                if (combatState.pogoSlashCooldown <= 0) {
                    combatState.isPogoSlashing = true;
                    combatState.pogoSlashTime = 0.2;
                    combatState.pogoSlashCooldown = 0.3;
                    player.vy = -100; // Slight stall to hit
                    consumeBuffer('skill1');
                }
            }
        } else if (keys.up) {
            // W + J: Up Slash
            if (combatState.upSlashCooldown <= 0) {
                combatState.isUpSlashing = true;
                combatState.upSlashTime = 0.2;
                combatState.upSlashCooldown = 0.4;
                if (!player.isGrounded) player.vy = -150; // Air stall
                consumeBuffer('skill1');
            }
        } else {
            // Neutral J: Normal Attack Combo
            if (combatState.attackCooldown <= 0) {
                combatState.isAttacking = true;
                combatState.comboStep++;
                if (combatState.comboStep > 3) combatState.comboStep = 1;
                
                combatState.attackTime = combatState.attackDuration;
                
                if (!player.isGrounded) {
                    combatState.comboStep = 1; 
                    combatState.attackCooldown = 0.25;
                } else {
                    if (combatState.comboStep === 3) {
                        combatState.attackTime = 0.25;
                        combatState.attackCooldown = 0.5;
                        player.vx += player.facingRight ? 300 : -300;
                    } else {
                        combatState.attackCooldown = 0.2;
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
            '#00ffff',
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
                'rgba(0, 255, 255, 0.8)',
                0.2,
                'spark',
                4
            );
        }
        
        if (combatState.lightningNovaTime <= 0) {
            combatState.isLightningNova = false;
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
        
        // Wall Ricochet Logic (Using lookahead to prevent any physics tunneling!)
        // Check a few pixels ahead of the player depending on direction
        const lookaheadX = player.facingRight ? player.x + player.width + 5 : player.x - 5;
        const hitWallRight = player.facingRight && getCollision(lookaheadX, player.y + 5, 1, player.height - 10);
        const hitWallLeft = !player.facingRight && getCollision(lookaheadX, player.y + 5, 1, player.height - 10);
        
        if (hitWallRight || hitWallLeft) {
            // Ricochet!
            player.facingRight = !player.facingRight;
            player.vx = player.facingRight ? 800 : -800; // Bounce back
            player.vy = -500; // Bounce up
            player.wallJumpTimer = 0.3; // Give player time to bounce off wall without friction interference
            
            combatState.isDashStriking = false;
            combatState.dashStrikeCooldown = 0; // Allow instant recast after bounce!
            
            window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 15}}));
            
            // Wall Impact Explosion
            const impactX = hitWallRight ? player.x + player.width : player.x;
            addParticle(impactX, player.y + player.height/2, (player.facingRight ? 200 : -200), 0, '#00ffff', 0.6, 'tex_impact', 90);
        } else if (combatState.dashStrikeTime <= 0) {
            combatState.isDashStriking = false;
            player.vx = player.facingRight ? 400 : -400; // Keep momentum
        }
    }

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
                '#00ffff',
                0.3,
                'tex_spark',
                15
            );
        }
        
        if (combatState.lowSweepTime <= 0) {
            combatState.isLowSweeping = false;
        }
    }

    // Execute Bio-Drill (Neutral I)
    if (combatState.isBioDrilling) {
        combatState.bioDrillTime -= dt;
        player.vy = 0;
        
        player.scaleX = 1.6;
        player.scaleY = 0.6;
        
        // 1. Electric trail behind the player (faint, small sparks)
        addParticle(
            player.x + (player.facingRight ? 0 : player.width),
            player.y + player.height/2 + (Math.random() - 0.5) * player.height,
            -player.vx * 0.2 + (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 30,
            'rgba(0, 255, 255, 0.55)', // Faint cyan
            0.2 + Math.random() * 0.15,
            'tex_spark',
            4 + Math.random() * 4 // Small size
        );

        // 2. Drill impact particles in front of the player (slightly smaller for clean look)
        addParticle(
            player.x + (player.facingRight ? player.width : 0),
            player.y + player.height/2,
            -player.vx * 0.4,
            (Math.random() - 0.5) * 80,
            '#00ffff',
            0.35,
            'tex_star',
            12 // reduced from 18
        );

        if (Math.random() < 0.35) {
            addParticle(player.x + player.width/2, player.y + player.height/2, 0, 0, '#00ffff', 0.12, 'ring', 12);
        }

        if (combatState.bioDrillTime <= 0) {
            combatState.isBioDrilling = false;
            player.vx *= 0.3; // Rapid decelerate
        }
    }

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
        
        if (Math.random() < 0.5) {
            addParticle(player.x + player.width/2, player.y + player.height, (Math.random()-0.5)*100, 300, '#00ffff', 0.2, 'tex_spark', 10);
        }

        if (combatState.pogoSlashTime <= 0) combatState.isPogoSlashing = false;
    }

    // Execute Rising Blast (W + I)
    if (combatState.isRisingBlast) {
        combatState.risingBlastTime -= dt;
        player.vy = 0; // Lock vertical
        player.scaleX = 0.5;
        player.scaleY = 1.6;
        
        if (Math.random() < 0.8) {
            addParticle(player.x + player.width/2 + (Math.random()-0.5)*30, player.y, (Math.random()-0.5)*50, -500 - Math.random()*300, '#ffffff', 0.4, 'tex_star', 15);
        }

        if (combatState.risingBlastTime <= 0) combatState.isRisingBlast = false;
    }

    // Execute Skill 3 (Ground Smash)
    if (combatState.isGroundSmashing) {
        player.vx = 0; // Lock horizontal control
        
        if (combatState.smashPhase === 1) {
            // Leap phase: wait until player reaches the peak of their leap
            if (player.vy >= -50) {
                combatState.smashPhase = 2;
                combatState.smashTimer = 0.12; // Float freeze
                player.vy = 0;
            }
        } else if (combatState.smashPhase === 2) {
            // Float / Gather phase
            combatState.smashTimer -= dt;
            player.vy = 0; // Zero gravity freeze
            
            // Spawn sparks gathering below player (Cyan star)
            if (Math.random() < 0.6) {
                addParticle(player.x + player.width/2 + (Math.random()-0.5)*30, player.y + player.height + 10, 
                            (Math.random()-0.5)*50, -100, 'rgba(0, 255, 255, 0.85)', 0.25, 'tex_star', 12);
            }
            
            if (combatState.smashTimer <= 0) {
                combatState.smashPhase = 3;
                player.vy = 1600; // Slam down!
            }
        } else if (combatState.smashPhase === 3) {
            // Slam phase
            player.vy = 1600;
            player.scaleX = 0.5;
            player.scaleY = 2.2;
            
            // Downward trail of cyan sparks
            addParticle(player.x + player.width/2, player.y + 10, 
                        (Math.random()-0.5)*150, -400, 'rgba(0, 255, 255, 0.85)', 0.45, 'tex_spark', 16);
            
            // If hit ground
            if (player.isGrounded || getCollision(player.x, player.y + 6, player.width, player.height)) {
                combatState.isGroundSmashing = false;
                combatState.smashPhase = 0;
                combatState.smashCooldown = 1.8;
                
                // SHOCKWAVE & IMPACT EFFECT
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 22}}));
                
                // Expand cyan shockwave ring!
                addParticle(player.x + player.width/2, player.y + player.height, 0, 0, '#00ffff', 0.45, 'ring', 50);
                
                // Spawn animated 16-frame explosion spritesheet particle tinted Cyan and White!
                addParticle(player.x + player.width/2, player.y + player.height - 15, 0, 0, '#00ffff', 0.6, 'tex_impact', 120);
                addParticle(player.x + player.width/2, player.y + player.height - 15, 0, 0, '#ffffff', 0.4, 'tex_impact', 60); // Inner white flash
                
                // Dusty cyan smoke rising
                for(let i=0; i<15; i++) {
                    addParticle(
                        player.x + player.width/2,
                        player.y + player.height,
                        (Math.random()-0.5)*300,
                        -120 - Math.random()*200,
                        'rgba(0, 230, 255, 0.45)',
                        0.95,
                        'tex_smoke',
                        35 + Math.random()*20
                    );
                }
                
                // Glowing cyan and white stars
                for(let i=0; i<18; i++) {
                    addParticle(
                        player.x + player.width/2,
                        player.y + player.height,
                        (Math.random()-0.5)*600,
                        -200 - Math.random()*400,
                        Math.random() < 0.6 ? '#00ffff' : '#ffffff',
                        0.65,
                        'tex_star',
                        16 + Math.random()*8
                    );
                }
            }
        }
    }
}

export function drawCombat(ctx, camera, player) {
    // Combat visuals (tentacles, drill) are drawn directly in player.js
    // inside the skeletal transform loop to ensure seamless animation and head anchoring.
}
