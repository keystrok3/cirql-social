import { useContext } from "react";
import { useSocket } from "./SocketProvider";
import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";


const RepostContext = createContext();

const RepostProvider = ({ children }) => {
    const { socket } = useSocket();
    const [ repostUpdates, setRepostUpdates ] = useState({});

    useEffect(() => {
        if(!socket) return;

        const handleRepostUpdate = (data) => {
            const { post } = data;
            setRepostUpdates(prev => ({ ...prev, [post]: (prev[post] || 0) + 1}));
        };

        socket.on("repost:update", handleRepostUpdate);

        return () => socket.off("repost:update", handleRepostUpdate);

    }, [socket]);

    return (
        <RepostContext.Provider value={{ repostUpdates }}>{children}</RepostContext.Provider>
    )
};

export const useRepost = () => useContext(RepostContext);

export default RepostProvider;