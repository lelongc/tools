
window.addEventListener('error', function(e) {
    let errText = 'ERROR: ' + e.message + '\n at ' + e.filename + ':' + e.lineno;
    if (e.error && e.error.stack) errText += '\n' + e.error.stack;
    const errDiv = document.createElement('div');
    errDiv.style.position = 'absolute';
    errDiv.style.top = '10px';
    errDiv.style.left = '10px';
    errDiv.style.color = 'red';
    errDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    errDiv.style.padding = '10px';
    errDiv.style.zIndex = '9999';
    errDiv.style.maxWidth = '80vw';
    errDiv.style.wordWrap = 'break-word';
    
    const pre = document.createElement('pre');
    pre.textContent = errText;
    
    const btn = document.createElement('button');
    btn.textContent = 'Copy Log';
    btn.style.marginTop = '10px';
    btn.onclick = function() {
        navigator.clipboard.writeText(errText).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy Log', 2000);
        });
    };
    
    errDiv.appendChild(pre);
    errDiv.appendChild(btn);
    document.body.appendChild(errDiv);
});
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let transformControl;
const moveState = { forward: false, backward: false, left: false, right: false, shift: false, jump: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

let isCreatorMode = false;
let isSnapEnabled = false;
let isPointerLocked = false;
let playerVelocityY = 0;
let isGrounded = true;
let isChargingJump = false;
let jumpCharge = 0.0;
let stamina = 100;
let isExhausted = false;
let landingTimer = 0;
let maxLandingTimer = 0.3;
let landingImpact = 0;
const maxStamina = 100;

// Stamina UI
const staminaContainer = document.createElement('div');
staminaContainer.style.position = 'absolute';
staminaContainer.style.bottom = '20px';
staminaContainer.style.left = '50%';
staminaContainer.style.transform = 'translateX(-50%)';
staminaContainer.style.width = '300px';
staminaContainer.style.height = '15px';
staminaContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
staminaContainer.style.border = '2px solid #fff';
staminaContainer.style.zIndex = '1000';
staminaContainer.id = 'staminaContainer';
document.body.appendChild(staminaContainer);

const staminaBar = document.createElement('div');
staminaBar.style.width = '100%';
staminaBar.style.height = '100%';
staminaBar.style.backgroundColor = '#00ff00';
staminaBar.style.transition = 'width 0.1s linear, background-color 0.2s';
staminaBar.id = 'staminaBar';
staminaContainer.appendChild(staminaBar);
let isFPSView = false;

// Texture Cache for optimization
const loadedTextureCache = {};
const textureLoader = new THREE.TextureLoader();

function getOrCreateTexture(url, hasCustomUV) {
    if (!loadedTextureCache[url]) {
        const tex = textureLoader.load(url);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedTextureCache[url] = tex;
    }
    if (hasCustomUV) {
        const cloned = loadedTextureCache[url].clone();
        cloned.userData.isUnique = true;
        return cloned;
    }
    return loadedTextureCache[url];
}

// Undo system
const undoStack = [];
const MAX_UNDO = 30;
function pushUndo() {
    const state = [];
    interactables.forEach(obj => {
        const meshStates = [];
        obj.traverse(child => {
            if (child.isMesh) {
                const ft = child.userData.faceTextures ? JSON.parse(JSON.stringify(child.userData.faceTextures)) : null;
                const uv = child.userData.uvData ? JSON.parse(JSON.stringify(child.userData.uvData)) : null;
                meshStates.push({ uuid: child.uuid, faceTextures: ft, uvData: uv });
            }
        });
        state.push({
            id: obj.userData.id,
            pos: obj.position.clone(),
            rot: obj.rotation.clone(),
            meshStates
        });
    });
    undoStack.push(state);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
}
function undo() {
    if (undoStack.length === 0) return;
    const state = undoStack.pop();
    state.forEach(saved => {
        const obj = interactables.find(o => o.userData.id === saved.id);
        if (!obj) return;
        obj.position.copy(saved.pos);
        obj.rotation.copy(saved.rot);
        saved.meshStates.forEach(ms => {
            obj.traverse(child => {
                if (child.isMesh && child.uuid === ms.uuid) {
                    if (ms.faceTextures) {
                        child.userData.faceTextures = ms.faceTextures;
                        const loader = new THREE.TextureLoader();
                        if (!Array.isArray(child.material)) {
                            child.material = [child.material.clone(), child.material.clone(), child.material.clone(), child.material.clone(), child.material.clone(), child.material.clone()];
                        }
                        Object.keys(ms.faceTextures).forEach(fi => {
                            const tex = loader.load(ms.faceTextures[fi]);
                            tex.magFilter = THREE.NearestFilter;
                            tex.minFilter = THREE.NearestFilter;
                            tex.colorSpace = THREE.SRGBColorSpace;
                            child.material[fi] = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                        });
                        child.userData.originalMat = child.material;
                    }
                    if (ms.uvData) child.userData.uvData = ms.uvData;
                }
            });
        });
    });
    savePositions();
}

// Custom Editor Camera Variables
let isRightMouseDown = false;
let isZooming = false;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

// TPS Player Variables
let playerGroup, cameraArm;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const interactables = [];
const doors = []; 

init();
animate();

function init() {
    const renderWidth = 320; 
    
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(renderWidth, renderWidth * (window.innerHeight / window.innerWidth), false);
    renderer.setPixelRatio(1);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    scene.fog = new THREE.FogExp2(0x020202, 0.15); 

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

    // ==========================================
    // CAMERAS & PLAYER SETUP
    // ==========================================
    
    playerGroup = new THREE.Group();
    playerGroup.position.set(1.5, 0, 1.5); 
    scene.add(playerGroup);

    cameraArm = new THREE.Group();
    cameraArm.position.set(0, 0.1, 0); 
    playerGroup.add(cameraArm);

    cameraArm.add(camera);
    camera.position.set(0, 0.25, 2); 
    window.defaultCamPos = new THREE.Vector3(0, 0.25, 2);
    window.fpsCamPos = new THREE.Vector3(0, 0.15, -0.35); 

    const cat = createCat();
    playerGroup.add(cat);
    window.psxCat = cat;

    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', function (event) {
        if (event.value) {
            pushUndo();
        } else if (!event.value && transformControl.object) {
            savePositions();
        }
    });
    scene.add(transformControl);

    document.addEventListener('contextmenu', e => e.preventDefault());

    const info = document.getElementById('info');
    info.addEventListener('click', () => {
        if (!isCreatorMode && document.getElementById('uv-editor').style.display !== 'block') {
            document.body.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === document.body;
        if (!isCreatorMode) {
            if (isPointerLocked) {
                info.style.display = 'none';
                document.getElementById('crosshair').style.display = 'block';
            } else {
                info.style.display = 'block';
                document.getElementById('crosshair').style.display = 'none';
                moveState.forward = false; moveState.backward = false; moveState.left = false; moveState.right = false;
            }
        }
    });

    const ambientLight = new THREE.AmbientLight(0x223322, 0.02);
    scene.add(ambientLight);
    window.ambientLight = ambientLight;

    // Cat Eye Night Vision state
    window.isNightVisionOn = false;
    
    // Dimmer background and fog
    scene.background = new THREE.Color(0x050805);
    scene.fog = new THREE.FogExp2(0x050805, 0.12);

    const textureLoader = new THREE.TextureLoader();
    const loadPSXTexture = (path, repeatX, repeatY) => {
        const tex = textureLoader.load(path);
        tex.magFilter = THREE.NearestFilter; 
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false; 
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    };

    const wallTex = loadPSXTexture('assets/wall_creepy.png', 4, 1);
    const floorTex = loadPSXTexture('assets/floor_creepy.png', 8, 8);
    const ceilTex = loadPSXTexture('assets/ceil_damaged.png', 8, 8);

    const wallMat = new THREE.MeshLambertMaterial({ map: wallTex });
    const floorMat = new THREE.MeshLambertMaterial({ map: floorTex });
    const ceilMat = new THREE.MeshLambertMaterial({ map: ceilTex });

    const stoneWallMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/wall_stone.png', 4, 1) });
    const hallwayWallMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/wall_hallway.png', 4, 1) });
    const concreteFloorMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/floor_concrete.png', 8, 8) });
    const rottingWoodMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/wood_rotting.png', 2, 2) });
    const rustMetalMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/metal_rust.png', 2, 2) });
    const stainFabricMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/fabric_stain.png', 2, 2) });
    const darkFabricMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/fabric_dark.png', 2, 2) });
    const dirtyTileMat = new THREE.MeshLambertMaterial({ map: loadPSXTexture('assets/tile_dirty.png', 4, 4) });

    const roomSize = 40;
    const roomHeight = 6;
    const group = new THREE.Group();

    // Floor and Ceiling for the whole 40x40 area
    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.userData = { id: 'floor', isFurniture: true };
    interactables.push(floor);
    group.add(floor);

    const ceil = new THREE.Mesh(floorGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = roomHeight;
    ceil.userData = { id: 'ceil', isFurniture: true };
    interactables.push(ceil);
    group.add(ceil);

    // === GRID BLUEPRINT SYSTEM ===
    const cellSize = 1.0;
    // Map is 10x10. Each character is a 4x4 cell.
    // X goes from left (-20) to right (20)
    // Z goes from front (-20) to back (20)
    const blueprint = [
        "WWWWWWWWWW", // Z = -18 (Outer Back Wall)
        "WbbbbWsssW", // Z = -14 (Bathroom | Bedroom)
        "WbbbbWsssW", // Z = -10
        "WbbbbWsssW", // Z = -6
        "WWWDWWWDWW", // Z = -2 (Dividing Wall with Doors)
        "Wkkk.....W", // Z = 2  (Kitchen | Living Room)
        "Wkkk.....W", // Z = 6
        "Wkkk.....W", // Z = 10
        "Wkkk.....W", // Z = 14
        "WWWWDWWWWW"  // Z = 18 (Outer Front Wall)
    ];

    const createBlockWall = (x, z, mat, id) => {
        const geo = new THREE.BoxGeometry(cellSize, roomHeight, cellSize);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, roomHeight/2, z);
        mesh.userData = { id: id, isFurniture: true };
        interactables.push(mesh);
        group.add(mesh);
    };

    let wallCount = 0;
    let fCount = 0;
    const addF = (obj, x, z, rotY = 0) => {
        obj.position.set(x, 0, z);
        obj.rotation.y = rotY;
        if(!obj.userData.id) obj.userData.id = `item_${fCount++}`;
        obj.userData.isFurniture = true;
        interactables.push(obj);
        group.add(obj);
    };

    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            const char = blueprint[r][c];
            const x = (c - 4.5) * cellSize;
            const z = (r - 4.5) * cellSize;

            if (char === 'W') {
                createBlockWall(x, z, rottingWoodMat, `wall_block_${wallCount++}`);
            } else if (char === 'D') {
                // Place a door!
                const doorObj = createDoor(rottingWoodMat);
                if (r > 0 && r < 9 && (blueprint[r-1][c] === 'W' || blueprint[r+1][c] === 'W')) {
                    doorObj.rotation.y = Math.PI / 2;
                }
                addF(doorObj, x, z);
            }
        }
    }

    // === FURNITURE PLACEMENT ===
    
    // Kitchen (left side, z>0)
    addF(createFridge(rustMetalMat), -2.625, 2.625);
    addF(createKitchenCounter(rottingWoodMat), -1.875, 2.625);
    addF(createKitchenCounter(rottingWoodMat), -1.125, 2.625);
    addF(createStove(rustMetalMat), -10.5, 7.5, Math.PI/2);
    addF(createTable(rottingWoodMat), -1.875, 1.125);
    addF(createChair(rottingWoodMat), -9, 4.5, Math.PI/2);
    addF(createChair(rottingWoodMat), -6, 4.5, -Math.PI/2);
    addF(createTrashCan(rustMetalMat), -2.625, 1.125);

    // Living Room (right side, z>0)
    addF(createRug(stainFabricMat, 6, 6), 10, 10);
    addF(createSofa(darkFabricMat), 6, 9, -Math.PI/2);
    addF(createTV(rustMetalMat), 10.5, 9, Math.PI/2);
    addF(createCoffeeTable(rottingWoodMat), 2.0625, 2.25);
    addF(createClock(rottingWoodMat), 10.5, 3, -Math.PI/4);
    addF(createLamp(), 2.625, 3.0);
    const p1 = createPainting(rottingWoodMat); p1.position.y = 2;
    addF(p1, 11.925, 6, -Math.PI/2); // On the right outer wall
    addF(createDeadPlant(rottingWoodMat, rustMetalMat), 14, 15.5);
    const window2 = createBoardedWindow(rottingWoodMat);
    window2.position.y = 2.5;
    addF(window2, 11.925, 7.5, -Math.PI/2);

    // Bathroom (left side, z<0)
    addF(createBathtub(rustMetalMat), -2.625, -2.625);
    addF(createToilet(dirtyTileMat), -2.625, -1.125);
    addF(createSink(dirtyTileMat), -4.5, -10.5, -Math.PI/2);
    addF(createMirror(dirtyTileMat), -1.575, -10.5, -Math.PI/2);
    addF(createTrashCan(rustMetalMat), -1.875, -3.0);

    // Bedroom (right side, z<0)
    addF(createRug(darkFabricMat, 4.5, 4.5), 10, -10);
    addF(createBed(stainFabricMat), 10.5, -10.5, -Math.PI/2);
    addF(createNightstand(rottingWoodMat), 10.5, -7.5, -Math.PI/2);
    addF(createWardrobe(rottingWoodMat), 4.5, -10.5, Math.PI/2);
    addF(createDresser(rottingWoodMat), 10.5, -6, -Math.PI/2);
    addF(createChair(rottingWoodMat), 6, -4.5, Math.PI);
    
    // Add a boarded window in the bedroom
    const window1 = createBoardedWindow(rottingWoodMat);
    window1.position.y = 2.5;
    addF(window1, 11.925, -7.5, -Math.PI/2);

    // === CAGE AND OWNER ===
    const cage = createCage(rustMetalMat);
    addF(cage, 2.625, -2.625); // In the corner of the bedroom

    const owner = createOwner(stainFabricMat);
    addF(owner, 2.625, -2.625); // Inside the cage

    // === DUST PARTICLES ===
    const dustCount = 1500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
        dustPos[i] = (Math.random() - 0.5) * 40; // Spread across 40x40 area
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    dustParticles.position.y = 3;
    group.add(dustParticles);
    window.dustParticles = dustParticles;

    scene.add(group);
    window.sceneGroup = group;

    loadPositions();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
}

