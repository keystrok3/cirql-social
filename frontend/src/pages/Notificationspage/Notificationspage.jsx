import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useNotification } from '../../context/NotificationContext';
import { useEffect } from "react";
import NotificationItem from "./Notification"
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";





const Notificationpage = () => {
    const { notifications, mark_notifications_read, fetch_notifications } = useNotification();

    const navigate = useNavigate();


    useEffect(() => {
        fetch_notifications();
        mark_notifications_read();
    }, []);

    return (
        <Stack>
            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '.5em'
                }}
            >
                <IconButton sx={{ mr: '1em'}} onClick={() => navigate(-1)}><ArrowBack /></IconButton>
                <Typography variant="h5">Notifications</Typography>
            </Box>

            <Divider />

            <Stack m={'1em 0'}>
                {notifications?.map((notf, idx) => {
                    return (
                        <NotificationItem key={idx} notf={notf}/>
                    )
                })}
            </Stack>
        </Stack>
    );
};

export default Notificationpage;