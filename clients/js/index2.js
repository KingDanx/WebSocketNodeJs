import TOKEN from "../config/config.js";
// Create WebSocket connection.

const socket = new WebSocket("ws://localhost:3000", [TOKEN, "Client2"], {
  reconnectInterval: 3000,
});

console.log(socket.reconnectInterval);

const connect = () => {
  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
    console.log(socket.readyState);
  });

  // Listen for messages
  socket.addEventListener("message", function (event) {
    console.log(event.data);
  });

  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    connect();
    console.log(socket.readyState);
  });

  window.sendMessage = function () {
    socket.send("Hello From Client2!");
  };

  setInterval(() => {
    socket.send(switcher);
  }, 500);
};

connect();

let switcher = false;

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