// ==========================================
// CREATOR MODE LOGIC (UNITY STYLE)
// ==========================================

let isUIHidden = false;
function toggleUIVisibility() {
    isUIHidden = !isUIHidden;
    const info = document.getElementById('info');
    const creator = document.getElementById('creator-label');
    
    if (isUIHidden) {
        info.style.opacity = '0';
        creator.style.opacity = '0';
        info.style.pointerEvents = 'none';
        creator.style.pointerEvents = 'none';
    } else {
        info.style.opacity = '1';
        creator.style.opacity = '1';
        info.style.pointerEvents = 'auto';
        creator.style.pointerEvents = 'auto';
    }
}

function toggleCreatorMode() {
    isCreatorMode = !isCreatorMode;
    const creatorLabel = document.getElementById('creator-label');
    const crosshair = document.getElementById('crosshair');
    const info = document.getElementById('info');

    if (isCreatorMode) {
        document.exitPointerLock();
        scene.attach(camera); 
        
        creatorLabel.style.display = 'block';
        crosshair.style.display = 'none';
        info.style.display = 'none';
    } else {
        closeUVEditor();
        transformControl.detach();
        document.body.requestPointerLock();
        
        cameraArm.add(camera);
        camera.position.set(0, 0.25, 2); 
        camera.rotation.set(0, 0, 0);
        camera.quaternion.identity();
        
        creatorLabel.style.display = 'none';
        crosshair.style.display = 'block';
    }
}

function toggleSnap() {
    isSnapEnabled = !isSnapEnabled;
    const status = document.getElementById('snap-status');
    if (isSnapEnabled) {
        transformControl.setTranslationSnap(0.5);
        transformControl.setRotationSnap(THREE.MathUtils.degToRad(45));
        status.innerText = "(ON)";
        status.style.color = "#00ff00";
    } else {
        transformControl.setTranslationSnap(null);
        transformControl.setRotationSnap(null);
        status.innerText = "(OFF)";
        status.style.color = "red";
    }
}

function onMouseDown(event) {
    if (document.getElementById('uv-editor').style.display === 'flex') return;
    if (!isCreatorMode) return;
    
    if (event.button === 1) isRightMouseDown = true; 
    if (event.ctrlKey) isZooming = true;

    if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        if (transformControl.dragging || transformControl.axis !== null) {
            return;
        }
        
        const objectsToTest = [...interactables];
        if (window.psxCat) objectsToTest.push(window.psxCat);
        
        const intersects = raycaster.intersectObjects(objectsToTest, true);

        if (event.altKey) {
            // UV Editor Trigger
            if (intersects.length > 0) {
                const hit = intersects[0];
                const mesh = hit.object;
                if (!mesh.geometry) return;
                const faceIdx = mesh.geometry.type === 'BoxGeometry' ? Math.floor(hit.faceIndex / 2) : 0;
                window.openUVEditor(mesh, faceIdx);
            }
            return;
        }

        // Texture Palette: apply selected texture on click
        if (selectedPaletteTexture && intersects.length > 0) {
            const hit = intersects[0];
            let target = getFurnitureParent(hit.object);
            if (!target) target = hit.object; // Fallback cho mèo hoặc object tự do
            
            if (target) {
                pushUndo();
                const tex = getOrCreateTexture(selectedPaletteTexture, false);
                target.traverse((child) => {
                    if (child.isMesh && child.geometry) {
                        const isBox = child.geometry.type === 'BoxGeometry';
                        if (isBox) {
                            if (!Array.isArray(child.material)) {
                                child.material = [
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                    new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff })
                                ];
                            } else {
                                for (let i = 0; i < 6; i++) {
                                    child.material[i] = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                                }
                            }
                            if (child.userData.originalMat) child.userData.originalMat = null;
                            if (!child.userData.faceTextures) child.userData.faceTextures = {};
                            for (let i = 0; i < 6; i++) {
                                child.userData.faceTextures[i] = selectedPaletteTexture;
                                if (child.userData.uvData && child.userData.uvData[i]) {
                                    delete child.userData.uvData[i];
                                }
                            }
                        } else {
                            child.material = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                            if (child.userData.originalMat) child.userData.originalMat = null;
                            if (!child.userData.faceTextures) child.userData.faceTextures = {};
                            child.userData.faceTextures[0] = selectedPaletteTexture;
                            if (child.userData.uvData && child.userData.uvData[0]) {
                                delete child.userData.uvData[0];
                            }
                        }
                        child.userData.originalMat = child.material;
                    }
                });
                savePositions();
            }
            return;
        }

        // Selection Trigger
        if (intersects.length > 0) {
            const target = getFurnitureParent(intersects[0].object);
            if (target) {
                transformControl.attach(target);
                
                target.traverse((child) => {
                    if (child.isMesh) {
                        if(!child.userData.originalMat) child.userData.originalMat = child.material;
                        child.material = Array.isArray(child.material) ? child.material.map(m => m.clone()) : child.material.clone(); 
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => m.emissive.setHex(0x555555));
                        } else {
                            child.material.emissive.setHex(0x555555);
                        }
                    }
                });
                setTimeout(() => {
                    target.traverse((child) => {
                        if (child.isMesh && child.userData.originalMat) {
                            child.material = child.userData.originalMat;
                        }
                    });
                }, 200);
            }
        } else {
            transformControl.detach();
        }
    }
}

function onMouseUp(event) {
    if (event.button === 1) isRightMouseDown = false;
    isZooming = false;
}

function onMouseMove(event) {
    if (document.getElementById('uv-editor').style.display === 'flex') return;
    if (isCreatorMode) {
        if (event.ctrlKey && event.buttons > 0) {
            const zoomSpeed = 0.02;
            const delta = (Math.abs(event.movementX) > Math.abs(event.movementY)) ? event.movementX : -event.movementY;
            camera.translateZ(delta * zoomSpeed);
            return; 
        }

        if (event.shiftKey && event.buttons > 0) {
            const panSpeed = 0.02;
            camera.translateX(-event.movementX * panSpeed);
            camera.translateY(event.movementY * panSpeed);
            return;
        }

        if (isRightMouseDown) {
            euler.setFromQuaternion(camera.quaternion);
            euler.y -= event.movementX * 0.002;
            euler.x -= event.movementY * 0.002;
            euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
            camera.quaternion.setFromEuler(euler);
        }
    } else if (isPointerLocked) {
        const turnSpeed = event.movementX * 0.003;
        playerGroup.rotation.y -= turnSpeed;
        cameraArm.rotation.x -= event.movementY * 0.003;
        cameraArm.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 8, cameraArm.rotation.x));
        
        if (window.psxCat) {
            window.psxCat.userData.turnTarget = turnSpeed;
        }
    }
}

window.addEventListener('wheel', (event) => {
    if (isCreatorMode) {
        camera.translateZ(event.deltaY * 0.01);
    }
});

// ==========================================
// DRAG & DROP TEXTURE PAINTING
// ==========================================

