const express = require("express");
const App = express();
const cors = require("cors");
http = require("http");
const port = process.env.PORT || 4000;

App.use(cors());
App.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

const {Server} = require("socket.io");
const server = http.createServer(App);

const io = new Server(server, {
    cors: {
      origins: 'https://effortless-starship-38a8e8.netlify.app',
      methods: ['GET', 'POST'],
      credentials: true
    },
});

console.log("s");

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