
const express = require('express');
const { verify_token } = require('../middleware/verify_token');
const { fetch_user_following, getFollowers, toggle_follow, check_user_follows, check_user_followed } = require('../controllers/followsController');

const router = express.Router();

router.route('/fetch-followees/:username').get(fetch_user_following);
router.route('/fetch-followers/:username').get(getFollowers);
router.route('/toggle-follow/:username').post(verify_token, toggle_follow);

router.route('/check-user-follows/:username').get(verify_token, check_user_follows);
router.route('/check-user-followed/:username').get(verify_token, check_user_followed);

module.exports = router;