const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    // 确保消息是字符串
    if (typeof message !== "string") {
      message = message.toString();
    }

    // 处理设置 clientId 的特殊消息
    if (message.startsWith("clientId:")) {
      ws.clientId = message.split(":")[1];
      return; // 不向客户端发送这条消息
    }

    // 广播消息给所有客户端，包括发送者
    const formattedMessage = ws.clientId
      ? `${ws.clientId}:${message}`
      : `Anonymous:${message}`;
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(formattedMessage);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
