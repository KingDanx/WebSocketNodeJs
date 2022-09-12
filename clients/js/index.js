import TOKEN from "../config/config.js";
// Create WebSocket connection.

const connect = () => {
  const socket = new WebSocket("ws://localhost:3000", [TOKEN, "Client1"]);
  const switcherInterval = setInterval(sendSwticher, 500);
  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
  });
  // Listen for messages
  socket.addEventListener("message", function (event) {
    console.log(event.data);
  });

  //Listen for close
  socket.addEventListener("close", (event) => {
    console.log("Disconnected from ", event);
    setTimeout(() => {
      socket.close();
      clearInterval(switcherInterval);
      connect();
    }, 2500);
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

  function sendSwticher() {
    socket.send(switcher);
  }
};

connect();

let switcher = false;

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
