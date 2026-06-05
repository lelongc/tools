import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let camera, scene, renderer;
let transformControl;
const moveState = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

let isCreatorMode = false;
let isSnapEnabled = false;
let isPointerLocked = false;

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
    playerGroup.position.set(0, 0, 2); 
    scene.add(playerGroup);

    cameraArm = new THREE.Group();
    cameraArm.position.set(0, 0.4, 0); 
    playerGroup.add(cameraArm);

    cameraArm.add(camera);
    camera.position.set(0, 0.4, 2); 

    const cat = createCat();
    playerGroup.add(cat);
    window.psxCat = cat;

    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', function (event) {
        if (!event.value && transformControl.object) {
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const flashlight = new THREE.PointLight(0xffddaa, 1.5, 12);
    flashlight.position.set(0, 0, 1);
    cameraArm.add(flashlight); 

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

    const wallTex = loadPSXTexture('assets/wall.png', 4, 1);
    const floorTex = loadPSXTexture('assets/floor.png', 8, 8);
    const ceilTex = loadPSXTexture('assets/ceiling.png', 8, 8);

    const wallMat = new THREE.MeshLambertMaterial({ map: wallTex });
    const floorMat = new THREE.MeshLambertMaterial({ map: floorTex });
    const ceilMat = new THREE.MeshLambertMaterial({ map: ceilTex });

    const roomSize = 20;
    const roomHeight = 3;
    const group = new THREE.Group();

    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    const ceil = new THREE.Mesh(floorGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = roomHeight;
    group.add(ceil);

    const wallGeo = new THREE.PlaneGeometry(roomSize, roomHeight);
    
    const wall1 = new THREE.Mesh(wallGeo, wallMat);
    wall1.position.set(0, roomHeight/2, -roomSize/2);
    group.add(wall1);

    const wall2 = new THREE.Mesh(wallGeo, wallMat);
    wall2.position.set(0, roomHeight/2, roomSize/2);
    wall2.rotation.y = Math.PI;
    group.add(wall2);

    const wall3 = new THREE.Mesh(wallGeo, wallMat);
    wall3.position.set(-roomSize/2, roomHeight/2, 0);
    wall3.rotation.y = Math.PI / 2;
    group.add(wall3);

    const wall4 = new THREE.Mesh(wallGeo, wallMat);
    wall4.position.set(roomSize/2, roomHeight/2, 0);
    wall4.rotation.y = -Math.PI / 2;
    group.add(wall4);

    const pillarGeo = new THREE.BoxGeometry(1, roomHeight, 1);
    for (let i = 0; i < 15; i++) {
        const pillar = new THREE.Mesh(pillarGeo, wallMat);
        pillar.position.x = (Math.random() - 0.5) * (roomSize - 2);
        pillar.position.z = (Math.random() - 0.5) * (roomSize - 2);
        pillar.position.y = roomHeight / 2;
        pillar.userData = { id: `pillar_${i}`, isFurniture: true };
        interactables.push(pillar);
        group.add(pillar);
    }

    const table = createTable(wallMat);
    table.position.set(0, 0, -3);
    table.userData = { id: 'table_1', isFurniture: true };
    interactables.push(table);
    group.add(table);

    const chair1 = createChair(wallMat);
    chair1.position.set(0, 0, -1.5);
    chair1.userData = { id: 'chair_1', isFurniture: true };
    interactables.push(chair1);
    group.add(chair1);

    const chair2 = createChair(wallMat);
    chair2.position.set(0, 0, -4.5);
    chair2.rotation.y = Math.PI;
    chair2.userData = { id: 'chair_2', isFurniture: true };
    interactables.push(chair2);
    group.add(chair2);

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
        camera.position.set(0, 0.4, 2); 
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
    if (!isCreatorMode) return;
    
    if (event.button === 1) isRightMouseDown = true; 
    if (event.ctrlKey) isZooming = true;

    if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        const objectsToTest = [...interactables];
        if (window.psxCat) objectsToTest.push(window.psxCat);
        
        const intersects = raycaster.intersectObjects(objectsToTest, true);

        if (event.altKey) {
            // UV Editor Trigger
            if (intersects.length > 0) {
                const hit = intersects[0];
                const mesh = hit.object;
                if (!mesh.geometry || mesh.geometry.type !== 'BoxGeometry') return;
                const materialIndex = Math.floor(hit.faceIndex / 2);
                if (mesh.userData.faceTextures && mesh.userData.faceTextures[materialIndex]) {
                    window.openUVEditor(mesh, materialIndex);
                }
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
            const gizmoIntersects = raycaster.intersectObject(transformControl, true);
            if (gizmoIntersects.length === 0 && !transformControl.dragging) {
                transformControl.detach();
            }
        }
    }
}

function onMouseUp(event) {
    if (event.button === 1) isRightMouseDown = false;
    isZooming = false;
}

function onMouseMove(event) {
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
            const dataUrl = event.target.result;
            
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const objectsToTest = [...interactables];
            if (window.psxCat) objectsToTest.push(window.psxCat);
            const intersects = raycaster.intersectObjects(objectsToTest, true);
            
            if (intersects.length > 0) {
                const hit = intersects[0];
                const mesh = hit.object;
                
                if (!mesh.geometry || mesh.geometry.type !== 'BoxGeometry') return;

                const materialIndex = Math.floor(hit.faceIndex / 2);

                const textureLoader = new THREE.TextureLoader();
                const tex = textureLoader.load(dataUrl);
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.colorSpace = THREE.SRGBColorSpace;
                
                if (!Array.isArray(mesh.material)) {
                    mesh.material = [
                        mesh.material.clone(), mesh.material.clone(),
                        mesh.material.clone(), mesh.material.clone(),
                        mesh.material.clone(), mesh.material.clone()
                    ];
                }
                
                if (mesh.userData.originalMat) mesh.userData.originalMat = null;
                
                mesh.material[materialIndex] = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
                mesh.userData.originalMat = mesh.material; 
                
                if (!mesh.userData.faceTextures) mesh.userData.faceTextures = {};
                mesh.userData.faceTextures[materialIndex] = dataUrl;
                
                // Reset UV data if overwriting with new image
                if (mesh.userData.uvData && mesh.userData.uvData[materialIndex]) {
                    delete mesh.userData.uvData[materialIndex];
                }
                
                savePositions();
            }
        };
        reader.readAsDataURL(file);
    }
});

