import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Assuming react-router-dom usage

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

// 1. Import Filled Icons
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

// 2. Import Outlined Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 3. Define your navigation items configuration
  const navItems = [
    {
      label: 'Home',
      path: '/',
      iconActive: <HomeIcon />,
      iconInactive: <HomeOutlinedIcon />
    },
    {
      label: 'Search',
      path: '/search',
      iconActive: <SearchIcon />,
      iconInactive: <SearchOutlinedIcon />
    },
    {
      label: 'Notifications',
      path: '/notifications',
      iconActive: <NotificationsIcon />,
      iconInactive: <NotificationsNoneIcon />
    },
    {
      label: 'Profile',
      path: '/profile',
      iconActive: <PersonIcon />,
      iconInactive: <PersonOutlineIcon />
    }
  ];

  return (
    <BottomNavigation
      // Set the value to the current path so the correct button highlights
      value={location.pathname} 
      onChange={(event, newValue) => {
        navigate(newValue);
      }}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        opacity: 1,
        width: '100%',
        borderTop: '1px solid #e0e0e0', // Changed red to a standard border color
        backgroundColor: '#fff',
        zIndex: 1000 // Ensures it stays on top of content
      }}
    >
      {navItems.map((item) => (
        <BottomNavigationAction
          key={item.label}
          label={item.label}
          value={item.path}
          // 4. The Logic: Check if current path matches item path
          icon={
            location.pathname === item.path 
              ? item.iconActive 
              : item.iconInactive
          }
        />
      ))}
    </BottomNavigation>
  );
}