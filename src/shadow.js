import * as THREE from "./modules/three.module.js";
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6f6f6f);

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20,20, 40);


//Create a WebGLRenderer and turn on shadows in the renderer
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//Create a SpotLight and turn on shadows for the light
const light = new THREE.SpotLight( 0xffffff,3);
light.position.set(0,20,30)
light.castShadow = true; // default false
light.angle = Math.PI / 6;
light.penumbra = 0.5;
light.decay = 2;
light.distance = 75;
light.castShadow = true;
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default
light.shadow.focus = 1; // default

//Create a sphere that cast shadows (but does not receive them)
const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
sphere.position.set(0,0,7)
scene.add( sphere );

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry( 100, 100, 32, 32 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00,side: THREE.DoubleSide,roughness:0.1 } )
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
plane.position.z = -10;
scene.add( plane );

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

function animate() {

	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);

};

animate();