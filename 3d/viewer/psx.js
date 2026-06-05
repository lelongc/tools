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

// Custom Editor Camera Variables (Creator Mode)
let isRightMouseDown = false;
let isZooming = false;
const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const PI_2 = Math.PI / 2;

// TPS Player Variables (Play Mode)
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
    
    // 1. TPS Player (Play Mode)
    playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 2); // Initial spawn pos
    scene.add(playerGroup);

    cameraArm = new THREE.Group();
    cameraArm.position.set(0, 0.4, 0); // Pivot height
    playerGroup.add(cameraArm);

    cameraArm.add(camera);
    camera.position.set(0, 0.4, 2); // Offset behind the cat

    // Cat Model
    const cat = createCat();
    // Do not rotate the cat, its natural face is -Z, which perfectly matches camera looking at -Z
    playerGroup.add(cat);
    window.psxCat = cat;

    // 2. Transform Controls (Gizmo)
    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', function (event) {
        if (!event.value && transformControl.object) {
            savePositions();
        }
    });
    scene.add(transformControl);

    // Prevent default right click menu
    document.addEventListener('contextmenu', e => e.preventDefault());

    // UI Events (Pointer Lock)
    const info = document.getElementById('info');
    info.addEventListener('click', () => {
        if (!isCreatorMode) document.body.requestPointerLock();
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

    // ==========================================
    // SCENE & ENVIRONMENT
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const flashlight = new THREE.PointLight(0xffddaa, 1.5, 12);
    flashlight.position.set(0, 0, 1);
    cameraArm.add(flashlight); // Flashlight moves with the camera arm

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
        
        // Detach camera from Cat, make it fly freely in world space
        scene.attach(camera); 
        
        creatorLabel.style.display = 'block';
        crosshair.style.display = 'none';
        info.style.display = 'none';
    } else {
        transformControl.detach();
        document.body.requestPointerLock();
        
        // Re-attach camera to Cat (TPS)
        cameraArm.add(camera);
        camera.position.set(0, 0.4, 2); // reset offset
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
        transformControl.setTranslationSnap(0.5); // Snap to 0.5 meters
        transformControl.setRotationSnap(THREE.MathUtils.degToRad(45)); // Snap to 45 degrees
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
    
    // Middle click Look around (button 1)
    if (event.button === 1) {
        isRightMouseDown = true; // reusing the variable name but it means middle mouse now
    }

    // Ctrl + Drag to Zoom
    if (event.ctrlKey) {
        isZooming = true;
    }

    // Left click Select
    if (event.button === 0 && !event.ctrlKey && !event.shiftKey) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactables, true);

        if (intersects.length > 0) {
            const target = getFurnitureParent(intersects[0].object);
            if (target) {
                transformControl.attach(target);
                
                target.traverse((child) => {
                    if (child.isMesh) {
                        if(!child.userData.originalMat) child.userData.originalMat = child.material;
                        child.material = child.material.clone(); 
                        child.material.emissive.setHex(0x555555);
                    }
                });
                setTimeout(() => {
                    target.traverse((child) => {
                        if (child.isMesh) child.material.emissive.setHex(0x000000);
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
        // Zooming using Ctrl + Drag
        if (event.ctrlKey && event.buttons > 0) {
            const zoomSpeed = 0.02;
            const delta = (Math.abs(event.movementX) > Math.abs(event.movementY)) ? event.movementX : -event.movementY;
            camera.translateZ(delta * zoomSpeed);
            return; 
        }

        // Panning using Shift + Drag
        if (event.shiftKey && event.buttons > 0) {
            const panSpeed = 0.02;
            camera.translateX(-event.movementX * panSpeed);
            camera.translateY(event.movementY * panSpeed);
            return;
        }

        // Look around like Unity Editor
        if (isRightMouseDown) {
            euler.setFromQuaternion(camera.quaternion);
            euler.y -= event.movementX * 0.002;
            euler.x -= event.movementY * 0.002;
            euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
            camera.quaternion.setFromEuler(euler);
        }
    } else if (isPointerLocked) {
        // Play Mode: TPS Camera Rotation
        const turnSpeed = event.movementX * 0.003;
        playerGroup.rotation.y -= turnSpeed;
        cameraArm.rotation.x -= event.movementY * 0.003;
        // Clamp pitch so camera doesn't flip
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
// INPUT HANDLING
// ==========================================

function onKeyDown(event) {
    if (isCreatorMode) {
        switch (event.code) {
            case 'KeyC': toggleCreatorMode(); break;
            case 'KeyE': exportScene(); break;
            case 'KeyT': transformControl.setMode('translate'); break;
            case 'KeyR': transformControl.setMode('rotate'); break;
            case 'KeyX': toggleSnap(); break;
            // WASD for flying
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
// CORE LOOP & DATA
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
        // Play Mode: Walking the Cat (TPS)
        const walkSpeed = 3.0;
        let isMoving = false;

        if (moveState.forward) { playerGroup.translateZ(-walkSpeed * delta); isMoving = true; }
        if (moveState.backward) { playerGroup.translateZ(walkSpeed * delta); isMoving = true; }
        if (moveState.left) { playerGroup.translateX(-walkSpeed * delta); isMoving = true; }
        if (moveState.right) { playerGroup.translateX(walkSpeed * delta); isMoving = true; }

        // Cat Animation
        if (window.psxCat) {
            const cat = window.psxCat;
            const catTime = time * 0.002;
            
            // Handle turning velocity decay
            cat.userData.turnVelocity = cat.userData.turnVelocity || 0;
            if (cat.userData.turnTarget) {
                cat.userData.turnVelocity = THREE.MathUtils.lerp(cat.userData.turnVelocity, cat.userData.turnTarget, 0.5);
                cat.userData.turnTarget = 0; // reset target
            } else {
                cat.userData.turnVelocity *= 0.8; // decay
            }

            const isTurning = Math.abs(cat.userData.turnVelocity) > 0.001;

            if (isMoving || isTurning) {
                // Walk cycle (runs when moving OR turning)
                const animSpeed = isMoving ? 5 : 8; 
                cat.userData.legs[0].rotation.x = Math.sin(time * 0.01 * animSpeed) * 0.5; // FL
                cat.userData.legs[3].rotation.x = Math.sin(time * 0.01 * animSpeed) * 0.5; // BR
                cat.userData.legs[1].rotation.x = Math.sin(time * 0.01 * animSpeed + Math.PI) * 0.5; // FR
                cat.userData.legs[2].rotation.x = Math.sin(time * 0.01 * animSpeed + Math.PI) * 0.5; // BL
                
                cat.userData.tail.rotation.z = Math.sin(catTime * 8) * 0.3; // Fast wag
                cat.userData.body.position.y = 0.35 + Math.sin(time * 0.02 * animSpeed) * 0.02; // Bounce
            } else {
                // Idle
                cat.userData.legs.forEach(leg => leg.rotation.x = 0);
                cat.userData.body.position.y = 0.35;
                const breath = 1 + Math.sin(catTime * 2) * 0.05;
                cat.userData.body.scale.set(1, breath, 1);
                cat.userData.tail.rotation.z = Math.sin(catTime * 3) * 0.2;
            }
            
            cat.userData.tail.rotation.x = 0.5 + Math.sin(catTime * 1.5) * 0.1;
            
            // Head turning based on mouse movement instead of automatic bobbing
            cat.userData.head.rotation.y = THREE.MathUtils.clamp(-cat.userData.turnVelocity * 15.0, -Math.PI/3, Math.PI/3);
        }

    } else if (isCreatorMode) {
        // Creator Mode: Flying freely (Unity style)
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize();

        const flySpeed = 25.0;
        if (moveState.forward || moveState.backward) velocity.z -= direction.z * flySpeed * delta;
        if (moveState.left || moveState.right) velocity.x -= direction.x * flySpeed * delta;

        // Apply local translation directly to camera for flying
        camera.translateX(-velocity.x * delta);
        camera.translateZ(velocity.z * delta);
    }

    prevTime = time;
    renderer.render(scene, camera);
}

// ==========================================
// HELPERS
// ==========================================

function savePositions() {
    const data = {};
    interactables.forEach(obj => {
        data[obj.userData.id] = {
            position: obj.position.toArray(),
            rotation: obj.rotation.toArray().slice(0,3)
        };
    });
    localStorage.setItem('psx_save', JSON.stringify(data));
}

function loadPositions() {
    const saved = localStorage.getItem('psx_save');
    if (saved) {
        const data = JSON.parse(saved);
        interactables.forEach(obj => {
            if (data[obj.userData.id]) {
                obj.position.fromArray(data[obj.userData.id].position);
                obj.rotation.fromArray(data[obj.userData.id].rotation);
            }
        });
    }
}

function getFurnitureParent(object) {
    if (object.userData && object.userData.isFurniture) return object;
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
    // Use an orange color with basic material for PSX look
    const catMat = new THREE.MeshLambertMaterial({ color: 0xd97c2b });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x4a280b });

    catGroup.userData = {};

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.3, 0.25, 0.6);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.set(0, 0.35, 0);
    catGroup.add(body);
    catGroup.userData.body = body;

    // Head Pivot
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, -0.35); // Front of the body
    catGroup.add(headGroup);
    catGroup.userData.head = headGroup;

    // Head Mesh
    const headGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const head = new THREE.Mesh(headGeo, catMat);
    head.position.set(0, 0.1, -0.1);
    headGroup.add(head);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.08, 0.1, 0.05);
    const earL = new THREE.Mesh(earGeo, darkMat);
    earL.position.set(0.08, 0.25, -0.1);
    headGroup.add(earL);
    const earR = new THREE.Mesh(earGeo, darkMat);
    earR.position.set(-0.08, 0.25, -0.1);
    headGroup.add(earR);

    // Tail Pivot
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.45, 0.3); // Back of the body
    catGroup.add(tailGroup);
    catGroup.userData.tail = tailGroup;

    // Tail Mesh
    const tailGeo = new THREE.BoxGeometry(0.05, 0.4, 0.05);
    const tail = new THREE.Mesh(tailGeo, darkMat);
    tail.position.set(0, 0.2, 0); // Offset so it rotates from base
    tailGroup.add(tail);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.06, 0.25, 0.06);
    const positions = [
        [-0.12, 0.25, -0.2], // Front Right
        [0.12, 0.25, -0.2],  // Front Left
        [-0.12, 0.25, 0.2],  // Back Right
        [0.12, 0.25, 0.2]    // Back Left
    ];

    catGroup.userData.legs = [];
    positions.forEach((pos) => {
        const legPivot = new THREE.Group();
        legPivot.position.set(pos[0], pos[1], pos[2]);
        catGroup.add(legPivot);

        const leg = new THREE.Mesh(legGeo, catMat);
        leg.position.set(0, -0.125, 0); // Offset to rotate from hip
        legPivot.add(leg);

        catGroup.userData.legs.push(legPivot);
    });

    return catGroup;
}
