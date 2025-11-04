
const express = require('express');
const { create_comment, fetch_comment_count, fetch_post_comments } = require('../controllers/commentsController');
const { verify_token } = require('../middleware/verify_token');
const router = express.Router();


router.route('/:post_id/create-comment').post(verify_token, create_comment);

router.route('/:post_id/fetch-comment-count').get(fetch_comment_count);

router.route('/:post_id/fetch-post-comments').get(fetch_post_comments);

module.exports = router;