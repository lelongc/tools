export const particles = [];

export const particleTex = {
    spark: new Image(),
    star: new Image(),
    smoke: new Image(),
    impact: new Image()
};
particleTex.spark.src = 'assets/spark_03.png';
particleTex.star.src = 'assets/star_05.png';
particleTex.smoke.src = 'assets/smoke_04.png';
particleTex.impact.src = 'assets/impact_ice_128.png';

// Offscreen tint canvas for rendering colored particles
const tintCanvas = document.createElement('canvas');
const tintCtx = tintCanvas.getContext('2d');

function drawTintedImage(ctx, img, x, y, width, height, color, alpha, angle = 0, sx = 0, sy = 0, sw = null, sh = null) {
    if (!img.complete || img.naturalWidth <= 0) return;
    
    const sW = sw !== null ? sw : img.naturalWidth;
    const sH = sh !== null ? sh : img.naturalHeight;
    
    if (sW <= 0 || sH <= 0 || width <= 0 || height <= 0) return; // Prevent InvalidStateError
    
    if (tintCanvas.width !== sW || tintCanvas.height !== sH) {
        tintCanvas.width = sW;
        tintCanvas.height = sH;
    }
    
    tintCtx.clearRect(0, 0, tintCanvas.width, tintCanvas.height);
    try {
        tintCtx.drawImage(img, sx, sy, sW, sH, 0, 0, sW, sH);
    } catch(e) {
        return; // Catch out of bounds drawing errors
    }
    
    tintCtx.save();
    tintCtx.globalCompositeOperation = 'source-in';
    tintCtx.fillStyle = color;
    tintCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
    tintCtx.restore();
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(tintCanvas, -width / 2, -height / 2, width, height);
    ctx.restore();
}

export function addParticle(x, y, vx, vy, color, life, type = 'pixel', size = 3) {
    particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: color,
        life: life,
        maxLife: life,
        type: type,
        size: size,
        angle: Math.random() * Math.PI * 2
    });
}

export function updateAndDrawParticles(ctx, camera, dt) {
    ctx.save();
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        
        // Physics based on particle type
        if (p.type === 'spark') {
            p.vx *= 0.88;
            p.vy *= 0.88; // Air resistance
        } else if (p.type === 'tex_spark' || p.type === 'tex_star') {
            p.vx *= 0.85;
            p.vy *= 0.85; // Heavy drag for sparks
            p.angle += (p.vx + p.vy) * 0.003;
        } else if (p.type === 'tex_smoke') {
            p.vx *= 0.92;
            p.vy -= 60 * dt; // Rise slightly
            p.angle += 0.3 * dt;
        } else if (p.type === 'tex_impact') {
            p.vx = 0; // Stationary explosion
            p.vy = 0;
        } else if (p.type === 'ring') {
            p.vx *= 0.95;
            p.vy *= 0.95;
        } else {
            p.vx *= 0.9;
            p.vy += 250 * dt; // Gravity for normal dust
        }

        const drawX = p.x - camera.x;
        const drawY = p.y - camera.y;
        const alpha = p.life / p.maxLife;

        ctx.globalAlpha = Math.max(0, Math.min(1.0, alpha));

        // Custom renderings
        if (p.type === 'tex_spark') {
            drawTintedImage(ctx, particleTex.spark, drawX, drawY, p.size, p.size, p.color, alpha, p.angle);
        } else if (p.type === 'tex_star') {
            drawTintedImage(ctx, particleTex.star, drawX, drawY, p.size, p.size, p.color, alpha, p.angle);
        } else if (p.type === 'tex_smoke') {
            const currentSize = p.size * (1 + (1 - alpha) * 1.5);
            drawTintedImage(ctx, particleTex.smoke, drawX, drawY, currentSize, currentSize, p.color, alpha * 0.35, p.angle);
        } else if (p.type === 'tex_impact') {
            // Sliced frame of 128x128 impact spritesheet (16 frames)
            const frameIdx = Math.max(0, Math.min(15, Math.floor((1 - alpha) * 15)));
            const frameX = frameIdx * 128;
            drawTintedImage(ctx, particleTex.impact, drawX, drawY, p.size, p.size, p.color, alpha, p.angle, frameX, 0, 128, 128);
        } else if (p.type === 'spark') {
            // Stretched motion-blurred electric spark with white core
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
            const nx = p.vx / speed;
            const ny = p.vy / speed;
            const len = Math.max(4, speed * 0.05);

            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(drawX - nx * len * 0.5, drawY - ny * len * 0.5);
            ctx.lineTo(drawX + nx * len * 0.5, drawY + ny * len * 0.5);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = p.size * 0.4;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(drawX - nx * len * 0.5, drawY - ny * len * 0.5);
            ctx.lineTo(drawX + nx * len * 0.5, drawY + ny * len * 0.5);
            ctx.stroke();
            ctx.restore();

        } else if (p.type === 'ring') {
            const curSize = p.size * (1 + (1 - alpha) * 4);
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2 * alpha;
            ctx.beginPath();
            ctx.arc(drawX, drawY, curSize, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

        } else if (p.type === 'glow') {
            ctx.save();
            const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, p.color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(drawX - p.size/2, drawY - p.size/2, p.size, p.size);
        }
    }
    ctx.restore();
}
