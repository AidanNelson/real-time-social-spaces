/*
This example adds lights and uses a 'phong' material which responds to those lights.
*/
import * as THREE from "three";

// create a scene in which all other objects will exist
let scene = new THREE.Scene();

// create a texture loader:
let textureLoader = new THREE.TextureLoader();
let myTexture = textureLoader.load("./cat.jpg");
myTexture.wrapS = THREE.RepeatWrapping;
myTexture.wrapT = THREE.RepeatWrapping;
myTexture.repeat.set(4, 4);

// create a camera and position it in space
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5; // place the camera in space

// the renderer will actually show the camera view within our <canvas>
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create a sphere and add it to the scene
let geometry = new THREE.SphereGeometry(1, 3, 4);
let material = new THREE.MeshPhongMaterial({ map: myTexture });
let my3DObject = new THREE.Mesh(geometry, material);
scene.add(my3DObject);

// add some lights to the scene
// try commenting these out to see how each of them affect the image
let directionalLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), 1);
directionalLight.position.set(10, 2, 3);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

let ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.5);
scene.add(ambientLight);

function loop() {
  // add some movement
  my3DObject.rotateY(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}
loop();
