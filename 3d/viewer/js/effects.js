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

// Pre-tinted texture cache for zero runtime overhead
const colorsToPreTint = {
    cyan: '#00ffff',
    blue: '#0077ff',
    white: '#ffffff'
};

export const tintedTex = {
    spark: {},
    star: {},
    smoke: {},
    impact: {}
};

const preTintImage = (img, name) => {
    const doTint = () => {
        for (let colKey in colorsToPreTint) {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const tCtx = canvas.getContext('2d');
            
            tCtx.drawImage(img, 0, 0);
            tCtx.globalCompositeOperation = 'source-in';
            tCtx.fillStyle = colorsToPreTint[colKey];
            tCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            tintedTex[name][colKey] = canvas;
        }
    };
    
    if (img.complete && img.naturalWidth > 0) {
        doTint();
    } else {
        img.onload = doTint;
    }
};

// Initialize pre-tinting
preTintImage(particleTex.spark, 'spark');
preTintImage(particleTex.star, 'star');
preTintImage(particleTex.smoke, 'smoke');
preTintImage(particleTex.impact, 'impact');

function drawTintedImage(ctx, name, x, y, width, height, colKey, alpha, angle = 0, sx = 0, sy = 0, sw = null, sh = null) {
    const tintedImg = tintedTex[name] ? (tintedTex[name][colKey || 'cyan'] || tintedTex[name]['cyan'] || tintedTex[name]['white']) : null;
    
    if (tintedImg && tintedImg.width > 0) {
        const sW = sw !== null ? sw : tintedImg.width;
        const sH = sh !== null ? sh : tintedImg.height;
        if (sW > 0 && sH > 0 && width > 0 && height > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(x, y);
            ctx.rotate(angle);
            try {
                ctx.drawImage(tintedImg, sx, sy, sW, sH, -width / 2, -height / 2, width, height);
            } catch(e) {}
            ctx.restore();
            return;
        }
    }
    
    // Procedural Vector Fallback if image asset is not loaded or tainted
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const strokeCol = (colKey === 'white') ? '#ffffff' : ((colKey === 'blue') ? '#0077ff' : '#00ffff');
    
    if (name === 'star' || name === 'spark') {
        // Glowing 4-point Star
        const r = width / 2;
        ctx.fillStyle = strokeCol;
        ctx.shadowColor = strokeCol;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();
        
        // White inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    } else if (name === 'smoke') {
        // Soft Radial Glow Cloud
        const r = width / 2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = strokeCol;
        ctx.globalAlpha = alpha * 0.3;
        ctx.fill();
    } else if (name === 'impact') {
        // Spiked Explosion Burst
        const r = width / 2;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 2;
        ctx.shadowColor = strokeCol;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const len = (i % 2 === 0) ? r : r * 0.4;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
        }
        ctx.stroke();
    }
    ctx.restore();
}

export function addParticle(x, y, vx, vy, color, life, type = 'pixel', size = 3) {
    // Pre-resolve colKey to avoid regex runtime overhead in draw loop!
    let colKey = 'cyan';
    const cLower = color.toLowerCase().replace(/\s/g, ''); // Strip all spaces
    
    if (cLower === '#ffffff' || cLower === 'white' || cLower.includes('255,255,255')) {
        colKey = 'white';
    } else if (
        cLower.includes('255,100') || cLower.includes('255,120') || cLower.includes('255,160') || 
        cLower.includes('255,90') || cLower.includes('orange') || cLower.includes('yellow') || 
        cLower.includes('gold') || cLower.includes('#ff6') || cLower.includes('#ff7') || 
        cLower.includes('#ffd') || cLower.includes('255,215,0') || cLower.includes('255,150') ||
        cLower.includes('255,170') || cLower.includes('255,180') || cLower.includes('red') ||
        cLower.includes('#ff003c') || cLower.includes('255,0,60')
    ) {
        colKey = 'blue';
    }

    particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: color,
        colKey: colKey,
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
            drawTintedImage(ctx, 'spark', drawX, drawY, p.size, p.size, p.colKey, alpha, p.angle);
        } else if (p.type === 'tex_star') {
            drawTintedImage(ctx, 'star', drawX, drawY, p.size, p.size, p.colKey, alpha, p.angle);
        } else if (p.type === 'tex_smoke') {
            const currentSize = p.size * (1 + (1 - alpha) * 1.5);
            drawTintedImage(ctx, 'smoke', drawX, drawY, currentSize, currentSize, p.colKey, alpha * 0.35, p.angle);
        } else if (p.type === 'tex_impact') {
            // Sliced frame of 128x128 impact spritesheet (16 frames)
            const frameIdx = Math.max(0, Math.min(15, Math.floor((1 - alpha) * 15)));
            const frameX = frameIdx * 128;
            drawTintedImage(ctx, 'impact', drawX, drawY, p.size, p.size, p.colKey, alpha, p.angle, frameX, 0, 128, 128);
        } else if (p.type === 'spark') {
            // Stretched motion-blurred electric spark with white core (using fast layered strokes!)
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
            const nx = p.vx / speed;
            const ny = p.vy / speed;
            const len = Math.max(4, speed * 0.05);

            ctx.save();
            ctx.lineCap = 'round';
            
            // Outer glow layer
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha * 0.4;
            ctx.lineWidth = p.size * 2.2;
            ctx.beginPath();
            ctx.moveTo(drawX - nx * len * 0.5, drawY - ny * len * 0.5);
            ctx.lineTo(drawX + nx * len * 0.5, drawY + ny * len * 0.5);
            ctx.stroke();

            // Core glow layer
            ctx.globalAlpha = alpha;
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(drawX - nx * len * 0.5, drawY - ny * len * 0.5);
            ctx.lineTo(drawX + nx * len * 0.5, drawY + ny * len * 0.5);
            ctx.stroke();

            // Inner white highlight
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = p.size * 0.45;
            ctx.beginPath();
            ctx.moveTo(drawX - nx * len * 0.5, drawY - ny * len * 0.5);
            ctx.lineTo(drawX + nx * len * 0.5, drawY + ny * len * 0.5);
            ctx.stroke();
            ctx.restore();

        } else if (p.type === 'ring') {
            const curSize = p.size * (1 + (1 - alpha) * 4);
            ctx.save();
            // Outer glow layer
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha * 0.35;
            ctx.lineWidth = 4 * alpha;
            ctx.beginPath();
            ctx.arc(drawX, drawY, curSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner core layer
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.5 * alpha;
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
