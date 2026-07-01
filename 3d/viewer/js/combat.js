import { keys } from './input.js';
import { addParticle } from './effects.js';

export const combatState = {
    isAttacking: false,
    attackTime: 0,
    attackDuration: 0.15,
    attackCooldown: 0,
    hitbox: { x: 0, y: 0, width: 30, height: 40 }
};

export function updateCombat(player, dt) {
    if (combatState.attackCooldown > 0) {
        combatState.attackCooldown -= dt;
    }

    if (keys.attackPressed && combatState.attackCooldown <= 0 && !combatState.isAttacking) {
        combatState.isAttacking = true;
        combatState.attackTime = combatState.attackDuration;
        combatState.attackCooldown = 0.4;
        
        // Pushback on attack (game feel)
        player.vx += player.facingRight ? -50 : 50;
    }

    if (combatState.isAttacking) {
        combatState.attackTime -= dt;
        
        // Position Hitbox
        combatState.hitbox.y = player.y - 5;
        if (player.facingRight) {
            combatState.hitbox.x = player.x + player.width;
        } else {
            combatState.hitbox.x = player.x - combatState.hitbox.width;
        }

        // Spawn attack trail particles
        addParticle(
            combatState.hitbox.x + Math.random() * combatState.hitbox.width,
            combatState.hitbox.y + Math.random() * combatState.hitbox.height,
            player.facingRight ? 200 : -200,
            (Math.random() - 0.5) * 100,
            '#fff',
            0.1
        );

        if (combatState.attackTime <= 0) {
            combatState.isAttacking = false;
        }
    }
}

export function drawCombat(ctx, camera) {
    if (combatState.isAttacking) {
        const drawX = combatState.hitbox.x - camera.x;
        const drawY = combatState.hitbox.y - camera.y;

        // Draw slash effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(drawX, drawY, combatState.hitbox.width, combatState.hitbox.height);
    }
}
