const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let elevatorState = {
  waitingCount: 0,
  waitTime: 0,
  status: "여유"
};

io.on("connection", (socket) => {
  console.log("접속됨:", socket.id);

  socket.emit("stateUpdate", elevatorState);

  socket.on("adminUpdate", (data) => {
    elevatorState = data;
    io.emit("stateUpdate", elevatorState);
  });

  socket.on("resetCount", () => {
    elevatorState = {
      waitingCount: 0,
      waitTime: 0,
      status: "여유"
    };

    io.emit("stateUpdate", elevatorState);
  });
});

server.listen(3000, () => {
  console.log("서버 실행 중");
  console.log("http://localhost:3000");
});
