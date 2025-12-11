
const express = require('express');
const { fetch_user_following, getFollowers } = require('../controllers/followsController');

const router = express.Router();

router.route('/fetch-followees/:username').get(fetch_user_following);
router.route('/fetch-followers/:username').get(getFollowers);

module.exports = router;