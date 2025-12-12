// src/pages/Profile/ProfilePage.jsx
import { Box, Container, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { useProfile } from "../../hooks/useProfile";

import FollowingDisplay from "../../components/FollowingDisplay/FollowingDisplay"
import EditModal from "./EditModal"; // same modal you had before
import ProfileHeader from "./ProfileHeader";
import ProfileActions from "./ProfileActions";
import ProfileFeed from "./ProfileFeed";

const Profile = () => {
    const { user: usernameParam } = useParams();

    const { profile, loading, isSelf } = useProfile(usernameParam);

    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((prev) => !prev);

    if (loading && !profile) return <div>Loading...</div>;

    return (
        <Box>
            <ProfileHeader profile={profile} />

            <Container>
                {isSelf && (
                    <EditModal openModal={modalOpen} onModal={toggleModal} />
                )}

                {/* Actions */}
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    mt={-10}
                    mb={4}
                    px={2}
                >
                    <ProfileActions isSelf={isSelf} onEdit={toggleModal} />
                </Box>

                {/* Followers / Following */}
                <FollowingDisplay username={profile?.username} />

                <Divider sx={{ my: 2 }} />

                {/* Feed */}
                <ProfileFeed username={profile?.username} />
            </Container>
        </Box>
    );
};

export default Profile;
