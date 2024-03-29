import * as THREE from "../three.js/build/three.module.js";

import { TransformControls } from '../three.js/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js/examples/jsm/modifiers/CurveModifier.js';
import {FontLoader} from '../three.js/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from '../three.js/examples/jsm/geometries/TextGeometry.js'

const ACTION_SELECT = 1, ACTION_NONE = 0;
const curveHandles = [];
const mouse = new THREE.Vector2();

let stats;
let scene,
	camera,
	renderer,
	rayCaster,
	control,
	flow,
	action = ACTION_NONE;

init();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set( 5, 2, 10 );
	camera.lookAt( scene.position );

	const initialPoints = [
		{ x: 35, y: 0, z: - 35 },
		{ x: 35, y: 0, z: 35 },
		{ x: - 35, y: 0, z: 35 },
		{ x: - 35, y: 0, z: - 35 },
	];

	const boxGeometry = new THREE.BoxGeometry( 4, 4, 4 );
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

	//

	const light = new THREE.DirectionalLight( 0xffaa33, 3 );
	light.position.set( - 10, 10, 10 );
	scene.add( light );

	const light2 = new THREE.AmbientLight( 0x003973, 3 );
	scene.add( light2 );

	//

	const loader = new FontLoader();
	loader.load( '../three.js/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

		const geometry = new TextGeometry( 'Hello three.js!', {
			font: font,
			size: 5,
			height: 0.25,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.1,
			bevelSize: 0.25,
			bevelOffset: 0,
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

	} );

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.useLegacyLights = false;
	document.body.appendChild( renderer.domElement );

	renderer.domElement.addEventListener( 'pointerdown', onPointerDown );

	rayCaster = new THREE.Raycaster();
	control = new TransformControls( camera, renderer.domElement );
	control.addEventListener( 'dragging-changed', function ( event ) {

		if ( ! event.value ) {

			const points = curve.getPoints( 50 );
			line.geometry.setFromPoints( points );
			flow.updateCurve( 0, curve );

		}

	} );

	stats = new Stats();
	document.body.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerDown( event ) {

	action = ACTION_SELECT;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {

	requestAnimationFrame( animate );

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

	render();

}

function render() {

	renderer.render( scene, camera );

	stats.update();

}