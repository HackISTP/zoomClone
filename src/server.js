import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("home"));
app.use("/public", express.static(__dirname + "/public"));
const handelListen = () => console.log(`Lesting on http://localhost:3000`);
console.log("hell222o");
app.listen(3000, handelListen);
