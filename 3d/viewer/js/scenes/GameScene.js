import { map, TILE_SIZE, drawWorld, getTileType, updateUnstableBlocks, triggerUnstable, getZone, ZONE_COLORS } from '../world.js';
import { player, updatePlayer, drawPlayer } from '../player.js';
import { combatState, updateCombat, drawCombat } from '../combat.js';
import { updateAndDrawParticles, addParticle } from '../effects.js';
import { keys, resetInputPresses } from '../input.js';
import { updateHUD } from '../ui.js';
import { EnemyManager } from '../enemies.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Global Hit-Stop logic
        window.hitStopTime = 0;
        window.triggerHitStop = (duration) => {
            window.hitStopTime = duration;
        };
    }

    preload() {
        // Load assets for physics collision bounds and sprites
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
        this.load.image('boss_eleanor_hologram', 'assets/el_avatar_normal.png'); // Reuse avatar for hologram
    }

    create() {
        // Create Physics groups for platform blocks
        this.platforms = this.physics.add.staticGroup();
        this.bouncePads = this.physics.add.staticGroup();
        this.iceBlocks = this.physics.add.staticGroup();
        this.acidPools = this.physics.add.staticGroup();
        this.unstableGroup = this.physics.add.staticGroup();
        this.lasers = this.physics.add.staticGroup();
        
        this.movingPlatforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Populate physics world from map array for collisions with Horizontal Tile Merging (Massive FPS boost)
        for (let row = 0; row < map.length; row++) {
            let startCol = -1;
            
            const createMergedBlock = (r, sCol, eCol) => {
                const width = (eCol - sCol + 1) * TILE_SIZE;
                const x = sCol * TILE_SIZE + width / 2;
                const y = r * TILE_SIZE + TILE_SIZE / 2;
                const block = this.add.rectangle(x, y, width, TILE_SIZE, 0x000000, 0);
                this.platforms.add(block);
            };

            for (let col = 0; col <= map[row].length; col++) {
                const tile = (col < map[row].length) ? map[row][col] : 0;
                const isSolidMergeable = (tile === 1 || tile === 3 || tile === 5); // Ground, Ice, Slime
                
                if (isSolidMergeable) {
                    if (startCol === -1) {
                        startCol = col;
                    }
                } else {
                    if (startCol !== -1) {
                        createMergedBlock(row, startCol, col - 1);
                        startCol = -1;
                    }
                    
                    if (tile === 2) {
                        const x = col * TILE_SIZE + TILE_SIZE / 2;
                        const y = row * TILE_SIZE + TILE_SIZE / 2;
                        const pad = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0);
                        this.bouncePads.add(pad);
                    } else if (tile === 4) {
                        const x = col * TILE_SIZE + TILE_SIZE / 2;
                        const y = row * TILE_SIZE + TILE_SIZE / 2;
                        const acid = this.add.rectangle(x, y + TILE_SIZE/4, TILE_SIZE, TILE_SIZE/2, 0x000000, 0);
                        this.acidPools.add(acid);
                    } else if (tile === 6) {
                        const x = col * TILE_SIZE + TILE_SIZE / 2;
                        const y = row * TILE_SIZE + TILE_SIZE / 2;
                        const block = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x000000, 0); 
                        block.col = col; block.row = row;
                        this.unstableGroup.add(block);
                        this.platforms.add(block);
                    }
                }
            }
        }

        // Save Points
        this.savePoints = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        
        const savePoint1 = this.add.sprite(1950, 750, 'prop_save_terminal');
        savePoint1.setScale(0.1);
        this.physics.add.existing(savePoint1);
        savePoint1.body.allowGravity = false;
        savePoint1.body.immovable = true;
        this.savePoints.add(savePoint1);
        
        const savePoint2 = this.add.sprite(7800, 750, 'prop_save_terminal');
        savePoint2.setScale(0.1);
        this.physics.add.existing(savePoint2);
        savePoint2.body.allowGravity = false;
        savePoint2.body.immovable = true;
        this.savePoints.add(savePoint2);
        
        const savePoint3 = this.add.sprite(13000, 750, 'prop_save_terminal');
        savePoint3.setScale(0.1);
        this.physics.add.existing(savePoint3);
        savePoint3.body.allowGravity = false;
        savePoint3.body.immovable = true;
        this.savePoints.add(savePoint3);
        
        const savePoint4 = this.add.sprite(18000, 750, 'prop_save_terminal');
        savePoint4.setScale(0.1);
        this.physics.add.existing(savePoint4);
        savePoint4.body.allowGravity = false;
        savePoint4.body.immovable = true;
        this.savePoints.add(savePoint4);

        // Memory Fragments (Lore Collectibles)
        this.memoryFragments = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        const fragmentData = [
            { id: 'mem_01', x: 1200, y: 720 }, // Room 1-2
            { id: 'mem_02', x: 4900, y: 600 }, // Room 1-8
            { id: 'mem_03', x: 7500, y: 400 }, // Room 2-5
            { id: 'mem_04', x: 10500, y: 500 }, // Room 2-10
            { id: 'mem_05', x: 13500, y: 200 }, // Room 3-3
            { id: 'mem_06', x: 14500, y: 750 }, // Room 3-5 (Required)
            { id: 'mem_07', x: 15500, y: 400 }, // Room 3-7
            { id: 'mem_08', x: 18500, y: 750 }  // Room 4-3
        ];

        fragmentData.forEach(data => {
            // Invisible physics body
            const frag = this.add.rectangle(data.x, data.y, 40, 40, 0xffffff, 0);
            this.physics.add.existing(frag);
            frag.body.allowGravity = false;
            frag.body.immovable = true;
            frag.memoryId = data.id;
            
            // Visuals
            frag.visual = this.add.sprite(data.x, data.y, 'prop_memory_fragment');
            frag.visual.setScale(0.08);
            
            this.memoryFragments.add(frag);
        });

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

        this.roomTriggers = [
            { x: 100, id: 'tut1', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("...Anh ơi? Anh nghe em nói không? Đừng sợ. Hệ thống thần kinh đang khởi động lại... Cử động thử đi anh.", 'normal', 5000);
            }},
            { x: 600, id: 'tut2', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Tốt lắm. Cơ thể mới đang phản hồi tốt. Anh thật tuyệt vời.", 'normal', 4000);
            }},
            { x: 1000, id: 'r1-2', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Cẩn thận anh! Có sinh vật đột biến phía trước. Hãy dùng cánh tay để tự vệ - nhấn J để chém.", 'normal', 5000);
            }},
            { x: 1500, id: 'r1-3', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Khu vực này từng là nơi em làm việc... Trước khi mọi thứ sụp đổ. Đừng nhìn vào những bức ảnh đó, anh. Chúng không quan trọng nữa.", 'worried', 5000);
            }},
            { x: 1800, id: 'r1-4', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Đây là Trạm Lưu Trữ. Anh có thể nghỉ ngơi ở đây. Em sẽ luôn ở bên cạnh anh... Luôn luôn.", 'normal', 5000);
            }},
            { x: 5300, id: 'boss1', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Cái robot đó... Nó là hệ thống an ninh cũ, đã hóa điên. Tiêu diệt nó đi anh. Đừng để nó ngăn cản chúng ta.", 'angry', 5000);
            }},
            { x: 5800, id: 'act2_start', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Khu này... là nơi em nuôi trồng các tế bào sinh học. Đẹp phải không anh? Mọi thứ ở đây đều sống nhờ tình yêu của em dành cho anh.", 'normal', 5000);
            }},
            { x: 7000, id: 'acid_warn', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Cẩn thận acid! Cơ thể Bio-Probe của anh có thể chịu được... nhưng em không muốn anh đau.", 'worried', 5000);
            }},
            { x: 11000, id: 'boss2', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Sinh vật này... em từng nuôi nó. Nó rất đẹp khi còn nhỏ. Giống như... [im lặng 3 giây] ...Tiêu diệt nó đi.", 'worried', 5000);
            }},
            { x: 11800, id: 'act3_start', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Anh... đừng vào khu này. Xin anh. Dữ liệu trong đây bị hỏng hết rồi. Không có gì đáng xem đâu. Quay lại đi...", 'worried', 5000);
            }},
            { x: 12200, id: 'glitch1', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("CÁI ĐÓ LÀ LỖI! LỖI HIỂN THỊ! ĐỪNG TIN VÀO NÓ! Bọn quái vật đang cố LỪA ANH!", 'glitch', 5000);
            }},
            { x: 14500, id: 'room3_5', fired: false, action: () => {
                window.truthRevealed = true; // ALL ENEMIES REVEAL TRUTH NAMES FROM HERE
                window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 30}}));
                if (window.GlitchSystem) window.GlitchSystem.trigger(0.8, 5);
                if (window.DialogueSystem) window.DialogueSystem.show("ĐỪNG NGHE! XIN ANH ĐỪNG NGHE! Em... em không muốn vậy... Tại dịch bệnh! Em chỉ muốn không ai rời xa em nữa...", 'crying', 6000);
            }},
            { x: 15200, id: 'maze', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Rẽ trái anh! PHẢI rẽ trái!", 'angry', 3000);
            }},
            { x: 16800, id: 'act4_start', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Anh... anh thật sự muốn đến đó sao? Nếu anh ngắt Lõi... cả hai chúng ta đều sẽ chết. Anh hiểu chứ?", 'crying', 5000);
            }},
            { x: 19800, id: 'before_final', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Đây là cơ hội cuối cùng anh quay lại... Nếu anh bước qua cánh cửa kia... chúng ta sẽ không bao giờ trở lại được nữa.", 'glitch', 5000);
            }},
            { x: 20000, id: 'final_boss', fired: false, action: () => {
                if (window.DialogueSystem) window.DialogueSystem.show("Em đã xây dựng tất cả chỉ cho anh. Căn phòng này, cơ thể mới của anh, sự bất tử... TẤT CẢ CHỈ VÌ TÌNH YÊU CỦA EM!", 'glitch', 6000);
            }}
        ];

        // Enemy Manager
        this.enemyManager = new EnemyManager(this);
        window.enemyManager = this.enemyManager;
        this.physics.add.collider(this.enemyManager.physicsGroup, this.platforms);
        
        // Spawn Enemies for Room 1-2
        this.enemyManager.spawnCrawler(850, 750);
        this.enemyManager.spawnCrawler(1100, 750);
        
        // Spawn Enemies for Room 1-3
        this.enemyManager.spawnCrawler(1400, 750);
        this.enemyManager.spawnSpitter(1600, 750);
        
        // Spawn Floater in Room 1-8
        this.enemyManager.spawnFloater(4800, 500);
        
        // Spawn Boss Warden in Room 1-9
        this.enemyManager.spawnWarden(5400, 750);
        
        // --- ACT 2 ---
        // Spawn Enemies for Room 2-1
        this.enemyManager.spawnLeechVine(5850, 480);
        this.enemyManager.spawnLeechVine(6000, 480);
        
        // Spawn Enemies for Room 2-2
        this.enemyManager.spawnCharger(6600, 750);
        this.enemyManager.spawnCharger(6800, 750);
        
        // Spawn Enemies for Room 2-10 (Toxic ambush)
        this.enemyManager.spawnSpitter(10000, 750);
        this.enemyManager.spawnCrawler(10200, 750);
        this.enemyManager.spawnCharger(10600, 750);
        
        // Spawn Boss Mother Vine in Room 2-11
        this.enemyManager.spawnMotherVine(11200, 750);
        
        // Add moving platforms
        const mplat1 = this.add.rectangle(6200, 600, 96, 32, 0x444444);
        this.physics.add.existing(mplat1);
        mplat1.body.allowGravity = false;
        mplat1.body.immovable = true;
        mplat1.body.setVelocityX(100);
        mplat1.minX = 6200;
        mplat1.maxX = 6500;
        this.movingPlatforms.add(mplat1);

        const mplat2 = this.add.rectangle(7000, 600, 96, 32, 0x444444);
        this.physics.add.existing(mplat2);
        mplat2.body.allowGravity = false;
        mplat2.body.immovable = true;
        mplat2.body.setVelocityY(-100);
        mplat2.minY = 400;
        mplat2.maxY = 700;
        this.movingPlatforms.add(mplat2);

        // --- ACT 3 ---
        // Laser Corridor
        for(let r=12; r<18; r++) {
            const laser = this.add.rectangle(370 * TILE_SIZE + TILE_SIZE/2, r * TILE_SIZE + TILE_SIZE/2, TILE_SIZE, TILE_SIZE, 0xff0000, 0.6);
            this.lasers.add(laser);
        }
        
        // Spawn Enemies
        this.enemyManager.spawnCyborg(12200, 750); // Moved to col 381 (safe floor)
        this.enemyManager.spawnMimic(12800, 750);  // Moved to col 400 (safe floor)
        
        // Maze ambush
        this.enemyManager.spawnCyborg(15200, 750);
        this.enemyManager.spawnMimic(15400, 750);
        
        // Boss Archive Keeper
        this.enemyManager.spawnArchiveKeeper(16000, 400);

        // --- ACT 4 ---
        // Lily's Toy (Item)
        this.lilyToy = this.add.sprite(605 * TILE_SIZE, 14 * TILE_SIZE, 'lily_toy');
        this.lilyToy.setScale(0.06);
        this.physics.add.existing(this.lilyToy);
        this.lilyToy.body.allowGravity = false;
        this.lilyToy.body.immovable = true;
        
        // Final Boss Eleanor Mutated
        this.enemyManager.spawnEleanorMutated(20000, 750);

        // Add colliders
        this.physics.add.collider(this.playerBody, this.platforms, this.handlePlatformHit, null, this);
        this.physics.add.collider(this.playerBody, this.movingPlatforms, this.handleMovingPlatformHit, null, this);
        this.physics.add.overlap(this.playerBody, this.bouncePads, this.handleBouncePad, null, this);
        this.physics.add.overlap(this.playerBody, this.acidPools, this.handleAcidPool, null, this);
        this.physics.add.overlap(this.playerBody, this.lasers, this.handleLaserHit, null, this);
        this.physics.add.overlap(this.playerBody, this.savePoints, this.handleSavePoint, null, this);
        this.physics.add.overlap(this.playerBody, this.memoryFragments, this.handleMemoryPickup, null, this);
        this.physics.add.overlap(this.playerBody, this.lilyToy, this.handleLilyToy, null, this);
        this.physics.add.overlap(this.playerBody, this.enemyManager.physicsGroup, this.handleEnemyCollision, null, this);

        // Create Canvas Texture for drawing legacy Canvas 2D graphics
        this.canvasTexture = this.textures.createCanvas('proGameCanvas', 640, 480);
        this.canvasCtx = this.canvasTexture.context;
        
        // Add the canvas image to center of screen (320, 240) and set it to follow camera
        this.canvasImage = this.add.image(320, 240, 'proGameCanvas');
        this.canvasImage.setScrollFactor(0); // Lock it to screen

        // Background Solid Color Rectangle
        this.bgRect = this.add.rectangle(320, 240, 640, 480, 0x000000);
        this.bgRect.setScrollFactor(0);
        this.bgRect.setDepth(-10);

        // Dialogue Tracking
        this.idleTimer = 0;
        this.idleDialogueTriggered = false;
        window.triggerViolentDialogue = () => {
            if (!this.violentCount) this.violentCount = 0;
            this.violentCount++;
            if (this.violentCount >= 3) {
                if (window.DialogueSystem && !window.DialogueSystem.isActive) {
                    window.DialogueSystem.show("Đúng rồi anh! Nghiền nát chúng! Xé chúng ra từng mảnh! ...Em yêu cách anh chiến đấu.", 'glitch', 5000);
                    this.violentCount = 0;
                }
            }
        };
        
        window.triggerDamageDialogue = () => {
            if (window.DialogueSystem && !window.DialogueSystem.isActive) {
                // Randomize a bit to not be annoying
                if (Math.random() < 0.5) {
                    window.DialogueSystem.show("Anh bị thương rồi! Đau không anh? Em xin lỗi... Em đã nên thiết kế cơ thể anh tốt hơn... Em sẽ bù đắp cho anh.", 'worried', 5000);
                }
            }
        };

        // Generate Grid Texture once (Hardware Accelerated)
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
        player.isGrounded = true;
        if (platformObj.col !== undefined && map[platformObj.row][platformObj.col] === 6) {
            triggerUnstable(platformObj.row, platformObj.col);
        }
    }
    handleLaserHit(playerObj, laserObj) {
        if (player.invulnerable > 0) return;
        player.takeDamage(1);
        player.invulnerable = 1.0;
        player.vy = -300;
        player.vx = player.facingRight ? -400 : 400;
        window.dispatchEvent(new CustomEvent('cameraShake', {detail: {intensity: 10}}));
    }

    handleLilyToy(playerObj, toyObj) {
        if (toyObj.active) {
            toyObj.destroy();
            window.trueEndUnlocked = true;
            if (window.DialogueSystem) {
                window.DialogueSystem.show("Gấu bông của Lily... Nó vẫn còn ở đây... Mẹ nhớ con...", 'worried', 4000);
            }
        }
    }
    handleMovingPlatformHit(playerObj, platformObj) {
        if (playerObj.body.touching.down && platformObj.body.touching.up) {
            player.isGrounded = true;
        }
    }
    
    handleAcidPool(playerObj, acidObj) {
        if (player.isPogoBouncing > 0) return; // Immune during pogo bounce!
        
        if (combatState.hp > 0 && !combatState.isDashing) {
            // Take damage and knockback
            combatState.hp -= 5;
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
            
            this.playerBody.body.setVelocityY(-400); // knockback up
            this.cameras.main.shake(100, 0.01);
            
            for (let i = 0; i < 5; i++) {
                addParticle(player.x + Math.random() * player.width, player.y + player.height, (Math.random() - 0.5) * 100, -Math.random() * 200, '#44ff44', 0.5, 'pixel', 6);
            }
        }
    }

    handleSavePoint(playerObj, saveObj) {
        // Visual cue for save point
        saveObj.fillAlpha = 0.8;
        setTimeout(() => saveObj.fillAlpha = 0.5, 100);
        
        // If pressing UP or interacting (we can use UP arrow)
        if (keys['ArrowUp'] && !this.isSaving) {
            this.isSaving = true;
            combatState.hp = 100; // Heal
            
            // Particles
            for(let i=0; i<30; i++) {
                addParticle(saveObj.x, saveObj.y + 40, (Math.random()-0.5)*100, -100-Math.random()*200, '#00ffcc', 0.8, 'tex_star', 8);
            }
            
            if (window.DialogueSystem) {
                window.DialogueSystem.show("Đã đồng bộ hóa dữ liệu thần kinh. Cơ thể anh đã được phục hồi.", 'normal', 3000);
            }
            
            setTimeout(() => this.isSaving = false, 3000); // Prevent spam
        }
    }

    handleMemoryPickup(playerObj, fragObj) {
        if (window.LoreSystem && window.LoreSystem.unlock(fragObj.memoryId)) {
            // Particle effect
            for(let i=0; i<30; i++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = Math.random() * 200;
                addParticle(fragObj.x, fragObj.y, Math.cos(ang)*spd, Math.sin(ang)*spd, '#00ffff', 1.0, 'tex_spark', 10);
            }
            
            // Trigger dialogue if defined
            const lore = window.LoreData ? window.LoreData.find(l => l.id === fragObj.memoryId) : null;
            if (lore && lore.dialogueTrigger && window.DialogueSystem) {
                window.DialogueSystem.show(lore.dialogueTrigger, 'glitch', 6000);
            }
            
            // Glitch effect
            if (window.GlitchSystem) window.GlitchSystem.trigger(0.3, 3);
            
            // Cleanup visually
            if (fragObj.visual) fragObj.visual.destroy();
            fragObj.destroy();
        }
    }

    handleLilyToy(playerObj, toyObj) {
        window.trueEndUnlocked = true;
        
        // Particle effect
        for(let i=0; i<50; i++) {
            addParticle(toyObj.x, toyObj.y, (Math.random()-0.5)*300, (Math.random()-0.5)*300, '#ffff00', 1.0, 'tex_star', 20);
        }
        
        if (window.DialogueSystem) {
            window.DialogueSystem.show("...Đồ chơi của Lily. Con gái chúng ta... Em nhớ nó quá. Cảm ơn anh đã tìm thấy nó.", 'crying', 6000);
        }
        
        toyObj.destroy();
    }

    handleAcidPool(playerObj, poolObj) {
        if (combatState.hp > 0 && combatState.invulnTime <= 0) {
            combatState.hp -= 1;
            combatState.invulnTime = 0.5;
            this.playerBody.body.setVelocityY(-300);
            this.cameras.main.shake(100, 0.01);
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
        }
    }

    handleLaserHit(playerObj, laserObj) {
        if (combatState.hp > 0 && combatState.invulnTime <= 0 && !combatState.isDashing) {
            combatState.hp -= 2;
            combatState.invulnTime = 0.8;
            this.playerBody.body.setVelocityY(-200);
            this.playerBody.body.setVelocityX(playerObj.x < laserObj.x ? -300 : 300);
            this.cameras.main.shake(100, 0.02);
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
        }
    }

    handlePlatformHit(playerObj, platformObj) {
        if (platformObj.col !== undefined && platformObj.row !== undefined) {
            triggerUnstable(platformObj.row, platformObj.col);
            
            // Note: Since unstableBlocks is tracked in world.js but the actual Phaser physical block is in GameScene, 
            // we should also probably destroy/disable the physics body if it's 'gone'.
            // Actually, updateUnstableBlocks in world.js does `map[r][c] = 0`.
            // The Phaser bodies are NOT rebuilt! So they remain solid even if map[r][c] becomes 0!
        }
    }

    handleMovingPlatformHit(playerObj, platformObj) {
        // Player moves with platform if standing on it
        if (platformObj.body.velocity.x !== 0 && playerObj.body.blocked.down) {
            playerObj.x += platformObj.body.velocity.x * (1/60); // approximate
        }
    }

    handleEnemyCollision(playerObj, enemyBody) {
        // Simple damage logic
        if (combatState.hp > 0 && !combatState.isDashing && combatState.invulnTime <= 0) {
            combatState.hp -= 2; // Base damage
            combatState.invulnTime = 1.0; // i-frames
            
            if (window.triggerDamageDialogue) window.triggerDamageDialogue();
            
            // Knockback
            const dir = playerObj.x < enemyBody.x ? -1 : 1;
            this.playerBody.body.setVelocityX(dir * 300);
            this.playerBody.body.setVelocityY(-200);
            this.cameras.main.shake(100, 0.01);
            
            for (let i = 0; i < 5; i++) {
                addParticle(player.x + player.width/2, player.y + player.height/2, (Math.random() - 0.5) * 100, -Math.random() * 200, '#ff0000', 0.5, 'pixel', 6);
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
        const realDt = Math.min(delta / 1000, 0.1);
        let dt = realDt;
        
        // Handle Hit-Stop
        if (window.hitStopTime > 0) {
            window.hitStopTime -= realDt;
            dt = 0; // Freeze game logic
            this.physics.world.pause();
        } else {
            this.physics.world.resume();
        }

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

        updateUnstableBlocks(dt);
        
        // Very inefficient, but simple way to sync Phaser bodies with map changes for unstable blocks
        this.unstableGroup.getChildren().forEach(block => {
            const currentTile = map[block.row][block.col];
            if (currentTile === 0) {
                block.body.checkCollision.none = true;
                block.fillAlpha = 0;
            } else if (currentTile === 6) {
                block.body.checkCollision.none = false;
                block.fillAlpha = 1; // Or whatever alpha it had
            }
        });

        // Dialogue Trigger: Idle
        if (Math.abs(player.vx) < 5 && Math.abs(player.vy) < 5 && player.isGrounded) {
            this.idleTimer += dt;
            if (this.idleTimer > 15 && !this.idleDialogueTriggered) {
                if (window.DialogueSystem) {
                    window.DialogueSystem.show("Anh ơi? Sao anh dừng lại? Đừng suy nghĩ nhiều... Cứ đi tiếp đi anh. Em đang chờ anh mà.", 'worried', 5000);
                }
                this.idleDialogueTriggered = true;
            }
        } else {
            this.idleTimer = 0;
            this.idleDialogueTriggered = false;
        }

        // Room Triggers based on Player X position
        if (this.roomTriggers) {
            this.roomTriggers.forEach(trigger => {
                if (!trigger.fired && player.x >= trigger.x) {
                    trigger.fired = true;
                    trigger.action();
                }
            });
        }

        try {
            // Run updates
            updateUnstableBlocks(dt);
        
            // Update Moving Platforms
            this.movingPlatforms.children.iterate((plat) => {
                if (plat.minX && plat.maxX) {
                    if (plat.x >= plat.maxX) plat.body.setVelocityX(-100);
                    else if (plat.x <= plat.minX) plat.body.setVelocityX(100);
                }
                if (plat.minY && plat.maxY) {
                    if (plat.y >= plat.maxY) plat.body.setVelocityY(-100);
                    else if (plat.y <= plat.minY) plat.body.setVelocityY(100);
                }
            });
            
            // Re-sync platforms group to remove 'gone' unstable blocks
            this.unstableGroup.getChildren().forEach(block => {
                const mapTile = map[block.row][block.col];
                if (mapTile === 0) {
                    block.body.enable = false; // Disable collision when gone
                } else if (mapTile === 6) {
                    block.body.enable = true;  // Re-enable when respawned
                }
            });
            
            // Update memory fragments floating effect
            const timeSeconds = time / 1000;
            this.memoryFragments.getChildren().forEach((frag, idx) => {
                if (frag.active && frag.visual) {
                    frag.visual.y = frag.y + Math.sin(timeSeconds * 2 + idx) * 10;
                    frag.visual.rotation = timeSeconds * 1.5;
                    
                    // Particles trailing the fragment
                    if (Math.random() < 0.1) {
                        addParticle(frag.visual.x + (Math.random()-0.5)*10, frag.visual.y + (Math.random()-0.5)*10, 0, Math.random()*-20, '#00ffff', 0.5, 'tex_spark', 6);
                    }
                }
            });

            updatePlayer(dt, addParticle);
            updateCombat(player, dt);
            this.enemyManager.update(dt, player);
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
        
        // Update hardware accelerated background and grid
        this.bgRect.fillColor = Phaser.Display.Color.HexStringToColor(colors.bg).color;
        this.gridSprite.setTint(Phaser.Display.Color.HexStringToColor(colors.primary).color);
        this.gridSprite.tilePositionX = this.fakeCamera.x * 0.2;
        this.gridSprite.tilePositionY = this.fakeCamera.y * 0.2;

        // Far parallax based on zone (Dynamic Shapes)
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
