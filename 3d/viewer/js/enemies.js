import { combatState } from './combat.js';
import { addParticle } from './effects.js';

function checkAABB(r1, r2) {
    return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.physicsGroup = scene.physics.add.group();
    }

    spawnCrawler(x, y) {
        // Crawler: HP 2, Patrols left/right
        const body = this.scene.add.rectangle(x, y, 32, 20, 0xff0000);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'crawler',
            name: 'Crawler',
            truthName: 'Nhân viên bị thương',
            sprite: body,
            hp: 2,
            maxHp: 2,
            vx: -50,
            direction: -1,
            isHit: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                body.body.setVelocityX(enemy.vx);
                
                if (body.body.blocked.left || body.body.blocked.right) {
                    enemy.direction *= -1;
                    enemy.vx = 50 * enemy.direction;
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0xff0000;
                }

                // Check damage from player
                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let knockX = 0;
                    let bodyRect = { x: body.x - 16, y: body.y - 10, width: 32, height: 20 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
                        hitAmount = 1;
                        knockX = player.facingRight ? 200 : -200;
                    } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
                        hitAmount = 2;
                        knockX = player.facingRight ? 300 : -300;
                    } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
                        hitAmount = 2;
                        knockX = player.x < body.x ? 200 : -200;
                    }

                    if (hitAmount > 0) {
                        enemy.takeDamage(hitAmount, knockX);
                    }
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.4;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-150);
                
                for (let i=0; i<10; i++) {
                    addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ff0000', 0.5, 'pixel', 8);
                }

                if (enemy.hp <= 0) {
                    body.destroy();
                }
            }
        };
        
        this.enemies.push(enemy);
        return enemy;
    }

    spawnSpitter(x, y) {
        // Spitter: HP 3, Stands still, shoots acid projectiles every 2s
        const body = this.scene.add.rectangle(x, y, 24, 32, 0xffaa00);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'spitter',
            name: 'Spitter',
            truthName: 'Lính cầm súng',
            sprite: body,
            hp: 3,
            maxHp: 3,
            isHit: 0,
            shootTimer: 2.0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                body.body.setVelocityX(0); // Stands still
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0xffaa00;
                }

                // Shoot logic
                enemy.shootTimer -= dt;
                // Only shoot if player is near (distance < 400)
                if (enemy.shootTimer <= 0 && Math.abs(player.x - body.x) < 400 && Math.abs(player.y - body.y) < 200) {
                    enemy.shootTimer = 2.0;
                    
                    // Spawn acid projectile
                    const dir = player.x < body.x ? -1 : 1;
                    combatState.activeProjectiles.push({
                        type: 'acid_orb',
                        x: body.x + dir * 20,
                        y: body.y - 10,
                        vx: dir * 400,
                        vy: -200, // Arc
                        life: 2.0,
                        color: '#44ff44'
                    });
                }

                // Check damage from player
                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let knockX = 0;
                    let bodyRect = { x: body.x - 12, y: body.y - 16, width: 24, height: 32 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
                        hitAmount = 1;
                        knockX = player.facingRight ? 150 : -150;
                    } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
                        hitAmount = 2;
                        knockX = player.facingRight ? 250 : -250;
                    } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
                        hitAmount = 2;
                        knockX = player.x < body.x ? 150 : -150;
                    }

                    if (hitAmount > 0) {
                        enemy.takeDamage(hitAmount, knockX);
                    }
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.4;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-150);
                
                for (let i=0; i<10; i++) {
                    addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ffaa00', 0.5, 'pixel', 8);
                }

                if (enemy.hp <= 0) {
                    body.destroy();
                }
            }
        };
        
        this.enemies.push(enemy);
        return enemy;
    }

    spawnFloater(x, y) {
        // Floater: HP 2, hovers and chases player if near
        const body = this.scene.add.rectangle(x, y, 24, 24, 0xcc00ff);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(0); // Floats
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'floater',
            name: 'Floater',
            truthName: 'Drone trinh sát',
            sprite: body,
            hp: 2,
            maxHp: 2,
            isHit: 0,
            baseY: y,
            time: Math.random() * 10,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                enemy.time += dt;
                
                // Hover motion
                let targetVx = 0;
                let targetVy = Math.sin(enemy.time * 2) * 20;
                
                // Chase player if close
                const dist = Math.hypot(player.x - body.x, player.y - body.y);
                if (dist < 300) {
                    targetVx = player.x < body.x ? -60 : 60;
                    targetVy += player.y < body.y ? -30 : 30;
                }
                
                body.body.setVelocityX(targetVx);
                body.body.setVelocityY(targetVy);
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0xcc00ff;
                }

                // Check damage from player
                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let knockX = 0;
                    let bodyRect = { x: body.x - 12, y: body.y - 12, width: 24, height: 24 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
                        hitAmount = 1;
                        knockX = player.facingRight ? 150 : -150;
                    } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
                        hitAmount = 2;
                        knockX = player.facingRight ? 250 : -250;
                    } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
                        hitAmount = 2;
                        knockX = player.x < body.x ? 150 : -150;
                    }

                    if (hitAmount > 0) {
                        enemy.takeDamage(hitAmount, knockX);
                    }
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.4;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-100);
                
                for (let i=0; i<10; i++) {
                    addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#cc00ff', 0.5, 'pixel', 8);
                }

                if (enemy.hp <= 0) {
                    body.destroy();
                }
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnWarden(x, y) {
        // Boss MB01 - Warden
        const body = this.scene.add.rectangle(x, y, 64, 80, 0x880000);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        body.body.setImmovable(true); // Hard to knockback
        
        const enemy = {
            id: 'boss_mb01',
            type: 'boss',
            name: 'Warden',
            truthName: 'Robot an ninh',
            sprite: body,
            hp: 20,
            maxHp: 20,
            isHit: 0,
            state: 'idle',
            timer: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                enemy.timer -= dt;
                
                if (enemy.state === 'idle') {
                    body.body.setVelocityX(0);
                    if (enemy.timer <= 0) {
                        enemy.state = 'charge';
                        enemy.timer = 1.0;
                    }
                } else if (enemy.state === 'charge') {
                    if (enemy.timer <= 0) {
                        enemy.state = 'attack';
                        enemy.timer = 0.5;
                        const dir = player.x < body.x ? -1 : 1;
                        body.body.setVelocityX(dir * 400); // Dash attack
                        
                        // Ground smash particles
                        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 8}}));
                    }
                } else if (enemy.state === 'attack') {
                    if (enemy.timer <= 0) {
                        enemy.state = 'idle';
                        enemy.timer = 2.0;
                        body.body.setVelocityX(0);
                    }
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = enemy.state === 'charge' ? 0xff0000 : 0x880000;
                }

                // Check damage from player
                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let bodyRect = { x: body.x - 32, y: body.y - 40, width: 64, height: 80 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
                        hitAmount = 1;
                    } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
                        hitAmount = 2;
                    } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
                        hitAmount = 3;
                    }

                    if (hitAmount > 0) {
                        enemy.takeDamage(hitAmount, 0); // No knockback
                    }
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                
                for (let i=0; i<15; i++) {
                    addParticle(body.x, body.y, (Math.random()-0.5)*300, -100-Math.random()*200, '#880000', 0.8, 'pixel', 10);
                }

                if (enemy.hp <= 0) {
                    // Boss Defeated Logic
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 15}}));
                    for (let i=0; i<50; i++) {
                        addParticle(body.x, body.y, (Math.random()-0.5)*500, (Math.random()-0.5)*500, '#ff0000', 1.0, 'tex_star', 15);
                    }
                    if (window.DialogueSystem) {
                        window.DialogueSystem.show("Tuyệt vời! Anh đã dọn dẹp được đống rác đó. Em đã mở khóa chức năng Dash (Nhấn U) cho anh.", 'normal', 5000);
                    }
                    window.dashUnlocked = true;
                    body.destroy();
                }
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnLeechVine(x, y) {
        // Leech Vine: Static enemy hanging from ceiling or on floor, attacks if near
        const body = this.scene.add.rectangle(x, y, 20, 60, 0x00ff44);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(0);
        body.body.setImmovable(true);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'leech_vine',
            name: 'Leech Vine',
            truthName: 'Dây cáp điện',
            sprite: body,
            hp: 3,
            maxHp: 3,
            isHit: 0,
            timer: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0x00ff44;
                }

                const dist = Math.hypot(player.x - body.x, player.y - body.y);
                enemy.timer -= dt;
                
                if (dist < 150 && enemy.timer <= 0) {
                    // Attack
                    enemy.timer = 1.5;
                    // Draw a quick whip particle effect towards player
                    for(let i=0; i<10; i++) {
                        addParticle(body.x + (player.x - body.x)*i/10, body.y + (player.y - body.y)*i/10, 0, 0, '#00ff44', 0.2, 'pixel', 4);
                    }
                    if (dist < 80 && combatState.invulnTime <= 0) {
                        combatState.hp -= 2;
                        combatState.invulnTime = 0.5;
                        if (window.triggerDamageDialogue) window.triggerDamageDialogue();
                    }
                }

                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let bodyRect = { x: body.x - 10, y: body.y - 30, width: 20, height: 60 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                    else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) hitAmount = 2;
                    else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) hitAmount = 2;

                    if (hitAmount > 0) enemy.takeDamage(hitAmount);
                }
            },
            takeDamage: (amount) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*150, (Math.random()-0.5)*150, '#00ff44', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnCharger(x, y) {
        // Charger: High speed ground enemy, charges when player is on same Y level
        const body = this.scene.add.rectangle(x, y, 40, 32, 0xffaa00);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'charger',
            name: 'Charger',
            truthName: 'Lính bọc giáp',
            sprite: body,
            hp: 4,
            maxHp: 4,
            isHit: 0,
            state: 'idle',
            timer: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                enemy.timer -= dt;
                
                const yDist = Math.abs(player.y - body.y);
                const xDist = Math.abs(player.x - body.x);
                
                if (enemy.state === 'idle') {
                    body.body.setVelocityX(0);
                    if (yDist < 50 && xDist < 400 && enemy.timer <= 0) {
                        enemy.state = 'windup';
                        enemy.timer = 0.6; // Wind up time
                        body.fillColor = 0xffffff;
                    }
                } else if (enemy.state === 'windup') {
                    if (enemy.timer <= 0) {
                        enemy.state = 'charge';
                        enemy.timer = 1.0;
                        const dir = player.x < body.x ? -1 : 1;
                        body.body.setVelocityX(dir * 500);
                    }
                } else if (enemy.state === 'charge') {
                    if (enemy.timer <= 0 || body.body.blocked.left || body.body.blocked.right) {
                        enemy.state = 'idle';
                        enemy.timer = 2.0; // Rest
                    }
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else if (enemy.state !== 'windup') {
                    body.fillColor = enemy.state === 'charge' ? 0xff0000 : 0xffaa00;
                }

                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let knockX = 0;
                    let bodyRect = { x: body.x - 20, y: body.y - 16, width: 40, height: 32 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
                        hitAmount = 1; knockX = player.facingRight ? 100 : -100;
                    } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
                        hitAmount = 2; knockX = player.facingRight ? 200 : -200;
                    } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
                        hitAmount = 3; knockX = player.x < body.x ? 150 : -150;
                    }

                    if (hitAmount > 0) enemy.takeDamage(hitAmount, knockX);
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                enemy.state = 'idle'; // Cancel charge
                enemy.timer = 1.0;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-150);
                
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ffaa00', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnMotherVine(x, y) {
        // Boss MB02 - Mother Vine
        const body = this.scene.add.rectangle(x, y, 96, 96, 0x004400);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        body.body.setImmovable(true);
        
        const enemy = {
            id: 'boss_mb02',
            type: 'boss',
            name: 'Mother Vine',
            truthName: 'Khối tế bào mẹ',
            sprite: body,
            hp: 35,
            maxHp: 35,
            isHit: 0,
            state: 'idle',
            timer: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                enemy.timer -= dt;
                
                if (enemy.state === 'idle') {
                    if (enemy.timer <= 0) {
                        enemy.state = Math.random() < 0.5 ? 'spit' : 'slam';
                        enemy.timer = 1.0;
                    }
                } else if (enemy.state === 'spit') {
                    if (enemy.timer <= 0) {
                        // Shoot 3 acid orbs
                        for(let i=0; i<3; i++) {
                            combatState.activeProjectiles.push({
                                type: 'acid_orb',
                                x: body.x, y: body.y - 40,
                                vx: (player.x - body.x)*0.8 + (i-1)*100,
                                vy: -300,
                                color: '#00ff44',
                                time: 0
                            });
                        }
                        enemy.state = 'idle';
                        enemy.timer = 3.0;
                    }
                } else if (enemy.state === 'slam') {
                    if (enemy.timer <= 0) {
                        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 10}}));
                        // Slams the ground, spawning vines below player
                        for(let i=0; i<5; i++) {
                            setTimeout(() => {
                                if (enemy.hp <= 0) return;
                                addParticle(player.x, player.y + 40, 0, -200, '#00ff44', 0.5, 'pixel', 20);
                                if (Math.abs(player.x - (player.x)) < 30 && combatState.invulnTime <= 0) {
                                    combatState.hp -= 3;
                                    combatState.invulnTime = 1.0;
                                    if (window.triggerDamageDialogue) window.triggerDamageDialogue();
                                }
                            }, 500 + i*300);
                        }
                        enemy.state = 'idle';
                        enemy.timer = 3.5;
                    }
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0x004400;
                }

                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let bodyRect = { x: body.x - 48, y: body.y - 48, width: 96, height: 96 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                    else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) hitAmount = 2;
                    else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) hitAmount = 3;

                    if (hitAmount > 0) enemy.takeDamage(hitAmount);
                }
            },
            takeDamage: (amount) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                
                for (let i=0; i<20; i++) addParticle(body.x, body.y, (Math.random()-0.5)*400, -100-Math.random()*300, '#004400', 0.8, 'pixel', 12);

                if (enemy.hp <= 0) {
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 20}}));
                    for (let i=0; i<80; i++) addParticle(body.x, body.y, (Math.random()-0.5)*600, (Math.random()-0.5)*600, '#00ff44', 1.0, 'tex_star', 15);
                    if (window.DialogueSystem) {
                        window.DialogueSystem.show("Anh đã có được thứ sức mạnh tởm lợm đó. Em đã mở khóa Bio-Drill (Nhấn K) cho anh.", 'normal', 5000);
                    }
                    window.drillUnlocked = true;
                    body.destroy();
                }
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnCyborg(x, y) {
        // Cyborg Guard: Patrols and shoots plasma
        const body = this.scene.add.rectangle(x, y, 32, 64, 0x00ffff);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'cyborg',
            name: 'Cyborg Guard',
            truthName: 'Đặc nhiệm Alpha',
            sprite: body,
            hp: 6,
            maxHp: 6,
            isHit: 0,
            timer: 0,
            facingRight: true,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                enemy.timer -= dt;
                
                // Patrol
                if (body.body.blocked.left) enemy.facingRight = true;
                if (body.body.blocked.right) enemy.facingRight = false;
                
                const dist = Math.hypot(player.x - body.x, player.y - body.y);
                
                if (dist < 400 && Math.abs(player.y - body.y) < 100) {
                    body.body.setVelocityX(0); // Stop and shoot
                    if (enemy.timer <= 0) {
                        enemy.facingRight = player.x > body.x;
                        combatState.activeProjectiles.push({
                            type: 'plasma_orb',
                            x: body.x + (enemy.facingRight ? 20 : -20),
                            y: body.y - 10,
                            vx: enemy.facingRight ? 400 : -400,
                            vy: 0,
                            color: '#00ffff',
                            time: 0
                        });
                        enemy.timer = 1.5;
                    }
                } else {
                    body.body.setVelocityX(enemy.facingRight ? 100 : -100);
                }

                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0x00ffff;
                }

                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let knockX = 0;
                    let bodyRect = { x: body.x - 16, y: body.y - 32, width: 32, height: 64 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) { hitAmount = 1; knockX = player.facingRight ? 100 : -100; }
                    else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) { hitAmount = 2; knockX = player.facingRight ? 200 : -200; }
                    else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) { hitAmount = 3; knockX = player.x < body.x ? 150 : -150; }

                    if (hitAmount > 0) enemy.takeDamage(hitAmount, knockX);
                }
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-100);
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#00ffff', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnMimic(x, y) {
        // Mimic Terminal: Fake save point (looks green, turns red when close)
        const body = this.scene.add.rectangle(x, y, 40, 80, 0x00ffcc, 0.5);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        body.body.setImmovable(true);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'mimic',
            name: 'Mimic Terminal',
            truthName: 'Trạm lưu trữ',
            sprite: body,
            hp: 8,
            maxHp: 8,
            isHit: 0,
            active: false,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                const dist = Math.hypot(player.x - body.x, player.y - body.y);
                
                if (!enemy.active && dist < 100) {
                    enemy.active = true;
                    body.fillColor = 0xff0000;
                    body.fillAlpha = 1.0;
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 5}}));
                    for(let i=0; i<20; i++) addParticle(body.x, body.y, (Math.random()-0.5)*300, -Math.random()*300, '#ff0000', 0.8, 'pixel', 8);
                }
                
                if (enemy.active) {
                    // Jump and chase
                    if (body.body.blocked.down && Math.random() < 0.02) {
                        body.body.setVelocityY(-400);
                        body.body.setVelocityX(player.x > body.x ? 200 : -200);
                    }
                    
                    if (enemy.isHit > 0) {
                        enemy.isHit -= dt;
                        body.fillColor = 0xffffff;
                    } else {
                        body.fillColor = 0xff0000;
                    }

                    if (enemy.isHit <= 0) {
                        let hitAmount = 0;
                        let bodyRect = { x: body.x - 20, y: body.y - 40, width: 40, height: 80 };
                        
                        if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                        else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) hitAmount = 2;
                        else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) hitAmount = 3;

                        if (hitAmount > 0) enemy.takeDamage(hitAmount);
                    }
                }
            },
            takeDamage: (amount) => {
                if (!enemy.active) enemy.active = true; // Wake up if hit
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ff0000', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnArchiveKeeper(x, y) {
        // Boss MB03 - Archive Keeper
        const body = this.scene.add.rectangle(x, y, 64, 64, 0xcc44ff);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(0); // Floats
        body.body.setImmovable(true);
        
        const enemy = {
            id: 'boss_mb03',
            type: 'boss',
            name: 'Archive Keeper',
            truthName: 'Robot thư viện',
            sprite: body,
            hp: 50,
            maxHp: 50,
            isHit: 0,
            state: 'idle',
            timer: 0,
            baseY: y,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                
                enemy.timer -= dt;
                
                if (enemy.state === 'idle') {
                    // Hover and follow player X slowly
                    body.y = enemy.baseY + Math.sin(Date.now() / 300) * 20;
                    body.body.setVelocityX((player.x - body.x) * 0.5);
                    
                    if (enemy.timer <= 0) {
                        enemy.state = Math.random() < 0.5 ? 'laser' : 'summon';
                        enemy.timer = 1.0;
                    }
                } else if (enemy.state === 'laser') {
                    body.body.setVelocityX(0);
                    if (enemy.timer <= 0) {
                        // Shoot 5 fast plasma orbs
                        for(let i=0; i<5; i++) {
                            setTimeout(() => {
                                if (enemy.hp <= 0) return;
                                const dx = player.x - body.x;
                                const dy = player.y - body.y;
                                const dist = Math.hypot(dx, dy);
                                combatState.activeProjectiles.push({
                                    type: 'plasma_orb',
                                    x: body.x, y: body.y,
                                    vx: (dx/dist) * 600,
                                    vy: (dy/dist) * 600,
                                    color: '#cc44ff',
                                    time: 0
                                });
                            }, i * 200);
                        }
                        enemy.state = 'idle';
                        enemy.timer = 3.0;
                    }
                } else if (enemy.state === 'summon') {
                    body.body.setVelocityX(0);
                    if (enemy.timer <= 0) {
                        // Spawn a floater
                        window.enemyManager.spawnFloater(body.x, body.y + 50);
                        enemy.state = 'idle';
                        enemy.timer = 4.0;
                    }
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.fillColor = 0xffffff;
                } else {
                    body.fillColor = 0xcc44ff;
                }

                if (enemy.isHit <= 0) {
                    let hitAmount = 0;
                    let bodyRect = { x: body.x - 32, y: body.y - 32, width: 64, height: 64 };
                    
                    if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                    else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) hitAmount = 2;
                    else if (combatState.isRisingBlast && checkAABB(bodyRect, {x: player.x, y: player.y-100, width: player.width, height: 100})) hitAmount = 3;

                    if (hitAmount > 0) enemy.takeDamage(hitAmount);
                }
            },
            takeDamage: (amount) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                
                for (let i=0; i<15; i++) addParticle(body.x, body.y, (Math.random()-0.5)*300, -100-Math.random()*200, '#cc44ff', 0.8, 'pixel', 10);

                if (enemy.hp <= 0) {
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 25}}));
                    for (let i=0; i<100; i++) addParticle(body.x, body.y, (Math.random()-0.5)*800, (Math.random()-0.5)*800, '#cc44ff', 1.0, 'tex_star', 15);
                    if (window.DialogueSystem) {
                        window.DialogueSystem.show("Tuyệt vời! Module di chuyển trên không đã được bẻ khóa. Anh có thể Double Jump ngay bây giờ!", 'normal', 5000);
                    }
                    window.doubleJumpUnlocked = true;
                    body.destroy();
                }
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnEleanorMutated(x, y) {
        // Final Boss - Eleanor (3 Phases)
        const body = this.scene.add.rectangle(x, y, 80, 120, 0xffffff); // Hologram color initially
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(0);
        body.body.setImmovable(true);
        
        // Phase 1 pillars
        const pillars = [];
        for(let i=0; i<4; i++) {
            const p = this.scene.add.rectangle(x - 300 + i*200, y+100, 40, 100, 0x00ffff);
            this.scene.physics.add.existing(p);
            p.body.setImmovable(true);
            p.body.allowGravity = false;
            p.hp = 10;
            p.active = true;
            pillars.push(p);
        }
        
        const enemy = {
            id: 'boss_final',
            type: 'boss',
            name: 'Eleanor Hologram',
            truthName: 'Eleanor',
            sprite: body,
            hp: 80,
            maxHp: 80,
            isHit: 0,
            state: 'idle',
            timer: 0,
            phase: 1,
            pillars: pillars,
            update: (dt, player) => {
                if (enemy.hp <= 0 && enemy.phase !== 3) return;
                
                enemy.timer -= dt;

                if (enemy.phase === 1) {
                    body.y = y - 150 + Math.sin(Date.now()/500)*20; // Hover
                    
                    let activePillars = 0;
                    enemy.pillars.forEach(p => {
                        if (p.active) {
                            activePillars++;
                            // Check hit on pillar
                            let hitAmount = 0;
                            let pRect = { x: p.x - 20, y: p.y - 50, width: 40, height: 100 };
                            if (combatState.isAttacking && checkAABB(pRect, combatState.hitbox)) hitAmount = 1;
                            else if (combatState.isBioDrilling && checkAABB(pRect, player)) hitAmount = 2;
                            if (hitAmount > 0) {
                                p.hp -= hitAmount;
                                p.fillColor = 0xffffff;
                                setTimeout(()=> {if(p.active) p.fillColor = 0x00ffff;}, 100);
                                if (p.hp <= 0) {
                                    p.active = false;
                                    p.destroy();
                                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 10}}));
                                    for(let j=0; j<20;j++) addParticle(p.x, p.y, (Math.random()-0.5)*300, -Math.random()*300, '#00ffff', 0.5, 'pixel', 10);
                                }
                            }
                        }
                    });

                    if (activePillars === 0) {
                        enemy.phase = 2;
                        enemy.hp = 50;
                        enemy.maxHp = 50;
                        enemy.name = 'Bio-Mech Eleanor';
                        body.fillColor = 0xff0000;
                        body.y = y;
                        body.body.setGravityY(1200);
                        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 20}}));
                        if (window.DialogueSystem) window.DialogueSystem.show("Nếu anh không ở lại với em... thì em sẽ BẮT anh ở lại!", 'glitch', 4000);
                    } else {
                        // Phase 1 attacks
                        if (enemy.timer <= 0) {
                            if (Math.random() < 0.5) {
                                window.enemyManager.spawnCrawler(body.x, body.y + 100);
                            } else {
                                combatState.activeProjectiles.push({
                                    type: 'plasma_orb',
                                    x: body.x, y: body.y,
                                    vx: (player.x - body.x) * 1.5,
                                    vy: (player.y - body.y) * 1.5,
                                    color: '#00ffff',
                                    time: 0
                                });
                            }
                            enemy.timer = 2.0;
                        }
                    }

                } else if (enemy.phase === 2) {
                    
                    if (enemy.hp <= 20 && !enemy.rageMode) {
                        enemy.rageMode = true;
                        if (window.DialogueSystem) window.DialogueSystem.show("Anh có nhớ không... ngày cưới của chúng ta? Anh nói... anh sẽ không bao giờ rời xa em... [khóc] Anh nói dối...", 'crying', 5000);
                    }

                    if (enemy.state === 'idle') {
                        body.body.setVelocityX(0);
                        if (enemy.timer <= 0) {
                            const roll = Math.random();
                            if (roll < 0.4) enemy.state = 'dash';
                            else if (roll < 0.8) enemy.state = 'emp';
                            else enemy.state = 'spit';
                            enemy.timer = 0.5;
                        }
                    } else if (enemy.state === 'dash') {
                        if (enemy.timer <= 0) {
                            const dir = player.x < body.x ? -1 : 1;
                            body.body.setVelocityX(dir * (enemy.rageMode ? 800 : 500));
                            enemy.state = 'idle';
                            enemy.timer = 1.5;
                        }
                    } else if (enemy.state === 'emp') {
                        body.body.setVelocityX(0);
                        if (enemy.timer <= 0) {
                            combatState.activeProjectiles.push({
                                type: 'emp_shockwave',
                                x: body.x, y: body.y + 60,
                                vx: 0, vy: 0,
                                color: '#ff0000',
                                time: 0,
                                radius: 0
                            });
                            enemy.state = 'idle';
                            enemy.timer = 2.0;
                        }
                    } else if (enemy.state === 'spit') {
                        body.body.setVelocityX(0);
                        if (enemy.timer <= 0) {
                            const count = enemy.rageMode ? 8 : 4;
                            for(let i=0; i<count; i++) {
                                combatState.activeProjectiles.push({
                                    type: 'acid_orb',
                                    x: body.x, y: body.y - 60,
                                    vx: (Math.random()-0.5)*800,
                                    vy: -400 - Math.random()*300,
                                    color: '#ff0000',
                                    time: 0
                                });
                            }
                            enemy.state = 'idle';
                            enemy.timer = 2.5;
                        }
                    }

                    if (enemy.isHit > 0) {
                        enemy.isHit -= dt;
                        body.fillColor = 0xffffff;
                    } else {
                        body.fillColor = enemy.rageMode ? 0xff00ff : 0xff0000;
                    }

                    if (enemy.isHit <= 0) {
                        let hitAmount = 0;
                        let bodyRect = { x: body.x - 40, y: body.y - 60, width: 80, height: 120 };
                        if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                        else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) hitAmount = 2;
                        else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) hitAmount = 3;

                        if (hitAmount > 0) {
                            enemy.hp -= hitAmount;
                            enemy.isHit = 0.2;
                            for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*400, -Math.random()*300, '#ff0000', 0.8, 'pixel', 10);
                            
                            if (enemy.hp <= 0) {
                                if (window.trueEndUnlocked) {
                                    // Enter Phase 3
                                    enemy.phase = 3;
                                    enemy.hp = 20;
                                    enemy.maxHp = 20;
                                    enemy.name = 'Eleanor Core';
                                    body.fillColor = 0x88ccff;
                                    body.body.setVelocityX(0);
                                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 15}}));
                                    if (window.DialogueSystem) window.DialogueSystem.show("Anh ơi... em mệt lắm rồi... Em nhớ Lily... Em nhớ ba mẹ...", 'crying', 5000);
                                } else {
                                    // Bad / Normal End trigger
                                    enemy.triggerEnding();
                                }
                            }
                        }
                    }
                } else if (enemy.phase === 3) {
                    body.body.setVelocityX(0);
                    // No attacks. Waiting for player to hit her or interact
                    if (enemy.isHit <= 0) {
                        let hitAmount = 0;
                        let bodyRect = { x: body.x - 40, y: body.y - 60, width: 80, height: 120 };
                        if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) hitAmount = 1;
                        if (hitAmount > 0) {
                            enemy.hp -= hitAmount;
                            enemy.isHit = 0.2;
                            if (enemy.hp <= 0) {
                                enemy.triggerEnding();
                            }
                        }
                    }
                }
            },
            triggerEnding: () => {
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 30}}));
                for (let i=0; i<150; i++) addParticle(body.x, body.y, (Math.random()-0.5)*1000, (Math.random()-0.5)*1000, '#ffffff', 1.0, 'tex_star', 20);
                
                body.destroy();
                
                // Show Ending
                setTimeout(() => {
                    const blackScreen = document.createElement('div');
                    blackScreen.style.position = 'fixed';
                    blackScreen.style.top = '0';
                    blackScreen.style.left = '0';
                    blackScreen.style.width = '100vw';
                    blackScreen.style.height = '100vh';
                    blackScreen.style.backgroundColor = 'black';
                    blackScreen.style.zIndex = '9999';
                    blackScreen.style.display = 'flex';
                    blackScreen.style.flexDirection = 'column';
                    blackScreen.style.alignItems = 'center';
                    blackScreen.style.justifyContent = 'center';
                    blackScreen.style.color = 'white';
                    blackScreen.style.fontFamily = 'monospace';
                    blackScreen.style.fontSize = '24px';
                    blackScreen.style.textAlign = 'center';
                    blackScreen.style.padding = '50px';
                    
                    let fragments = window.LoreSystem ? window.LoreSystem.unlockedMemories.size : 0;
                    
                    if (window.trueEndUnlocked && enemy.phase === 3) {
                        blackScreen.innerHTML = `<h1>TRUE ENDING - Requiem</h1><p>Có những người yêu nhau đến phát điên. Có những người chết đi chỉ để được ở bên nhau. Đây là câu chuyện tình của họ.</p>`;
                    } else if (fragments >= 5) {
                        blackScreen.innerHTML = `<h1>NORMAL ENDING - Sự Giải Thoát Tàn Nhẫn</h1><p>Sự thật đã giải thoát anh khỏi sự điên loạn. Nhưng không ai giải thoát anh khỏi bóng tối.</p>`;
                    } else {
                        blackScreen.innerHTML = `<h1>BAD ENDING - Vòng Lặp Vĩnh Cửu</h1><p>Tình yêu là nhà tù hoàn hảo nhất. Không có tường, không có khóa. Chỉ có hai trái tim bị xích lại với nhau... mãi mãi.</p>`;
                    }
                    
                    const btn = document.createElement('button');
                    btn.innerText = "Chơi lại";
                    btn.style.marginTop = "30px";
                    btn.style.padding = "10px 20px";
                    btn.style.background = "#ff0000";
                    btn.style.color = "white";
                    btn.style.border = "none";
                    btn.onclick = () => location.reload();
                    blackScreen.appendChild(btn);
                    
                    document.body.appendChild(blackScreen);
                }, 2000);
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    update(dt, player) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.hp <= 0) {
                this.enemies.splice(i, 1);
                continue;
            }
            enemy.update(dt, player);
        }
    }
}
