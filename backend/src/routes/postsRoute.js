
const express = require('express');
const { create_post, fetch_posts_by_this_user, fetch_posts_by_other_user, fetch_all_posts, delete_post } = require('../controllers/postsController');
const { verify_token } = require('../middleware/verify_token');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/create-post').post(upload.array('images', 4), verify_token, create_post);
router.route('/fetch-my-posts').get(fetch_posts_by_this_user);
router.route('/fetch-other-posts/:username').get(fetch_posts_by_other_user);
router.route('/fetch-all-posts').get(fetch_all_posts);
router.route('/delete-post/:post_id').delete(verify_token, delete_post);

module.exports = router;