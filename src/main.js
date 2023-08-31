import * as THREE from "./modules/three.module.js";
import { OrbitControls } from './modules/OrbitControls.js';

///   scene  creation   ///
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x6f6f6f);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

///   camera  position   ///
let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0, 15, 15);

// Sol
let geometryFloor = new THREE.PlaneGeometry(10, 10);
let Floortexture = new THREE.TextureLoader().load('./textures/test.jpg');
let floorColor = new THREE.Color(0.7, 0.6, 0.6);
Floortexture.wrapS = Floortexture.wrapT = THREE.RepeatWrapping;
Floortexture.repeat.set(1, 3)
let FloorMaterial = new THREE.MeshBasicMaterial({ map: Floortexture, color:floorColor, side: THREE.DoubleSide});

//spawn floor
let floor = new THREE.Mesh(geometryFloor, FloorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);
//corridor 1 floor
let CorridorFloor1 = new THREE.Mesh(geometryFloor, FloorMaterial);
CorridorFloor1.rotation.x = -Math.PI / 2;
CorridorFloor1.position.y = 0;
CorridorFloor1.position.z = -10
scene.add(CorridorFloor1);
//corridor 2 floor
let CorridorFloor2 = new THREE.Mesh(geometryFloor, FloorMaterial);
CorridorFloor2.rotation.x = -Math.PI / 2;
CorridorFloor2.position.y = 0;
CorridorFloor2.position.z = -20
scene.add(CorridorFloor2);

// Murs droits
let high = 3
let geometryLargeWall = new THREE.PlaneGeometry(10, high);
let geometryThinWall = new THREE.PlaneGeometry(2.5, high);
// let Walltexture = new THREE.TextureLoader().load('./textures/marble.jpg');
// let WallMaterial = new THREE.MeshBasicMaterial({ map: Walltexture, side: THREE.DoubleSide });
let WallMaterial = new THREE.MeshPhysicalMaterial({
	color: 0x010101, // Couleur noire
	metalness: 0.5, // Réflexion métallique maximale
	roughness: 0.5, // Rugosité minimale pour une réflexion parfaite
  });

let Eastwall = new THREE.Mesh(geometryLargeWall, WallMaterial);
Eastwall.rotation.y = -Math.PI / 2;
Eastwall.position.x = 5;
Eastwall.position.y = high/2;
scene.add(Eastwall);

let Westwall = new THREE.Mesh(geometryLargeWall, WallMaterial);
Westwall.position.y = high/2;
Westwall.position.x = -5
Westwall.rotation.y = Math.PI / 2;
scene.add(Westwall);

let NorthRightwall = new THREE.Mesh(geometryThinWall, WallMaterial);
NorthRightwall.position.y = high/2;
NorthRightwall.position.z = -5
NorthRightwall.position.x = -3.75
scene.add(NorthRightwall);

let NorthLefttwall = new THREE.Mesh(geometryThinWall, WallMaterial);
NorthLefttwall.position.y = high/2;
NorthLefttwall.position.z = -5
NorthLefttwall.position.x = 3.75
scene.add(NorthLefttwall);

/////////////////////////////////// COULOIR 1 /////////////////////////////////////////// 
//// gauche ////////
let material = new THREE.MeshBasicMaterial({ color:  "#1a1a1a",wireframe: false });
let ShapeLeftCorridor1 = new THREE.Shape();
ShapeLeftCorridor1.bezierCurveTo(0, 0, 0, 15, 7.5, 15);
ShapeLeftCorridor1.lineTo(0,15)

let Settings = {
    steps: 1,         // Nombre de subdivision
    depth: 3,         // Profondeur
    bevelEnabled: false  // corner radius
};
let geometryLeftCorridor1 = new THREE.ExtrudeGeometry(ShapeLeftCorridor1, Settings);

let LeftCorridor1 = new THREE.Mesh(geometryLeftCorridor1, material);
LeftCorridor1.rotation.x = -Math.PI/2
LeftCorridor1.position.set(-2.5,0,-5)
scene.add(LeftCorridor1);

//// bordures ////
//top
let Leftpoints = ShapeLeftCorridor1.extractPoints().shape;