window.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!isCreatorMode) {
        alert("Bật Creator Mode (nhấn C) để dán Texture!");
        return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (!file.type.match('image.*')) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target.result;
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;
                if (w > 256 || h > 256) {
                    const ratio = Math.min(256 / w, 256 / h);
                    w = Math.floor(w * ratio);
                    h = Math.floor(h * ratio);
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);

                const objectsToTest = [...interactables];
                if (window.psxCat) objectsToTest.push(window.psxCat);
                const intersects = raycaster.intersectObjects(objectsToTest, true);
                if (intersects.length > 0) {
                    pushUndo();
                    const hit = intersects[0];
                    let target = getFurnitureParent(hit.object);
                    if (!target) target = hit.object;
                    
                    const tex = getOrCreateTexture(dataUrl, false);
                    target.traverse((child) => {
                        if (child.isMesh && child.geometry) {
                            const isBox = child.geometry.type === 'BoxGeometry';
                            if (isBox) {
                                if (!Array.isArray(child.material)) {
                                    child.material = [
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff }),
                                        new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff })
                                    ];
                                } else {
                                    for (let i = 0; i < 6; i++) {
                                        child.material[i] = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                                    }
                                }
                                if (child.userData.originalMat) child.userData.originalMat = null;
                                if (!child.userData.faceTextures) child.userData.faceTextures = {};
                                for (let i = 0; i < 6; i++) {
                                    child.userData.faceTextures[i] = dataUrl;
                                    if (child.userData.uvData && child.userData.uvData[i]) {
                                        delete child.userData.uvData[i];
                                    }
                                }
                            } else {
                                child.material = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                                if (child.userData.originalMat) child.userData.originalMat = null;
                                if (!child.userData.faceTextures) child.userData.faceTextures = {};
                                child.userData.faceTextures[0] = dataUrl;
                                if (child.userData.uvData && child.userData.uvData[0]) {
                                    delete child.userData.uvData[0];
                                }
                            }
                            child.userData.originalMat = child.material;
                        }
                    });
                    savePositions();
                }
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    }
});

// ==========================================
// UV EDITOR UI (SPLIT SCREEN 3D)
// ==========================================

let uvScene, uvCamera, uvRenderer, uvControls;
let uvPreviewTarget = null;
let uvCloneMap = new Map();
let activePreviewMesh = null;
let activePreviewCloneMesh = null;
let activePreviewFace = -1;

let uvBox = { cx: 50, cy: 50, w: 100, h: 100, rotation: 0 };
let isDraggingUV = false;
let isResizingUV = false;
let isRotatingUV = false;
let lastMouse = { x: 0, y: 0 };

function initUVPreview() {
    const container = document.getElementById('uv-3d-preview');
    if (uvRenderer) return;

    uvRenderer = new THREE.WebGLRenderer({ antialias: true });
    uvRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(uvRenderer.domElement);

    uvScene = new THREE.Scene();
    uvScene.background = new THREE.Color(0x333333);

    uvCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    uvCamera.position.set(2, 2, 2);

    uvControls = new OrbitControls(uvCamera, uvRenderer.domElement);
    uvControls.enableDamping = true;
    uvControls.dampingFactor = 0.1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    uvScene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    uvScene.add(dirLight);

    container.addEventListener('mousedown', onUVPreviewClick);
}

function onUVPreviewClick(event) {
    const container = document.getElementById('uv-3d-preview');
    const rect = container.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const my = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    const uvRaycaster = new THREE.Raycaster();
    uvRaycaster.setFromCamera(new THREE.Vector2(mx, my), uvCamera);

    if (!uvPreviewTarget) return;

    const intersects = uvRaycaster.intersectObject(uvPreviewTarget, true);
    if (intersects.length > 0) {
        const hit = intersects[0];
        const cloneMesh = hit.object;
        if (!cloneMesh.geometry) return;

        const isBox = cloneMesh.geometry.type === 'BoxGeometry';
        const faceIdx = isBox ? Math.floor(hit.faceIndex / 2) : 0;
        activePreviewMesh = uvCloneMap.get(cloneMesh);
        activePreviewCloneMesh = cloneMesh;
        activePreviewFace = faceIdx;

        syncUVBoxFromMesh();
    }
}

window.openUVEditor = function(mesh, defaultFaceIdx = 0) {
    let target = getFurnitureParent(mesh);
    if (!target) {
        if (window.psxCat) {
            window.psxCat.traverse(child => {
                if (child === mesh) target = window.psxCat;
            });
        }
        if (!target) target = mesh;
    }

    let texUrl = null;
    target.traverse(child => {
        if (!texUrl && child.userData.faceTextures) {
            texUrl = child.userData.faceTextures[0] || child.userData.faceTextures[4];
        }
    });
    if (!texUrl) {
        alert("Bạn cần dán Texture (Kéo thả hoặc dùng Palette) cho object này trước khi chỉnh UV!");
        return;
    }

    const img = document.getElementById('uv-img');
    img.onload = () => {
        const editorEl = document.getElementById('uv-editor');
        editorEl.style.display = 'flex';
        // Block background events from bubbling up for wheel only, let mouse bubble for drag logic
        editorEl.onwheel = e => {
            if (!e.ctrlKey) e.stopPropagation();
        };

        // Allow Ctrl+Scroll to zoom UV Image
        const uvScroll = document.getElementById('uv-scroll-container');
        uvScroll.onwheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                window.zoomUV(e.deltaY > 0 ? -0.1 : 0.1);
            }
        };

        if(isCreatorMode) transformControl.detach();

        initUVPreview();

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        document.getElementById('uv-wrapper').style.width = w + 'px';
        document.getElementById('uv-wrapper').style.height = h + 'px';

        // Setup 3D Clone
        if (uvPreviewTarget) uvScene.remove(uvPreviewTarget);
        uvPreviewTarget = target.clone();
        
        // Ensure clone root is visible
        uvPreviewTarget.visible = true;
        const basicMatCache = new Map();
        uvPreviewTarget.traverse(child => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(mat => {
                        if (basicMatCache.has(mat)) return basicMatCache.get(mat);
                        const newMat = new THREE.MeshBasicMaterial({
                            map: mat.map,
                            color: mat.color,
                            transparent: mat.transparent,
                            opacity: mat.opacity,
                            side: mat.side
                        });
                        basicMatCache.set(mat, newMat);
                        return newMat;
                    });
                } else {
                    if (basicMatCache.has(child.material)) {
                        child.material = basicMatCache.get(child.material);
                    } else {
                        const newMat = new THREE.MeshBasicMaterial({
                            map: child.material.map,
                            color: child.material.color,
                            transparent: child.material.transparent,
                            opacity: child.material.opacity,
                            side: child.material.side
                        });
                        basicMatCache.set(child.material, newMat);
                        child.material = newMat;
                    }
                }
            }
        });

        uvCloneMap.clear();
        const origMeshes = []; target.traverse(m => origMeshes.push(m));
        const cloneMeshes = []; uvPreviewTarget.traverse(m => cloneMeshes.push(m));
        for(let i=0; i<origMeshes.length; i++) uvCloneMap.set(cloneMeshes[i], origMeshes[i]);

        // Center clone
        const box = new THREE.Box3().setFromObject(uvPreviewTarget);
        const center = box.getCenter(new THREE.Vector3());
        if (isNaN(center.x) || isNaN(center.y) || isNaN(center.z)) {
            center.set(0, 0, 0);
        }
        uvPreviewTarget.position.sub(center);
        uvScene.add(uvPreviewTarget);

        uvCamera.position.set(2, 2, 2);
        uvControls.target.set(0,0,0);
        
        const container = document.getElementById('uv-3d-preview');
        uvCamera.aspect = container.clientWidth / container.clientHeight;
        uvCamera.updateProjectionMatrix();
        uvRenderer.setSize(container.clientWidth, container.clientHeight);

        activePreviewMesh = mesh;
        activePreviewFace = defaultFaceIdx;
        
        let correspondingClone = null;
        for (let [cloneM, origM] of uvCloneMap.entries()) {
            if (origM === mesh) {
                correspondingClone = cloneM;
                break;
            }
        }
        activePreviewCloneMesh = correspondingClone;

        if (activePreviewMesh) {
            syncUVBoxFromMesh();
        } else {
            document.getElementById('uv-box').style.display = 'none';
        }
    };
    img.src = texUrl;
};

window.closeUVEditor = function() {
    document.getElementById('uv-editor').style.display = 'none';
    activePreviewMesh = null;
    activePreviewFace = -1;
};

function syncUVBoxFromMesh() {
    if (!activePreviewMesh || activePreviewFace === -1) return;
    
    const w = document.getElementById('uv-img').naturalWidth;
    const h = document.getElementById('uv-img').naturalHeight;

    if (activePreviewMesh.userData.uvData && activePreviewMesh.userData.uvData[activePreviewFace]) {
        const data = activePreviewMesh.userData.uvData[activePreviewFace];
        uvBox.w = data.repeat[0] * w;
        uvBox.h = data.repeat[1] * h;
        
        let u_center, v_center;
        if (data.v2) {
            u_center = data.offset[0] + 0.5;
            v_center = data.offset[1] + 0.5;
        } else if (data.rotation === undefined) {
            u_center = data.offset[0] + data.repeat[0] / 2;
            v_center = data.offset[1] + data.repeat[1] / 2;
        } else {
            u_center = data.offset[0] + 0.5;
            v_center = data.offset[1] + 0.5;
        }
        
        let raw_cx = u_center * w;
        let raw_cy = (1.0 - v_center) * h;
        
        uvBox.cx = Math.max(uvBox.w/2, Math.min(w - uvBox.w/2, raw_cx));
        uvBox.cy = Math.max(uvBox.h/2, Math.min(h - uvBox.h/2, raw_cy));
        uvBox.rotation = data.rotation || 0; 
    } else {
        uvBox = { cx: w/2, cy: h/2, w: w/2, h: h/2, rotation: 0 };
        setTimeout(() => { updateUVOnMesh(); savePositions(); }, 10);
    }

    document.getElementById('uv-box').style.display = 'block';
    updateUVDOM();
}

function updateUVDOM() {
    const boxEl = document.getElementById('uv-box');
    boxEl.style.width = uvBox.w + 'px';
    boxEl.style.height = uvBox.h + 'px';
    boxEl.style.left = (uvBox.cx - uvBox.w / 2) + 'px';
    boxEl.style.top = (uvBox.cy - uvBox.h / 2) + 'px';
    boxEl.style.transform = `rotate(${uvBox.rotation}rad)`;
    boxEl.style.background = 'rgba(255, 0, 0, 0.2)'; // Add translucent background to capture clicks
}

const uvBoxEl = document.getElementById('uv-box');
const uvHandle = document.getElementById('uv-handle');
const uvRotateHandle = document.getElementById('uv-rotate-handle');

