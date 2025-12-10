
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { apiAuth } from '../../api/axios';
import { useData } from '../../context/DataProvider';

export default function PostActionsMenu({ post_id }) {
  const { deletePost } = useData();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePostDropdown = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = async () => {
    await deletePost(post_id);
  };



  return (
    <>
      <IconButton
        onClick={handlePostDropdown}
        sx={{ marginLeft: 'auto' }}
      >
        <MoreHoriz />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Share</MenuItem>
      </Menu>
    </>
  );
}
