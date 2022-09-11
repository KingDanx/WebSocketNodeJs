import TOKEN from "../config/config.js";
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000", [TOKEN, "Client2"]);

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
  socket.send(switcher);
}, 500);

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
