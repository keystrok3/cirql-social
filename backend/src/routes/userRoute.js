
const express = require('express');
const upload = require('../middleware/upload');
const { verify_token } = require('../middleware/verify_token.js');

const { uploadProfilePhoto, uploadBannerImage, fetchProfile, updateProfile, fetch_bio_screenname } = require('../controllers/userController');
const { follow_user, unfollow_user, fetch_user_following, getFollowers, toggle_follow } = require('../controllers/followsController.js');

const router = express.Router();


router.route('/upload_profile_photo').patch(verify_token, upload.single('profile_photo'), uploadProfilePhoto);
router.route('/upload_banner_photo').patch(verify_token, upload.single('banner_image'), uploadBannerImage);
router.route('/fetch-bio-screenname').get(verify_token, fetch_bio_screenname);
router.route('/fetch_profile').get(verify_token, fetchProfile);
router.route('/update_profile').patch(verify_token, updateProfile);

router.route('/toggle-follow/:username').post(verify_token, toggle_follow);

module.exports = router;