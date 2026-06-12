"""
PSX Horror Game - Add all systems:
1. GLTF Model Loader with fallback
2. Zone Lighting
3. CRT Post-Processing
4. Audio Framework
5. Ghost/Threat System
6. Scripted Scare Events
"""
import re

with open('psx.js', 'r', encoding='utf-8') as f:
    code = f.read()

# ============================================
# 1. Add GLTFLoader import
# ============================================
code = code.replace(
    "import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';",
    "import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';\nimport { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';"
)

# ============================================
# 2. Add all new systems BEFORE init() call
# ============================================

SYSTEMS_CODE = r'''
// ==========================================
// GLTF MODEL LOADER (with BoxGeometry fallback)
// ==========================================
const gltfLoader = new GLTFLoader();
const modelCache = {};

function loadModelOrFallback(modelPath, fallbackFn, scale = 1.0) {
    return new Promise((resolve) => {
        if (modelCache[modelPath]) {
            const clone = modelCache[modelPath].clone();
            clone.scale.setScalar(scale);
            resolve(clone);
            return;
        }
        gltfLoader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                model.traverse(child => {
                    if (child.isMesh) {
                        child.material.side = THREE.FrontSide;
                        if (child.material.map) {
                            child.material.map.magFilter = THREE.NearestFilter;
                            child.material.map.minFilter = THREE.NearestFilter;
                        }
                    }
                });
                modelCache[modelPath] = model;
                const clone = model.clone();
                clone.scale.setScalar(scale);
                resolve(clone);
            },
            undefined,
            () => {
                // 404 or error — use fallback BoxGeometry
                resolve(fallbackFn());
            }
        );
    });
}

// ==========================================
// AUDIO MANAGER (silent fallback if no files)
// ==========================================
const AudioManager = {
    listener: null,
    audioLoader: null,
    sounds: {},
    ambientSounds: {},
    currentZone: null,
    initialized: false,
    muted: false,

    init(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.initialized = true;
    },

    loadSound(name, path, loop = false, volume = 0.5) {
        if (!this.initialized) return;
        const sound = new THREE.Audio(this.listener);
        this.audioLoader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.setVolume(volume);
            this.sounds[name] = sound;
        }, undefined, () => {
            // File not found — silent fallback
            this.sounds[name] = null;
        });
    },

    playSFX(name) {
        if (this.muted || !this.sounds[name]) return;
        if (this.sounds[name].isPlaying) this.sounds[name].stop();
        this.sounds[name].play();
    },

    loadAmbient(zoneName, path, volume = 0.3) {
        if (!this.initialized) return;
        const sound = new THREE.Audio(this.listener);
        this.audioLoader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(volume);
            this.ambientSounds[zoneName] = sound;
        }, undefined, () => {
            this.ambientSounds[zoneName] = null;
        });
    },

    setZone(zoneName) {
        if (zoneName === this.currentZone) return;
        // Fade out current
        if (this.currentZone && this.ambientSounds[this.currentZone]) {
            const old = this.ambientSounds[this.currentZone];
            if (old.isPlaying) old.stop();
        }
        // Fade in new
        if (this.ambientSounds[zoneName]) {
            if (!this.ambientSounds[zoneName].isPlaying && !this.muted) {
                this.ambientSounds[zoneName].play();
            }
        }
        this.currentZone = zoneName;
    },

    toggleMute() {
        this.muted = !this.muted;
        Object.values(this.sounds).forEach(s => { if (s && s.isPlaying) s.stop(); });
        Object.values(this.ambientSounds).forEach(s => { if (s && s.isPlaying) s.stop(); });
    }
};

// ==========================================
// ZONE SYSTEM (lighting, fog, ambient per area)
// ==========================================
const ZoneSystem = {
    zones: {
        nursery:     { name: 'Nursery',     color: 0x4488cc, intensity: 0.8, fogDensity: 0.08, cMin: 1,  cMax: 6,  rMin: 1,  rMax: 4  },
        study:       { name: 'Dark Study',  color: 0xddaa44, intensity: 0.6, fogDensity: 0.07, cMin: 9,  cMax: 14, rMin: 1,  rMax: 4  },
        bedroom:     { name: 'Bedroom',     color: 0x667788, intensity: 0.4, fogDensity: 0.10, cMin: 17, cMax: 20, rMin: 1,  rMax: 4  },
        bathroom:    { name: 'Bathroom',    color: 0x44cc66, intensity: 0.7, fogDensity: 0.06, cMin: 23, cMax: 33, rMin: 1,  rMax: 4  },
        living_room: { name: 'Living Room', color: 0x6688bb, intensity: 0.5, fogDensity: 0.06, cMin: 1,  cMax: 6,  rMin: 8,  rMax: 11 },
        courtyard:   { name: 'Courtyard',   color: 0x8899aa, intensity: 0.3, fogDensity: 0.04, cMin: 7,  cMax: 24, rMin: 5,  rMax: 13 },
        kitchen:     { name: 'Kitchen',     color: 0xccaa55, intensity: 0.7, fogDensity: 0.06, cMin: 25, cMax: 33, rMin: 7,  rMax: 11 },
        hidden_room: { name: 'Hidden Room', color: 0xcc3333, intensity: 0.3, fogDensity: 0.12, cMin: 1,  cMax: 11, rMin: 13, rMax: 17 },
        dormitory:   { name: 'Dormitory',   color: 0x554466, intensity: 0.2, fogDensity: 0.14, cMin: 25, cMax: 33, rMin: 13, rMax: 17 }
    },
    lights: [],
    currentZone: null,
    targetFogDensity: 0.05,
    targetAmbientColor: new THREE.Color(0x223322),
    targetAmbientIntensity: 0.02,

    init(group, cellSize, offsetX, offsetZ, roomHeight) {
        for (const [id, zone] of Object.entries(this.zones)) {
            const cx = ((zone.cMin + zone.cMax) / 2 - offsetX) * cellSize;
            const cz = ((zone.rMin + zone.rMax) / 2 - offsetZ) * cellSize;
            
            const light = new THREE.PointLight(zone.color, zone.intensity, 8, 1.5);
            light.position.set(cx, roomHeight - 0.3, cz);
            light.userData.isFlickering = (id === 'bathroom' || id === 'kitchen');
            light.userData.baseIntensity = zone.intensity;
            light.userData.zoneId = id;
            group.add(light);
            this.lights.push(light);
        }
    },

    getPlayerZone(playerPos, cellSize, offsetX, offsetZ) {
        const c = Math.round(playerPos.x / cellSize + offsetX);
        const r = Math.round(playerPos.z / cellSize + offsetZ);
        
        for (const [id, zone] of Object.entries(this.zones)) {
            if (c >= zone.cMin && c <= zone.cMax && r >= zone.rMin && r <= zone.rMax) {
                return id;
            }
        }
        return 'courtyard'; // default
    },

    update(playerPos, scene, ambientLight, delta, cellSize, offsetX, offsetZ) {
        const zone = this.getPlayerZone(playerPos, cellSize, offsetX, offsetZ);
        if (zone !== this.currentZone) {
            this.currentZone = zone;
            const zoneData = this.zones[zone];
            if (zoneData) {
                this.targetFogDensity = zoneData.fogDensity;
                this.targetAmbientColor.setHex(zoneData.color);
                this.targetAmbientIntensity = zoneData.intensity * 0.05;
                AudioManager.setZone(zone);
            }
        }
        // Smooth transition
        if (scene.fog) {
            scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, this.targetFogDensity, delta * 2);
        }
        if (ambientLight) {
            ambientLight.color.lerp(this.targetAmbientColor, delta * 2);
            ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, this.targetAmbientIntensity, delta * 2);
        }
    }
};

// ==========================================
// GHOST/THREAT SYSTEM
// ==========================================
const GhostSystem = {
    entity: null,
    phase: 'dormant', // dormant, passive, stalking, aggressive
    mesh: null,
    targetPos: new THREE.Vector3(),
    spawnTimer: 0,
    phaseTimer: 0,
    speed: 0,
    visible: false,
    playerSeenTimer: 0,
    flickerTimer: 0,
    
    init(scene) {
        // BoxGeometry fallback ghost (silhouette)
        const ghostGeo = new THREE.BoxGeometry(0.4, 1.8, 0.2);
        const ghostMat = new THREE.MeshBasicMaterial({
            color: 0x111122,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(ghostGeo, ghostMat);
        this.mesh.position.set(0, 0.9, -100); // offscreen
        this.mesh.userData.noCollision = true;
        this.mesh.userData.isGhost = true;
        scene.add(this.mesh);
        
        // Ghost eyes (glowing dots)
        const eyeGeo = new THREE.BoxGeometry(0.06, 0.04, 0.05);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0 });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat.clone());
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat.clone());
        eyeL.position.set(-0.08, 0.6, -0.12);
        eyeR.position.set(0.08, 0.6, -0.12);
        this.mesh.add(eyeL);
        this.mesh.add(eyeR);
        this.mesh.userData.eyes = [eyeL, eyeR];
    },

    trigger(phase) {
        if (this.phase === 'aggressive') return; // don't downgrade
        this.phase = phase;
        this.phaseTimer = 0;
        this.visible = true;
        if (phase === 'passive') this.speed = 0;
        else if (phase === 'stalking') this.speed = 1.5;
        else if (phase === 'aggressive') this.speed = 4.0;
    },

    spawnNear(playerPos, scene) {
        // Spawn behind the player, 8-12 units away
        const angle = Math.random() * Math.PI * 2;
        const dist = 8 + Math.random() * 4;
        this.mesh.position.set(
            playerPos.x + Math.sin(angle) * dist,
            0.9,
            playerPos.z + Math.cos(angle) * dist
        );
    },

    update(playerPos, playerGroup, delta, camera) {
        if (this.phase === 'dormant') {
            this.mesh.material.opacity = 0;
            this.mesh.userData.eyes.forEach(e => e.material.opacity = 0);
            return;
        }

        this.phaseTimer += delta;

        // Check if player is looking at ghost
        const ghostDir = new THREE.Vector3();
        ghostDir.subVectors(this.mesh.position, playerPos).normalize();
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        const dot = ghostDir.dot(cameraDir);
        const isPlayerLooking = dot > 0.7;

        if (this.phase === 'passive') {
            // Appear as faint shadow, vanish if player looks directly
            const targetOpacity = isPlayerLooking ? 0 : 0.3;
            this.mesh.material.opacity = THREE.MathUtils.lerp(this.mesh.material.opacity, targetOpacity, delta * 3);
            this.mesh.userData.eyes.forEach(e => {
                e.material.opacity = this.mesh.material.opacity * 0.8;
            });
            
            // After 15 seconds, upgrade to stalking
            if (this.phaseTimer > 15) {
                this.trigger('stalking');
            }
        }
        else if (this.phase === 'stalking') {
            // Move toward player ONLY when player is NOT looking
            if (!isPlayerLooking) {
                const dir = new THREE.Vector3();
                dir.subVectors(playerPos, this.mesh.position).normalize();
                this.mesh.position.x += dir.x * this.speed * delta;
                this.mesh.position.z += dir.z * this.speed * delta;
                this.mesh.material.opacity = THREE.MathUtils.lerp(this.mesh.material.opacity, 0.6, delta * 2);
            } else {
                // Freeze when looked at
                this.playerSeenTimer += delta;
            }
            this.mesh.userData.eyes.forEach(e => {
                e.material.opacity = this.mesh.material.opacity;
            });

            // After 30 seconds of stalking, go aggressive
            if (this.phaseTimer > 30) {
                this.trigger('aggressive');
            }
        }
        else if (this.phase === 'aggressive') {
            // Always chase
            const dir = new THREE.Vector3();
            dir.subVectors(playerPos, this.mesh.position).normalize();
            this.mesh.position.x += dir.x * this.speed * delta;
            this.mesh.position.z += dir.z * this.speed * delta;
            this.mesh.material.opacity = THREE.MathUtils.lerp(this.mesh.material.opacity, 0.85, delta * 3);
            this.mesh.userData.eyes.forEach(e => {
                e.material.opacity = 1.0;
                e.material.color.setHex(0xff0000);
            });
            
            // Flicker lights
            this.flickerTimer += delta;
            if (this.flickerTimer > 0.1) {
                this.flickerTimer = 0;
                ZoneSystem.lights.forEach(l => {
                    l.intensity = l.userData.baseIntensity * (0.3 + Math.random() * 0.7);
                });
            }

            // Check catch distance
            const dist = playerPos.distanceTo(this.mesh.position);
            if (dist < 0.8) {
                // Game over effect
                this.phase = 'dormant';
                this.mesh.material.opacity = 0;
            }
        }

        // Ghost always faces player
        this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);
    },

    dismiss() {
        this.phase = 'dormant';
        this.phaseTimer = 0;
        this.mesh.material.opacity = 0;
        this.mesh.userData.eyes.forEach(e => e.material.opacity = 0);
        this.mesh.position.set(0, 0.9, -100);
    }
};

// ==========================================
// SCRIPTED SCARE EVENT MANAGER
// ==========================================
const ScareManager = {
    events: {},
    triggered: {},

    register(id, config) {
        this.events[id] = config;
        this.triggered[id] = false;
    },

    check(playerPos, scene, delta, cellSize, offsetX, offsetZ) {
        const c = Math.round(playerPos.x / cellSize + offsetX);
        const r = Math.round(playerPos.z / cellSize + offsetZ);

        for (const [id, event] of Object.entries(this.events)) {
            if (this.triggered[id]) continue;
            if (c >= event.cMin && c <= event.cMax && r >= event.rMin && r <= event.rMax) {
                this.triggered[id] = true;
                if (typeof event.onTrigger === 'function') {
                    event.onTrigger(scene, playerPos);
                }
            }
        }
    },

    reset() {
        for (const id in this.triggered) {
            this.triggered[id] = false;
        }
    }
};

// ==========================================
// CRT POST-PROCESSING (CSS-based, lightweight)
// ==========================================
const CRTFilter = {
    scanlineOverlay: null,
    vignetteOverlay: null,
    grainCanvas: null,
    grainCtx: null,
    enabled: true,

    init() {
        // Scanline overlay
        this.scanlineOverlay = document.createElement('div');
        this.scanlineOverlay.id = 'crt-scanlines';
        this.scanlineOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 900; mix-blend-mode: multiply;
            background: repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.15) 0px,
                rgba(0,0,0,0.15) 1px,
                transparent 1px,
                transparent 3px
            );
        `;
        document.body.appendChild(this.scanlineOverlay);

        // Vignette overlay
        this.vignetteOverlay = document.createElement('div');
        this.vignetteOverlay.id = 'crt-vignette';
        this.vignetteOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 901;
            background: radial-gradient(
                ellipse at center,
                transparent 50%,
                rgba(0,0,0,0.4) 80%,
                rgba(0,0,0,0.8) 100%
            );
        `;
        document.body.appendChild(this.vignetteOverlay);

        // Film grain canvas
        this.grainCanvas = document.createElement('canvas');
        this.grainCanvas.id = 'crt-grain';
        this.grainCanvas.width = 256;
        this.grainCanvas.height = 256;
        this.grainCanvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 902; opacity: 0.06;
            mix-blend-mode: screen; image-rendering: pixelated;
        `;
        document.body.appendChild(this.grainCanvas);
        this.grainCtx = this.grainCanvas.getContext('2d');
    },

    updateGrain() {
        if (!this.enabled || !this.grainCtx) return;
        const ctx = this.grainCtx;
        const w = 256, h = 256;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = v;
            data[i+1] = v;
            data[i+2] = v;
            data[i+3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    },

    toggle() {
        this.enabled = !this.enabled;
        const display = this.enabled ? 'block' : 'none';
        if (this.scanlineOverlay) this.scanlineOverlay.style.display = display;
        if (this.vignetteOverlay) this.vignetteOverlay.style.display = display;
        if (this.grainCanvas) this.grainCanvas.style.display = display;
    }
};

'''

