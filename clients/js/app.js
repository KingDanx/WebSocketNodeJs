import TOKEN from "../config/config.js";
import { generateElement, isDefined } from "./generateElement.js";

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
        clientsArray.map((el, i) => {
          if (
            isDefined(document.getElementById(`${el}-gen`)) &&
            !updateClientData.includes(el)
          ) {
            document.getElementById(`${el}-gen`).remove();
          }
          if (
            isDefined(document.getElementById(`${el}-gen-clock`)) &&
            !updateClientData.includes(el)
          ) {
            document.getElementById(`${el}-gen-clock`).remove();
          }
          // if (
          //   isDefined(document.getElementById(`${el}-gen-clock-min2`)) &&
          //   !updateClientData.includes(el)
          // ) {
          //   document.getElementById(`${el}-gen-clock-min2`).remove();
          // }
          // if (
          //   isDefined(document.getElementById(`${el}-gen-clock-min`)) &&
          //   !updateClientData.includes(el)
          // ) {
          //   document.getElementById(`${el}-gen-clock-min`).remove();
          // }
          // if (
          //   isDefined(document.getElementById(`${el}-gen-clock-colon`)) &&
          //   !updateClientData.includes(el)
          // ) {
          //   document.getElementById(`${el}-gen-clock-colon`).remove();
          // }
          // if (
          //   isDefined(document.getElementById(`${el}-gen-clock-sec2`)) &&
          //   !updateClientData.includes(el)
          // ) {
          //   document.getElementById(`${el}-gen-clock-sec2`).remove();
          // }
          // if (
          //   isDefined(document.getElementById(`${el}-gen-clock-sec`)) &&
          //   !updateClientData.includes(el)
          // ) {
          //   document.getElementById(`${el}-gen-clock-sec`).remove();
          // }
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

          //needs to be turned into a function
          if (isDefined(document.getElementById(`${el}-gen`)) && el != "") {
            if (!isDefined(document.getElementById(`${el}-gen-clock`)))
              generateElement(
                document.getElementById(`${el}-gen-parent`),
                undefined,
                `${el}-gen-clock`,
                undefined,
                `00:00`
              );
            // if (!isDefined(document.getElementById(`${el}-gen-clock-min2`)))
            //   generateElement(
            //     document.getElementById(`${el}-gen-parent`),
            //     "span",
            //     `${el}-gen-clock-min2`,
            //     undefined,
            //     `0`
            //   );
            // if (!isDefined(document.getElementById(`${el}-gen-clock-min`)))
            //   generateElement(
            //     document.getElementById(`${el}-gen-parent`),
            //     "span",
            //     `${el}-gen-clock-min`,
            //     undefined,
            //     `0`
            //   );
            // if (!isDefined(document.getElementById(`${el}-gen-clock-colon`)))
            //   generateElement(
            //     document.getElementById(`${el}-gen-parent`),
            //     "span",
            //     `${el}-gen-clock-colon`,
            //     undefined,
            //     `:`
            //   );
            // if (!isDefined(document.getElementById(`${el}-gen-clock-sec2`)))
            //   generateElement(
            //     document.getElementById(`${el}-gen-parent`),
            //     "span",
            //     `${el}-gen-clock-sec2`,
            //     undefined,
            //     `0`
            //   );
            // if (!isDefined(document.getElementById(`${el}-gen-clock-sec`)))
            //   generateElement(
            //     document.getElementById(`${el}-gen-parent`),
            //     "span",
            //     `${el}-gen-clock-sec`,
            //     undefined,
            //     `0`
            //   );
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
        console.log(items);
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

  clientInfoArray.map((el, i) => {
    styleClient(el, `${el.client}-gen`);
  });

  setInterval(() => {
    clientInfoArray.map((el) => {
      let min = 0;
      let sec = 0;
      let sec2 = 0;
      let clock = document.getElementById(`${el}-gen-clock`);
      let clientMin2 = document.getElementById(`${el.client}-gen-clock-min2`);
      let clientMin = document.getElementById(`${el.client}-gen-clock-min`);
      let clientSec2 = document.getElementById(`${el.client}-gen-clock-sec2`);
      let clientSec = document.getElementById(`${el.client}-gen-clock-sec`);
      if (el.value == true) {
        const killInterval = setInterval(() => {
          if (el.value == false) {
            min = 0;
            sec = 0;
            sec2 = 0;
            clientMin.innerHTML = 0;
            clientSec2.innerHTML = 0;
            clientSec.innerHTML = 0;
            clearInterval(killInterval);
          }
        }, 100);

        clientSec.innerHTML = parseInt(clientSec.innerHTML) + 1;
        if (parseInt(clientSec.innerHTML) > 9) {
          clientSec2.innerHTML = parseInt(clientSec2.innerHTML) + 1;
          clientSec.innerHTML = 0;
        }
        if (parseInt(clientSec2.innerHTML) >= 6) {
          clientMin.innerHTML = parseInt(clientMin.innerHTML) + 1;
          clientSec2.innerHTML = 0;
          clientSec.innerHTML = 0;
        }
        if (parseInt(clientMin.innerHTML) >= 10) {
          clientMin2.innerHTML = "";
        }
      } else {
      }
    });
  }, 1000);

  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    const reconnectInterval = setInterval(() => {
      socket.close();
      clearInterval(clockInterval);
      clearInterval(reconnectInterval);
      connect();
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
