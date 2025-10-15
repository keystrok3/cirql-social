import {
  Avatar,
  Box,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FeedIcon from "@mui/icons-material/DynamicFeed";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout"; // Import Logout Icon
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const Sidebar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { logout, userData } = useAuth();

  const navigate = useNavigate();

  // Completely hide on mobile
  if (isSmallScreen) return null;

  // Placeholder function for logout logic
  const handleLogout = () => {
    // Implement your actual logout logic here (e.g., clearing auth tokens, redirecting)
    console.log("User logged out");
    // Example: navigate to the login page
    // navigate('/login');
  };

  return (
    <Stack
      direction="column"
      height="96vh"
      width="220px"
      sx={{
        bgcolor: "background.paper",
        width: '100%',
      }}
      justifyContent="space-between"
    >
      {/* Avatar Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Avatar
          src={`http://localhost:8000/${userData?.user?.profile_photo}`}
          sx={{
            width: 80,
            height: 80,
          }}
        />
      </Box>

      {/* Menu List */}
      <Box flex={1}>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>
            <ListItemText primary="Feed" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>


          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Box>

      {/* Logout Button Section - Anchored to the bottom */}
      <Box sx={{ p: 1, mb: 2 }}> {/* Added some padding and margin-bottom for spacing */}
        <ListItemButton onClick={logout}
            sx={{
                '&:hover': {
                    bgcolor: 'rgba(255, 107, 107, 0.1)', // Slight hover effect
                },
            }}
        >
          <ListItemIcon>
            {/* Color the icon red */}
            <LogoutIcon sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          {/* Color the text red */}
          <ListItemText primary="Logout" sx={{ color: '#ff6b6b' }} />
        </ListItemButton>
      </Box>

    </Stack>
  );
};

export default Sidebar;