if (uvBoxEl && uvHandle && uvRotateHandle) {
    uvBoxEl.addEventListener('mousedown', (e) => {
        if (e.target === uvHandle || e.target === uvRotateHandle) return;
        isDraggingUV = true;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    uvHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizingUV = true;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    uvRotateHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isRotatingUV = true;
    });

    window.addEventListener('mousemove', (e) => {
        if (!activePreviewMesh) return;
        if (!isDraggingUV && !isResizingUV && !isRotatingUV) return;
        
        e.preventDefault();

        const wrapperRect = document.getElementById('uv-wrapper').getBoundingClientRect();
        const screenCX = wrapperRect.left + uvBox.cx;
        const screenCY = wrapperRect.top + uvBox.cy;

        if (isRotatingUV) {
            const angle = Math.atan2(e.clientY - screenCY, e.clientX - screenCX);
            uvBox.rotation = angle + Math.PI / 2;
        } else {
            const scale = window.uvZoomScale || 1.0;
            const dx = (e.clientX - lastMouse.x) / scale;
            const dy = (e.clientY - lastMouse.y) / scale;
            lastMouse = { x: e.clientX, y: e.clientY };
            
            if (isResizingUV) {
                const cosR = Math.cos(-uvBox.rotation);
                const sinR = Math.sin(-uvBox.rotation);
                const local_dx = dx * cosR - dy * sinR;
                const local_dy = dx * sinR + dy * cosR;

                const new_w = Math.max(5, uvBox.w + local_dx);
                const actual_dx = new_w - uvBox.w;
                const new_h = Math.max(5, uvBox.h + local_dy);
                const actual_dy = new_h - uvBox.h;

                uvBox.w = new_w;
                uvBox.h = new_h;

                const cosRot = Math.cos(uvBox.rotation);
                const sinRot = Math.sin(uvBox.rotation);
                const shift_x = (actual_dx / 2) * cosRot - (actual_dy / 2) * sinRot;
                const shift_y = (actual_dx / 2) * sinRot + (actual_dy / 2) * cosRot;

                uvBox.cx += shift_x;
                uvBox.cy += shift_y;
            } else if (isDraggingUV) {
                uvBox.cx += dx;
                uvBox.cy += dy;
            }
        }
        
        updateUVDOM();
        updateUVOnMesh();
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingUV || isResizingUV || isRotatingUV) {
            isDraggingUV = false;
            isResizingUV = false;
            isRotatingUV = false;
            savePositions();
        }
    });
}

function updateUVOnMesh() {
    if (!activePreviewMesh || activePreviewFace === -1) return;
    const w = document.getElementById('uv-img').naturalWidth;
    const h = document.getElementById('uv-img').naturalHeight;
    if (w === 0 || h === 0) return;
    
    const isBox = activePreviewMesh.geometry.type === 'BoxGeometry';

    if (isBox) {
        if (!Array.isArray(activePreviewMesh.material)) {
            const matArray = [
                activePreviewMesh.material.clone(), activePreviewMesh.material.clone(),
                activePreviewMesh.material.clone(), activePreviewMesh.material.clone(),
                activePreviewMesh.material.clone(), activePreviewMesh.material.clone()
            ];
            activePreviewMesh.material = matArray;
            activePreviewMesh.userData.originalMat = matArray;
            
            if (activePreviewCloneMesh) {
                activePreviewCloneMesh.material = matArray.map(mat => {
                    return new THREE.MeshBasicMaterial({
                        map: mat.map,
                        color: mat.color,
                        transparent: mat.transparent,
                        opacity: mat.opacity,
                        side: mat.side
                    });
                });
            }
        }
    } else {
        // Non-box mesh has a single material. If it's a clone, make sure it is a MeshBasicMaterial
        if (activePreviewCloneMesh && activePreviewCloneMesh.material && !activePreviewCloneMesh.material.isMeshBasicMaterial) {
            const origMat = activePreviewMesh.material;
            activePreviewCloneMesh.material = new THREE.MeshBasicMaterial({
                map: origMat.map,
                color: origMat.color,
                transparent: origMat.transparent,
                opacity: origMat.opacity,
                side: origMat.side
            });
        }
    }

    const u_center = uvBox.cx / w;
    const v_center = 1.0 - (uvBox.cy / h);
    const u_repeat = uvBox.w / w;
    const v_repeat = uvBox.h / h;
    const u_offset = u_center - 0.5;
    const v_offset = v_center - 0.5;
    
    if (!activePreviewMesh.userData.uvData) activePreviewMesh.userData.uvData = {};
    activePreviewMesh.userData.uvData[activePreviewFace] = {
        offset: [u_offset, v_offset],
        repeat: [u_repeat, v_repeat],
        rotation: uvBox.rotation,
        v2: true
    };
    
    let faceMaterial = Array.isArray(activePreviewMesh.material) ? activePreviewMesh.material[activePreviewFace] : activePreviewMesh.material;

    let tex = faceMaterial ? faceMaterial.map : null;
    if (tex) {
        if (!tex.userData.isUnique) {
            tex = tex.clone();
            tex.userData.isUnique = true;
            
            if (Array.isArray(activePreviewMesh.material)) {
                activePreviewMesh.material[activePreviewFace] = activePreviewMesh.material[activePreviewFace].clone();
                activePreviewMesh.material[activePreviewFace].map = tex;
            } else {
                activePreviewMesh.material = activePreviewMesh.material.clone();
                activePreviewMesh.material.map = tex;
            }
            
            if (activePreviewCloneMesh) {
                const sourceMat = Array.isArray(activePreviewMesh.material) ? activePreviewMesh.material[activePreviewFace] : activePreviewMesh.material;
                const newBasicMat = new THREE.MeshBasicMaterial({
                    map: tex,
                    color: sourceMat.color,
                    transparent: sourceMat.transparent,
                    opacity: sourceMat.opacity,
                    side: sourceMat.side
                });
                if (Array.isArray(activePreviewCloneMesh.material)) {
                    activePreviewCloneMesh.material[activePreviewFace] = newBasicMat;
                } else {
                    activePreviewCloneMesh.material = newBasicMat;
                }
            }
        }
    } else {
        const dataUrl = document.getElementById('uv-img').src;
        if (dataUrl && dataUrl.startsWith('data:')) {
            if (!activePreviewMesh.userData.faceTextures) activePreviewMesh.userData.faceTextures = {};
            activePreviewMesh.userData.faceTextures[activePreviewFace] = dataUrl;
            
            tex = getOrCreateTexture(dataUrl, true);
            const newLambert = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
            const newBasic = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff });

            if (Array.isArray(activePreviewMesh.material)) {
                activePreviewMesh.material[activePreviewFace] = newLambert;
            } else {
                activePreviewMesh.material = newLambert;
            }

            if (activePreviewCloneMesh) {
                if (Array.isArray(activePreviewCloneMesh.material)) {
                    activePreviewCloneMesh.material[activePreviewFace] = newBasic;
                } else {
                    activePreviewCloneMesh.material = newBasic;
                }
            }
        }
    }

    if (tex) {
        tex.offset.set(u_offset, v_offset);
        tex.repeat.set(u_repeat, v_repeat);
        tex.center.set(0.5, 0.5);
        tex.rotation = uvBox.rotation;
        tex.needsUpdate = true;
    }
}

// ==========================================
// SCENE AND KEYBOARD LOGIC
// ==========================================

function onKeyDown(event) {
    // Ctrl+Z Undo
    if (event.ctrlKey && event.code === 'KeyZ') {
        event.preventDefault();
        undo();
        return;
    }

    if (document.getElementById('uv-editor').style.display === 'flex') {
        if (event.code === 'KeyR' && activePreviewMesh && activePreviewFace !== -1) {
            uvBox.rotation += Math.PI / 2;
            updateUVDOM();
            updateUVOnMesh();
            savePositions();
        }
        return; // block inputs when editing UV
    }

    if (isCreatorMode) {
        switch (event.code) {
            case 'KeyC': toggleCreatorMode(); break;
            case 'KeyH': toggleUIVisibility(); break;
            case 'KeyP': toggleTexturePalette(); break;
            case 'KeyF': toggleNightVision(); break;
            case 'KeyT': transformControl.setMode('translate'); break;
            case 'KeyR': transformControl.setMode('rotate'); break;
            case 'KeyX': toggleSnap(); break;
            case 'ArrowUp':
            case 'KeyW': moveState.forward = true; break;
            case 'ArrowLeft':
            case 'KeyA': moveState.left = true; break;
            case 'ArrowDown':
            case 'KeyS': moveState.backward = true; break;
            case 'ArrowRight':
            case 'KeyD': moveState.right = true; break;
        }
    } else {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': 
                moveState.forward = true; 
                if (isChargingJump) { isChargingJump = false; jumpCharge = 0.0; }
                break;
            case 'ArrowLeft':
            case 'KeyA': 
                moveState.left = true; 
                if (isChargingJump) { isChargingJump = false; jumpCharge = 0.0; }
                break;
            case 'ArrowDown':
            case 'KeyS': 
                moveState.backward = true; 
                if (isChargingJump) { isChargingJump = false; jumpCharge = 0.0; }
                break;
            case 'ArrowRight':
            case 'KeyD': 
                moveState.right = true; 
                if (isChargingJump) { isChargingJump = false; jumpCharge = 0.0; }
                break;
            case 'ShiftLeft': moveState.shift = true; break;
            case 'KeyF': toggleNightVision(); break;
            case 'KeyH': toggleUIVisibility(); break;
            case 'KeyC': toggleCreatorMode(); break;
            case 'Space':
                if (isGrounded && !isExhausted && !isChargingJump) {
                    isChargingJump = true;
                    jumpCharge = 0.0;
                }
                break;
            case 'KeyV':
                isFPSView = !isFPSView;
                if (isFPSView) {
                    camera.position.copy(window.fpsCamPos);
                    if (window.psxCat) window.psxCat.visible = false;
                } else {
                    camera.position.copy(window.defaultCamPos);
                    if (window.psxCat) window.psxCat.visible = true;
                }
                break;
            case 'KeyF':
                if (window.psxCat && !window.psxCat.userData.isTogglingLight) {
                    window.psxCat.userData.isTogglingLight = true;
                    window.psxCat.userData.toggleTimer = performance.now();
                }
                break;
        }
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveState.forward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveState.left = false; break;
        case 'ArrowDown':
        case 'KeyS': moveState.backward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveState.right = false; break;
        case 'ShiftLeft': moveState.shift = false; break;
        case 'Space': 
            if (isChargingJump) {
                isChargingJump = false;
                if (isGrounded) {
                    // Tap = 6.0, Max Charge = 18.0
                    playerVelocityY = 6.0 + (jumpCharge * 12.0);
                    stamina -= 10 + (jumpCharge * 15);
                    if (stamina < 0) stamina = 0;
                    isGrounded = false;
                }
                jumpCharge = 0.0;
            }
            break;
    }
}

