/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

let scene, camera, renderer, my3DObject;

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //
  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  // create a sphere
  let geometry = new THREE.SphereGeometry(1, 3, 4);
  let material = new THREE.MeshBasicMaterial({ color: "blue" });
  my3DObject = new THREE.Mesh(geometry, material);

  // and add it to the scene
  scene.add(my3DObject);

  loop();
}

function loop() {
  // add some movement
  my3DObject.rotateY(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
