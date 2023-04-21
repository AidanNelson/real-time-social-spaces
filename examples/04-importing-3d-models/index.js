/*
This example adds a GLB model using the GLTF/GLB loader module.

Model is from David O'Reilly's Everything Library:
https://www.davidoreilly.com/library

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer;

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff00ff);

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

  // add some lights so we can see our model
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(new THREE.DirectionalLight(0xffffff, 0.75));

  // add our model
  loadModel();

  loop();
}

function loadModel() {
  // first create a loader
  let loader = new GLTFLoader();

  // then load the file and add it to your scene
  loader.load("./toad.glb", function (gltf) {
    scene.add(gltf.scene);
  });
}

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
