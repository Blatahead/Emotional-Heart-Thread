import * as THREE from "../three.js/build/three.module.js";
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import Stats from '../three.js/examples/jsm/libs/stats.module.js';

let container
let stats;
let controls
let camera, scene, renderer


init();
animate();

function init(){
	container = document.getElementById( 'container' );

	// SCENE
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x6f6f6f);

	// CAMERA
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(-35,60,40);
	camera.lookAt(0,0,0)

	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias : false });
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//STATS
	stats = new Stats();
	document.body.appendChild( stats.dom );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.update()

	// Chargement de la texture de marbre
	const textureLoader = new THREE.TextureLoader();
	const marbleTexture = textureLoader.load('./textures/marbre.jpg');

	// Création du matériau avec la texture de marbre
	const marbleMaterial = new THREE.MeshStandardMaterial({
	map: marbleTexture, // Appliquer la texture au matériau
	roughness: 1, // Rugosité du matériau (ajustez selon vos préférences)
	metalness: 0.5, // Métallité du matériau (ajustez selon vos préférences)
	side: THREE.DoubleSide,
	});

	const dimensStair2 = [40,3,40,
		35,3,35,
		30,3,30,
		25,3,25,
		20,3,20,
		10,3,22.5,
		10,3,25,
		10,3,27.5,
		10,3,30]

	// Génération de la géométrie de la marche
	const geometryStep1 = new THREE.BoxGeometry(dimensStair2[0], dimensStair2[1], dimensStair2[2]);
	const geometryStep2 = new THREE.BoxGeometry(dimensStair2[3], dimensStair2[4], dimensStair2[5]);
	const geometryStep3 = new THREE.BoxGeometry(dimensStair2[6], dimensStair2[7], dimensStair2[8]);
	const geometryStep4 = new THREE.BoxGeometry(dimensStair2[9], dimensStair2[10], dimensStair2[11]);
	const geometryStep5 = new THREE.BoxGeometry(dimensStair2[12], dimensStair2[13], dimensStair2[14]);
	const geometryStep6 = new THREE.BoxGeometry(dimensStair2[15], dimensStair2[16], dimensStair2[17]);
	const geometryStep7 = new THREE.BoxGeometry(dimensStair2[18], dimensStair2[19], dimensStair2[20]);
	const geometryStep8 = new THREE.BoxGeometry(dimensStair2[21], dimensStair2[22], dimensStair2[23]);
	const geometryStep9 = new THREE.BoxGeometry(dimensStair2[24], dimensStair2[25], dimensStair2[26]);

	// Création du maillage de la marche avec le matériau de marbre
	const step1 = new THREE.Mesh(geometryStep1, marbleMaterial);
	const step2 = new THREE.Mesh(geometryStep2, marbleMaterial);
	const step3 = new THREE.Mesh(geometryStep3, marbleMaterial);
	const step4 = new THREE.Mesh(geometryStep4, marbleMaterial);
	const step5 = new THREE.Mesh(geometryStep5, marbleMaterial);
	const step6 = new THREE.Mesh(geometryStep6, marbleMaterial);
	const step7 = new THREE.Mesh(geometryStep7, marbleMaterial);
	const step8 = new THREE.Mesh(geometryStep8, marbleMaterial);
	const step9 = new THREE.Mesh(geometryStep9, marbleMaterial);

	step1.position.set(0, 0, -20);
	step2.position.set(2.5, 5, -24.75);
	step3.position.set(5, 10, -30);
	step4.position.set(7.5, 15, -34.75);
	step5.position.set(10, 20, -40);
	step6.position.set(25, 24, -41.25);
	step7.position.set(35, 29, -42.5);
	step8.position.set(45, 34, -43.75);
	step9.position.set(55, 38.5, -45);

	// Ajout du maillage à la scène
	scene.add(step1);
	scene.add(step2);
	scene.add(step3);
	scene.add(step4);
	scene.add(step5);
	scene.add(step6);
	scene.add(step7);
	scene.add(step8);
	scene.add(step9);

	///   ambient light   ///
	let al = new THREE.AmbientLight(0xffffff,0.5)
	scene.add(al)
	
	//wall
	const geowall = new THREE.PlaneGeometry(30, 80);
	const wall = new THREE.Mesh(geowall, marbleMaterial);
	wall.position.set(20.01, 40, -15);
	wall.rotation.set(0,Math.PI/2,0)
	wall.receiveShadow = true;
	scene.add(wall);

	const geowall2 = new THREE.PlaneGeometry(40, 80);
	const wall2 = new THREE.Mesh(geowall2, marbleMaterial);
	wall2.position.set(40, 40, -29.99);
	wall2.rotation.set(0,0,0)
	wall2.receiveShadow = true;
	scene.add(wall2);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	renderer.clear();
	renderer.render( scene, camera );	
	stats.update();
}