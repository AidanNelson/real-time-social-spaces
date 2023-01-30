let myVideo;

function setup() {
  createCanvas(640, 480);
  myVideo = createCapture(VIDEO);
  myVideo.muted = true; 

  // this hides the HTML <video> element as we're going to be drawing our video to the canvas
  myVideo.hide(); 
}

// try uncommenting one of the following examples to display the video in
// different ways!
function draw() {
  background(100, 100, 255);

  // 0. draw the current frame of the video the canvas using the 'image' function
  // image(myVideo, 0, 0, width, height);

  // 1. position multiple copies of the video using perlin noise
  // for (let i = 0; i < 10; i++){
  //   image(myVideo,noise(i) * width ,noise(i-1) * height,50,50);
  // }

  // 2. draw videos in a grid
  // let gridSize = 4;
  // let xOffset = width / gridSize;
  // let yOffset = height / gridSize;
  // for (let x = 0; x < gridSize; x++){
  //   for (let y = 0; y < gridSize; y++){
  //     image(myVideo, x * xOffset, y * yOffset, xOffset, yOffset);
  //   }
  // }

  // 3. use push / pop to apply transformations before drawing the video frame

  // 3A. translate changes where the 'origin' of the canvas is...
  // push();
  // let offset = Math.sin(frameCount / 100) * 100;
  // translate(offset, offset);
  // image(myVideo, 0, 0, width, height);
  // pop();

  // 3B. rotate spins the canvas around the current origin
  // push();
  // rotate(frameCount / 100);
  // image(myVideo, 0, 0, 320, 240);
  // pop();

  // 3C. scale changes the size of the canvas (and can also be used to reverse the image)
  // push();
  // let bouncingNumber = Math.sin(frameCount / 100);
  // translate(width / 2, 100);
  // scale(bouncingNumber, 1);
  // image(myVideo, 0, 0, 320, 240);
  // pop();

  // 3D. note that the order of transformations matters.  try changing the order of the three transformations below and see what happens!
  // push();
  // translate(100, 100);
  // rotate(frameCount / 100);
  // image(myVideo, 0, 0, 320, 240);
  // pop();

  // 4. Access pixel data directly with get()
  // let gridSize = 10;
  // let xOffset = width / gridSize;
  // let yOffset = height / gridSize;
  // for (let x = 0; x < width; x += xOffset) {
  //   for (let y = 0; y < height; y += yOffset) {
  //     let pixel = myVideo.get(x, y);
  //     push();
  //     fill(pixel);
  //     translate(x, y);
  //     rect(0,0, xOffset, yOffset);
  //     pop();
  //   }
  // }



  // 5. Finally, try using filters!
  // see the rest here: https://p5js.org/reference/#/p5/filter
  // image(myVideo,0,0,width,height);
  // filter(THRESHOLD);
  // filter(GRAY);
  // filter(OPAQUE);
  // filter(INVERT);
  // filter(POSTERIZE, 3);


}
