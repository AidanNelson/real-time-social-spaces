/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;

let texLoader = new THREE.TextureLoader();

let imageBoxes = [];

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
  getDataAndDisplay("brooklyn");
}

function loop() {
  for (let i = 0; i < imageBoxes.length; i++) {
    imageBoxes[i].spin(0.01);
  }
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();

// here we're using a class to encapsulate all of the code related to displaying an image and
// spinning it around.
class MyImageDisplay {
  constructor(url) {
    console.log("Adding image to the space", url);
    let imageTexture = texLoader.load(url);
    console.log(imageTexture);

    // create geometry and material with texture
    let geo = new THREE.BoxGeometry(1, 1, 1);
    let mat = new THREE.MeshBasicMaterial({ map: imageTexture });
    let mesh = new THREE.Mesh(geo, mat);

    // save the mesh to "THIS" object so we can access it elsewhere in the class
    this.mesh = mesh;

    // add it to the scene add add a position
    scene.add(mesh);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
  }

  spin(amount) {
    this.mesh.rotateX(amount);
    this.mesh.rotateY(amount);
    this.mesh.rotateZ(amount);
  }
}

// this function is calling an API (the Art Institute of Chicago's web api)
// to get image URLs then calling the displayImage function with those URLs
function getDataAndDisplay(query) {
  let url =
    "https://api.artic.edu/api/v1/artworks/search?q=" +
    query +
    "&query[term][is_public_domain]=true";

  let image_id = "47c94f35-2c05-9eb2-4c3f-6c841724a0a1";
  let imageUrl =
    "https://www.artic.edu/iiif/2/" + image_id + "/full/843,/0/default.jpg";
  console.log(imageUrl);
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      let data = json.data;
      for (let i = 0; i < data.length; i++) {
        let itemInfoUrl = data[i].api_link;
        fetch(itemInfoUrl)
          .then((res) => res.json())
          .then((json) => {
            let image_id = json.data.image_id;
            let imageUrl =
              "https://www.artic.edu/iiif/2/" +
              image_id +
              "/full/843,/0/default.jpg";
            // displayImage(imageUrl);
            imageBoxes.push(new MyImageDisplay(imageUrl));
          });
      }
    });
}
