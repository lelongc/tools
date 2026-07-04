import { GameScene } from './scenes/GameScene.js';
import { LoreSystem } from './lore.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            fps: 240 // Sub-stepping to prevent high-speed tunneling
        }
    },
    scene: [ GameScene ]
};

// Start the Phaser Game instance
const game = new Phaser.Game(config);

// ACT 1: Room 1-1 Dialogue
setTimeout(() => {
    if (window.DialogueSystem) {
        window.DialogueSystem.show("...Anh ơi? Anh nghe em nói không? Đừng sợ. Hệ thống thần kinh đang khởi động lại... Cử động thử đi anh.", 'normal', 4000);
        window.DialogueSystem.show("Tốt lắm. Cơ thể mới đang phản hồi tốt. Anh thật tuyệt vời.", 'normal', 3000);
    }
}, 2000);
