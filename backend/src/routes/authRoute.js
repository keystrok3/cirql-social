
const express = require('express');
const { createUser, login, refresh_token } = require('../controllers/authController');

const router = express.Router();


router.route('/register').post(createUser);

router.route('/login').post(login);

router.route('/refresh-token').post(refresh_token);


module.exports = router;