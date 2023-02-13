/*
This examples lays out multiple sounds in 3D space.  

* This scene adds an audio listener which picks up the sound in 3D.  As the audio listener moves closer to a sound source, the source becomes louder.  As the audio listener moves further away from the sound source, the source becomes quieter.

* Often, an audio listener is attached to the camera.  In this scene, the audio listener is attached to a 3D object.  In many scenes, the audio listener would be attached to the camera.

* Audio sources in this scene use the 'audioS

Sounds from FreeSound.org
https://freesound.org/people/InspectorJ/sounds/346642/
https://freesound.org/people/stanrams/sounds/323027/
https://freesound.org/people/lextrack/sounds/333916/


*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;
let frameCount = 0;

let audioListener;
let audioListenerMesh;
let audioSources = [];

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

  //
  let gridHelper = new THREE.GridHelper(25, 25);
  scene.add(gridHelper);

  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  // add audio listener and sources
  addSpatialAudio();

  // start loop
  loop();
}

function addSpatialAudio() {
  // first lets add our audio listener.  This is our ear (or microphone) within the 3D space.
  audioListener = new THREE.AudioListener();

  // create a 3D mesh so we can see the location of the audio listener
  // this is not strictly necessary, but can be helpful for debugging
  audioListenerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  audioListenerMesh.add(audioListener);
  audioListenerMesh.position.set(0, 0, 5);
  scene.add(audioListenerMesh);

  // create an audio loader which will load our audio files:
  const audioLoader = new THREE.AudioLoader();

  // then let's add some audio sources
  for (let i = 1; i < 4; i++) {
    let mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 12),
      new THREE.MeshBasicMaterial({ color: "blue" })
    );
    let audioSource = new THREE.PositionalAudio(audioListener);

    // load the audio file into the positional audio source
    audioLoader.load(i + ".mp3", function (buffer) {
      audioSource.setBuffer(buffer);
      audioSource.setDistanceModel("exponential");
      audioSource.setRefDistance(1);
      audioSource.setRolloffFactor(3);
      audioSource.setLoop(true);
      audioSource.play();
    });

    mesh.add(audioSource);
    scene.add(mesh);

    audioSources.push(mesh);
  }
}

function loop() {
  frameCount++;

  for (let i = 0; i < audioSources.length; i++) {
    // here, we'll position each of the audioSources using a spherical coordinate
    // so that the audioSources move as if on a ferris wheel 🎡
    let position = new THREE.Spherical(
      5,
      i * ((Math.PI * 2) / audioSources.length) + frameCount / 100,
      0
    );

    // set the position using setFromSpherical, which converts from spherical coordinates to
    // Euclidean (XYZ) coordinates
    audioSources[i].position.setFromSpherical(position);
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();
