import * as THREE from "../three.js/build/three.module.js";

import { TTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/TTFLoader.js';
import {Font} from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from '../three.js/examples/jsm/geometries/TextGeometry.js'


let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textMesh2, textGeo, material;

let text = 'visite';
const height = 20,
	sizeText = 70,
	hover = 30,
	curveSegments = 4,
	bevelThickness = 2,
	bevelSize = 1.5;

let font = null;
const mirror = true;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// CAMERA

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
	camera.position.set( 0, 400, 700 );

	cameraTarget = new THREE.Vector3( 0, 150, 0 );

	// SCENE

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );
	scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

	// LIGHTS

	const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
	pointLight.position.set( 0, 100, 90 );
	scene.add( pointLight );

	material = new THREE.MeshPhongMaterial( { color: 0xffffff} );

	group = new THREE.Group();
	group.position.y = 100;

	scene.add( group );

	// FONT
	const loader = new TTFLoader();
	loader.load( 'https://unpkg.com/three/examples/fonts/ttf/kenpixel.ttf', function ( json ) {
		font = new Font( json );
		createText();
	} );

	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry( 10000, 10000 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
	);
	plane.position.y = 100;
	plane.rotation.x = - Math.PI / 2;
	scene.add( plane );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// EVENTS
	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

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

	const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	textMesh1 = new THREE.Mesh( textGeo, material );
	textMesh1.position.set(centerOffset,hover,0)
	textMesh1.rotation.set(0,Math.PI*2,0)
	group.add( textMesh1 );

	if ( mirror ) {
		textMesh2 = new THREE.Mesh( textGeo, material );
		textMesh2.position.set(centerOffset,-hover,height)
		textMesh2.rotation.set(Math.PI,Math.PI*2,0)
		group.add( textMesh2 );
	}

}

function animate() {
	requestAnimationFrame( animate );
	camera.lookAt( cameraTarget );
	renderer.render( scene, camera );
}