// ==========================================
// UV EDITOR UI
// ==========================================

let currentUVMesh = null;
let currentUVFaceIdx = -1;
let uvBox = { x: 0, y: 0, w: 100, h: 100 };
let isDraggingUV = false;
let isResizingUV = false;
let lastMouse = { x: 0, y: 0 };

window.openUVEditor = function(mesh, faceIdx) {
    if (!mesh.userData.faceTextures || !mesh.userData.faceTextures[faceIdx]) return;
    
    currentUVMesh = mesh;
    currentUVFaceIdx = faceIdx;
    
    const img = document.getElementById('uv-img');
    img.onload = () => {
        document.getElementById('uv-editor').style.display = 'block';
        if(isCreatorMode) transformControl.detach();
        
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        document.getElementById('uv-wrapper').style.width = w + 'px';
        document.getElementById('uv-wrapper').style.height = h + 'px';
        
        if (mesh.userData.uvData && mesh.userData.uvData[faceIdx]) {
            const data = mesh.userData.uvData[faceIdx];
            uvBox.w = data.repeat[0] * w;
            uvBox.h = data.repeat[1] * h;
            uvBox.x = data.offset[0] * w;
            uvBox.y = (1.0 - data.offset[1]) * h - uvBox.h;
        } else {
            uvBox = { x: 0, y: 0, w: w, h: h };
        }
        
        updateUVDOM();
        
        // Cuộn ảnh sao cho khung uvBox nằm ở giữa màn hình
        const container = document.getElementById('uv-scroll-container');
        container.scrollLeft = uvBox.x - container.clientWidth / 2 + uvBox.w / 2;
        container.scrollTop = uvBox.y - container.clientHeight / 2 + uvBox.h / 2;
    };
    img.src = mesh.userData.faceTextures[faceIdx];
};

