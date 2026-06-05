import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

let camera, scene, renderer, controls;
const moveState = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

init();
animate();

function init() {
    // 1. PSX Rendering resolution (Downscaled)
    const renderWidth = 320; 
    
    renderer = new THREE.WebGLRenderer({ antialias: false });
    // Set actual canvas size to low res, CSS stretches it out
    renderer.setSize(renderWidth, renderWidth * (window.innerHeight / window.innerWidth), false);
    renderer.setPixelRatio(1);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    // Dark thick fog for horror atmosphere
    scene.fog = new THREE.FogExp2(0x020202, 0.15); 

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.y = 1.6; // Player height

    // FPS Controls
    controls = new PointerLockControls(camera, document.body);
    const info = document.getElementById('info');
    
    info.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        info.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        info.style.display = 'block';
    });

    scene.add(controls.getObject());

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Very dark ambient
    scene.add(ambientLight);

    // Flashlight
    const flashlight = new THREE.PointLight(0xffddaa, 1.5, 12);
    flashlight.position.set(0, -0.2, 0.5);
    camera.add(flashlight);

    // Textures (from your Whisk1 folder)
    const textureLoader = new THREE.TextureLoader();
    
    // Helper to make textures look PSX style (pixelated, no smoothing)
    const loadPSXTexture = (path, repeatX, repeatY) => {
        const tex = textureLoader.load(path);
        tex.magFilter = THREE.NearestFilter; 
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false; // No mipmaps, pure pixels
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

    // Build the Environment
    const roomSize = 20;
    const roomHeight = 3;
    const group = new THREE.Group();

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    // Ceiling
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

    // Add some random pillars
    const pillarGeo = new THREE.BoxGeometry(1, roomHeight, 1);
    for (let i = 0; i < 15; i++) {
        const pillar = new THREE.Mesh(pillarGeo, wallMat);
        pillar.position.x = (Math.random() - 0.5) * (roomSize - 2);
        pillar.position.z = (Math.random() - 0.5) * (roomSize - 2);
        pillar.position.y = roomHeight / 2;
        group.add(pillar);
    }

    scene.add(group);

    // Make group globally accessible for export
    window.sceneGroup = group;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const renderWidth = 320;
    renderer.setSize(renderWidth, renderWidth * (window.innerHeight / window.innerWidth), false);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    if (controls.isLocked === true) {
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

        // Head bobbing effect
        if (moveState.forward || moveState.backward || moveState.left || moveState.right) {
            camera.position.y = 1.6 + Math.sin(time * 0.008) * 0.06;
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}

function exportScene() {
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
            alert("Đã tải xuống file psx_house.gltf! Bạn có thể import vào Blender hoặc Unity.");
        },
        function (error) {
            console.error('Error exporting:', error);
            alert("Lỗi khi xuất file.");
        },
        {} 
    );
}
