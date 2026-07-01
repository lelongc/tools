export const keys = {
    left: false, right: false, up: false, down: false,
    jump: false, attack: false, dash: false,
    // For single-press actions
    jumpPressed: false, attackPressed: false, dashPressed: false
};

const keyState = {};

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (!keyState[key]) {
        if (key === 'z') keys.jumpPressed = true;
        if (key === 'x') keys.attackPressed = true;
        if (key === 'c') keys.dashPressed = true;
    }
    keyState[key] = true;

    if (key === 'arrowleft' || key === 'a') keys.left = true;
    if (key === 'arrowright' || key === 'd') keys.right = true;
    if (key === 'arrowup' || key === 'w') keys.up = true;
    if (key === 'arrowdown' || key === 's') keys.down = true;
    
    if (key === 'z') keys.jump = true;
    if (key === 'x') keys.attack = true;
    if (key === 'c') keys.dash = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keyState[key] = false;

    if (key === 'arrowleft' || key === 'a') keys.left = false;
    if (key === 'arrowright' || key === 'd') keys.right = false;
    if (key === 'arrowup' || key === 'w') keys.up = false;
    if (key === 'arrowdown' || key === 's') keys.down = false;
    
    if (key === 'z') keys.jump = false;
    if (key === 'x') keys.attack = false;
    if (key === 'c') keys.dash = false;
});

export function resetInputPresses() {
    keys.jumpPressed = false;
    keys.attackPressed = false;
    keys.dashPressed = false;
}
