export const particles = [];

export function addParticle(x, y, vx, vy, color, life) {
    particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: color,
        life: life,
        maxLife: life
    });
}

export function updateAndDrawParticles(ctx, camera, dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        
        // Add some friction/gravity to particles depending on what they are
        p.vx *= 0.9;
        p.vy += 300 * dt; // Gravity

        const drawX = p.x - camera.x;
        const drawY = p.y - camera.y;

        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(drawX, drawY, 2, 2);
        ctx.globalAlpha = 1.0;
    }
}
