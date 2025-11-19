import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";
import { apiAuth } from "../api/axios";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    const { accessToken } = useAuth();
    const { socket } = useSocket();

    const fetch_notifications = async () => {
        try {
            const response = await apiAuth.get('/notifications/get-notifications');

            console.log('Notifications: ', response.data.notifications);

            setNotifications([ ...response.data.notifications ]);
        } catch (error) {
            console.log('Error fetching notifications: ', error)
        }
    }

    useEffect(() => {

        if(!socket) return;
        
        const handler = (data) => {
            console.log("Real-time notification: ", data);
            setNotifications((prev) => [data, ...prev]);
            setUnread((prev) => prev + 1);
        }

        // Real-time notifications
        socket.on("notification", handler);

        
        fetch_notifications()


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
