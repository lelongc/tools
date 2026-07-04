import { map, TILE_SIZE, drawWorld, getTileType, updateUnstableBlocks, triggerUnstable, getZone, ZONE_COLORS } from '../world.js?v=19';
import { player, updatePlayer, drawPlayer } from '../player.js?v=19';
import { combatState, updateCombat, drawCombat } from '../combat.js?v=19';
import { updateAndDrawParticles, addParticle } from '../effects.js?v=19';
import { keys, resetInputPresses } from '../input.js?v=19';
import { updateHUD } from '../ui.js?v=19';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets for physics collision bounds and sprites
        this.load.image('tileset', 'assets/tileset_pro.png');
    }

    create() {
        // Create Physics groups for platform blocks
        this.platforms = this.physics.add.staticGroup();
        this.bouncePads = this.physics.add.staticGroup();
        this.iceBlocks = this.physics.add.staticGroup();
        this.acidPools = this.physics.add.staticGroup();
        this.unstableGroup = this.physics.add.staticGroup();

        // Populate physics world from map array for collisions
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const tile = map[row][col];
                const x = col * TILE_SIZE + TILE_SIZE / 2;
                const y = row * TILE_SIZE + TILE_SIZE / 2;

                if (tile === 1) {
                    const block = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0); 
                    this.platforms.add(block);
                } else if (tile === 2) {
                    const pad = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0);
                    this.bouncePads.add(pad);
                } else if (tile === 3) {
                    const ice = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0);
                    this.iceBlocks.add(ice);
                    this.platforms.add(ice); // Ice is solid
                } else if (tile === 4) {
                    const acid = this.add.rectangle(x, y + TILE_SIZE/4, TILE_SIZE, TILE_SIZE/2, 0x000000, 0);
                    this.acidPools.add(acid);
                } else if (tile === 5) {
                    const slime = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0);
                    this.platforms.add(slime); // Slime is solid
                } else if (tile === 6) {
                    const block = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0); 
                    block.col = col; block.row = row; // store map coordinates
                    this.unstableGroup.add(block);
                    this.platforms.add(block); // Unstable is initially solid
                }
            }
        }

        // Initialize Keyboard inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

        // Player physics body configuration
        this.playerBody = this.physics.add.sprite(player.x + player.width/2, player.y + player.height/2, null);
        this.playerBody.setSize(player.width, player.height);
        this.playerBody.setCollideWorldBounds(true);
        this.playerBody.body.setGravityY(1200);

        // Debug Text
        this.debugText = this.add.text(10, 10, 'Debug:', { font: '16px Courier', fill: '#00ffcc', backgroundColor: '#000000' }).setScrollFactor(0);
        this.debugText.setDepth(100);

        // Add colliders
        this.physics.add.collider(this.playerBody, this.platforms, this.handlePlatformHit, null, this);
        this.physics.add.overlap(this.playerBody, this.bouncePads, this.handleBouncePad, null, this);
        this.physics.add.overlap(this.playerBody, this.acidPools, this.handleAcidPool, null, this);

        // Create Canvas Texture for drawing legacy Canvas 2D graphics
        this.canvasTexture = this.textures.createCanvas('proGameCanvas', 640, 480);
        this.canvasCtx = this.canvasTexture.context;
        
        // Add the canvas image to center of screen (320, 240) and set it to follow camera
        this.canvasImage = this.add.image(320, 240, 'proGameCanvas');
        this.canvasImage.setScrollFactor(0); // Lock it to screen

        // Camera and Physics configurations
        const mapPixelWidth = map[0].length * TILE_SIZE;
        const mapPixelHeight = map.length * TILE_SIZE;
        this.physics.world.setBounds(0, 0, mapPixelWidth, mapPixelHeight); // IMPORTANT: Lock physics to map size!
        this.cameras.main.setBounds(0, 0, mapPixelWidth, mapPixelHeight);
        this.cameras.main.startFollow(this.playerBody, true, 0.15, 0.15);

        // Camera Shake Listener
        window.addEventListener('cameraShake', (e) => {
            const intensity = e.detail.intensity || 5;
            this.cameras.main.shake(150, intensity * 0.0018);
        });

        // Expose camera and scene references for drawing loops
        this.fakeCamera = { x: 0, y: 0, width: 640, height: 480, player: player };
    }
    
    handlePlatformHit(playerObj, platformObj) {
        if (platformObj.row !== undefined && platformObj.col !== undefined && playerObj.body.touching.down && platformObj.body.touching.up) {
            triggerUnstable(platformObj.row, platformObj.col);
        }
    }
    
    handleAcidPool(playerObj, acidObj) {
        if (combatState.hp > 0 && !combatState.isDashing) {
            // Take damage and knockback
            combatState.hp -= 5;
            this.playerBody.body.setVelocityY(-400); // knockback up
            this.cameras.main.shake(100, 0.01);
            
            for (let i = 0; i < 5; i++) {
                addParticle(player.x + Math.random() * player.width, player.y + player.height, (Math.random() - 0.5) * 100, -Math.random() * 200, '#44ff44', 0.5, 'pixel', 6);
            }
        }
    }

    handleBouncePad(playerObj, padObj) {
        if (this.playerBody.body.velocity.y > 0) {
            this.playerBody.body.setVelocityY(-1000);
            player.scaleX = 0.4;
            player.scaleY = 1.8;
            this.cameras.main.shake(150, 0.02);
            
            // Spawn bounce pad spark particles
            for (let i = 0; i < 8; i++) {
                addParticle(padObj.x, padObj.y - 10, (Math.random() - 0.5) * 150, -Math.random() * 60, 'rgba(100, 255, 100, 0.8)', 0.4);
            }
        }
    }

    update(time, delta) {
        // Clamp delta to prevent huge jumps
        const dt = Math.min(delta / 1000, 0.1);

        // Update fake camera coordinates to match Phaser camera scroll
        this.fakeCamera.x = this.cameras.main.scrollX;
        this.fakeCamera.y = this.cameras.main.scrollY;

        // Sync physics coordinates to legacy player
        player.x = this.playerBody.x - player.width / 2;
        player.y = this.playerBody.y - player.height / 2;
        player.vx = this.playerBody.body.velocity.x;
        player.vy = this.playerBody.body.velocity.y;
        player.isGrounded = this.playerBody.body.blocked.down;
        player.blockedLeft = this.playerBody.body.blocked.left;
        player.blockedRight = this.playerBody.body.blocked.right;

        try {
            // Run updates
            updateUnstableBlocks(dt);
            
            // Re-sync platforms group to remove 'gone' unstable blocks
            this.unstableGroup.getChildren().forEach(block => {
                const mapTile = map[block.row][block.col];
                if (mapTile === 0) {
                    block.body.enable = false; // Disable collision when gone
                } else if (mapTile === 6) {
                    block.body.enable = true;  // Re-enable when respawned
                }
            });
            
            updatePlayer(dt, addParticle);
            updateCombat(player, dt);
            updateHUD(player);
        } catch(e) {
            this.debugText.setText("UPDATE ERROR: " + e.message + "\n" + e.stack.substring(0, 200));
            console.error("UPDATE ERROR: " + e.message);
            window.dispatchEvent(new CustomEvent('showError', { detail: "UPDATE ERROR: " + e.message + "\n" + e.stack }));
        }

        // Sync legacy player velocities back to physics
        this.playerBody.body.velocity.x = player.vx;
        this.playerBody.body.velocity.y = player.vy;

        resetInputPresses();

        if (player.isHovering) {
            this.playerBody.body.setGravityY(0);
            this.playerBody.body.velocity.y = 0;
        } else {
            this.playerBody.body.setGravityY(1200);
        }

        // Draw everything to our Canvas Texture context
        this.canvasCtx.fillStyle = '#050510';
        this.canvasCtx.fillRect(0, 0, 640, 480);

        try {
            // 1. Draw Grid and far parallax backgrounds
            this.drawParallaxGrid(this.canvasCtx);

            // 2. Draw map tiles
            drawWorld(this.canvasCtx, this.fakeCamera);

            // 3. Draw particles
            updateAndDrawParticles(this.canvasCtx, this.fakeCamera, dt);

            // 4. Draw character
            drawPlayer(this.canvasCtx, this.fakeCamera);

            // 5. Draw combat overlays
            drawCombat(this.canvasCtx, this.fakeCamera, player);
        } catch(e) {
            this.debugText.setText("ERROR: " + e.message + "\n" + e.stack.substring(0, 200));
            window.dispatchEvent(new CustomEvent('showError', { detail: "DRAW ERROR: " + e.message + "\n" + e.stack }));
        }

        // Upload drawing to GPU WebGL texture
        this.canvasTexture.refresh();

        resetInputPresses();
    }

    drawParallaxGrid(ctx) {
        ctx.save();
        
        const zoneIdx = getZone(Math.floor((player.x + player.width/2) / TILE_SIZE));
        const colors = ZONE_COLORS[zoneIdx];
        
        // Background base color
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, 640, 480);
        
        ctx.strokeStyle = colors.primary;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;
        
        const gridSize = 64;
        const offsetX = -(this.fakeCamera.x * 0.2) % gridSize;
        const offsetY = -(this.fakeCamera.y * 0.2) % gridSize;
        
        ctx.beginPath();
        for (let x = offsetX - gridSize; x < 640 + gridSize; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 480);
        }
        for (let y = offsetY - gridSize; y < 480 + gridSize; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(640, y);
        }
        ctx.stroke();

        // Far parallax based on zone
        const now = Date.now();
        ctx.globalAlpha = 0.1;
        
        if (zoneIdx === 0) { // Cyber Lab
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                const floatX = ((i * 300 - this.fakeCamera.x * 0.05) % 840 + 840) % 840 - 100;
                const floatY = 240 + Math.sin(now / 2000 + i) * 100 - this.fakeCamera.y * 0.05;
                ctx.save();
                ctx.translate(floatX, floatY);
                ctx.rotate(now / 5000 + i);
                ctx.beginPath();
                ctx.moveTo(-50, -50);
                ctx.lineTo(50, -50);
                ctx.lineTo(0, 50);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
        } else if (zoneIdx === 1) { // Toxic Depths
            ctx.fillStyle = colors.primary;
            for (let i = 0; i < 15; i++) {
                const floatX = ((i * 100 - this.fakeCamera.x * 0.08) % 840 + 840) % 840 - 100;
                const floatY = ((480 + 200 - (now / 20 + i * 50) % 680) % 680) - this.fakeCamera.y * 0.08;
                ctx.beginPath();
                ctx.arc(floatX, floatY, 2 + (i % 4), 0, Math.PI*2);
                ctx.fill();
            }
        } else if (zoneIdx === 2) { // Void Core
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const floatX = ((i * 200 - this.fakeCamera.x * 0.06) % 840 + 840) % 840 - 100;
                const floatY = 240 + Math.cos(now / 1500 + i) * 150 - this.fakeCamera.y * 0.06;
                ctx.save();
                ctx.translate(floatX, floatY);
                ctx.rotate(now / 2000 - i);
                ctx.beginPath();
                ctx.moveTo(-30, 0);
                ctx.lineTo(30, 0);
                ctx.moveTo(0, -30);
                ctx.lineTo(0, 30);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        ctx.restore();
    }
}
