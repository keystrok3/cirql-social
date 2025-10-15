import { 
    Box,
    Avatar, 
    Button, 
    Container, 
    Stack, 
    Typography, 
    useMediaQuery, 
    useTheme, 
    IconButton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import EditModal from './EditModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useEffect } from 'react';

const Profilepage = () => {
    const { userData } = useAuth();
    const [ modalOpen, setModalOpen ] = useState(false);
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const handleModalOpen = () => {
        setModalOpen(prev => !prev);
    };

    return (
        <Box>
            <Box sx={{
                height: '200px',
                width: '100%',
                position: 'relative', // Added to position the back button over the banner
            }}>
                <Box 
                    component="img"
                    src={`http://localhost:8000/${userData?.user?.banner_image}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                
                {/* -------------------- BACK ICON BUTTON -------------------- */}
                <IconButton
                    onClick={() => navigate(-1)} // Navigate to the previous page in history
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.4)', // Slightly dark background for visibility
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                        }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                {/* ----------------------------------------------------------- */}
                
            </Box>
            
            <EditModal openModal={modalOpen} onModal={handleModalOpen}/>
            <Container>
                <Box 
                    display='flex' 
                    flexDirection='row' 
                    mt={'.75em'} 
                    justifyContent={'space-between'}
                    alignItems={'center'} 
                >
                    <Box position={'relative'} >
                        <Avatar 
                            src={`http://localhost:8000/${userData?.user?.profile_photo}`}
                            sx={{
                                position: 'absolute',
                                top: {xs: '-80px', sm: '-110px'},
                                width: { xs: '100px', sm: '150px' },
                                height: { xs: '100px', sm: '150px' },
                                border: '3px solid #f5f5f5'
                            }}
                        />
                    </Box>
                    <Box>
                        <Button variant='contained' onClick={() => {
                            if(isMobile) {
                                navigate('/edit-profile');
                            } else {
                                handleModalOpen()
                            }
                        }}>
                            Edit Profile
                        </Button>
                    </Box>
                </Box>

                <Box sx={{
                    marginTop: { xs: '1.5em', sm: '2.5em'}
                }}>
                    <Stack gap={0.5}>
                        <Typography variant='h5' component='h1'>Josiah Walutsachi</Typography>
                        <Typography color='#6b6b6bff' variant='body2'>@Josiah</Typography>
                        <Typography color='#6b6b6bff' variant='body1'>Mathematician, Coder, Writer</Typography>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Profilepage;