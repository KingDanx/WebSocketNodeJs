import TOKEN from "../config/config.js";
import { generateElement, isDefined } from "./generateElement.js";

const connect = () => {
  const socket = new WebSocket("ws://localhost:3000", [TOKEN, "App"]);

  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
    socket.send("App Connected");
  });

  let clientsArray = [];
  let clientInfoArray = [];
  let updateClientData;
  let serverInfo;
  let client1info;
  let client2info;
  let client3info;
  let client4info;

  // Listen for messages
  socket.addEventListener("message", function (event) {
    //Check for connected clients update.
    if (event.data.includes("clientsArr")) {
      updateClientData = event.data.split(", ");
      updateClientData.shift();
      updateClientData.sort();
      if (updateClientData != clientsArray) {
        clientsArray.map((el, i) => {
          isDefined(document.getElementById(`${el}-gen`))
            ? document.getElementById(`${el}-gen`).remove()
            : null;
        });
        clientInfoArray = [];
        clientsArray = updateClientData;
        console.log(clientsArray);
        clientsArray.map((el) => {
          clientInfoArray.push({
            client: el,
            value: "false",
          });
        });

        clientsArray.map((el, i) => {
          !isDefined(document.getElementById(`${el}-gen`))
            ? generateElement(
                document.getElementById("client-grid"),
                undefined,
                `${el}-gen-parent`,
                undefined
              )
            : null;
          !isDefined(document.getElementById(`${el}-gen`))
            ? generateElement(
                document.getElementById(`${el}-gen-parent`),
                undefined,
                `${el}-gen`,
                undefined,
                `${el}`
              )
            : null;
        });
      }
    }

    //Check for client data
    serverInfo = event.data.split(", ");
    serverInfo = {
      client: serverInfo[0],
      value: serverInfo[1] == "true", //checking string value to return true or false bool
    };

    //stores clients' info for styling
    const clinetValues = () => {
      clientInfoArray.map((el) => {
        el.client == serverInfo.client ? (el.value = serverInfo.value) : null;
      });
    };

    clinetValues();

    clientInfoArray.map((el, i) => {
      styleClient(el, `${el.client}-gen`);
    });

    //style elements
    function styleClient(
      clientInfo = client1info,
      clientHTMLid = "client1",
      attribute = "background",
      primaryValue = "green",
      altValue = "red"
    ) {
      let client = document.getElementById(clientHTMLid);
      if (!clientInfo) return;
      clientInfo.value == true
        ? (client.style[attribute] = primaryValue)
        : (client.style[attribute] = altValue);
    }
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
    if (client1info && client2info) {
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
    }
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
