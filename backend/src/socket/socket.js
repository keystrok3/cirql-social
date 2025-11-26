

const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

let io;

const userSockets = {}; // username -> [socketIds]

function registerUserSocket(username, socketId) {
    if(!userSockets[username]) userSockets[username] = [];

    userSockets[username].push(socketId);
}

function removeUserSocket(username, socketId) {
    if(!userSockets[username]) return;

    userSockets[username] = userSockets[username].filter(id => id !== socketId);

    if(userSockets[username].length === 0) {
        delete userSockets[username];
    }
}

function getUserSockets(username) {
    return userSockets[username] || [];
}


function initSocket(server) { 
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {
            // get token from query or from auth header
            const token = socket.handshake.auth?.accessToken || 
                          socket.handshake.headers?.authorization?.split(" ")[1];
            
            if(!token) {
                console.log("Socket rejected, no token provided");
                return next(new Error("Authentication Error!"));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            socket.user = decoded; // attach user info

            next()
        } catch (error) {
            console.log("JWT error in socket handshake:", error);
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", socket => {
        const username = socket.user.username;

        // Register socket
        registerUserSocket(username, socket.id);

        console.log(`User connected: ${username}, Socket: ${socket.id}`);

        socket.on("disconnect", () => {
            removeUserSocket(username, socket.id);
            console.log(`User disconnected: ${username}`);
        })
    });

    return io;
}


function getIO() {
    if(!io) throw new Error("Cannot get IO before initialization");
    return io;
}

module.exports = { initSocket, getIO, getUserSockets };