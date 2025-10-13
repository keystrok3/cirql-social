import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import axios from 'axios';

const LoginPage = () => {

  const [ userLoginDetails, setUserLoginDetails ] = useState({
    email: "",
    password: ""
  });

  const { login, loading, errors, successMessage } = useAuth();

  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    let { name, value } = e.target;
    setUserLoginDetails(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(userLoginDetails); 
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: '0.5em 0'}}>
      <Container>
        <Box>
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontFamily: "'Satisfy', cursive",
              textAlign: {xs: 'center', sm: 'inherit'},
              margin: '.5em'
            }}
          >
            Cirql Social
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          sx={{
            width: { xs: '95%', sm: '50%' }, // Slightly narrower for a login form
            maxWidth: '450px', // Max width for desktop
            margin: '2em auto',
            padding: '2em',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* 3. Updated title */}
          <Box marginBottom="1em">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Log In to Cirql</Typography>
          </Box>

          {/* Display alerts */}
          { 
            errors.length > 0 ? 
            <Stack direction={'column'} spacing={1} mb={2}>
              {errors.map((errmsg, idx) => {
                return <Alert severity='error' key={idx} sx={{ borderRadius: '8px' }}>{errmsg}</Alert>
              })}
            </Stack> :
            successMessage !== "" ? 
            <Box mb={2}>
              <Alert severity='success' sx={{ borderRadius: '8px' }}>
                {successMessage}
              </Alert>
            </Box> :
            null
          }

          <Box component="form" margin=".5em 0" autoComplete='off' onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2}>
              {/* Email field */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                name='email'
                autoComplete='current-email'
                value={userLoginDetails.email}
                onChange={handleChangeInput}
                variant="outlined"
                required
              />

              {/* Password field */}
              <TextField
                fullWidth
                label="Password"
                type="password"
                name='password'
                autoComplete='current-password'
                value={userLoginDetails.password}
                onChange={handleChangeInput}
                variant="outlined"
                required
              />

              {/* Login Button */}
              <Button
                variant="contained"
                size="large"
                type="submit" // Use type="submit" for form submission
                disabled={loading}
                sx={{ 
                    mt: 1, 
                    py: 1.5, 
                    fontWeight: 'bold',
                    borderRadius: '8px'
                }}
              >
                { loading ? "Logging In..." : "Log In" }
              </Button>
            </Stack>
          </Box>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
                Don't have an account? 
                <Button 
                    variant="text" 
                    onClick={() => navigate('/register')} // Mock navigation
                    sx={{ 
                        textTransform: 'none', 
                        ml: 0.5,
                        fontWeight: 'bold',
                        color: '#ff6b6b'
                     }}
                >
                    Sign Up
                </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
