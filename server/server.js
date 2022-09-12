const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const cors = require("cors");
const dotenv = require("dotenv");
let client1Val;
let client2Val;
dotenv.config();

app.use(cors());

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
  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
  if (clientName[0] !== process.env["TOKEN"]) {
    ws.send("you moron");
    ws.terminate();
  } else {
    ws.send("welcome to my server");
  }

  ws.on("message", function incoming(message) {
    //console.log(`${ws.id}: ${message}`);

    ws.id == "Client1" ? (client1Val = message) : null;
    ws.id == "Client2" ? (client2Val = message) : null;

    if (client1Val == "true" && ws.id == "Client1") {
      wss.clients.forEach(function each(client) {
        if (client.id == "App" && client.readyState === 1) {
          client.send(`${ws.id}, ${client1Val}`);
        }
      });
    } else if (client1Val == "false" && ws.id == "Client1") {
      wss.clients.forEach(function each(client) {
        if (client.id == "App" && client.readyState === 1) {
          client.send(`${ws.id}, ${client1Val}`);
        }
      });
    }

    if (client2Val == "true" && ws.id == "Client2") {
      wss.clients.forEach(function each(client) {
        if (client.id == "App" && client.readyState === 1) {
          client.send(`${ws.id}, ${client2Val}`);
        }
      });
    } else if (client2Val == "false" && ws.id == "Client2") {
      wss.clients.forEach(function each(client) {
        if (client.id == "App" && client.readyState === 1) {
          client.send(`${ws.id}, ${client2Val}`);
        }
      });
    }

    //Send to all
    // wss.clients.forEach(function each(client) {
    //   console.log(client.id);
    //   if (client == "App" && client.readyState === 1) {
    //     client.send(message);
    //   }
    // });
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(3000, () => console.log(`Lisening on port :3000`));
