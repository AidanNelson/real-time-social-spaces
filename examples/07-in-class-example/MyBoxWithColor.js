import * as THREE from "three";

export class MyBoxWithColor {
  constructor(r, b, g, x, y, z, scene) {
    let geo = new THREE.BoxGeometry(2, 2, 2);
    let mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });

    this.mesh = new THREE.Mesh(geo, mat);
    this.speed = Math.random();
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);
  }

  changeColor(r, g, b) {
    this.mesh.material.color.r = r;
    this.mesh.material.color.g = g;
    this.mesh.material.color.b = b;
  }

  update() {
    this.mesh.position.y += this.speed / 50;
  }
}
