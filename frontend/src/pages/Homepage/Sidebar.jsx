import {
  Avatar,
  Box,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography, // Imported for username display
  useMediaQuery,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FeedIcon from "@mui/icons-material/DynamicFeed";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useNotification } from "../../context/NotificationContext";

const Sidebar = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { unread } = useNotification();

  const { logout, userData } = useAuth();

  const navigate = useNavigate();

  // Hide on screens smaller than 'sm' (which is already handled in Home.jsx, but good to keep for consistency if needed)
  if (!isDesktop) return null;

  return (
    // Stack now relies on the Home.jsx parent Box for size/position
    <Stack
      direction="column"
      sx={{
        bgcolor: "background.paper",
        width: '100%',
        height: '100%', // Fill the parent's height
      }}
      justifyContent="space-between"
    >
      {/* Avatar and User Info Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3, // Increased padding
          borderBottom: '1px solid #eee', // Visual separator
        }}
      >
        <Avatar
          src={`http://localhost:8000/${userData?.user?.profile_photo}`}
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            border: '2px solid',
            borderColor: 'primary.main', // Added border for emphasis
          }}
        />
        <Typography variant="h6" component="p" fontWeight="bold">
          {userData?.user?.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          @{userData?.user?.screen_name}
        </Typography>
      </Box>

      {/* Menu List */}
      <Box flexGrow={1} overflow="auto"> {/* Use flexGrow instead of fixed flex: 1 */}
        <List>
          {/* Menu Items */}
          <ListItemButton onClick={() => navigate('/')}> {/* Navigating to home/feed */}
            <ListItemIcon>
              <FeedIcon color="primary" /> {/* Added color */}
            </ListItemIcon>
            <ListItemText primary="Feed" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/notifications')}>
            <ListItemIcon>
              <Badge badgeContent={`${unread}`}>
                <NotificationsIcon />
              </Badge>
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
      <Box sx={{ p: 1, mt: 'auto', borderTop: '1px solid #eee' }}> {/* Added auto margin to push it down */}
        <ListItemButton 
          onClick={logout}
          sx={{
            borderRadius: '5px',
            '&:hover': {
              bgcolor: 'error.light', // Use theme color for hover
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'white', // White text/icon on hover
              },
            },
          }}
        >
          <ListItemIcon>
            {/* Use theme.palette.error.main and let hover handle color */}
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error.main', fontWeight: 'bold' }} />
        </ListItemButton>
      </Box>

    </Stack>
  );
};

export default Sidebar;