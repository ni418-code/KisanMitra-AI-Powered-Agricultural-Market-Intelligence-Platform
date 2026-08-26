const express = require('express');
const router = express.Router();
const { register, loginWithPassword, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login-password', loginWithPassword);
router.get('/me', requireAuth, me);

module.exports = router;
