import { combatState } from './combat.js?v=1783257459';
import { addParticle } from './effects.js?v=1783257459';

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
        const body = this.scene.add.sprite(x, y, 'enemy_crawler');
        body.setScale(0.08);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'crawler',
            sprite: body,
            hp: 2,
            vx: -50,
            direction: -1,
            isHit: 0,
            animTime: Math.random() * 10,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                enemy.animTime += dt * 10;
                
                body.body.setVelocityX(enemy.vx);
                
                if (body.body.blocked.left || body.body.blocked.right) {
                    enemy.direction *= -1;
                    enemy.vx = 50 * enemy.direction;
                }
                
                // Procedural Walk Animation (Waddle)
                body.rotation = Math.sin(enemy.animTime) * 0.15;
                body.scaleY = 0.08 + Math.abs(Math.sin(enemy.animTime * 2)) * 0.01;
                body.flipX = enemy.direction === 1;
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.setTint(0xffffff);
                } else {
                    body.clearTint();
                }

                if (enemy.isHit <= 0) this.checkDamage(enemy, body, player, 16, 10, 32, 20);
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-150);
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ff0000', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnSpitter(x, y) {
        const body = this.scene.add.sprite(x, y, 'enemy_spitter');
        body.setScale(0.08);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'spitter',
            sprite: body,
            hp: 3,
            isHit: 0,
            shootTimer: 2.0,
            animTime: Math.random() * 10,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                enemy.animTime += dt * 5;
                
                body.body.setVelocityX(0); // Stands still
                body.flipX = player.x > body.x;
                
                // Idle breathing animation
                body.scaleY = 0.08 + Math.sin(enemy.animTime) * 0.005;
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.setTint(0xffffff);
                } else {
                    body.clearTint();
                }

                // Shoot logic
                enemy.shootTimer -= dt;
                if (enemy.shootTimer <= 0 && Math.abs(player.x - body.x) < 400 && Math.abs(player.y - body.y) < 200) {
                    enemy.shootTimer = 2.0;
                    
                    // Attack animation stretch
                    body.scaleY = 0.06;
                    body.scaleX = 0.1;
                    setTimeout(() => { if(body.active) { body.scaleY = 0.08; body.scaleX = 0.08; } }, 150);
                    
                    const dir = player.x < body.x ? -1 : 1;
                    combatState.activeProjectiles.push({
                        type: 'acid_orb',
                        x: body.x + dir * 20, y: body.y - 10,
                        vx: dir * 400, vy: -200,
                        life: 2.0, color: '#44ff44'
                    });
                }

                if (enemy.isHit <= 0) this.checkDamage(enemy, body, player, 12, 16, 24, 32);
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-150);
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#ffaa00', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnFloater(x, y) {
        const body = this.scene.add.sprite(x, y, 'enemy_floater');
        body.setScale(0.08);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(0);
        
        const enemy = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'floater',
            sprite: body,
            hp: 2,
            isHit: 0,
            animTime: Math.random() * 10,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                enemy.animTime += dt;
                
                let targetVx = 0;
                let targetVy = Math.sin(enemy.animTime * 4) * 30; // Hover bob
                
                const dist = Math.hypot(player.x - body.x, player.y - body.y);
                if (dist < 300) {
                    targetVx = player.x < body.x ? -70 : 70;
                    targetVy += player.y < body.y ? -40 : 40;
                }
                
                body.body.setVelocityX(targetVx);
                body.body.setVelocityY(targetVy);
                body.flipX = targetVx > 0;
                
                // Tilt based on horizontal movement
                body.rotation = targetVx * 0.002;
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.setTint(0xffffff);
                } else {
                    body.clearTint();
                }

                if (enemy.isHit <= 0) this.checkDamage(enemy, body, player, 12, 12, 24, 24);
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                body.body.setVelocityX(knockbackX);
                body.body.setVelocityY(-100);
                for (let i=0; i<10; i++) addParticle(body.x, body.y, (Math.random()-0.5)*200, -100-Math.random()*100, '#cc00ff', 0.5, 'pixel', 8);
                if (enemy.hp <= 0) body.destroy();
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    spawnWarden(x, y) {
        const body = this.scene.add.sprite(x, y, 'boss_warden');
        body.setScale(0.2);
        this.physicsGroup.add(body);
        body.body.setCollideWorldBounds(true);
        body.body.setGravityY(1200);
        body.body.setImmovable(true);
        
        const enemy = {
            id: 'boss_mb01',
            type: 'boss',
            sprite: body,
            hp: 20,
            isHit: 0,
            state: 'idle',
            timer: 0,
            animTime: 0,
            update: (dt, player) => {
                if (enemy.hp <= 0) return;
                enemy.timer -= dt;
                enemy.animTime += dt * 5;
                
                body.flipX = player.x > body.x;
                
                if (enemy.state === 'idle') {
                    body.body.setVelocityX(0);
                    body.scaleY = 0.2 + Math.sin(enemy.animTime) * 0.005; // heavy breathing
                    if (enemy.timer <= 0) {
                        enemy.state = 'charge';
                        enemy.timer = 1.0;
                    }
                } else if (enemy.state === 'charge') {
                    // Wind up stretch
                    body.scaleY = 0.22;
                    body.scaleX = 0.18;
                    body.setTint(0xff0000); // glowing red eyes
                    if (enemy.timer <= 0) {
                        enemy.state = 'attack';
                        enemy.timer = 0.5;
                        const dir = player.x < body.x ? -1 : 1;
                        body.body.setVelocityX(dir * 500);
                        body.scaleY = 0.18;
                        body.scaleX = 0.22;
                        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 8}}));
                    }
                } else if (enemy.state === 'attack') {
                    if (enemy.timer <= 0) {
                        enemy.state = 'idle';
                        enemy.timer = 2.0;
                        body.body.setVelocityX(0);
                        body.scaleY = 0.2;
                        body.scaleX = 0.2;
                    }
                }
                
                if (enemy.isHit > 0) {
                    enemy.isHit -= dt;
                    body.setTint(0xffffff);
                } else if (enemy.state !== 'charge') {
                    body.clearTint();
                }

                if (enemy.isHit <= 0) this.checkDamage(enemy, body, player, 32, 40, 64, 80);
            },
            takeDamage: (amount, knockbackX) => {
                enemy.hp -= amount;
                enemy.isHit = 0.2;
                for (let i=0; i<15; i++) addParticle(body.x, body.y, (Math.random()-0.5)*300, -100-Math.random()*200, '#880000', 0.8, 'pixel', 10);

                if (enemy.hp <= 0) {
                    window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 15}}));
                    for (let i=0; i<50; i++) addParticle(body.x, body.y, (Math.random()-0.5)*500, (Math.random()-0.5)*500, '#ff0000', 1.0, 'tex_star', 15);
                    if (window.DialogueSystem) {
                        window.DialogueSystem.show("Tuyệt vời! Anh đã dọn dẹp được đống rác đó.", 'normal', 5000);
                    }
                    body.destroy();
                }
            }
        };
        this.enemies.push(enemy);
        return enemy;
    }

    checkDamage(enemy, body, player, offsetX, offsetY, width, height) {
        let hitAmount = 0;
        let knockX = 0;
        let bodyRect = { x: body.x - offsetX, y: body.y - offsetY, width, height };
        
        if (combatState.isAttacking && checkAABB(bodyRect, combatState.hitbox)) {
            hitAmount = 1; knockX = player.facingRight ? 150 : -150;
        } else if (combatState.isBioDrilling && checkAABB(bodyRect, player)) {
            hitAmount = 2; knockX = player.facingRight ? 250 : -250;
        } else if (combatState.isGroundSmashing && combatState.smashState === 'fall' && checkAABB(bodyRect, {x: player.x - 40, y: player.y, width: player.width + 80, height: player.height + 40})) {
            hitAmount = 2; knockX = player.x < body.x ? 150 : -150;
        }

        if (hitAmount > 0) {
            enemy.takeDamage(hitAmount, knockX);
        }
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
