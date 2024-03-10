/*
This example shows how to move a camera along a path in three.js.

Model attribution: 
"Cruggleton Castle, Galloway, Scotland" (https://skfb.ly/oPLI7) by Global Digital Heritage is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
*/
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer;

function loadBox() {
  let boxGeo = new THREE.BoxGeometry();
  let boxMat = new THREE.MeshBasicMaterial({ color: 0xab00ff });
  let cube = new THREE.Mesh(boxGeo, boxMat);
  scene.add(cube);

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);
}

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

// This function sets up a simple scroll control for the camera
function setupSimpleScollControls() {
  renderer.domElement.addEventListener("wheel", (e) => {
    console.log(e);
    camera.position.z += e.deltaY * 0.01;
  });
}

// This function sets up a more complex scroll control for the camera
let cameraPathPosition = 0;
function setupScrollAlongPathControls() {
  // setup a path composed of multiple points
  const cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 50, -50),
    new THREE.Vector3(10, 15, -10),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(-10, 15, 10),
  ]);

  // create a simple line to visualize the path
  const points = cameraPath.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "yellow" });
  const line = new THREE.Line(geometry, material);
  line.position.set(0,-0.1,0); // offset the line a bit so it remains visible
  scene.add(line);

  // set the camera to the start position
  camera.position.set(-50, 50, -50);
  camera.lookAt(0, 0, 0);

  // then add our 'wheel' event listener
  renderer.domElement.addEventListener("wheel", (e) => {
    cameraPathPosition += e.deltaY * 0.0001;
    // constrain this value between 0 and 1, because that is what the following function expects
    cameraPathPosition = Math.max(0, Math.min(1, cameraPathPosition));
    const newCameraPosition = cameraPath.getPointAt(cameraPathPosition);
    camera.position.set(
      newCameraPosition.x,
      newCameraPosition.y,
      newCameraPosition.z
    );
    camera.lookAt(0, 0, 0);
  });
}

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 500);
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // setupSimpleScollControls();
  setupScrollAlongPathControls();

  // either load a model into the scene
  loadModel();

  // or just load a box into the scene
  // loadBox();

  loop();
}

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
