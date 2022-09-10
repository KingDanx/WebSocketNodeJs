import TOKEN from "../config/config.js";

console.log(TOKEN);

const socket = new WebSocket("ws://localhost:3000", TOKEN);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
  socket.send("App Connected");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from", event.data);
});
