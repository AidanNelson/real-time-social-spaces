/*
This example pulls data from an API (Application Programming Interface) and arranges it in a 3D environment.

*/
import * as THREE from "three";

let scene, renderer, camera, aspect, textureLoader, wikipediaMeshes;

function init() {
  wikipediaMeshes = [];

  scene = new THREE.Scene();

  textureLoader = new THREE.TextureLoader();

  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  loop();
}

function loadWikipediaData(query) {
  // we can construct our URL using these funky back ticks (`) as a template literal
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch='${query}'
  `;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let pages = data.query.pages;
      console.log(pages);

      for (let pageId in pages) {
        loadWikipediaImages(pageId);
      }
    });
}
loadWikipediaData("dog");

function loadWikipediaImages(pageId) {
  let searchURL = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pageids=${pageId}&pithumbsize=400&format=json&origin=*`;
  fetch(searchURL)
    .then((response) => response.json())
    .then((data) => {
      const imageURL = data.query?.pages[pageId]?.thumbnail?.source;
      console.log(imageURL);
      if (imageURL) {
        addWikipediaLink(imageURL, pageId);
      }
    });
}

function addWikipediaLink(imageURL, pageId) {
  const texture = textureLoader.load(imageURL);

  let geo = new THREE.BoxGeometry(1, 1, 1);
  let mat = new THREE.MeshBasicMaterial({ map: texture });
  let mesh = new THREE.Mesh(geo, mat);

  scene.add(mesh);
  mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0);
  wikipediaMeshes.push(mesh);
}

function loop() {
  for (let mesh of wikipediaMeshes) {
    mesh.rotateX(0.01);
    mesh.rotateY(0.002);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

init();
