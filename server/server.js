const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const cors = require("cors");
const dotenv = require("dotenv");
let clientIds = [];
let clientVal;
let client1Val;
dotenv.config();

app.use(cors());

function heartbeat() {
   this.isAlive=true
}

const wss = new WebSocket.Server({ server: server });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

wss.on("connection", function connection(ws, req) {
  let clientName = req.headers["sec-websocket-protocol"].split(", ");
  console.log("A new client Connected!");
  clientName[1] ? (ws.id = clientName[1]) : (ws.id = clientName[0]);
  ws.isAlive = true;
  ws.on("pong", heartbeat);

  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
  if (clientName[0] !== process.env["TOKEN"]) {
    ws.send("you moron");
    ws.terminate();
  } else {
    ws.send("welcome to my server");
    ws.id != "App" ? clientIds.push(ws.id) : null;
    wss.clients.forEach(function each(client) {
      if (client.id == "App" && client.readyState === 1) {
        client.send(`clientsArr, ${clientIds.join(", ")}`);
      }
    });
    
   
    
    const interval = setInterval(() => {
        if (
          ws.isAlive === false &&
          ws.id.toLowerCase().includes("arduino")
        ) {
          console.log(ws.isAlive, 'client alive')
          clearInterval(interval);
          return ws.terminate();
        }

        if (ws.id.toLowerCase().includes("arduino")) ws.isAlive = false;
        if (ws.id.toLowerCase().includes("arduino")) ws.ping();
    }, 3000);
    //^^ Add logic to cut disconnect clients out and resend array ^^
  }

  ws.on("message", function incoming(message) {
    //console.log(`${ws.id}: ${message}`);

    clientIds.map((el, i) => {
      ws.id == el ? (clientVal = message) : null;
    });

    const sendClientMsgToApp = (
      clientVal = client1Val,
      clientName = "Client1",
      targetId = "App"
    ) => {
      if (ws.id == clientName) {
        wss.clients.forEach(function each(client) {
          if (client.id == targetId && client.readyState === 1) {
            client.send(`${ws.id}, ${clientVal}`);
          }
        });
      }
    };

    clientIds.map((el, i) => {
      sendClientMsgToApp(clientVal, el);
    });

    //Send to all
    // wss.clients.forEach(function each(client) {
    //   console.log(client.id);
    //   if (client == "App" && client.readyState === 1) {
    //     client.send(message);
    //   }
    // });
  });

  ws.on("close", (event) => {
    console.log(`${ws.id} has disconnected`);
    ws.id != "App" ? clientIds.splice(clientIds.indexOf(ws.id), 1) : null;
    wss.clients.forEach(function each(client) {
      if (client.id == "App" && client.readyState === 1) {
        client.send(`clientsArr, ${clientIds.join(", ")}`);
      }
    });
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(3000, () => console.log(`Lisening on port :3000`));
