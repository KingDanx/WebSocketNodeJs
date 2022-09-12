import TOKEN from "../config/config.js";

const connect = () => {
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
  socket.addEventListener("message", function (event) {
    //split incoming message into an array
    //console.log(event.data);
    serverInfo = event.data.split(", ");
    serverInfo = {
      client: serverInfo[0],
      value: serverInfo[1] == "true",
    };
    serverInfo.client == "Client1"
      ? (client1info = { client: "Client1", value: serverInfo.value })
      : (client2info = { client: "Client2", value: serverInfo.value });

    //style elements
    let client1 = document.getElementById("client1");
    let client2 = document.getElementById("client2");
    client1info.client == "Client1" && client1info.value == true
      ? (client1.style.background = "green")
      : (client1.style.background = "red");
    client2info.client == "Client2" && client2info.value == true
      ? (client2.style.background = "green")
      : (client2.style.background = "red");
  });

  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    setTimeout(() => {
      socket.close();
      clearInterval(clockInterval);
      connect();
    }, 2500);
  });

  //clock section
  let clock = document.getElementById("clock");
  let min = 0;
  let sec = 0;
  let sec2 = 0;

  const clockInterval = setInterval(() => {
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
};

connect();
