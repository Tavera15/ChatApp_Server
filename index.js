const express = require("express");
const App = express();
const cors = require("cors");
http = require("http");
const port = 4000;

App.use(cors());

const {Server} = require("socket.io");
const server = http.createServer(App);

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
  
    socket.on("self_joined", async (data) => {
        const {username, room} = data;
        socket.join(room);

        socket.to(room).emit("friend_joined", {
            username: "Server",
            message: `${username} has joined the room`,
        })
    })

    socket.on("message_sent", (data) => {
        const {username, room, message_sent} = data;

        socket.to(room).emit("message_receive", {
            message: message_sent,
            username: username
        })
    })

    socket.on("self_logout", async (data) => {
        const {username, room} = data;
        
        socket.to(room).emit("friend_logout", {
            username: "Server",
            message: `${username} has left the room`
        })
        socket.leave(room);
    })
});

App.get("/", (req, res) => {
    res.send("Hello");
});

server.listen(port, () => {
    console.log("Listening to port: " + port);
})