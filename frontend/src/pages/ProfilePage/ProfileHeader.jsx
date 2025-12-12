import { Box, Avatar, Typography, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ profile }) => {
    const navigate = useNavigate();

    const bannerSrc = profile?.banner_image
        ? `${import.meta.env.VITE_API_URL}/${profile.banner_image}`
        : "";

    const avatarSrc = profile?.profile_photo
        ? `${import.meta.env.VITE_API_URL}/${profile.profile_photo}`
        : "";

    return (
        <>
            {/* Banner */}
            <Box
                sx={{
                    height: 200,
                    width: "100%",
                    position: "relative",
                }}
            >
                <Box
                    component="img"
                    src={bannerSrc}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        backgroundColor: "#e0e0e0",
                    }}
                />

                {/* Back */}
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.4)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            {/* Avatar + Text */}
            <Box sx={{ position: "relative", mt: -8, ml: 2 }}>
                <Avatar
                    src={avatarSrc}
                    sx={{
                        width: { xs: 100, sm: 150 },
                        height: { xs: 100, sm: 150 },
                        border: "3px solid #f5f5f5",
                    }}
                />
            </Box>

            <Box sx={{ mt: 2, px: 2 }}>
                <Stack gap={0.5}>
                    <Typography variant="h5">
                        {profile?.screen_name ||
                            `${profile?.first_name} ${profile?.last_name}` ||
                            "Unnamed User"}
                    </Typography>

                    <Typography color="#6b6b6b">@{profile?.username}</Typography>

                    <Typography color="#6b6b6b">{profile?.bio}</Typography>
                </Stack>
            </Box>
        </>
    );
};

export default ProfileHeader;
