/*
This example uses a custom FirstPersonControls script which needs to be updated in the main draw loop.

*/
import * as THREE from "three";
import { FirstPersonControls } from "./firstPersonControls.js";

let scene, camera, renderer;

let controls;

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

  // add some boxes
  let geo = new THREE.BoxGeometry(10, 10, 10);
  let mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff00ff) });
  let collidableMesh = new THREE.Mesh(geo, mat);
  scene.add(collidableMesh);
  collidableMesh.position.set(10, 0, 0);
  // make the mesh collidable so we can't walk through it
  collidableMesh.layers.enable(3);

  let geo2 = new THREE.SphereGeometry(5, 12, 12);
  let mat2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) });
  let nonCollidableMesh = new THREE.Mesh(geo2, mat2);
  scene.add(nonCollidableMesh);
  nonCollidableMesh.position.set(-10, 0, 0);

  loop();
}

function loop() {
  renderer.render(scene, camera);

  controls.update();

  window.requestAnimationFrame(loop);
}

init();
