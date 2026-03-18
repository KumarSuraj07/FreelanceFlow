const express = require('express');
const { signup, login, updateProfile, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);

module.exports = router;