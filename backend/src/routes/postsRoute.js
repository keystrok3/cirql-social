
const express = require('express');
const { create_post, fetch_posts_by_this_user, fetch_posts_by_other_user } = require('../controllers/postsController');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();

router.route('/create-post').post(verify_token, create_post);
router.route('/fetch-my-posts').get(verify_token, fetch_posts_by_this_user);
router.route('/fetch-other-posts/:username').get(verify_token, fetch_posts_by_other_user);

module.exports = router;