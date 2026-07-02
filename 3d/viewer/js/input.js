export const keys = {
    left: false, right: false, up: false, down: false,
    jump: false, attack: false, dash: false,
    skill1: false, skill2: false, skill3: false,
    // For single-press actions
    jumpPressed: false, attackPressed: false, dashPressed: false,
    skill1Pressed: false, skill2Pressed: false, skill3Pressed: false
};

const keyState = {};

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (!keyState[key]) {
        if (key === 'w' || key === ' ') keys.jumpPressed = true; // W or Space
        if (key === 'i') keys.attackPressed = true;
        if (key === 'u') keys.dashPressed = true;
        if (key === 'j') keys.skill1Pressed = true;
        if (key === 'k') keys.skill2Pressed = true;
        if (key === 'l') keys.skill3Pressed = true;
    }
    keyState[key] = true;

    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === 'arrowup') keys.up = true;
    if (key === 'arrowdown' || key === 's') keys.down = true;
    
    if (key === 'w' || key === ' ') keys.jump = true;
    if (key === 'i') keys.attack = true;
    if (key === 'u') keys.dash = true;
    if (key === 'j') keys.skill1 = true;
    if (key === 'k') keys.skill2 = true;
    if (key === 'l') keys.skill3 = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keyState[key] = false;

    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
    if (key === 'arrowup') keys.up = false;
    if (key === 'arrowdown' || key === 's') keys.down = false;
    
    if (key === 'w' || key === ' ') keys.jump = false;
    if (key === 'i') keys.attack = false;
    if (key === 'u') keys.dash = false;
    if (key === 'j') keys.skill1 = false;
    if (key === 'k') keys.skill2 = false;
    if (key === 'l') keys.skill3 = false;
});

export function resetInputPresses() {
    keys.jumpPressed = false;
    keys.attackPressed = false;
    keys.dashPressed = false;
    keys.skill1Pressed = false;
    keys.skill2Pressed = false;
    keys.skill3Pressed = false;
}
