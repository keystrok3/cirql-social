
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFollowing } from "../../hooks/useFollowing";

const ProfileActions = ({ username, isSelf, onEdit }) => {
    const [ following, setFollowing ] = useState(false);

    const { is_following, toggle_follow } = useFollowing(username);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const handleToggleFollow = async (e) => {
        await toggle_follow();
        const status = await is_following();
        setFollowing(status);
    }

    useEffect(() => {
        if (!isSelf && username) {
            const checkStatus = async () => {
                const status = await is_following();
                setFollowing(status);
                console.log('In Actions: ', username, status);
            };
            checkStatus();
        }
    }, [username, isSelf, is_following]);


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
            onClick={handleToggleFollow}
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
