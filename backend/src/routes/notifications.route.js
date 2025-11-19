

const express = require('express');
const { fetch_notifications } = require('../controllers/notifications.controller');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();

router.route('/get-notifications').get(verify_token, fetch_notifications);

module.exports = router;