# Insert SYSTEMS_CODE right before "init();\nanimate();"
code = code.replace(
    "init();\nanimate();",
    SYSTEMS_CODE + "\ninit();\nanimate();"
)

# ============================================
# 3. Add system initialization inside init()
# ============================================

# After "scene.add(group);" add zone + ghost + scare + CRT + audio init
INIT_SYSTEMS = r'''
    // === INITIALIZE GAME SYSTEMS ===
    CRTFilter.init();
    
    // Zone Lighting System
    ZoneSystem.init(group, cellSize, offsetX, offsetZ, roomHeight);
    
    // Ghost System
    GhostSystem.init(scene);
    GhostSystem.spawnNear(playerGroup.position, scene);

    // Audio System
    AudioManager.init(camera);
    // Load SFX (silent if files missing)
    AudioManager.loadSound('door_open', 'assets/audio/door_creak_open.ogg');
    AudioManager.loadSound('door_close', 'assets/audio/door_creak_close.ogg');
    AudioManager.loadSound('door_locked', 'assets/audio/door_locked.ogg');
    AudioManager.loadSound('item_pickup', 'assets/audio/item_pickup.ogg');
    AudioManager.loadSound('key_jingle', 'assets/audio/key_jingle.ogg');
    AudioManager.loadSound('switch_click', 'assets/audio/switch_click.ogg');
    AudioManager.loadSound('heartbeat', 'assets/audio/heartbeat_slow.ogg', true, 0.3);
    AudioManager.loadSound('ghost_whisper', 'assets/audio/ghost_whisper_1.ogg');
    AudioManager.loadSound('jump_scare', 'assets/audio/jump_scare_sting.ogg');
    // Load zone ambients
    AudioManager.loadAmbient('courtyard', 'assets/audio/ambient_main.ogg', 0.2);
    AudioManager.loadAmbient('hidden_room', 'assets/audio/ambient_basement.ogg', 0.3);
    AudioManager.loadAmbient('bathroom', 'assets/audio/ambient_main.ogg', 0.15);

    // Scripted Scare Events
    ScareManager.register('hallway_lights', {
        cMin: 7, cMax: 12, rMin: 5, rMax: 6,
        onTrigger: (scene, playerPos) => {
            // Flicker all lights off then back on
            ZoneSystem.lights.forEach(l => {
                const original = l.intensity;
                l.intensity = 0;
                setTimeout(() => { l.intensity = original * 0.3; }, 500);
                setTimeout(() => { l.intensity = 0; }, 800);
                setTimeout(() => { l.intensity = original; }, 1200);
            });
        }
    });
    ScareManager.register('tv_static', {
        cMin: 1, cMax: 5, rMin: 8, rMax: 10,
        onTrigger: (scene, playerPos) => {
            // TV in living room flickers (find TV and flash its emissive)
            interactables.forEach(obj => {
                if (obj.userData.id && obj.userData.id.includes('item_')) {
                    obj.traverse(child => {
                        if (child.isMesh && child.geometry && child.geometry.type === 'BoxGeometry') {
                            // Flash emissive briefly
                            if (child.material && !Array.isArray(child.material)) {
                                const origEmissive = child.material.emissive ? child.material.emissive.getHex() : 0;
                                child.material.emissive = new THREE.Color(0x224466);
                                setTimeout(() => {
                                    child.material.emissive = new THREE.Color(origEmissive);
                                }, 2000);
                            }
                        }
                    });
                }
            });
        }
    });
    ScareManager.register('ghost_appear', {
        cMin: 1, cMax: 11, rMin: 13, rMax: 17,
        onTrigger: (scene, playerPos) => {
            GhostSystem.spawnNear(playerPos, scene);
            GhostSystem.trigger('passive');
        }
    });
    ScareManager.register('dormitory_scare', {
        cMin: 25, cMax: 33, rMin: 15, rMax: 17,
        onTrigger: (scene, playerPos) => {
            // Ghost upgrades to stalking when entering dormitory
            if (GhostSystem.phase === 'passive' || GhostSystem.phase === 'dormant') {
                GhostSystem.spawnNear(playerPos, scene);
                GhostSystem.trigger('stalking');
            }
        }
    });

'''

