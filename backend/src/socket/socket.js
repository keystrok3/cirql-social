
const { Server } = require('socket.io');

let io;
const userSockets = new Map();

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id);

        // when user authenticates on connect
        socket.on("register", (userId) => {
            if(!userSockets.has(userId)) userSockets.set(userId, []);
            userSockets.get(userId).push(socket.id);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            for(const [userId, sockets] of userSockets.entries()) {
                userSockets.set(
                    userId, 
                    sockets.filter((id) => id !== socket.id)
                );
            }
        });
    });

    return io;
}

function getIO() {
    if(!io) throw new Error("Socket.io not initialized");
    return io;
}

function getUserSockets(userId) {
    return userSockets.get(userId) || [];
}

module.exports = { initSocket, getIO, getUserSockets };