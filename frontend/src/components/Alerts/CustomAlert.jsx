
import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function CustomAlert({ message, isError }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false); 
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <Alert
      severity={isError ? 'error' : 'success'}
      // This action button closes it manually
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      // This handles user interaction, which should stop the timer
      onClose={handleClose} 
    >
      {message}
    </Alert>
  );
};

export default CustomAlert;