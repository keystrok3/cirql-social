
const express = require('express');
const { like_post, unlike_post, get_post_likes_count, has_user_liked_post } = require('../controllers/likesController');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();


router.route('/:post_id/like-post').post(verify_token, like_post);
router.route('/:post_id/unlike-post').post(verify_token, unlike_post);

router.route('/:post_id/likes/count').get(get_post_likes_count);
router.route('/:post_id/likes/check').get(verify_token, has_user_liked_post);


module.exports = router;