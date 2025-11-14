import {
  Box,
  Avatar,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import EditModal from "./EditModal";
import MainLayout from "../Homepage/MainLayout"; // assuming layout is in Home/
 
const ProfilePage = () => {
  const { userData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const toggleModal = () => setModalOpen((prev) => !prev);

  const user = userData?.user;

  return (
      <Box>
        {/* --- Banner Section --- */}
        <Box
          sx={{
            height: 200,
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={user?.banner_image ? `http://localhost:8000/${user.banner_image}` : ""}
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
          <EditModal openModal={modalOpen} onModal={toggleModal} />

          <Box
            display="flex"
            flexDirection="row"
            mt={0.75}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box position="relative">
              <Avatar
                src={user?.profile_photo ? `http://localhost:8000/${user.profile_photo}` : ""}
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

            <Button
              variant="contained"
              onClick={() => (isMobile ? navigate("/edit-profile") : toggleModal())}
            >
              Edit Profile
            </Button>
          </Box>

          {/* --- User Text Info --- */}
          <Box sx={{ marginTop: { xs: "1.5em", sm: "2.5em" } }}>
            <Stack gap={0.5}>
              <Typography variant="h5" component="h1">
                { user?.screen_name || `${user?.first_name} ${user?.last_name}` || "Unnamed User"}
              </Typography>
              <Typography color="#6b6b6b" variant="body2">
                @{user?.username || "unknown"}
              </Typography>
              <Typography color="#6b6b6b" variant="body1">
                {user?.bio || "No bio provided"}
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
  );
};

export default ProfilePage;