window.closeUVEditor = function() {
    document.getElementById('uv-editor').style.display = 'none';
    currentUVMesh = null;
    currentUVFaceIdx = -1;
};

function updateUVDOM() {
    const box = document.getElementById('uv-box');
    box.style.left = uvBox.x + 'px';
    box.style.top = uvBox.y + 'px';
    box.style.width = uvBox.w + 'px';
    box.style.height = uvBox.h + 'px';
    
    const dt = document.getElementById('uv-dark-top');
    const db = document.getElementById('uv-dark-bottom');
    const dl = document.getElementById('uv-dark-left');
    const dr = document.getElementById('uv-dark-right');
    const w = document.getElementById('uv-img').naturalWidth;
    const h = document.getElementById('uv-img').naturalHeight;
    
    dt.style.left = '0'; dt.style.top = '0'; dt.style.width = w + 'px'; dt.style.height = uvBox.y + 'px';
    db.style.left = '0'; db.style.top = (uvBox.y + uvBox.h) + 'px'; db.style.width = w + 'px'; db.style.height = Math.max(0, h - (uvBox.y + uvBox.h)) + 'px';
    dl.style.left = '0'; dl.style.top = uvBox.y + 'px'; dl.style.width = uvBox.x + 'px'; dl.style.height = uvBox.h + 'px';
    dr.style.left = (uvBox.x + uvBox.w) + 'px'; dr.style.top = uvBox.y + 'px'; dr.style.width = Math.max(0, w - (uvBox.x + uvBox.w)) + 'px'; dr.style.height = uvBox.h + 'px';
}

const uvBoxEl = document.getElementById('uv-box');
const uvHandle = document.getElementById('uv-handle');

if (uvBoxEl && uvHandle) {
    uvBoxEl.addEventListener('mousedown', (e) => {
        if (e.target === uvHandle) return;
        isDraggingUV = true;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    uvHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizingUV = true;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingUV && !isResizingUV) return;
        
        // Ngăn bôi đen chữ khi kéo
        e.preventDefault();

        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        lastMouse = { x: e.clientX, y: e.clientY };
        
        const w = document.getElementById('uv-img').naturalWidth;
        const h = document.getElementById('uv-img').naturalHeight;
        
        if (isResizingUV) {
            uvBox.w = Math.max(5, uvBox.w + dx);
            uvBox.h = Math.max(5, uvBox.h + dy);
            if (uvBox.x + uvBox.w > w) uvBox.w = w - uvBox.x;
            if (uvBox.y + uvBox.h > h) uvBox.h = h - uvBox.y;
        } else if (isDraggingUV) {
            uvBox.x += dx;
            uvBox.y += dy;
            if (uvBox.x < 0) uvBox.x = 0;
            if (uvBox.y < 0) uvBox.y = 0;
            if (uvBox.x + uvBox.w > w) uvBox.x = w - uvBox.w;
            if (uvBox.y + uvBox.h > h) uvBox.y = h - uvBox.h;
        }
        
        updateUVDOM();
        updateUVOnMesh();
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingUV || isResizingUV) {
            isDraggingUV = false;
            isResizingUV = false;
            savePositions();
        }
    });
}

