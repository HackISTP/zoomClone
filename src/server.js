//백엔드에서 구동
import express from "express";
import http from "http";
import SocketIO from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log("listen localhost:3000");

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
  socket["nickName"] = "익명";
  socket.onAny((event) => {
    console.log(`socket event : ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    console.log(socket.id);
    console.log(socket.rooms);
    socket.join(roomName);
    console.log(socket.rooms);
    done();
    socket.to(roomName).emit("welcome", socket.nickName); //방안에 있는 모두에게 welcome 을 보낸다.
  });
  //프론트에서 받음
  socket.on("disconnecting", () => {
    //클라이언트가 서버와 연결이 끊겨지기 전에 실행할수 있게 함
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickName);
    });
  });
  socket.on("new_Message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_Message", `${socket.nickName}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickName"] = nickname));
});

httpServer.listen(3000, handleListen);
