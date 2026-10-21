const express = require('express');
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.put('/me', protect, userController.updateMeValidators, userController.updateMe);
router.put('/password', protect, userController.passwordValidators, userController.updatePassword);

module.exports = router;
