import TOKEN from "../config/config.js";
let reviept;
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000", TOKEN);
console.log(socket);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from ", event.data);
});

socket.addEventListener("close", (event) => {
  console.log("Disconnected from server");
});

window.sendMessage = function () {
  socket.send("Hello From Client2!");
};

let switcher = false;

setInterval(() => {
  console.log(socket.readyState);
  socket.send(switcher);
}, 200);
