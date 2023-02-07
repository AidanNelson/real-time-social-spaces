/*
This example uses a function named "loop" to tell the renderer to render. This function will call
the  'window.requestAnimationFrame()' function to tell the browser window to continue drawing 
at 60 frames per second.  

RequestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, bird, wingParent1, wingParent2;
let frameCount = 0;

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

  // create a parent group
  bird = new THREE.Group();

  // create a sphere
  let geometry = new THREE.SphereGeometry(1, 12, 12);
  let material = new THREE.MeshBasicMaterial({ color: "blue" });
  let body = new THREE.Mesh(geometry, material);
  bird.add(body);

  let redMat = new THREE.MeshBasicMaterial({ color: "red" });
  wingParent1 = new THREE.Group();

  let wingGeo = new THREE.BoxGeometry(1, 1, 1);
  let wing1 = new THREE.Mesh(wingGeo, redMat);
  wingParent1.add(wing1);
  wing1.scale.set(4, 0.1, 1);
  wing1.position.set(-2.5, 0, 0);
  bird.add(wingParent1);

  let wing2 = new THREE.Mesh(wingGeo, redMat);
  wingParent2 = new THREE.Group();
  wingParent2.add(wing2);
  wing2.scale.set(4, 0.1, 1);
  wing2.position.set(2.5, 0, 0);
  bird.add(wingParent2);

  // and add it to the scene
  scene.add(bird);

  loop();
}

function loop() {
  frameCount++;

  // add some movement
  bird.position.set(0, 0, Math.sin(frameCount / 100) * 10);

  let axis = new THREE.Vector3(0, 0, 1);
  wingParent1.setRotationFromAxisAngle(axis, Math.sin(frameCount / 5) * 0.5);
  wingParent2.setRotationFromAxisAngle(axis, -Math.sin(frameCount / 5) * 0.5);
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
