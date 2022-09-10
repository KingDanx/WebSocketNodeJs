const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const cors = require("cors");
const dotenv = require("dotenv");
const { platform } = require("os");
let clientCounter = 1;
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
  clientName[1] ? (ws.id = clientName[1]) : ws.id == clientName[0];

  wss.clients.forEach(function each(client) {
    console.log("Client.ID: " + client.id);
  });
  if (ws.protocol !== process.env["TOKEN"]) {
    ws.send("you moron");
    ws.terminate();
  }
  ws.here;
  ws.on("message", function incoming(message) {
    console.log(`${ws.id}: ${message}`);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === 1) {
        client.send(`Client${ws.id}: ${message}`);
      }
    });
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(3000, () => console.log(`Lisening on port :3000`));
