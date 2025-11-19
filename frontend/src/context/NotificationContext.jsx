import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    const { accessToken } = useAuth();
    const { socket } = useSocket();

    useEffect(() => {

        if(!socket) return;

        const handler = (data) => {
            console.log("Real-time notification: ", data);
            setNotifications((prev) => [data, ...prev]);
            setUnread((prev) => prev + 1);
        }

        // Real-time notifications
        socket.on("notification", handler);

        // Cleanup
        return () => {
            socket.off("notification", handler);
        };
    }, [ socket, accessToken ]);

    return (
        <NotificationContext.Provider
            value={{
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
