let myVideo;
let otherVideo;
let liveMediaConnection;

function setup() {
  createCanvas(1280, 480);
  liveMediaConnection = new p5LiveMedia(this, null, null, "my-cool-room");
  liveMediaConnection.on("stream", gotStream);
  myVideo = createCapture(VIDEO, gotLocalMediaStream);
  myVideo.muted = true;
  myVideo.hide();
}

function gotLocalMediaStream (stream) {
  console.log("got local stream!");
  liveMediaConnection.addStream(stream, "CAPTURE");
};

// We got a new stream!
function gotStream(stream, id) {
  console.log('got remote stream!');
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id and id are the same and unique identifiers
  otherVideo.hide();
}

function draw() {
  background(220);
  stroke(255);
  strokeWeight(2);
  textSize(24);
  
  if (myVideo != null) {
    image(myVideo, 0, 0, width / 2, height);
    text("My Video", 30, 30);
  }

  if (otherVideo != null) {
    image(otherVideo, width / 2, 0, width / 2, height);
    text("Their Video", width / 2 + 30, 30);
  }
}
