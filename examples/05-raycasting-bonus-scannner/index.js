/*



*/
import * as THREE from "three";

let scene, camera, renderer;

let raycaster;
let mouseIsDown = false;
let mouse;
let frameCount = 0;

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(-10, 10, 10);
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  loadModel();

  setupRaycaster();
  loop();
}

function setupRaycaster() {
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

  raycaster = new THREE.Raycaster();
  document.addEventListener("mousedown", (ev) => {
    mouseIsDown = true;
  });
  document.addEventListener("mouseup", (ev) => {
    mouseIsDown = false;
  });
}

let geo = new THREE.SphereGeometry(0.04, 8, 8);
let mat = new THREE.MeshBasicMaterial({ color: "yellow" });

function addObjectAtPoint(point) {
  let mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(point.x, point.y, point.z);
  scene.add(mesh);
}

function updateRaycaster() {
  // only run this after the model has been added to the scene
  if (mouseIsDown) {
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        // create a grid point offset from the current mouse position
        let gridPoint = new THREE.Vector2(
          mouse.x + i / 100 + Math.random() / 5,
          mouse.y + j / 100 + Math.random() / 5
        );

        raycaster.setFromCamera(gridPoint, camera);
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects[0]) {
          addObjectAtPoint(intersects[0].point);
        }
      }
    }
  }
}

let cubeGeo = new THREE.BoxGeometry(1.75, 1.75, 1.75);
let cubeMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
function loadModel() {
  for (let i = -10; i <= 10; i++) {
    for (let j = -10; j <= 10; j++) {
      let mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(i * 2, Math.random() * 5, j * 2);
      scene.add(mesh);
    }
  }
}

function loop() {
  frameCount++;
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  // if (frameCount % 5 === 0) {
  updateRaycaster();
  // }
  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
