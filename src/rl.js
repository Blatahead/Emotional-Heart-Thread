import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6f6f6f);

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2,7,-18);


//Create a WebGLRenderer and turn on shadows in the renderer
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

///   floor   ///
let geometryFloor = new THREE.PlaneGeometry(20, 20);
let Floor4Material = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, roughness:0.1, metalness:0.1})
let floor4 = new THREE.Mesh(geometryFloor, Floor4Material);
floor4.rotation.x = -Math.PI / 2;
floor4.position.set(0, 0, 0);
floor4.receiveShadow = true;
scene.add(floor4);

const sl = new THREE.SpotLight( 0xffffff,60 );
sl.position.set( 0, 19, 0 );
sl.target.position.set(10, 0, 0 );
sl.castShadow = true;
sl.angle = Math.PI;
sl.penumbra = 0.5;
sl.decay = 1.5;
sl.distance = 20;
//scene.add(sl);

const width = 3;
const height = 3;
const intensity = 5;
const sourceGeometry = new THREE.BoxGeometry(width,height,0.1);
const redColor = 0xff0000;
const blueColor = 0x0000ff;

// rouge
const rlr = new THREE.RectAreaLight( redColor, intensity, width, height );
rlr.position.set( 5, 1.5, 5 );
scene.add(rlr);
const sourceMaterialRed = new THREE.MeshBasicMaterial({color:redColor})
const sourceR = new THREE.Mesh(sourceGeometry,sourceMaterialRed)
sourceR.rotation.set(0,Math.PI,0)
sourceR.position.copy(rlr.position)
scene.add(sourceR)

// wall
const geometryWall = new THREE.PlaneGeometry(20,height)
const textureWall = new THREE.MeshStandardMaterial({color:0xffffff, side: THREE.DoubleSide, roughness:0.1, metalness:0.1})
const wall = new THREE.Mesh(geometryWall,textureWall)
wall.rotation.set(0,Math.PI/2,0)
wall.position.set(2.5,1.5,0)
const wall2 = new THREE.Mesh(geometryWall,textureWall)
wall2.rotation.set(0,Math.PI/2,0)
wall2.position.set(-2.5,1.5,0)


// vert
const rl = new THREE.RectAreaLight( 0x00ff00, intensity, width, height );
rl.position.set( 0, 1.5, 5 );
scene.add(rl);
const sourceMaterial = new THREE.MeshBasicMaterial({color:0x00ff00})
const source = new THREE.Mesh(sourceGeometry,sourceMaterial)
source.rotation.set(0,Math.PI,0)
source.position.copy(rl.position)
scene.add(source)

// blue
const rlb = new THREE.RectAreaLight( blueColor, intensity, width, height );
rlb.position.set( -5, 1.5, 5 );
scene.add(rlb);
const sourceMaterialBlue = new THREE.MeshBasicMaterial({color:blueColor})
const sourceB = new THREE.Mesh(sourceGeometry,sourceMaterialBlue)
sourceB.rotation.set(0,Math.PI,0)
sourceB.position.copy(rlb.position)
scene.add(sourceB)


// const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
// rectLight2.position.set( 0, 5, 5 );
// scene.add( rectLight2 );
// const helper = new THREE.RectAreaLightHelper(rectLight2)
// rectLight2.add(helper)

// const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 10 );
// rectLight3.position.set( 5, 5, 5 );
// scene.add( rectLight3 );

function animate() {

	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);

};

animate();