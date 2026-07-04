export const keys = {
    left: false, right: false, up: false, down: false,
    jump: false, dash: false,
    skill1: false, skill2: false, skill3: false, skill4: false,
    heal: false,
    jumpPressed: false, dashPressed: false,
    skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false,
    healPressed: false
};

export const lastPressedTime = {
    skill1: 0,
    skill2: 0,
    skill3: 0,
    skill4: 0,
    jump: 0,
    dash: 0,
    heal: 0
};

export function isBuffered(action, bufferMs = 250) {
    return (Date.now() - (lastPressedTime[action] || 0)) <= bufferMs;
}

export function consumeBuffer(action) {
    lastPressedTime[action] = 0;
}

const keyState = {};

window.addEventListener('keydown', (e) => {
    // Only capture keys if target is body or canvas (not input boxes)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    const now = Date.now();
    
    if (!keyState[key]) {
        if (key === ' ') { keys.jumpPressed = true; lastPressedTime.jump = now; }
        if (key === 'u') { keys.dashPressed = true; lastPressedTime.dash = now; }
        if (key === 'j') { keys.skill1Pressed = true; lastPressedTime.skill1 = now; }
        if (key === 'k') { keys.skill2Pressed = true; lastPressedTime.skill2 = now; }
        if (key === 'l') { keys.skill3Pressed = true; lastPressedTime.skill3 = now; }
        if (key === 'i') { keys.skill4Pressed = true; lastPressedTime.skill4 = now; }
        if (key === 'q') { keys.healPressed = true; lastPressedTime.heal = now; }
        
        // Tab for Lore Menu
        if (key === 'tab') {
            e.preventDefault();
            if (window.LoreSystem) window.LoreSystem.toggleMenu();
        }
    }
    keyState[key] = true;

    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === 'arrowup' || key === 'w') keys.up = true;
    if (key === 'arrowdown' || key === 's') keys.down = true;
    
    if (key === ' ') keys.jump = true;
    if (key === 'u') keys.dash = true;
    if (key === 'j') keys.skill1 = true;
    if (key === 'k') keys.skill2 = true;
    if (key === 'l') keys.skill3 = true;
    if (key === 'i') keys.skill4 = true;
    if (key === 'q') keys.heal = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keyState[key] = false;

    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
    if (key === 'arrowup' || key === 'w') keys.up = false;
    if (key === 'arrowdown' || key === 's') keys.down = false;
    
    if (key === ' ') keys.jump = false;
    if (key === 'u') keys.dash = false;
    if (key === 'j') keys.skill1 = false;
    if (key === 'k') keys.skill2 = false;
    if (key === 'l') keys.skill3 = false;
    if (key === 'i') keys.skill4 = false;
    if (key === 'q') keys.heal = false;
});

export function resetInputPresses() {
    keys.jumpPressed = false;
    keys.dashPressed = false;
    keys.skill1Pressed = false;
    keys.skill2Pressed = false;
    keys.skill3Pressed = false;
    keys.skill4Pressed = false;
    keys.healPressed = false;
}
