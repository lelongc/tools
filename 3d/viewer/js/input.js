export const keys = {
    left: false, right: false, up: false, down: false,
    jump: false, dash: false,
    skill1: false, skill2: false, skill3: false, skill4: false,
    // For single-press actions
    jumpPressed: false, dashPressed: false,
    skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false
};

const keyState = {};

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (!keyState[key]) {
        if (key === ' ') keys.jumpPressed = true; // Space only for jump
        if (key === 'u') keys.dashPressed = true;
        if (key === 'j') keys.skill1Pressed = true;
        if (key === 'k') keys.skill2Pressed = true;
        if (key === 'l') keys.skill3Pressed = true;
        if (key === 'i') keys.skill4Pressed = true;
    }
    keyState[key] = true;

    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === 'arrowup' || key === 'w') keys.up = true; // W is up (hover)
    if (key === 'arrowdown' || key === 's') keys.down = true;
    
    if (key === ' ') keys.jump = true;
    if (key === 'u') keys.dash = true;
    if (key === 'j') keys.skill1 = true;
    if (key === 'k') keys.skill2 = true;
    if (key === 'l') keys.skill3 = true;
    if (key === 'i') keys.skill4 = true;
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
});

export function resetInputPresses() {
    keys.jumpPressed = false;
    keys.dashPressed = false;
    keys.skill1Pressed = false;
    keys.skill2Pressed = false;
    keys.skill3Pressed = false;
    keys.skill4Pressed = false;
}
