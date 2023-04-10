/*
This example connects to a websocket server.

*/

// this  established a connection to our server using 'socket.io' (the websocket library we will be using)

let socket = io();

let chatBox = document.getElementById("chat");

socket.on("msg", (msg) => {
  console.log(
    "Got a message from friend with ID ",
    msg.from,
    "and data:",
    msg.data
  );
  chatBox.innerHTML += msg.data;
});

// when we press a key, send it to the server
document.addEventListener(
  "keyup",
  (ev) => {
    socket.emit("msg", ev.key);
  },
  false
);
