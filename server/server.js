const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());

const wss = new WebSocket.Server({ server: server });

wss.on("connection", function connection(ws, req) {
  console.log("A new client Connected!");
  if (ws.protocol !== process.env["TOKEN"]) {
    ws.send("you moron");
    ws.terminate();
  }
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.on("upgrade", function upgrade(request, socket, head) {
  // This function is not defined on purpose. Implement it with your own logic.
});

app.get("/", (req, res) => res.send("Hello World!"));

server.listen(3000, () => console.log(`Lisening on port :3000`));
