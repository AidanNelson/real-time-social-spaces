/*
This example shows how to move a camera along a path in three.js.

Model attribution: 
"Cruggleton Castle, Galloway, Scotland" (https://skfb.ly/oPLI7) by Global Digital Heritage is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
*/
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EditableCameraPathTool } from "./EditableCameraPathTool.js";

let scene, camera, renderer;

function loadModel() {
  // first create a loader
  let loader = new GLTFLoader();

  // then load the file and add it to your scene
  loader.load("./cruggleton1__model_lp.glb", function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, -25, 0);
    gltf.scene.rotateY(-Math.PI / 2);
  });
}

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 500);
  camera.position.set(10, 10, 10);


  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let editableCameraPathTool = new EditableCameraPathTool(
    camera,
    scene,
    renderer
  );

  // either load a model into the scene
  loadModel();

  // grid helper
  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  loop();
}

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
