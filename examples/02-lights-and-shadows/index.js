/*
This example adds lights and uses a 'phong' material which responds to those lights.

It also adds a shadow.  Note that the shadow parameters need to be updated on the renderer, on the light, and on the objects casting and receiving shadows.
*/
import * as THREE from "three";

// create a scene in which all other objects will exist
let scene = new THREE.Scene();

// create a camera and position it in space
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5; // place the camera in space

// the renderer will actually show the camera view within our <canvas>
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// create a sphere
let geometry = new THREE.SphereGeometry(1, 12, 12);
let material = new THREE.MeshPhongMaterial({ color: "blue" });
let my3DObject = new THREE.Mesh(geometry, material);
my3DObject.castShadow = true;

// floor
let floorGeo = new THREE.BoxGeometry(10, 1, 10);
let floorMat = new THREE.MeshPhongMaterial({ color: "white" });
let floorMesh = new THREE.Mesh(floorGeo, floorMat);
floorMesh.position.set(0, -3, 0);
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// and add it to the scene
scene.add(my3DObject);

//add a light
let myColor = new THREE.Color(0xffaabb);
let ambientLight = new THREE.AmbientLight(myColor, 0.5);
scene.add(ambientLight);

// add a directional light
let myDirectionalLight = new THREE.DirectionalLight(myColor, 0.85);
myDirectionalLight.position.set(0, 20, 0);
myDirectionalLight.lookAt(0, 0, 0);
scene.add(myDirectionalLight);
myDirectionalLight.castShadow = true;
//Set up shadow properties for the light
myDirectionalLight.shadow.mapSize.width = 512; // default
myDirectionalLight.shadow.mapSize.height = 512; // default
myDirectionalLight.shadow.camera.near = 0.5; // default
myDirectionalLight.shadow.camera.far = 500; // default

function loop() {
  // add some movement
  my3DObject.rotateY(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}
loop();
