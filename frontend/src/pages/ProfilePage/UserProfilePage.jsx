import {
  Box,
  Avatar,
  Button,
  Container,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUserProfile } from "../../hooks/useFetchUserProfile";
import { useEffect } from "react";

const UserProfilePage = () => {
    const { user } = useParams();
    const navigate = useNavigate();

    const { fetch_profile, profileData, loading } = useFetchUserProfile(user);

    const [following, setFollowing] = useState(false);

    const handleFollow = () => {
        setFollowing((prev) => !prev);
    };

    useEffect(() => {
        fetch_profile();
    }, []);

    useEffect(() => {
        if(profileData) {
            console.log('Profile Data: ', profileData);
        }
    }, [ profileData]);
    
    return (
        <Box>
        <Box
            sx={{
                height: 200,
                width: "100%",
                position: "relative",
            }}
        >
            {/* ${import.meta.VITE_API_URL} */}
            <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}/${profileData?.banner_image}`}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    backgroundColor: "#e0e0e0",
                }}
            />

            {/* Back button */}
            <IconButton
            onClick={() => navigate(-1)}
            sx={{
                position: "absolute",
                top: 10,
                left: 10,
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.4)",
                "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.6)",
                },
            }}
            >
            <ArrowBackIcon />
            </IconButton>
        </Box>

        {/* --- Profile Info Section --- */}
        <Container>
            <Box
                display="flex"
                flexDirection="row"
                mt={0.75}
                justifyContent="space-between"
                alignItems="center"
            >
                <Box position="relative">
                    <Avatar
                        src={`${import.meta.env.VITE_API_URL}/${profileData?.profile_photo}`}
                        sx={{
                            position: "absolute",
                            top: { xs: "-80px", sm: "-110px" },
                            width: { xs: 100, sm: 150 },
                            height: { xs: 100, sm: 150 },
                            border: "3px solid #f5f5f5",
                            backgroundColor: "#ddd",
                        }}
                    />
                </Box>

                {/* Follow / Unfollow Button */}
                <Button
                    variant={following ? "outlined" : "contained"}
                    color={following ? "inherit" : "primary"}
                    onClick={handleFollow}
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        paddingX: 3,
                    }}
                >
                    {following ? "Unfollow" : "Follow"}
                </Button>
            </Box>

            {/* --- User Text Info --- */}
            <Box sx={{ marginTop: { xs: "1.5em", sm: "2.5em" } }}>
                <Stack gap={0.5}>
                    <Typography variant="h5" component="h1">
                    {user?.screen_name ||
                        `${profileData?.first_name} ${profileData?.last_name}` ||
                        "Unnamed User"}
                    </Typography>
                    <Typography color="#6b6b6b" variant="body2">
                    @{profileData?.username || "unknown"}
                    </Typography>
                    <Typography color="#6b6b6b" variant="body1">
                    {profileData?.bio || "No bio provided"}
                    </Typography>
                </Stack>
            </Box>
        </Container>
        </Box>
    );
};

export default UserProfilePage;