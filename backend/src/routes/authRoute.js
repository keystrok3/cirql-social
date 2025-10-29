
const express = require('express');
const { createUser, login, refresh_token, verifyToken, logout } = require('../controllers/authController');

const router = express.Router();


router.route('/register').post(createUser);

router.route('/login').post(login);

router.route('/logout').post(logout);

router.route('/refresh-token').post(refresh_token);

router.route('/verify-token').get(verifyToken);


module.exports = router;