// ==========================================
// CORE LOOP
// ==========================================

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const renderWidth = 320;
    renderer.setSize(renderWidth, renderWidth * (window.innerHeight / window.innerWidth), false);
}

function checkCollision(playerBox) {
    const limit = 15 - 0.1; 
    if (playerBox.min.x < -limit || playerBox.max.x > limit) return true;
    if (playerBox.min.z < -limit || playerBox.max.z > limit) return true;

    let collided = false;
    for (let i = 0; i < interactables.length; i++) {
        const obj = interactables[i];
        if (obj === window.psxCat) continue;
        
        obj.traverse((child) => {
            if (child.isMesh && !collided) {
                const objBox = new THREE.Box3().setFromObject(child);
                objBox.expandByScalar(-0.02); 
                if (playerBox.intersectsBox(objBox)) {
                    collided = true;
                }
            }
        });
        if (collided) return true;
    }
    return false;
}

function getCollisionTop(playerBox) {
    let topY = -Infinity;
    let collided = false;
    for (let i = 0; i < interactables.length; i++) {
        const obj = interactables[i];
        if (obj === window.psxCat) continue;
        
        obj.traverse((child) => {
            if (child.isMesh) {
                const objBox = new THREE.Box3().setFromObject(child);
                objBox.expandByScalar(-0.02); 
                if (playerBox.intersectsBox(objBox)) {
                    collided = true;
                    if (objBox.max.y > topY) topY = objBox.max.y;
                }
            }
        });
    }
    return { collided, topY };
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    // === VFX UPDATES ===
    if (window.dustParticles) {
        window.dustParticles.rotation.y += 0.05 * delta;
        window.dustParticles.rotation.x += 0.02 * delta;
    }
    
    scene.traverse((child) => {
        if (child.isPointLight && child.userData.isFlickering) {
            // Flicker between 80% and 120% of base intensity
            const flicker = 0.8 + Math.random() * 0.4;
            child.intensity = child.userData.baseIntensity * flicker;
        }
    });

    if (isPointerLocked && !isCreatorMode) {
        const radius = 0.1;
        const height = 0.2;

        let previousVelocityY = playerVelocityY;

        // Apply Gravity
        playerVelocityY -= 25.0 * delta;
        playerGroup.position.y += playerVelocityY * delta;

        // Vertical collision check
        let pBoxY = new THREE.Box3();
        pBoxY.min.set(playerGroup.position.x - radius, playerGroup.position.y, playerGroup.position.z - radius);
        pBoxY.max.set(playerGroup.position.x + radius, playerGroup.position.y + height, playerGroup.position.z + radius);
        
        if (checkCollision(pBoxY)) {
            playerGroup.position.y -= playerVelocityY * delta;
            if (playerVelocityY < 0) {
                if (!isGrounded) {
                    isGrounded = true;
                    landingImpact = Math.min(1.0, Math.abs(previousVelocityY) / 25.0);
                    if (landingImpact > 0.1) landingTimer = maxLandingTimer;
                }
            }
            playerVelocityY = 0;
        } else if (playerGroup.position.y <= 0) {
            playerGroup.position.y = 0;
            if (!isGrounded && playerVelocityY < 0) {
                isGrounded = true;
                landingImpact = Math.min(1.0, Math.abs(previousVelocityY) / 25.0);
                if (landingImpact > 0.1) landingTimer = maxLandingTimer;
            }
            playerVelocityY = 0;
        } else {
            isGrounded = false;
        }

        let landDip = 0;
        let landSplay = 0;
        if (landingTimer > 0) {
            landingTimer -= delta;
            if (landingTimer < 0) landingTimer = 0;
            const progress = landingTimer / maxLandingTimer; 
            const dipCurve = Math.sin(progress * Math.PI); 
            landDip = -dipCurve * 0.4 * landingImpact; 
            landSplay = dipCurve * 0.8 * landingImpact; 
        }

        // Handle jump charging
        if (isChargingJump && isGrounded && stamina > 0) {
            jumpCharge += delta * 2.0; // 0.5s to fully charge
            if (jumpCharge > 1.0) jumpCharge = 1.0;
            stamina -= 15.0 * delta; // slight stamina drain while charging
            
            // Visual crouch
            const targetY = isFPSView ? (window.fpsCamPos.y - 0.05) : (window.defaultCamPos.y - 0.1);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 15 * delta);
            if (window.psxCat) window.psxCat.scale.y = THREE.MathUtils.lerp(window.psxCat.scale.y, 0.6, 15 * delta);
        } else {
            // Restore visual height with Limp Bobbing and Landing Dip
            let targetY = isFPSView ? window.fpsCamPos.y : window.defaultCamPos.y;
            targetY += landDip;
            
            let isMovingNow = (moveState.forward || moveState.backward || moveState.left || moveState.right);
            if (isMovingNow) {
                const animSpeed = (moveState.shift && !isExhausted) ? 2.5 : 1.0; 
                const walkPhase = time * 0.005 * animSpeed;
                const limpPhase = Math.sin(walkPhase + Math.PI);
                const limpDip = limpPhase < 0 ? limpPhase * 0.05 : 0; // Camera dips heavily on injured leg
                targetY += limpDip;
            }

            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 15 * delta);
            if (window.psxCat) window.psxCat.scale.y = THREE.MathUtils.lerp(window.psxCat.scale.y, 1.0, 15 * delta);
        }



        let moveX = 0;
        let moveZ = 0;
        let isMovingInputs = false;
        let isMoving = false;

        if (!isChargingJump) {
            if (moveState.forward) { moveZ -= 1; isMovingInputs = true; }
            if (moveState.backward) { moveZ += 1; isMovingInputs = true; }
            if (moveState.left) { moveX -= 1; isMovingInputs = true; }
            if (moveState.right) { moveX += 1; isMovingInputs = true; }
        }

        let isSprinting = isMovingInputs && moveState.shift && !isExhausted;
        const walkSpeed = isSprinting ? 9.0 : 3.0; // Slower due to injury

        // Stamina logic
        if (isSprinting && isGrounded) {
            stamina -= 30 * delta;
            if (stamina <= 0) {
                stamina = 0;
                isExhausted = true;
            }
        } else if (isGrounded) {
            stamina += 15 * delta;
            if (stamina > maxStamina) stamina = maxStamina;
            if (stamina > 30) {
                isExhausted = false; // Recovered enough to sprint/jump again
            }
        }

        // Update Stamina UI
        const sBar = document.getElementById('staminaBar');
        if (sBar) {
            sBar.style.width = (stamina / maxStamina * 100) + '%';
            if (stamina < 20) sBar.style.backgroundColor = '#ff0000';
            else if (stamina < 50) sBar.style.backgroundColor = '#ffff00';
            else sBar.style.backgroundColor = '#00ff00';
        }

        if (isMovingInputs) {
            // Normalize so diagonal isn't faster
            const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
            moveX = (moveX / len) * walkSpeed * delta;
            moveZ = (moveZ / len) * walkSpeed * delta;
        }

        if (moveX !== 0 || moveZ !== 0) {
            const oldPos = playerGroup.position.clone();
            const stepH = 0.2;
            
            if (moveX !== 0) {
                playerGroup.translateX(moveX);
                pBoxY.min.set(playerGroup.position.x - radius, playerGroup.position.y, playerGroup.position.z - radius);
                pBoxY.max.set(playerGroup.position.x + radius, playerGroup.position.y + height, playerGroup.position.z + radius);
                
                let colInfo = getCollisionTop(pBoxY);
                if (colInfo.collided) {
                    if (colInfo.topY - playerGroup.position.y <= stepH) {
                        pBoxY.min.y = colInfo.topY + 0.001;
                        pBoxY.max.y = pBoxY.min.y + height;
                        if (!checkCollision(pBoxY)) {
                            playerGroup.position.y = colInfo.topY + 0.001;
                        } else {
                            playerGroup.position.x = oldPos.x;
                            playerGroup.position.z = oldPos.z;
                        }
                    } else {
                        playerGroup.position.x = oldPos.x;
                        playerGroup.position.z = oldPos.z;
                    }
                }
                oldPos.copy(playerGroup.position);
            }
            
            if (moveZ !== 0) {
                playerGroup.translateZ(moveZ);
                pBoxY.min.set(playerGroup.position.x - radius, playerGroup.position.y, playerGroup.position.z - radius);
                pBoxY.max.set(playerGroup.position.x + radius, playerGroup.position.y + height, playerGroup.position.z + radius);
                
                let colInfo = getCollisionTop(pBoxY);
                if (colInfo.collided) {
                    if (colInfo.topY - playerGroup.position.y <= stepH) {
                        pBoxY.min.y = colInfo.topY + 0.001;
                        pBoxY.max.y = pBoxY.min.y + height;
                        if (!checkCollision(pBoxY)) {
                            playerGroup.position.y = colInfo.topY + 0.001;
                        } else {
                            playerGroup.position.x = oldPos.x;
                            playerGroup.position.z = oldPos.z;
                        }
                    } else {
                        playerGroup.position.x = oldPos.x;
                        playerGroup.position.z = oldPos.z;
                    }
                }
            }
            isMoving = true;
        }

        if (window.psxCat) {
            const cat = window.psxCat;
            const catTime = time * 0.002;
            
            cat.userData.turnVelocity = cat.userData.turnVelocity || 0;
            if (cat.userData.turnTarget) {
                cat.userData.turnVelocity = THREE.MathUtils.lerp(cat.userData.turnVelocity, cat.userData.turnTarget, 0.5);
                cat.userData.turnTarget = 0; 
            } else {
                cat.userData.turnVelocity *= 0.8; 
            }

            const isTurning = Math.abs(cat.userData.turnVelocity) > 0.001;

            if (isMoving || isTurning) {
                const animSpeed = isMoving ? 1.0 : 1.5; 
                const walkPhase = time * 0.005 * animSpeed;

                // 4-beat sequence for digitigrade cats
                const phaseFL = walkPhase - Math.PI / 2;
                const phaseFR = walkPhase + Math.PI / 2;
                const phaseBL = walkPhase;
                const phaseBR = walkPhase + Math.PI;

                const swingFL = Math.sin(phaseFL);
                const swingFR = Math.sin(phaseFR) * 0.2; // Injured leg dragging
                const swingBL = Math.sin(phaseBL); 
                const swingBR = Math.sin(phaseBR);

                cat.userData.legs[0].hip.rotation.x = swingFL * 0.6;
                cat.userData.legs[1].hip.rotation.x = swingFR * 0.6;
                cat.userData.legs[2].hip.rotation.x = swingBL * 0.6;
                cat.userData.legs[3].hip.rotation.x = swingBR * 0.6;

                // Knee bends most when the leg is passing under the body (cos(phase) > 0)
                const liftFL = Math.max(0, Math.cos(phaseFL));
                const liftFR = Math.max(0, Math.cos(phaseFR)) * 0.2; // Injured leg barely lifts
                const liftBL = Math.max(0, Math.cos(phaseBL));
                const liftBR = Math.max(0, Math.cos(phaseBR));

                // Front legs bend backwards (elbows), Back legs bend forwards (knees)
                cat.userData.legs[0].knee.rotation.x = -liftFL * 1.2;
                cat.userData.legs[1].knee.rotation.x = -liftFR * 1.2;
                cat.userData.legs[2].knee.rotation.x = liftBL * 1.2;
                cat.userData.legs[3].knee.rotation.x = liftBR * 1.2;
                
                cat.userData.tail.rotation.z = Math.sin(catTime * 5) * 0.3; 
                
                const limpPhase = Math.sin(walkPhase + Math.PI);
                const limpDip = limpPhase < 0 ? limpPhase * 0.05 : 0;
                cat.userData.body.position.y = 0.175 + Math.sin(time * 0.02 * animSpeed) * 0.005 + limpDip + landDip; 
                cat.userData.head.position.y = 0.225 + Math.sin(time * 0.02 * animSpeed + 1) * 0.0025 + limpDip + landDip;

                if (landingTimer > 0) {
                    cat.userData.legs[0].hip.rotation.z = landSplay;
                    cat.userData.legs[1].hip.rotation.z = -landSplay;
                    cat.userData.legs[2].hip.rotation.z = landSplay;
                    cat.userData.legs[3].hip.rotation.z = -landSplay;
                    cat.userData.legs[0].knee.rotation.x -= landSplay * 0.5;
                    cat.userData.legs[1].knee.rotation.x -= landSplay * 0.5;
                    cat.userData.legs[2].knee.rotation.x -= landSplay * 0.5;
                    cat.userData.legs[3].knee.rotation.x -= landSplay * 0.5;
                } else {
                    cat.userData.legs.forEach(leg => leg.hip.rotation.z = 0);
                }
            } else {
                cat.userData.legs.forEach(leg => { leg.hip.rotation.x = 0; leg.knee.rotation.x = 0; leg.hip.rotation.z = 0; });
                cat.userData.body.position.y = 0.175 + landDip;
                cat.userData.head.position.y = 0.225 + landDip;
                
                if (landingTimer > 0) {
                    cat.userData.legs[0].hip.rotation.z = landSplay;
                    cat.userData.legs[1].hip.rotation.z = -landSplay;
                    cat.userData.legs[2].hip.rotation.z = landSplay;
                    cat.userData.legs[3].hip.rotation.z = -landSplay;
                    cat.userData.legs.forEach(leg => leg.knee.rotation.x = -landSplay * 0.5); 
                } else {
                    const breath = 1 + Math.sin(catTime * 2) * 0.05;
                    cat.userData.body.scale.set(1, breath, 1);
                }
                cat.userData.tail.rotation.z = Math.sin(catTime * 3) * 0.2;
            }

            if (cat.userData.isTogglingLight) {
                const elapsed = time - cat.userData.toggleTimer;
                const duration = 500;
                if (elapsed < duration) {
                    const progress = elapsed / duration;
                    const lift = Math.sin(progress * Math.PI); 
                    
                    cat.userData.legs[1].hip.rotation.x = -lift * 1.5;
                    cat.userData.legs[1].knee.rotation.x = lift * 1.0; 
                    
                    if (progress > 0.5 && !cat.userData.toggledThisCycle) {
                        cat.userData.isFlashlightOn = !cat.userData.isFlashlightOn;
                        if (cat.userData.isFlashlightOn) {
                            window.ambientLight.intensity = 1.5;
                            window.ambientLight.color.setHex(0x66ffcc);
                            scene.fog.color.setHex(0x224433);
                            scene.fog.density = 0.08;
                            scene.background.setHex(0x224433);
                            if (cat.userData.eyes) cat.userData.eyes.forEach(e => e.visible = true);
                        } else {
                            window.ambientLight.intensity = 0.1;
                            window.ambientLight.color.setHex(0xffffff);
                            scene.fog.color.setHex(0x020202);
                            scene.fog.density = 0.15;
                            scene.background.setHex(0x020202);
                            if (cat.userData.eyes) cat.userData.eyes.forEach(e => e.visible = false);
                        }
                        cat.userData.toggledThisCycle = true;
                    }
                } else {
                    cat.userData.isTogglingLight = false;
                    cat.userData.toggledThisCycle = false;
                }
            }
            
            cat.userData.tail.rotation.x = 0.5 + Math.sin(catTime * 1.5) * 0.1;
            cat.userData.head.rotation.y = THREE.MathUtils.clamp(-cat.userData.turnVelocity * 15.0, -Math.PI/3, Math.PI/3);
        }

    } else if (isCreatorMode && document.getElementById('uv-editor').style.display !== 'flex') {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize();

        const flySpeed = 25.0;
        if (moveState.forward || moveState.backward) velocity.z -= direction.z * flySpeed * delta;
        if (moveState.left || moveState.right) velocity.x -= direction.x * flySpeed * delta;

        camera.translateX(-velocity.x * delta);
        camera.translateZ(velocity.z * delta);
    }

    prevTime = time;
            // Door interaction logic
            doors.forEach(door => {
                const doorWorldPos = new THREE.Vector3();
                door.getWorldPosition(doorWorldPos);
                const playerPos = playerGroup.position;
                
                const dist = playerPos.distanceTo(doorWorldPos);
                if (dist < 1.0) {
                    door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, Math.PI / 2, 5 * delta);
                } else {
                    door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, 0, 5 * delta);
                }
            });

    renderer.render(scene, camera);
    
    if (document.getElementById('uv-editor').style.display === 'flex' && uvRenderer) {
        uvControls.update();
        uvRenderer.render(uvScene, uvCamera);
    }
}

