import * as THREE from "../three.js/build/three.module.js";
import { GUI } from '../three.js/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import Stats from '../three.js/examples/jsm/libs/stats.module.js';
import {FontLoader} from '../three.js/examples/jsm/loaders/FontLoader.js';
import {GLTFLoader} from '../three.js/examples/jsm/loaders/GLTFLoader.js';


import textData from './textData.js';

let container;
let stats;
let controls
let camera, scene, renderer
let orbitControlsEnabled = true;

let geometryFloorEntry
let geometryFloorMez
let geometryEscEntry
let geometryFloorLow
let geometryFloorRoom1
let geometryFloorEntryRoom2
let geometryFloorRoom2
let geometryUnderEsc1
let geometryUnderEsc2
let geometryFloorCorridorRoom2

let FloorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
let FloorEscMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, side: THREE.DoubleSide});
let FloorUnderEscMaterial = new THREE.MeshPhongMaterial({color:0x000000});
let floorEntry
let floorMez
let floorEscRoom1
let floorRoom1
let floorEntryRoom2
let floorRoom2
let floorExitRoom2
let floorUnderEsc1
let floorUnderEsc2
let floorCorridorRoom2

let floorEscEntry
let geometryEscRoom1

let shapeFloorRoom2



init();
animate();

function init(){

	container = document.getElementById( 'container' );

	// SCENE
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x282c34);

	// CAMERA
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	// camera.position.set(87, 141, 258);
	camera.position.set(0,6,-0.5);


	
	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias : false });
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//STATS
	stats = new Stats();
	document.body.appendChild( stats.dom );

	// EVENTS
	window.addEventListener( 'resize', onWindowResize );

	//GUI
	const gui = new GUI();
	const options = {
		afficherElements: true,
	};
	const folderAffichage = gui.addFolder('Affichage');
	folderAffichage.add(options, 'afficherElements').name('Afficher les éléments').onChange(function(value) {
		// Mettez à jour la visibilité des éléments en fonction de la valeur choisie
		
		// Remplacez "shape3" par le nom de votre objet à afficher ou masqueré
	
		render();
	});
	
	// Rafraîchissez le rendu initial de la scène en fonction de la valeur initiale de "afficherElements"


	// Créez un objet pour stocker les valeurs de position de la caméra
	const cameraPosition = {
		x: 0,
		y: 0,
		z: 0,
		update: function() {
			// Mettez à jour les valeurs de position dans l'objet cameraPosition
			cameraPosition.x = camera.position.x;
			cameraPosition.y = camera.position.y;
			cameraPosition.z = camera.position.z;
		}
	};

	// Ajoutez des contrôles pour les valeurs de position
	const cameraFolder = gui.addFolder("Camera Position");
	cameraFolder.add(cameraPosition, "x").listen();
	cameraFolder.add(cameraPosition, "y").listen();
	cameraFolder.add(cameraPosition, "z").listen();

	// Ajoutez un bouton pour mettre à jour les valeurs
	cameraFolder.add(cameraPosition, "update").name("Update Position");


	///   ambient light   ///
	let al = new THREE.AmbientLight(0x000000,0)
	scene.add(al)

	// CONTROLS
	controls = new OrbitControls( camera, renderer.domElement );
	gui.add({ orbitControlsEnabled: orbitControlsEnabled }, 'orbitControlsEnabled').name('Activer les contrôles').onChange(function (value) {
		orbitControlsEnabled = value;
	});

	geometryFloorEntry = new THREE.PlaneGeometry(40, 160);
	floorEntry = new THREE.Mesh(geometryFloorEntry, FloorMaterial);
	floorEntry.rotation.x = -Math.PI / 2;
	floorEntry.position.set(0, 0, 0);
	floorEntry.receiveShadow = true;
	scene.add(floorEntry);

	geometryFloorMez = new THREE.PlaneGeometry(20,60);
	floorMez = new THREE.Mesh(geometryFloorMez,FloorMaterial);
	floorMez.rotation.set(-Math.PI/2,0,Math.PI/2);
	floorMez.position.set(-10,0,90);
	floorMez.receiveShadow = true;
	scene.add(floorMez);

	geometryEscEntry = new THREE.PlaneGeometry(89.44, 20);
	floorEscEntry = new THREE.Mesh(geometryEscEntry,FloorMaterial);
	floorEscEntry.rotation.set(THREE.MathUtils.degToRad(63.43),0,Math.PI/2);
	floorEscEntry.position.set(-30,-20,40);
	floorEscEntry.receiveShadow = true;
	scene.add(floorEscEntry);

	geometryFloorLow = new THREE.PlaneGeometry(40,60);
	floorMez = new THREE.Mesh(geometryFloorLow,FloorMaterial);
	floorMez.rotation.set(-Math.PI/2,0,Math.PI/2);
	floorMez.position.set(-10,-40,-20);
	floorMez.receiveShadow = true;
	scene.add(floorMez);

	geometryEscRoom1 = new THREE.PlaneGeometry(121.66, 40);
	floorEscRoom1 = new THREE.Mesh(geometryEscRoom1,FloorMaterial);
	floorEscRoom1.rotation.set(THREE.MathUtils.degToRad(-80.54),0,Math.PI/2);
	floorEscRoom1.position.set(0,-50,60);
	floorEscRoom1.receiveShadow = true;
	scene.add(floorEscRoom1);

	geometryFloorRoom1 = new THREE.PlaneGeometry(80,120);
	floorRoom1 = new THREE.Mesh(geometryFloorRoom1,FloorMaterial);
	floorRoom1.rotation.set(-Math.PI/2,0,Math.PI/2);
	floorRoom1.position.set(-40,-60,160);
	floorRoom1.receiveShadow = true;
	scene.add(floorRoom1);

	geometryUnderEsc1 = new THREE.PlaneGeometry(40,60);
	floorUnderEsc1 = new THREE.Mesh(geometryUnderEsc1,FloorUnderEscMaterial);
	floorUnderEsc1.rotation.set(-Math.PI/2,0,Math.PI/2);
	floorUnderEsc1.position.set(-130,-60,180);
	floorUnderEsc1.receiveShadow = true;
	scene.add(floorUnderEsc1);

	geometryUnderEsc2 = new THREE.PlaneGeometry(40,30);
	floorUnderEsc2 = new THREE.Mesh(geometryUnderEsc2,FloorUnderEscMaterial);
	floorUnderEsc2.rotation.set(-Math.PI/2,0,Math.PI/2);
	floorUnderEsc2.position.set(-145,-60,140);
	floorUnderEsc2.receiveShadow = true;
	scene.add(floorUnderEsc2);


	//////////////////// ESCALIER ////////////////////
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

	step1.position.set(-120, -58.5, 180);
	step1.rotation.set(0,Math.PI/2,0)
	step2.position.set(-125, -53.5, 177.5);
	step2.rotation.set(0,Math.PI/2,0)
	step3.position.set(-130, -48.5, 175);
	step3.rotation.set(0,Math.PI/2,0)
	step4.position.set(-135, -43.5, 172.5);
	step4.rotation.set(0,Math.PI/2,0)
	step5.position.set(-140, -38.5, 170);
	step5.rotation.set(0,Math.PI/2,0)

	step6.position.set(-141.25, -34.5, 155);
	step6.rotation.set(0,Math.PI/2,0)
	step7.position.set(-142.5, -29.5, 145);
	step7.rotation.set(0,Math.PI/2,0)
	step8.position.set(-143.75, -25.5, 135);
	step8.rotation.set(0,Math.PI/2,0)
	step9.position.set(-145, -21.5, 125);
	step9.rotation.set(0,Math.PI/2,0)

	scene.add(step1,step2,step3,step4,step5,step6,step7,step8,step9);
	
	//wall
	const geowall = new THREE.PlaneGeometry(30, 80);
	const wall = new THREE.Mesh(geowall, marbleMaterial);
	wall.position.set(-115, -20, 159.99);
	wall.rotation.set(0,0,0)
	wall.receiveShadow = true;
	scene.add(wall);

	const geowall2 = new THREE.PlaneGeometry(40, 80);
	const wall2 = new THREE.Mesh(geowall2, marbleMaterial);
	wall2.position.set(-129.99, -20, 140);
	wall2.rotation.set(0,Math.PI/2,0)
	wall2.receiveShadow = true;
	scene.add(wall2);

	//////////////////// ROOM 2 ////////////////////
	//Trapèze entry
	const petiteBase = 30;
	const grandeBase = 80;
	const hauteur = 50;

	// chemin pour le trapèze
	shapeFloorRoom2 = new THREE.Shape();
	shapeFloorRoom2.moveTo(-grandeBase / 2, -hauteur / 2); // Coin inférieur gauche
	shapeFloorRoom2.lineTo(grandeBase / 2, -hauteur / 2); // Coin inférieur droit
	shapeFloorRoom2.lineTo(petiteBase / 2, hauteur / 2); // Coin supérieur droit
	shapeFloorRoom2.lineTo(-petiteBase / 2, hauteur / 2); // Coin supérieur gauche
	shapeFloorRoom2.lineTo(-grandeBase / 2, -hauteur / 2); // Retour au coin inférieur gauche

	const extrudeSettings = { depth: 0, bevelEnabled: false };
	geometryFloorEntryRoom2 = new THREE.ExtrudeGeometry(shapeFloorRoom2, extrudeSettings);

	const floorRoomTwoMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, roughness:0.1, metalness:0.1})
	floorEntryRoom2 = new THREE.Mesh(geometryFloorEntryRoom2, floorRoomTwoMaterial);
	floorEntryRoom2.position.set(-145,-20,95)
	floorEntryRoom2.rotation.set(Math.PI/2,0,0)
	scene.add(floorEntryRoom2);

	geometryFloorRoom2 = new THREE.PlaneGeometry(80,200);
	floorRoom2 = new THREE.Mesh(geometryFloorRoom2,floorRoomTwoMaterial);
	floorRoom2.rotation.set(-Math.PI/2,0,0);
	floorRoom2.position.set(-145,-20,-30);
	floorRoom2.receiveShadow = true;
	scene.add(floorRoom2);

	const loader = new GLTFLoader();

	// trapèze sortie
	floorExitRoom2 = new THREE.Mesh(geometryFloorEntryRoom2, floorRoomTwoMaterial);
	floorExitRoom2.position.set(-145,-20,-155)
	floorExitRoom2.rotation.set(-Math.PI/2,0,0)
	scene.add(floorExitRoom2);

	/// couloir sortie salle 2
	geometryFloorCorridorRoom2 = new THREE.PlaneGeometry(30,100);
	floorCorridorRoom2 = new THREE.Mesh(geometryFloorCorridorRoom2,floorRoomTwoMaterial);
	floorCorridorRoom2.rotation.set(-Math.PI/2,0,0);
	floorCorridorRoom2.position.set(-145,-20,-230);
	floorCorridorRoom2.receiveShadow = true;
	scene.add(floorCorridorRoom2);

	//////////////////// SECOND STAIRS ////////////////////

	loader.load('./src/cylinders.glb', function (gltf) {
		gltf.scene.scale.set(87,157,80);
		gltf.scene.position.set(-144, -25, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});

	// center cylindre stairs
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, 0, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, -39.5, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, -79, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, 39.5, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, -118.5, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	loader.load('./src/centerCylinder.glb', function (gltf) {
		gltf.scene.scale.set(5,10,5);
		gltf.scene.position.set(-144, 79, -358.5);
		gltf.scene.rotation.set(Math.PI,0,Math.PI)
		scene.add(gltf.scene);
	});
	const dimensStair3 = [
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
		[40, 3, 60],
	];
	  
	// Génération de la géométrie de la marche
	const stepGeometries = dimensStair3.map(value => new THREE.BoxGeometry(value[0],value[1],value[2]));

	// Création du maillage de la marche avec le matériau de marbre
	const steps = stepGeometries.map(geometry => new THREE.Mesh(geometry, marbleMaterial));

	const angleIncrement = Math.PI /4; // Angle d'incrémentation pour chaque marche
	const radius = 60; // Rayon de l'escalier en colimaçon

	const stairContainer = new THREE.Object3D();
	// Placer les marches en colimaçon
	steps.forEach((step, index) => {
		const angle = index * angleIncrement;
		const height = index * dimensStair3[0][1]*3; // Hauteur de chaque marche

		// Calculer les coordonnées en fonction de l'angle et de la hauteur
		const x = -360 + radius * Math.cos(angle);
		const y = -21.5 - height;
		const z = 145 - radius * Math.sin(angle);
		console.log(x,y,z)

		step.position.set(x, y, z);
		step.rotation.set(0, angle, 0);
		scene.add(step);

		stairContainer.add(step);
	});
	scene.add(stairContainer);
	stairContainer.rotation.set(0, -Math.PI / 2, 0);

	  
	//////////////////////////////////////////////////

	////    LIGN CAM    ////
	const lignPoints = [
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(0, 1, 5),
		new THREE.Vector3(0, 1, 10),
		new THREE.Vector3(0, 1, 15),
		new THREE.Vector3(0, 1, 20),
		new THREE.Vector3(0, 1, 25),
		new THREE.Vector3(0, 1, 30),
		new THREE.Vector3(0, 1, 35),
		new THREE.Vector3(0, 1, 40),
		new THREE.Vector3(0, 1, 45),
		new THREE.Vector3(0, 1, 50),
		new THREE.Vector3(0, 1, 55),
		new THREE.Vector3(0, 1, 60),
		new THREE.Vector3(0, 1, 65),
		new THREE.Vector3(0, 1, 70),
		new THREE.Vector3(0, 1, 75),
		new THREE.Vector3(0, 1, 80),
		new THREE.Vector3(-3, 1, 85),
		new THREE.Vector3(-5, 1, 88),
		new THREE.Vector3(-10, 1, 88),
		new THREE.Vector3(-15, 1, 88),
		new THREE.Vector3(-20, 1, 90),
		new THREE.Vector3(-25, 1, 88),
		new THREE.Vector3(-30, 1, 85),
		new THREE.Vector3(-30, 1, 80),
		new THREE.Vector3(-30, 1, 75),
		new THREE.Vector3(-30, -1, 70),
		new THREE.Vector3(-30, -4, 63),
		new THREE.Vector3(-30, -7, 56),
		new THREE.Vector3(-30, -10, 49),
		new THREE.Vector3(-30, -13, 42),
		new THREE.Vector3(-30, -16, 35),
		new THREE.Vector3(-30, -19, 28),
		new THREE.Vector3(-30, -22, 21),

		//premier escalier
		new THREE.Vector3(-30, -39, -7),
		new THREE.Vector3(-30, -39, -25),
		new THREE.Vector3(-25, -39, -30),
		new THREE.Vector3(-20, -39, -33),
		new THREE.Vector3(-10, -39, -33),
		new THREE.Vector3(-5, -39, -30),
		new THREE.Vector3(0, -39, -25),
		new THREE.Vector3(0, -39, -5),

		//dexième escalier
		new THREE.Vector3(0, -59, 115),
		new THREE.Vector3(0, -59, 140),
		new THREE.Vector3(0, -59, 180),
		new THREE.Vector3(-5, -59, 180),
		new THREE.Vector3(-10, -59, 180),

		//poèmes 7 et 8
		new THREE.Vector3(-25, -59, 140),
		new THREE.Vector3(-30, -59, 140),
		new THREE.Vector3(-80, -59, 140),

		//poèmes 9 et 10
		new THREE.Vector3(-40, -59, 177),
		new THREE.Vector3(-95, -59, 177),

		new THREE.Vector3(-130, -35, 170),
		new THREE.Vector3(-140, -35, 170),
		new THREE.Vector3(-140, -35, 160),
		new THREE.Vector3(-145, -19, 125),
		new THREE.Vector3(-145, -19, 105),
		new THREE.Vector3(-145, -19, 85),
		new THREE.Vector3(-145, -19, 65),
		new THREE.Vector3(-145, -19, 45),
		new THREE.Vector3(-145, -19, 25),
		new THREE.Vector3(-145, -19, 5),
		new THREE.Vector3(-145, -19, -15),
		new THREE.Vector3(-145, -19, -35),
		new THREE.Vector3(-145, -19, -55),
		new THREE.Vector3(-145, -19, -75),
		new THREE.Vector3(-145, -19, -95),
		new THREE.Vector3(-145, -19, -115),
		new THREE.Vector3(-145, -19, -135),
		new THREE.Vector3(-145, -19, -155),
		new THREE.Vector3(-145, -19, -175),
		new THREE.Vector3(-145, -19, -195),
		new THREE.Vector3(-145, -19, -215),
		new THREE.Vector3(-145, -19, -235),
		new THREE.Vector3(-145, -19, -255),
		new THREE.Vector3(-145, -19, -275),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-140, -19, -300),
		new THREE.Vector3(-135, -19, -305),
		new THREE.Vector3(-130, -19, -305),
		new THREE.Vector3(-125, -19, -305),
		new THREE.Vector3(-120, -19, -307),
		new THREE.Vector3(-115, -19, -310),

		//début escalier en rond
		new THREE.Vector3(-80, -24, -342),
		new THREE.Vector3(-75, -34, -390),
		new THREE.Vector3(-122,-44, -430),
		new THREE.Vector3(-170,-54, -430),
		new THREE.Vector3(-215,-64, -395),
		new THREE.Vector3(-215,-74, -330),
		new THREE.Vector3(-165,-84, -290),
		new THREE.Vector3(-115,-94, -295),
		new THREE.Vector3(-80,-100, -330),
		new THREE.Vector3(-75,-106, -380),
		new THREE.Vector3(-105,-115, -420),
		new THREE.Vector3(-160,-122, -435),
		new THREE.Vector3(-210,-132, -400),
		new THREE.Vector3(-215,-142, -340),
		new THREE.Vector3(-175,-152, -300),
		new THREE.Vector3(-120,-162, -300),
		new THREE.Vector3(-80,-172, -340),
		new THREE.Vector3(-75,-180, -360),

	];
  
	// ligne rouge
	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000});
	const lineGroup = new THREE.Group();
	
	const numLines = 5; // Nombre de lignes parallèles
	const lineSpacing = 0.01; // Espacement entre les lignes
	
	for (let i = 0; i < numLines; i++) {
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(lignPoints);
	
		const line = new THREE.Line(lineGeometry, lineMaterial);
		line.position.set(0, 0.05 + i * lineSpacing, 5); // Ajustez la hauteur et la position selon vos besoins
	
		lineGroup.add(line);
	}
	
	// scene.add(lineGroup);
	
	////// CHEMIN LUMINEUX //////

	const pointLights = [];

	// Parcours des coordonnées de lignes pour créer les points lumineux
	for (const coord of lignPoints) {
		const pointLight = new THREE.PointLight(0xffffff, 50, 80); // Couleur blanche, intensité 1, distance d'atteinte de 10
		pointLight.position.copy(coord);
		pointLight.position.y = pointLight.position.y+15 // Positionnez le point lumineux à la même position que la coordonnée
		scene.add(pointLight);
		pointLights.push(pointLight); // Ajoutez le point lumineux au tableau
	}

	//////////////////////////////
	
	// Récupérez la position de départ de la caméra
	const cameraStartPosition = camera.position.clone();
	
	// Calculez la distance maximale que la caméra peut se déplacer
	const maxDistance = 0.1; // Ajustez cette valeur selon vos besoins
	
	// Créez une courbe à partir des points de la ligne
	const curve = new THREE.CatmullRomCurve3(lignPoints);
	
	// Définissez les points cibles que la caméra va regarder à différents moments
	const lookAtTargets = [
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(0, 2, 88),
		new THREE.Vector3(-5, 2, 88),
		new THREE.Vector3(-10, 2, 88),
		new THREE.Vector3(-10, 2, 88),
		new THREE.Vector3(-15, 2, 88),
		new THREE.Vector3(-15, 2, 88),
		new THREE.Vector3(-20, 2, 90),
		new THREE.Vector3(-20, 2, 90),
		new THREE.Vector3(-25, 2, 88),
		new THREE.Vector3(-25, 2, 88),
		new THREE.Vector3(-30, 2, 85),
		new THREE.Vector3(-30, 2, 85),
		new THREE.Vector3(-30, 2, 80),
		new THREE.Vector3(-30, 2, 80),
		new THREE.Vector3(-30, 2, 75),
		new THREE.Vector3(-30, 2, 75),
		new THREE.Vector3(-30, 2, 75),
		new THREE.Vector3(-30, 2, 75),

		//first stair
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),
		new THREE.Vector3(-30, -39, -150),

		// petit décalage dans l'escalier
		new THREE.Vector3(-30, -45, -50),
		new THREE.Vector3(-30, -45, -50),
		new THREE.Vector3(-30, -45, -50),
		new THREE.Vector3(-30, -45, -50),

		//1er décalage mid
		new THREE.Vector3(-10, -20, -100),
		new THREE.Vector3(-10, -20, -100),
		new THREE.Vector3(-10, -20, -100),
		new THREE.Vector3(-10, -20, -100),
		new THREE.Vector3(-10, -20, -100),
		new THREE.Vector3(-10, -20, -100),

		//poème 1
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),
		new THREE.Vector3(100, -0, -20),

		//vue couloir
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),

		//poème 2
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),
		new THREE.Vector3(-100, 5, 30),

		//vue couloir
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		new THREE.Vector3(-30, -59, 175),
		

		//poème 3
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),
		new THREE.Vector3(100, -15, 70),

		//vue couloir
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),
		new THREE.Vector3(0, -59, 175),

		//poème4
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),
		new THREE.Vector3(100, -15, 135),

		//poème 5
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),	
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),
		new THREE.Vector3(100, -20, 180),

		//poème6
		new THREE.Vector3(-5, -30, 250),
		new THREE.Vector3(-5, -30, 250),
		new THREE.Vector3(-5, -30, 250),
		new THREE.Vector3(-5, -30, 250),

		//décalage poème7
		new THREE.Vector3(-150, -59, 175),
		new THREE.Vector3(-150, -59, 175),
		new THREE.Vector3(-150, -59, 175),
		new THREE.Vector3(-150, -59, 175),
		new THREE.Vector3(-150, -59, 175),

		//poème 7
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),

		//poème 8
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),
		new THREE.Vector3(-80, -10, 0),

		//Décalage poème 9
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),
		new THREE.Vector3(-40, -10, 0),

		new THREE.Vector3(150, -39, 145),
		new THREE.Vector3(150, -39, 145),
		new THREE.Vector3(150, -39, 145),
		new THREE.Vector3(150, -39, 145),

		//poème 9
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		new THREE.Vector3(-45, -47, 200),
		
		//poème 10

		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),
		new THREE.Vector3(-83, -47, 200),

		//top escalier 3
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),
		new THREE.Vector3(-150, -39, 180),

		//décalge mid escaleir 3
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),
		new THREE.Vector3(-250, -39, 100),

		//top escalier
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),
		new THREE.Vector3(-150, -39, 0),


		//poème 11
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),
		new THREE.Vector3(-120, -8, 80),

		//vue couloir
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 12
		new THREE.Vector3(-175, -9, 50),
		new THREE.Vector3(-175, -9, 50),
		new THREE.Vector3(-175, -9, 50),
		new THREE.Vector3(-175, -9, 50),
		new THREE.Vector3(-175, -9, 50),
		new THREE.Vector3(-175, -9, 50),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 13
		new THREE.Vector3(-115, -5, 20),
		new THREE.Vector3(-115, -5, 20),
		new THREE.Vector3(-115, -5, 20),
		new THREE.Vector3(-115, -5, 20),
		new THREE.Vector3(-115, -5, 20),
		new THREE.Vector3(-115, -5, 20),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 14
		new THREE.Vector3(-175, -5, -10),
		new THREE.Vector3(-175, -5, -10),
		new THREE.Vector3(-175, -5, -10),
		new THREE.Vector3(-175, -5, -10),
		new THREE.Vector3(-175, -5, -10),
		new THREE.Vector3(-175, -5, -10),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 15
		new THREE.Vector3(-115, -3, -40),
		new THREE.Vector3(-115, -3, -40),
		new THREE.Vector3(-115, -3, -40),
		new THREE.Vector3(-115, -3, -40),
		new THREE.Vector3(-115, -3, -40),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 16
		new THREE.Vector3(-175,-5, -70),
		new THREE.Vector3(-175,-5, -70),
		new THREE.Vector3(-175,-5, -70),
		new THREE.Vector3(-175,-5, -70),
		new THREE.Vector3(-175,-5, -70),
		new THREE.Vector3(-175,-5, -70),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 17
		new THREE.Vector3(-115, -1, -100),
		new THREE.Vector3(-115, -1, -100),
		new THREE.Vector3(-115, -1, -100),
		new THREE.Vector3(-115, -1, -100),
		new THREE.Vector3(-115, -1, -100),
		new THREE.Vector3(-115, -1, -100),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		//poème 18
		new THREE.Vector3(-173, -7, -132),
		new THREE.Vector3(-173, -7, -132),
		new THREE.Vector3(-173, -7, -132),
		new THREE.Vector3(-173, -7, -132),
		new THREE.Vector3(-173, -7, -132),
		new THREE.Vector3(-173, -7, -132),

		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),
		new THREE.Vector3(-145, -19, -290),

		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		
		new THREE.Vector3(-152, -87,-376),		

		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		new THREE.Vector3(-47, -168, -363),
		
		
	];
	
	/////////////   TEXT  //////////////
	// Charger la police une fois
	const loaderJS = new FontLoader();
	let fontLoaded = false;
	loaderJS.load('../three.js/examples/fonts/gentilis_regular.typeface.json', font => {
		fontLoaded = true;

		// Ajouter chaque texte à la scène en utilisant les données du fichier
		textData.forEach(data => {
			generateText(scene, font, data);
		});

		render();
	});

	// Fonction pour générer et ajouter un texte à la scène
	const generateText = (scene, font, data) => {
		const fillMaterial = new THREE.MeshBasicMaterial({
			color: data.color,
			transparent: true,
			opacity: 1,
			side: THREE.DoubleSide
		});

		const shapes = font.generateShapes(data.message, data.fontsize);
		const geometry = new THREE.ShapeGeometry(shapes);
		geometry.computeBoundingBox();
		geometry.translate(data.position.x, data.position.y, data.position.z);

		const text = new THREE.Mesh(geometry, fillMaterial);
		text.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);

		scene.add(text)
	};

	// Écouteur d'événement pour le défilement de la fenêtre
	window.addEventListener('scroll', () => {
		const scrollPosition = window.scrollY;
		const distance = (scrollPosition / window.innerHeight) * maxDistance / 6;
		const startIndex = Math.floor(distance * (lookAtTargets.length - 1));
		const endIndex = startIndex + 1;
		const fraction = (distance - startIndex / (lookAtTargets.length - 1)) * (lookAtTargets.length - 1);
		const interpolatedTarget = new THREE.Vector3().lerpVectors(lookAtTargets[startIndex], lookAtTargets[endIndex], fraction);
		const newCameraPosition = cameraStartPosition.clone().add(curve.getPointAt(distance));
		camera.position.copy(newCameraPosition);
		const cameraDirection = new THREE.Vector3().subVectors(interpolatedTarget, newCameraPosition).normalize();
		const newCameraLookAt = new THREE.Vector3().addVectors(newCameraPosition, cameraDirection);
		camera.lookAt(newCameraLookAt);

		render();
	});

	const image1 = textureLoader.load('./src/img/poems/p1_t.png');
	const image2 = textureLoader.load('./src/img/poems/p2.png');
	const image3 = textureLoader.load('./src/img/poems/p3.png');
	const image4 = textureLoader.load('./src/img/poems/p4.png');
	const image5 = textureLoader.load('./src/img/poems/p5.png');
	const image6 = textureLoader.load('./src/img/poems/p6.png');
	const image7 = textureLoader.load('./src/img/poems/p7.png');
	const image8 = textureLoader.load('./src/img/poems/p8.png');
	const image9 = textureLoader.load('./src/img/poems/p9.png');
	const image10 = textureLoader.load('./src/img/poems/p10.png');

	const image11 = textureLoader.load('./src/img/poems/p11.png');
	const image12 = textureLoader.load('./src/img/poems/p12.png');
	const image13 = textureLoader.load('./src/img/poems/p13.png');
	const image14 = textureLoader.load('./src/img/poems/p14.png');
	const image15 = textureLoader.load('./src/img/poems/p15.png');
	const image16 = textureLoader.load('./src/img/poems/p16.png');
	const image17 = textureLoader.load('./src/img/poems/p17.png');
	const image18 = textureLoader.load('./src/img/poems/p18.png');

	// poème 1
	const planeGeometry = new THREE.PlaneGeometry(40, 40); // Remplacez la taille du plan par celle de votre choix
	const p1Mat = new THREE.MeshBasicMaterial({ map: image1,transparent: true,alphaTest: -200, });
	const p1 = new THREE.Mesh(planeGeometry, p1Mat);
	p1.position.set(19.9, -24, -20);
	p1.rotation.set(0,-Math.PI/2,0)

	//poème 2
	const p2Mat = new THREE.MeshBasicMaterial({ map: image2,transparent: true,alphaTest: -200, });
	const p2 = new THREE.Mesh(planeGeometry, p2Mat);
	p2.position.set(-19.9, -27, 30);
	p2.rotation.set(0,Math.PI/2,0)

	//poème 3
	const p3Mat = new THREE.MeshBasicMaterial({ map: image3,transparent: true,alphaTest: -200, });
	const p3 = new THREE.Mesh(planeGeometry, p3Mat);
	p3.position.set(19.9, -34, 70);
	p3.rotation.set(0,-Math.PI/2,0)
	
	//poème 4
	const p4Mat = new THREE.MeshBasicMaterial({ map: image4,transparent: true,alphaTest: -200, });
	const p4 = new THREE.Mesh(planeGeometry, p4Mat);
	p4.position.set(19.9, -40, 135);
	p4.rotation.set(0,-Math.PI/2,0)

	//poème 5
	const p5Mat = new THREE.MeshBasicMaterial({ map: image5,transparent: true,alphaTest: -200, });
	const p5 = new THREE.Mesh(planeGeometry, p5Mat);
	p5.position.set(19.9, -43, 180);
	p5.rotation.set(0,-Math.PI/2,0)

	//poème 6
	const p6Mat = new THREE.MeshBasicMaterial({ map: image6,transparent: true,alphaTest: -200, });
	const p6 = new THREE.Mesh(planeGeometry, p6Mat);
	p6.position.set(-5, -43, 199.9);
	p6.rotation.set(0,Math.PI,0)
	
	//poème 7
	const p7Mat = new THREE.MeshBasicMaterial({ map: image7,transparent: true,alphaTest: -200, });
	const p7 = new THREE.Mesh(planeGeometry, p7Mat);
	p7.position.set(-40, -43, 120.01);
	p7.rotation.set(0,Math.PI*2,0)

	//poème 8
	const p8Mat = new THREE.MeshBasicMaterial({ map: image8,transparent: true,alphaTest: -200, });
	const p8 = new THREE.Mesh(planeGeometry, p8Mat);
	p8.position.set(-80, -43, 120.01);
	p8.rotation.set(0,Math.PI*2,0)

	//poème 9
	const p9Mat = new THREE.MeshBasicMaterial({ map: image9,transparent: true,alphaTest: -200, });
	const p9 = new THREE.Mesh(planeGeometry, p9Mat);
	p9.position.set(-45, -43, 199.9);
	p9.rotation.set(0,Math.PI,0)

	//poème 10
	const p10Mat = new THREE.MeshBasicMaterial({ map: image10,transparent: true,alphaTest: -200, });
	const p10 = new THREE.Mesh(planeGeometry, p10Mat);
	p10.position.set(-83, -43, 199.9);
	p10.rotation.set(0,Math.PI,0)

	//poème 11
	const p11Mat = new THREE.MeshBasicMaterial({ map: image11,transparent: true,alphaTest: -200, });
	const p11 = new THREE.Mesh(planeGeometry, p11Mat);
	p11.position.set(-120, -8, 80);
	p11.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)

	//poème 12
	const p12Mat = new THREE.MeshBasicMaterial({ map: image12,transparent: true,alphaTest: -200, });
	const p12 = new THREE.Mesh(planeGeometry, p12Mat);
	p12.position.set(-175, -9, 50);
	p12.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)

	//poème 13
	const p13Mat = new THREE.MeshBasicMaterial({ map: image13,transparent: true,alphaTest: -200, });
	const p13 = new THREE.Mesh(planeGeometry, p13Mat);
	p13.position.set(-115, 0, 20);
	p13.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)

	//poème 14
	const p14Mat = new THREE.MeshBasicMaterial({ map: image14,transparent: true,alphaTest: -200, });
	const p14 = new THREE.Mesh(planeGeometry, p14Mat);
	p14.position.set(-175, 0, -10);
	p14.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)

	//poème 15
	const p15Mat = new THREE.MeshBasicMaterial({ map: image15,transparent: true,alphaTest: -200, });
	const p15 = new THREE.Mesh(planeGeometry, p15Mat);
	p15.position.set(-115, -3, -40);
	p15.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)

	//poème 16
	const p16Mat = new THREE.MeshBasicMaterial({ map: image16,transparent: true,alphaTest: -200, });
	const p16 = new THREE.Mesh(planeGeometry, p16Mat);
	p16.position.set(-172,0, -70);
	p16.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)

	//poème 17
	const p17Mat = new THREE.MeshBasicMaterial({ map: image17,transparent: true,alphaTest: -200, });
	const p17 = new THREE.Mesh(planeGeometry, p17Mat);
	p17.position.set(-115, -1, -100);
	p17.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)

	//poème 18
	const p18Mat = new THREE.MeshBasicMaterial({ map: image18,transparent: true,alphaTest: -200, });
	const p18 = new THREE.Mesh(planeGeometry, p18Mat);
	p18.position.set(-173, -7, -132);
	p18.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)

	scene.add(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18);
	////////////////////////////////////////

	//// MURS ////
	//adad
	const wallMaterial = new THREE.MeshStandardMaterial({color:0x1b1b1b, side:THREE.DoubleSide})

	//spawn
	const backSpawnGeometry = new THREE.PlaneGeometry(40,40)
	const backSpawn = new THREE.Mesh(backSpawnGeometry,wallMaterial)
	backSpawn.position.set(0,20,-80)

	const rightSpawnGeometry = new THREE.PlaneGeometry(160,40)
	const rightSpawn = new THREE.Mesh(rightSpawnGeometry,wallMaterial)
	rightSpawn.position.set(-20,20,0)
	rightSpawn.rotation.set(0,Math.PI/2,0)

	const leftSpawnGeometry = new THREE.PlaneGeometry(180,40)
	const leftSpawn = new THREE.Mesh(leftSpawnGeometry,wallMaterial)
	leftSpawn.position.set(20,20,10)
	leftSpawn.rotation.set(0,Math.PI/2,0)

	const forwardSpawnGeometry = new THREE.PlaneGeometry(60,40)
	const forwardSpawn = new THREE.Mesh(forwardSpawnGeometry,wallMaterial)
	forwardSpawn.position.set(-10,20,100)
	forwardSpawn.rotation.set(0,Math.PI,0)

	const forwardRightSpawnGeometry = new THREE.PlaneGeometry(20,40)
	const forwardRightSpawn = new THREE.Mesh(forwardRightSpawnGeometry,wallMaterial)
	forwardRightSpawn.position.set(-40,20,90)
	forwardRightSpawn.rotation.set(0,Math.PI/2,0)

	scene.add(backSpawn, rightSpawn, leftSpawn, forwardSpawn, forwardRightSpawn)

	//stairs one
	const stairsOneRightGeometry = new THREE.PlaneGeometry(120,60)
	const stairsOneRight = new THREE.Mesh(stairsOneRightGeometry,wallMaterial)
	stairsOneRight.position.set(-20,-30,60)
	stairsOneRight.rotation.set(0,Math.PI/2,0)

	const stairsOneLeftGeometry = new THREE.PlaneGeometry(80,80)
	const stairsOneLeft = new THREE.Mesh(stairsOneLeftGeometry,wallMaterial)
	stairsOneLeft.position.set(-40,0,40)
	stairsOneLeft.rotation.set(0,Math.PI/2,0)

	scene.add(stairsOneRight, stairsOneLeft)

	//chapitre 1
	//mid
	const midLeftGeometry = new THREE.PlaneGeometry(40,40)
	const midLeft = new THREE.Mesh(midLeftGeometry,wallMaterial)
	midLeft.position.set(-40,-20,-20)
	midLeft.rotation.set(0,Math.PI/2,0)

	const midForwardGeometry = new THREE.PlaneGeometry(60,40)
	const midForward = new THREE.Mesh(midForwardGeometry,wallMaterial)
	midForward.position.set(-10,-20,-40)
	midForward.rotation.set(0,0,0)

	const midRightGeometry = new THREE.PlaneGeometry(40,40)
	const midRight = new THREE.Mesh(midRightGeometry,wallMaterial)
	midRight.position.set(20,-20,-20)
	midRight.rotation.set(0,Math.PI/2,0)
	scene.add(midLeft, midForward, midRight)

	//stairs two
	const stairsTwoRightGeometry = new THREE.PlaneGeometry(120,60)
	const stairsTwoRight = new THREE.Mesh(stairsTwoRightGeometry,wallMaterial)
	stairsTwoRight.position.set(20,-30,60)
	stairsTwoRight.rotation.set(0,Math.PI/2,0)

	scene.add(stairsTwoRight)

	//room 1
	const roomOneLeftGeometry = new THREE.PlaneGeometry(80,80)
	const roomOneLeft = new THREE.Mesh(roomOneLeftGeometry,wallMaterial)
	roomOneLeft.position.set(20,-20,160)
	roomOneLeft.rotation.set(0,Math.PI/2,0)

	const roomOneForwardGeometry = new THREE.PlaneGeometry(120,80)
	const roomOneForward = new THREE.Mesh(roomOneForwardGeometry,wallMaterial)
	roomOneForward.position.set(-40,-20,200)
	roomOneForward.rotation.set(0,0,0)

	const roomOneRightGeometry = new THREE.PlaneGeometry(80,80)
	const roomOneRight = new THREE.Mesh(roomOneRightGeometry,wallMaterial)
	roomOneRight.position.set(-60,-20,120)
	roomOneRight.rotation.set(0,0,0)

	const roomOneExitGeometry = new THREE.PlaneGeometry(40,80)
	const roomOneExit = new THREE.Mesh(roomOneExitGeometry,wallMaterial)
	roomOneExit.position.set(-100,-20,140)
	roomOneExit.rotation.set(0,Math.PI/2,0)

	const roomOneEntryGeometry = new THREE.PlaneGeometry(40,40)
	const roomOneEntry = new THREE.Mesh(roomOneEntryGeometry,wallMaterial)
	roomOneEntry.position.set(0,0,120)
	roomOneEntry.rotation.set(0,0,0)

	scene.add(roomOneLeft, roomOneForward, roomOneRight, roomOneExit, roomOneEntry)

	//stairs three
	const stairsThreeForwardGeometry = new THREE.PlaneGeometry(80, 80);
	const stairsThreeForward = new THREE.Mesh(stairsThreeForwardGeometry, marbleMaterial);
	stairsThreeForward.position.set(-160, -20, 160);
	stairsThreeForward.rotation.set(0,Math.PI/2,0)

	const stairsThreeLeftGeometry = new THREE.PlaneGeometry(60, 80);
	const stairsThreeLeft = new THREE.Mesh(stairsThreeLeftGeometry, marbleMaterial);
	stairsThreeLeft.position.set(-130, -20, 200);
	stairsThreeLeft.rotation.set(0,0,0)

	scene.add(stairsThreeForward, stairsThreeLeft);

	//room two
	const roomTwoEntryRightGeometry = new THREE.PlaneGeometry(56, 40);
	const roomTwoEntryRight = new THREE.Mesh(roomTwoEntryRightGeometry,wallMaterial);
	roomTwoEntryRight.rotation.set(0,THREE.MathUtils.degToRad(-63.5),Math.PI);
	roomTwoEntryRight.position.set(-172.5,0,95);

	const roomTwoEntryLeftGeometry = new THREE.PlaneGeometry(56, 40);
	const roomTwoEntryLeft = new THREE.Mesh(roomTwoEntryLeftGeometry,wallMaterial);
	roomTwoEntryLeft.rotation.set(0,THREE.MathUtils.degToRad(63.5),Math.PI);
	roomTwoEntryLeft.position.set(-117.5,0,95);

	const roomTwoRightGeometry = new THREE.PlaneGeometry(200,40)
	const roomTwoRight = new THREE.Mesh(roomTwoRightGeometry,wallMaterial)
	roomTwoRight.position.set(-105,0,-30)
	roomTwoRight.rotation.set(0,Math.PI/2,0)

	const roomTwoLeftGeometry = new THREE.PlaneGeometry(200,40)
	const roomTwoLeft = new THREE.Mesh(roomTwoLeftGeometry,wallMaterial)
	roomTwoLeft.position.set(-185,0,-30)
	roomTwoLeft.rotation.set(0,Math.PI/2,0)

	const roomTwoExitLeftGeometry = new THREE.PlaneGeometry(56, 40);
	const roomTwoExitLeft = new THREE.Mesh(roomTwoExitLeftGeometry,wallMaterial);
	roomTwoExitLeft.rotation.set(Math.PI,THREE.MathUtils.degToRad(-63.5),Math.PI);
	roomTwoExitLeft.position.set(-172.5,0,-155);
	
	const roomTwoExitRightGeometry = new THREE.PlaneGeometry(56, 40);
	const roomTwoExitRight = new THREE.Mesh(roomTwoExitRightGeometry,wallMaterial);
	roomTwoExitRight.rotation.set(Math.PI,THREE.MathUtils.degToRad(63.5),Math.PI);
	roomTwoExitRight.position.set(-117.5,0,-155);

	const roomTwoForwardRightGeometry = new THREE.PlaneGeometry(100,40)
	const roomTwoForwardRight = new THREE.Mesh(roomTwoForwardRightGeometry,wallMaterial)
	roomTwoForwardRight.position.set(-130,0,-230)
	roomTwoForwardRight.rotation.set(0,Math.PI/2,0)

	const roomTwoLeftForwardGeometry = new THREE.PlaneGeometry(100,40)
	const roomTwoLeftForward = new THREE.Mesh(roomTwoLeftForwardGeometry,wallMaterial)
	roomTwoLeftForward.position.set(-160,0,-230)
	roomTwoLeftForward.rotation.set(0,Math.PI/2,0)

	scene.add(roomTwoEntryRight, roomTwoEntryLeft, roomTwoRight, roomTwoLeft, roomTwoExitLeft, roomTwoExitRight, roomTwoForwardRight, roomTwoLeftForward);

	//// PLAFOND 
	//spawn
	const spawnCeilingGeometry = new THREE.PlaneGeometry(180,40)
	const spawnCeiling = new THREE.Mesh(spawnCeilingGeometry,wallMaterial)
	spawnCeiling.position.set(0,40,10)
	spawnCeiling.rotation.set(-Math.PI/2,0,Math.PI/2);

	const spawnCeilingRightGeometry = new THREE.PlaneGeometry(20,20)
	const spawnCeilingRight = new THREE.Mesh(spawnCeilingRightGeometry,wallMaterial)
	spawnCeilingRight.position.set(-30,40,90)
	spawnCeilingRight.rotation.set(-Math.PI/2,0,Math.PI/2);

	scene.add(spawnCeiling, spawnCeilingRight)

	//stairs 1
	const stairsOneCeilingGeometry = new THREE.PlaneGeometry(89.44, 20);
	const stairsOneCeiling = new THREE.Mesh(stairsOneCeilingGeometry,wallMaterial);
	stairsOneCeiling.rotation.set(THREE.MathUtils.degToRad(63.43),0,Math.PI/2);
	stairsOneCeiling.position.set(-30,20,40);

	scene.add(stairsOneCeiling)

	//mid
	const midCeilingGeometry = new THREE.PlaneGeometry(40,20)
	const midCeiling = new THREE.Mesh(midCeilingGeometry,wallMaterial)
	midCeiling.position.set(-30,0,-20)
	midCeiling.rotation.set(-Math.PI/2,0,Math.PI/2);

	scene.add(midCeiling)

	//stairs 2
	const stairsTwoCeilingGeometry = new THREE.PlaneGeometry(121.66, 40);
	const stairsTwoCeiling = new THREE.Mesh(stairsTwoCeilingGeometry,wallMaterial);
	stairsTwoCeiling.rotation.set(THREE.MathUtils.degToRad(-80.54),0,Math.PI/2);
	stairsTwoCeiling.position.set(0,-10,60);

	scene.add(stairsTwoCeiling)

	//room 2 
	const roomTwoCeilingGeometry = new THREE.PlaneGeometry(120,80)
	const roomTwoCeiling = new THREE.Mesh(roomTwoCeilingGeometry,wallMaterial)
	roomTwoCeiling.position.set(-40,20,160)
	roomTwoCeiling.rotation.set(-Math.PI/2,0,0);

	scene.add(roomTwoCeiling)

	//stairs 3
	const stairsThreeCeilingGeometry = new THREE.PlaneGeometry(60, 80);
	const stairsThreeCeiling = new THREE.Mesh(stairsThreeCeilingGeometry, marbleMaterial);
	stairsThreeCeiling.position.set(-130, 20, 160);
	stairsThreeCeiling.rotation.set(-Math.PI/2,0,0);

	scene.add(stairsThreeCeiling)

	//room 3
	const roomThreeCeilingGeometry = new THREE.PlaneGeometry(400,80)
	const roomThreeCeiling = new THREE.Mesh(roomThreeCeilingGeometry,wallMaterial)
	roomThreeCeiling.position.set(-145,20,-75)
	roomThreeCeiling.rotation.set(-Math.PI/2,0,Math.PI/2);

	scene.add(roomThreeCeiling)
	//////////////
	////// LIGHTS ROOM 2 ////////
	const height = 0.1;
	const intensity = 40;
	const sourceBigGeometry = new THREE.BoxGeometry(200,height,0.1);
	const sourceLittleGeometry = new THREE.BoxGeometry(100,height,0.1);
	const sourceDiagoGeometry = new THREE.BoxGeometry(54,height,0.1);
	const color = 0x219de1;
	const sourceMaterial = new THREE.MeshBasicMaterial({color:color})


	//BIG
	// BOTTOM
	// bigRight
	const sourceBigRight = new THREE.Mesh(sourceBigGeometry,sourceMaterial)
	const br = new THREE.RectAreaLight( color, intensity, 200, height );
	br.position.set( -104, -18, -30 );
	scene.add(br);
	sourceBigRight.rotation.set(0,Math.PI/2,0)
	sourceBigRight.position.copy(br.position)
	br.rotation.copy(sourceBigRight.rotation)
	//bigLeft
	const sourceBigLeft = new THREE.Mesh(sourceBigGeometry,sourceMaterial)
	const bl = new THREE.RectAreaLight( color, intensity, 200, height );
	bl.position.set( -186, -18, -30 );
	scene.add(bl);
	sourceBigLeft.rotation.set(0,-Math.PI/2,0)
	sourceBigLeft.position.copy(bl.position)
	bl.rotation.copy(sourceBigLeft.rotation)

	//TOP
	// bigTopRight
	const sourceBigTopRight = new THREE.Mesh(sourceBigGeometry,sourceMaterial)
	const brt = new THREE.RectAreaLight( color, 100, 200, 0.2 );
	brt.position.set( -104.5, 18, -30 );
	scene.add(brt);
	sourceBigTopRight.rotation.set(Math.PI,Math.PI/2,Math.PI)
	sourceBigTopRight.position.copy(brt.position)
	brt.rotation.copy(sourceBigTopRight.rotation)
	//bigTopLeft
	const sourceBigTopLeft = new THREE.Mesh(sourceBigGeometry,sourceMaterial)
	const blt = new THREE.RectAreaLight( color, 100, 200, 0.2 );
	blt.position.set( -186.5, 18, -30 );
	scene.add(blt);
	sourceBigTopLeft.rotation.set(Math.PI,-Math.PI/2,Math.PI)
	sourceBigTopLeft.position.copy(blt.position)
	blt.rotation.copy(sourceBigTopLeft.rotation)

	scene.add(sourceBigRight, sourceBigLeft, sourceBigTopLeft, sourceBigTopRight)

	//LITTLE
	// BOTTOM
	// littleRight
	const sourceLittleRight = new THREE.Mesh(sourceLittleGeometry,sourceMaterial)
	const lr = new THREE.RectAreaLight( color, intensity, 100, height );
	lr.position.set( -129, -18, -230 );
	scene.add(lr);
	sourceLittleRight.rotation.set(0,Math.PI/2,0)
	sourceLittleRight.position.copy(lr.position)
	lr.rotation.copy(sourceLittleRight.rotation)
	//bigLeft
	const sourceLittleLeft = new THREE.Mesh(sourceLittleGeometry,sourceMaterial)
	const ll = new THREE.RectAreaLight( color, intensity, 100, height );
	ll.position.set( -161, -18, -230 );
	scene.add(ll);
	sourceLittleLeft.rotation.set(0,-Math.PI/2,0)
	sourceLittleLeft.position.copy(ll.position)
	ll.rotation.copy(sourceLittleLeft.rotation)

	//TOP
	// bigTopRight
	const sourceLittleTopRight = new THREE.Mesh(sourceLittleGeometry,sourceMaterial)
	const lrt = new THREE.RectAreaLight( color, 100, 100, 0.2 );
	lrt.position.set( -129, 18, -230 );
	scene.add(lrt);
	sourceLittleTopRight.rotation.set(Math.PI,Math.PI/2,Math.PI)
	sourceLittleTopRight.position.copy(lrt.position)
	lrt.rotation.copy(sourceBigTopRight.rotation)
	//bigTopLeft
	const sourceLittleTopLeft = new THREE.Mesh(sourceLittleGeometry,sourceMaterial)
	const llt = new THREE.RectAreaLight( color, 100, 100, 0.2 );
	llt.position.set( -161, 18, -230 );
	scene.add(llt);
	sourceLittleTopLeft.rotation.set(Math.PI,-Math.PI/2,Math.PI)
	sourceLittleTopLeft.position.copy(llt.position)
	llt.rotation.copy(sourceLittleTopLeft.rotation)

	scene.add(sourceLittleRight, sourceLittleLeft, sourceLittleTopRight, sourceLittleTopLeft)

	//DIAGO ENTREE //
	// Right

	const sourceDiagoEntryRight = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const der = new THREE.RectAreaLight( color, intensity, 55, height );
	der.position.set( -117,-18,96 );
	scene.add(der);
	sourceDiagoEntryRight.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)
	sourceDiagoEntryRight.position.copy(der.position)
	der.rotation.copy(sourceDiagoEntryRight.rotation)
	//Left
	const sourceDiagoEntryLeft = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const del = new THREE.RectAreaLight( color, intensity, 55, height );
	del.position.set( -173,-18,96);
	scene.add(del);
	sourceDiagoEntryLeft.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)
	sourceDiagoEntryLeft.position.copy(del.position)
	del.rotation.copy(sourceDiagoEntryLeft.rotation)

	//top right
	const sourceDiagoTopEntryRight = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dter = new THREE.RectAreaLight( color, 100, 55, height );
	dter.position.set( -117,18,96 );
	scene.add(dter);
	sourceDiagoTopEntryRight.rotation.set(0,THREE.MathUtils.degToRad(63.5),0)
	sourceDiagoTopEntryRight.position.copy(dter.position)
	dter.rotation.copy(sourceDiagoTopEntryRight.rotation)
	//top Left
	const sourceDiagoTopEntryLeft = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dtel = new THREE.RectAreaLight( color, 100, 55, height );
	dtel.position.set( -173,18,96);
	scene.add(dtel);
	sourceDiagoTopEntryLeft.rotation.set(0,THREE.MathUtils.degToRad(-63.5),0)
	sourceDiagoTopEntryLeft.position.copy(dtel.position)
	dtel.rotation.copy(sourceDiagoTopEntryLeft.rotation)

	scene.add(sourceDiagoEntryRight, sourceDiagoEntryLeft, sourceDiagoTopEntryRight, sourceDiagoTopEntryLeft)


	//DIAGO Sortie //
	const sourceDiagoExitRight = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dxr = new THREE.RectAreaLight( color, intensity, 55, height );
	dxr.position.set(-117,-18,-155);
	scene.add(dxr);
	sourceDiagoExitRight.rotation.set(0,THREE.MathUtils.degToRad(116.5),0)
	sourceDiagoExitRight.position.copy(dxr.position)
	dxr.rotation.copy(sourceDiagoExitRight.rotation)
	//Left
	const sourceDiagoExitLeft = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dxl = new THREE.RectAreaLight( color, intensity, 55, height );
	dxl.position.set(-173,-18,-155);
	scene.add(dxl);
	sourceDiagoExitLeft.rotation.set(0,THREE.MathUtils.degToRad(-116.5),0)
	sourceDiagoExitLeft.position.copy(dxl.position)
	dxl.rotation.copy(sourceDiagoExitLeft.rotation)

	//top right
	const sourceDiagoTopExitRight = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dtxr = new THREE.RectAreaLight( color, 100, 55, height );
	dtxr.position.set(-117,18,-155);
	scene.add(dtxr);
	sourceDiagoTopExitRight.rotation.set(0,THREE.MathUtils.degToRad(116.5),0)
	sourceDiagoTopExitRight.position.copy(dtxr.position)
	dtxr.rotation.copy(sourceDiagoTopExitRight.rotation)
	//top Left
	const sourceDiagoTopExitLeft = new THREE.Mesh(sourceDiagoGeometry,sourceMaterial)
	const dtxl = new THREE.RectAreaLight( color, 100, 55, height );
	dtxl.position.set(-173,18,-155);
	scene.add(dtxl);
	sourceDiagoTopExitLeft.rotation.set(0,THREE.MathUtils.degToRad(-116.5),0)
	sourceDiagoTopExitLeft.position.copy(dtxl.position)
	dtxl.rotation.copy(sourceDiagoTopExitLeft.rotation)

	scene.add(sourceDiagoExitRight, sourceDiagoExitLeft, sourceDiagoTopExitRight, sourceDiagoTopExitLeft)

	
}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	
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
	stats.update();
}