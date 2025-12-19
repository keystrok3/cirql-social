import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useFollowing } from "../../hooks/useFollowing";
import { Box, Typography, CircularProgress } from "@mui/material";

function FollowingDisplay({ username }) {

    const { followers, followees, isLoading, error } = useFollowing(username);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <CircularProgress size={24} />
                <Typography ml={1}>Loading following data...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    if (!username) {
        return (
            <Box p={2}>
                <Typography color="error">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" gap={3} p={1}>
            <Typography variant="body1">
                <strong>{followees.length}</strong> following
            </Typography>
            <Typography variant="body1">
                <strong>{followers.length}</strong> followers
            </Typography>
        </Box>
    );
}

export default FollowingDisplay;