code = code.replace(
    "    scene.add(group);\n    window.sceneGroup = group;",
    "    scene.add(group);\n    window.sceneGroup = group;\n" + INIT_SYSTEMS
)

# ============================================
# 4. Add system updates inside animate()
# ============================================

# Find the right place in animate - right before "prevTime = time;"
UPDATE_CODE = r'''
    // === GAME SYSTEMS UPDATE ===
    if (!isCreatorMode) {
        // Zone lighting smooth transitions
        ZoneSystem.update(playerGroup.position, scene, window.ambientLight, delta, 1.0, 17.5, 9.5);
        
        // Ghost AI
        GhostSystem.update(playerGroup.position, playerGroup, delta, camera);
        
        // Scare event triggers
        ScareManager.check(playerGroup.position, scene, delta, 1.0, 17.5, 9.5);
        
        // CRT film grain (update every few frames)
        if (Math.random() < 0.15) CRTFilter.updateGrain();
    }

'''

code = code.replace(
    "    prevTime = time;\n    // Door interaction logic",
    UPDATE_CODE + "    prevTime = time;\n    // Door interaction logic"
)

# ============================================
# 5. Add key binding for CRT toggle (G key) and audio mute (M key)
# ============================================

# Add to play mode keybindings
code = code.replace(
    "            case 'KeyV':",
    "            case 'KeyG':\n                CRTFilter.toggle();\n                break;\n            case 'KeyM':\n                AudioManager.toggleMute();\n                break;\n            case 'KeyV':"
)

