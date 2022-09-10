import TOKEN from "../config/config.js";

const socket = new WebSocket("ws://localhost:3000", [TOKEN, "App"]);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
  socket.send("App Connected");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from server:", event.data);
});
