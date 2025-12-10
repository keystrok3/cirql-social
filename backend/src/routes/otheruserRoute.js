
const express = require('express');
const { fetchProfile, fetch_users_posts, fetch_users_liked_posts, fetch_users_reposts } = require('../controllers/other_user.controller');

const router = express.Router();


router.route('/get-other-profile/:username').get(fetchProfile);
router.route('/get-other-posts/:username').get(fetch_users_posts);
router.route('/get-other-likes/:username').get(fetch_users_liked_posts);
router.route('/get-other-reposts/:username').get(fetch_users_reposts);


module.exports = router;