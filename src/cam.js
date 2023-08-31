import * as THREE from "../three.js/build/three.module.js";
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../three.js/examples/jsm/libs/lil-gui.module.min.js';

let renderer, camera, scene
let container
let controls
let orbitControlsEnabled = false;

init();
animate();

function init(){
	container = document.getElementById( 'container' );

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.useLegacyLights = false;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.5;
	container.appendChild( renderer.domElement );

	//

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x6f6f6f);

	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
	camera.position.set( 0, 3, 10 );
	camera.lookAt(0,0,0)

	// CONTROLS
	const gui = new GUI();
	controls = new OrbitControls( camera, renderer.domElement );
	gui.add({ orbitControlsEnabled: orbitControlsEnabled }, 'orbitControlsEnabled').name('Activer les contrôles').onChange(function (value) {
		orbitControlsEnabled = value;
	});

	////    LIGN CAM    ////
	const lignPoints = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(2, 1, -4),
		new THREE.Vector3(3, 2, -8),
		new THREE.Vector3(2, 3, -12),
		new THREE.Vector3(0, 4, -16),
		new THREE.Vector3(0, 4, -20),
		new THREE.Vector3(-3, 2, -26),
		new THREE.Vector3(-2, 2, -32),
		new THREE.Vector3(-3, 4, -37),
	];
  
	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
	const lineGroup = new THREE.Group();
	
	const numLines = 5; // Nombre de lignes parallèles
	const lineSpacing = 0.01; // Espacement entre les lignes
	
	for (let i = 0; i < numLines; i++) {
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(lignPoints);
	
		const line = new THREE.Line(lineGeometry, lineMaterial);
		line.position.set(0, 0.05 + i * lineSpacing, 5); // Ajustez la hauteur et la position selon vos besoins
	
		lineGroup.add(line);
	}
	
	scene.add(lineGroup);
	
	const geometry = new THREE.PlaneGeometry(100, 100);
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = Math.PI / 2;
	scene.add(mesh);
	
	// Récupérez la position de départ de la caméra
	const cameraStartPosition = camera.position.clone();
	
	// Calculez la distance maximale que la caméra peut se déplacer
	const maxDistance = 2; // Ajustez cette valeur selon vos besoins
	
	// Créez une courbe à partir des points de la ligne
	const curve = new THREE.CatmullRomCurve3(lignPoints);
	
	// Définissez les points cibles que la caméra va regarder à différents moments
	const lookAtTargets = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, -4),
		new THREE.Vector3(0, 2, -8),
		new THREE.Vector3(0, 4, -12),
		new THREE.Vector3(0, 4, -16),
		new THREE.Vector3(0, 2, -20),
		new THREE.Vector3(0, 2, -26),
		new THREE.Vector3(0, 4, -32),
		new THREE.Vector3(0, 4, -37),
	];
	
	// Ajoutez un écouteur d'événements pour détecter les événements de défilement
	window.addEventListener('scroll', function () {
		// Récupérez la position de défilement
		const scrollPosition = window.scrollY;
	
		// Calculez la distance de déplacement de la caméra en fonction de la position de défilement
		const distance = (scrollPosition / window.innerHeight) * maxDistance / 6;
	
		// Trouvez les indices des deux points cibles les plus proches
		const startIndex = Math.floor(distance * (lookAtTargets.length - 1));
		const endIndex = startIndex + 1;
	
		// Interpolez linéairement entre les deux points cibles en fonction de la fraction de distance
		const fraction = (distance - startIndex / (lookAtTargets.length - 1)) * (lookAtTargets.length - 1);
		const interpolatedTarget = new THREE.Vector3().lerpVectors(lookAtTargets[startIndex], lookAtTargets[endIndex], fraction);
	
		// Calculez la nouvelle position de la caméra en utilisant la position de départ et le point sur la courbe
		const newCameraPosition = cameraStartPosition.clone().add(curve.getPointAt(distance));
	
		// Mettez à jour la position de la caméra
		camera.position.copy(newCameraPosition);
	
		// Calculez la direction vers le point cible
		const cameraDirection = new THREE.Vector3().subVectors(interpolatedTarget, newCameraPosition).normalize();
	
		// Calculez le nouveau point de vue de la caméra en ajoutant la direction à la position actuelle de la caméra
		const newCameraLookAt = new THREE.Vector3().addVectors(newCameraPosition, cameraDirection);
	
		camera.lookAt(newCameraLookAt);
	
		// Affichez la position de défilement dans la console
		console.log('Scroll Position:', scrollPosition);
	});
  
  
}

function animate() {
	requestAnimationFrame( animate );
	if (orbitControlsEnabled) {
		controls.enabled = true; // Activer les contrôles
		controls.update();
	} else {
		controls.enabled = false; // Désactiver les contrôles
	  }
	render();
}

function render() {
	renderer.clear();
	renderer.render( scene, camera );	
}