# ============================================
# 6. Add audio hooks to existing interactions
# ============================================

# Door open sound
code = code.replace(
    "            door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, Math.PI / 2, 5 * delta);",
    "            door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, Math.PI / 2, 5 * delta);\n            if (!door.userData._openSoundPlayed) { AudioManager.playSFX('door_open'); door.userData._openSoundPlayed = true; }"
)
code = code.replace(
    "            door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, 0, 5 * delta);",
    "            door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, 0, 5 * delta);\n            door.userData._openSoundPlayed = false;",
    1  # Only replace first occurrence (the close one)
)

# Item pickup sound - add to registerPickupTarget onInteract
code = code.replace(
    "            target.userData.collected = true;",
    "            target.userData.collected = true;\n            AudioManager.playSFX('item_pickup');"
)

# ============================================
# 7. Add controls hint for new features
# ============================================
code = code.replace(
    "H: Hide/Show UI</span></div>",
    "H: Hide/Show UI<br>G: CRT Filter On/Off<br>M: Mute Audio<br>E: Interact</span></div>"
)

# ============================================
# 8. Fix the night vision toggle to work with zone system
# ============================================
# When night vision is ON, don't let zone system override
code = code.replace(
    "        // Zone lighting smooth transitions\n        ZoneSystem.update(playerGroup.position, scene, window.ambientLight, delta, 1.0, 17.5, 9.5);",
    "        // Zone lighting smooth transitions (skip during night vision)\n        if (!window.isNightVisionOn) {\n            ZoneSystem.update(playerGroup.position, scene, window.ambientLight, delta, 1.0, 17.5, 9.5);\n        }"
)

with open('psx.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done! All 6 systems added successfully.")
print("Systems added:")
print("  1. GLTF Model Loader (with fallback)")
print("  2. Audio Manager (silent fallback)")
print("  3. Zone Lighting System (9 zones)")
print("  4. Ghost/Threat System (3 phases)")
print("  5. Scripted Scare Events (4 events)")
print("  6. CRT Post-Processing (scanlines + vignette + grain)")
