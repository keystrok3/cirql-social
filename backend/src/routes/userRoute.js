
const express = require('express');
const upload = require('../middleware/upload');
const { uploadProfilePhoto, uploadBannerImage } = require('../controllers/userController');

const router = express.Router();


router.route('/upload_profile_photo').post(upload.single('image'), uploadProfilePhoto);
router.route('/upload_banner_photo').post(upload.single('image'), uploadBannerImage);


module.exports = router;