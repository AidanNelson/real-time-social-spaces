// the express package will run our server
const express = require("express");
const app = express();
app.use(express.static("public")); // this line tells the express app to 'serve' the public folder to clients

// HTTP will expose our server to the web
const http = require("http").createServer(app);

// start our server listening on port 8080 for now (this is standard for HTTP connections)
const server = app.listen(8080);
console.log("Server is running on http://localhost:8080");

/////SOCKET.IO///////
const io = require("socket.io")().listen(server);


io.on("connection", onConnection);


function onConnection(socket){
  console.log('Someone connected to our websocket server!');
  console.log('This is their ID: ', socket.id);

  socket.on('msg', onMessage);
}

function onMessage(msg){
  console.log('We received a message from one of the sockets:');
  console.log(msg);
  io.emit('msg', msg);
}