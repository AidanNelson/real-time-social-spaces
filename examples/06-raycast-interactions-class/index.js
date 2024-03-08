/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;
let mouse;
let myInteractableBoxes = [];

class MyInteractableBox {
  constructor(scene) {
    this.scene = scene;

    let geo = new THREE.BoxGeometry(1, 1, 1);
    this.inactiveMat = new THREE.MeshBasicMaterial({ color: "yellow" });
    this.activeMat = new THREE.MeshBasicMaterial({ color: "blue" });
    this.mesh = new THREE.Mesh(geo, this.inactiveMat);

    this.scene.add(this.mesh);
    this.hover = false;
    this.isActive = false;

    this.mesh.position.set(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20
    );

    window.addEventListener("click", (ev) => this.onClick(ev));

    this.raycaster = new THREE.Raycaster();
  }

  onClick() {
    if (this.hover) {
      console.log("clicked on object");
      if (this.isActive) {
        this.mesh.material = this.inactiveMat;
        this.isActive = false;
      } else {
        this.mesh.material = this.activeMat;
        this.isActive = true;
      }
    } else {
      // didn't click
    }
  }

  update() {
    // check for hover
    this.raycaster.setFromCamera(mouse, camera);

    let interaction = this.raycaster.intersectObject(this.mesh);
    if (interaction.length > 0) {
      this.hover = true;
      this.mesh.scale.set(1.5, 1.5, 1.5);
    } else {
      this.hover = false;
      this.mesh.scale.set(1, 1, 1);
    }
  }
}

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

  for (let i = 0; i < 10; i++) {
    myInteractableBoxes.push(new MyInteractableBox(scene));
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

  loop();
}

function loop() {
  for (let i = 0; i < 10; i++) {
    myInteractableBoxes[i].update();
  }
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
