import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { createContext } from "react";
import { useAuth } from "./AuthProvider";


const SocketContext = createContext();


const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { accessToken } = useAuth();
    const [ connected, setConnected ] = useState(false);


    useEffect(() => {
        if(!accessToken) return;
        // create connection once
        const socket = io("http://localhost:8000", {
            // autoConnect: false,
            auth: { accessToken },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        return () => {
            socket.disconnect();
        }

    }, [ accessToken ]);

    return (
        <SocketContext.Provider 
            value={{ 
                socket: socketRef.current, 
                connected }}
        >{ children }</SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;