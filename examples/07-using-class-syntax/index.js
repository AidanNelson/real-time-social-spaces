/*
This example uses class syntax to create a composable 3D module.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { MyCoolBox } from "./MyCoolBox.js";

let scene, camera, renderer;

let controls;

let myClassObjects = [];

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add first person controls
  controls = new OrbitControls(camera, renderer.domElement);

  // add bouncing text objects using our class
  for (let i = 0; i < 10; i++) {
    let myClassObject = new MyCoolBox(i * 5, 0, 0, scene);
    myClassObjects.push(myClassObject);
  }

  loop();
}

function loop() {
  renderer.render(scene, camera);

  controls.update();

  for (let i = 0; i < myClassObjects.length; i++) {
    myClassObjects[i].update();
  }

  window.requestAnimationFrame(loop);
}

init();
