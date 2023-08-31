import * as THREE from "../three.js/build/three.module.js";
import { Water } from '../three.js/examples/jsm/objects/Water.js';
import { GUI } from '../three.js/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import Stats from '../three.js/examples/jsm/libs/stats.module.js';

import {Font} from '../three.js/examples/jsm/loaders/FontLoader.js';
import {FontLoader} from '../three.js/examples/jsm/loaders/FontLoader.js';
import {TTFLoader} from '../three.js/examples/jsm/loaders/TTFLoader.js'
import {SVGLoader} from '../three.js/examples/jsm/loaders/SVGLoader.js';
import {TextGeometry} from '../three.js/examples/jsm/geometries/TextGeometry.js'
import {Reflector} from '../three.js/examples/jsm/objects/Reflector.js'

import { TransformControls } from '../three.js/examples/jsm/controls/TransformControls.js';
import { Flow } from '../three.js/examples/jsm/modifiers/CurveModifier.js';

let container
let stats;
let water
let controls
let camera, scene, renderer
let shape, shape2, shape3
let geometryFloor
let floor, floor2, floor3, floor4, floor5
let group, textMesh1, textMesh2, textGeo, material;

let sphereGroup, smallSphere
let groundMirror, verticalMirror

let text = 'v i s i t e';
const height = 1,
	sizeText = 5,
	hover = 0.5,
	curveSegments = 20,
	bevelThickness = 1,
	bevelSize = 0.6;

let font = null;
const mirror = true;

const ACTION_SELECT = 1, ACTION_NONE = 0;
const curveHandles = [];
const mouse = new THREE.Vector2();
let rayCaster,
	control,
	flow,
	action = ACTION_NONE;

let orbitControlsEnabled = true;

//console.info(THREE.REVISION);

init();
animate();


