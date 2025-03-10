import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const ARC_SEGMENTS = 200;

// points along an arc
const DEFAULT_POINTS = [
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(10, 20, -10),
  new THREE.Vector3(40, 30, -20),
  new THREE.Vector3(0, 10, -30),
];

export class EditableCameraPathTool {
  constructor(camera, scene, renderer, initialPoints, targetPosition) {
    this.initialPoints = initialPoints || DEFAULT_POINTS;

    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    // camera target visualizer
    this.cameraTarget = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.cameraTarget.layers.set(2);
    if (targetPosition){
      this.cameraTarget.position.copy(targetPosition);
    }
    this.scene.add(this.cameraTarget);

    this.editMode = false;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.onUpPosition = new THREE.Vector2();
    this.onDownPosition = new THREE.Vector2();

    //
    this.point = new THREE.Vector3();

    // add spline helper objects
    this.splineHelperObjects = [];
    for (let i = 0; i < this.initialPoints.length; i++) {
      const object = this.createSplineHelperObject(this.initialPoints[i]);
      object.layers.set(2);
      this.scene.add(object);
      this.splineHelperObjects.push(object);
    }

    // create initial spline
    this.positions = [];
    for (let i = 0; i < this.splineHelperObjects.length; i++) {
      this.positions.push(this.splineHelperObjects[i].position);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3)
    );

    this.curve = new THREE.CatmullRomCurve3(this.positions);
    this.curve.curveType = "catmullrom";
    this.curve.mesh = new THREE.Line(
      geometry.clone(),
      new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
      })
    );
    this.curve.mesh.castShadow = true;
    this.curve.mesh.layers.set(2);
    this.scene.add(this.curve.mesh);

    this.updateSplineOutline();

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    console.log(this.controls);
    this.controls.enabled = this.editMode;

    this.transformControl = new TransformControls(camera, renderer.domElement);
    this.transformControl.addEventListener("dragging-changed", (ev) => {
      this.controls.enabled = !ev.value;
    });
    this.transformControl.enabled = this.editMode;

    this.transformControlHelper = this.transformControl.getHelper();
    this.transformControlHelper.layers.set(2);

    this.scene.add(this.transformControlHelper);

    this.transformControl.addEventListener("objectChange", () => {
      this.updateSplineOutline();
    });

    document.addEventListener("pointerdown", (ev) => this.onPointerDown(ev));
    document.addEventListener("pointerup", (ev) => this.onPointerUp(ev));
    document.addEventListener("pointermove", (ev) => this.onPointerMove(ev));

    this.cameraPathPosition = 0;

    // then add our 'wheel' event listener
    renderer.domElement.addEventListener("wheel", (e) => {
      if (this.editMode) return; // if we're actively editing the path, don't bother moving the camera
      this.cameraPathPosition += e.deltaY * 0.0001;

      // constrain this value between 0 and 1, because that is what the following function expects
      this.cameraPathPosition = Math.max(
        0,
        Math.min(1, this.cameraPathPosition)
      );

      // copy the cameraPath position to the camera
      this.camera.position.copy(this.curve.getPointAt(this.cameraPathPosition));

      // look at some interesting point in the scene
      this.camera.lookAt(this.cameraTarget.position);
    });

    this.keys = {};
    document.addEventListener("keydown", (ev) => {
      this.keys[ev.key] = true;

      if (this.keys["Shift"] && this.keys["E"]) {
        this.setEditMode(!this.editMode);
      }

      if (this.keys["p"]){
        let str = "[";
        for (let i = 0; i < this.splineHelperObjects.length; i++){
          str += `new THREE.Vector3(${this.splineHelperObjects[i].position.x}, ${this.splineHelperObjects[i].position.y}, ${this.splineHelperObjects[i].position.z}),\n`;
        }
        str += "];";
        console.log("~~~~~~~~~~~~~~~~~~~~~~~\nCameraPath Points:\n")
        console.log(str)
        console.log("\nCamera Target Position:\n")
        

        console.log(`new THREE.Vector3(${this.cameraTarget.position.x}, ${this.cameraTarget.position.y}, ${this.cameraTarget.position.z})`);

      }
      if (ev.key === "=") {
        this.addPoint();
      } else if (ev.key === "-") {
        this.removePoint();
      }
    });
    document.addEventListener("keyup", (ev) => {
      this.keys[ev.key] = false;
    });

    this.setEditMode(false);
  }

  getCurve() {
    return this.curve;
  }

  setEditMode(editMode) {
    console.log("setEditMode", editMode);
    this.editMode = editMode;

    if (this.editMode) {
      this.camera.layers.enable(2);
      this.controls.enabled = true;
      this.transformControl.enabled = true;
    } else {
      this.camera.layers.disable(2);
      this.controls.enabled = false;
      this.transformControl.enabled = false;
    }
  }

  onPointerDown(ev) {
    if (this.editMode === false) return;
    this.onDownPosition.x = ev.clientX;
    this.onDownPosition.y = ev.clientY;
  }

  onPointerUp(ev) {
    if (this.editMode === false) return;
    this.onUpPosition.x = ev.clientX;
    this.onUpPosition.y = ev.clientY;

    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {
      this.transformControl.detach();
    }
  }

  onPointerMove(ev) {
    if (this.editMode === false) return;
    this.pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.layers.set(2);

    const intersects = this.raycaster.intersectObjects(
      [...this.splineHelperObjects, this.cameraTarget],
      false
    );

    if (intersects.length > 0) {
      const object = intersects[0].object;

      if (object !== this.transformControl.object) {
        this.transformControl.attach(object);
      }
    }
  }

  updateSplineOutline() {
    const splineMesh = this.curve.mesh;
    const position = splineMesh.geometry.attributes.position;

    for (let i = 0; i < ARC_SEGMENTS; i++) {
      const t = i / (ARC_SEGMENTS - 1);
      this.curve.getPoint(t, this.point);
      position.setXYZ(i, this.point.x, this.point.y, this.point.z);
    }

    position.needsUpdate = true;
  }
  createSplineHelperObject(position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    const object = new THREE.Mesh(geometry, material);

    if (position) {
      object.position.copy(position);
    } else {
      object.position.x = Math.random() * 100 - 50;
      object.position.y = Math.random() * 60;
      object.position.z = Math.random() * 100 - 50;
    }

    object.castShadow = true;
    object.receiveShadow = true;
    return object;
  }

  addPoint() {
    let obj = this.createSplineHelperObject();
    obj.layers.set(2);
    this.scene.add(obj);
    this.splineHelperObjects.push(obj);

    this.positions.push(obj.position);

    this.updateSplineOutline();
  }

  removePoint() {
    if (this.splineHelperObjects.length <= 2) return;

    const point = this.splineHelperObjects.pop();
    this.positions.pop();

    if (this.transformControl.object === point) this.transformControl.detach();
    this.scene.remove(point);

    this.updateSplineOutline();
  }
}