function updateUVOnMesh() {
    if (!currentUVMesh || currentUVFaceIdx === -1) return;
    const w = document.getElementById('uv-img').naturalWidth;
    const h = document.getElementById('uv-img').naturalHeight;
    
    if (w === 0 || h === 0) return;

    const u_offset = uvBox.x / w;
    const v_offset = 1.0 - (uvBox.y + uvBox.h) / h;
    const u_repeat = uvBox.w / w;
    const v_repeat = uvBox.h / h;
    
    if (!currentUVMesh.userData.uvData) currentUVMesh.userData.uvData = {};
    currentUVMesh.userData.uvData[currentUVFaceIdx] = {
        offset: [u_offset, v_offset],
        repeat: [u_repeat, v_repeat]
    };
    
    const tex = currentUVMesh.material[currentUVFaceIdx].map;
    if (tex) {
        tex.offset.set(u_offset, v_offset);
        tex.repeat.set(u_repeat, v_repeat);
        tex.needsUpdate = true;
    }
}

// ==========================================
// INPUT HANDLING
// ==========================================

function onKeyDown(event) {
    if (document.getElementById('uv-editor').style.display === 'block') return; // block inputs when editing UV

    if (isCreatorMode) {
        switch (event.code) {
            case 'KeyC': toggleCreatorMode(); break;
            case 'KeyE': exportScene(); break;
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
            case 'KeyW': moveState.forward = true; break;
            case 'ArrowLeft':
            case 'KeyA': moveState.left = true; break;
            case 'ArrowDown':
            case 'KeyS': moveState.backward = true; break;
            case 'ArrowRight':
            case 'KeyD': moveState.right = true; break;
            case 'KeyE': exportScene(); break;
            case 'KeyC': toggleCreatorMode(); break;
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

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (isPointerLocked && !isCreatorMode) {
        const walkSpeed = 3.0;
        let isMoving = false;

        if (moveState.forward) { playerGroup.translateZ(-walkSpeed * delta); isMoving = true; }
        if (moveState.backward) { playerGroup.translateZ(walkSpeed * delta); isMoving = true; }
        if (moveState.left) { playerGroup.translateX(-walkSpeed * delta); isMoving = true; }
        if (moveState.right) { playerGroup.translateX(walkSpeed * delta); isMoving = true; }

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
                const animSpeed = isMoving ? 5 : 8; 
                cat.userData.legs[0].rotation.x = Math.sin(time * 0.01 * animSpeed) * 0.5; 
                cat.userData.legs[3].rotation.x = Math.sin(time * 0.01 * animSpeed) * 0.5; 
                cat.userData.legs[1].rotation.x = Math.sin(time * 0.01 * animSpeed + Math.PI) * 0.5; 
                cat.userData.legs[2].rotation.x = Math.sin(time * 0.01 * animSpeed + Math.PI) * 0.5; 
                
                cat.userData.tail.rotation.z = Math.sin(catTime * 8) * 0.3; 
                cat.userData.body.position.y = 0.35 + Math.sin(time * 0.02 * animSpeed) * 0.02; 
            } else {
                cat.userData.legs.forEach(leg => leg.rotation.x = 0);
                cat.userData.body.position.y = 0.35;
                const breath = 1 + Math.sin(catTime * 2) * 0.05;
                cat.userData.body.scale.set(1, breath, 1);
                cat.userData.tail.rotation.z = Math.sin(catTime * 3) * 0.2;
            }
            
            cat.userData.tail.rotation.x = 0.5 + Math.sin(catTime * 1.5) * 0.1;
            cat.userData.head.rotation.y = THREE.MathUtils.clamp(-cat.userData.turnVelocity * 15.0, -Math.PI/3, Math.PI/3);
        }

    } else if (isCreatorMode && document.getElementById('uv-editor').style.display !== 'block') {
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
    renderer.render(scene, camera);
}

// ==========================================
// INDEXEDDB SAVE & HELPERS
// ==========================================

function idbSave(data) {
    const request = indexedDB.open('psx_db', 1);
    request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('saves');
    };
    request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('saves', 'readwrite');
        tx.objectStore('saves').put(data, 'main_save');
    };
}

