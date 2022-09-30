import TOKEN from "../config/config.js";

let min = 0;
let sec = 0;
let sec2 = 0;
let time = `00:00`;
let switcher = false;

// Create WebSocket connection.
const connect = (ipPort, clientName) => {
  const socket = new WebSocket(ipPort, [TOKEN, clientName]);
  const switcherInterval = setInterval(sendSwticher, 500);
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
    socket.send(`${switcher}, ${time}`);
    // console.log(time);
  }
};

connect("ws://localhost:3000", "Client3");

//client time
const clearClockInterval = () => {
  const killInterval = setInterval(() => {
    if (switcher == false) {
      sec = 0;
      sec2 = 0;
      min = 0;
      time = `${min > 6 ? "" : 0}${min}:${sec2}${sec}`;
      clearInterval(killInterval);
    }
  }, 100);
};

setInterval(() => {
  if (switcher == true) {
    clearClockInterval();
    sec++;
    if (sec > 9) {
      sec = 0;
      sec2++;
    }
    if (sec2 > 5) {
      sec2 = 0;
      sec = 0;
      min++;
    }
    time = `${min > 6 ? "" : 0}${min}:${sec2}${sec}`;
  }
}, 1000);

window.changeSwitcher = function () {
  switcher == false ? (switcher = true) : (switcher = false);
  document.getElementById("switch-value").innerHTML = switcher;
};
