/*
This example uses raycasting to create a mouse-over interaction on a grid of objects.

Based on https://bear71vr.nfb.ca/

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;

let myGridObjects = []; // array of arrays representing rows and columns of the grid
let myGridInteractionObjects = [];
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

  // grid of objects
  createGridOfObjects();

  // add a raycast interactions
  mouse = new THREE.Vector2(0, 0);
  let raycaster = new THREE.Raycaster();
  raycaster.layers.set(2); // only detect intesections on the 2nd layer

  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      // update our raycaster
      raycaster.setFromCamera(mouse, camera);

      // run an intersection check with the grid objects
      const intersects = raycaster.intersectObjects(myGridInteractionObjects);

      // reset all positions
      for (let i = 0; i < myGridObjects.length; i++) {
        myGridObjects[i].position.y = 0;
      }
      // change the position of every intersection object's corresponding mesh object
      // which we stored in userData
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.userData.mesh.position.y = 0.5;
      }
    },
    false
  );

  loop();
}

// in this function, we'll create a grid of objects and a 2nd grid of 'intersection objects'
// the first set of objects will be visible to the camera and the 2nd set
// will only be made visible to the raycaster (using three.js 'layers')
function createGridOfObjects() {
  let geo = new THREE.SphereGeometry(0.25, 12, 12);
  let mat = new THREE.MeshBasicMaterial({ color: "red" });

  let interactionGeo = new THREE.BoxGeometry(1, 0.1, 1);

  for (let i = -10; i <= 10; i++) {
    for (let j = -10; j <= 10; j++) {
      // create the mesh which will move
      let mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(i, 0, j);
      myGridObjects.push(mesh);
      scene.add(mesh);

      // create a second mesh which will only be used for raycasting
      // and won't be visible
      let interactionMesh = new THREE.Mesh(interactionGeo, mat);
      interactionMesh.position.set(i, 0, j);
      // add this mesh to a layer which is visible to the raycaster but not the camera
      interactionMesh.layers.set(2);

      // store a reference to the visible mesh in the interaction meshes' userData
      interactionMesh.userData.mesh = mesh;

      myGridInteractionObjects.push(interactionMesh);
      scene.add(interactionMesh);
    }
  }
}

function loop() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

init();
