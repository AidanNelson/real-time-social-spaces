/*
This example uses the webcam!
*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

  // addWebcamBox();
  // addWebcamBoxUsingAsync();

  addWebcamToScene();

  loop();
}

function addWebcamToScene() {
  navigator.mediaDevices.getUserMedia({ video: true }).then(gotStream);
}

function gotStream(stream) {
  console.log(stream);

  let videoEl = document.createElement("video");
  document.body.appendChild(videoEl);
  videoEl.srcObject = stream;
  videoEl.play();

  let videoTex = new THREE.VideoTexture(videoEl);

  let geo = new THREE.SphereGeometry(100, 10, 10);
  let mat = new THREE.MeshBasicMaterial({
    map: videoTex,
    side: THREE.DoubleSide,
  });
  let mesh = new THREE.Mesh(geo, mat);

  scene.add(mesh);
}

// function addWebcamBox() {
//   // request access to the webcam, then use the resulting mediaStream to create a video texture
//   navigator.mediaDevices
//     .getUserMedia({ video: true, audio: false })
//     .then((stream) => {
//       let videoElement = document.createElement("video");
//       document.body.appendChild(videoElement);
//       videoElement.srcObject = stream;
//       videoElement.style.display = "none";
//       videoElement.play();

//       // here we create a videoTexture from the html <video> element
//       let videoTex = new THREE.VideoTexture(videoElement);
//       let mat = new THREE.MeshBasicMaterial({ map: videoTex });

//       // finally, create a mesh using the material from above
//       let geo = new THREE.TorusKnotGeometry();
//       let mesh = new THREE.Mesh(geo, mat);
//       scene.add(mesh);
//     });
// }

// this version of the function above uses the async keyword
// this allows us to use the 'await' keyword in our function body
// to 'wait' for the results of the call to navigator.mediaDevices.getUserMedia();
// async function addWebcamBoxUsingAsync() {
//   let stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: false,
//   });

//   let videoElement = document.createElement("video");
//   document.body.appendChild(videoElement);
//   videoElement.srcObject = stream;
//   videoElement.style.display = "none";
//   videoElement.play();

//   // here we create a videoTexture from the html <video> element
//   let videoTex = new THREE.VideoTexture(videoElement);
//   let mat = new THREE.MeshBasicMaterial({
//     map: videoTex,
//     side: THREE.DoubleSide,
//   });

//   // finally, create a mesh using the material from above
//   let geo = new THREE.SphereGeometry(100, 12, 12);
//   let mesh = new THREE.Mesh(geo, mat);
//   scene.add(mesh);
//   scene.background = mat;
// }

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
