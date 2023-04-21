import * as THREE from "three";

export class Interactable {
  // the constructor is a special function which is called when we create a new
  // 'instance' of this class
  constructor(scene, camera, x, y, z) {
    let geo = new THREE.BoxGeometry(1, 1, 1);
    let mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("blue"),
    });

    // we will save our mesh by using 'this dot' syntax
    // this variable is now accessible throughout this class
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);

    // save the scene in case we need it later and add our mesh
    this.scene = scene;
    this.scene.add(this.mesh);

    // keep camera for use in raycaster
    this.camera = camera;

    // here we will create an object to keep track of which keys are
    // clicked at any given point
    this.keys = {};
    // and create event listeners which update as we click on our keyboard
    document.addEventListener("keydown", (ev) => this.onKeyDown(ev), false);
    document.addEventListener("keyup", (ev) => this.onKeyUp(ev), false);

    // here we will keep track of whether this object is active
    // and will allow a user to set an object as active (or inactive)
    // by clicking on it
    this.isActive = false;

    // the raycaster is used to determine whether this object is active
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    document.addEventListener("click", (ev) => this.onClick(ev), false);

    // for interpolating movement to make it smooth
    this.startPosition = new THREE.Vector3().copy(this.mesh.position);
    this.endPosition = new THREE.Vector3().copy(this.mesh.position);
    this.alpha = 0;
    this.startTime = 0;

    this.frameCount = 0;
  }

  onKeyDown(ev) {
    this.keys[ev.key] = true;
  }

  onKeyUp(ev) {
    this.keys[ev.key] = false;
  }

  onClick(ev) {
    // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
    this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate if there is an intersection
    const intersects = this.raycaster.intersectObject(this.mesh);

    if (intersects.length > 0) {
      console.log("hit");
      this.isActive = !this.isActive;
      if (this.isActive) {
        this.mesh.material.color = new THREE.Color("yellow");
      } else {
        this.mesh.material.color = new THREE.Color("blue");
      }
    }
  }

  checkKeys() {
    if (!this.isActive) return;
    if (this.keys["t"]) {
      this.mesh.scale.x *= 1.1;
    }
    if (this.keys["g"]) {
      this.mesh.scale.x *= 0.9;
    }
  }

  updatePosition(x, y, z) {
    // copy the current mesh position into the this.startPosition vector
    this.startPosition.copy(this.mesh.position);
    // set the end position according to the X, Y and Z values passed into this function
    this.endPosition.set(x, y, z);
    // set the start time to be the current time
    this.startTime = Date.now();
  }

  interpolatePosition() {
    // interpolate the position
    let lerpValue = (Date.now() - this.startTime) / 500;
    if (lerpValue > 1) lerpValue = 1;

    this.mesh.position.lerpVectors(
      this.startPosition,
      this.endPosition,
      lerpValue
    );
  }

  update() {
    this.frameCount++;

    // try uncommenting this to see the current key presses
    // console.log(this.keys);
    this.checkKeys();

    this.interpolatePosition();
  }
}
