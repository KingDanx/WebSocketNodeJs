import TOKEN from "../config/config.js";

const socket = new WebSocket("ws://localhost:3000", [TOKEN, "App"]);

// Connection opened
socket.addEventListener("open", function (event) {
  console.log("Connected to WS Server");
  socket.send("App Connected");
});

let serverInfo;
let client1info;
let client2info;
// Listen for messages
socket.addEventListener("message", async function (event) {
  serverInfo = event.data.split(", ");
  serverInfo = {
    client: serverInfo[0],
    value: serverInfo[1] == "true",
  };
  serverInfo.client == "Client1"
    ? (client1info = { client: "Client1", value: serverInfo.value })
    : (client2info = { client: "Client2", value: serverInfo.value });

  let client1 = document.getElementById("client1");
  let client2 = document.getElementById("client2");
  console.log(client1info);
  console.log(client2info);
  client1info.client == "Client1" && client1info.value == true
    ? (client1.style.background = "green")
    : (client1.style.background = "red");
  client2info.client == "Client2" && client2info.value == true
    ? (client2.style.background = "green")
    : (client2.style.background = "red");
});

//clock section
let clock = document.getElementById("clock");
let min = 0;
let sec = 0;
let sec2 = 0;

setInterval(() => {
  if (client1info.value == true && client2info.value == true) {
    sec++;
    if (sec > 9) {
      sec2++;
      sec = 0;
    }
    if (sec2 >= 6) {
      min++;
      sec2 = 0;
      sec = 0;
    }
  } else {
    min = 0;
    sec = 0;
    sec2 = 0;
  }

  clock.innerHTML = `${min <= 9 ? 0 : ""}${min}:${sec2}${sec}`;
}, 1000);
