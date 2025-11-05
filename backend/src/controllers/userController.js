const User = require('../models/user.js');

// 1. Import catchAsync and custom errors
const catchAsync = require('../utils/catchAsync'); 
const { NotFoundError } = require('../utils/errorResponse'); // Adjust path as needed


/**
 * Controller to allow users to upload profile photo
*/
const uploadProfilePhoto = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;

    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
    }

    // delete old photo file before replacing
    if(user.profile_photo && imagePath && user.profile_photo !==  imagePath) {
        try {
            const fs = await import('fs');

            if(fs.existsSync(user.profile_photo)) {
                fs.unlinkSync(user.profile_photo);
            }
        } catch (error) {
            console.warn("Failed to delete old image: ", error);
        }
    }

    if(imagePath) user.profile_photo = imagePath;

    await user.save();

    return res.status(200).json({
        message: "Profile photo updated successfully",
        user
    });
}); // Removed try...catch


/**
 * Controller to allow users to upload banner image
*/
const uploadBannerImage = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user; 
    const bannerPath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const user = await User.findByPk(username);

    if (!user) {
        throw new NotFoundError("User");
    }

    if (user.banner_image && bannerPath && user.banner_image !== bannerPath) {
        try {
            const fs = await import('fs');
            if (fs.existsSync(user.banner_image)) {
                fs.unlinkSync(user.banner_image);
            }
        } catch (err) {
            console.warn('Failed to delete old banner image:', err);
        }
    }

    if (bannerPath) user.banner_image = bannerPath;

    await user.save();

    return res.status(200).json({
        message: 'Banner image updated successfully',
        user,
    });
}); // Removed try...catch


/**
 * Update username 
 * */ 
const updateProfile = catchAsync(async (req, res, next) => { // Wrapped
    const { screen_name, bio, first_name, last_name } = req.body;
    const { username } = req.user;

    const user = await User.findByPk(username);

    if (!user) {
        throw new NotFoundError("User");
    }

    // Only update fields that are not undefined or empty strings
    if (screen_name?.trim()) user.screen_name = screen_name.trim();
    if (first_name?.trim()) user.first_name = first_name.trim();
    if (last_name?.trim()) user.last_name = last_name.trim();
    if (bio?.trim()) user.bio = bio.trim();

    await user.save();

    return res.status(200).json({
        message: 'Profile updated successfully',
        user,
    });
}); // Removed try...catch


/** Fetch user profile */ 
const fetchProfile = catchAsync(async (req, res, next) => { // Wrapped
  
    const { username } = req.user;

    const user = await User.findByPk(username);

    if(!user) {
        throw new NotFoundError("User");
    }
    
    return res.status(200).json({ 
        user: { 
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            bio: user.bio,
            profile_photo: user.profile_photo,
            banner_image: user.banner_image
        } 
    });
}); // Removed try...catch


const fetch_bio_screenname = catchAsync(async (req, res, next) => { // Wrapped
    const { username } = req.user;

    const user = await User.findByPk(username);
    
    if(!user) {
        throw new NotFoundError("User");
    }

    const { screen_name, bio } = user;

    return res.status(200).json({ screen_name: screen_name, bio: bio });
}); // Removed try...catch

module.exports = { 
  uploadProfilePhoto, 
  uploadBannerImage, 
  updateProfile, 
  fetchProfile, 
  fetch_bio_screenname 
};