const express = require('express');
const { syncUser, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/sync', syncUser);
router.put('/profile', auth, updateProfile);

module.exports = router;
