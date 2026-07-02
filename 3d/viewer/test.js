// Mock Canvas Context
const ctx = {
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    beginPath: () => {},
    moveTo: (x, y) => { if (isNaN(x) || isNaN(y)) throw new Error("NaN in moveTo"); },
    lineTo: (x, y) => { if (isNaN(x) || isNaN(y)) throw new Error("NaN in lineTo"); },
    stroke: () => {},
    fill: () => {},
    fillRect: () => {},
    scale: () => {},
    closePath: () => {},
    arc: (x, y, r, sa, ea) => { 
        if (isNaN(x) || isNaN(y) || isNaN(r)) throw new Error("NaN in arc"); 
        if (r < 0) throw new Error("Negative radius in arc: " + r);
    },
    setLineDash: () => {},
    drawImage: () => {}
};

// Mock DOM
global.window = {
    dispatchEvent: () => {},
    addEventListener: () => {}
};
global.CustomEvent = class CustomEvent {};
global.Image = class Image { constructor() { this.complete = true; this.naturalWidth = 100; } };
global.document = { createElement: () => ({ getContext: () => ctx }) };

async function runTest() {
    const { player, updatePlayer, drawPlayer } = await import('./js/player.js');
    const { combatState, updateCombat } = await import('./js/combat.js');
    
    // Set state to Bio Drilling
    combatState.isDashStriking = false;
    combatState.isAttacking = false;
    combatState.isCharging = false;
    combatState.isReleasingBeam = false;
    combatState.isBioDrilling = true;
    combatState.bioDrillTime = 0.35;
    player.animTime = 0.5;

    console.log("Testing update loop...");
    try {
        updateCombat(player, 0.016);
        updatePlayer(0.016, () => {});
        drawPlayer(ctx, {x:0, y:0});
        console.log("Success! No errors thrown.");
    } catch (e) {
        console.error("Caught error in loop:", e.message);
        console.error(e.stack);
    }
}
runTest();
