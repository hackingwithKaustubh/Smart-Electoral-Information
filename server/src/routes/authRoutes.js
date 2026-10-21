const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerValidators, authController.register);
router.post('/login', authController.loginValidators, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