function idbLoad(callback) {
    const request = indexedDB.open('psx_db', 1);
    request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('saves');
    };
    request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('saves', 'readonly');
        if (!db.objectStoreNames.contains('saves')) return callback(null);
        const getReq = tx.objectStore('saves').get('main_save');
        getReq.onsuccess = () => callback(getReq.result);
        getReq.onerror = () => callback(null);
    };
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

function savePositions() {
    const data = {};
    const objs = [...interactables];
    if (window.psxCat) objs.push(window.psxCat);

    objs.forEach(obj => {
        const objData = {
            position: obj.position.toArray(),
            rotation: obj.rotation.toArray().slice(0,3),
            textures: {}
        };
        
        obj.traverse((child) => {
            if (child.isMesh && child.userData.faceTextures) {
                const path = getMeshPath(child, obj);
                objData.textures[path] = {
                    faces: child.userData.faceTextures,
                    uvs: child.userData.uvData || {}
                };
            }
        });
        
        data[obj.userData.id] = objData;
    });
    idbSave(data);
}

function loadPositions() {
    idbLoad((data) => {
        if (!data) return;
        const objs = [...interactables];
        if (window.psxCat) objs.push(window.psxCat);

        objs.forEach(obj => {
            if (data[obj.userData.id]) {
                const d = data[obj.userData.id];
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
                                const dataUrl = faceMap[faceIdx];
                                mesh.userData.faceTextures[faceIdx] = dataUrl;

                                const tex = new THREE.TextureLoader().load(dataUrl);
                                tex.magFilter = THREE.NearestFilter;
                                tex.minFilter = THREE.NearestFilter;
                                tex.colorSpace = THREE.SRGBColorSpace;
                                
                                if (uvMap[faceIdx]) {
                                    mesh.userData.uvData[faceIdx] = uvMap[faceIdx];
                                    tex.offset.fromArray(uvMap[faceIdx].offset);
                                    tex.repeat.fromArray(uvMap[faceIdx].repeat);
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
    });
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

function createCat() {
    const catGroup = new THREE.Group();
    const catMat = new THREE.MeshLambertMaterial({ color: 0xd97c2b });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x4a280b });

    catGroup.userData = { id: 'cat_1' };

    const bodyGeo = new THREE.BoxGeometry(0.3, 0.25, 0.6);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.set(0, 0.35, 0);
    catGroup.add(body);
    catGroup.userData.body = body;

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, -0.35); 
    catGroup.add(headGroup);
    catGroup.userData.head = headGroup;

    const headGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const head = new THREE.Mesh(headGeo, catMat);
    head.position.set(0, 0.1, -0.1);
    headGroup.add(head);

    const earGeo = new THREE.BoxGeometry(0.08, 0.1, 0.05);
    const earL = new THREE.Mesh(earGeo, darkMat);
    earL.position.set(0.08, 0.25, -0.1);
    headGroup.add(earL);
    const earR = new THREE.Mesh(earGeo, darkMat);
    earR.position.set(-0.08, 0.25, -0.1);
    headGroup.add(earR);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.45, 0.3); 
    catGroup.add(tailGroup);
    catGroup.userData.tail = tailGroup;

    const tailGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05);
    const tail = new THREE.Mesh(tailGeo, darkMat);
    tail.position.set(0, 0.2, 0); 
    tailGroup.add(tail);

    const legGeo = new THREE.BoxGeometry(0.06, 0.25, 0.06);
    const positions = [
        [-0.12, 0.25, -0.2], 
        [0.12, 0.25, -0.2],  
        [-0.12, 0.25, 0.2],  
        [0.12, 0.25, 0.2]    
    ];

    catGroup.userData.legs = [];
    positions.forEach((pos) => {
        const legPivot = new THREE.Group();
        legPivot.position.set(pos[0], pos[1], pos[2]);
        catGroup.add(legPivot);

        const leg = new THREE.Mesh(legGeo, catMat);
        leg.position.set(0, -0.125, 0); 
        legPivot.add(leg);

        catGroup.userData.legs.push(legPivot);
    });

    return catGroup;
}