function init(){
	container = document.getElementById( 'container' );

	// SCENE
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x6f6f6f);

	// CAMERA
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0,3,10);
	camera.lookAt(0,0,0)

	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias : false });
	container.appendChild(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;


	// shape 1
	shape = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color: 0xff0000})
	);
	shape.castShadow = true;
	shape.receiveShadow = false;
	shape.position.set(0,1,0);
	scene.add(shape);

	// shape 2
	shape2 = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color: 0xff0000})
	);
	shape2.position.set(0,1,15);
	scene.add(shape2);

	// shape three
	shape3 = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color: 0xff0000})
	);
	shape3.position.set(-15,1,0);
	shape3.castShadow = true;
	shape3.receiveShadow = false;
	scene.add(shape3);

	///   floor   ///
	geometryFloor = new THREE.PlaneGeometry(10, 10);
	let FloorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide})
	floor = new THREE.Mesh(geometryFloor, FloorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = 0;
	floor.receiveShadow = true;
	scene.add(floor);

	///   floor 2   ///
	floor2 = new THREE.Mesh(geometryFloor, FloorMaterial);
	floor2.rotation.x = -Math.PI / 2;
	floor2.position.set(0, 0, 15);
	scene.add(floor2);

	///   floor 3   ///
	floor3 = new THREE.Mesh(geometryFloor, FloorMaterial);
	floor3.rotation.x = -Math.PI / 2;
	floor3.position.set(-15, 0, 0);
	floor3.receiveShadow = true;
	scene.add(floor3);

	///   floor 4   ///
	let Floor4Material = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, roughness:0.1, metalness:0.1})
	floor4 = new THREE.Mesh(geometryFloor, Floor4Material);
	floor4.rotation.x = -Math.PI / 2;
	floor4.position.set(-15, 0, 15);
	floor4.receiveShadow = true;
	scene.add(floor4);

	///   floor 5   ///
	let Floor5Material = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, roughness:0.1, metalness:0.1})
	floor5 = new THREE.Mesh(geometryFloor, Floor5Material);
	floor5.rotation.x = -Math.PI / 2;
	floor5.position.set(15, 0, 15);
	floor5.receiveShadow = true;
	scene.add(floor5);


	///   ambient light   ///
	let al = new THREE.AmbientLight(0xffffff,0.1)
	scene.add(al)


	///    Spot light   ///
	const spotLight = new THREE.SpotLight( 0xffffff, 2 );
	spotLight.position.set( 2, 4, -2 );
	spotLight.castShadow = true;
	spotLight.angle = Math.PI / 6;
	spotLight.penumbra = 0.5;
	spotLight.decay = 2;
	spotLight.distance = 10;
	scene.add(spotLight);


	///   directional light   ///
	const dl = new THREE.DirectionalLight(0xff0000, 1);
	dl.position.set(0,2,10);
	dl.target.position.set(0, 0, 15 );
	//scene.add(dl)


	///   point light   ///
	const pl = new THREE.PointLight(0xffffff,3,8,2);
	pl.position.set(-15,5,0);
	pl.castShadow = true;
	pl.shadow.camera.near = 4.5;
	scene.add(pl)

	///////      objet reflection       ///////

	const width = 10;
	const height = 0.1;
	const intensity = 10;
	const sourceGeometry = new THREE.BoxGeometry(width,height,0.1);
	const redColor = 0xff0000;
	const blueColor = 0x0000ff;
	const whiteColor = 0xffffff;
	const blackColor = 0x000000;

	// rouge
	const rlr = new THREE.RectAreaLight( redColor, intensity, width, height );
	rlr.position.set( -19, 1, 10 );
	scene.add(rlr);
	const sourceMaterialRed = new THREE.MeshBasicMaterial({color:redColor})
	const sourceR = new THREE.Mesh(sourceGeometry,sourceMaterialRed)
	sourceR.rotation.set(0,Math.PI,0)
	sourceR.position.copy(rlr.position)
	rlr.rotation.copy(sourceR.rotation)
	scene.add(sourceR)

	// vert
	const rl = new THREE.RectAreaLight( 0x00ff00, intensity, width, height );
	rl.position.set( -15, 1, 10 );
	// scene.add(rl);
	const sourceMaterial = new THREE.MeshBasicMaterial({color:0x00ff00})
	const source = new THREE.Mesh(sourceGeometry,sourceMaterial)
	source.rotation.set(0,Math.PI,0)
	source.position.copy(rl.position)
	rl.rotation.copy(source.rotation)
	// scene.add(source)

	// blue
	const rlb = new THREE.RectAreaLight( blueColor, intensity, width, height );
	rlb.position.set( -11, 1, 10 );
	// scene.add(rlb);
	const sourceMaterialBlue = new THREE.MeshBasicMaterial({color:blueColor})
	const sourceB = new THREE.Mesh(sourceGeometry,sourceMaterialBlue)
	sourceB.rotation.set(0,Math.PI,0)
	sourceB.position.copy(rlb.position)
	rlb.rotation.copy(sourceB.rotation)
	// scene.add(sourceB)

	// white
	const rlw = new THREE.RectAreaLight( whiteColor, 2, 10, height );
	rlw.position.set( -15, 2, 15);
	rlw.castshadow = true;
	scene.add(rlw);
	const sourceMaterialWhite = new THREE.MeshBasicMaterial({color:whiteColor})
	const sourceGeometryW = new THREE.BoxGeometry(10,height,0.1);
	const sourceW = new THREE.Mesh(sourceGeometryW,sourceMaterialWhite)
	sourceW.rotation.set(Math.PI/2,Math.PI,0)
	sourceW.position.copy(rlw.position)
	rlw.rotation.copy(sourceW.rotation)
	scene.add(sourceW)

	// black
	const rlk = new THREE.RectAreaLight( whiteColor, 4, 10, height );
	rlk.position.set( 15, 2, 0 );
	scene.add(rlk);
	const sourceMaterialBlack = new THREE.MeshBasicMaterial({color:whiteColor})
	const sourceGeometryK = new THREE.BoxGeometry(10,height,0.1);
	const sourceK = new THREE.Mesh(sourceGeometryK,sourceMaterialBlack)
	sourceK.rotation.set(Math.PI/2,Math.PI,0)
	sourceK.position.copy(rlk.position)
	rlk.rotation.copy(sourceK.rotation)
	scene.add(sourceK)


	//////     TEXT     /////
	///   spot light   ///
	const sl = new THREE.SpotLight( 0xffffff, 30 );
	sl.position.set( 15, 19, 15 );
	sl.target.position.set(15, 0, 15 );
	sl.castShadow = true;
	sl.angle = Math.PI;
	sl.penumbra = 0.5;
	sl.decay = 1.5;
	sl.distance = 20;
	scene.add(sl);

	const loaderJS = new FontLoader();
	loaderJS.load( '../three.js/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

		const color = 0x0000ff;

		const matDark = new THREE.LineBasicMaterial( {
			color: color,
			side: THREE.DoubleSide
		} );

		const matLite = new THREE.MeshBasicMaterial( {
			color: color,
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide
		} );

		const message = '   Test\nd\'ecriture';

		const shapes = font.generateShapes( message, 1.2 );

		const geometry = new THREE.ShapeGeometry( shapes );

		geometry.computeBoundingBox();

		const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

		geometry.translate( -19.5, 2, 15 );

		// make shape ( N.B. edge view not visible )

		const text = new THREE.Mesh( geometry, matLite );
		text.rotation.set(0,Math.PI/2,0)
		scene.add( text );

		// make line shape ( N.B. edge view remains visible )

		const holeShapes = [];

		for ( let i = 0; i < shapes.length; i ++ ) {

			const shape = shapes[ i ];

			if ( shape.holes && shape.holes.length > 0 ) {

				for ( let j = 0; j < shape.holes.length; j ++ ) {

					const hole = shape.holes[ j ];
					holeShapes.push( hole );

				}

			}

		}

		shapes.push.apply( shapes, holeShapes );

		//// contours ////

		const style = SVGLoader.getStrokeStyle( 0.05, color );

		const strokeText = new THREE.Group();

		for ( let i = 0; i < shapes.length; i ++ ) {

			const shape = shapes[ i ];

			const points = shape.getPoints();

			const geometry = SVGLoader.pointsToStroke( points, style );

			geometry.translate( -19.5,2,16 );

			const strokeMesh = new THREE.Mesh( geometry, matDark );
			strokeMesh.rotation.copy(text.rotation)
			strokeText.add( strokeMesh );

		}

		scene.add( strokeText );

		render();

	} ); 

	////     Sol transparent     /////
	const transparentGeometry = new THREE.PlaneGeometry(10, 10);
	const transparentMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.5,
		side:THREE.DoubleSide,
		roughness:0.1,
		metalness:0.1,
	});

	const transparentFloor = new THREE.Mesh(transparentGeometry, transparentMaterial);
	transparentFloor.position.set(15,0,0)
	transparentFloor.rotation.set(Math.PI/2,0,0)
	scene.add(transparentFloor)

	// Sol coloré en dessous
	const coloredGeometry = new THREE.PlaneGeometry(10, 10);
	const coloredMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side:THREE.DoubleSide });
	const coloredFloor = new THREE.Mesh(coloredGeometry, coloredMaterial);
	coloredFloor.position.set(15, -1, 0);
	coloredFloor.rotation.set(Math.PI/2,0,0)
	scene.add(coloredFloor);

	////    water    ////
	const waterGeometry = new THREE.PlaneGeometry( 40, 10 );

	water = new Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load('../textures/water.jpg', function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;
	water.position.set(0,0,-15)
	scene.add( water );

	const gui = new GUI();

	const waterUniforms = water.material.uniforms;
	waterUniforms.size.value = 7.5;

	const folderWater = gui.addFolder( 'Water' );
	folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
	folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
	folderWater.open();
	
	////    TEXT 3D    ////
	/// spot light text 3D ///
	const sltext3D = new THREE.SpotLight( 0xffffff, 10 );
	sltext3D.position.set( 40, 10, 0 );
	sltext3D.castShadow = true;
	sltext3D.angle = Math.PI*2;
	sltext3D.penumbra = 0.5;
	sltext3D.decay = 2;
	sltext3D.distance = 20;
	scene.add(sltext3D);

	material = new THREE.MeshPhongMaterial( { color: 0xb5dee8} );

	group = new THREE.Group();
	scene.add( group );

	// FONT
	const loader = new TTFLoader();
	loader.load( '../three.js/examples/fonts/ttf/kenpixel.ttf', function ( json ) {
		font = new Font( json );
		createText();
	} );

	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry( 10, 40 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
	);
	plane.rotation.x = - Math.PI / 2;
	plane.position.set(30,0,0)
	scene.add( plane );


	////    MIRROR    ////
	const planeGeo = new THREE.PlaneGeometry( 20,20 );

	// reflectors/mirrors

	let geometry;

	geometry = new THREE.CircleGeometry( 10, 64 );
	groundMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0xb5b5b5
	} );
	groundMirror.position.set(0,0.5,-40);
	groundMirror.rotateX( - Math.PI / 2 );
	scene.add( groundMirror );

	geometry = new THREE.PlaneGeometry( 20,20 );
	verticalMirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0xc1cbcb
	} );
	verticalMirror.position.set(0,10,-50);
	scene.add( verticalMirror );

	sphereGroup = new THREE.Object3D();
	scene.add( sphereGroup );

	geometry = new THREE.CylinderGeometry( 0.1, 5 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
	material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x8d8d8d } );
	const sphereCap = new THREE.Mesh( geometry, material );
	sphereCap.position.y = - 5 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
	sphereCap.rotateX( - Math.PI );

	geometry = new THREE.SphereGeometry( 5, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
	const halfSphere = new THREE.Mesh( geometry, material );
	halfSphere.add( sphereCap );
	halfSphere.rotateX( - Math.PI / 180 * 135 );
	halfSphere.rotateZ( - Math.PI / 180 * 20 );
	halfSphere.position.y = 5+Math.sin( Math.PI / 180 * 30 );

	sphereGroup.position.x = 0;
	sphereGroup.position.z = -40;
	sphereGroup.add( halfSphere );

	geometry = new THREE.IcosahedronGeometry( 2, 0 );
	material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x7b7b7b, flatShading: true } );
	smallSphere = new THREE.Mesh( geometry, material );
	smallSphere.position.set(0,0,-40)
	scene.add( smallSphere );
	

	// walls
	const planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
	planeTop.position.set(0,20,-40)
	planeTop.rotateX( Math.PI / 2 );
	scene.add( planeTop );

	const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
	planeBottom.position.set(0,0,-40)
	planeBottom.rotateX( - Math.PI / 2 );
	scene.add( planeBottom );

	const planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
	planeFront.position.set(0,10,-30)
	planeFront.rotateY( Math.PI );
	scene.add( planeFront );

	const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
	planeRight.position.set(10,10,-40)
	planeRight.rotateY( - Math.PI / 2 );
	scene.add( planeRight );
	
	const planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
	planeLeft.position.set(-10,10,-40)
	planeLeft.rotateY( Math.PI / 2 );
	scene.add( planeLeft );

	// lights
	const mainLight = new THREE.PointLight( 0xe7e7e7, 1, 20, 0 );
	mainLight.position.set(0,20,-40)
	scene.add( mainLight );

	const greenLight = new THREE.PointLight( 0x00ff00, 0.5, 20, 0 );
	greenLight.position.set( 20, 10, -40 );
	scene.add( greenLight );

	const redLight = new THREE.PointLight( 0xff0000, 0.5, 20, 0 );
	redLight.position.set( -20, 10, -40 );
	scene.add( redLight );

	const blueLight = new THREE.PointLight( 0x0000ff, 0.5, 20, 0 );
	blueLight.position.set( 0, 10, -20 );
	scene.add( blueLight );

	////    TEXTE EN MOUVEMENT    ////
	const initialPoints = [
		{ x: 35, y: 0, z: - 50 },
		{ x: 35, y: 0, z: 35 },
		{ x: - 35, y: 0, z: 35 },
		{ x: - 35, y: 0, z: - 50 },
	];

	const boxGeometry = new THREE.BoxGeometry( 2, 2, 2 );
	const boxMaterial = new THREE.MeshBasicMaterial();

	for ( const handlePos of initialPoints ) {

		const handle = new THREE.Mesh( boxGeometry, boxMaterial );
		handle.position.copy( handlePos );
		curveHandles.push( handle );
		scene.add( handle );

	}

	const curve = new THREE.CatmullRomCurve3(
		curveHandles.map( ( handle ) => handle.position )
	);
	curve.curveType = 'centripetal';
	curve.closed = true;

	const points = curve.getPoints( 70 );
	const line = new THREE.LineLoop(
		new THREE.BufferGeometry().setFromPoints( points ),
		new THREE.LineBasicMaterial( { color: 0x00ff00 } )
	);

	scene.add( line );
	const loaderMove = new FontLoader();
	loaderMove.load( '../three.js/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

		const geometry = new TextGeometry( 'Balade sentimentale !', {
			font: font,
			size: 6,
			height: 0.05,
			curveSegments: 20,
			bevelEnabled: true,
			bevelThickness: 0.5,
			bevelSize: 0.2,
			bevelOffset: 0.1,
			bevelSegments: 5,
		} );

		geometry.rotateX( Math.PI );

		const material = new THREE.MeshStandardMaterial( {
			color: 0x99ffff
		} );

		const objectToCurve = new THREE.Mesh( geometry, material );

		flow = new Flow( objectToCurve );
		flow.updateCurve( 0, curve );
		scene.add( flow.object3D );

		renderer.domElement.addEventListener( 'pointerdown', onPointerDown );

		rayCaster = new THREE.Raycaster();
		control = new TransformControls( camera, renderer.domElement );
		control.addEventListener( 'dragging-changed', function ( event ) {

			if ( ! event.value ) {
				const points = curve.getPoints( 50 );
				line.geometry.setFromPoints( points );
				flow.updateCurve( 0, curve );
			}
		});

	} );

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
	lineGroup.visible = true
	
	const numLines = 5; // Nombre de lignes parallèles
	const lineSpacing = 0.01; // Espacement entre les lignes
	
	for (let i = 0; i < numLines; i++) {
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(lignPoints);
	
		const lineCam = new THREE.Line(lineGeometry, lineMaterial);
		lineCam.position.set(0, 0.05 + i * lineSpacing, 5); // Ajustez la hauteur et la position selon vos besoins
	
		lineGroup.add(lineCam);
	}
	
	scene.add(lineGroup);
	
	// Récupérez la position de départ de la caméra
	const cameraStartPosition = camera.position.clone();
	
	// Calculez la distance maximale que la caméra peut se déplacer
	const maxDistance = 2; // Ajustez cette valeur selon vos besoins
	
	// Créez une courbe à partir des points de la ligne
	const curveLign = new THREE.CatmullRomCurve3(lignPoints);
	
	// Définissez les points cibles que la caméra va regarder à différents moments
	const lookAtTargets = [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, -8),
		new THREE.Vector3(0, 0, -12),
		new THREE.Vector3(0, 0, -16),
		new THREE.Vector3(0, 2, -20),
		new THREE.Vector3(0, 2, -26),
		new THREE.Vector3(0, 4, -32),
		new THREE.Vector3(0, 4, -37),
	];

	////    GUI    ////
	// Créez un objet pour stocker les paramètres de l'affichage des éléments
	const options = {
		afficherElements: true,
	};
	
	// Créez un dossier dans le GUI pour les options d'affichage
	const folderAffichage = gui.addFolder('Affichage');
	
	// Ajoutez le paramètre "afficherElements" au dossier
	folderAffichage.add(options, 'afficherElements').name('Afficher les éléments').onChange(function(value) {
		// Mettez à jour la visibilité des éléments en fonction de la valeur choisie
		shape3.visible = value; 
		shape2.visible = value;
		shape.visible = value;
		flow.object3D.visible = value;

		planeGeo.visible = value;
		halfSphere.visible = value;
		smallSphere.visible = value;
		planeTop.visible = value;
		planeBottom.visible = value;
		planeFront.visible = value;
		planeRight.visible = value;
		planeLeft.visible = value;
		verticalMirror.visible = value;
		groundMirror.visible = value;
		// Remplacez "shape3" par le nom de votre objet à afficher ou masquer
		// Ajoutez d'autres instructions pour afficher ou masquer d'autres éléments en fonction des besoins
	
		render();
	});
	
	// Rafraîchissez le rendu initial de la scène en fonction de la valeur initiale de "afficherElements"
	shape3.visible = options.afficherElements;
	shape2.visible = options.afficherElements;
	shape.visible = options.afficherElements;
	verticalMirror.visible = options.afficherElements
	groundMirror.visible = options.afficherElements// Remplacez "shape3" par le nom de votre objet à afficher ou masquer
	// Ajoutez d'autres instructions pour afficher ou masquer d'autres éléments en fonction des besoins
	

	window.addEventListener('scroll', function () {
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
		const newCameraPosition = cameraStartPosition.clone().add(curveLign.getPointAt(distance));
	
		camera.position.copy(newCameraPosition);
	
		// Calculez la direction vers le point cible
		const cameraDirection = new THREE.Vector3().subVectors(interpolatedTarget, newCameraPosition).normalize();
	
		// Calculez le nouveau point de vue de la caméra en ajoutant la direction à la position actuelle de la caméra
		const newCameraLookAt = new THREE.Vector3().addVectors(newCameraPosition, cameraDirection);
	
		camera.lookAt(newCameraLookAt);
	
		// Affichez la position de défilement dans la console
		console.log('Scroll Position:', scrollPosition);
	});

	/////    HELPERS    ////
	// SpotLightHelper
	const helper = new THREE.SpotLightHelper(spotLight);
	scene.add(helper);

	const helper2 = new THREE.SpotLightHelper(sl);
	scene.add(helper2);
	
	// AxesHelper
	const aHelper = new THREE.AxesHelper(5);
	scene.add(aHelper);

	// point Light Helper
	const plHelper = new THREE.PointLightHelper(pl, 0.5);
	scene.add(plHelper)

	//directional light helper
	const dlHelper = new THREE.DirectionalLightHelper(dl,3)
	scene.add(dlHelper);

	// EVENTS
	window.addEventListener( 'resize', onWindowResize );

	// CONTROLS
	controls = new OrbitControls( camera, renderer.domElement );
	gui.add({ orbitControlsEnabled: orbitControlsEnabled }, 'orbitControlsEnabled').name('Activer les contrôles').onChange(function (value) {
		orbitControlsEnabled = value;
	});

	//STATS
	stats = new Stats();
	document.body.appendChild( stats.dom );
}

