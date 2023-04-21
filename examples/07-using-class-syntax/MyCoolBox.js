import * as THREE from "three";

export class MyCoolBox {
  // the constructor is a special function which is called when we create a new
  // 'instance' of this class
  constructor(x, y, z, scene) {
    let geo = new THREE.BoxGeometry(2, 2, 2);
    let mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    });

    // we will save our mesh by using 'this dot' syntax
    // this variable is now accessible throughout this class
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);

    scene.add(this.mesh);

    this.frameCount = 0;
  }

  update() {
    this.frameCount++;

    this.mesh.rotateX(0.01);
    this.mesh.rotateZ(0.01);
  }
}
