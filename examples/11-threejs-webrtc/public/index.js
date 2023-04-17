import { MyScene } from "./scene.js";

// socket.io
let mySocket;

// array of connected peers
let peers = {};

// Variable to store our three.js scene:
let myScene;

// Our local media stream (i.e. webcam and microphone stream)
let localMediaStream = null;

////////////////////////////////////////////////////////////////////////////////
// Start-Up Sequence:
////////////////////////////////////////////////////////////////////////////////

window.onload = async () => {
  console.log("Window loaded.");

  // first get user media
  try {
    localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch (err) {
    console.warn("Failed to get user media!");
    console.warn(err);
  }

  createLocalVideoElement();

  //  create the threejs scene
  console.log("Creating three.js scene...");
  myScene = new MyScene();

  // finally create the websocket connection
  establishWebsocketConnection();

  // start sending position data to the server
  setInterval(() => {
    mySocket.emit("move", myScene.getPlayerPosition());
  }, 200);
};

////////////////////////////////////////////////////////////////////////////////
// Socket.io Connections
////////////////////////////////////////////////////////////////////////////////

// establishes socket connection
function establishWebsocketConnection() {
  mySocket = io();

  mySocket.on("connect", () => {
    console.log("My socket ID is", mySocket.id);
  });

  mySocket.on("introduction", (peerInfo) => {
    for (let theirId in peerInfo) {
      console.log("Adding client with id " + theirId);
      peers[theirId] = {};

      let pc = createPeerConnection(theirId, true);
      peers[theirId].peerConnection = pc;

      addPeerMediaElements(theirId);
      myScene.addPeerAvatar(theirId);
    }
  });

  // when a new user has entered the server
  mySocket.on("newPeerConnected", (theirId) => {
    if (theirId != mySocket.id && !(theirId in peers)) {
      console.log("A new user connected with the ID: " + theirId);

      console.log("Adding client with id " + theirId);
      peers[theirId] = {};
      addPeerMediaElements(theirId);
      myScene.addPeerAvatar(theirId);
    }
  });

  mySocket.on("peerDisconnected", (_id) => {
    // Update the data from the server

    if (_id != mySocket.id) {
      console.log("A user disconnected with the id: " + _id);
      myScene.removePeerAvatar(_id);
      removePeerMediaElements(_id);
      delete peers[_id];
    }
  });

  mySocket.on("signal", (to, from, data) => {
    // to should be us
    if (to != mySocket.id) {
      console.log("Socket IDs don't match");
    }

    // Look for the right peer connection
    let peer = peers[from];
    if (peer.peerConnection) {
      peer.peerConnection.signal(data);
    } else {
      // Let's create it then, we won't be the "initiator"
      let peerConnection = createPeerConnection(from, false);

      peers[from].peerConnection = peerConnection;

      // forward the new simplepeer that signal
      peerConnection.signal(data);
    }
  });

  // Update when one of the users moves in space
  mySocket.on("peers", (peerInfoFromServer) => {
    // remove my info from the incoming data
    delete peerInfoFromServer[mySocket.id];
    myScene.updatePeerAvatars(peerInfoFromServer);
  });
}

////////////////////////////////////////////////////////////////////////////////
// SimplePeer WebRTC Connections
////////////////////////////////////////////////////////////////////////////////

// this function sets up a peer connection and corresponding DOM elements for a specific client
function createPeerConnection(theirSocketId, isInitiator = false) {
  console.log("Connecting to peer with ID", theirSocketId);
  console.log("initiating?", isInitiator);

  let peerConnection = new SimplePeer({ initiator: isInitiator });
  // simplepeer generates signals which need to be sent across socket
  peerConnection.on("signal", (data) => {
    mySocket.emit("signal", theirSocketId, mySocket.id, data);
  });

  // When we have a connection, send our stream
  peerConnection.on("connect", () => {
    peerConnection.addStream(localMediaStream);
  });

  // Stream coming in to us
  peerConnection.on("stream", (stream) => {
    updatePeerMediaElements(theirSocketId, stream);
  });

  peerConnection.on("close", () => {
    console.log("Got close event");
  });

  peerConnection.on("error", (err) => {
    console.log(err);
  });

  return peerConnection;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Media DOM Elements

function createLocalVideoElement() {
  const videoElement = document.createElement("video");
  videoElement.id = "local_video";
  videoElement.autoplay = true;
  videoElement.width = 100;

  if (localMediaStream) {
    let videoStream = new MediaStream([localMediaStream.getVideoTracks()[0]]);

    videoElement.srcObject = videoStream;
  }
  document.body.appendChild(videoElement);
}

function addPeerMediaElements(_id) {
  console.log("Adding media element for peer with id: " + _id);

  const videoElement = document.createElement("video");
  videoElement.id = _id + "_video";
  videoElement.autoplay = true;
  // videoElement.style = "visibility: hidden;";

  document.body.appendChild(videoElement);

  // create audio element for peer
  let audioEl = document.createElement("audio");
  audioEl.setAttribute("id", _id + "_audio");
  audioEl.controls = "controls";
  audioEl.volume = 1;
  document.body.appendChild(audioEl);

  audioEl.addEventListener("loadeddata", () => {
    audioEl.play();
  });
}

function updatePeerMediaElements(_id, stream) {
  console.log("Updatings media element for peer with id: " + _id);

  let videoStream = new MediaStream([stream.getVideoTracks()[0]]);
  let audioStream = new MediaStream([stream.getAudioTracks()[0]]);

  const videoElement = document.getElementById(_id + "_video");
  videoElement.srcObject = videoStream;

  let audioEl = document.getElementById(_id + "_audio");
  audioEl.srcObject = audioStream;
}

function removePeerMediaElements(_id) {
  console.log("Removing media element for peer with id: " + _id);

  let videoEl = document.getElementById(_id + "_video");
  if (videoEl != null) {
    videoEl.remove();
  }
}
