import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ GameScene ]
};

// Start the Phaser Game instance
const game = new Phaser.Game(config);
