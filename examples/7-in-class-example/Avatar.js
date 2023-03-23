import * as THREE from "three";

export class Avatar {
  constructor(name, color, x, y, z, gltfFile, audioStream) {}

  updatePosition(x, y, z) {}

  updateRotation() {}

  triggerAnimation() {}

  triggerSounds() {}

  leave() {
    // cleanup and remove the avatar
  }
}
