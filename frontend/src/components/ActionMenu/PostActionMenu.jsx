
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { apiAuth } from '../../api/axios';

export default function PostActionsMenu({ post_id}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePostDropdown = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = async (e) => {
    try {
      const response = await apiAuth.delete(`/posts/delete-post/${post_id}`);
      
      console.log('Post deleted: ', response.data.message)
      alert(response.data.message);
    } catch (error) {
      console.log('Error deleting post: ', error);
    }
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
