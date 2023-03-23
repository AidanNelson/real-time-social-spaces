/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { FirstPersonControls } from "./firstPersonControls.js";

import { dogInfo } from "./dogs.js";
import { BouncingText } from "./BouncingText.js";

let scene, camera, renderer;

let controls;

let bouncingTextObjects = [];

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add first person controls
  controls = new FirstPersonControls(scene, camera, renderer);

  // add bouncing text objects using our class
  let breeds = dogInfo.dogs;
  for (let i = 0; i < breeds.length; i++) {
    let myText = new BouncingText(i * 2, 0, 0, breeds[i], scene);
    bouncingTextObjects.push(myText);
  }

  loop();
}

function loop() {
  renderer.render(scene, camera);

  controls.update();

  for (let i = 0; i < bouncingTextObjects.length; i++) {
    bouncingTextObjects[i].update();
  }

  window.requestAnimationFrame(loop);
}

init();
