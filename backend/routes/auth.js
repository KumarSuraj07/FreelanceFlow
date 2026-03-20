const express = require('express');
const { sendOtp, signup, login, forgotPassword, resetPassword, updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);

module.exports = router;