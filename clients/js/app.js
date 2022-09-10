import TOKEN from "../config/config.js";

const socket = new WebSocket("ws://localhost:3000", [TOKEN, "App"]);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
  socket.send("App Connected");
});

let serverInfo;
// Listen for messages
socket.addEventListener("message", function (event) {
  //console.log("Message from server:", event.data);
  serverInfo = event.data.split(", ");
  serverInfo = {
    client: serverInfo[0],
    value: serverInfo[1] == "true",
  };
  console.log(serverInfo);
});

let client1 = document.getElementById("client1");
let client2 = document.getElementById("client2");
let clock = document.getElementById("clock");
let min = 9;
let sec = 0;
let sec2 = 5;

setInterval(() => {
  if (serverInfo.value == true) {
    sec++;
  }

  if (sec > 9) {
    sec2++;
    sec = 0;
  }
  if (sec2 >= 6) {
    min++;
    sec2 = 0;
    sec = 0;
  }
  clock.innerHTML = `${min <= 9 ? 0 : ""}${min}:${sec2}${sec}`;
}, 1000);
