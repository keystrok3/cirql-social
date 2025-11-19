import { io } from "socket.io-client";

export function createSocket(token) {
  const socket = io("http://localhost:8000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connect error:", err.message);
  });

  return socket;
}
