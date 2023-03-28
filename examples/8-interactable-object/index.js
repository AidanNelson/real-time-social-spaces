/*
This example uses class syntax to create a composable 3D module.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Interactable } from "./Interactable.js";

let scene, camera, renderer;
let controls;
let interactableObjects = [];

// variables for raycasting interaction
let mouse;
let raycaster;
let ground;

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

  controls = new OrbitControls(camera, renderer.domElement);

  interactableObjects.push(new Interactable(scene, camera, 2, 0, 0));
  interactableObjects.push(new Interactable(scene, camera, -2, 0, 0));

  // interactableObjects[0].updatePosition(20, 5, 5);

  // setup raycasting
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  document.addEventListener("click", onClick, false);

  let geo = new THREE.PlaneGeometry(10, 10);
  let mat = new THREE.MeshBasicMaterial();

  ground = new THREE.Mesh(geo, mat);
  ground.rotateX(-Math.PI / 2);
  scene.add(ground);

  loop();
}

function onClick(ev) {
  // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
  mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // calculate if there is an intersection
  const intersects = raycaster.intersectObject(ground);

  if (intersects.length > 0) {
    console.log("hit from main raycaster");
    let point = intersects[0].point;
    interactableObjects[0].updatePosition(point.x, point.y, point.z);
    console.log(intersects[0]);
  }
}
function loop() {
  renderer.render(scene, camera);

  controls.update();

  for (let i = 0; i < interactableObjects.length; i++) {
    interactableObjects[i].update();
  }

  window.requestAnimationFrame(loop);
}

init();
