const express = require("express");
const cors = require("cors");
const apiLimiter = require("./middleware/apiLimiter");
const { Server } = require("socket.io");
const matrixGenerator = require("./utils/matrixGenerator");

const _port = 3000;
const _socketPort = 3001;

const io = new Server(_socketPort, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});
const app = express();

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.use(apiLimiter);
app.listen(_port, () => {
  console.log(`서버가 ${_port} 포트에서 듣고있음`);
});

let statusInterval;

io.on("connection", (socket) => {
  //
  console.log("누군가 접속함", socket.id);
  socket.emit("message", " 환영합니당 ");
  socket.emit("status", matrixGenerator(10));

  statusInterval = setInterval(() => {
    socket.emit("status", matrixGenerator(10));
  }, 1000);

  socket.on("message", (msg) => {
    setTimeout(() => {
      if(Number(msg)) {
        socket.emit("message", matrixGenerator(msg));
      } else {
        socket.emit("message", " 네 반가워요~ ");
      }
    }, 300);
  });

  socket.on("disconnect", (socket) => {
    console.log("누가 접속끊음", socket);
  });
});