// ==========================================
// INDEXEDDB SAVE & HELPERS
// ==========================================

function serverSave(data, callback) {
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        if (callback) callback();
    })
    .catch(err => console.error("Lỗi khi lưu map:", err));
}

function getMeshPath(mesh, root) {
    if (mesh === root) return "";
    let path = [];
    let curr = mesh;
    while (curr && curr !== root) {
        let parent = curr.parent;
        let index = parent.children.indexOf(curr);
        path.unshift(index);
        curr = parent;
    }
    return path.join('.');
}

function getMeshByPath(root, pathStr) {
    if (pathStr === "") return root;
    let parts = pathStr.split('.');
    let curr = root;
    for(let p of parts) {
        curr = curr.children[parseInt(p)];
        if(!curr) return null;
    }
    return curr;
}

window.needsSave = false;

setInterval(() => {
    if (window.needsSave) {
        window.performServerSave();
    }
}, 60000);

window.addEventListener('beforeunload', () => {
    if (window.needsSave) {
        window.performServerSave(null, true);
    }
});

window.savePositions = function() {
    window.needsSave = true;
};

window.performServerSave = function(callback, isSync = false) {
    const data = { schema_version: 2, texture_dict: {}, objects: {} };
    const objs = [...interactables];
    if (window.psxCat) objs.push(window.psxCat);

    let texCounter = 0;
    const reverseDict = {};

    objs.forEach(obj => {
        const objData = {
            position: obj.position.toArray(),
            rotation: obj.rotation.toArray().slice(0,3),
            textures: {}
        };
        
        obj.traverse((child) => {
            if (child.isMesh && child.userData.faceTextures) {
                const path = getMeshPath(child, obj);
                
                const newFaces = {};
                for (let f in child.userData.faceTextures) {
                    let b64 = child.userData.faceTextures[f];
                    if (!b64) continue;
                    
                    if (reverseDict[b64]) {
                        newFaces[f] = reverseDict[b64];
                    } else {
                        const tex_id = 'tex_' + texCounter++;
                        reverseDict[b64] = tex_id;
                        data.texture_dict[tex_id] = b64;
                        newFaces[f] = tex_id;
                    }
                }
                
                if (Object.keys(newFaces).length > 0) {
                    objData.textures[path] = {
                        faces: newFaces,
                        uvs: child.userData.uvData || {}
                    };
                }
            }
        });
        
        data.objects[obj.userData.id] = objData;
    });
    
    if (isSync) {
        navigator.sendBeacon('/save', JSON.stringify(data));
    } else {
        serverSave(data, callback);
    }
    window.needsSave = false;
}

function loadPositions() {
    fetch('/save.json')
        .then(res => {
            if (!res.ok) throw new Error("Chưa có file save.json");
            return res.json();
        })
        .then(data => {
            if (!data) return;
            
            let textureDict = {};
            let objectsData = data;
            
            if (data.schema_version === 2) {
                textureDict = data.texture_dict || {};
                objectsData = data.objects || {};
            }
            
            const objs = [...interactables];
            if (window.psxCat) objs.push(window.psxCat);

        objs.forEach(obj => {
            if (objectsData[obj.userData.id]) {
                const d = objectsData[obj.userData.id];
                if (d.position && obj.userData.id !== 'cat_1') { 
                    obj.position.fromArray(d.position);
                    obj.rotation.fromArray(d.rotation);
                }
                
                if (d.textures) {
                    for (let pathStr in d.textures) {
                        const mesh = getMeshByPath(obj, pathStr);
                        if (mesh) {
                            if (!mesh.userData.faceTextures) mesh.userData.faceTextures = {};
                            if (!mesh.userData.uvData) mesh.userData.uvData = {};
                            
                            const faceMap = d.textures[pathStr].faces;
                            const uvMap = d.textures[pathStr].uvs || {};
                            
                            for (let faceIdx in faceMap) {
                                let dataUrl = faceMap[faceIdx];
                                if (dataUrl.startsWith('tex_')) {
                                    dataUrl = textureDict[dataUrl];
                                }
                                mesh.userData.faceTextures[faceIdx] = dataUrl;

                                const hasCustomUV = !!uvMap[faceIdx];
                                const tex = getOrCreateTexture(dataUrl, hasCustomUV);
                                
                                if (hasCustomUV) {
                                    mesh.userData.uvData[faceIdx] = uvMap[faceIdx];
                                    tex.offset.fromArray(uvMap[faceIdx].offset);
                                    tex.repeat.fromArray(uvMap[faceIdx].repeat);
                                    if (uvMap[faceIdx].rotation !== undefined) {
                                        tex.center.set(0.5, 0.5);
                                        tex.rotation = uvMap[faceIdx].rotation;
                                    }
                                }
                                
                                if (!Array.isArray(mesh.material)) {
                                    mesh.material = [
                                        mesh.material.clone(), mesh.material.clone(),
                                        mesh.material.clone(), mesh.material.clone(),
                                        mesh.material.clone(), mesh.material.clone()
                                    ];
                                }
                                mesh.userData.originalMat = null;
                                mesh.material[faceIdx] = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                                mesh.userData.originalMat = mesh.material;
                            }
                        }
                    }
                }
            }
        });
        }).catch(err => console.log("Không tìm thấy save file cũ, dùng map mặc định."));
}

