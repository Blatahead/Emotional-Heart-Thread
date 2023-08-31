////    LIGN CAM    ////
const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -4)]);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const lineCam = new THREE.Line(lineGeometry, lineMaterial);

// Ajoutez la ligne à la scène
scene.add(lineCam);

// Récupérez la position de départ de la caméra
const cameraStartPosition = camera.position.clone();

// Calculez la distance maximale que la caméra peut se déplacer
const maxDistance = 10; // Ajustez cette valeur selon vos besoins

// Ajoutez un écouteur d'événements pour détecter les événements de défilement
window.addEventListener('scroll', function () {
  // Récupérez la position de défilement
  const scrollPosition = window.scrollY;

  // Calculez la distance de déplacement de la caméra en fonction de la position de défilement
  const distance = -(scrollPosition / window.innerHeight) * maxDistance; // Ajustez le coefficient pour contrôler la vitesse de déplacement

  // Mettez à jour la position de la caméra en fonction de la distance
  camera.position.z = cameraStartPosition.z + distance;

  // Affichez la position de défilement dans la console
  console.log('Scroll Position:', scrollPosition);
});