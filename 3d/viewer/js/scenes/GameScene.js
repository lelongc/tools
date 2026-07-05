import { map, TILE_SIZE, drawWorld, getTileType, updateUnstableBlocks, triggerUnstable, getZone, ZONE_COLORS, loadRoom, currentRoomId } from '../world.js?v=1783257459';
import { rooms } from '../rooms.js?v=1783257459';
import { player, updatePlayer, drawPlayer } from '../player.js?v=1783257459';
import { combatState, updateCombat, drawCombat } from '../combat.js?v=1783257459';
import { updateAndDrawParticles, addParticle } from '../effects.js?v=1783257459';
import { keys, resetInputPresses } from '../input.js?v=1783257459';
import { updateHUD } from '../ui.js?v=1783257459';
import { EnemyManager } from '../enemies.js?v=1783257459';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        window.hitStopTime = 0;
        window.triggerHitStop = (duration) => {
            window.hitStopTime = duration;
        };
    }

    preload() {
        this.load.image('tileset', 'assets/tileset_pro.png');
        this.load.image('prop_save_terminal', 'assets/prop_save_terminal.png');
        this.load.image('prop_memory_fragment', 'assets/prop_memory_fragment.png');
        this.load.image('lily_toy', 'assets/lily_toy.png');
        
        // Enemies
        this.load.image('enemy_crawler', 'assets/enemy_crawler.png');
        this.load.image('enemy_spitter', 'assets/enemy_spitter.png');
        this.load.image('enemy_floater', 'assets/enemy_floater.png');
        this.load.image('enemy_charger', 'assets/enemy_charger.png');
        this.load.image('enemy_vine', 'assets/enemy_vine.png');
        this.load.image('enemy_cyborg', 'assets/enemy_cyborg.png');
        
        // Bosses
        this.load.image('boss_warden', 'assets/boss_warden.png');
        this.load.image('boss_mother_vine', 'assets/boss_mother_vine.png');
        this.load.image('boss_archive_keeper', 'assets/boss_archive_keeper.png');
        this.load.image('boss_eleanor_biomech', 'assets/boss_eleanor_biomech.png');
        this.load.image('boss_eleanor_hologram', 'assets/el_avatar_normal.png');
    }

    create() {
        // Init Input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Canvas Texture for legacy procedural rendering
        this.canvasTexture = this.textures.createCanvas('proGameCanvas', 640, 480);
        this.canvasCtx = this.canvasTexture.context;
        this.canvasImage = this.add.image(320, 240, 'proGameCanvas');
        this.canvasImage.setScrollFactor(0);

        this.bgRect = this.add.rectangle(320, 240, 640, 480, 0x000000);
        this.bgRect.setScrollFactor(0);
        this.bgRect.setDepth(-10);

        const gridCanvas = this.textures.createCanvas('gridTexture', 64, 64);
        const gCtx = gridCanvas.context;
        gCtx.strokeStyle = '#ffffff';
        gCtx.lineWidth = 1;
        gCtx.beginPath();
        gCtx.moveTo(0, 0); gCtx.lineTo(64, 0);
        gCtx.moveTo(0, 0); gCtx.lineTo(0, 64);
        gCtx.stroke();
        gridCanvas.refresh();
        
        this.gridSprite = this.add.tileSprite(320, 240, 640, 480, 'gridTexture');
        this.gridSprite.setScrollFactor(0);
        this.gridSprite.setDepth(-9);
        this.gridSprite.setAlpha(0.15);

        // Failsafe: Reset player position on new scene creation to avoid out-of-bounds spawn from old cache
        player.x = 100;
        player.y = 400;

        // Player physics body
        this.playerBody = this.physics.add.sprite(player.x + player.width/2, player.y + player.height/2, null);
        this.playerBody.setVisible(false); // Hide the default green box
        this.playerBody.setSize(player.width, player.height);
        this.playerBody.body.setGravityY(1200);

        this.fakeCamera = { x: 0, y: 0, width: 640, height: 480, player: player };

        window.addEventListener('cameraShake', (e) => {
            const intensity = e.detail.intensity || 5;
            this.cameras.main.shake(150, intensity * 0.0018);
        });

        // Dialogue trackers
        this.idleTimer = 0;
        this.firedDialogues = {};

        // Initialize First Room
        if (!currentRoomId) loadRoom('1-1');
        
        this.buildRoom(currentRoomId);
    }

    buildRoom(roomId) {
        // Clear previous physics objects
        if (this.platforms) this.platforms.clear(true, true);
        if (this.bouncePads) this.bouncePads.clear(true, true);
        if (this.iceBlocks) this.iceBlocks.clear(true, true);
        if (this.acidPools) this.acidPools.clear(true, true);
        if (this.unstableGroup) this.unstableGroup.clear(true, true);
        
        this.platforms = this.physics.add.staticGroup();
        this.bouncePads = this.physics.add.staticGroup();
        this.iceBlocks = this.physics.add.staticGroup();
        this.acidPools = this.physics.add.staticGroup();
        this.unstableGroup = this.physics.add.staticGroup();
        
        this.enemyManager = new EnemyManager(this);
        window.enemyManager = this.enemyManager;
        
        loadRoom(roomId);
        const roomData = rooms[roomId];
        
        // Setup Map Bounds
        const mapPixelWidth = roomData.width * TILE_SIZE;
        const mapPixelHeight = roomData.height * TILE_SIZE;
        this.physics.world.setBounds(0, 0, mapPixelWidth, mapPixelHeight);
        this.cameras.main.setBounds(0, 0, mapPixelWidth, mapPixelHeight);
        this.cameras.main.startFollow(this.playerBody, true, 0.15, 0.15);
        
        // Build Physics Geometry
        for (let row = 0; row < roomData.height; row++) {
            let startCol = -1;
            
            const createMergedBlock = (r, sCol, eCol) => {
                const width = (eCol - sCol + 1) * TILE_SIZE;
                const x = sCol * TILE_SIZE + width / 2;
                const y = r * TILE_SIZE + TILE_SIZE / 2;
                const block = this.add.rectangle(x, y, width, TILE_SIZE, 0x000000, 0);
                this.platforms.add(block);
            };

            for (let col = 0; col <= roomData.width; col++) {
                const tile = (col < roomData.width) ? map[row][col] : 0;
                const isSolidMergeable = (tile === 1 || tile === 3 || tile === 5);
                
                if (isSolidMergeable) {
                    if (startCol === -1) startCol = col;
                } else {
                    if (startCol !== -1) {
                        createMergedBlock(row, startCol, col - 1);
                        startCol = -1;
                    }
                    if (tile === 2) {
                        const pad = this.add.rectangle(col*TILE_SIZE + 16, row*TILE_SIZE + 16, 32, 32, 0x000, 0);
                        this.bouncePads.add(pad);
                    } else if (tile === 4) {
                        const acid = this.add.rectangle(col*TILE_SIZE + 16, row*TILE_SIZE + 24, 32, 16, 0x000, 0);
                        this.acidPools.add(acid);
                    } else if (tile === 6) {
                        const block = this.add.rectangle(col*TILE_SIZE + 16, row*TILE_SIZE + 16, 32, 32, 0x000, 0);
                        block.col = col; block.row = row;
                        this.unstableGroup.add(block);
                        this.platforms.add(block);
                    }
                }
            }
        }
        
        // Spawn Enemies
        if (roomData.spawns) {
            roomData.spawns.forEach(spawn => {
                if (spawn.type === 'crawler') this.enemyManager.spawnCrawler(spawn.x, spawn.y);
                if (spawn.type === 'spitter') this.enemyManager.spawnSpitter(spawn.x, spawn.y);
                if (spawn.type === 'floater') this.enemyManager.spawnFloater(spawn.x, spawn.y);
                if (spawn.type === 'warden') this.enemyManager.spawnWarden(spawn.x, spawn.y);
            });
        }
        
        // Colliders
        this.physics.add.collider(this.playerBody, this.platforms, this.handlePlatformHit, null, this);
        this.physics.add.overlap(this.playerBody, this.bouncePads, this.handleBouncePad, null, this);
        this.physics.add.overlap(this.playerBody, this.acidPools, this.handleAcidPool, null, this);
        this.physics.add.collider(this.enemyManager.physicsGroup, this.platforms);
        this.physics.add.overlap(this.playerBody, this.enemyManager.physicsGroup, this.handleEnemyCollision, null, this);
        
        // Check "onEnter" dialogue
        if (roomData.dialogue) {
            const onEnter = roomData.dialogue.find(d => d.type === 'onEnter');
            if (onEnter && !this.firedDialogues[roomId + '_enter']) {
                this.firedDialogues[roomId + '_enter'] = true;
                if (window.DialogueSystem) window.DialogueSystem.show(onEnter.text, onEnter.avatar, 5000);
            }
        }
    }

    handlePlatformHit(playerObj, platformObj) {
        player.isGrounded = true;
        if (platformObj.col !== undefined && map[platformObj.row][platformObj.col] === 6) {
            triggerUnstable(platformObj.row, platformObj.col);
        }
    }

    handleAcidPool(playerObj, acidObj) {
        if (player.isPogoBouncing > 0) return;
        if (combatState.hp > 0 && !combatState.isDashing) {
            combatState.hp -= 5;
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
            this.playerBody.body.setVelocityY(-400);
            this.cameras.main.shake(100, 0.01);
            for (let i = 0; i < 5; i++) {
                addParticle(player.x + 16, player.y + 32, (Math.random() - 0.5)*100, -Math.random()*200, '#44ff44', 0.5, 'pixel', 6);
            }
        }
    }

    handleEnemyCollision(playerObj, enemyBody) {
        if (combatState.hp > 0 && !combatState.isDashing && combatState.invulnTime <= 0) {
            combatState.hp -= 2;
            combatState.invulnTime = 1.0;
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
            const dir = playerObj.x < enemyBody.x ? -1 : 1;
            this.playerBody.body.setVelocityX(dir * 300);
            this.playerBody.body.setVelocityY(-200);
            this.cameras.main.shake(100, 0.01);
            for (let i = 0; i < 5; i++) {
                addParticle(player.x + 16, player.y + 16, (Math.random() - 0.5)*100, -Math.random()*200, '#ff0000', 0.5, 'pixel', 6);
            }
        }
    }

    handleBouncePad(playerObj, padObj) {
        if (this.playerBody.body.velocity.y > 0) {
            this.playerBody.body.setVelocityY(-1000);
            player.scaleX = 0.4;
            player.scaleY = 1.8;
            this.cameras.main.shake(150, 0.02);
            for (let i = 0; i < 8; i++) {
                addParticle(padObj.x, padObj.y - 10, (Math.random() - 0.5)*150, -Math.random()*60, 'rgba(100, 255, 100, 0.8)', 0.4);
            }
        }
    }

    checkRoomTransitions() {
        const roomData = rooms[currentRoomId];
        if (!roomData || !roomData.doors) return;
        
        const px = this.playerBody.x;
        const py = this.playerBody.y;
        
        for (const door of roomData.doors) {
            const doorLeft = door.x * TILE_SIZE;
            const doorRight = doorLeft + door.width * TILE_SIZE;
            const doorTop = door.y * TILE_SIZE;
            const doorBottom = doorTop + door.height * TILE_SIZE;
            
            if (px >= doorLeft && px <= doorRight && py >= doorTop && py <= doorBottom) {
                // Trigger transition
                this.buildRoom(door.toRoom);
                // Set new player position
                this.playerBody.x = door.toX * TILE_SIZE + 16;
                this.playerBody.y = door.toY * TILE_SIZE + 16;
                player.x = this.playerBody.x - 16;
                player.y = this.playerBody.y - 16;
                // Add teleport particles
                for(let i=0; i<30; i++) {
                    addParticle(player.x, player.y, (Math.random()-0.5)*200, (Math.random()-0.5)*200, '#00ffff', 1.0, 'tex_spark', 8);
                }
                break;
            }
        }
    }

    update(time, delta) {
        const dt = Math.min(delta / 1000, 0.1);
        
        if (window.hitStopTime > 0) {
            window.hitStopTime -= dt;
            this.physics.world.pause();
            return;
        } else {
            this.physics.world.resume();
        }

        this.checkRoomTransitions();

        this.fakeCamera.x = this.cameras.main.scrollX;
        this.fakeCamera.y = this.cameras.main.scrollY;

        player.x = this.playerBody.x - player.width / 2;
        player.y = this.playerBody.y - player.height / 2;
        player.vx = this.playerBody.body.velocity.x;
        player.vy = this.playerBody.body.velocity.y;
        player.isGrounded = this.playerBody.body.blocked.down;
        player.blockedLeft = this.playerBody.body.blocked.left;
        player.blockedRight = this.playerBody.body.blocked.right;

        updateUnstableBlocks(dt);
        
        this.unstableGroup.getChildren().forEach(block => {
            const currentTile = map[block.row][block.col];
            if (currentTile === 0) {
                block.body.checkCollision.none = true;
            } else if (currentTile === 6) {
                block.body.checkCollision.none = false;
            }
        });

        // Dialogues
        const roomData = rooms[currentRoomId];
        if (roomData && roomData.dialogue) {
            if (Math.abs(player.vx) > 10 && !this.firedDialogues[currentRoomId + '_move']) {
                const moveDia = roomData.dialogue.find(d => d.type === 'onMove');
                if (moveDia) {
                    this.firedDialogues[currentRoomId + '_move'] = true;
                    if (window.DialogueSystem) window.DialogueSystem.show(moveDia.text, moveDia.avatar, 4000);
                }
            }
            
            if (Math.abs(player.vx) < 5 && Math.abs(player.vy) < 5 && player.isGrounded) {
                this.idleTimer += dt;
                if (this.idleTimer > 15 && !this.firedDialogues[currentRoomId + '_idle']) {
                    const idleDia = roomData.dialogue.find(d => d.type === 'onIdle15s');
                    if (idleDia) {
                        this.firedDialogues[currentRoomId + '_idle'] = true;
                        if (window.DialogueSystem) window.DialogueSystem.show(idleDia.text, idleDia.avatar, 5000);
                    }
                }
            } else {
                this.idleTimer = 0;
            }
        }

        updatePlayer(dt, addParticle);
        updateCombat(player, dt);
        this.enemyManager.update(dt, player);
        updateHUD(player);

        this.playerBody.body.velocity.x = player.vx;
        this.playerBody.body.velocity.y = player.vy;
        
        if (player.isHovering) {
            this.playerBody.body.setGravityY(0);
            this.playerBody.body.velocity.y = 0;
        } else {
            this.playerBody.body.setGravityY(1200);
        }

        // Draw pass
        this.canvasCtx.fillStyle = '#050510';
        this.canvasCtx.fillRect(0, 0, 640, 480);
        
        this.drawParallaxGrid(this.canvasCtx);
        drawWorld(this.canvasCtx, this.fakeCamera);
        updateAndDrawParticles(this.canvasCtx, this.fakeCamera, dt);
        drawPlayer(this.canvasCtx, this.fakeCamera);
        drawCombat(this.canvasCtx, this.fakeCamera, player);

        this.canvasTexture.refresh();
        resetInputPresses();
    }

    drawParallaxGrid(ctx) {
        ctx.save();
        const zoneIdx = getZone(Math.floor((player.x + player.width/2) / TILE_SIZE));
        const colors = ZONE_COLORS[zoneIdx];
        
        this.bgRect.fillColor = Phaser.Display.Color.HexStringToColor(colors.bg).color;
        this.gridSprite.setTint(Phaser.Display.Color.HexStringToColor(colors.primary).color);
        this.gridSprite.tilePositionX = this.fakeCamera.x * 0.2;
        this.gridSprite.tilePositionY = this.fakeCamera.y * 0.2;
        ctx.restore();
    }
}