let LeftlineGeometry = new THREE.BufferGeometry().setFromPoints(Leftpoints);
let CorridorTexture = 0xC3C3C3
let LeftTopline = new THREE.Line(LeftlineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
LeftTopline.rotation.x = -Math.PI/2
LeftTopline.position.set(-2.5,3,-5)
scene.add(LeftTopline);
//bottom
let LeftBottomline = new THREE.Line(LeftlineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
LeftBottomline.rotation.x = -Math.PI/2
LeftBottomline.position.set(-2.5,0.02,-5)
scene.add(LeftBottomline);

//// droite ////////
let ShapeRightCorridor1 = new THREE.Shape();
ShapeRightCorridor1.bezierCurveTo(0, 0, 0, 10, 2.5, 10);

let geometryRightCorridor1 = new THREE.ExtrudeGeometry(ShapeRightCorridor1, Settings);

let RightCorridor1 = new THREE.Mesh(geometryRightCorridor1, material);
RightCorridor1.rotation.x = -Math.PI/2
RightCorridor1.position.z = -5
RightCorridor1.position.x = 2.5
scene.add(RightCorridor1);

//// bordures ////
//top
let Rightpoints = ShapeRightCorridor1.extractPoints().shape;

let RightlineGeometry = new THREE.BufferGeometry().setFromPoints(Rightpoints);
let RightTopline = new THREE.Line(RightlineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
RightTopline.rotation.x = -Math.PI/2
RightTopline.position.set(2.5,3,-5)
scene.add(RightTopline);
//bottom
let RightBottomline = new THREE.Line(RightlineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
RightBottomline.rotation.x = -Math.PI/2
RightBottomline.position.set(2.5,0.02,-5)
scene.add(RightBottomline);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////SALLE 2////////////////////////////////////////////////////////////////////
/// murs d'entrée
let RoomTwoEntryLeftWall = new THREE.Mesh(geometryThinWall, WallMaterial);
RoomTwoEntryLeftWall.position.y = high/2;
RoomTwoEntryLeftWall.position.z = -13.75
RoomTwoEntryLeftWall.position.x = 5
RoomTwoEntryLeftWall.rotation.y = -Math.PI/2
scene.add(RoomTwoEntryLeftWall);

let RoomTwoEntryRightWall = new THREE.Mesh(geometryThinWall, WallMaterial);
RoomTwoEntryRightWall.position.y = high/2;
RoomTwoEntryRightWall.position.z = -21.25
RoomTwoEntryRightWall.position.x = 5
RoomTwoEntryRightWall.rotation.y = -Math.PI/2
scene.add(RoomTwoEntryRightWall);

/// murs cotés
let RoomTwoRightWall = new THREE.Mesh(geometryLargeWall, WallMaterial);
RoomTwoRightWall.position.y = high/2;
RoomTwoRightWall.position.z = -12.5
RoomTwoRightWall.position.x = 10
scene.add(RoomTwoRightWall);

let RoomTwoLeftWall = new THREE.Mesh(geometryLargeWall, WallMaterial);
RoomTwoLeftWall.position.y = high/2;
RoomTwoLeftWall.position.z = -22.5
RoomTwoLeftWall.position.x = 10
scene.add(RoomTwoLeftWall);

// murs sortie
let RoomTwoExitLeftWall = new THREE.Mesh(geometryThinWall, WallMaterial);
RoomTwoExitLeftWall.position.y = high/2;
RoomTwoExitLeftWall.position.z = -13.75
RoomTwoExitLeftWall.position.x = 15
RoomTwoExitLeftWall.rotation.y = -Math.PI/2
scene.add(RoomTwoExitLeftWall);

let RoomTwoExitRightWall = new THREE.Mesh(geometryThinWall, WallMaterial);
RoomTwoExitRightWall.position.y = high/2;
RoomTwoExitRightWall.position.z = -21.25
RoomTwoExitRightWall.position.x = 15
RoomTwoExitRightWall.rotation.y = -Math.PI/2
scene.add(RoomTwoExitRightWall);
/// sol
//Room 2 floor
let RoomTwoFloor1 = new THREE.Mesh(geometryFloor, FloorMaterial);
RoomTwoFloor1.rotation.x = -Math.PI / 2;
RoomTwoFloor1.position.y = 0;
RoomTwoFloor1.position.z = -10
RoomTwoFloor1.position.x = 10
scene.add(RoomTwoFloor1);
//Room 2 floor
let RoomTwoFloor2 = new THREE.Mesh(geometryFloor, FloorMaterial);
RoomTwoFloor2.rotation.x = -Math.PI / 2;
RoomTwoFloor2.position.y = 0;
RoomTwoFloor2.position.z = -25	
RoomTwoFloor2.position.x = 10
scene.add(RoomTwoFloor2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////couloir 2//////////////////////////////////////////////////////////////////
//corridor 3 floor
let CorridorTwoFloor1 = new THREE.Mesh(geometryFloor, FloorMaterial);
CorridorTwoFloor1.rotation.x = -Math.PI / 2;
CorridorTwoFloor1.position.y = 0;
CorridorTwoFloor1.position.z = -10
CorridorTwoFloor1.position.x = 20
scene.add(CorridorTwoFloor1);
//corridor 3 floor
let CorridorThreeFloor2 = new THREE.Mesh(geometryFloor, FloorMaterial);
CorridorThreeFloor2.rotation.x = -Math.PI / 2;
CorridorThreeFloor2.position.y = 0;
CorridorThreeFloor2.position.z = -20
CorridorThreeFloor2.position.x = 20
scene.add(CorridorThreeFloor2);

//// gauche ////////
let ShapeLeftCorridor2 = new THREE.Shape();
ShapeLeftCorridor2.bezierCurveTo(0, 0, 7.5, 0, 7.5, 10);
ShapeLeftCorridor2.lineTo(7.5,0)

let geometryLeftCorridor2 = new THREE.ExtrudeGeometry(ShapeLeftCorridor2, Settings);

let LeftCorridor2 = new THREE.Mesh(geometryLeftCorridor2, material);
LeftCorridor2.rotation.x = -Math.PI/2
LeftCorridor2.position.set(15,0,-15)
scene.add(LeftCorridor2);

//// bordures ////
//top
let CorridorTwoLeftPoints = ShapeLeftCorridor2.extractPoints().shape;

let CorridorTwoLeftLineGeometry = new THREE.BufferGeometry().setFromPoints(CorridorTwoLeftPoints);
let CorridorTwoLeftTopline = new THREE.Line(CorridorTwoLeftLineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
CorridorTwoLeftTopline.rotation.x = -Math.PI/2
CorridorTwoLeftTopline.position.set(-2.5,3,-5)
scene.add(CorridorTwoLeftTopline);
//bottom
let CorridorTwoLeftBottomline = new THREE.Line(CorridorTwoLeftLineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
CorridorTwoLeftBottomline.rotation.x = -Math.PI/2
CorridorTwoLeftBottomline.position.set(-2.5,0.02,-5)
scene.add(CorridorTwoLeftBottomline);

//// droite ////////
let ShapeRightCorridor2 = new THREE.Shape();
ShapeRightCorridor2.bezierCurveTo(0, 0, 0, 10, 2.5, 10);

let geometryRightCorridor2 = new THREE.ExtrudeGeometry(ShapeRightCorridor2, Settings);

let RightCorridor2 = new THREE.Mesh(geometryRightCorridor2, material);
RightCorridor2.rotation.x = -Math.PI/2
RightCorridor2.position.z = -5
RightCorridor2.position.x = 2.5
scene.add(RightCorridor2);

//// bordures ////
//top
let CorridorTwoRightPoints = ShapeRightCorridor1.extractPoints().shape;

let CorridorTwoRightLineGeometry = new THREE.BufferGeometry().setFromPoints(CorridorTwoRightPoints);
let CorridorTwoRightTopline = new THREE.Line(CorridorTwoRightLineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
CorridorTwoRightTopline.rotation.x = -Math.PI/2
CorridorTwoRightTopline.position.set(2.5,3,-5)
scene.add(CorridorTwoRightTopline);
//bottom
let CorridorTwoRightBottomline = new THREE.Line(CorridorTwoRightLineGeometry, new THREE.LineBasicMaterial({ color: CorridorTexture }));
CorridorTwoRightBottomline.rotation.x = -Math.PI/2
CorridorTwoRightBottomline.position.set(2.5,0.02,-5)
scene.add(CorridorTwoRightBottomline);

const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 10 );
rectLight1.position.set( - 5, 5, 5 );
scene.add( rectLight1 );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Ajout de OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.rotateSpeed = 0.05;
//controls.update()


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