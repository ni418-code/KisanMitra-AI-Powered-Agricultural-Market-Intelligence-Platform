const Notification = require('../models/Notification');

// GET /api/notifications?role=farmer&userId=...
async function getNotifications(req, res) {
  const { role, userId } = req.query;
  const query = {
    $or: [{ recipientRole: 'all' }, { recipientRole: role }, ...(userId ? [{ recipientId: userId }] : [])],
  };
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
  res.json({ notifications });
}

async function markRead(req, res) {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ error: 'Notification not found.' });
  res.json({ notification });
}

module.exports = { getNotifications, markRead };
