

const express = require('express');
const { fetch_notifications, mark_notifications_read } = require('../controllers/notifications.controller');
const { verify_token } = require('../middleware/verify_token');

const router = express.Router();

router.route('/get-notifications').get(verify_token, fetch_notifications);
router.route('/mark-notifications').post(verify_token, mark_notifications_read);

module.exports = router;