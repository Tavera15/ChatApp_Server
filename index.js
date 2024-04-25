const express = require("express");
const App = express();
const cors = require("cors");
http = require("http");
const port = process.env.PORT || 4000;

App.use(cors());

const {Server} = require("socket.io");
const server = http.createServer(App);

const io = new Server(server, {
    cors: {
      origin: 'https://effortless-starship-38a8e8.netlify.app/',
      methods: ['GET', 'POST'],
      credentials: true
    },
});

io.on('connection', (socket) => {
    console.log("Socket joined");

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