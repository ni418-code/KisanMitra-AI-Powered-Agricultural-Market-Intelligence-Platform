const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtpAndLogin, register, loginWithPassword, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndLogin);
router.post('/register', register);
router.post('/login-password', loginWithPassword);
router.get('/me', requireAuth, me);

module.exports = router;
