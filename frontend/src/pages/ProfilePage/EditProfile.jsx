import { Avatar, Box, Button, Divider, IconButton, TextField } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { apiAuth } from '../../api/axios';

// API Endpoints
const PROFILE_UPDATE_URL = '/profile/update_profile/';
const PROFILE_PHOTO_UPLOAD_URL = '/profile/upload_profile_photo';
const BANNER_PHOTO_UPLOAD_URL = '/profile/upload_banner_photo';

const EditProfile = () => {
    
    const { fetch_profile, accessToken, userData } = useAuth();

    const [ loading, setLoading ] = useState(false);

    // Refs for hidden file inputs
    const bannerInputRef = useRef(null);
    const profileInputRef = useRef(null);



    // State for image files
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedProfilePic, setSelectedProfilePic] = useState(null);

    const [ profileDetails, setProfileDetails ] = useState({
        screen_name: "",
        bio: ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileDetails(prev => ({ ...prev, [name]: value }));
    }; 

    // Handle file selection from the hidden input
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'banner') {
            setSelectedBanner(file);
        } else if (type === 'profile') {
            setSelectedProfilePic(file);
        }
    };

    // New function to handle file uploads
    const uploadImage = async (file, url, fieldName) => {
        if (!file) return;

        const formData = new FormData();
        
        formData.append(fieldName, file); 

        try {
            // Changed from axios.post to axios.patch
            const response = await apiAuth.patch(url, formData);

            await fetch_profile();

            console.log(`${fieldName} upload successful:`, response.data);
            return true;
        } catch (error) {
            console.error(`Error uploading ${fieldName}: ${error}`);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Update text profile details first
        try {
            // Changed from axios.post to axios.patch
            const response = await apiAuth.patch(
                PROFILE_UPDATE_URL, 
                profileDetails, 
            );

            
            console.log('Profile details updated:', response.data);
        } catch (error) {
            console.error(`Error updating profile details: ${error}`);
        }

        // 2. Upload Profile Picture (if selected)
        if (selectedProfilePic) {
            console.log('Profile Pic', selectedProfilePic)
            await uploadImage(selectedProfilePic, PROFILE_PHOTO_UPLOAD_URL, 'profile_photo');
        }

        // 3. Upload Banner Photo (if selected)
        if (selectedBanner) {
            console.log('Profile Pic', selectedBanner)
            await uploadImage(selectedBanner, BANNER_PHOTO_UPLOAD_URL, 'banner_image');
        }

        // 4. Re-fetch the latest profile data to update UI
       await fetch_profile(); 
    };

    useEffect(() => {
        async function fetch_bio_screen_name() {
            try {
                const response = await apiAuth.get('/profile/fetch-bio-screenname/');

                if(!response.status === 200) {
                    console.error('Could not fetch bio and screen name: ', response.statusText);
                }

                setProfileDetails({ 
                    screen_name: response.data.screen_name, 
                    bio: response.data.bio
                });
            } catch (error) {
                console.error('Error fetching edit profile: ', error);
            }
        };

        fetch_bio_screen_name();
    }, []);


    return (
        <Box>
            {/* ------------------ Banner Image Section ------------------ */}
            <Box sx={{
                height: '100px',
                width: '100%',
                position: 'relative',
            }}>
                <Box 
                    component="img"
                    src={`/${userData.user.banner_image}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                
                {/* Banner Upload Button and Hidden Input */}
                <IconButton 
                    onClick={() => bannerInputRef.current.click()}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        color: 'white',
                    }}
                >
                    <PhotoCameraIcon />
                </IconButton>
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={bannerInputRef}
                    onChange={(e) => handleFileChange(e, 'banner')}
                />
            </Box>
            
            {/* ------------------ Profile Picture Section ------------------ */}
            <Box position={'relative'} >
                <Avatar 
                    src={`/${userData.user.profile_photo}`}
                    sx={{
                        position: 'absolute',
                        top: {xs: '-40px', sm: '-45px'},
                        left: '30px',
                        width: { xs: '50px', sm: '85px' },
                        height: { xs: '50px', sm: '85px' },
                        border: '3px solid #f5f5f5'
                    }}
                />
                
                {/* Profile Pic Upload Button and Hidden Input */}
                <IconButton 
                    onClick={() => profileInputRef.current.click()}
                    sx={{
                        position: 'absolute',
                        top: {xs: '-20px', sm: '-25px'},
                        left: {xs: '60px', sm: '100px'}, 
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        color: 'white',
                        width: { xs: '20px', sm: '30px' },
                        height: { xs: '20px', sm: '30px' },
                    }}
                >
                    <EditIcon sx={{ fontSize: { xs: 12, sm: 18 } }} />
                </IconButton>
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={profileInputRef}
                    onChange={(e) => handleFileChange(e, 'profile')}
                />
            </Box>
            
            {/* ------------------ Text Fields Section ------------------ */}
            <Box 
                component={'form'}
                display={'flex'}
                flexDirection={'column'}
                gap={2}
                padding={2}
                mt={2}
                onSubmit={handleSubmit}
            >
                <Divider />
                <TextField 
                    name='screen_name' 
                    label='Screen Name'
                    onChange={handleChange}
                    value={profileDetails?.screen_name}
                />
                <TextField 
                    name='bio' 
                    label='Bio'
                    onChange={handleChange}
                    value={profileDetails?.bio}
                    multiline
                    rows={4}
                />

                <Divider />

                <Button
                    type='submit' 
                    variant='contained'
                >Save Changes</Button>
            </Box>
        </Box>
    )
};

export default EditProfile;