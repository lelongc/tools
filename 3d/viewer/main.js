import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let scene, camera, renderer, controls, mixer;
let clock = new THREE.Clock();
let currentModel = null;
let currentAction = null;

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const viewerContainer = document.getElementById('viewer-container');
const btnClose = document.getElementById('btn-close');
const animationList = document.getElementById('animation-list');
const canvas = document.getElementById('canvas3d');

// Setup Drag & Drop
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

btnClose.addEventListener('click', () => {
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    mixer = null;
    viewerContainer.style.display = 'none';
    dropZone.style.display = 'flex';
    animationList.innerHTML = '<p>No animations found.</p>';
});

function initThree() {
    if (scene) return; // Already initialized

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);
    
    // Add grid and axes
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function handleFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const url = URL.createObjectURL(file);

    dropZone.style.display = 'none';
    viewerContainer.style.display = 'block';

    initThree();

    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }

    if (extension === 'glb' || extension === 'gltf') {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            currentModel = gltf.scene;
            setupModel(currentModel, gltf.animations);
        }, undefined, (error) => {
            console.error('Error loading GLTF:', error);
            alert('Error loading file.');
        });
    } else if (extension === 'fbx') {
        const loader = new FBXLoader();
        loader.load(url, (fbx) => {
            currentModel = fbx;
            setupModel(currentModel, fbx.animations);
        }, undefined, (error) => {
            console.error('Error loading FBX:', error);
            alert('Error loading file.');
        });
    } else {
        alert('Unsupported file format. Please use .glb, .gltf, or .fbx');
        btnClose.click();
    }
}

function setupModel(model, animations) {
    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);

    controls.maxDistance = size * 10;
    camera.position.copy(center);
    camera.position.x += size / 1.5;
    camera.position.y += size / 2.0;
    camera.position.z += size / 1.0;
    camera.lookAt(center);
    controls.target.copy(center);

    // Cast shadows
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(model);

    // Setup Animations
    animationList.innerHTML = '';
    mixer = null;

    if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        
        animations.forEach((clip, index) => {
            const btn = document.createElement('button');
            btn.className = 'anim-btn';
            btn.innerText = clip.name || `Animation ${index + 1}`;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (currentAction) {
                    currentAction.stop();
                }
                
                currentAction = mixer.clipAction(clip);
                currentAction.play();
            });

            animationList.appendChild(btn);
        });

        // Play first animation by default
        if (animations.length > 0) {
            document.querySelector('.anim-btn').click();
        }
    } else {
        animationList.innerHTML = '<p>No animations found.</p>';
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (controls) controls.update();

    renderer.render(scene, camera);
}