function getFurnitureParent(object) {
    if (object.userData && (object.userData.isFurniture || object.userData.id === 'cat_1')) return object;
    if (object.parent) return getFurnitureParent(object.parent);
    return null;
}

function exportScene() {
    transformControl.detach();
    const exporter = new GLTFExporter();
    exporter.parse(
        window.sceneGroup,
        function (gltf) {
            const output = JSON.stringify(gltf, null, 2);
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = 'psx_house.gltf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert("Đã tải xuống file psx_house.gltf!");
        },
        function (error) { console.error('Error exporting:', error); },
        {} 
    );
}

window.savePositions = savePositions;
window.exportScene = exportScene;

function createTable(material) {
    const tableGroup = new THREE.Group();
    const topGeo = new THREE.BoxGeometry(2.5, 0.1, 1.5);
    const top = new THREE.Mesh(topGeo, material);
    top.position.y = 0.9; 
    tableGroup.add(top);

    const legGeo = new THREE.BoxGeometry(0.15, 0.9, 0.15);
    const positions = [ [-1.1, -0.6], [1.1, -0.6], [-1.1, 0.6], [1.1, 0.6] ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, material);
        leg.position.set(pos[0], 0.45, pos[1]);
        tableGroup.add(leg);
    });
    return tableGroup;
}

function createChair(material) {
    const chairGroup = new THREE.Group();
    const seatGeo = new THREE.BoxGeometry(0.7, 0.1, 0.7);
    const seat = new THREE.Mesh(seatGeo, material);
    seat.position.y = 0.5;
    chairGroup.add(seat);

    const legGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
    const legPos = [ [-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3] ];
    legPos.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, material);
        leg.position.set(pos[0], 0.25, pos[1]);
        chairGroup.add(leg);
    });

    const backGeo = new THREE.BoxGeometry(0.7, 0.6, 0.08);
    const back = new THREE.Mesh(backGeo, material);
    back.position.set(0, 0.85, -0.31);
    chairGroup.add(back);
    return chairGroup;
}

function createStairs(material) {
    const group = new THREE.Group();
    const steps = 15;
    const height = 3;
    const depth = 4;
    const width = 2;
    const stepHeight = height / steps;
    const stepDepth = depth / steps;
    for (let i = 0; i < steps; i++) {
        const stepGeo = new THREE.BoxGeometry(width, stepHeight, stepDepth);
        const step = new THREE.Mesh(stepGeo, material);
        step.position.set(0, (i + 0.5) * stepHeight, (i + 0.5) * stepDepth - depth / 2);
        group.add(step);
    }
    return group;
}

function createBed(material) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(2, 0.3, 3);
    const frame = new THREE.Mesh(frameGeo, material);
    frame.position.y = 0.15;
    group.add(frame);
    
    const matGeo = new THREE.BoxGeometry(1.8, 0.2, 2.8);
    const mattress = new THREE.Mesh(matGeo, material);
    mattress.position.y = 0.4;
    group.add(mattress);
    
    const pillowGeo = new THREE.BoxGeometry(1.4, 0.1, 0.5);
    const pillow = new THREE.Mesh(pillowGeo, material);
    pillow.position.set(0, 0.55, -1.1);
    group.add(pillow);
    return group;
}

function createCabinet(material) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2, 2.5, 1);
    const box = new THREE.Mesh(boxGeo, material);
    box.position.y = 1.25;
    group.add(box);
    return group;
}

function createCat() {
    const catGroup = new THREE.Group();
    const catMat = new THREE.MeshLambertMaterial({ color: 0xd97c2b });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x4a280b });

    catGroup.userData = { id: 'cat_1' };

    const bodyGeo = new THREE.BoxGeometry(0.15, 0.125, 0.3);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.set(0, 0.175, 0);
    catGroup.add(body);
    catGroup.userData.body = body;

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.225, -0.175); 
    catGroup.add(headGroup);
    catGroup.userData.head = headGroup;

    const headGeo = new THREE.BoxGeometry(0.125, 0.125, 0.125);
    const head = new THREE.Mesh(headGeo, catMat);
    head.position.set(0, 0.05, -0.05);
    headGroup.add(head);

    // Pointy right-triangle cat ears (Modified BoxGeometry for proper UV mapping)
    const earW = 0.06;
    const earH = 0.075;
    const earD = 0.025;
    
    const earGeoL = new THREE.BoxGeometry(earW, earH, earD);
    const posL = earGeoL.attributes.position;
    for (let i = 0; i < posL.count; i++) {
        // Left ear (positive X side): Move inner-top vertices to outer-top
        if (posL.getX(i) < 0 && posL.getY(i) > 0) {
            posL.setX(i, earW / 2);
        }
    }
    earGeoL.computeVertexNormals();

    const earGeoR = new THREE.BoxGeometry(earW, earH, earD);
    const posR = earGeoR.attributes.position;
    for (let i = 0; i < posR.count; i++) {
        // Right ear (negative X side): Move inner-top vertices to outer-top
        if (posR.getX(i) > 0 && posR.getY(i) > 0) {
            posR.setX(i, -earW / 2);
        }
    }
    earGeoR.computeVertexNormals();

    const earL = new THREE.Mesh(earGeoL, darkMat);
    earL.position.set(0.0325, 0.15, -0.05); 
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeoR, darkMat);
    earR.position.set(-0.0325, 0.15, -0.05);
    headGroup.add(earR);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.225, 0.15); 
    catGroup.add(tailGroup);
    catGroup.userData.tail = tailGroup;

    const tailGeo = new THREE.BoxGeometry(0.0125, 0.1, 0.0125);
    const tail = new THREE.Mesh(tailGeo, darkMat);
    tail.position.set(0, 0.1, 0); 
    tailGroup.add(tail);

    const legGeo = new THREE.BoxGeometry(0.03, 0.075, 0.03);
    const positions = [
        [-0.06, 0.125, -0.1], 
        [0.06, 0.125, -0.1],  
        [-0.06, 0.125, 0.1],  
        [0.06, 0.125, 0.1]    
    ];

    catGroup.userData.legs = [];
    positions.forEach((pos) => {
        const hipPivot = new THREE.Group();
        hipPivot.position.set(pos[0], pos[1], pos[2]);
        catGroup.add(hipPivot);

        const upperLeg = new THREE.Mesh(legGeo, catMat);
        upperLeg.position.set(0, -0.0375, 0); 
        hipPivot.add(upperLeg);

        const kneePivot = new THREE.Group();
        kneePivot.position.set(0, -0.075, 0);
        hipPivot.add(kneePivot);

        const lowerLeg = new THREE.Mesh(legGeo, catMat);
        lowerLeg.position.set(0, -0.0375, 0);
        kneePivot.add(lowerLeg);

        catGroup.userData.legs.push({ hip: hipPivot, knee: kneePivot });
    });

    // Night vision eyes (removed so they don't protrude)
    catGroup.userData.eyes = [];
    catGroup.userData.isFlashlightOn = false;

    return catGroup;
}

function toggleNightVision() {
    window.isNightVisionOn = !window.isNightVisionOn;
    if (window.isNightVisionOn) {
        window.ambientLight.intensity = 1.2;
        window.ambientLight.color.setHex(0x88ffaa);
        scene.fog.color.setHex(0x113311);
        scene.fog.density = 0.05;
        scene.background.setHex(0x113311);
    } else {
        window.ambientLight.intensity = 0.02;
        window.ambientLight.color.setHex(0x223322);
        scene.fog.color.setHex(0x050805);
        scene.fog.density = 0.12;
        scene.background.setHex(0x050805);
    }
}

function createClock(material) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.2, 0.4, 0.8);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.2;
    group.add(base);

    const bodyGeo = new THREE.BoxGeometry(1.0, 3.0, 0.6);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 1.9;
    group.add(body);

    const headGeo = new THREE.BoxGeometry(1.4, 1.0, 0.8);
    const head = new THREE.Mesh(headGeo, material);
    head.position.y = 3.9;
    group.add(head);

    const faceGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 3.9, 0.41);
    group.add(face);

    return group;
}

function createPainting(material) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(2.0, 3.0, 0.1);
    const frame = new THREE.Mesh(frameGeo, material);
    group.add(frame);
    
    const canvasGeo = new THREE.PlaneGeometry(1.6, 2.6);
    const canvasMat = new THREE.MeshLambertMaterial({ color: 0x331111 }); // Dark creepy red
    const canvas = new THREE.Mesh(canvasGeo, canvasMat);
    canvas.position.z = 0.06;
    group.add(canvas);

    return group;
}

function createBathtub(material) {
    const group = new THREE.Group();
    const tubGeo = new THREE.BoxGeometry(3.0, 1.2, 1.5);
    const tub = new THREE.Mesh(tubGeo, material);
    tub.position.y = 0.6;
    group.add(tub);

    // Inner hole
    const holeGeo = new THREE.PlaneGeometry(2.6, 1.1);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = -Math.PI / 2;
    hole.position.y = 1.21;
    group.add(hole);

    return group;
}

function createDresser(material) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2.0, 2.0, 1.0);
    const box = new THREE.Mesh(boxGeo, material);
    box.position.y = 1.0;
    group.add(box);
    return group;
}

function createDoor(material) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.0, 3.0, 0.4);
    const frame = new THREE.Mesh(frameGeo, material);
    frame.position.y = 1.5;
    group.add(frame);
    
    // Hole in frame
    const holeGeo = new THREE.BoxGeometry(0.9, 2.0, 0.42);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050805 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.y = 1.0;
    group.add(hole);

    // The door itself (slightly open)
    const doorGeo = new THREE.BoxGeometry(0.9, 2.0, 0.1);
    const door = new THREE.Mesh(doorGeo, material);
    door.position.set(-0.45, 1.0, 0); 
    // Pivot door
    const pivot = new THREE.Group();
    pivot.position.set(0.45, 0, 0);
    pivot.add(door);
    group.add(pivot);
    doors.push(pivot);

    return group;
}

function createToilet(material) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.0, 1.0, 1.4);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.5;
    group.add(base);

    const tankGeo = new THREE.BoxGeometry(1.2, 1.5, 0.6);
    const tank = new THREE.Mesh(tankGeo, material);
    tank.position.set(0, 1.75, -0.4);
    group.add(tank);

    return group;
}

