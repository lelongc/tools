const fs = require('fs');
let c = fs.readFileSync('js/player.js', 'utf8');
c = c.replace(/addParticle\(([^,]+),\s*([^,]+),\s*'spark'\)/g, "addParticle($1, $2, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#00ffff', 0.4, 'tex_spark', 15)");
c = c.replace(/addParticle\(([^,]+),\s*([^,]+),\s*'smoke'\)/g, "addParticle($1, $2, (Math.random()-0.5)*50, (Math.random()-0.5)*50 - 50, 'rgba(200,200,200,0.5)', 0.6, 'tex_smoke', 20)");
fs.writeFileSync('js/player.js', c);
console.log("Replaced incorrectly formatted addParticle calls.");
