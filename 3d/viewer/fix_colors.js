const fs = require('fs');
const path = require('path');

const playerFile = path.join(__dirname, 'js', 'player.js');
let content = fs.readFileSync(playerFile, 'utf8');

// 1. Add getPlayerColorRgba at the top
if (!content.includes('getPlayerColorRgba')) {
    content = content.replace(
        "export const player = {",
        "export function getPlayerColorRgba(alpha) { return player.form === 'cyber' ? `rgba(0, 255, 255, ${alpha})` : `rgba(68, 255, 68, ${alpha})`; }\n\nexport const player = {"
    );
}

// 2. Replace hardcoded '#00ffff' with player.color
content = content.replace(/'#00ffff'/g, 'player.color');

// 3. Replace 'rgba(0, 255, 255, 0.x)' strings
content = content.replace(/'rgba\(0, 255, 255, ([\d.]+)\)'/g, 'getPlayerColorRgba($1)');

// 4. Replace template literals `rgba(0, 255, 255, ${expr})`
content = content.replace(/`rgba\(0, 255, 255, \$\{([^}]+)\}\)`/g, 'getPlayerColorRgba($1)');

fs.writeFileSync(playerFile, content, 'utf8');
console.log('player.js updated');

// Also do it for combat.js
const combatFile = path.join(__dirname, 'js', 'combat.js');
let combatContent = fs.readFileSync(combatFile, 'utf8');

// combat.js needs getPlayerColorRgba imported if it uses it.
// Let's check if we need to import it.
if (!combatContent.includes('getPlayerColorRgba')) {
    combatContent = combatContent.replace(
        "import { player, drawPlayer",
        "import { player, drawPlayer, getPlayerColorRgba"
    );
    // In case the import format is different:
    combatContent = combatContent.replace(
        "import { player } from './player.js';",
        "import { player, getPlayerColorRgba } from './player.js';"
    );
}

combatContent = combatContent.replace(/'#00ffff'/g, 'player.color');
combatContent = combatContent.replace(/'rgba\(0, 255, 255, ([\d.]+)\)'/g, 'getPlayerColorRgba($1)');
combatContent = combatContent.replace(/`rgba\(0, 255, 255, \$\{([^}]+)\}\)`/g, 'getPlayerColorRgba($1)');

fs.writeFileSync(combatFile, combatContent, 'utf8');
console.log('combat.js updated');
