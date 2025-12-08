import { createContext } from "react";
import { useSocket } from "./SocketProvider";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";

const LikeContext = createContext();

const LikeProvider = ({ children }) => {
    const { socket } = useSocket();
    const [ likeUpdates, setLikeUpdates ] = useState({});

    useEffect(() => {
        if(!socket) return;
        console.log("In LikeProvider")

        const handleLikeUpdate = (data) => {
            console.log("Real-time like update: ", data);
            const { post } = data;

            //increment the trigger for this post
            setLikeUpdates(prev => ({
                ...prev,
                [post]: (prev[post] || 0) + 1
            }));
        };

        socket.on("like:update", handleLikeUpdate);

        return () => {
            socket.off("like:update", handleLikeUpdate);
        }

    }, [socket]);

    return (
        <LikeContext.Provider value={{ likeUpdates }}>{ children }</LikeContext.Provider>
    )
};

export const useLikeUpdates = () => useContext(LikeContext);
export default LikeProvider;