function onPointerDown( event ) {

	action = ACTION_SELECT;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function createText() {
	textGeo = new TextGeometry( text, {
		font: font,
		size: sizeText,
		height: height,
		curveSegments: curveSegments,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: true
	} );
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	textMesh1 = new THREE.Mesh( textGeo, material );
	textMesh1.position.set(30,hover,18)
	textMesh1.rotation.set(0,Math.PI/2,0)
	group.add( textMesh1 );

	if ( mirror ) {
		textMesh2 = new THREE.Mesh( textGeo, material );
		textMesh2.position.set(31,-hover,18)
		textMesh2.rotation.set(Math.PI,-Math.PI/2,0)
		group.add( textMesh2 );
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	groundMirror.getRenderTarget().setSize(
		window.innerWidth * window.devicePixelRatio,
		window.innerHeight * window.devicePixelRatio
	);
	verticalMirror.getRenderTarget().setSize(
		window.innerWidth * window.devicePixelRatio,
		window.innerHeight * window.devicePixelRatio
	);
}

function animate() {
	requestAnimationFrame( animate );

	sphereGroup.rotation.y -= 0.002;

	const timer = Date.now() * 0.01;

	sphereGroup.rotation.y -= 0.002;

	smallSphere.position.set(
		Math.cos(timer * 0.1) * 7,
		2+Math.abs(Math.cos(timer * 0.2)) * 5,
		-40 + Math.sin(timer * 0.1) * 7
	);
	smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
	smallSphere.rotation.z = timer * 0.8;

	if ( action === ACTION_SELECT ) {
		rayCaster.setFromCamera( mouse, camera );
		action = ACTION_NONE;
		const intersects = rayCaster.intersectObjects( curveHandles, false );
		if ( intersects.length ) {
			const target = intersects[ 0 ].object;
			control.attach( target );
			scene.add( control );
		}
	}

	if ( flow ) {
		flow.moveAlongCurve( 0.001 );
	}

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
	water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
	renderer.render( scene, camera );	
	stats.update();
}