function createSink(material) {
    const group = new THREE.Group();
    const standGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8);
    const stand = new THREE.Mesh(standGeo, material);
    stand.position.y = 0.9;
    group.add(stand);

    const basinGeo = new THREE.BoxGeometry(1.4, 0.4, 1.2);
    const basin = new THREE.Mesh(basinGeo, material);
    basin.position.set(0, 1.9, 0.2);
    group.add(basin);

    const mirrorGeo = new THREE.PlaneGeometry(1.2, 1.5);
    const mirrorMat = new THREE.MeshBasicMaterial({ color: 0x223344 }); // broken mirror
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 3.2, -0.19);
    group.add(mirror);

    return group;
}

function createKitchenCounter(material) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(2.0, 1.8, 1.5);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.9;
    group.add(base);
    return group;
}

function createStove(material) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.8, 1.8, 1.6);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.9;
    group.add(base);

    const topGeo = new THREE.PlaneGeometry(1.8, 1.6);
    const topMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 1.81;
    group.add(top);

    return group;
}

function createWardrobe(material) {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(3.0, 4.5, 1.2);
    const box = new THREE.Mesh(boxGeo, material);
    box.position.y = 2.25;
    group.add(box);
    return group;
}

function createBoardedWindow(material) {
    const group = new THREE.Group();
    const holeGeo = new THREE.PlaneGeometry(2.0, 2.0);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    group.add(hole);

    const boardGeo = new THREE.BoxGeometry(2.4, 0.3, 0.1);
    const board1 = new THREE.Mesh(boardGeo, material);
    board1.position.set(0, 0.4, 0.05);
    board1.rotation.z = 0.1;
    group.add(board1);

    const board2 = new THREE.Mesh(boardGeo, material);
    board2.position.set(0, -0.3, 0.06);
    board2.rotation.z = -0.2;
    group.add(board2);

    return group;
}

function createTV(material) {
    const group = new THREE.Group();
    // TV stand
    const standGeo = new THREE.BoxGeometry(1.5, 0.6, 0.5);
    const stand = new THREE.Mesh(standGeo, material);
    stand.position.y = 0.3;
    group.add(stand);
    // TV screen
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x111122 });
    const screenGeo = new THREE.BoxGeometry(2.0, 1.2, 0.1);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.2, 0);
    group.add(screen);
    // Screen glow border
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x333355 });
    const borderGeo = new THREE.BoxGeometry(2.1, 1.3, 0.08);
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.set(0, 1.2, -0.02);
    group.add(border);
    // TV Light
    const light = new THREE.PointLight(0x4444ff, 1.5, 12);
    light.position.set(0, 1.2, 0.5);
    light.userData.isFlickering = true;
    light.userData.baseIntensity = 1.5;
    group.add(light);
    return group;
}

function createFridge(material) {
    const group = new THREE.Group();
    const fridgeMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    // Main body
    const bodyGeo = new THREE.BoxGeometry(1.0, 2.2, 0.8);
    const body = new THREE.Mesh(bodyGeo, fridgeMat);
    body.position.y = 1.1;
    group.add(body);
    // Handle
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const handleGeo = new THREE.BoxGeometry(0.05, 0.6, 0.05);
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0.45, 1.4, 0.42);
    group.add(handle);
    // Divider line (freezer/fridge)
    const divGeo = new THREE.BoxGeometry(0.95, 0.02, 0.01);
    const divMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const div = new THREE.Mesh(divGeo, divMat);
    div.position.set(0, 1.6, 0.41);
    group.add(div);
    return group;
}

function createSofa(material) {
    const group = new THREE.Group();
    const sofaMat = new THREE.MeshLambertMaterial({ color: 0x663322 });
    // Seat
    const seatGeo = new THREE.BoxGeometry(3, 0.4, 1.2);
    const seat = new THREE.Mesh(seatGeo, sofaMat);
    seat.position.set(0, 0.3, 0);
    group.add(seat);
    // Backrest
    const backGeo = new THREE.BoxGeometry(3, 0.6, 0.3);
    const back = new THREE.Mesh(backGeo, sofaMat);
    back.position.set(0, 0.7, -0.45);
    group.add(back);
    // Armrest left
    const armGeo = new THREE.BoxGeometry(0.25, 0.5, 1.2);
    const armL = new THREE.Mesh(armGeo, sofaMat);
    armL.position.set(-1.375, 0.45, 0);
    group.add(armL);
    // Armrest right
    const armR = new THREE.Mesh(armGeo, sofaMat);
    armR.position.set(1.375, 0.45, 0);
    group.add(armR);
    return group;
}

function createBookshelf(material) {
    const group = new THREE.Group();
    // Frame
    const frameGeo = new THREE.BoxGeometry(2, 2.5, 0.5);
    const frame = new THREE.Mesh(frameGeo, material);
    frame.position.y = 1.25;
    group.add(frame);
    // Shelves
    const shelfMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
    for (let i = 0; i < 4; i++) {
        const shelfGeo = new THREE.BoxGeometry(1.9, 0.05, 0.45);
        const shelf = new THREE.Mesh(shelfGeo, shelfMat);
        shelf.position.set(0, 0.5 + i * 0.5, 0);
        group.add(shelf);
    }
    // Books (colorful blocks)
    const bookColors = [0xcc3333, 0x3333cc, 0x33cc33, 0xcccc33, 0xcc33cc];
    for (let row = 0; row < 4; row++) {
        for (let j = 0; j < 4; j++) {
            const bMat = new THREE.MeshLambertMaterial({ color: bookColors[(row + j) % bookColors.length] });
            const bGeo = new THREE.BoxGeometry(0.12, 0.35, 0.3);
            const book = new THREE.Mesh(bGeo, bMat);
            book.position.set(-0.6 + j * 0.35, 0.7 + row * 0.5, 0);
            group.add(book);
        }
    }
    return group;
}

function createLamp() {
    const group = new THREE.Group();
    // Pole
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.5, 8);
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 0.75;
    group.add(pole);
    // Shade
    const shadeMat = new THREE.MeshLambertMaterial({ color: 0xffeecc, emissive: 0x332200 });
    const shadeGeo = new THREE.CylinderGeometry(0.15, 0.3, 0.3, 8);
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 1.6;
    group.add(shade);
    // Light
    const light = new THREE.PointLight(0xffaa44, 0.8, 10);
    light.position.set(0, 1.5, 0);
    light.userData.isFlickering = true;
    light.userData.baseIntensity = 0.8;
    group.add(light);
    return group;
}

function createCage(material) {
    const group = new THREE.Group();
    const cageGeo = new THREE.BoxGeometry(4, 5, 4);
    const cageMat = new THREE.MeshLambertMaterial({ color: 0x222222, wireframe: true });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cage.position.y = 2.5;
    group.add(cage);

    const baseGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
    const base = new THREE.Mesh(baseGeo, material);
    base.position.y = 0.1;
    group.add(base);

    // Glowing circle
    const circleGeo = new THREE.RingGeometry(1.5, 2.0, 16);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = Math.PI / 2;
    circle.position.y = 0.25;
    group.add(circle);

    return group;
}

function createOwner(material) {
    const group = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.5, 0.6);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 0.75;
    group.add(body);

    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.75;
    group.add(head);

    return group;
}

function createRug(material, width, depth) {
    const group = new THREE.Group();
    const geo = new THREE.PlaneGeometry(width, depth);
    const mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.02; // slightly above floor
    group.add(mesh);
    return group;
}

function createNightstand(material) {
    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.8, 1.0, 0.8);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = 0.5;
    group.add(mesh);
    return group;
}

function createMirror(material) {
    const group = new THREE.Group();
    const geo = new THREE.PlaneGeometry(1.2, 1.8);
    const mesh = new THREE.Mesh(geo, material); 
    mesh.position.set(0, 2.5, 0.05); // Wall offset
    group.add(mesh);
    return group;
}

function createTrashCan(material) {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(0.4, 0.3, 1.0, 8);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = 0.5;
    group.add(mesh);
    return group;
}

function createCoffeeTable(material) {
    const group = new THREE.Group();
    // Top
    const topGeo = new THREE.BoxGeometry(2.0, 0.1, 1.2);
    const top = new THREE.Mesh(topGeo, material);
    top.position.y = 0.8;
    group.add(top);
    // Legs
    const legGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const positions = [
        [-0.9, -0.5], [0.9, -0.5],
        [-0.9, 0.5], [0.9, 0.5]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, material);
        leg.position.set(pos[0], 0.4, pos[1]);
        group.add(leg);
    });
    return group;
}

function createDeadPlant(woodMat, plantMat) {
    const group = new THREE.Group();
    const potGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 8);
    const pot = new THREE.Mesh(potGeo, woodMat);
    pot.position.y = 0.4;
    group.add(pot);

    // Dead branch
    const branchGeo = new THREE.BoxGeometry(0.1, 2.0, 0.1);
    const branch = new THREE.Mesh(branchGeo, plantMat);
    branch.position.y = 1.6;
    branch.rotation.z = Math.PI / 8;
    group.add(branch);
    
    // Another dead branch
    const branch2Geo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
    const branch2 = new THREE.Mesh(branch2Geo, plantMat);
    branch2.position.set(0.2, 1.4, 0);
    branch2.rotation.z = -Math.PI / 6;
    group.add(branch2);

    return group;
}

// ==========================================
// TEXTURE PALETTE SYSTEM
// ==========================================

let texturePaletteOpen = false;
let selectedPaletteTexture = null;

function toggleTexturePalette() {
    texturePaletteOpen = !texturePaletteOpen;
    const panel = document.getElementById('texture-palette');
    panel.style.display = texturePaletteOpen ? 'block' : 'none';
    if (texturePaletteOpen) loadTexturePalette();
}

function loadTexturePalette() {
    fetch('/list-textures')
        .then(r => r.json())
        .then(files => {
            const grid = document.getElementById('tex-grid');
            grid.innerHTML = '';
            files.forEach(path => {
                const img = document.createElement('img');
                img.src = path + '?t=' + Date.now();
                img.className = 'tex-item';
                img.title = path.split('/').pop();
                img.addEventListener('click', () => {
                    document.querySelectorAll('.tex-item').forEach(e => e.classList.remove('selected'));
                    img.classList.add('selected');
                    selectedPaletteTexture = path;
                });
                grid.appendChild(img);
            });
        })
        .catch(err => console.warn('Cannot load textures:', err));
}

window.uploadTextures = function(fileList) {
    Array.from(fileList).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.split(',')[1];
            fetch('/upload-texture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, data: base64 })
            })
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    loadTexturePalette();
                }
            });
        };
        reader.readAsDataURL(file);
    });
};

window.uvZoomScale = 1.0;
window.zoomUV = function(delta) {
    window.uvZoomScale = Math.max(0.2, Math.min(5.0, window.uvZoomScale + delta));
    document.getElementById('uv-wrapper').style.transform = `scale(${window.uvZoomScale})`;
};
window.resetZoomUV = function() {
    window.uvZoomScale = 1.0;
    document.getElementById('uv-wrapper').style.transform = `scale(1.0)`;
};

window.toggleTexturePalette = toggleTexturePalette;
