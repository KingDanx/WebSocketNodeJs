import TOKEN from "../config/config.js";
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000", [TOKEN, "Client1"]);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from server ", event.data);
});

//Listen for close
socket.addEventListener("close", (event) => {
  console.log("Disconnected from ", event);
});

window.sendMessage = function () {
  socket.send("Hello From Client1!");

  fetch("http://localhost:3000/").then((data) =>
    data.text().then((text) => console.log(text))
  );
};

window.sendCustom = function () {
  let message = document.getElementById("sendCustom").value;
  console.log(message);
  socket.send(message);
};

let switcher = false;

setInterval(() => {
  socket.send(switcher);
}, 200);

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
