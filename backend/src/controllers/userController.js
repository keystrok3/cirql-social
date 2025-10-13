
const User = require('../models/user.js');


/**
 * Controller to allow users to upload profile photo
*/
const uploadProfilePhoto = async (req, res, next) => {
    try {
        const { username } = req.user;

        const imagePath = req.file ? req.file.path : null;

        const user = await User.findByPk(username);

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // delete old photo file before replacing
        if(user.image && imagePath && user.image !==  imagePath) {
            try {
                const fs = await import('fs');

                if(fs.existsSync(user.image)) {
                    fs.unlinkSync(user.image);
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

    } catch (error) {
        console.error('Error in uploadProfilePhoto:', error);
        return res.status(500).json({ message: 'Error updating profile photo' });
    }
};


/**
 * Controller to allow users to upload banner image
*/
const uploadBannerImage = async (req, res, next) => {
  try {
    const { username } = req.user; 
    const bannerPath = req.file ? req.file.path : null;

    const user = await User.findByPk(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
  } catch (error) {
    console.error('Error in uploadBannerImage:', error);
    return res.status(500).json({ message: 'Error updating banner image' });
  }
};


/**
 * Update username 
 * */ 
const updateProfile = async (req, res, next) => {
  const { screen_name, bio, first_name, last_name } = req.body;
  const { username } = req.user;

  try {
    const user = await User.findByPk(username);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only update fields that are not undefined or empty strings
    if (screen_name?.trim()) user.screen_name = screen_name.trim();
    if (first_name?.trim()) user.first_name = first_name.trim();
    if (last_name?.trim()) user.last_name = last_name.trim();
    if (bio?.trim()) user.bio = bio.trim();

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user, // optional: include updated user for frontend
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Unexpected error updating profile' });
  }
};




module.exports = { uploadProfilePhoto, uploadBannerImage, updateProfile };