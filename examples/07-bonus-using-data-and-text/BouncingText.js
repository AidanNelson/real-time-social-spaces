// this class creates a bouncing text object
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export class BouncingText {
  // the constructor is a special function which is called when we create a new
  // 'instance' of this class
  constructor(x, y, z, text, scene) {
    this.position = new THREE.Vector3(x, y, z);
    this.text = text;
    this.scene = scene;

    const loader = new FontLoader();

    this.frameCount = 0;
    this.bounceSpeed = Math.random() * 100;
    this.bounceHeight = Math.random() * 10;

    // load the font, then save it into our class,
    loader.load("./VT323_Regular.json", (font) => {
      this.font = font;
      this.addTextGeometry();
    });
  }

  addTextGeometry() {
    let geo = new TextGeometry(this.text, {
      font: this.font,
      size: 0.5,
      height: 0.25,
      curveSegments: 12,
    });
    let mat = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);

    this.mesh.position.copy(this.position); // copy the position vector we created in the constructor
  }

  update() {
    this.frameCount++;
    // animate our mesh if it exists yet
    if (this.mesh) {
      this.mesh.position.y =
        Math.sin(this.frameCount / this.bounceSpeed) * this.bounceHeight;
    }
  }
}
