//백엔드에서 구동
import express from "express";
import http from "http";
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log("listen localhost:3000");

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

//io.sockets.adapter 로 부터 sids 와 rooms를 가져와서
const publicRooms = () => {
  const sids = io.sockets.adapter.sids;
  const rooms = io.sockets.adapter.rooms;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  //방안에 소켓이 몇개 있는지 확인(방안에 접속한유저 확인)
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket["nickName"] = "익명";
  socket.onAny((event) => {
    console.log(io.sockets.adapter);
    console.log(`socket event : ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    console.log(socket.id);
    console.log(socket.rooms);
    socket.join(roomName);
    console.log(socket.rooms);
    done();
    socket.to(roomName).emit("welcome", socket.nickName, countRoom(roomName)); //
    io.sockets.emit("room_change", publicRooms()); //방안에 있는 모두에게 welcome 을 보낸다.
  });
  //프론트에서 받음
  socket.on("disconnecting", () => {
    //disconnecting 클라이언트가 서버와 연결이 끊겨지기 전에 실행할수 있게 함
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickName, countRoom(room) - 1);
    });
  });
  //disconnect 클라이언트 와 서버 연결이 끊기게 해주는
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_Message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_Message", `${socket.nickName}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickName"] = nickname));
});

httpServer.listen(3000, handleListen);
