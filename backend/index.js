const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("code-change", (code) => {
    socket.broadcast.emit("code-update", code);
  });
});

app.post("/run", (req, res) => {
  const { code } = req.body;
  exec(`echo "${code}" | node`, (error, stdout, stderr) => {
    res.json({ output: stdout, error: stderr });
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
