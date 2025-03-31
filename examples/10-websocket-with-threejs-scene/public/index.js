import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FirstPersonControls } from "./FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// create variables and make them available globally
let scene, myRenderer, camera;

// keep track of which frame we are on
let frameCount = 0;

// keep track of our controls so we can update them in the draw loop
let controls;

let socket;


function init() {

  // create a scene and give it a background color
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(20,20,20)");

  // create the renderer which will actually draw our scene and add it to the document
  myRenderer = new THREE.WebGLRenderer();
  myRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(myRenderer.domElement);

  // create our camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);


  // add orbit controls so we can navigate our scene while testing
  // controls = new OrbitControls(camera, myRenderer.domElement);
  controls = new FirstPersonControls(scene, camera, myRenderer);

  // mesh
  let grid = new THREE.GridHelper(100, 100);
  scene.add(grid);

  // add websocket support
  setupWebsocketConnection();

  window.addEventListener('keydown', onKeyDown);

  // start the draw loop
  draw();
}

function onKeyDown(ev){
  if (ev.key === "p"){
    console.log('placing object');
    let myMessage = {
      x: camera.position.x,
      y: 0,
      z: camera.position.z,
    }
    socket.emit('msg', myMessage);
  }
}

function setupWebsocketConnection(){
  socket = io();
  socket.on('msg', onMessage);
}
function onMessage(msg){
  console.log(msg);

  let geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  let mat = new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" });
  let cube = new THREE.Mesh(geo, mat);
  cube.position.set(msg.x, msg.y, msg.z);
  cube.castShadow = true; 
  cube.receiveShadow = true;
  scene.add(cube);
  setTimeout(() => {
    scene.remove(cube);
    console.log('removed cube');
  },1000);
}


function draw() {
  controls.update();
  frameCount = frameCount + 1;

  myRenderer.render(scene, camera);
  console.log('placing object');
  let myMessage = {
    x: camera.position.x,
    y: 0,
    z: camera.position.z,
  }
  socket.emit('msg', myMessage);

  // ask the browser to render another frame when it is ready
  window.requestAnimationFrame(draw);
}

// get everything started by calling init
init();
