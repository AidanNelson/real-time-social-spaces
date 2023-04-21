/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MyBoxWithColor } from "./MyBoxWithColor.js";

let scene, camera, renderer;

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

  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  addBoxes();

  loop();
}
let box1, box2, box3;
function addBoxes() {
  box1 = new MyBoxWithColor(1, 0, 0, 2, 2, 0, scene);
  box2 = new MyBoxWithColor(0, 1, 0, 5, 6, 12, scene);
  box3 = new MyBoxWithColor(0, 0.2, 0.9, 9, 3, 1, scene);

  document.addEventListener(
    "keyup",
    () => {
      box1.changeColor(Math.random(), Math.random(), Math.random());
    },
    false
  );
}

function loop() {
  box1.update();
  box2.update();
  box3.update();
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
