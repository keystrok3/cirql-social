
const express = require('express');
const { get_post_likes_count, has_user_liked_post, toggle_like_post } = require('../controllers/likesController');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();


router.route('/:post_id/toggle-like').post(verify_token, toggle_like_post)

router.route('/:post_id/likes/count').get(get_post_likes_count);
router.route('/:post_id/likes/check').get(verify_token, has_user_liked_post);


module.exports = router;