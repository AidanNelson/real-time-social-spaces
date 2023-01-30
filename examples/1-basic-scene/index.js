// Because this is a module, we can use import syntax
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
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
let geometry = new THREE.SphereGeometry(1, 12, 12);
let material = new THREE.MeshBasicMaterial({ color: "blue" });
let my3DObject = new THREE.Mesh(geometry, material);

// and add it to the scene
scene.add(my3DObject);

// finally, take a picture of the scene and show it in the <canvas>
renderer.render(scene, camera);

// what else can we do?
// create many objects with a for-loop
// add movement (how do we have things change over time)
// change camera types / parameters
