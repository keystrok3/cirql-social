import { Box, Divider, Stack, Typography } from "@mui/material";
import { useNotification } from '../../context/NotificationContext';


const notification_dictionary = {
    Like: "liked",
}

const Notificationpage = () => {
    const { notifications } = useNotification()
    return (
        <Stack>
            <Box m={'1em 0'}>
                <Typography variant="h3" component={"h3"}>Notifications</Typography>
            </Box>

            <Divider />

            <Stack m={'1em 0'}>
                {notifications.map((notf, idx) => {
                    return (
                        <Box>
                            {`@${notf.actor} ${notification_dictionary[notf.sourceType]} your post`}
                        </Box>
                    )
                })}
            </Stack>
        </Stack>
    );
};

export default Notificationpage;