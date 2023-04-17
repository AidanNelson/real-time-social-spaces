import * as THREE from "three";
import { FirstPersonControls } from "./libraries/firstPersonControls.js";

export class MyScene {
  constructor() {
    this.avatars = {};

    // create a scene in which all other objects will exist
    this.scene = new THREE.Scene();

    // create a camera and position it in space
    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5; // place the camera in space
    this.camera.position.y = 5;
    this.camera.lookAt(0, 0, 0);

    // the renderer will actually show the camera view within our <canvas>
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // add shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // add orbit controls
    this.controls = new FirstPersonControls(
      this.scene,
      this.camera,
      this.renderer
    );

    this.setupEnvironment();

    this.frameCount = 0;

    this.loop();
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Lighting 💡

  setupEnvironment() {
    this.scene.background = new THREE.Color(0xffaabb);

    this.scene.add(new THREE.GridHelper(100, 100));

    //add a light
    let myColor = new THREE.Color(0xffaabb);
    let ambientLight = new THREE.AmbientLight(myColor, 0.5);
    this.scene.add(ambientLight);

    // add a directional light
    let myDirectionalLight = new THREE.DirectionalLight(myColor, 0.85);
    myDirectionalLight.position.set(-5, 3, -5);
    myDirectionalLight.lookAt(0, 0, 0);
    myDirectionalLight.castShadow = true;
    this.scene.add(myDirectionalLight);

    // add a ground
    let groundGeo = new THREE.BoxGeometry(100, 0.1, 100);
    let groundMat = new THREE.MeshPhongMaterial({ color: "blue" });
    let ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    // this.scene.add(ground);
  }
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Peers 👫

  addPeerAvatar(id) {
    console.log("Adding peer avatar to 3D scene.");
    this.avatars[id] = {};

    let videoElement = document.getElementById(id + "_video");
    let videoTexture = new THREE.VideoTexture(videoElement);

    let videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      overdraw: true,
      side: THREE.DoubleSide,
    });
    let otherMat = new THREE.MeshNormalMaterial();

    let head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      otherMat,
      videoMaterial,
    ]);

    // set position of head before adding to parent object
    head.position.set(0, 0, 0);

    // https://threejs.org/docs/index.html#api/en/objects/Group
    var group = new THREE.Group();
    group.add(head);

    // add group to scene
    this.scene.add(group);

    this.avatars[id].group = group;
  }

  removePeerAvatar(id) {
    console.log("Removing peer avatar from 3D scene.");
    this.scene.remove(this.avatars[id].group);
    delete this.avatars[id];
  }

  updatePeerAvatars(peerInfoFromServer) {
    for (let id in peerInfoFromServer) {
      if (this.avatars[id]) {
        let pos = peerInfoFromServer[id].position;
        let rot = peerInfoFromServer[id].rotation;

        this.avatars[id].group.position.set(pos[0], pos[1], pos[2]);
        this.avatars[id].group.quaternion.set(rot[0], rot[1], rot[2], rot[3]);
      }
    }
  }

  updateClientVolumes() {
    for (let id in this.avatars) {
      let audioEl = document.getElementById(id + "_audio");
      if (audioEl && this.avatars[id].group) {
        let distSquared = this.camera.position.distanceToSquared(
          this.avatars[id].group.position
        );

        if (distSquared > 500) {
          audioEl.volume = 0;
        } else {
          // https://discourse.threejs.org/t/positionalaudio-setmediastreamsource-with-webrtc-question-not-hearing-any-sound/14301/29
          let volume = Math.min(1, 10 / distSquared);
          audioEl.volume = volume;
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Interaction 🤾‍♀️

  getPlayerPosition() {
    return [
      [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      [
        this.camera.quaternion._x,
        this.camera.quaternion._y,
        this.camera.quaternion._z,
        this.camera.quaternion._w,
      ],
    ];
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Rendering 🎥

  loop() {
    this.frameCount++;

    this.controls.update();

    // update client volumes every 25 frames
    if (this.frameCount % 25 === 0) {
      this.updateClientVolumes();
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.loop());
  }
}
