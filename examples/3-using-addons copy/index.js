/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;

let myObjects = [];
let inactiveMat, activeMat;
let mouse;

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

  // create several objects which we can activate with raycasting
  // use a shared geometry for each object
  let geo = new THREE.TorusGeometry(1, 0.5, 12, 12);
  activeMat = new THREE.MeshBasicMaterial({ color: "red" });
  inactiveMat = new THREE.MeshBasicMaterial();

  for (let i = 0; i < 10; i++) {
    // and use a different material (because we will alter it when an object is raycast)

    let mesh = new THREE.Mesh(geo, inactiveMat);

    mesh.position.set(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20
    );
    mesh.rotation.y = Math.random() * 2;
    scene.add(mesh);
    myObjects.push(mesh);
  }

  // add a raycast on click
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    },
    false
  );

  let raycaster = new THREE.Raycaster();
  document.addEventListener("click", (ev) => {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(myObjects);

    // reset all materials
    for (let i = 0; i < myObjects.length; i++) {
      myObjects[i].material = inactiveMat;
    }
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material = activeMat;
    }
  });

  loop();
}

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
