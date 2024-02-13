/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getArtworkData } from "./getArtworkData.js";

let scene, camera, renderer;
let imageDisplays = [];


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

  loop();

  // call our function to get and display images from an API
  getDataAndDisplay();
}
init();


// this function gets data from the API and then adds new "MyImageDisplay" objects to the scene
// it is a special "asynchronous" function, which means it will wait for the data to be ready before continuing
async function getDataAndDisplay() {
  let artworkData = await getArtworkData("Brooklyn");

  console.log(artworkData);

  for (let i = 0; i < artworkData.length; i++) {
    // first we get the URL of the artwork
    let image_id = artworkData[i].data.image_id; 
    let imageUrl = "https://www.artic.edu/iiif/2/" + image_id + "/full/843,/0/default.jpg";

    // then we create a new MyImageDisplay object and pass in the scene and the URL
    let imageDisplay = new MyImageDisplay(scene,imageUrl);

    // then we set the location of the display
    imageDisplay.setPosition(i*2, 0, 0); // arrange them in a line

    // finally, we add the imageDisplay to an array so we can acces it in our draw loop
    imageDisplays.push(imageDisplay);
  }
}


// our draw loop
function loop() {
  // do something to each image display
  for (let i = 0; i < imageDisplays.length; i++) {
    imageDisplays[i].doAction(0.01);
  }
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);
  // ask our window to draw the next frame when it's ready
  window.requestAnimationFrame(loop); 
}






// here we're using a class to encapsulate all of the code related to displaying an image
class MyImageDisplay {
  constructor(scene, imageUrl) {
    // load the image texture from the provided URL
    let imageTexture = new THREE.TextureLoader().load(imageUrl);

    // create geometry and material with texture
    let geo = new THREE.BoxGeometry(1, 1, 1);
    let mat = new THREE.MeshBasicMaterial({ map: imageTexture });
    let mesh = new THREE.Mesh(geo, mat);

    // save the mesh to 'this' object so we can access it elsewhere in the class
    this.mesh = mesh;

    // add it to the scene add add a position
    scene.add(mesh);
  }

  // a method which sets the position of the mesh
  setPosition(x, y, z) {
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
  }

  // a method which does something to the mesh
  doAction(amount) {
    this.mesh.rotateX(amount);
    this.mesh.rotateY(amount);
    this.mesh.rotateZ(amount);
  }
}
