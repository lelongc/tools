import { GameScene } from './scenes/GameScene.js?v=14';

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
