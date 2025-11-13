import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {

  const [ userSignUpDetails, setUserSignUpDetails ] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: ""
  });

  const [ loading, setLoading ] = useState(false);
  const [ successMessage, setSuccessMessage ] = useState("");
  const [ errors, setErrors ] = useState([]);

  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    let { name, value } = e.target;
    setUserSignUpDetails(prev => ({...prev, [name]: value}));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post('/api/auth/register/', { ...userSignUpDetails })

      if(response.status === 201 || response.status === 200) {
        console.log('User registered: ', response.data);

        setSuccessMessage("Registration successful");

        setTimeout(() => navigate('/home'), 3000);

      } else {
        console.warn('Unexpected response: ', response);
        setErrors(prev => [ ...prev, 'Unexpected Error']);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors(prev => [ ...prev, 'Registration Failed']);
    } finally {
      setLoading(false)
    }
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
            width: { xs: '95%', sm: '50%' },
            margin: '1em auto',
            padding: '1.5em',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: { xs: 'none', sm: '0 4px 12px rgba(0,0,0,0.15)' },
          }}
        >
          <Box marginBottom="0.5em">
            <Typography variant="h5">Create Account</Typography>
          </Box>

          {/* Display alerts */}
          { 
            errors.length > 0 ? 
            <Stack direction={'column'}>
              {errors.map((errmsg, idx) => {
                return <Alert severity='error' key={idx}>{errmsg}</Alert>
              })}
            </Stack> :
            successMessage !== "" ? 
            <Box>
              <Alert severity='success'>
                {successMessage}
              </Alert>
            </Box> :
            null
          }

          <Box component="form" margin=".5em 0" autoComplete='off'>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              gap={2}
              sx={{ m: '0.5em 0' }}
            >
              <TextField 
                placeholder="First Name" 
                sx={{ flex: 0.5 }} 
                name='first_name'
                value={userSignUpDetails.first_name}
                onChange={handleChangeInput}
              />
              <TextField 
                placeholder="Last Name" 
                sx={{ flex: 0.5 }} 
                name='last_name'
                value={userSignUpDetails.last_name}
                onChange={handleChangeInput}
              />
            </Stack>

            <Stack direction="column">
              <TextField 
                placeholder="Username" 
                sx={{ flex: 1.0, m: '.5em 0' }} 
                name='username'
                autoComplete='new-username'
                value={userSignUpDetails.username}
                onChange={handleChangeInput}
              />

              <TextField
                placeholder="Email"
                type="email"
                sx={{ flex: 1.0, m: '.5em 0' }}
                name='email'
                autoComplete='new-email'
                value={userSignUpDetails.email}
                onChange={handleChangeInput}
              />

              <TextField
                placeholder="Password"
                type="password"
                sx={{ flex: 1.0, m: '.5em 0' }}
                name='password'
                autoComplete='new-password'
                value={userSignUpDetails.password}
                onChange={handleChangeInput}
              />

              <Button
                variant="contained"
                size="large"
                type="submit" // Use type="submit" for form submission
                disabled={loading}
                sx={{ flex: 1.0, m: '.5em 0' }}
                onClick={handleSubmit}
              >
                { loading ? "Signing Up..." : "Sign Up" }
              </Button>
            </Stack>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
                Already have an account? 
                <Button 
                    variant="text" 
                    onClick={() => navigate('/login')} // Mock navigation
                    sx={{ 
                      textTransform: 'none', 
                      ml: 0.5,
                      fontWeight: 'bold',
                      color: '#ff6b6b'
                    }}
                >
                    Log In
                </Button>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
