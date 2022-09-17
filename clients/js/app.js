import TOKEN from "../config/config.js";
import { generateElement } from "./generateElement.js";

const connect = () => {
  const socket = new WebSocket("ws://localhost:3000", [TOKEN, "App"]);

  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
    socket.send("App Connected");
  });

  let clientsArray = [];
  let updateClientData;
  let serverInfo;
  let client1info;
  let client2info;

  // Listen for messages
  socket.addEventListener("message", function (event) {
    //Check for connected clients update.
    if (event.data.includes("clientsArr")) {
      updateClientData = event.data.split(", ");
      console.log(updateClientData);
      updateClientData.shift();
      console.log(updateClientData);
      if (updateClientData != clientsArray) {
        clientsArray = updateClientData;
        clientsArray.map((el, i) => {
          !document.getElementById(`${el}`)
            ? generateElement(undefined, undefined, `${el}`, undefined, `${el}`)
            : null;
        });
        //^^Need to sort array so it always comes out the same ^^
      }
    }

    //split incoming message into an array
    serverInfo = event.data.split(", ");
    serverInfo = {
      client: serverInfo[0],
      value: serverInfo[1] == "true", //checking string value to return true or false bool
    };
    serverInfo.client == "Client1"
      ? (client1info = { client: "Client1", value: serverInfo.value })
      : (client2info = { client: "Client2", value: serverInfo.value });

    //style elements
    const styleClient = (
      clientInfo = client1info,
      clientName = "Client1",
      clientHTMLid = "client1",
      attribute = "background",
      primaryValue = "green",
      altValue = "red"
    ) => {
      let client = document.getElementById(clientHTMLid);
      clientInfo.client == clientName && clientInfo.value == true
        ? (client.style[attribute] = primaryValue)
        : (client.style[attribute] = altValue);
    };

    styleClient();
    styleClient(client2info, "Client2", "client2");

    //console.log(event.data);
  });

  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    const reconnectInterval = setInterval(() => {
      socket.close();
      clearInterval(clockInterval);
      clearInterval(reconnectInterval);
      connect();
    }, 1000);
  });

  //clock section
  let clock = document.getElementById("clock");
  let min = 0;
  let sec = 0;
  let sec2 = 0;

  const clockInterval = setInterval(() => {
    if (client1info.value == true && client2info.value == true) {
      clearClockInterval();
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
    }
    clock.innerHTML = `${min <= 9 ? 0 : ""}${min}:${sec2}${sec}`;
  }, 1000);

  const clearClockInterval = () => {
    const killInterval = setInterval(() => {
      if (client1info.value == false || client2info.value == false) {
        min = 0;
        sec2 = 0;
        sec = 0;
        clock.innerHTML = `${min <= 9 ? 0 : ""}${min}:${sec2}${sec}`;
        clearInterval(killInterval);
      }
    }, 100);
  };
};

connect();
