const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message ");
const nickForm = document.querySelector("#nick ");
const socket = new WebSocket(`ws://${window.location.host}`); //프론트엔드에서 백엔드로 연결하는 방법
// alert("gg");

const maskMessage = (type, payload) => {
  //json으로 오는 데이터를 string으로 변환
  const msg = { type, payload };

  return JSON.stringify(msg);
};

socket.addEventListener("open", () => {
  //conntection이 open일때 사용하는 listener 등록
  console.log("Connection Server ");
});

socket.addEventListener("message", (message) => {
  //message를 받았을때 사용하는 listener 등록
  // console.log(`서버로 부터 받아온 메세지 입니다 : `, message);
  // console.log(`NewMessage : `, message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  //서버가 오프라인일때  사용하는 listener 등록
  console.log("서버랑 연결이 끊어졌습니다.");
});

// setTimeout(() => {
//   socket.send("hello from the browser!"); //프론트엔드에서 백엔드로 메세지보내기
// }, 5000);
const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  // console.log(input.value);
  // socket.send(input.value); //프론트엔드에서 백엔드로 메세지보내기
  socket.send(maskMessage("new_Message", input.value)); //프론트엔드에서 백엔드로 메세지보내기
  input.value = "";
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
};
const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  // socket.send(input.value);
  // socket.send({
  //   type: "nickname",
  //   payload: input.value,
  // });
  socket.send(maskMessage("nickname", input.value));
  input.value = "";
};
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
