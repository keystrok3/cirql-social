import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createSocket } from "../socket";
import { useAuth } from "./AuthProvider";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const socketRef = useRef(null);

    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) return;

        // Create socket
        console.log("Creating socket with token:", accessToken);
        const s = createSocket(accessToken);
        socketRef.current = s;

        s.on("connect", () => {
            console.log("WS connected:", s.id);
        });

        s.on("disconnect", () => {
            console.log("WS disconnected");
        });

        // Real-time notifications
        s.on("notification", (data) => {
            console.log("Real-time notification:", data);
            setNotifications((prev) => [data, ...prev]);
            setUnread((prev) => prev + 1);
        });

        // Cleanup
        return () => {
            console.log("Cleaning up socket...");
            s.removeAllListeners(); // prevent duplicate handlers
            s.disconnect();
        };
    }, [accessToken]);

    return (
        <NotificationContext.Provider
            value={{
                socket: socketRef.current,
                notifications,
                unread,
                setUnread,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
