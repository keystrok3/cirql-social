
const express = require('express');
const { create_comment, fetch_comment_count } = require('../controllers/commentsController');

const router = express.Router();


router.route('/:post_id/create-comment').post(create_comment);

router.route('/:post_id/fetch-comment-count').get(fetch_comment_count);

module.exports = router;