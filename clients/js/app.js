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
          removeUnusedElements(`${el}-gen-min2`, el, updateClientData);
          removeUnusedElements(`${el}-gen-min`, el, updateClientData);
          removeUnusedElements(`${el}-gen-colon`, el, updateClientData);
          removeUnusedElements(`${el}-gen-sec2`, el, updateClientData);
          removeUnusedElements(`${el}-gen-sec`, el, updateClientData);
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
              `${el}-gen-min2`,
              `${el}-gen-parent`,
              "0",
              "span"
            );
            generateMappedElements(
              `${el}-gen-min`,
              `${el}-gen-parent`,
              "0",
              "span"
            );
            generateMappedElements(
              `${el}-gen-colon`,
              `${el}-gen-parent`,
              ":",
              "span"
            );
            generateMappedElements(
              `${el}-gen-sec2`,
              `${el}-gen-parent`,
              "0",
              "span"
            );
            generateMappedElements(
              `${el}-gen-sec`,
              `${el}-gen-parent`,
              "0",
              "span"
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
    };

    //stores clients' info for styling
    const clinetValues = () => {
      clientInfoArray.map((el) => {
        el.client == serverInfo.client ? (el.value = serverInfo.value) : null;
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
      if (!clientInfo) return;
      clientInfo.value == true
        ? (client.style[attribute] = primaryValue)
        : (client.style[attribute] = altValue);
    };

    clientInfoArray.map((el, i) => {
      styleClient(el, `${el.client}-gen`);
    });
  });

  //Increment individual client clocks
  const clientClocksInterval = setInterval(() => {
    clientInfoArray.map((el) => {
      // let clock = document.getElementById(`${el.client}-gen-clock`);

      let clientMin2 = document.getElementById(`${el.client}-gen-min2`);
      let clientMin = document.getElementById(`${el.client}-gen-min`);
      let clientSec2 = document.getElementById(`${el.client}-gen-sec2`);
      let clientSec = document.getElementById(`${el.client}-gen-sec`);
      if (el.value == true) {
        const killInterval = setInterval(() => {
          if (el.value == false) {
            clientMin2.innerHTML = 0;
            clientMin.innerHTML = 0;
            clientSec2.innerHTML = 0;
            clientSec.innerHTML = 0;
            clearInterval(killInterval);
          }
        }, 100);

        clientSec.innerHTML = parseInt(clientSec.innerHTML) + 1;
        if (clientSec.innerHTML > 9) {
          clientSec2.innerHTML = parseInt(clientSec2.innerHTML) + 1;
          clientSec.innerHTML = 0;
        }
        if (clientSec2.innerHTML > 5) {
          clientMin.innerHTML = parseInt(clientMin.innerHTML) + 1;
          clientSec2.innerHTML = 0;
          clientSec.innerHTML = 0;
        }
        if (clientMin.innerHTML > 9) {
          clientMin2.innerHTML = "";
        }
      }
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
  let sec = 0;
  let sec2 = 0;

  const clockInterval = setInterval(() => {
    if (clientInfoArray.every((el) => el.value == true)) {
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
    clock.innerHTML = `All True Time:  ${
      min <= 9 ? 0 : ""
    }${min}:${sec2}${sec}`;
  }, 1000);

  const clearClockInterval = () => {
    const killInterval = setInterval(() => {
      if (clientInfoArray.some((el) => el.value == false)) {
        min = 0;
        sec2 = 0;
        sec = 0;
        clock.innerHTML = `${min <= 9 ? 0 : ""}${min}:${sec2}${sec}`;
        clearInterval(killInterval);
      }
    }, 100);
  };
};

connect("ws://localhost:3000", "App");
