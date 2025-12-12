
import { Button } from "@mui/material";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileActions = ({ isSelf, onEdit }) => {
    const [following, setFollowing] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    if (isSelf) {
        return (
            <Button
                variant="contained"
                onClick={() =>
                    isMobile ? navigate("/edit-profile") : onEdit()
                }
            >
                Edit Profile
            </Button>
        );
    }

    return (
        <Button
            variant={following ? "outlined" : "contained"}
            onClick={() => setFollowing((prev) => !prev)}
            sx={{
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 3,
            }}
        >
            {following ? "Unfollow" : "Follow"}
        </Button>
    );
};

export default ProfileActions;
