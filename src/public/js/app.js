//프론트에서 구동되는 코드
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
let roomName = "";
room.hidden = true;
const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  console.log(message);
  li.innerText = message;
  ul.appendChild(li);
};
const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const msg = input.value;
  socket.emit("new_Message", input.value, roomName, () =>
    addMessage(`You ${msg}`)
  ); //백엔드로 메세지 보내기
  input.value = "";
};
const handleNickNameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#nickname input");
  socket.emit("nickname", input.value);
};
const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#nickname ");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNickNameSubmit);
};
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = document.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;

  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
//백엔드에서 받는
socket.on("welcome", (user) => addMessage(`${user} 님이 접속하셨습니다.`));
socket.on("bye", (user) => addMessage(`${user} 님이 나갔습니다.`));
socket.on("new_Message", addMessage);
