import TOKEN from "../config/config.js";
import {
  generateElement,
  isDefined,
  generateMappedElements,
  removeUnusedElements,
} from "./generateElement.js";

const connect = (ipPort, clientName) => {
  const socket = new WebSocket(ipPort, [TOKEN, clientName]);

  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WS Server");
    socket.send("App Connected");
  });

  let clientsArray = [];
  let clientInfoArray = [];
  let updateClientData;
  let serverInfo;

  // Listen for messages
  socket.addEventListener("message", function (event) {
    //Check for connected clients update.
    if (event.data.includes("clientsArr")) {
      updateClientData = event.data.split(", ");
      updateClientData.shift();
      updateClientData.sort();
      if (updateClientData != clientsArray) {
        clientsArray.map((el) => {
          removeUnusedElements(`${el}-gen`, el, updateClientData);
          removeUnusedElements(`${el}-gen-clock`, el, updateClientData);
        });
        clientInfoArray = [];
        clientsArray = updateClientData;
        console.log(clientsArray);

        clientsArray.map((el) => {
          if (clientInfoArray.find((li) => li.client == el) == undefined) {
            clientInfoArray.push({
              client: el,
              value: "false",
            });
          }
        });

        //Generates client parent and client
        clientsArray.map((el, i) => {
          !isDefined(document.getElementById(`${el}-gen-parent`)) && el != ""
            ? generateElement(
                document.getElementById("client-grid"),
                undefined,
                `${el}-gen-parent`,
                undefined
              )
            : null;
          !isDefined(document.getElementById(`${el}-gen`)) && el != ""
            ? generateElement(
                document.getElementById(`${el}-gen-parent`),
                undefined,
                `${el}-gen`,
                undefined,
                `${el}`
              )
            : null;

          //Generates clients clocks
          if (isDefined(document.getElementById(`${el}-gen`)) && el != "") {
            generateMappedElements(
              `${el}-gen-clock`,
              `${el}-gen-parent`,
              "00:00"
            );
          }
        });

        //This is for sorting HTML collections
        let wrapper = document.getElementById("client-grid");
        let items = wrapper.children;
        [].slice
          .call(items)
          .sort((a, b) => {
            return a.textContent.localeCompare(b.textContent);
          })
          .forEach((val, i) => {
            wrapper.appendChild(val);
          });
      }
    }

    //Check for client data
    serverInfo = event.data.split(", ");
    serverInfo = {
      client: serverInfo[0],
      value: serverInfo[1] == "true", //checking string value to return true or false bool
      time: serverInfo[2],
    };

    //stores clients' info for styling
    const clinetValues = () => {
      clientInfoArray.map((el) => {
        el.client == serverInfo.client && (el.value = serverInfo.value);
        el.client == serverInfo.client && (el.time = serverInfo.time);
      });
    };
    clinetValues();

    //style elements
    const styleClient = (
      clientInfo,
      clientHTMLid,
      attribute = "background",
      primaryValue = "green",
      altValue = "red"
    ) => {
      let client = document.getElementById(clientHTMLid);
      let clock = document.getElementById(`${clientInfo.client}-gen-clock`);
      if (!clientInfo) return;
      clientInfo.value == true
        ? (client.style[attribute] = primaryValue)
        : (client.style[attribute] = altValue) && (clock.innerHTML = "00:00");
    };

    clientInfoArray.map((el, i) => {
      styleClient(el, `${el.client}-gen`);
    });
  });

  //Increment individual client clocks
  const clientClocksInterval = setInterval(() => {
    clientInfoArray.map((el) => {
      let clock = document.getElementById(`${el.client}-gen-clock`);
      clock.innerHTML = `${!el.time ? "00:00" : el.time}`;
    });
  }, 1000);

  //Disconnect listner
  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    const reconnectInterval = setInterval(() => {
      socket.close();
      clearInterval(clockInterval);
      clearInterval(clientClocksInterval);
      clearInterval(reconnectInterval);
      connect("ws://localhost:3000", "App");
    }, 1000);
  });

  //clock section all switches == true
  let clock = document.getElementById("clock");
  let min = 0;
  let sec = -1; //to account for data transfer time
  let sec2 = 0;

  const clockInterval = setInterval(() => {
    let min = 0;
    if (clientInfoArray.every((el) => el.value == true)) {
      clearClockInterval();
      let times = [];
      clientInfoArray.map((el) => times.push(el.time));
      times = times.map((el) => parseInt(el.replace(":", "")));
      min = times.indexOf(Math.min(...times));
      clock.innerHTML = `All True Time:  ${clientInfoArray[min].time}`;
    }
  }, 1000);

  const clearClockInterval = () => {
    const killInterval = setInterval(() => {
      if (clientInfoArray.some((el) => el.value == false)) {
        min = 0;
        sec2 = 0;
        sec = -1;
        clock.innerHTML = `All True Time: ${min <= 9 ? 0 : ""}${min}:${sec2}${
          sec < 0 ? 0 : sec
        }`;
        clearInterval(killInterval);
      }
    }, 100);
  };
};

connect("ws://localhost:3000", "App");
