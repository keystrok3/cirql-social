
const express = require('express');
const { make_repost, undo_repost, check_user_repost, get_repost_count, toggle_repost } = require('../controllers/repostsController');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();

router.route('/:post_id/toggle-repost').post(verify_token, toggle_repost);

router.route('/:post_id/check-repost-status').get(verify_token, check_user_repost);
router.route('/:post_id/get-repost-count').get(get_repost_count);

module.exports = router;