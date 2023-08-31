import * as THREE from "./modules/three.module.js";

///   scene  creation   ///
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x6f6f6f);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

///   camera  position   ///
let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0, 3, 10);

///   floor   ///
let geometryFloor = new THREE.PlaneGeometry(10, 10);
let FloorMaterial = new THREE.MeshPhysicalMaterial({
	color: 0x020202, // Couleur noire
	metalness: 1,
	roughness: 0,
	side: THREE.DoubleSide,
});
let floor = new THREE.Mesh(geometryFloor, FloorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);


///   ceiling   ///
let ceiling = new THREE.Mesh(geometryFloor, FloorMaterial);
ceiling.rotation.x = -Math.PI / 2;
ceiling.position.y = 5;
scene.add(ceiling);

// Création d'un spot de lumière
const light = new THREE.SpotLight(0xffffff, 1.5, 10, -Math.PI, 0.1, 2);
light.position.set(0, 5, 0);
light.target.position.set(0, 5, 5);
scene.add(light.target);

// Ajout de la source de lumière à la scène
scene.add(light);

function moveCamera() {
	window.addEventListener("keydown", (event) => {
	  let keyCode = event.keyCode;
  
	  switch (keyCode) {
		// Move forward
		case 90:
		  camera.position.z -= 0.0003;
		  break;
  
		// Move backward
		case 83:
		  camera.position.z += 0.0003;
		  break;
  
		// Move left
		case 81:
		  camera.position.x -= 0.0003;
		  break;
  
		// Move right
		case 68:
		  camera.position.x += 0.0003;
		  break;
  
		// Rotate left
		case 65:
		  camera.rotation.y += Math.clamp(camera.rotation.y - 0.000005, -Math.PI / 2, Math.PI / 2);
		  camera.rotation.z = 0;
		  camera.rotation.x = 0;
		  break;
  
		// Rotate right
		case 69:
		  camera.rotation.y -= 0.01;
		  break;
	  	}
	});
}
function animate() {
	requestAnimationFrame(animate);
	moveCamera()
	renderer.render(scene, camera);
}

animate();