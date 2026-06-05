import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let camera, scene, renderer, controls, transformControl;
const moveState = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

let isCreatorMode = false;
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
    camera.position.y = 1.6;

    controls = new PointerLockControls(camera, document.body);
    const info = document.getElementById('info');
    
    info.addEventListener('click', () => {
        if (!isCreatorMode) {
            controls.lock();
        }
    });

    controls.addEventListener('lock', () => {
        info.style.display = 'none';
        document.getElementById('crosshair').style.display = 'block';
    });

    controls.addEventListener('unlock', () => {
        if (!isCreatorMode) {
            info.style.display = 'block';
            document.getElementById('crosshair').style.display = 'none';
        }
    });

    scene.add(controls.getObject());

    // Setup TransformControls for Creator Mode
    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
        if (!event.value && transformControl.object) {
            savePositions();
        }
    });
    scene.add(transformControl);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const flashlight = new THREE.PointLight(0xffddaa, 1.5, 12);
    flashlight.position.set(0, -0.2, 0.5);
    camera.add(flashlight);

    // Textures
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

    // Floor & Ceiling
    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    const ceil = new THREE.Mesh(floorGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = roomHeight;
    group.add(ceil);

    // Walls
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

    // Pillars (Interactables)
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

    // Add Furniture (Interactables)
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

    // Load saved positions
    loadPositions();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousedown', onMouseDown);
}

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

function onMouseDown(event) {
    if (!isCreatorMode) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactables, true);

    if (intersects.length > 0) {
        const target = getFurnitureParent(intersects[0].object);
        if (target) {
            transformControl.attach(target);
            
            // Highlight effect
            target.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone(); // Clone material to not affect others
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
        if (!transformControl.dragging) {
            transformControl.detach();
        }
    }
}

function onKeyDown(event) {
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

function toggleCreatorMode() {
    isCreatorMode = !isCreatorMode;
    const creatorLabel = document.getElementById('creator-label');
    const crosshair = document.getElementById('crosshair');
    const info = document.getElementById('info');

    if (isCreatorMode) {
        controls.unlock();
        creatorLabel.style.display = 'block';
        crosshair.style.display = 'none';
        info.style.display = 'none';
    } else {
        transformControl.detach();
        controls.lock();
        creatorLabel.style.display = 'none';
        crosshair.style.display = 'block';
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const renderWidth = 320;
    renderer.setSize(renderWidth, renderWidth * (window.innerHeight / window.innerWidth), false);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    if (controls.isLocked === true && !isCreatorMode) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize();

        const speed = 25.0;
        if (moveState.forward || moveState.backward) velocity.z -= direction.z * speed * delta;
        if (moveState.left || moveState.right) velocity.x -= direction.x * speed * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        if (moveState.forward || moveState.backward || moveState.left || moveState.right) {
            camera.position.y = 1.6 + Math.sin(time * 0.008) * 0.06;
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}

function exportScene() {
    transformControl.detach(); // detach gizmo before exporting
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
        function (error) {
            console.error('Error exporting:', error);
        },
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
