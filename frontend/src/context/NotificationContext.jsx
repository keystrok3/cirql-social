import { createContext, useContext, useEffect, useState } from "react";
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

            const unread_notifications_count = response
                                                .data
                                                .notifications
                                                .filter(notf => notf.is_read === false)
                                                .length;

            setUnread(unread_notifications_count);
            setNotifications([ ...response.data.notifications ]);
        } catch (error) {
            console.log('Error fetching notifications: ', error)
        }
    }

    const mark_notifications_read = async () => {
        try {
            const response = await apiAuth.post('/notifications/mark-notifications');
            console.log("Mark notifications: ", response.data.success)
            if(response.data.success === true) {
                console.log('Marked read');
                setUnread(0);
            }
            
        } catch (error) {
            console.error('Notifications Error: ', error);
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
                mark_notifications_read,
                fetch_notifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
