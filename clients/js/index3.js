import TOKEN from "../config/config.js";
// Create WebSocket connection.

const connect = (ipPort, clientName) => {
  const socket = new WebSocket(ipPort, [TOKEN, clientName]);
  const switcherInterval = setInterval(sendSwticher, 100);
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
    const reconnectInterval = setInterval(() => {
      socket.close();
      clearInterval(switcherInterval);
      clearInterval(reconnectInterval);
      connect("ws://localhost:3000", "Client3");
    }, 1000);
  });

  window.sendMessage = function () {
    socket.send("Hello From Client3!");
  };

  function sendSwticher() {
    socket.send(switcher);
  }
};

connect("ws://localhost:3000", "Client3");

let switcher = false;

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
