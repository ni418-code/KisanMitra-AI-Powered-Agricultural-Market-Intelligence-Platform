const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');

router.get('/', requireAuth, getNotifications);
router.put('/:id/read', requireAuth, markRead);
router.put('/read-all', requireAuth, markAllRead);

module.exports = router;
