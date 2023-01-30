/*
This example uses a function named "loop" to tell the renderer to render. This function will call
the  'window.requestAnimationFrame()' function to tell the browser window to continue drawing 
at 60 frames per second.  

RequestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


*/
import * as THREE from "three";

// create a scene in which all other objects will exist
let scene = new THREE.Scene();

// create a camera and position it in space
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5; // place the camera in space

// the renderer will actually show the camera view within our <canvas>
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create a sphere
let geometry = new THREE.SphereGeometry(1, 3, 4);
let material = new THREE.MeshBasicMaterial({ color: "blue" });
let my3DObject = new THREE.Mesh(geometry, material);

// and add it to the scene
scene.add(my3DObject);

function loop() {
  // add some movement
  my3DObject.rotateY(0.01);

  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}
loop();
