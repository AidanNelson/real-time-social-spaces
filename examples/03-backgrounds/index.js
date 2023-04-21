/*
This example changes the background color of the renderer.  It also shows using a skybox from an equirectangular image.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// in order to use an HDR image, we need to first load the RGBELoader
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let scene, camera, renderer, my3DObject;

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 2;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // call our new addbackground function
  addBackground();

  // add a grid to help visualize the space
  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  // create a 3d object
  let geometry = new THREE.BoxGeometry(1, 2, 3);
  let material = new THREE.MeshBasicMaterial({ color: "grey" });
  my3DObject = new THREE.Mesh(geometry, material);

  // and add it to the scene
  scene.add(my3DObject);

  loop();
}

function addBackground() {
  // there are a few different ways to create a background.
  // first, you can set the renderer's 'clear color' as shown below
  let backgroundColor = new THREE.Color(0xff00ff); // create a color representation from a hex code
  renderer.setClearColor(backgroundColor);

  // next, try to uncomment the following to see a 'skybox' image background
  // let loader = new RGBELoader();
  // loader.load("./background.hdr", (texture) => {
  //   texture.mapping = THREE.EquirectangularReflectionMapping;
  //   scene.background = texture;
  // });
}

function loop() {
  // add some movement
  my3DObject.rotateY(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
