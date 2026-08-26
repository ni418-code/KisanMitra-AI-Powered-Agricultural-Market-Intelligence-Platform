const Notification = require('../models/Notification');

async function getNotifications(req, res) {
  if (!req.userId) return res.status(401).json({ error: 'Authentication required.' });
  const query = { $or: [{ recipientRole: 'all' }, { recipientId: req.userId }] };
  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(100);
  res.json({ notifications });
}

async function markRead(req, res) {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.userId }, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ error: 'Notification not found.' });
  res.json({ notification });
}

async function markAllRead(req, res) {
  await Notification.updateMany({ recipientId: req.userId, isRead: false }, { $set: { isRead: true } });
  const notifications = await Notification.find({ $or: [{ recipientRole: 'all' }, { recipientId: req.userId }] }).sort({ createdAt: -1 }).limit(100);
  res.json({ notifications });
}

module.exports = { getNotifications, markRead, markAllRead };
